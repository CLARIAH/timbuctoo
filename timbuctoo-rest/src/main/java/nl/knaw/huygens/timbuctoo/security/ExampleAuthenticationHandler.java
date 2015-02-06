package nl.knaw.huygens.timbuctoo.security;

/*
 * #%L
 * Timbuctoo REST api
 * =======
 * Copyright (C) 2012 - 2015 Huygens ING
 * =======
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the 
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public 
 * License along with this program.  If not, see
 * <http://www.gnu.org/licenses/gpl-3.0.html>.
 * #L%
 */

import java.security.Principal;
import java.util.EnumSet;

import nl.knaw.huygens.security.client.AuthenticationHandler;
import nl.knaw.huygens.security.client.UnauthorizedException;
import nl.knaw.huygens.security.client.model.HuygensSecurityInformation;
import nl.knaw.huygens.security.client.model.SecurityInformation;
import nl.knaw.huygens.security.core.model.Affiliation;

/**
 * @deprecated Use local login instead. 
 */
@Deprecated
public class ExampleAuthenticationHandler implements AuthenticationHandler {

  @Override
  public SecurityInformation getSecurityInformation(String sessionId) throws UnauthorizedException {

    if ("admin".equals(sessionId)) {
      return createAdmin();
    } else if ("user".equals(sessionId)) {
      return createUser();
    }

    throw new UnauthorizedException();
  }

  private SecurityInformation createUser() {
    HuygensSecurityInformation securityInformation = new HuygensSecurityInformation();
    securityInformation.setAffiliations(EnumSet.of(Affiliation.employee));
    securityInformation.setCommonName("U Ser");
    securityInformation.setDisplayName("U Ser");
    securityInformation.setEmailAddress("user@example.com");
    securityInformation.setGivenName("U");
    securityInformation.setSurname("Ser");
    securityInformation.setOrganization("example inc.");
    securityInformation.setPersistentID("User");
    securityInformation.setPrincipal(new Principal() {

      @Override
      public String getName() {
        return "U Ser";
      }
    });

    return securityInformation;
  }

  private SecurityInformation createAdmin() {
    HuygensSecurityInformation securityInformation = new HuygensSecurityInformation();
    securityInformation.setAffiliations(EnumSet.of(Affiliation.employee));
    securityInformation.setCommonName("Ad Min");
    securityInformation.setDisplayName("Ad Min");
    securityInformation.setEmailAddress("admin@example.com");
    securityInformation.setGivenName("Ad");
    securityInformation.setSurname("Min");
    securityInformation.setOrganization("example inc.");
    securityInformation.setPersistentID("Admin");
    securityInformation.setPrincipal(new Principal() {

      @Override
      public String getName() {
        return "Ad Min";
      }
    });

    return securityInformation;

  }

}
