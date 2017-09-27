package nl.knaw.huygens.timbuctoo.v5.graphql.datafetchers.berkeleydb.datafetchers;

import nl.knaw.huygens.timbuctoo.v5.datastores.quadstore.dto.Direction;
import nl.knaw.huygens.timbuctoo.v5.datastores.quadstore.QuadStore;
import nl.knaw.huygens.timbuctoo.v5.graphql.datafetchers.dto.TypedValue;
import nl.knaw.huygens.timbuctoo.v5.datastores.quadstore.dto.CursorQuad;

public class TypedLiteralDataFetcher extends WalkTriplesDataFetcher<TypedValue> {

  public TypedLiteralDataFetcher(String predicate, QuadStore tripleStore) {
    super(predicate, Direction.OUT, tripleStore);
  }

  @Override
  protected TypedValue makeItem(CursorQuad triple) {
    if (triple.getValuetype().isPresent()) {
      return TypedValue.create(triple.getObject(), triple.getValuetype().get());
    } else {
      throw new IllegalStateException("Source is not a triple referencing a value");
    }
  }
}