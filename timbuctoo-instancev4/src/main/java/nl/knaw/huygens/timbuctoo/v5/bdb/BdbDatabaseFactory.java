package nl.knaw.huygens.timbuctoo.v5.bdb;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.sleepycat.je.Database;
import com.sleepycat.je.DatabaseConfig;
import com.sleepycat.je.DatabaseException;
import com.sleepycat.je.Environment;
import com.sleepycat.je.EnvironmentConfig;
import nl.knaw.huygens.timbuctoo.v5.datastores.exceptions.DataStoreCreationException;
import nl.knaw.huygens.timbuctoo.v5.filestorage.implementations.filesystem.FileHelper;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.stream.Collectors;

public class BdbDatabaseFactory implements BdbDatabaseCreator {
  private final String databaseLocation;
  Map<String, Environment> environmentMap = new HashMap<>();
  Map<String, Database> databases = new HashMap<>();
  protected final EnvironmentConfig configuration;
  private FileHelper fileHelper;

  @JsonCreator
  public BdbDatabaseFactory(@JsonProperty("databaseLocation") String databaseLocation) {
    this.databaseLocation = databaseLocation;
    configuration = new EnvironmentConfig(new Properties());
    configuration.setTransactional(true);
    configuration.setTxnNoSync(true);
    configuration.setAllowCreate(true);
    configuration.setSharedCache(true);
  }

  @Override
  public BdbWrapper getDatabase(String userId, String dataSetId, String databaseName,
                                DatabaseConfig config)
    throws DataStoreCreationException {
    String environmentKey = environmentKey(userId, dataSetId);
    String databaseKey = environmentKey + "_" + databaseName;
    if (!databases.containsKey(databaseKey)) {
      if (!environmentMap.containsKey(environmentKey)) {
        try {
          File dbDir = fileHelper.pathInDataSet(userId, dataSetId, "databases");
          Environment dataSetEnvironment = new Environment(dbDir, configuration);
          environmentMap.put(environmentKey, dataSetEnvironment);
        } catch (DatabaseException e) {
          throw new DataStoreCreationException(e);
        }
      }
      try {
        databases.put(databaseKey, environmentMap.get(environmentKey).openDatabase(null, databaseName, config));
      } catch (DatabaseException e) {
        throw new DataStoreCreationException(e);
      }
    }
    return new BdbWrapper(environmentMap.get(environmentKey), databases.get(databaseKey), config);
  }

  private String environmentKey(String userId, String dataSetId) {
    return userId + "_" + dataSetId;
  }

  @Override
  public void removeDatabasesFor(String userId, String dataSetId) {
    String environmentKey = environmentKey(userId, dataSetId);

    List<String> dbsToRemove = databases.keySet().stream()
                                        .filter(dbName -> dbName.startsWith(environmentKey))
                                        .collect(Collectors.toList());

    for (String dbToRemove : dbsToRemove) {
      databases.get(dbToRemove).close();
      databases.remove(dbToRemove);
    }

    if (environmentMap.containsKey(environmentKey)) {
      environmentMap.get(environmentKey).close();
      environmentMap.remove(environmentKey);
    }
  }

  @Override
  public void start() {
    File dbHome = new File(databaseLocation);
    dbHome.mkdirs();
    if (!dbHome.isDirectory()) {
      throw new IllegalStateException("Database home at '" + dbHome.getAbsolutePath() + "' is not a directory");
    }
    fileHelper = new FileHelper(dbHome);
  }

  @Override
  public void stop() {
    for (Database database : databases.values()) {
      database.close();
    }
  }
}
