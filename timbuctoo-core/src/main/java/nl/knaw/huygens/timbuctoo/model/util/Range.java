package nl.knaw.huygens.timbuctoo.model.util;

public interface Range {
  Object getUpperLimit();

  Object getLowerLimit();

  boolean isValid();
}
