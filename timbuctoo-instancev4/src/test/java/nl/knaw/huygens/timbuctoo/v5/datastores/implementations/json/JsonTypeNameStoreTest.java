package nl.knaw.huygens.timbuctoo.v5.datastores.implementations.json;

import nl.knaw.huygens.timbuctoo.v5.dataset.DataProvider;
import nl.knaw.huygens.timbuctoo.v5.dataset.EntityProcessor;
import nl.knaw.huygens.timbuctoo.v5.dataset.RdfProcessor;
import nl.knaw.huygens.timbuctoo.v5.dataset.exceptions.RdfProcessingFailedException;
import org.junit.Test;

import java.io.File;
import java.io.IOException;

public class JsonTypeNameStoreTest {

  @Test
  public void test() throws IOException {
    File tempFile = File.createTempFile("JsonTypeNameStoreTest", "json");
    tempFile.delete();
    JsonTypeNameStore store = new JsonTypeNameStore(
      tempFile,
      new DataProvider() {
        @Override
        public void subscribeToRdf(RdfProcessor processor, String cursor) {
          try {
            processor.setPrefix("1", "_", "http://example.com/underscore#");
            processor.setPrefix("2", "foo", "http://example.com/foo#");
          } catch (RdfProcessingFailedException e) {
            throw new RuntimeException(e);
          }
        }

        @Override
        public void subscribeToEntities(EntityProcessor processor, String cursor) {

        }
      }
    );
    String graphQlname = store.makeGraphQlname("http://example.com/underscore#test");
    if (graphQlname == null) {
      throw new RuntimeException();
    }
  }

}
