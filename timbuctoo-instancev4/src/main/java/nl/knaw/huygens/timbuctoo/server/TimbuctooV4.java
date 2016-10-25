package nl.knaw.huygens.timbuctoo.server;

import com.codahale.metrics.JmxAttributeGauge;
import com.codahale.metrics.health.HealthCheck;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.kjetland.dropwizard.activemq.ActiveMQBundle;
import io.dropwizard.Application;
import io.dropwizard.assets.AssetsBundle;
import io.dropwizard.configuration.EnvironmentVariableSubstitutor;
import io.dropwizard.configuration.SubstitutingSourceProvider;
import io.dropwizard.forms.MultiPartBundle;
import io.dropwizard.java8.Java8Bundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import nl.knaw.huygens.persistence.PersistenceManager;
import nl.knaw.huygens.security.client.AuthenticationHandler;
import nl.knaw.huygens.timbuctoo.bulkupload.BulkUploadService;
import nl.knaw.huygens.timbuctoo.crud.CrudServiceFactory;
import nl.knaw.huygens.timbuctoo.crud.HandleAdder;
import nl.knaw.huygens.timbuctoo.crud.Neo4jLuceneEntityFetcher;
import nl.knaw.huygens.timbuctoo.crud.UrlGenerator;
import nl.knaw.huygens.timbuctoo.database.TransactionEnforcer;
import nl.knaw.huygens.timbuctoo.database.TransactionFilter;
import nl.knaw.huygens.timbuctoo.database.changelistener.AddLabelChangeListener;
import nl.knaw.huygens.timbuctoo.database.changelistener.CollectionHasEntityRelationChangeListener;
import nl.knaw.huygens.timbuctoo.database.changelistener.CompositeChangeListener;
import nl.knaw.huygens.timbuctoo.database.changelistener.DenormalizedSortFieldUpdater;
import nl.knaw.huygens.timbuctoo.database.changelistener.FulltextIndexChangeListener;
import nl.knaw.huygens.timbuctoo.experimental.womenwriters.WomenWritersEntityGet;
import nl.knaw.huygens.timbuctoo.logging.LoggingFilter;
import nl.knaw.huygens.timbuctoo.logging.Logmarkers;
import nl.knaw.huygens.timbuctoo.model.properties.JsonMetadata;
import nl.knaw.huygens.timbuctoo.model.vre.Vres;
import nl.knaw.huygens.timbuctoo.model.vre.vres.DatabaseConfiguredVres;
import nl.knaw.huygens.timbuctoo.rml.jena.JenaBasedReader;
import nl.knaw.huygens.timbuctoo.search.AutocompleteService;
import nl.knaw.huygens.timbuctoo.search.FacetValue;
import nl.knaw.huygens.timbuctoo.search.description.indexes.IndexDescriptionFactory;
import nl.knaw.huygens.timbuctoo.security.JsonBasedAuthenticator;
import nl.knaw.huygens.timbuctoo.security.JsonBasedAuthorizer;
import nl.knaw.huygens.timbuctoo.security.JsonBasedUserStore;
import nl.knaw.huygens.timbuctoo.security.LoggedInUserStore;
import nl.knaw.huygens.timbuctoo.server.databasemigration.DatabaseMigration;
import nl.knaw.huygens.timbuctoo.server.databasemigration.ScaffoldMigrator;
import nl.knaw.huygens.timbuctoo.server.endpoints.RootEndpoint;
import nl.knaw.huygens.timbuctoo.server.endpoints.legacy.LegacyApiRedirects;
import nl.knaw.huygens.timbuctoo.server.endpoints.v2.Authenticate;
import nl.knaw.huygens.timbuctoo.server.endpoints.v2.Graph;
import nl.knaw.huygens.timbuctoo.server.endpoints.v2.Gremlin;
import nl.knaw.huygens.timbuctoo.server.endpoints.v2.ImportRdf;
import nl.knaw.huygens.timbuctoo.server.endpoints.v2.JsEnv;
import nl.knaw.huygens.timbuctoo.server.endpoints.v2.Metadata;
import nl.knaw.huygens.timbuctoo.server.endpoints.v2.RelationTypes;
import nl.knaw.huygens.timbuctoo.server.endpoints.v2.Search;
import nl.knaw.huygens.timbuctoo.server.endpoints.v2.bulkupload.BulkUpload;
import nl.knaw.huygens.timbuctoo.server.endpoints.v2.bulkupload.BulkUploadVre;
import nl.knaw.huygens.timbuctoo.server.endpoints.v2.bulkupload.DataSourceFactory;
import nl.knaw.huygens.timbuctoo.server.endpoints.v2.bulkupload.ExecuteRml;
import nl.knaw.huygens.timbuctoo.server.endpoints.v2.bulkupload.RawCollection;
import nl.knaw.huygens.timbuctoo.server.endpoints.v2.domain.Autocomplete;
import nl.knaw.huygens.timbuctoo.server.endpoints.v2.domain.Index;
import nl.knaw.huygens.timbuctoo.server.endpoints.v2.domain.SingleEntity;
import nl.knaw.huygens.timbuctoo.server.endpoints.v2.system.users.Me;
import nl.knaw.huygens.timbuctoo.server.endpoints.v2.system.users.MyVres;
import nl.knaw.huygens.timbuctoo.server.healthchecks.DatabaseHealthCheck;
import nl.knaw.huygens.timbuctoo.server.healthchecks.DatabaseValidator;
import nl.knaw.huygens.timbuctoo.server.healthchecks.EncryptionAlgorithmHealthCheck;
import nl.knaw.huygens.timbuctoo.server.healthchecks.FileHealthCheck;
import nl.knaw.huygens.timbuctoo.server.healthchecks.ValidationResult;
import nl.knaw.huygens.timbuctoo.server.healthchecks.databasechecks.FullTextIndexCheck;
import nl.knaw.huygens.timbuctoo.server.healthchecks.databasechecks.InvariantsCheck;
import nl.knaw.huygens.timbuctoo.server.healthchecks.databasechecks.LabelsAddedToVertexDatabaseCheck;
import nl.knaw.huygens.timbuctoo.server.healthchecks.databasechecks.SortIndexesDatabaseCheck;
import nl.knaw.huygens.timbuctoo.server.mediatypes.v2.search.FacetValueDeserializer;
import nl.knaw.huygens.timbuctoo.server.security.LocalUserCreator;
import nl.knaw.huygens.timbuctoo.server.security.UserPermissionChecker;
import nl.knaw.huygens.timbuctoo.server.tasks.DatabaseValidationTask;
import nl.knaw.huygens.timbuctoo.server.tasks.DbLogCreatorTask;
import nl.knaw.huygens.timbuctoo.server.tasks.UserCreationTask;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.management.ObjectName;
import java.net.URI;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Clock;
import java.util.LinkedHashMap;
import java.util.Properties;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.ScheduledExecutorService;

import static com.codahale.metrics.MetricRegistry.name;
import static nl.knaw.huygens.timbuctoo.util.LambdaExceptionUtil.rethrowConsumer;

public class TimbuctooV4 extends Application<TimbuctooConfiguration> {

  public static final String ENCRYPTION_ALGORITHM = "SHA-256";
  public static final String HANDLE_QUEUE = "pids";
  private static final Logger LOG = LoggerFactory.getLogger(TimbuctooV4.class);
  private ActiveMQBundle activeMqBundle;

  public static void main(String[] args) throws Exception {
    new TimbuctooV4().run(args);
  }

  @Override
  public void initialize(Bootstrap<TimbuctooConfiguration> bootstrap) {
    //bundles
    activeMqBundle = new ActiveMQBundle();
    bootstrap.addBundle(activeMqBundle);
    bootstrap.addBundle(new Java8Bundle());
    bootstrap.addBundle(new MultiPartBundle());
    bootstrap.addBundle(new AssetsBundle("/static", "/static", "index.html"));
    /*
     * Make it possible to use environment variables in the config.
     * see: http://www.dropwizard.io/0.9.1/docs/manual/core.html#environment-variables
     */
    bootstrap.setConfigurationSourceProvider(
      new SubstitutingSourceProvider(
        bootstrap.getConfigurationSourceProvider(),
        new EnvironmentVariableSubstitutor(false)));
  }

  @Override
  public void run(TimbuctooConfiguration configuration, Environment environment) throws Exception {
    //Make sure we know what version is running
    Properties properties = new Properties();
    properties.load(getClass().getClassLoader().getResourceAsStream("git.properties"));
    String currentVersion = properties.getProperty("git.commit.id");

    LoggerFactory.getLogger(this.getClass()).info("Now launching timbuctoo version: " + currentVersion);

    // Support services
    final AuthenticationHandler authHandler = configuration.getFederatedAuthentication().makeHandler(environment);
    final Path loginsPath = Paths.get(configuration.getLoginsFilePath());
    final Path usersPath = Paths.get(configuration.getUsersFilePath());
    final LoginFileMigration loginFileMigration = new LoginFileMigration();

    // Convert login file
    if (!loginFileMigration.isConverted(loginsPath)) {
      LOG.info("Migrating logins file to use byte[] for password property");
      loginFileMigration.convert(loginsPath);
    }

    JsonBasedUserStore userStore = new JsonBasedUserStore(usersPath);
    JsonBasedAuthenticator authenticator = new JsonBasedAuthenticator(loginsPath, ENCRYPTION_ALGORITHM);
    final LoggedInUserStore loggedInUserStore = new LoggedInUserStore(
      authenticator,
      userStore,
      configuration.getAutoLogoutTimeout(),
      authHandler
    );


    // Database migrations
    LinkedHashMap<String, DatabaseMigration> migrations = new LinkedHashMap<>();

    final UriHelper uriHelper = new UriHelper(configuration.getBaseUri());

    final TinkerpopGraphManager graphManager = new TinkerpopGraphManager(configuration, migrations);
    final PersistenceManager persistenceManager = configuration.getPersistenceManagerFactory().build();
    UrlGenerator handleUri = (coll, id, rev) -> uriHelper.fromResourceUri(SingleEntity.makeUrl(coll, id, rev));
    final HandleAdder handleAdder = new HandleAdder(
      activeMqBundle,
      HANDLE_QUEUE,
      graphManager,
      persistenceManager,
      handleUri);
    final CompositeChangeListener changeListeners = new CompositeChangeListener(
      new DenormalizedSortFieldUpdater(new IndexDescriptionFactory()),
      new AddLabelChangeListener(),
      new FulltextIndexChangeListener(graphManager.getGraphDatabase(), new IndexDescriptionFactory()),
      new CollectionHasEntityRelationChangeListener(graphManager)
    );
    JsonBasedAuthorizer authorizer = new JsonBasedAuthorizer(configuration.getAuthorizationsPath());

    UrlGenerator pathWithoutVersionAndRevision =
      (coll, id, rev) -> URI.create(SingleEntity.makeUrl(coll, id, null).toString().replaceFirst("^/v2.1/", ""));
    UrlGenerator uriWithoutRev = (coll, id, rev) -> uriHelper.fromResourceUri(SingleEntity.makeUrl(coll, id, null));

    final Neo4jLuceneEntityFetcher entityFetcher = new Neo4jLuceneEntityFetcher(graphManager);
    TransactionEnforcer
      transactionEnforcer = new TransactionEnforcer(graphManager, entityFetcher, changeListeners, handleAdder);
    graphManager.onGraph(g -> new ScaffoldMigrator(transactionEnforcer).execute());

    final Vres vres = new DatabaseConfiguredVres(transactionEnforcer);

    final JsonMetadata jsonMetadata = new JsonMetadata(vres, graphManager);
    final AutocompleteService autocompleteService = new AutocompleteService(
      graphManager,
      uriWithoutRev,
      vres
    );


    environment.lifecycle().manage(graphManager);
    // database validator
    final BackgroundRunner<ValidationResult> databaseValidationRunner = setUpDatabaseValidator(
      configuration,
      environment,
      vres,
      graphManager, // graphWaiter
      graphManager // graphManager
    );

    final CrudServiceFactory crudServiceFactory = new CrudServiceFactory(
      authorizer,
      transactionEnforcer,
      Clock.systemDefaultZone(),
      handleAdder,
      vres,
      userStore,
      pathWithoutVersionAndRevision
    );

    // register REST endpoints
    register(environment, new RootEndpoint());
    register(environment, new JsEnv(configuration));
    register(environment, new Authenticate(loggedInUserStore));
    register(environment, new Me(loggedInUserStore));
    register(environment, new Search(configuration, graphManager));
    register(environment, new Autocomplete(autocompleteService));
    register(environment, new Index(loggedInUserStore, crudServiceFactory));
    register(environment, new SingleEntity(loggedInUserStore, crudServiceFactory));
    register(environment, new WomenWritersEntityGet(crudServiceFactory));
    register(environment, new LegacyApiRedirects(uriHelper));

    if (configuration.isAllowGremlinEndpoint()) {
      register(environment, new Gremlin(graphManager, vres));
    }
    register(environment, new Graph(graphManager, vres));
    // Bulk upload
    UserPermissionChecker permissionChecker = new UserPermissionChecker(loggedInUserStore, authorizer);
    RawCollection rawCollection = new RawCollection(graphManager, uriHelper, permissionChecker);
    register(environment, rawCollection);
    ExecuteRml executeRml = new ExecuteRml(uriHelper, graphManager, vres, new JenaBasedReader(), permissionChecker,
      new DataSourceFactory(graphManager), transactionEnforcer);
    register(environment, executeRml);
    BulkUploadVre bulkUploadVre =
      new BulkUploadVre(graphManager, uriHelper, rawCollection, executeRml, permissionChecker);
    register(environment, bulkUploadVre);
    register(environment, new BulkUpload(new BulkUploadService(vres, graphManager), uriHelper, bulkUploadVre,
      loggedInUserStore, authorizer, 20 * 1024 * 1024));


    register(environment, new RelationTypes(graphManager));
    register(environment, new Metadata(jsonMetadata));
    register(environment, new MyVres(loggedInUserStore, authorizer, vres, bulkUploadVre));

    final ExecutorService rfdExecutorService = environment.lifecycle().executorService("rdf-import").build();
    register(environment, new ImportRdf(graphManager, vres, rfdExecutorService, transactionEnforcer));

    // Admin resources
    environment.admin().addTask(new UserCreationTask(new LocalUserCreator(authenticator, userStore, authorizer)));
    environment.admin().addTask(new DatabaseValidationTask(
      databaseValidationRunner,
      getDatabaseValidator(vres, graphManager),
      graphManager
    ));
    environment.admin().addTask(new DbLogCreatorTask(graphManager));

    // register health checks
    register(environment, "Encryption algorithm", new EncryptionAlgorithmHealthCheck(ENCRYPTION_ALGORITHM));
    register(environment, "Local logins file", new FileHealthCheck(loginsPath));
    register(environment, "Users file", new FileHealthCheck(usersPath));

    register(environment, "Neo4j database connection", graphManager);
    register(environment, "Database", new DatabaseHealthCheck(databaseValidationRunner));

    //Log all http requests
    register(environment, new LoggingFilter(1024, currentVersion));
    register(environment, new TransactionFilter(graphManager));
    //Allow all CORS requests
    register(environment, new PromiscuousCorsFilter());

    //Add embedded AMQ (if any) to the metrics
    configuration.getLocalAmqJmxPath(HANDLE_QUEUE).ifPresent(rethrowConsumer(jmxPath -> {
      String dwMetricName = name(this.getClass(), "localAmq");
      ObjectName jmxMetricName = new ObjectName(jmxPath);

      environment.metrics().register(
        dwMetricName + ".enqueueCount",
        new JmxAttributeGauge(jmxMetricName, "EnqueueCount")
      );
      environment.metrics().register(
        dwMetricName + ".dequeueCount",
        new JmxAttributeGauge(jmxMetricName, "DequeueCount")
      );
    }));

    setupObjectMapping(environment);
  }

  private BackgroundRunner<ValidationResult> setUpDatabaseValidator(TimbuctooConfiguration configuration,
                                                                    Environment environment, Vres vres,
                                                                    GraphWaiter graphWaiter,
                                                                    TinkerpopGraphManager graphManager) {

    final ScheduledExecutorService executor = environment.lifecycle()
                                                         .scheduledExecutorService("databaseCheckExecutor")
                                                         .build();

    final int executeCheckAt = configuration.getExecuteDatabaseInvariantCheckAt();
    final Clock clock = Clock.systemDefaultZone();
    BackgroundRunner<ValidationResult> healthCheckRunner = new BackgroundRunner<>(executeCheckAt, clock, executor);

    if (executeCheckAt >= 0) {
      DatabaseValidator databaseValidator = getDatabaseValidator(vres, graphManager);

      graphWaiter.onGraph(graph -> {
        healthCheckRunner.start(() -> {
          final ValidationResult result = databaseValidator.check(graph);
          if (result.isValid()) {
            LOG.info("Databasevalidator indicates that the database is valid");
          } else {
            LOG.error(Logmarkers.databaseInvariant, result.getMessage());
          }
          return result;
        });
      });
    } else {
      LOG.error("Database invariant check will not run because executeDatabaseInvariantCheckAt is {}.", executeCheckAt);
    }
    return healthCheckRunner;
  }

  private DatabaseValidator getDatabaseValidator(Vres vres, TinkerpopGraphManager graphManager) {
    return new DatabaseValidator(
      new LabelsAddedToVertexDatabaseCheck(),
      new SortIndexesDatabaseCheck(),
      new InvariantsCheck(vres),
      new FullTextIndexCheck(graphManager)
    );
  }

  private void setupObjectMapping(Environment environment) {
    // object mapping
    SimpleModule module = new SimpleModule();
    module.addDeserializer(FacetValue.class, new FacetValueDeserializer());

    environment.getObjectMapper().registerModule(module);
  }

  private void register(Environment environment, String name, HealthCheck healthCheck) {
    environment.healthChecks().register(name, healthCheck);
  }

  private void register(Environment environment, Object component) {
    environment.jersey().register(component);
  }

}
