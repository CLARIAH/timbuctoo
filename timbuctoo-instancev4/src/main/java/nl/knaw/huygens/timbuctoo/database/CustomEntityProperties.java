package nl.knaw.huygens.timbuctoo.database;

import nl.knaw.huygens.timbuctoo.database.dto.ReadEntityImpl;
import org.apache.tinkerpop.gremlin.structure.Vertex;

public interface CustomEntityProperties {
  void execute(ReadEntityImpl entity, Vertex entityVertex);
}
