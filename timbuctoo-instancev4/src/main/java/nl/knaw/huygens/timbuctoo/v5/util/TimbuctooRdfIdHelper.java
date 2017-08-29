package nl.knaw.huygens.timbuctoo.v5.util;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

public class TimbuctooRdfIdHelper {
  private final String baseUri;

  @JsonCreator
  public TimbuctooRdfIdHelper(@JsonProperty("rdfBaseUri") String baseUri) {
    this.baseUri = baseUri.replaceAll("/$", ""); // remove possible last slash
  }

  private static String encode(String input) {
    try {
      return URLEncoder.encode(input, "UTF-8");
    } catch (UnsupportedEncodingException e) {
      //will never happen
      throw new RuntimeException(e);
    }
  }

  public String rawEntity(String ownerId, String dataSet, String fileName, int entityId) {
    return baseUri + "/rawData/" + encode(ownerId) + "/" + encode(dataSet) + "/" + encode(fileName) + "/" + entityId;
  }

  public String rawFile(String ownerId, String dataSet, String fileName) {
    return baseUri + "/rawData/" + encode(ownerId) + "/" + encode(dataSet) + "/" + encode(fileName) + "/";
  }

  public String rawCollection(String ownerId, String dataSetId, String fileName, int collectionId) {
    return baseUri + "/collections/" + encode(ownerId) + "/" + encode(dataSetId) + "/" + encode(fileName) + "/" +
      collectionId;
  }

  public String propertyDescription(String ownerId, String dataSetId, String fileName, String propertyName) {
    return baseUri + "/props/" + encode(ownerId) + "/" + encode(dataSetId) + "/" + encode(fileName) + "/" +
      encode(propertyName);
  }

  public String dataSet(String ownerId, String dataSetId) {
    return baseUri + "/datasets/" + encode(ownerId) + "/" + encode(dataSetId);
  }
}
