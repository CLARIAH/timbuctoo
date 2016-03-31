package nl.knaw.huygens.timbuctoo.search.description.facet;

import nl.knaw.huygens.timbuctoo.search.FacetValue;
import nl.knaw.huygens.timbuctoo.search.description.FacetDescription;
import nl.knaw.huygens.timbuctoo.search.description.PropertyParser;
import nl.knaw.huygens.timbuctoo.search.description.facet.helpers.ListFacetGetter;
import nl.knaw.huygens.timbuctoo.search.description.facet.helpers.RelatedPropertyValueGetter;
import nl.knaw.huygens.timbuctoo.server.mediatypes.v2.search.ListFacetValue;
import org.apache.tinkerpop.gremlin.process.traversal.P;
import org.apache.tinkerpop.gremlin.process.traversal.dsl.graph.GraphTraversal;
import org.apache.tinkerpop.gremlin.process.traversal.dsl.graph.__;
import org.apache.tinkerpop.gremlin.structure.Vertex;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

/**
 * A facet description that creates a "LIST" facet with properties from connected vertices.
 */
public class RelatedListFacetDescription implements FacetDescription {
  private final String facetName;
  private final String propertyName;
  private final PropertyParser parser;
  private final String[] relations;
  private final FacetGetter facetGetter;

  public RelatedListFacetDescription(String facetName, String propertyName, PropertyParser parser,
                                     String... relations) {
    this.facetName = facetName;
    this.propertyName = propertyName;
    this.parser = parser;
    this.relations = relations;
    this.facetGetter = new ListFacetGetter(parser);
  }

  @Override
  public void filter(GraphTraversal<Vertex, Vertex> graphTraversal, List<FacetValue> facets) {
    Optional<FacetValue> value = facets.stream()
            .filter(facetValue -> Objects.equals(facetValue.getName(), facetName))
            .findFirst();

    if (value.isPresent()) {
      FacetValue facetValue = value.get();
      if (facetValue instanceof ListFacetValue) {
        List<String> values = ((ListFacetValue) facetValue).getValues();
        if (!values.isEmpty()) {
          graphTraversal.where(__.bothE(relations).otherV().has(propertyName, P.test((o1, o2) -> {
            List<String> possibleValues = (List<String>) o2;
            return possibleValues.contains(parser.parse("" + o1));
          }, values)));
        }
      }
    }
  }

  @Override
  public String getName() {
    return facetName;
  }

  @Override
  public Facet getFacet(Map<String, Set<Vertex>> values) {
    return facetGetter.getFacet(facetName, values);
  }

  @Override
  public List<String> getValues(Vertex vertex) {
    return RelatedPropertyValueGetter.getValues(vertex, propertyName, relations);
  }
}
