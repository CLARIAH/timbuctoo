package nl.knaw.huygens.timbuctoo.v5.logprocessing;

import javax.ws.rs.core.MediaType;
import java.io.InputStream;
import java.net.URI;
import java.nio.charset.Charset;
import java.util.Optional;
import java.util.concurrent.Future;

public class DataSet {
  public Future<?> addLog(URI uri, InputStream rdfInputStream, Optional<Charset> charset,
                          Optional<MediaType> mediaType) {
    throw new UnsupportedOperationException("Method not implemented");
  }
}
