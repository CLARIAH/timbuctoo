package nl.knaw.huygens.timbuctoo.server;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonUnwrapped;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.kjetland.dropwizard.activemq.ActiveMQConfig;
import com.kjetland.dropwizard.activemq.ActiveMQConfigHolder;
import io.dropwizard.Configuration;
import io.dropwizard.client.HttpClientConfiguration;
import io.dropwizard.logging.DefaultLoggingFactory;
import io.dropwizard.logging.LoggingFactory;
import io.dropwizard.metrics.MetricsFactory;
import io.dropwizard.server.DefaultServerFactory;
import io.dropwizard.server.ServerFactory;
import nl.knaw.huygens.timbuctoo.database.tinkerpop.TinkerPopConfig;
import nl.knaw.huygens.timbuctoo.handle.PersistenceManagerFactory;
import nl.knaw.huygens.timbuctoo.security.SecurityFactory;
import nl.knaw.huygens.timbuctoo.security.dataaccess.AccessNotPossibleException;
import nl.knaw.huygens.timbuctoo.solr.WebhookFactory;
import nl.knaw.huygens.timbuctoo.util.Timeout;
import nl.knaw.huygens.timbuctoo.util.TimeoutFactory;
import nl.knaw.huygens.timbuctoo.v5.archetypes.dto.Archetypes;
import nl.knaw.huygens.timbuctoo.v5.bdb.BdbDatabaseFactory;
import nl.knaw.huygens.timbuctoo.v5.bdbdatafetchers.stores.BdbDataStoreFactory;
import nl.knaw.huygens.timbuctoo.v5.dataset.DataSetConfiguration;
import nl.knaw.huygens.timbuctoo.v5.dataset.DataSetFactory;
import nl.knaw.huygens.timbuctoo.v5.datastores.exceptions.DataStoreCreationException;
import nl.knaw.huygens.timbuctoo.v5.util.TimbuctooRdfIdHelper;
import org.immutables.value.Value;
import nl.knaw.huygens.timbuctoo.v5.datastores.resourcesync.ResourceSync;

import javax.validation.Valid;
import javax.ws.rs.DefaultValue;
import java.io.IOException;
import java.net.URI;
import java.util.Optional;
import java.util.concurrent.ExecutorService;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/*
 *TODO: add good default environment for Timbuctoo
 *  - example logins
 *  - example users
 *  - example authorization
 *  - example database
 */
@Value.Immutable
@JsonDeserialize(as = ImmutableTimbuctooConfiguration.class)
@JsonSerialize(as = ImmutableTimbuctooConfiguration.class)
public abstract class TimbuctooConfiguration extends Configuration implements ActiveMQConfigHolder, SearchConfig {
  private ExecutorService dataSetExecutorService;

  @JsonProperty("rdfUriHelper")
  public abstract TimbuctooRdfIdHelper getRdfIdHelper();

  @JsonIgnore
  public void setDataSetExecutorService(ExecutorService dataSetExecutorService) {
    this.dataSetExecutorService = dataSetExecutorService;
  }

  @Valid
  public abstract SecurityFactory getSecurityConfiguration();

  @Valid
  @Value.Default
  public WebhookFactory getWebhooks() {
    return new WebhookFactory();
  }

  @Valid
  public abstract TinkerPopConfig getDatabaseConfiguration();

  @Valid
  @Override
  @JsonProperty("activeMq")
  public abstract ActiveMQConfig getActiveMQ();

  @JsonProperty("searchResultAvailabilityTimeout")
  public abstract TimeoutFactory getSearchResultAvailabilityTimeoutFactory();

  @JsonProperty("httpClient")
  @Valid
  @Value.Default
  public HttpClientConfiguration getHttpClientConfiguration() {
    return new HttpClientConfiguration();
  }

  @Valid
  @JsonProperty("baseUri")
  public abstract UriHelper getUriHelper();

  @DefaultValue("true")
  @JsonProperty("allowGremlinEndpoint")
  public abstract boolean isAllowGremlinEndpoint();

  @Valid
  @JsonProperty("persistenceManager")
  public abstract PersistenceManagerFactory getPersistenceManagerFactory();

  @Valid
  @JsonUnwrapped
  public abstract Archetypes getArchetypes();

  public abstract Optional<URI> getUserRedirectUrl();

  @Valid
  public abstract BdbDatabaseFactory getDatabases();

  @JsonProperty("dataSet")
  @Valid
  public abstract DataSetConfiguration getDataSetConfiguration();

  @JsonIgnore
  public DataSetFactory getDataSet() throws DataStoreCreationException {
    try {
      return new DataSetFactory(
        dataSetExecutorService,
        getSecurityConfiguration().getVreAuthorizationCreator(),
        getDataSetConfiguration(),
        new BdbDataStoreFactory(getDatabases())
      );
    } catch (IOException | AccessNotPossibleException e) {
      throw new DataStoreCreationException(e);
    }
  }

  @JsonIgnore
  public Optional<String> getLocalAmqJmxPath(String queueName) {
    if (getActiveMQ() != null) {
      if (getActiveMQ().brokerUrl != null) {
        //this only generates a metrics path when the amq brokerurl is a simple vm-local url
        //A path for remote connections makes no sense because then this JVM can't get at the JMX data directly anyway.
        //A path for the advanced url format might make sense, but I don't understand that format or its use.
        Matcher matcher = Pattern.compile("^vm://([^?]*)").matcher(getActiveMQ().brokerUrl);
        if (matcher.find()) {
          String brokerName = matcher.group(1);
          return Optional.of(String.format(
            //That's a pretty querystring! Did you knwo that you can make your own using https://github.com/cjmx/cjmx?
            "org.apache.activemq:type=Broker,brokerName=%s,destinationType=Queue,destinationName=%s",
            brokerName,
            queueName
          ));
        }
      }
    }
    return Optional.empty();
  }

  @JsonIgnore
  @Override
  public Timeout getSearchResultAvailabilityTimeout() {
    return getSearchResultAvailabilityTimeoutFactory().createTimeout();
  }

  //DROPWIZARD DEFAULT PROPERTIES:
  //Required to make immutables generate json-deserializers for the default properties
  @Override
  @JsonProperty("server")
  @Value.Default
  public ServerFactory getServerFactory() {
    return new DefaultServerFactory();
  }

  @Override
  @JsonProperty("logging")
  @Value.Default
  public LoggingFactory getLoggingFactory() {
    return new DefaultLoggingFactory();
  }

  @Override
  @JsonProperty("metrics")
  @Value.Default
  public MetricsFactory getMetricsFactory() {
    return new MetricsFactory();
  }
  
  public ResourceSync getResourceSync() {
    return getDataSetConfiguration().getResourceSync();
  }
  
  

}
