package nl.knaw.huygens.timbuctoo.v5.dataset;

import nl.knaw.huygens.timbuctoo.v5.dataset.exceptions.RdfProcessingFailedException;

public class DummyDataProvider implements DataProvider {

  private RdfProcessor processor;

  @Override
  public void subscribeToRdf(RdfProcessor processor, String cursor) {
    this.processor = processor;
  }

  @Override
  public void subscribeToEntities(EntityProcessor processor, String cursor) { }

  public void onQuad(String subject, String predicate, String object,
                     String dataType, String language, String graph) throws RdfProcessingFailedException {
    onQuad(true, "", subject, predicate, object, dataType, language, graph);
  }

  public void onQuad(boolean isAssertion, String cursor, String subject, String predicate, String object,
                     String dataType, String language, String graph) throws RdfProcessingFailedException {
    processor.onQuad(isAssertion, cursor, subject, predicate, object, dataType, language, graph);
  }

  public void start() throws RdfProcessingFailedException {
    processor.start();
  }

  public void finish() throws RdfProcessingFailedException {
    processor.finish();
  }
}
