package nl.knaw.huygens.timbuctoo.experimental.databaselog;

import org.apache.tinkerpop.gremlin.structure.Vertex;
import org.apache.tinkerpop.gremlin.structure.VertexProperty;

public class DatabaseLog {
  public void newVertex(Vertex vertex) {
    throw new UnsupportedOperationException("Not implemented yet");
  }

  public void updateVertex(Vertex vertex) {
    throw new UnsupportedOperationException("Not implemented yet");
  }

  public void newProperty(VertexProperty property) {
    throw new UnsupportedOperationException("Not implemented yet");
  }

  public void updateProperty(VertexProperty property) {
    throw new UnsupportedOperationException("Not implemented yet");
  }

  public void deleteProperty(String propertyName) {
    throw new UnsupportedOperationException("Not implemented yet");
  }
}
