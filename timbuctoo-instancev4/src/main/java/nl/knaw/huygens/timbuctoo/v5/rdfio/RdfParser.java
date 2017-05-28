package nl.knaw.huygens.timbuctoo.v5.rdfio;

import nl.knaw.huygens.timbuctoo.v5.filestorage.dto.CachedLog;
import nl.knaw.huygens.timbuctoo.v5.dataset.RdfProcessor;
import nl.knaw.huygens.timbuctoo.v5.dataset.exceptions.RdfProcessingFailedException;

public interface RdfParser {
  void importRdf(String cursorPrefix, String startFrom, CachedLog input, RdfProcessor rdfProcessor)
      throws RdfProcessingFailedException;
}
