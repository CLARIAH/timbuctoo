package nl.knaw.huygens.timbuctoo.config;

import nl.knaw.huygens.persistence.PersistenceManager;
import nl.knaw.huygens.persistence.PersistenceManagerFactory;
import nl.knaw.huygens.timbuctoo.persistence.PersistenceWrapper;
import nl.knaw.huygens.timbuctoo.storage.VariationStorage;
import nl.knaw.huygens.timbuctoo.storage.mongo.MongoStorageFacade;

import com.google.inject.AbstractModule;
import com.google.inject.Provides;
import com.google.inject.Singleton;
import com.google.inject.name.Names;

public class BasicInjectionModule extends AbstractModule {

  protected final Configuration config;
  private final TypeRegistry registry;

  public BasicInjectionModule(Configuration config) {
    this.config = config;
    registry = new TypeRegistry(config.getSetting("model-packages"));
    new ConfigValidator(config, registry).validate();
  }

  @Override
  protected void configure() {
    Names.bindProperties(binder(), config.getAll());
    bind(Configuration.class).toInstance(config);
    bind(TypeRegistry.class).toInstance(registry);

    bind(VariationStorage.class).to(MongoStorageFacade.class);
  }

  @Provides
  @Singleton
  PersistenceWrapper providePersistenceManager() {
    PersistenceManager persistenceManager = PersistenceManagerFactory.newPersistenceManager(config.getBooleanSetting("handle.enabled", true), config.getSetting("handle.cipher"),
        config.getSetting("handle.naming_authority"), config.getSetting("handle.prefix"), config.pathInUserHome(config.getSetting("handle.private_key_file")));

    return new PersistenceWrapper(config.getSetting("public_url"), persistenceManager);
  }

}