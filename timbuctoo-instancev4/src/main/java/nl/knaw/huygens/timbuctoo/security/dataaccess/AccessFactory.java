package nl.knaw.huygens.timbuctoo.security.dataaccess;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import nl.knaw.huygens.timbuctoo.util.Tuple;

import java.util.Iterator;
import java.util.Optional;
import java.util.function.Supplier;

@JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, include = JsonTypeInfo.As.PROPERTY, property = "@class")
public interface AccessFactory {
  LoginAccess getLoginAccess() throws AccessNotPossibleException;

  UserAccess getUserAccess() throws AccessNotPossibleException;

  VreAuthorizationAccess getVreAuthorizationAccess() throws AccessNotPossibleException;

  Iterator<Tuple<String, Supplier<Optional<String>>>> getHealthChecks();
}
