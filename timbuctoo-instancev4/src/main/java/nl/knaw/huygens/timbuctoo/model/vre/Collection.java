package nl.knaw.huygens.timbuctoo.model.vre;

import nl.knaw.huygens.timbuctoo.model.properties.TimbuctooProperty;
import org.apache.tinkerpop.gremlin.process.traversal.dsl.graph.GraphTraversal;
import org.apache.tinkerpop.gremlin.structure.Vertex;

import javax.validation.constraints.NotNull;
import java.util.Map;

public class Collection {
  private final String entityTypeName;
  private final String collectionName;
  private final Vre vre;
  private final String abstractType;
  private final TimbuctooProperty displayName;
  private final Map<String, TimbuctooProperty> properties;
  private final Map<String, TimbuctooProperty> searchResultData;
  private final Map<String, GraphTraversal<Object, Vertex>> derivedRelations;

  Collection(@NotNull String entityTypeName, @NotNull String abstractType,
             @NotNull TimbuctooProperty displayName, @NotNull Map<String, TimbuctooProperty> properties,
             @NotNull Map<String, TimbuctooProperty> searchResultData, @NotNull String collectionName,
             @NotNull Vre vre, @NotNull Map<String, GraphTraversal<Object, Vertex>> derivedRelations
  ) {
    this.entityTypeName = entityTypeName;
    this.abstractType = abstractType;
    this.displayName = displayName;
    this.properties = properties;
    this.searchResultData = searchResultData;
    this.collectionName = collectionName;
    this.vre = vre;
    this.derivedRelations = derivedRelations;
  }

  public String getEntityTypeName() {
    return entityTypeName;
  }

  public String getAbstractType() {
    return abstractType;
  }

  public TimbuctooProperty getDisplayName() {
    return displayName;
  }

  public Map<String, TimbuctooProperty> getProperties() {
    return properties;
  }

  public Map<String, TimbuctooProperty> getSearchResultData() {
    return searchResultData;
  }

  public String getCollectionName() {
    return collectionName;
  }

  public Vre getVre() {
    return vre;
  }

  public Map<String, GraphTraversal<Object, Vertex>> getDerivedRelations() {
    return derivedRelations;
  }
  //derivedRelations
}
