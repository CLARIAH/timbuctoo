/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
package nl.knaw.huygens.security.apis;

import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.HttpHeaders;

import nl.knaw.huygens.security.client.UnauthorizedException;
import nl.knaw.huygens.security.client.model.HuygensSecurityInformation;
import nl.knaw.huygens.security.client.model.SecurityInformation;

import org.apache.commons.codec.binary.Base64;
import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.surfnet.oaaas.auth.ObjectMapperProvider;
import org.surfnet.oaaas.model.TokenResponseCache;
import org.surfnet.oaaas.model.TokenResponseCacheImpl;
import org.surfnet.oaaas.model.VerifyTokenResponse;

import com.google.common.base.Preconditions;
import com.google.inject.Inject;
import com.google.inject.name.Named;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;
import com.sun.jersey.spi.container.ContainerRequest;

/**
 * This class uses the functionality of the AuthorizationServerFilter of the 'apis resource server library'.
 * All the functionality is copy-pasted except for the CORS-code. This code should be added a javax.servlet.Filter and not in a ResourceFilter.
 *  
 * @author martijnm
 */
public class ApisAuthorizationHandler {

  private static final Logger LOG = LoggerFactory.getLogger(ApisAuthorizationHandler.class);
  private static final String BEARER = "bearer";

  private String resourceServerKey;
  private String resourceServerSecret;
  private String authorizationServerUrl;
  private String authorizationValue;

  private boolean cacheEnabled;

  private Client client;
  private ObjectMapper objectMapper;

  private TokenResponseCache cache;

  @Inject
  public ApisAuthorizationHandler(@Named("security.apis.key") String resourceServerKey, @Named("security.apis.secret") String resourceServerSecret,
      @Named("security.apis.server") String authorizationServerUrl, @Named("security.apis.cache") boolean cacheEnabled) {
    this.resourceServerKey = resourceServerKey;
    this.resourceServerSecret = resourceServerSecret;
    this.authorizationServerUrl = authorizationServerUrl;
    this.cacheEnabled = cacheEnabled;

    Preconditions.checkArgument(resourceServerKey != null && !resourceServerKey.isEmpty(), "Must provide a resource server key");
    Preconditions.checkArgument(resourceServerSecret != null && !resourceServerSecret.isEmpty(), "Must provide a resource server secret");
    Preconditions.checkArgument(authorizationServerUrl != null && !authorizationServerUrl.isEmpty(), "Must provide a authorization server url");

    if (this.cacheEnabled) {
      this.cache = this.buildCache();
      Preconditions.checkNotNull(this.cache, "Cache may not be null.");
    }

    this.authorizationValue = new String(Base64.encodeBase64(resourceServerKey.concat(":").concat(resourceServerSecret).getBytes()));

    this.client = createClient();
    this.objectMapper = createObjectMapper();
  }

  public SecurityInformation getSecurityInformation(ContainerRequest request) throws UnauthorizedException {
    final String accessToken = getAccessToken(request);
    HuygensSecurityInformation securityInformation = null;
    if (accessToken != null) {
      VerifyTokenResponse verifyTokenResponse = getVerifyTokenResponse(accessToken);
      if (isValidResponse(verifyTokenResponse)) {
        securityInformation = new HuygensSecurityInformation();

        securityInformation.setDisplayName(verifyTokenResponse.getPrincipal().getAttributes().get("DISPLAY_NAME"));
        securityInformation.setPrincipal(verifyTokenResponse.getPrincipal());

        return securityInformation;
      }
    }

    throw new UnauthorizedException();
  }

  protected TokenResponseCache buildCache() {
    return new TokenResponseCacheImpl(1000, 60 * 5);
  }

  protected ObjectMapper createObjectMapper() {
    return new ObjectMapperProvider().getContext(ObjectMapper.class);
  }

  /**
   * @return Client
   */
  protected Client createClient() {
    ClientConfig cc = new DefaultClientConfig();
    cc.getClasses().add(ObjectMapperProvider.class);
    return Client.create(cc);
  }

  private String getAccessToken(ContainerRequest request) {
    String accessToken = null;
    String header = request.getHeaderValue(HttpHeaders.AUTHORIZATION);
    if (header != null) {
      int space = header.indexOf(' ');
      if (space > 0) {
        String method = header.substring(0, space);
        if (BEARER.equalsIgnoreCase(method)) {
          accessToken = header.substring(space + 1);
        }
      }
    }
    return accessToken;
  }

  protected VerifyTokenResponse getVerifyTokenResponse(String accessToken) {
    VerifyTokenResponse verifyTokenResponse = null;
    if (cacheAccessTokens()) {
      verifyTokenResponse = cache.getVerifyToken(accessToken);
      if (verifyTokenResponse != null) {
        return verifyTokenResponse;
      }
    }
    if (verifyTokenResponse == null) {
      ClientResponse res = client.resource(String.format("%s?access_token=%s", authorizationServerUrl, accessToken)).header(HttpHeaders.AUTHORIZATION, "Basic " + authorizationValue)
          .accept("application/json").get(ClientResponse.class);
      try {
        String responseString = res.getEntity(String.class);
        LOG.debug("response: ", responseString);
        int statusCode = res.getClientResponseStatus().getStatusCode();
        LOG.debug("Got verify token response (status: {}): '{}'", statusCode, responseString);
        if (statusCode == HttpServletResponse.SC_OK) {
          verifyTokenResponse = objectMapper.readValue(responseString, VerifyTokenResponse.class);
        }
      } catch (Exception e) {
        LOG.error("Exception in reading result from AuthorizationServer", e);
        // anti-pattern, but null case is explicitly handled
      }
    }

    if (isValidResponse(verifyTokenResponse) && cacheAccessTokens()) {
      cache.storeVerifyToken(accessToken, verifyTokenResponse);
    }
    return verifyTokenResponse;
  }

  protected boolean cacheAccessTokens() {
    return cacheEnabled;
  }

  private boolean isValidResponse(VerifyTokenResponse tokenResponse) {
    return tokenResponse != null && tokenResponse.getPrincipal() != null && tokenResponse.getError() == null;
  }

}