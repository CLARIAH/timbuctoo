package nl.knaw.huygens.timbuctoo.v5.bdbdatafetchers.dto;

import nl.knaw.huygens.timbuctoo.v5.dataset.Direction;
import org.immutables.value.Value;

import java.util.Optional;

@Value.Immutable
public interface CursorQuad extends CursorContainer {
  String getSubject();

  String getPredicate();

  String getObject();

  Optional<String> getValuetype();

  Optional<String> getLanguage();

  Direction getDirection();

  @Value.Auxiliary
  String getCursor();

  static CursorQuad create(String subject, String predicate, Direction direction,String object, String valueType,
                           String language, String cursor) {
    return ImmutableCursorQuad.builder()
      .subject(subject)
      .predicate(predicate)
      .object(object)
      .valuetype(Optional.ofNullable(valueType))
      .language(Optional.ofNullable(language))
      .cursor(cursor)
      .direction(direction)
      .build();
  }


}
