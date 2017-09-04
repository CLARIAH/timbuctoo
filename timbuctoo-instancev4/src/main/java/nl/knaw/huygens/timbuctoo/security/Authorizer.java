package nl.knaw.huygens.timbuctoo.security;

import nl.knaw.huygens.timbuctoo.security.dto.Authorization;
import nl.knaw.huygens.timbuctoo.security.exceptions.AuthorizationUnavailableException;

public interface Authorizer {

  Authorization authorizationFor(String vreId, String userId) throws AuthorizationUnavailableException;
}
