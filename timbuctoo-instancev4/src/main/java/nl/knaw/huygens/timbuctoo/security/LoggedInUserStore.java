package nl.knaw.huygens.timbuctoo.security;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import nl.knaw.huygens.security.client.AuthenticationHandler;
import nl.knaw.huygens.security.client.UnauthorizedException;
import nl.knaw.huygens.security.client.model.SecurityInformation;
import nl.knaw.huygens.timbuctoo.util.Timeout;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

/**
 * Will determine if a user's credentials are valid and return a token.
 * Will be able to return the user belonging to a token.
 * <p/>
 * <p>Needs: An object from which to retrieve valid users, an object to store logged in users</p>
 */
public class LoggedInUserStore {

  private final Authenticator authenticator;
  private final UserStore userStore;
  private final AuthenticationHandler authenticationHandler;
  private final Cache<String, User> users;

  public LoggedInUserStore(Authenticator authenticator, UserStore userStore,
                           Timeout inactivityTimeout, AuthenticationHandler authenticationHandler) {
    this.authenticator = authenticator;
    this.userStore = userStore;
    this.authenticationHandler = authenticationHandler;
    this.users = createCache(inactivityTimeout);
  }

  private static Cache<String, User> createCache(Timeout timeout) {
    return CacheBuilder.newBuilder().expireAfterAccess(timeout.duration, timeout.timeUnit).build();
  }

  public Optional<User> userFor(String authHeader) {
    if (authHeader == null) {
      return Optional.empty();
    } else {
      User local = users.getIfPresent(authHeader);
      if (local != null) {
        return Optional.of(local);
      } else {
        try {
          SecurityInformation securityInformation = authenticationHandler.getSecurityInformation(authHeader);

          //get the one that was saved to the file
          Optional<User> userFromFile = userStore.userFor(securityInformation.getPersistentID());
          if (userFromFile.isPresent()) {
            users.put(authHeader, userFromFile.get());
            return userFromFile;
          } else {
            User nw = userStore.saveNew(securityInformation.getDisplayName(), securityInformation.getPersistentID());

            users.put(authHeader, nw);
            return Optional.of(nw);
          }
        } catch (IOException | UnauthorizedException | AuthenticationUnavailableException e) {
          return Optional.empty();
        }
      }
    }
  }

  public Optional<String> userTokenFor(String username, String password)
    throws LocalLoginUnavailableException, AuthenticationUnavailableException {
    Optional<String> id;
    Optional<String> token = Optional.empty();

    id = authenticator.authenticate(username, password);

    if (id.isPresent()) {
      Optional<User> user = userStore.userFor(id.get());
      if (user.isPresent()) {
        String uuid = UUID.randomUUID().toString();
        token = Optional.of(uuid);
        users.put(uuid, user.get());
      }
    }
    return token;
  }
}
