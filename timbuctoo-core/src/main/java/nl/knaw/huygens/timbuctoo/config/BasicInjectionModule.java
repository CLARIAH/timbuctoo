package nl.knaw.huygens.timbuctoo.config;

/*
 * #%L
 * Timbuctoo core
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

import nl.knaw.huygens.timbuctoo.storage.Storage;
import nl.knaw.huygens.timbuctoo.storage.neo4j.Neo4JLegacyStorageWrapper;

import org.neo4j.graphdb.GraphDatabaseService;

import com.google.inject.AbstractModule;
import com.google.inject.name.Names;

public class BasicInjectionModule extends AbstractModule {

  protected final Configuration config;
  private final TypeRegistry registry;

  public BasicInjectionModule(Configuration config) {
    try {
      this.config = config;
      registry = TypeRegistry.getInstance();
      registry.init(config.getSetting("model-packages"));
      validateConfig(config);
    } catch (Exception e) {
      // TODO throw checked exception
      throw new RuntimeException(e);
    }
  }

  protected void validateConfig(Configuration config) {
    new ConfigValidator(config).validate();
  }

  @Override
  protected void configure() {
    Names.bindProperties(binder(), config.getAll());
    bind(Configuration.class).toInstance(config);
    bind(TypeRegistry.class).toInstance(registry);

    //    bind(Storage.class).to(MongoStorage.class);
    //    bind(Properties.class).to(MongoProperties.class);

    bind(Storage.class).to(Neo4JLegacyStorageWrapper.class);

    //    engine = new RestCypherQueryEngine(restApi);
    bind(GraphDatabaseService.class).toProvider(GraphDatabaseServiceProvider.class);
    //    bind(GraphDatabaseService.class).toInstance(new GraphDatabaseFactory().newEmbeddedDatabase(config.getDirectory("admin_data.directory") + "/db"));
  }
}
