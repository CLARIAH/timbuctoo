package nl.knaw.huygens.timbuctoo.v5.elasticsearch;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import nl.knaw.huygens.timbuctoo.v5.graphql.collectionfilter.Facet;
import nl.knaw.huygens.timbuctoo.v5.graphql.collectionfilter.FilterResult;

import java.util.ArrayList;
import java.util.List;

public class EsFilterResult implements FilterResult {

  public final String idField;

  private final JsonNode queryNode;
  private final JsonNode resultNode;

  public EsFilterResult(JsonNode queryNode, JsonNode resultNode) {
    this(queryNode, resultNode, "uri");
  }

  public EsFilterResult(JsonNode queryNode, JsonNode resultNode, String idField) {
    this.queryNode = queryNode;
    this.resultNode = resultNode;
    this.idField = idField;
  }


  String getQuery() {
    return queryNode.toString();
  }

  String getResult() {
    return resultNode.toString();
  }

  int getSearchTime() {
    return resultNode.findPath("took").asInt();
  }

  @Override
  public List<String> getUriList() {
    return resultNode.findPath("hits").findPath("hits").findValuesAsText(idField);
  }

  @Override
  public String getNextToken() {
    String token = null;
    List<JsonNode> sortNodes = resultNode.findValues("sort");
    if (!sortNodes.isEmpty()) {
      token = sortNodes.get(sortNodes.size() - 1).toString();
    }
    return token;
  }

  @Override
  public int getTotal() {
    return resultNode.findPath("hits").findPath("total").asInt();
  }


  public void findFacets(Facet facet, ObjectNode data) {
    if (data.has("buckets") && data.get("buckets").isArray()) {
      final JsonNode buckets = data.get("buckets");
      for (JsonNode bucket: buckets) {
        facet.incOption(bucket.get("key").asText(), bucket.get("doc_count").asInt());
      }
    } else {
      for (JsonNode datum : data) {
        if (datum.isObject()) {
          findFacets(facet, (ObjectNode) datum);
        }
      }
    }
  }

  @Override
  public List<Facet> getFacets() {
    final ArrayList<Facet> result = new ArrayList<>();
    final JsonNode aggregations = resultNode.get("aggregations");
    if (aggregations != null && !aggregations.isNull()) {
      for (String key: (Iterable<String>) aggregations::fieldNames) {
        JsonNode aggregation = aggregations.get(key);
        if (aggregation.isObject()) {
          Facet facet = new Facet(key);
          result.add(facet);
          findFacets(facet, (ObjectNode) aggregation);
        }
      }
    }
    return result;
  }
}