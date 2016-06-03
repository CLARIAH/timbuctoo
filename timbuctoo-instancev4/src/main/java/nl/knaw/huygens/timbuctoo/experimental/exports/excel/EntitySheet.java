package nl.knaw.huygens.timbuctoo.experimental.exports.excel;


import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.common.collect.Sets;
import nl.knaw.huygens.timbuctoo.experimental.exports.excel.description.EdgeExcelDescription;
import nl.knaw.huygens.timbuctoo.experimental.exports.excel.description.ExcelDescription;
import nl.knaw.huygens.timbuctoo.model.properties.LocalProperty;
import nl.knaw.huygens.timbuctoo.model.vre.Collection;
import nl.knaw.huygens.timbuctoo.model.vre.Vres;
import nl.knaw.huygens.timbuctoo.server.GraphWrapper;
import nl.knaw.huygens.timbuctoo.util.Tuple;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.streaming.SXSSFRow;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.tinkerpop.gremlin.process.traversal.dsl.graph.GraphTraversal;
import org.apache.tinkerpop.gremlin.process.traversal.dsl.graph.__;
import org.apache.tinkerpop.gremlin.structure.Direction;
import org.apache.tinkerpop.gremlin.structure.Edge;
import org.apache.tinkerpop.gremlin.structure.Vertex;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

public class EntitySheet {

  private final SXSSFSheet sheet;
  private final GraphWrapper graphWrapper;
  private final Vres mappings;
  private final String type;
  private final String vreId;

  private Set<String> loadedIds = Sets.newHashSet();

  public EntitySheet(Collection collection, SXSSFWorkbook workbook, GraphWrapper graphWrapper, Vres vres) {
    this.sheet = workbook.createSheet(collection.getCollectionName());
    this.type = collection.getEntityTypeName();
    this.graphWrapper = graphWrapper;
    this.mappings = vres;
    this.vreId = collection.getVre().getVreName();

  }

  public void renderToSheet(Set<Vertex> vertices) {
    // 1) read the mappings to get the properties to export
    Map<String, LocalProperty> mapping = mappings.getCollectionForType(type).get().getWriteableProperties();
    GraphTraversal<Vertex, Vertex> entities = graphWrapper.getGraph().traversal().V(vertices);
    Map<String, PropertyColDescription> propertyColDescriptions = Maps.newHashMap();

    // 2) Load the data cell information
    List<Tuple<String, Map<String, ExcelDescription>>> dataCellDescriptions =
      getDataCells(mapping, entities, propertyColDescriptions);

    // 3) Set dimensions of the sheet and fill the header rows
    loadHeadersAndDimensions(propertyColDescriptions);


    // 4) Load the cell data into the sheet
    loadSheetData(propertyColDescriptions, dataCellDescriptions);
  }

  private void loadSheetData(Map<String, PropertyColDescription> propertyColDescriptions,
                             List<Tuple<String, Map<String, ExcelDescription>>> dataCellDescriptions) {

    final AtomicInteger currentRow = new AtomicInteger(3);
    dataCellDescriptions.forEach(dataCellDescription -> {

      final String timId = dataCellDescription.getLeft();

      if (loadedIds.contains(timId)) {
        return;
      }

      final Map<String, ExcelDescription> excelDescriptions = dataCellDescription.getRight();

      // Determine the amount of rows needed for this entity
      int reservedRows = 0;
      for (Map.Entry<String, ExcelDescription> entry : excelDescriptions.entrySet()) {
        reservedRows = entry.getValue().getRows() > reservedRows ? entry.getValue().getRows() : reservedRows;
      }

      // Add reserved rows to the sheet for this entity
      List<SXSSFRow> sheetRows = Lists.newArrayList();
      for (int row = currentRow.get(); row < currentRow.get() + reservedRows; row++) {
        sheetRows.add(sheet.createRow(row));
      }

      // Fill the cells for this entity
      for (Map.Entry<String, ExcelDescription> entry : excelDescriptions.entrySet()) {

        // The left offset column for this property
        int offsetCol = propertyColDescriptions.get(entry.getKey()).offset;

        // Loop through the cell data and fill the sheet with the cells
        ExcelDescription excelDescription = entry.getValue();
        for (int row = 0; row < excelDescription.getRows(); row++) {
          for (int col = 0; col < excelDescription.getCols(); col++) {
            sheetRows.get(row).createCell(col + offsetCol).setCellValue(excelDescription.getCells()[row][col]);
          }
        }
      }

      // Set the identity cell and in case of multiple rows, merge it.
      sheetRows.get(0).createCell(0).setCellValue(timId);
      if (reservedRows > 1) {
        sheet.addMergedRegion(new CellRangeAddress(currentRow.get(), currentRow.get() + reservedRows - 1, 0, 0));
      }

      // Increment the current row by the number of reserved rows for this entity
      currentRow.getAndAdd(reservedRows);

      loadedIds.add(timId);
    });
  }

  private void loadHeadersAndDimensions(Map<String, PropertyColDescription> propertyColDescriptions) {
    // set column headers and determine column offset per property name
    SXSSFRow propertyNameRow = sheet.createRow(0);
    SXSSFRow propertyTypeRow = sheet.createRow(1);
    SXSSFRow propertyMetadataRow = sheet.createRow(2);

    propertyNameRow.createCell(0).setCellValue("tim_id");
    propertyTypeRow.createCell(0).setCellValue("uuid");

    int currentStartCol = 1;
    for (Map.Entry<String, PropertyColDescription> entry : propertyColDescriptions.entrySet()) {

      // Get the property-col-description value
      PropertyColDescription pcdValue = entry.getValue();

      // Set the propertyName cell
      propertyNameRow.createCell(currentStartCol).setCellValue(entry.getKey());

      // Set the propertyType cell
      propertyTypeRow.createCell(currentStartCol).setCellValue(pcdValue.propertyType);


      if (pcdValue.amountOfCols > 1) {

        // Merge headers that belong to the same property Name
        sheet.addMergedRegion(new CellRangeAddress(0, 0, currentStartCol, currentStartCol + pcdValue.amountOfCols - 1));
        sheet.addMergedRegion(new CellRangeAddress(1, 1, currentStartCol, currentStartCol + pcdValue.amountOfCols - 1));

        // Set the property metadata cells
        for (int col = currentStartCol, i = 0;
             col < currentStartCol + pcdValue.amountOfCols;
             col += pcdValue.valueWidth, i++) {

          propertyMetadataRow.createCell(col).setCellValue(pcdValue.valueDescriptions.get(i));
          // Merge cells that belong to the same value
          if (pcdValue.valueWidth > 1) {
            sheet.addMergedRegion(new CellRangeAddress(2, 2, col, col + pcdValue.valueWidth - 1));
          }
        }
      } else if (pcdValue.valueDescriptions.size() > 0) {
        // If there is only one column, but still a value description for it, add it to the header
        propertyMetadataRow.createCell(currentStartCol).setCellValue(pcdValue.valueDescriptions.get(0));
      }

      // Determine the offset of the property col description
      pcdValue.offset = currentStartCol;

      // Increment current start col with the amount of cols
      currentStartCol += pcdValue.amountOfCols;
    }
  }


  private void addPropertyColDescription(ExcelDescription excelDescription,
                                         Map<String, PropertyColDescription> propertyColDescriptions,
                                         Map.Entry<String, ?> prop) {

    // The property-col description for the current cell
    final PropertyColDescription currentPropColDesc = new PropertyColDescription(excelDescription.getCols(),
      excelDescription.getType(), excelDescription.getValueWidth(), excelDescription.getValueDescriptions());

    // The latest proprety-col description for this property name
    final PropertyColDescription lastPropColDesc = propertyColDescriptions.containsKey(prop.getKey()) ?
      propertyColDescriptions.get(prop.getKey()) : null;

    // Add to / replace in the map of property-col descriptions is the amount of cols of current is greater
    if (lastPropColDesc == null || currentPropColDesc.amountOfCols > lastPropColDesc.amountOfCols) {
      propertyColDescriptions.put(prop.getKey(), currentPropColDesc);
    }
  }


  private List<Tuple<String, Map<String, ExcelDescription>>> getDataCells(Map<String, LocalProperty> mapping,
                                                                            GraphTraversal<Vertex, Vertex> entities,
                                                                            Map<String, PropertyColDescription>
                                                                              propertyColDescriptions) {

    return entities.map(entityT -> {
      // Map containing excel info for properties
      Map<String, ExcelDescription> excelDescriptions = Maps.newHashMap();

      // Traversals to fill the excelDescriptions
      List<GraphTraversal> propertyGetters = mapping
        .entrySet().stream()
        .map(prop -> prop.getValue().getExcelDescription().sideEffect(x -> {

          // Determine the property value which leads to the greatest amount cols for this property name
          ExcelDescription excelDescription = x.get().get();

          // Add this description as PropertyColDescription metadata if this is the widest set of cells,
          // or if not yet present in the map of PropertyColDescription
          addPropertyColDescription(excelDescription, propertyColDescriptions, prop);

          excelDescriptions.put(prop.getKey(), excelDescription);
        })).collect(Collectors.toList());

      // Add EdgeExcelDescriptions.
      propertyGetters.add(__.<Vertex>sideEffect(x -> {
        // Map of edges per type (to arrange the cols correctly)
        Map<String, List<Edge>> edgeMap = Maps.newHashMap();
        x.get().edges(Direction.OUT).forEachRemaining(edge -> {
          // Initialize new set if this edge type is not yet in the map and retrieve the set of edges
          // for this edge type
          List<Edge> edges = edgeMap.containsKey(edge.label()) ? edgeMap.get(edge.label()) : Lists.newArrayList();
          if (!edgeMap.containsKey(edge.label())) {
            edgeMap.put(edge.label(), edges);
          }
          // Add this edge to the current set
          edges.add(edge);
        });

        // Add propertyColDescription and excelDescription like above
        for (Map.Entry<String, List<Edge>> entry : edgeMap.entrySet()) {
          // Make one ExcelDescription for all the edges of this type
          ExcelDescription edgeDescription = new EdgeExcelDescription(entry.getValue(), mappings , vreId);
          // Add columnmetadata for edges of this type
          addPropertyColDescription(edgeDescription, propertyColDescriptions, entry);
          // Add this excelDescription to the excelDescriptions
          excelDescriptions.put(entry.getKey(), edgeDescription);
        }
      }));


      graphWrapper.getGraph().traversal().V(entityT.get().id())
        .union(propertyGetters.toArray(new GraphTraversal[propertyGetters.size()])).forEachRemaining(x -> {
          // side effects
        });

      return new Tuple<>((String) entityT.get().value("tim_id"), excelDescriptions);
    }).toList();
  }


  private static class PropertyColDescription {
    final int amountOfCols;
    final String propertyType;
    final int valueWidth;
    final List<String> valueDescriptions;
    int offset;

    PropertyColDescription(int amountOfCols, String propertyType, int valueWidth, List<String> valueDescriptions) {
      this.amountOfCols = amountOfCols;
      this.propertyType = propertyType;
      this.valueWidth = valueWidth;
      this.valueDescriptions = valueDescriptions;
    }
  }
}
