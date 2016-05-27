package nl.knaw.huygens.timbuctoo.experimental.databaselog;


import com.fasterxml.jackson.databind.ObjectMapper;
import nl.knaw.huygens.timbuctoo.experimental.databaselog.entry.LogEntryFactory;
import nl.knaw.huygens.timbuctoo.model.Change;
import nl.knaw.huygens.timbuctoo.server.GraphWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Comparator;

public class DatabaseLogGenerator {


  public static final Logger LOG = LoggerFactory.getLogger(DatabaseLogGenerator.class);
  private final GraphWrapper graphWrapper;
  private final LogEntryFactory logEntryFactory;
  private final ObjectMapper objectMapper;

  DatabaseLogGenerator(GraphWrapper graphWrapper, LogEntryFactory logEntryFactory) {
    this.graphWrapper = graphWrapper;
    this.logEntryFactory = logEntryFactory;
    objectMapper = new ObjectMapper();
  }

  public void generate() {
    DatabaseLog databaseLog = new DatabaseLog();

    graphWrapper.getGraph().traversal()
                .V().has("tim_id")
                .dedup()
                .order()
                .by("modified", (Comparator<String>) (o1, o2) -> {
                  try {
                    Change change1 =
                      objectMapper.readValue(o1, Change.class);
                    Change change2 =
                      objectMapper.readValue(o2, Change.class);

                    return Long
                      .compare(change1.getTimeStamp(),
                        change2.getTimeStamp());
                  } catch (IOException e) {
                    LOG.error("Cannot convert change", e);
                    return 0;
                  }
                })
                .forEachRemaining(vertex -> logEntryFactory.createForVertex(vertex).appendToLog(databaseLog));
  }
}
