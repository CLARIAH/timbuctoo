package nl.knaw.huygens.timbuctoo.database.tinkerpop;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.common.collect.Lists;
import javaslang.control.Try;
import nl.knaw.huygens.timbuctoo.core.AlreadyUpdatedException;
import nl.knaw.huygens.timbuctoo.core.EntityFinisherHelper;
import nl.knaw.huygens.timbuctoo.core.NotFoundException;
import nl.knaw.huygens.timbuctoo.core.RelationNotPossibleException;
import nl.knaw.huygens.timbuctoo.core.dto.CreateCollection;
import nl.knaw.huygens.timbuctoo.core.dto.CreateEntity;
import nl.knaw.huygens.timbuctoo.core.dto.CreateRelation;
import nl.knaw.huygens.timbuctoo.core.dto.DataStream;
import nl.knaw.huygens.timbuctoo.core.dto.QuickSearch;
import nl.knaw.huygens.timbuctoo.core.dto.QuickSearchResult;
import nl.knaw.huygens.timbuctoo.core.dto.ReadEntity;
import nl.knaw.huygens.timbuctoo.core.dto.RelationType;
import nl.knaw.huygens.timbuctoo.core.dto.UpdateEntity;
import nl.knaw.huygens.timbuctoo.core.dto.UpdateRelation;
import nl.knaw.huygens.timbuctoo.core.dto.dataset.Collection;
import nl.knaw.huygens.timbuctoo.core.dto.dataset.CollectionBuilder;
import nl.knaw.huygens.timbuctoo.core.dto.property.StringProperty;
import nl.knaw.huygens.timbuctoo.core.dto.property.TimProperty;
import nl.knaw.huygens.timbuctoo.core.dto.rdf.ImmutableCreateProperty;
import nl.knaw.huygens.timbuctoo.core.dto.rdf.PredicateInUse;
import nl.knaw.huygens.timbuctoo.core.dto.rdf.RdfProperty;
import nl.knaw.huygens.timbuctoo.core.dto.rdf.RdfReadProperty;
import nl.knaw.huygens.timbuctoo.core.dto.rdf.ValueTypeInUse;
import nl.knaw.huygens.timbuctoo.database.tinkerpop.changelistener.ChangeListener;
import nl.knaw.huygens.timbuctoo.model.Change;
import nl.knaw.huygens.timbuctoo.model.vre.Vre;
import nl.knaw.huygens.timbuctoo.model.vre.Vres;
import nl.knaw.huygens.timbuctoo.model.vre.vres.VresBuilder;
import nl.knaw.huygens.timbuctoo.rdf.Database;
import nl.knaw.huygens.timbuctoo.rdf.Entity;
import nl.knaw.huygens.timbuctoo.server.TinkerPopGraphManager;
import org.apache.jena.graph.NodeFactory;
import org.apache.tinkerpop.gremlin.neo4j.process.traversal.LabelP;
import org.apache.tinkerpop.gremlin.structure.Direction;
import org.apache.tinkerpop.gremlin.structure.Edge;
import org.apache.tinkerpop.gremlin.structure.Element;
import org.apache.tinkerpop.gremlin.structure.Graph;
import org.apache.tinkerpop.gremlin.structure.T;
import org.apache.tinkerpop.gremlin.structure.Vertex;
import org.junit.Test;

import java.io.IOException;
import java.net.URI;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static java.util.stream.Collectors.toList;
import static nl.knaw.huygens.timbuctoo.database.tinkerpop.TinkerpopSaver.RAW_COLLECTION_EDGE_NAME;
import static nl.knaw.huygens.timbuctoo.database.tinkerpop.TinkerpopSaver.RAW_COLLECTION_NAME_PROPERTY_NAME;
import static nl.knaw.huygens.timbuctoo.database.tinkerpop.TinkerpopSaver.RAW_ITEM_EDGE_NAME;
import static nl.knaw.huygens.timbuctoo.database.tinkerpop.TinkerpopSaver.RAW_PROPERTY_EDGE_NAME;
import static nl.knaw.huygens.timbuctoo.core.CollectionNameHelper.defaultEntityTypeName;
import static nl.knaw.huygens.timbuctoo.core.dto.CreateEntityStubs.withProperties;
import static nl.knaw.huygens.timbuctoo.core.dto.dataset.Collection.COLLECTION_NAME_PROPERTY_NAME;
import static nl.knaw.huygens.timbuctoo.core.dto.dataset.Collection.ENTITY_TYPE_NAME_PROPERTY_NAME;
import static nl.knaw.huygens.timbuctoo.core.dto.dataset.Collection.HAS_DISPLAY_NAME_RELATION_NAME;
import static nl.knaw.huygens.timbuctoo.core.dto.dataset.Collection.HAS_ENTITY_NODE_RELATION_NAME;
import static nl.knaw.huygens.timbuctoo.core.dto.dataset.Collection.HAS_ENTITY_RELATION_NAME;
import static nl.knaw.huygens.timbuctoo.core.dto.dataset.Collection.HAS_PROPERTY_RELATION_NAME;
import static nl.knaw.huygens.timbuctoo.core.dto.dataset.Collection.IS_RELATION_COLLECTION_PROPERTY_NAME;
import static nl.knaw.huygens.timbuctoo.database.tinkerpop.PropertyNameHelper.createPropName;
import static nl.knaw.huygens.timbuctoo.database.tinkerpop.TinkerPopOperationsStubs.forGraphMappingsAndChangeListener;
import static nl.knaw.huygens.timbuctoo.database.tinkerpop.TinkerPopOperationsStubs.forGraphMappingsAndIndex;
import static nl.knaw.huygens.timbuctoo.database.tinkerpop.TinkerPopOperationsStubs.forGraphMappingsListenerAndIndex;
import static nl.knaw.huygens.timbuctoo.database.tinkerpop.TinkerPopOperationsStubs.forGraphWrapper;
import static nl.knaw.huygens.timbuctoo.database.tinkerpop.TinkerPopOperationsStubs.forGraphWrapperAndMappings;
import static nl.knaw.huygens.timbuctoo.database.tinkerpop.VertexDuplicator.VERSION_OF;
import static nl.knaw.huygens.timbuctoo.model.GraphReadUtils.getProp;
import static nl.knaw.huygens.timbuctoo.model.properties.PropertyTypes.localProperty;
import static nl.knaw.huygens.timbuctoo.model.vre.Vre.HAS_COLLECTION_RELATION_NAME;
import static nl.knaw.huygens.timbuctoo.model.vre.VreStubs.minimalCorrectVre;
import static nl.knaw.huygens.timbuctoo.rdf.Database.RDF_SYNONYM_PROP;
import static nl.knaw.huygens.timbuctoo.rdf.Database.RDF_URI_PROP;
import static nl.knaw.huygens.timbuctoo.util.EdgeMatcher.likeEdge;
import static nl.knaw.huygens.timbuctoo.util.JsonBuilder.jsn;
import static nl.knaw.huygens.timbuctoo.util.JsonBuilder.jsnO;
import static nl.knaw.huygens.hamcrest.OptionalPresentMatcher.present;
import static nl.knaw.huygens.timbuctoo.util.StreamIterator.stream;
import static nl.knaw.huygens.timbuctoo.util.TestGraphBuilder.newGraph;
import static nl.knaw.huygens.timbuctoo.util.VertexMatcher.likeVertex;
import static org.apache.tinkerpop.gremlin.process.traversal.P.within;
import static org.apache.tinkerpop.gremlin.process.traversal.dsl.graph.__.has;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.emptyIterable;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.nullValue;
import static org.hamcrest.Matchers.sameInstance;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.hamcrest.MockitoHamcrest.argThat;
import static uk.co.datumedge.hamcrest.json.SameJSONAs.sameJSONAs;

public class TinkerPopOperationsTest {

  @Test
  public void emptyDatabaseIsShownAsEmpty() throws Exception {
    TinkerPopOperations instance = forGraphWrapper(newGraph().wrap());

    boolean isEmpty = instance.databaseIsEmptyExceptForMigrations();

    assertThat(isEmpty, is(true));
  }

  @Test
  public void nonEmptyDatabaseIsShownAsFull() throws Exception {
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(UUID.randomUUID().toString())
      ).wrap();
    TinkerPopOperations instance = forGraphWrapper(graphManager);

    boolean isEmpty = instance.databaseIsEmptyExceptForMigrations();

    assertThat(isEmpty, is(false));
  }

  @Test
  public void ensureVreExistsCreatesAVreIfNeeded() throws Exception {
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(UUID.randomUUID().toString())
      ).wrap();
    TinkerPopOperations instance = forGraphWrapper(graphManager);

    instance.ensureVreExists("SomeVre");
    assertThat(
      graphManager.getGraph().traversal().V()
                  .has(T.label, LabelP.of(Vre.DATABASE_LABEL))
                  .has(Vre.VRE_NAME_PROPERTY_NAME, "SomeVre")
                  .hasNext(),
      is(true)
    );
  }

  @Test
  public void createEntityAddsAnEntityWithItsPropertiesToTheDatabase() throws Exception {
    TinkerPopGraphManager graphManager = newGraph().wrap();
    Vres vres = createConfiguration();
    final Collection collection = vres.getCollection("testthings").get();
    final TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);
    List<TimProperty<?>> properties = Lists.newArrayList();
    properties.add(new StringProperty("prop1", "val1"));
    properties.add(new StringProperty("prop2", "val2"));
    CreateEntity createEntity = withProperties(properties);

    instance.createEntity(collection, Optional.empty(), createEntity);

    assertThat(graphManager.getGraph()
                           .traversal().V()
                           .has("tim_id", createEntity.getId().toString())
                           .has("testthing_prop1", "val1")
                           .has("testthing_prop2", "val2")
                           .hasNext(),
      is(true));
  }

  @Test // TODO move the TimbuctooActions
  public void createEntitySetsTheRevToOne() throws Exception {
    TinkerPopGraphManager graphManager = newGraph().wrap();
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);
    List<TimProperty<?>> properties = Lists.newArrayList();
    CreateEntity createEntity = withProperties(properties);

    instance.createEntity(collection, Optional.empty(), createEntity);

    assertThat(graphManager.getGraph()
                           .traversal().V()
                           .has("tim_id", createEntity.getId().toString())
                           .has("rev", 1)
                           .hasNext(),
      is(true));
  }

  @Test
  public void createEntitySetsTypesWithTheCollectionAndTheBaseCollection() throws Exception {
    TinkerPopGraphManager graphManager = newGraph().wrap();
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);
    List<TimProperty<?>> properties = Lists.newArrayList();
    CreateEntity createEntity = withProperties(properties);

    instance.createEntity(collection, Optional.empty(), createEntity);

    assertThat(graphManager.getGraph()
                           .traversal().V()
                           .has("tim_id", createEntity.getId().toString())
                           .next().value("types"),
      allOf(containsString("testthing"), containsString("thing"))
    );
  }

  private Vres createConfiguration() {
    return new VresBuilder()
      .withVre("testVre", "test", vre -> vre
        .withCollection("testthings", col -> col
          .withProperty("prop1", localProperty("testthing_prop1"))
          .withProperty("prop2", localProperty("testthing_prop2"))
          .withDisplayName(localProperty("testthing_displayName"))
        )
        .withCollection("teststuffs")
        .withCollection("testrelations", CollectionBuilder::isRelationCollection)
        .withCollection("testkeywords", col -> col
          .withDisplayName(localProperty("testkeyword_displayName"))
          .withProperty("type", localProperty("testkeyword_type"))
        )
      )
      .withVre("otherVre", "other", vre -> vre
        .withCollection("otherthings", col -> col
          .withProperty("prop1", localProperty("otherthing_prop1"))
          .withProperty("prop2", localProperty("otherthing_prop2"))
        ))
      .build();
  }

  @Test
  public void createEntitySetsCreatedAndModified() throws Exception {
    TinkerPopGraphManager graphManager = newGraph().wrap();
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);
    List<TimProperty<?>> properties = Lists.newArrayList();
    String userId = "userId";
    long timeStamp = Instant.now().toEpochMilli();
    CreateEntity createEntity = withProperties(properties, userId, timeStamp);

    instance.createEntity(collection, Optional.empty(), createEntity);

    assertThat(graphManager.getGraph()
                           .traversal().V()
                           .has("tim_id", createEntity.getId().toString())
                           .next().value("created"),
      sameJSONAs(String.format("{\"timeStamp\": %s,\"userId\": \"%s\"}", timeStamp, userId))
    );

    assertThat(graphManager.getGraph()
                           .traversal().V()
                           .has("tim_id", createEntity.getId().toString())
                           .next().value("modified"),
      sameJSONAs(String.format("{\"timeStamp\": %s,\"userId\": \"%s\"}", timeStamp, userId))
    );
  }

  @Test
  public void createEntityDuplicatesTheVertex() throws Exception {
    TinkerPopGraphManager graphManager = newGraph().wrap();
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);
    List<TimProperty<?>> properties = Lists.newArrayList();
    CreateEntity createEntity = withProperties(properties);

    instance.createEntity(collection, Optional.empty(), createEntity);

    assertThat(
      graphManager.getGraph().traversal()
                  .V()
                  .has("tim_id", createEntity.getId().toString())
                  .count()
                  .next(),
      is(2L)
    );
  }

  @Test
  public void createEntityMarksOneVertexAsLatest() throws Exception {
    TinkerPopGraphManager graphManager = newGraph().wrap();
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);
    List<TimProperty<?>> properties = Lists.newArrayList();
    CreateEntity createEntity = withProperties(properties);

    instance.createEntity(collection, Optional.empty(), createEntity);


    assertThat(graphManager.getGraph()
                           .traversal().V()
                           .has("tim_id", createEntity.getId().toString())
                           .has("isLatest", true)
                           .count().next(),
      is(1L));

  }

  @Test(expected = IOException.class)
  public void createEntityThrowsAnIoExceptionWhenItEncountersAnUnknownProperty() throws Exception {
    TinkerPopGraphManager graphManager = newGraph().wrap();
    Vres vres = createConfiguration();
    final Collection collection = vres.getCollection("testthings").get();
    final TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);
    List<TimProperty<?>> properties = Lists.newArrayList();
    properties.add(new StringProperty("prop1", "val1"));
    properties.add(new StringProperty("unknowProp", "val2"));
    CreateEntity createEntity = withProperties(properties);

    instance.createEntity(collection, Optional.empty(), createEntity);
  }

  // TODO move increase of the rev to TimbuctooActions
  @Test
  public void deleteEntityIncreasesTheRevision() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    UUID id = UUID.randomUUID();
    String idString = id.toString();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(idString)
        .withProperty("isLatest", true)
        .withVre("test")
        .withType("thing")
        .withProperty("rev", 1)
        .withIncomingRelation("VERSION_OF", "orig")
      )
      .withVertex("orig", v -> v
        .withTimId(idString)
        .withVre("test")
        .withType("thing")
        .withProperty("isLatest", false)
        .withProperty("rev", 1)
      )
      .wrap();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);

    int rev = instance.deleteEntity(collection, id, new Change(Instant.now().toEpochMilli(), "userId", null));

    assertThat(rev, is(2));
  }

  @Test
  public void deleteEntityRemovesTypeWhenOtherTypesExist() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    UUID id = UUID.randomUUID();
    String idString = id.toString();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(idString)
        .withVre("test")
        .withVre("other")
        .withType("thing")
        .withProperty("isLatest", true)
        .withProperty("rev", 1)
        .withLabel("testthing")
        .withLabel("otherthing")
      )
      .wrap();
    GremlinEntityFetcher entityFetcher = new GremlinEntityFetcher();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);

    instance.deleteEntity(collection, id, new Change(Instant.now().toEpochMilli(), "userId", null));

    String types = (String) graphManager.getGraph().traversal().V()
                                        .has("tim_id", idString)
                                        .has("isLatest", true)
                                        .properties("types").value()
                                        .next();

    assertThat(types, is("[\"otherthing\"]"));

    // Type should also be removed from the Neo4j labels
    assertThat(graphManager.getGraph().traversal().V()
                           .has("tim_id", idString)
                           .has("isLatest", true)
                           .has(T.label, LabelP.of("testthing")).hasNext(), is(false));

    // Other type should not be removed from the Neo4j labels
    assertThat(graphManager.getGraph().traversal().V()
                           .has("tim_id", idString)
                           .has("isLatest", true)
                           .has(T.label, LabelP.of("otherthing")).hasNext(), is(true));
  }

  @Test
  public void deleteEntitySetsDeletedToTrueWhenLastTypeIsRemoved() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    UUID id = UUID.randomUUID();
    String idString = id.toString();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(idString)
        .withProperty("isLatest", true)
        .withVre("test")
        .withType("thing")
        .withProperty("rev", 1)
        .withIncomingRelation("VERSION_OF", "orig")
      )
      .withVertex("orig", v -> v
        .withTimId(idString)
        .withVre("test")
        .withType("thing")
        .withProperty("isLatest", false)
        .withProperty("rev", 1)
      )
      .wrap();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);

    instance.deleteEntity(collection, id, new Change(Instant.now().toEpochMilli(), "userId", null));

    assertThat(graphManager.getGraph().traversal().V()
                           .has("tim_id", idString)
                           .has("deleted", true).hasNext(), is(true));
  }

  @Test
  public void deleteEntitySetsModified() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    UUID id = UUID.randomUUID();
    String idString = id.toString();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(idString)
        .withProperty("isLatest", true)
        .withVre("test")
        .withType("thing")
        .withProperty("rev", 1)
        .withIncomingRelation("VERSION_OF", "orig")
      )
      .withVertex("orig", v -> v
        .withTimId(idString)
        .withVre("test")
        .withType("thing")
        .withProperty("isLatest", false)
        .withProperty("rev", 1)
      )
      .wrap();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);
    long timeStamp = Instant.now().toEpochMilli();
    String userId = "userId";

    instance.deleteEntity(collection, id, new Change(timeStamp, userId, null));

    assertThat(graphManager.getGraph().traversal().V()
                           .has("tim_id", idString)
                           .has("deleted", true).next()
                           .value("modified"),
      sameJSONAs(String.format("{\"timeStamp\": %s,\"userId\": \"%s\"}", timeStamp, userId)));
  }

  @Test
  public void deleteEntityPreparesBackupCopyAfterMakingChanges() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    UUID id = UUID.randomUUID();
    String idString = id.toString();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(idString)
        .withVre("test")
        .withType("thing")
        .withProperty("isLatest", true)
        .withProperty("rev", 1)
        .withIncomingRelation("VERSION_OF", "orig")
      )
      .withVertex("orig", v -> v
        .withTimId(idString)
        .withVre("test")
        .withType("thing")
        .withProperty("isLatest", false)
        .withProperty("rev", 1)
      )
      .wrap();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);

    Vertex beforeUpdate = graphManager.getGraph().traversal().V()
                                      .has("tim_id", idString)
                                      .has("isLatest", true)
                                      .next();

    instance.deleteEntity(collection, id, new Change(Instant.now().toEpochMilli(), "userId", null));

    Vertex afterUpdate = graphManager.getGraph().traversal().V()
                                     .has("tim_id", idString)
                                     .has("isLatest", true)
                                     .next();

    assertThat(afterUpdate.id(), is(not(beforeUpdate.id())));
    //single edge, containing the VERSION_OF pointer
    assertThat(afterUpdate.edges(Direction.IN).next().outVertex().id(), is(beforeUpdate.id()));
  }

  @Test
  public void deleteEntityMovesRelationsToNewestVertex() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    UUID id = UUID.randomUUID();
    String idString = id.toString();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(idString)
        .withVre("test")
        .withType("thing")
        .withProperty("isLatest", true)
        .withProperty("rev", 1)
        .withOutgoingRelation("hasWritten", "stuff")
        .withIncomingRelation("isFriendOf", "friend")
      )
      .withVertex("stuff", v -> v
        .withVre("test")
        .withType("stuff")
        .withProperty("isLatest", true)
        .withProperty("rev", 1)
      )
      .withVertex("friend", v -> v
        .withVre("test")
        .withType("thing")
        .withProperty("isLatest", true)
        .withProperty("rev", 1)
      )
      .wrap();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);
    Vertex orig = graphManager.getGraph().traversal().V().has("tim_id", idString).has("isLatest", true).next();
    assertThat(stream(orig.edges(Direction.BOTH, "hasWritten", "isFriendOf")).count(), is(2L));

    instance.deleteEntity(collection, id, new Change(Instant.now().toEpochMilli(), "userId", null));

    Vertex replacement = graphManager.getGraph().traversal().V().has("tim_id", idString).has("isLatest", true).next();
    assertThat(stream(orig.edges(Direction.BOTH, "hasWritten", "isFriendOf")).count(), is(0L));
    assertThat(stream(replacement.edges(Direction.BOTH, "hasWritten", "isFriendOf")).count(), is(2L));
  }

  @Test
  public void deletesAllRelationsOfCurrentVre() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    UUID id = UUID.randomUUID();
    String idString = id.toString();
    final String testOnlyId = "10000000-0000-0000-0000-000000000000";
    final String otherOnlyId = "20000000-0000-0000-0000-000000000000";
    final String inBothId = "30000000-0000-0000-0000-000000000000";
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(idString)
        .withVre("test")
        .withType("thing")
        .withProperty("isLatest", true)
        .withProperty("rev", 1)
        .withOutgoingRelation("hasWritten", "stuff", rel -> rel
          .withTim_id(UUID.fromString(testOnlyId))
          .removeType("other")
          .withAccepted("testrelation", true)
        )
        .withIncomingRelation("isFriendOf", "friend", rel -> rel
          .withTim_id(UUID.fromString(inBothId))
          .withAccepted("testrelation", true)
          .withAccepted("otherrelation", true)
        )
        .withIncomingRelation("isFriendOf", "friend", rel -> rel
          .withTim_id(UUID.fromString(otherOnlyId))
          .removeType("test")
          .withAccepted("otherrelation", true)
        )
      )
      .withVertex("stuff", v -> v
        .withVre("test")
        .withType("stuff")
        .withProperty("isLatest", true)
        .withProperty("rev", 1)
      )
      .withVertex("friend", v -> v
        .withVre("test")
        .withVre("other")
        .withType("thing")
        .withProperty("isLatest", true)
        .withProperty("rev", 1)
      )
      .wrap();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);

    instance.deleteEntity(collection, id, new Change(Instant.now().toEpochMilli(), "userId", null));

    assertThat(graphManager.getGraph().traversal().E()
                           .has("tim_id", testOnlyId)
                           .has("isLatest", true)
                           .has("testrelation_accepted", false).not(has("otherrelation_accepted"))
                           .hasNext(), is(true));
    assertThat(graphManager.getGraph().traversal().E()
                           .has("tim_id", inBothId)
                           .has("isLatest", true)
                           .has("testrelation_accepted", false).has("otherrelation_accepted", true)
                           .hasNext(), is(true));
    assertThat(graphManager.getGraph().traversal().E()
                           .has("tim_id", otherOnlyId)
                           .has("isLatest", true)
                           .not(has("testrelation_accepted")).has("otherrelation_accepted", true)
                           .hasNext(), is(true));

  }

  @Test(expected = NotFoundException.class)
  public void deleteEntityThrowsNotFoundWhenTheEntityIsNotOfThisVre() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    UUID id = UUID.randomUUID();
    String idString = id.toString();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(idString)
        .withVre("other")
        .withType("person")
        .withProperty("isLatest", true)
        .withProperty("rev", 1)
        .withProperty("deleted", false)
      )
      .wrap();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);

    instance.deleteEntity(collection, id, null);
  }

  @Test(expected = NotFoundException.class)
  public void deleteEntitythrowsNotFoundWhenTheIdIsNotInTheDatabase() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    UUID id = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph().wrap();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);

    instance.deleteEntity(collection, id, null);
  }

  @Test
  public void getEntityMapsTheId() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    UUID id = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(id.toString())
        .withType("thing")
        .withVre("test")
        .withProperty("isLatest", true)
        .withProperty("rev", 1)
      ).wrap();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);

    ReadEntity entity = instance.getEntity(id, null, collection,
      (readEntity, vertex) -> {
      },
      (graphTraversalSource, vre, vertex, relationRef) -> {
      }
    );

    assertThat(entity.getId(), is(id));
  }

  @Test
  public void getEntityOnlyMapsTheKnownProperties() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    UUID id = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(id.toString())
        .withProperty("isLatest", true)
        .withProperty("rev", 1)
        .withType("thing")
        .withVre("test")
        .withProperty("testthing_prop1", "val1")
        .withProperty("testthing_prop2", "val2")
        .withProperty("testthing_unknownProp", "val")
      )
      .wrap();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);

    ReadEntity entity = instance.getEntity(id, null, collection,
      (readEntity, vertex) -> {
      },
      (graphTraversalSource, vre, vertex, relationRef) -> {
      }
    );

    assertThat(entity.getProperties(), containsInAnyOrder(
      allOf(hasProperty("name", equalTo("prop1")), hasProperty("value", equalTo("val1"))),
      allOf(hasProperty("name", equalTo("prop2")), hasProperty("value", equalTo("val2")))
    ));
    assertThat(entity.getProperties(), not(contains(
      allOf(hasProperty("name", equalTo("unknownProp")), hasProperty("value", equalTo("val")))
    )));
  }

  @Test
  public void getEntityIgnoresThePropertiesWithAWrongValue() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    UUID id = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(id.toString())
        .withProperty("isLatest", true)
        .withProperty("rev", 1)
        .withType("thing")
        .withVre("test")
        .withProperty("testthing_prop2", 42) // should be a string
      )
      .wrap();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);

    ReadEntity entity = instance.getEntity(id, null, collection,
      (readEntity, vertex) -> {
      },
      (graphTraversalSource, vre, vertex, relationRef) -> {
      }
    );

    assertThat(entity.getProperties(), emptyIterable());
  }

  @Test
  public void getEntityReturnsTheLatestEntityIfTheRefIsNull() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    UUID id = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(id.toString())
        .withType("thing")
        .withVre("test")
        .withProperty("testthing_prop1", "old")
        .withProperty("rev", 1)
        .withProperty("isLatest", false)
        .withOutgoingRelation("VERSION_OF", "replacement")
      )
      .withVertex("replacement", v -> v
        .withTimId(id.toString())
        .withType("thing")
        .withVre("test")
        .withProperty("testthing_prop1", "new")
        .withProperty("rev", 2)
        .withProperty("isLatest", false)
        .withOutgoingRelation("VERSION_OF", "dangling")
      )
      .withVertex("dangling", v -> v
        .withTimId(id.toString())
        .withType("thing")
        .withVre("test")
        .withProperty("testthing_prop1", "new")
        .withProperty("rev", 2)
        .withProperty("isLatest", true)
      )
      .wrap();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);

    ReadEntity entity = instance.getEntity(id, null, collection,
      (readEntity, vertex) -> {
      },
      (graphTraversalSource, vre, vertex, relationRef) -> {
      }
    );

    assertThat(entity.getRev(), is(2));
    assertThat(entity.getProperties(), contains(
      allOf(hasProperty("name", equalTo("prop1")), hasProperty("value", equalTo("new")))
    ));
  }

  @Test
  public void getEntityReturnsTheSpecifiedRevision() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    UUID id = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(id.toString())
        .withType("thing")
        .withVre("test")
        .withProperty("testthing_prop1", "old")
        .withProperty("rev", 1)
        .withProperty("isLatest", false)
        .withOutgoingRelation("VERSION_OF", "replacement")
      )
      .withVertex("replacement", v -> v
        .withTimId(id.toString())
        .withType("thing")
        .withVre("test")
        .withProperty("testthing_prop1", "new")
        .withProperty("rev", 2)
        .withProperty("isLatest", false)
        .withOutgoingRelation("VERSION_OF", "dangling")
      )
      .withVertex("dangling", v -> v
        .withTimId(id.toString())
        .withType("thing")
        .withVre("test")
        .withProperty("testthing_prop1", "new")
        .withProperty("rev", 2)
        .withProperty("isLatest", true)
      )
      .wrap();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);

    ReadEntity entity = instance.getEntity(id, 1, collection,
      (readEntity, vertex) -> {
      },
      (graphTraversalSource, vre, vertex, relationRef) -> {
      }
    );

    assertThat(entity.getRev(), is(1));
    assertThat(entity.getProperties(), contains(
      allOf(hasProperty("name", equalTo("prop1")), hasProperty("value", equalTo("old")))
    ));
  }

  @Test(expected = NotFoundException.class)
  public void getEntityThrowsANotFoundExceptionWhenTheDatabaseDoesNotContainTheEntity() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    UUID id = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph().wrap();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);

    instance.getEntity(id, null, collection,
      (readEntity, vertex) -> {
      },
      (graphTraversalSource, vre, vertex, relationRef) -> {
      }
    );
  }

  @Test
  public void getEntityReturnsTheRelations() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    GremlinEntityFetcher entityFetcher = new GremlinEntityFetcher();
    UUID id = UUID.randomUUID();
    UUID relatedId = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex("source", v -> v
        .withOutgoingRelation("isRelatedTo", "relatedThing")
        .withVre("test")
        .withVre("")
        .withType("thing")
        .isLatest(true)
        .withTimId(id.toString())
      )
      .withVertex("relatedThing", v -> v
        .withVre("test")
        .withVre("")
        .withType("thing")
        .withTimId(relatedId.toString())
        .withProperty("testthing_displayName", "displayName")
      ).wrap();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);

    ReadEntity entity = instance.getEntity(id, null, collection,
      (readEntity, vertex) -> {
      },
      (graphTraversalSource, vre, vertex, relationRef) -> {
      }
    );

    assertThat(entity.getRelations(), contains(
      allOf(
        hasProperty("entityId", equalTo(relatedId.toString())),
        hasProperty("collectionName", equalTo("testthings")),
        hasProperty("entityType", equalTo("testthing")),
        hasProperty("relationType", equalTo("isRelatedTo")),
        hasProperty("displayName", equalTo("displayName"))
      )
    ));
  }

  @Test
  public void getEntityUsesTheInverseRelationName() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    UUID id = UUID.randomUUID();
    UUID stuffId = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex("source", v -> v
        .withIncomingRelation("isCreatedBy", "stuff")
        .withVre("test")
        .withVre("")
        .withType("thing")
        .isLatest(true)
        .withTimId(id.toString())
      )
      .withVertex("stuff", v -> v
        .withVre("test")
        .withVre("")
        .withType("stuff")
        .withTimId(stuffId.toString())
      )
      .withVertex(v -> v
        .withProperty("relationtype_regularName", "isCreatedBy")
        .withProperty("relationtype_inverseName", "isCreatorOf")
      )
      .withVertex(v -> v
        .withProperty("relationtype_regularName", "otherRelationType")
        .withProperty("relationtype_inverseName", "otherInverseType")
      )
      .wrap();

    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);

    ReadEntity entity = instance.getEntity(id, null, collection,
      (readEntity, vertex) -> {
      },
      (graphTraversalSource, vre, vertex, relationRef) -> {
      }
    );

    assertThat(entity.getRelations(), contains(
      allOf(hasProperty("entityId", equalTo(stuffId.toString())), hasProperty("relationType", equalTo("isCreatorOf")))
    ));
  }

  @Test
  public void getEntityOmitsDeletedRelations() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    UUID id = UUID.randomUUID();
    UUID relatedId = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex("source", v -> v
        .withOutgoingRelation("isRelatedTo", "relatedThing", rel -> rel.withDeleted(true))
        .withOutgoingRelation("hasOtherRelationWith", "relatedThing")
        .withVre("test")
        .withVre("")
        .withType("thing")
        .isLatest(true)
        .withTimId(id.toString())
      )
      .withVertex("relatedThing", v -> v
        .withVre("test")
        .withVre("")
        .withType("thing")
        .withTimId(relatedId.toString())
        .withProperty("testthing_displayName", "displayName")
      ).wrap();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);

    ReadEntity entity = instance.getEntity(id, null, collection,
      (readEntity, vertex) -> {
      },
      (graphTraversalSource, vre, vertex, relationRef) -> {
      }
    );

    assertThat(entity.getRelations(), hasSize(1));
    assertThat(entity.getRelations(), contains(hasProperty("relationType", equalTo("hasOtherRelationWith"))));
  }

  @Test
  public void getEntityOnlyReturnsTheLatestRelations() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    UUID id = UUID.randomUUID();
    UUID relatedId = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex("source", v -> v
        .withOutgoingRelation("isRelatedTo", "relatedThing", rel -> rel.withIsLatest(true).withRev(2))
        .withOutgoingRelation("isRelatedTo", "relatedThing", rel -> rel.withIsLatest(false).withRev(1))
        .withVre("test")
        .withVre("")
        .withType("thing")
        .isLatest(true)
        .withTimId(id.toString())
      )
      .withVertex("relatedThing", v -> v
        .withVre("test")
        .withVre("")
        .withType("thing")
        .withTimId(relatedId.toString())
      ).wrap();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);

    ReadEntity entity = instance.getEntity(id, null, collection,
      (readEntity, vertex) -> {
      },
      (graphTraversalSource, vre, vertex, relationRef) -> {
      }
    );

    assertThat(entity.getRelations(), hasSize(1));
    assertThat(entity.getRelations(), contains(
      allOf(
        hasProperty("entityId", equalTo(relatedId.toString())),
        hasProperty("relationType", equalTo("isRelatedTo")),
        hasProperty("relationRev", equalTo(2))
      )
    ));
  }

  @Test
  public void getEntityOnlyReturnsAcceptedRelations() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    UUID id = UUID.randomUUID();
    UUID relatedId = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex("source", v -> v
        .withOutgoingRelation(
          "isRelatedTo",
          "relatedThing",
          rel -> rel.withIsLatest(true).withAccepted("testrelation", true)
        )
        .withOutgoingRelation(
          "hasOtherRelation",
          "relatedThing",
          rel -> rel.withIsLatest(true).withAccepted("testrelation", false)
        )
        .withVre("test")
        .withVre("")
        .withType("thing")
        .isLatest(true)
        .withTimId(id.toString())
      )
      .withVertex("relatedThing", v -> v
        .withVre("test")
        .withVre("")
        .withType("thing")
        .withTimId(relatedId.toString())
      ).wrap();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);

    ReadEntity entity = instance.getEntity(id, null, collection,
      (readEntity, vertex) -> {
      },
      (graphTraversalSource, vre, vertex, relationRef) -> {
      }
    );

    assertThat(entity.getRelations(), hasSize(1));
    assertThat(entity.getRelations(), contains(hasProperty("relationType", equalTo("isRelatedTo"))));
  }

  @Test
  public void getEntityReturnsTheTypesOfTheEntity() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    UUID id = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(id.toString())
        .withProperty("isLatest", true)
        .withProperty("rev", 1)
        .withProperty("types", "[\"testthing\", \"otherthing\"]")
      )
      .wrap();

    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);

    ReadEntity entity = instance.getEntity(id, null, collection,
      (readEntity, vertex) -> {
      },
      (graphTraversalSource, vre, vertex, relationRef) -> {
      }
    );

    assertThat(entity.getTypes(), containsInAnyOrder("testthing", "otherthing"));
  }

  @Test(expected = NotFoundException.class)
  public void getEntityThrowsNotFoundIfTheEntityDoesNotContainTheRequestType() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    UUID id = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(id.toString())
        .withType("thing")
        .withVre("other")
        .withProperty("isLatest", true)
        .withProperty("rev", 1)
      ).wrap();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);

    instance.getEntity(id, null, collection,
      (readEntity, vertex) -> {
      },
      (graphTraversalSource, vre, vertex, relationRef) -> {
      }
    );
  }

  @Test(expected = NotFoundException.class)
  public void getEntityThrowsNotFoundIfTheEntityIsDeleted() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    UUID id = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(id.toString())
        .withType("thing")
        .withVre("test")
        .withProperty("isLatest", true)
        .withProperty("deleted", true)
        .withProperty("rev", 1)
      ).wrap();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);

    instance.getEntity(id, null, collection,
      (readEntity, vertex) -> {
      },
      (graphTraversalSource, vre, vertex, relationRef) -> {
      }
    );
  }

  @Test
  public void getEntityAlwaysReturnsTheDeletedProperty() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    UUID id = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(id.toString())
        .withType("thing")
        .withVre("test")
        .withProperty("isLatest", true)
        .withProperty("rev", 1)
      ).wrap();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);

    ReadEntity entity = instance.getEntity(id, null, collection,
      (readEntity, vertex) -> {
      },
      (graphTraversalSource, vre, vertex, relationRef) -> {
      }
    );

    assertThat(entity.getDeleted(), is(false));
  }

  @Test
  public void getEntityReturnsThePid() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    UUID id = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(id.toString())
        .withType("thing")
        .withVre("test")
        .withProperty("isLatest", true)
        .withProperty("rev", 1)
        .withProperty("pid", "pidValue")
      ).wrap();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);

    ReadEntity entity = instance.getEntity(id, null, collection,
      (readEntity, vertex) -> {
      },
      (graphTraversalSource, vre, vertex, relationRef) -> {
      }
    );

    assertThat(entity.getPid(), is("pidValue"));
  }

  @Test
  public void getEntityReturnsANullPidWhenTheEntityDoesNotContainOne() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    UUID id = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(id.toString())
        .withType("thing")
        .withVre("test")
        .withProperty("isLatest", true)
        .withProperty("rev", 1)
      ).wrap();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);

    ReadEntity entity = instance.getEntity(id, null, collection,
      (readEntity, vertex) -> {
      },
      (graphTraversalSource, vre, vertex, relationRef) -> {
      }
    );

    assertThat(entity.getPid(), is(nullValue()));
  }

  @Test
  public void getCollectionReturnsAllTheLatestEntitiesOfACollection() {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    UUID id1 = UUID.randomUUID();
    UUID id2 = UUID.randomUUID();
    UUID id3 = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withLabel("testthing")
        .withType("thing")
        .withVre("test")
        .isLatest(true)
        .withTimId(id1.toString())
      )
      .withVertex(v -> v
        .withLabel("testthing")
        .withType("thing")
        .withVre("test")
        .isLatest(true)
        .withTimId(id2.toString())
      )
      .withVertex(v -> v
        .withLabel("testthing")
        .withType("thing")
        .withVre("test")
        .isLatest(false)
        .withTimId(id2.toString())
      )
      .withVertex(v -> v
        .withLabel("testthing")
        .withType("thing")
        .withVre("test")
        .isLatest(true)
        .withTimId(id3.toString())
      )
      .withVertex(v -> v
        .withLabel("teststuff")
        .withType("stuff")
        .withVre("test")
        .isLatest(true)
        .withTimId(UUID.randomUUID().toString())
      )
      .wrap();

    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);

    DataStream<ReadEntity> entities = instance.getCollection(
      collection, 0, 3, false,
      (readEntity, vertex) -> {
      }, (graphTraversalSource, vre, vertex, relationRef) -> {
      }
    );


    List<UUID> ids = entities.map(ReadEntity::getId);
    assertThat(ids, hasSize(3));
    assertThat(ids, containsInAnyOrder(id1, id2, id3));
  }

  @Test
  public void getCollectionReturnsRelationsIfRequested() {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    UUID thingId = UUID.randomUUID();
    UUID stuffId = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex("v1", v -> v
        .withLabel("testthing")
        .withVre("test")
        .withType("thing")
        .isLatest(true)
        .withTimId(thingId.toString())
        .withOutgoingRelation("isCreatorOf", "stuff")
      )
      .withVertex("stuff", v -> v
        .withVre("test")
        .withType("stuff")
        .withTimId(stuffId.toString())
      )
      .withVertex(v -> v
        .withProperty("relationtype_regularName", "isCreatedBy")
        .withProperty("relationtype_inverseName", "isCreatorOf")
      )
      .wrap();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);

    DataStream<ReadEntity> entities = instance.getCollection(collection, 0, 1, true,
      (readEntity, vertex) -> {
      }, (graphTraversalSource, vre, vertex, relationRef) -> {
      }
    );

    ReadEntity readEntity = entities.map(entity -> entity).get(0);
    assertThat(readEntity.getRelations(), contains(
      allOf(
        hasProperty("entityId", equalTo(stuffId.toString())),
        hasProperty("collectionName", equalTo("teststuffs")),
        hasProperty("entityType", equalTo("teststuff")),
        hasProperty("relationType", equalTo("isCreatorOf"))
      )
    ));
  }

  @Test
  public void getCollectionReturnsTheKnowsDisplayNameForEachItem() {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    UUID id1 = UUID.randomUUID();
    UUID id2 = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withLabel("testthing")
        .withVre("test")
        .withType("thing")
        .isLatest(true)
        .withTimId(id1.toString())
        .withProperty("testthing_displayName", "displayName1") // configured in JsonCrudServiceBuilder
      )
      .withVertex(v -> v
        .withLabel("testthing")
        .withVre("test")
        .withType("thing")
        .isLatest(true)
        .withTimId(id2.toString())
        .withProperty("testthing_displayName", "displayName2") // configured in JsonCrudServiceBuilder
      )
      .wrap();

    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);

    DataStream<ReadEntity> entities = instance.getCollection(collection, 0, 2, true,
      (readEntity, vertex) -> {
      }, (graphTraversalSource, vre, vertex, relationRef) -> {
      }
    );

    List<String> displayNames = entities.map(ReadEntity::getDisplayName);
    assertThat(displayNames, containsInAnyOrder("displayName1", "displayName2"));
  }

  @Test
  public void replaceEntityUpdatesTheRevisionByOne() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    UUID id = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(id.toString())
        .withProperty("isLatest", true)
        .withProperty("rev", 1)
        .withIncomingRelation("VERSION_OF", "orig")
      )
      .withVertex("orig", v -> v
        .withTimId(id.toString())
        .withProperty("isLatest", false)
        .withProperty("rev", 1)
      ).wrap();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);
    UpdateEntity updateEntity = new UpdateEntity(id, Lists.newArrayList(), 1);
    updateEntity.setModified(new Change(Instant.now().toEpochMilli(), "userId", null));

    instance.replaceEntity(collection, updateEntity);

    int rev = (int) graphManager.getGraph().traversal().V()
                                .has("tim_id", id.toString()).has("isLatest", true)
                                .values("rev").next();
    assertThat(rev, is(2));
  }

  @Test
  public void replaceEntityAddsAType() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    UUID id = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(id)
        .withVre("other")
        .withType("thing")
        .withProperty("isLatest", true)
        .withProperty("rev", 1)
        .withProperty("otherthing_prop1", "the name")
        .withIncomingRelation("VERSION_OF", "orig")
      )
      .withVertex("orig", v -> v
        .withTimId(id)
        .withVre("other")
        .withType("thing")
        .withProperty("isLatest", false)
        .withProperty("rev", 1)
        .withProperty("otherthing_prop1", "the name")
      ).wrap();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);
    UpdateEntity updateEntity = new UpdateEntity(id, Lists.newArrayList(), 1);
    updateEntity.setModified(new Change(Instant.now().toEpochMilli(), "userId", null));

    instance.replaceEntity(collection, updateEntity);

    String types = (String) graphManager.getGraph().traversal().V()
                                        .has("tim_id", id.toString())
                                        .has("isLatest", true)
                                        .values("types")
                                        .next();
    assertThat(types, containsString("\"testthing\""));
  }

  @Test
  public void replaceEntityUpdatesModified() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    UUID id = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(id)
        .withVre("test")
        .withType("thing")
        .withProperty("isLatest", true)
        .withProperty("rev", 1)
      ).wrap();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);
    UpdateEntity updateEntity = new UpdateEntity(id, Lists.newArrayList(), 1);
    long timeStamp = Instant.now().toEpochMilli();
    updateEntity.setModified(new Change(timeStamp, "userId", null));

    instance.replaceEntity(collection, updateEntity);

    String modified = (String) graphManager.getGraph().traversal().V()
                                           .has("tim_id", id.toString())
                                           .has("isLatest", true)
                                           .properties("modified").value()
                                           .next();
    assertThat(
      modified,
      sameJSONAs(String.format("{\"timeStamp\": %s,\"userId\": \"%s\"}", timeStamp, "userId"))
    );
  }

  @Test
  public void replaceEntityUpdatesTheKnownProperties() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    UUID id = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(id)
        .withVre("test")
        .withType("thing")
        .withProperty("testthing_prop1", "oldValue")
        .withProperty("isLatest", true)
        .withProperty("rev", 1)
      ).wrap();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);
    ArrayList<TimProperty<?>> properties = Lists.newArrayList(
      new StringProperty("prop1", "newValue"),
      new StringProperty("prop2", "prop2Value")
    );
    UpdateEntity updateEntity = new UpdateEntity(id, properties, 1);
    long timeStamp = Instant.now().toEpochMilli();
    updateEntity.setModified(new Change(timeStamp, "userId", null));

    instance.replaceEntity(collection, updateEntity);

    Vertex vertex = graphManager.getGraph().traversal().V().has("tim_id", id.toString()).has("isLatest", true).next();
    assertThat(vertex, is(
      likeVertex().withProperty("testthing_prop1", "newValue").withProperty("testthing_prop2", "prop2Value")
    ));
  }

  @Test
  public void replaceEntityRemovesThePropertiesThatAreNotProvided() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    UUID id = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(id)
        .withVre("test")
        .withType("thing")
        .withProperty("testthing_prop1", "oldValue1")
        .withProperty("testthing_prop2", "oldValue2")
        .withProperty("isLatest", true)
        .withProperty("rev", 1)
      ).wrap();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);
    ArrayList<TimProperty<?>> properties = Lists.newArrayList(
      new StringProperty("prop1", "newValue")
    );
    UpdateEntity updateEntity = new UpdateEntity(id, properties, 1);
    long timeStamp = Instant.now().toEpochMilli();
    updateEntity.setModified(new Change(timeStamp, "userId", null));

    instance.replaceEntity(collection, updateEntity);

    Vertex vertex = graphManager.getGraph().traversal().V().has("tim_id", id.toString()).has("isLatest", true).next();
    assertThat(vertex, is(likeVertex().withoutProperty("testthing_prop2")));
  }

  @Test
  public void replaceEntityPreparesABackupCopyAfterMakingTheChanges() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    UUID id = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(id)
        .withVre("test")
        .withType("thing")
        .withProperty("isLatest", true)
        .withProperty("rev", 1)
      ).wrap();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);
    List<TimProperty<?>> properties = Lists.newArrayList(
      new StringProperty("prop1", "newValue")
    );
    UpdateEntity updateEntity = new UpdateEntity(id, properties, 1);
    long timeStamp = Instant.now().toEpochMilli();
    updateEntity.setModified(new Change(timeStamp, "userId", null));

    Vertex beforeUpdate = graphManager.getGraph().traversal().V()
                                      .has("tim_id", id.toString())
                                      .has("isLatest", true)
                                      .next();

    instance.replaceEntity(collection, updateEntity);

    Vertex afterUpdate = graphManager.getGraph().traversal().V()
                                     .has("tim_id", id.toString())
                                     .has("isLatest", true)
                                     .next();

    assertThat(afterUpdate.id(), is(not(beforeUpdate.id())));
    assertThat(afterUpdate.edges(Direction.IN).next().outVertex().id(), is(beforeUpdate.id()));
  }

  @Test
  public void replaceEntityMovesTheRelationsToTheNewVertex() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    UUID id = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(id)
        .withVre("test")
        .withType("thing")
        .withProperty("isLatest", true)
        .withProperty("rev", 1)
        .withOutgoingRelation("hasWritten", "stuff")
        .withIncomingRelation("isFriendOf", "friend")
      )
      .withVertex("stuff", v -> v
        .withVre("test")
        .withType("stuff")
        .isLatest(true)
        .withProperty("rev", 1)
      )
      .withVertex("friend", v -> v
        .withVre("test")
        .withType("thing")
        .isLatest(true)
        .withProperty("rev", 1)
      )
      .wrap();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);
    List<TimProperty<?>> properties = Lists.newArrayList(
      new StringProperty("prop1", "newValue")
    );
    UpdateEntity updateEntity = new UpdateEntity(id, properties, 1);
    long timeStamp = Instant.now().toEpochMilli();
    updateEntity.setModified(new Change(timeStamp, "userId", null));

    Vertex origVertex = graphManager.getGraph().traversal().V()
                                    .has("tim_id", id.toString())
                                    .has("isLatest", true)
                                    .next();
    assertThat(stream(origVertex.edges(Direction.BOTH, "hasWritten", "isFriendOf")).count(), is(2L));

    instance.replaceEntity(collection, updateEntity);

    Vertex newVertex = graphManager.getGraph().traversal().V()
                                   .has("tim_id", id.toString())
                                   .has("isLatest", true)
                                   .next();
    assertThat(stream(origVertex.edges(Direction.BOTH, "hasWritten", "isFriendOf")).count(), is(0L));
    assertThat(stream(newVertex.edges(Direction.BOTH, "hasWritten", "isFriendOf")).count(), is(2L));
  }

  @Test(expected = NotFoundException.class)
  public void replaceEntityThrowsANotFoundExceptionWhenTheEntityIsNotInTheDatabase() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    UUID id = UUID.randomUUID();
    TinkerPopGraphManager emptyDatabase = newGraph().wrap();
    TinkerPopOperations instance = forGraphWrapperAndMappings(emptyDatabase, vres);
    UpdateEntity updateEntity = new UpdateEntity(id, Lists.newArrayList(), 1);
    long timeStamp = Instant.now().toEpochMilli();
    updateEntity.setModified(new Change(timeStamp, "userId", null));

    instance.replaceEntity(collection, updateEntity);
  }

  @Test(expected = AlreadyUpdatedException.class)
  public void replaceEntityThrowsAnAlreadyUpdatedExceptionWhenTheRevDoesNotMatch() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testthings").get();
    UUID id = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(id)
        .withVre("test")
        .withType("thing")
        .withProperty("isLatest", true)
        .withProperty("rev", 2)
      ).wrap();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);
    UpdateEntity updateEntity = new UpdateEntity(id, Lists.newArrayList(), 1);
    long timeStamp = Instant.now().toEpochMilli();
    updateEntity.setModified(new Change(timeStamp, "userId", null));

    instance.replaceEntity(collection, updateEntity);
  }

  @Test
  public void acceptRelationCreatesANewRelationWhenItDoesNotExist() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testrelations").get();
    UUID typeId = UUID.randomUUID();
    UUID sourceId = UUID.randomUUID();
    UUID targetId = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(typeId.toString())
        .withType("relationtype")
        .withProperty("relationtype_regularName", "regularName")
        .withProperty("rev", 1)
        .withProperty("isLatest", true)
      )
      .withVertex(v -> v
        .withTimId(sourceId.toString())
        .withProperty("rev", 1)
        .withVre("test")
        .withType("thing")
        .withProperty("isLatest", true)
      )
      .withVertex(v -> v
        .withTimId(targetId.toString())
        .withProperty("rev", 1)
        .withVre("test")
        .withType("thing")
        .withProperty("isLatest", true)
      )
      .wrap();

    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);
    CreateRelation createRelation = new CreateRelation(sourceId, typeId, targetId);
    createRelation.setCreated(new Change(Instant.now().toEpochMilli(), "userId", null));

    UUID relId = instance.acceptRelation(collection, createRelation);

    assertThat(graphManager.getGraph().traversal().E().has("tim_id", relId.toString()).next(), is(likeEdge()
      .withSourceWithId(sourceId)
      .withTargetWithId(targetId)
      .withTypeId(typeId)
    ));
  }

  @Test
  public void acceptRelationCallTheChangeListener() throws Exception {
    ChangeListener changeListener = mock(ChangeListener.class);
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testrelations").get();
    UUID typeId = UUID.randomUUID();
    UUID sourceId = UUID.randomUUID();
    UUID targetId = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(typeId.toString())
        .withType("relationtype")
        .withProperty("relationtype_regularName", "regularName")
        .withProperty("rev", 1)
        .withProperty("isLatest", true)
      )
      .withVertex(v -> v
        .withTimId(sourceId.toString())
        .withProperty("rev", 1)
        .withVre("test")
        .withType("thing")
        .withProperty("isLatest", true)
      )
      .withVertex(v -> v
        .withTimId(targetId.toString())
        .withProperty("rev", 1)
        .withVre("test")
        .withType("thing")
        .withProperty("isLatest", true)
      )
      .wrap();
    TinkerPopOperations instance = forGraphMappingsAndChangeListener(graphManager, vres, changeListener);
    CreateRelation createRelation = new CreateRelation(sourceId, typeId, targetId);
    createRelation.setCreated(new Change(Instant.now().toEpochMilli(), "userId", null));

    instance.acceptRelation(collection, createRelation);

    verify(changeListener).onCreateEdge(argThat(is(sameInstance(collection))), argThat(is(likeEdge()
      .withSourceWithId(sourceId)
      .withTargetWithId(targetId)
      .withTypeId(typeId)
    )));
  }

  @Test
  public void acceptRelationSetsTheCreatedInformation() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testrelations").get();
    UUID typeId = UUID.randomUUID();
    UUID sourceId = UUID.randomUUID();
    UUID targetId = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(typeId.toString())
        .withType("relationtype")
        .withProperty("relationtype_regularName", "regularName")
        .withProperty("rev", 1)
        .withProperty("isLatest", true)
      )
      .withVertex(v -> v
        .withTimId(sourceId.toString())
        .withProperty("rev", 1)
        .withVre("test")
        .withType("thing")
        .withProperty("isLatest", true)
      )
      .withVertex(v -> v
        .withTimId(targetId.toString())
        .withProperty("rev", 1)
        .withVre("test")
        .withType("thing")
        .withProperty("isLatest", true)
      )
      .wrap();

    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);
    CreateRelation createRelation = new CreateRelation(sourceId, typeId, targetId);
    long timeStamp = Instant.now().toEpochMilli();
    String userId = "userId";
    createRelation.setCreated(new Change(timeStamp, userId, null));

    UUID relId = instance.acceptRelation(collection, createRelation);

    Edge newEdge = graphManager.getGraph().traversal().E().has("tim_id", relId.toString()).next();
    assertThat(getModificationInfo("modified", newEdge), is(jsnO(
      "timeStamp", jsn(timeStamp),
      "userId", jsn(userId)
    )));
    assertThat(getModificationInfo("created", newEdge), is(jsnO(
      "timeStamp", jsn(timeStamp),
      "userId", jsn(userId)
    )));
  }

  private ObjectNode getModificationInfo(String prop, Element elm) {
    return getProp(elm, prop, String.class)
      .map(data -> Try.of(() -> (ObjectNode) new ObjectMapper().readTree(data)))
      .orElse(Try.success(null))
      .get();
  }

  @Test(expected = RelationNotPossibleException.class)
  public void acceptRelationThrowsARelationNotPossibleExceptionIfTheSourceIsNotInTheRightVre() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testrelations").get();
    UUID typeId = UUID.randomUUID();
    UUID sourceId = UUID.randomUUID();
    UUID targetId = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(typeId.toString())
        .withType("relationtype")
        .withProperty("relationtype_regularName", "regularName")
        .withProperty("rev", 1)
        .withProperty("isLatest", true)
      )
      .withVertex(v -> v
        .withTimId(sourceId.toString())
        .withProperty("rev", 1)
        .withVre("other")
        .withType("thing")
        .withProperty("isLatest", true)
      )
      .withVertex(v -> v
        .withTimId(targetId.toString())
        .withProperty("rev", 1)
        .withVre("test")
        .withType("thing")
        .withProperty("isLatest", true)
      ).wrap();

    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);
    CreateRelation createRelation = new CreateRelation(sourceId, typeId, targetId);
    createRelation.setCreated(new Change(Instant.now().toEpochMilli(), "userId", null));

    instance.acceptRelation(collection, createRelation);
  }

  @Test(expected = RelationNotPossibleException.class)
  public void acceptRelationThrowsARelationNotPossibleExceptionIfTheTargetIsNotInTheRightVre() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testrelations").get();
    UUID typeId = UUID.randomUUID();
    UUID sourceId = UUID.randomUUID();
    UUID targetId = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(typeId.toString())
        .withType("relationtype")
        .withProperty("relationtype_regularName", "regularName")
        .withProperty("rev", 1)
        .withProperty("isLatest", true)
      )
      .withVertex(v -> v
        .withTimId(sourceId.toString())
        .withProperty("rev", 1)
        .withVre("test")
        .withType("thing")
        .withProperty("isLatest", true)
      )
      .withVertex(v -> v
        .withTimId(targetId.toString())
        .withProperty("rev", 1)
        .withVre("other")
        .withType("thing")
        .withProperty("isLatest", true)
      ).wrap();

    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);
    CreateRelation createRelation = new CreateRelation(sourceId, typeId, targetId);
    createRelation.setCreated(new Change(Instant.now().toEpochMilli(), "userId", null));

    instance.acceptRelation(collection, createRelation);
  }

  @Test(expected = RelationNotPossibleException.class)
  public void acceptRelationsThrowsARelationNotPossibleExceptionIfTheTypeOfTheSourceIsInvalid() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testrelations").get();
    UUID typeId = UUID.randomUUID();
    UUID sourceId = UUID.randomUUID();
    UUID targetId = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(typeId.toString())
        .withType("relationtype")
        .withProperty("relationtype_regularName", "isRelatedTo")
        .withProperty("relationtype_sourceTypeName", "teststuff")
        .withProperty("relationtype_targeTypeName", "testthing")
        .withProperty("rev", 1)
        .withProperty("isLatest", true)
      )
      .withVertex(v -> v
        .withTimId(sourceId.toString())
        .withProperty("rev", 1)
        .withVre("test")
        .withType("thing")
        .withProperty("isLatest", true)
      )
      .withVertex(v -> v
        .withTimId(targetId.toString())
        .withProperty("rev", 1)
        .withVre("test")
        .withType("thing")
        .withProperty("isLatest", true)
      ).wrap();

    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);
    CreateRelation createRelation = new CreateRelation(sourceId, typeId, targetId);
    createRelation.setCreated(new Change(Instant.now().toEpochMilli(), "userId", null));

    instance.acceptRelation(collection, createRelation);
  }

  @Test(expected = RelationNotPossibleException.class)
  public void acceptRelationsThrowsARelationNotPossibleExceptionIfTheTypeOfTheTargetIsInvalid() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testrelations").get();
    UUID typeId = UUID.randomUUID();
    UUID sourceId = UUID.randomUUID();
    UUID targetId = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(typeId.toString())
        .withType("relationtype")
        .withProperty("relationtype_regularName", "isRelatedTo")
        .withProperty("relationtype_sourceTypeName", "testthing")
        .withProperty("relationtype_targeTypeName", "teststuff")
        .withProperty("rev", 1)
        .withProperty("isLatest", true)
      )
      .withVertex(v -> v
        .withTimId(sourceId.toString())
        .withProperty("rev", 1)
        .withVre("test")
        .withType("thing")
        .withProperty("isLatest", true)
      )
      .withVertex(v -> v
        .withTimId(targetId.toString())
        .withProperty("rev", 1)
        .withVre("test")
        .withType("thing")
        .withProperty("isLatest", true)
      ).wrap();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);
    CreateRelation createRelation = new CreateRelation(sourceId, typeId, targetId);
    createRelation.setCreated(new Change(Instant.now().toEpochMilli(), "userId", null));

    instance.acceptRelation(collection, createRelation);
  }

  @Test
  public void replaceRelationUpdatesTheExistingRelation() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testrelations").get();
    UUID typeId = UUID.randomUUID();
    UUID sourceId = UUID.randomUUID();
    UUID targetId = UUID.randomUUID();
    UUID relId = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(typeId.toString())
        .withType("relationtype")
        .withProperty("relationtype_regularName", "regularName")
        .withProperty("rev", 1)
        .withProperty("isLatest", true)
      )
      .withVertex(v -> v
        .withTimId(sourceId.toString())
        .withProperty("rev", 1)
        .withVre("test")
        .withType("thing")
        .withProperty("isLatest", true)
        .withOutgoingRelation("regularName", "otherVertex", r -> r
          .withTim_id(relId)
          .withAccepted("testrelation", true)
          .withTypeId(typeId)
          .withRev(1)
          .addType("testrelation")
        )
      )
      .withVertex("otherVertex", v -> v
        .withTimId(targetId.toString())
        .withProperty("rev", 1)
        .withVre("test")
        .withType("thing")
        .withProperty("isLatest", true)
      )
      .wrap();
    IndexHandler indexHandler = mock(IndexHandler.class);
    when(indexHandler.findEdgeById(relId))
      .thenReturn(Optional.of(graphManager.getGraph().traversal().E().has("tim_id", relId.toString()).next()));
    TinkerPopOperations instance = forGraphMappingsAndIndex(graphManager, vres, indexHandler);
    UpdateRelation updateRelation = new UpdateRelation(relId, 1, false);
    updateRelation.setModified(new Change(Instant.now().toEpochMilli(), "userId", null));

    instance.replaceRelation(collection, updateRelation);

    assertThat(graphManager.getGraph().traversal().E().has("tim_id", relId.toString()).has("isLatest", true).next(),
      is(likeEdge()
        .withSourceWithId(sourceId)
        .withTargetWithId(targetId)
        .withTypeId(typeId)
        .withProperty("testrelation_accepted", false)
      ));
  }

  @Test
  public void replaceRelationUpdatesTheModifiedInformation() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testrelations").get();
    UUID typeId = UUID.randomUUID();
    UUID sourceId = UUID.randomUUID();
    UUID targetId = UUID.randomUUID();
    UUID relId = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(typeId.toString())
        .withType("relationtype")
        .withProperty("relationtype_regularName", "regularName")
        .withProperty("rev", 1)
        .withProperty("isLatest", true)
      )
      .withVertex(v -> v
        .withTimId(sourceId.toString())
        .withProperty("rev", 1)
        .withVre("test")
        .withType("thing")
        .withProperty("isLatest", true)
        .withOutgoingRelation("regularName", "otherVertex", r -> r
          .withTim_id(relId)
          .withAccepted("testrelation", true)
          .withTypeId(typeId)
          .withRev(1)
          .addType("testrelation")
        )
      )
      .withVertex("otherVertex", v -> v
        .withTimId(targetId.toString())
        .withProperty("rev", 1)
        .withVre("test")
        .withType("thing")
        .withProperty("isLatest", true)
      )
      .wrap();
    IndexHandler indexHandler = mock(IndexHandler.class);
    when(indexHandler.findEdgeById(relId))
      .thenReturn(Optional.of(graphManager.getGraph().traversal().E().has("tim_id", relId.toString()).next()));
    TinkerPopOperations instance = forGraphMappingsAndIndex(graphManager, vres, indexHandler);
    UpdateRelation updateRelation = new UpdateRelation(relId, 1, false);
    long timeStamp = Instant.now().toEpochMilli();
    String userId = "userId";
    updateRelation.setModified(new Change(timeStamp, userId, null));

    instance.replaceRelation(collection, updateRelation);

    Edge newEdge = graphManager.getGraph().traversal().E().has("tim_id", relId.toString()).has("isLatest", true).next();
    assertThat(getModificationInfo("modified", newEdge), is(jsnO(
      "timeStamp", jsn(timeStamp),
      "userId", jsn(userId)
    )));
  }

  @Test
  public void replaceRelationDuplicatesTheEdge() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testrelations").get();
    UUID typeId = UUID.randomUUID();
    UUID sourceId = UUID.randomUUID();
    UUID targetId = UUID.randomUUID();
    UUID relId = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(typeId.toString())
        .withType("relationtype")
        .withProperty("relationtype_regularName", "regularName")
        .withProperty("rev", 1)
        .withProperty("isLatest", true)
      )
      .withVertex(v -> v
        .withTimId(sourceId.toString())
        .withProperty("rev", 1)
        .withVre("test")
        .withType("thing")
        .withProperty("isLatest", true)
        .withOutgoingRelation("regularName", "otherVertex", r -> r
          .withTim_id(relId)
          .withAccepted("testrelation", true)
          .withTypeId(typeId)
          .withRev(1)
          .addType("testrelation")
        )
      )
      .withVertex("otherVertex", v -> v
        .withTimId(targetId.toString())
        .withProperty("rev", 1)
        .withVre("test")
        .withType("thing")
        .withProperty("isLatest", true)
      )
      .wrap();
    IndexHandler indexHandler = mock(IndexHandler.class);
    when(indexHandler.findEdgeById(relId))
      .thenReturn(Optional.of(graphManager.getGraph().traversal().E().has("tim_id", relId.toString()).next()));
    TinkerPopOperations instance = forGraphMappingsAndIndex(graphManager, vres, indexHandler);
    UpdateRelation updateRelation = new UpdateRelation(relId, 1, false);
    long timeStamp = Instant.now().toEpochMilli();
    String userId = "userId";
    updateRelation.setModified(new Change(timeStamp, userId, null));

    instance.replaceRelation(collection, updateRelation);

    assertThat(graphManager.getGraph().traversal().E().has("tim_id", relId.toString()).count().next(), is(2L));
  }

  @Test
  public void replaceRelationCallsTheChangeListener() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testrelations").get();
    UUID typeId = UUID.randomUUID();
    UUID sourceId = UUID.randomUUID();
    UUID targetId = UUID.randomUUID();
    UUID relId = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(typeId.toString())
        .withType("relationtype")
        .withProperty("relationtype_regularName", "regularName")
        .withProperty("rev", 1)
        .withProperty("isLatest", true)
      )
      .withVertex(v -> v
        .withTimId(sourceId.toString())
        .withProperty("rev", 1)
        .withVre("test")
        .withType("thing")
        .withProperty("isLatest", true)
        .withOutgoingRelation("regularName", "otherVertex", r -> r
          .withTim_id(relId)
          .withAccepted("testrelation", true)
          .withTypeId(typeId)
          .withRev(1)
          .addType("testrelation")
        )
      )
      .withVertex("otherVertex", v -> v
        .withTimId(targetId.toString())
        .withProperty("rev", 1)
        .withVre("test")
        .withType("thing")
        .withProperty("isLatest", true)
      )
      .wrap();
    ChangeListener changeListener = mock(ChangeListener.class);
    IndexHandler indexHandler = mock(IndexHandler.class);
    when(indexHandler.findEdgeById(relId))
      .thenReturn(Optional.of(graphManager.getGraph().traversal().E().has("tim_id", relId.toString()).next()));
    TinkerPopOperations instance =
      forGraphMappingsListenerAndIndex(graphManager, vres, changeListener, indexHandler);
    UpdateRelation updateRelation = new UpdateRelation(relId, 1, false);
    long timeStamp = Instant.now().toEpochMilli();
    String userId = "userId";
    updateRelation.setModified(new Change(timeStamp, userId, null));

    instance.replaceRelation(collection, updateRelation);

    String acceptedProp = createPropName(collection.getEntityTypeName(), "accepted");
    verify(changeListener).onEdgeUpdate(
      argThat(is(sameInstance(collection))),
      argThat(is(likeEdge().withProperty(acceptedProp, true))),
      argThat(is(likeEdge().withProperty(acceptedProp, false)))
    );
  }

  @Test
  public void replaceRelationUpdatesTheRevisionByOne() throws Exception {
    Vres vres = createConfiguration();
    Collection collection = vres.getCollection("testrelations").get();
    UUID typeId = UUID.randomUUID();
    UUID sourceId = UUID.randomUUID();
    UUID targetId = UUID.randomUUID();
    UUID relId = UUID.randomUUID();
    int relationRev = 1;
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(typeId.toString())
        .withType("relationtype")
        .withProperty("relationtype_regularName", "regularName")
        .withProperty("rev", 1)
        .withProperty("isLatest", true)
      )
      .withVertex(v -> v
        .withTimId(sourceId.toString())
        .withProperty("rev", 1)
        .withVre("test")
        .withType("thing")
        .withProperty("isLatest", true)
        .withOutgoingRelation("regularName", "otherVertex", r -> r
          .withTim_id(relId)
          .withAccepted("testrelation", true)
          .withTypeId(typeId)
          .withRev(relationRev)
          .addType("testrelation")
        )
      )
      .withVertex("otherVertex", v -> v
        .withTimId(targetId.toString())
        .withProperty("rev", 1)
        .withVre("test")
        .withType("thing")
        .withProperty("isLatest", true)
      )
      .wrap();
    IndexHandler indexHandler = mock(IndexHandler.class);
    when(indexHandler.findEdgeById(relId))
      .thenReturn(Optional.of(graphManager.getGraph().traversal().E().has("tim_id", relId.toString()).next()));
    TinkerPopOperations instance = forGraphMappingsAndIndex(graphManager, vres, indexHandler);
    UpdateRelation updateRelation = new UpdateRelation(relId, 1, false);
    updateRelation.setModified(new Change(Instant.now().toEpochMilli(), "userId", null));

    instance.replaceRelation(collection, updateRelation);

    assertThat(graphManager.getGraph().traversal().E().has("tim_id", relId.toString()).has("isLatest", true).next(), is(
      likeEdge().withProperty("rev", relationRev + 1))
    );
  }

  @Test
  public void addPidAddsAPidToEachVertexInTheCollectionWithTheIdAndRev() throws Exception {
    Vres vres = createConfiguration();
    UUID id = UUID.randomUUID();
    int rev = 1;
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(id.toString())
        .withType("relationtype")
        .withProperty("relationtype_regularName", "regularName")
        .withProperty("rev", rev)
        .withProperty("isLatest", true)
        .withIncomingRelation("VERSION_OF", "version")
      ).withVertex("version", v -> v
        .withTimId(id.toString())
        .withType("relationtype")
        .withProperty("relationtype_regularName", "regularName")
        .withProperty("rev", rev)
        .withProperty("isLatest", false)
      ).wrap();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);
    URI pidUri = new URI("http://example.com/pid");

    instance.addPid(id, rev, pidUri);

    assertThat(graphManager.getGraph().traversal().V().has("pid", pidUri.toString()).count().next(), is(2L));
  }

  @Test(expected = NotFoundException.class)
  public void addPidThrowsANotFoundExceptionWhenNoVertexCanBeFound() throws Exception {
    Vres vres = createConfiguration();
    GremlinEntityFetcher entityFetcher = new GremlinEntityFetcher();
    UUID id = UUID.randomUUID();
    int rev = 1;
    TinkerPopGraphManager emptyDatabase = newGraph().wrap();
    TinkerPopOperations instance = forGraphWrapperAndMappings(emptyDatabase, vres);
    URI pidUri = new URI("http://example.com/pid");

    instance.addPid(id, rev, pidUri);
  }

  @Test
  public void doQuickSearchUsesTheIndexToSearchTheEntity() {
    Vres vres = createConfiguration();
    GremlinEntityFetcher entityFetcher = new GremlinEntityFetcher();
    UUID id1 = UUID.randomUUID();
    UUID id2 = UUID.randomUUID();
    UUID id3 = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(id1)
        .withType("thing")
        .withVre("test")
        .withProperty("rev", 1)
        .withProperty("testthing_displayName", "matching")
        .isLatest(true)
        .withLabel("testthing")
      )
      .withVertex(v -> v
        .withTimId(id2)
        .withType("thing")
        .withVre("test")
        .withProperty("rev", 1)
        .withProperty("testthing_displayName", "also matching")
        .isLatest(true)
        .withLabel("testthing")
      )
      .withVertex(v -> v
        .withTimId(id3)
        .withType("thing")
        .withVre("test")
        .withProperty("rev", 1)
        .withProperty("testthing_displayName", "different name")
        .isLatest(true)
        .withLabel("testthing")
      ).wrap();
    IndexHandler indexHandler = mock(IndexHandler.class);
    when(indexHandler.hasQuickSearchIndexFor(any(Collection.class))).thenReturn(true);
    when(indexHandler.findByQuickSearch(any(Collection.class), any()))
      .thenReturn(graphManager.getGraph().traversal().V().has("tim_id",
        within(id1.toString(), id2.toString())));
    TinkerPopOperations instance =
      new TinkerPopOperations(graphManager, mock(ChangeListener.class), entityFetcher, vres, indexHandler);
    Collection collection = vres.getCollection("testthings").get();
    QuickSearch quickSearch = QuickSearch.fromQueryString("matching");

    List<QuickSearchResult> result = instance.doQuickSearch(collection, quickSearch, 3);

    assertThat(result.stream().map(e -> e.getId()).collect(toList()), containsInAnyOrder(id1, id2));

    verify(indexHandler).findByQuickSearch(collection, quickSearch);
  }

  @Test
  public void doQuickSearchLetsLimitTheAmountOfResults() {
    Vres vres = createConfiguration();
    GremlinEntityFetcher entityFetcher = new GremlinEntityFetcher();
    UUID id1 = UUID.randomUUID();
    UUID id2 = UUID.randomUUID();
    UUID id3 = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(id1)
        .withType("thing")
        .withVre("test")
        .withProperty("rev", 1)
        .withProperty("testthing_displayName", "matching")
        .isLatest(true)
        .withLabel("testthing")
      )
      .withVertex(v -> v
        .withTimId(id2)
        .withType("thing")
        .withVre("test")
        .withProperty("rev", 1)
        .withProperty("testthing_displayName", "also matching")
        .isLatest(true)
        .withLabel("testthing")
      )
      .withVertex(v -> v
        .withTimId(id3)
        .withType("thing")
        .withVre("test")
        .withProperty("rev", 1)
        .withProperty("testthing_displayName", "different name")
        .isLatest(true)
        .withLabel("testthing")
      ).wrap();
    IndexHandler indexHandler = mock(IndexHandler.class);
    when(indexHandler.hasQuickSearchIndexFor(any(Collection.class))).thenReturn(true);
    when(indexHandler.findByQuickSearch(any(Collection.class), any()))
      .thenReturn(graphManager.getGraph().traversal().V().has("tim_id",
        within(id1.toString(), id2.toString())));
    TinkerPopOperations instance =
      new TinkerPopOperations(graphManager, mock(ChangeListener.class), entityFetcher, vres, indexHandler);
    Collection collection = vres.getCollection("testthings").get();
    QuickSearch quickSearch = QuickSearch.fromQueryString("matching");

    List<QuickSearchResult> result = instance.doQuickSearch(collection, quickSearch, 1);

    assertThat(result, hasSize(1));
  }

  @Test
  public void doKeywordQuickSearchUsesAnIndexToRetrieveTheResults() {
    Vres vres = createConfiguration();
    GremlinEntityFetcher entityFetcher = new GremlinEntityFetcher();
    UUID id1 = UUID.randomUUID();
    UUID id2 = UUID.randomUUID();
    UUID id3 = UUID.randomUUID();
    String keywordType = "keywordType";
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(id1)
        .withType("keyword")
        .withVre("test")
        .withProperty("rev", 1)
        .withProperty("testkeyword_displayName", "matching")
        .isLatest(true)
        .withProperty("keyword_type", keywordType)
        .withLabel("testkeyword")
      )
      .withVertex(v -> v
        .withTimId(id2)
        .withType("keyword")
        .withVre("test")
        .withProperty("rev", 1)
        .withProperty("testkeyword_displayName", "also matching")
        .isLatest(true)
        .withProperty("keyword_type", keywordType)
        .withLabel("testkeyword")
      )
      .withVertex(v -> v
        .withTimId(id3)
        .withType("keyword")
        .withVre("test")
        .withProperty("rev", 1)
        .withProperty("testkeyword_displayName", "different name")
        .isLatest(true)
        .withProperty("keyword_type", keywordType)
        .withLabel("testkeyword")
      ).wrap();
    IndexHandler indexHandler = mock(IndexHandler.class);
    when(indexHandler.hasQuickSearchIndexFor(any(Collection.class))).thenReturn(true);
    when(indexHandler.findKeywordsByQuickSearch(any(Collection.class), any(), anyString())).thenReturn(
      graphManager.getGraph().traversal().V().has("tim_id", within(id1.toString(), id2.toString()))
    );
    TinkerPopOperations instance =
      new TinkerPopOperations(graphManager, mock(ChangeListener.class), entityFetcher, vres, indexHandler);
    Collection collection = vres.getCollection("testkeywords").get();
    QuickSearch quickSearch = QuickSearch.fromQueryString("matching");

    List<QuickSearchResult> result = instance.doKeywordQuickSearch(collection, keywordType, quickSearch, 3);

    assertThat(result.stream().map(e -> e.getId()).collect(toList()), contains(id1, id2));
    verify(indexHandler).findKeywordsByQuickSearch(collection, quickSearch, keywordType);
  }

  @Test
  public void doKeywordQuickSearchLetsLimitLimitTheAmountOfResults() {
    Vres vres = createConfiguration();
    GremlinEntityFetcher entityFetcher = new GremlinEntityFetcher();
    UUID id1 = UUID.randomUUID();
    UUID id2 = UUID.randomUUID();
    UUID id3 = UUID.randomUUID();
    String keywordType = "keywordType";
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(id1)
        .withType("keyword")
        .withVre("test")
        .withProperty("rev", 1)
        .withProperty("testkeyword_displayName", "matching")
        .isLatest(true)
        .withProperty("keyword_type", keywordType)
        .withLabel("testkeyword")
      )
      .withVertex(v -> v
        .withTimId(id2)
        .withType("keyword")
        .withVre("test")
        .withProperty("rev", 1)
        .withProperty("testkeyword_displayName", "also matching")
        .isLatest(true)
        .withProperty("keyword_type", keywordType)
        .withLabel("testkeyword")
      )
      .withVertex(v -> v
        .withTimId(id3)
        .withType("keyword")
        .withVre("test")
        .withProperty("rev", 1)
        .withProperty("testkeyword_displayName", "different name")
        .isLatest(true)
        .withProperty("keyword_type", keywordType)
        .withLabel("testkeyword")
      ).wrap();
    IndexHandler indexHandler = mock(IndexHandler.class);
    when(indexHandler.hasQuickSearchIndexFor(any(Collection.class))).thenReturn(true);
    when(indexHandler.findKeywordsByQuickSearch(any(Collection.class), any(), anyString())).thenReturn(
      graphManager.getGraph().traversal().V().has("tim_id", within(id1.toString(), id2.toString()))
    );
    TinkerPopOperations instance =
      new TinkerPopOperations(graphManager, mock(ChangeListener.class), entityFetcher, vres, indexHandler);
    Collection collection = vres.getCollection("testkeywords").get();
    QuickSearch quickSearch = QuickSearch.fromQueryString("matching");

    List<QuickSearchResult> result = instance.doKeywordQuickSearch(collection, keywordType, quickSearch, 1);

    assertThat(result, hasSize(1));
  }

  @Test
  public void getEntityByRdfUriReturnsAnEmptyOptionalIfTheEntityCannotBeFound() {
    Vres vres = createConfiguration();
    TinkerPopOperations instance = forGraphWrapperAndMappings(newGraph().wrap(), vres);
    Collection collection = vres.getCollection("testthings").get();

    Optional<ReadEntity> readEntity = instance.getEntityByRdfUri(collection, "http://example.com/entity", false);

    assertThat(readEntity, is(not(present())));
  }

  @Test
  public void getEntityByRdfUriReturnsTheLatestEntity() {
    UUID id1 = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(id1)
        .withType("thing")
        .withVre("test")
        .withProperty("rdfUri", "http://example.com/entity")
        .withProperty("rev", 2)
        .isLatest(true)
        .withLabel("testthing")
      )
      .withVertex(v -> v
        .withTimId(id1)
        .withType("thing")
        .withVre("test")
        .withProperty("rdfUri", "http://example.com/entity")
        .isLatest(false)
        .withProperty("rev", 1)
        .withLabel("testthing")
      )
      .wrap();
    Vres vres = createConfiguration();
    IndexHandler indexHandler = mock(IndexHandler.class);
    Vertex vertex = graphManager.getGraph().traversal().V().has("tim_id", id1.toString()).next();
    when(indexHandler.findVertexInRdfIndex(any(Vre.class), anyString())).thenReturn(Optional.of(vertex));
    TinkerPopOperations instance = forGraphMappingsAndIndex(graphManager, vres, indexHandler);
    Collection collection = vres.getCollection("testthings").get();

    Optional<ReadEntity> readEntity = instance.getEntityByRdfUri(collection, "http://example.com/entity", false);

    assertThat(readEntity, is(present()));
    assertThat(readEntity.get(), hasProperty("rev", equalTo(2)));
  }

  @Test
  public void getRelationTypesReturnsAllTheRelationTypesInTheDatabase() {
    UUID id1 = UUID.randomUUID();
    UUID id2 = UUID.randomUUID();
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex(v -> v
        .withTimId(id1)
        .withType("relationtype")
        .withProperty("rdfUri", "http://example.com/entity1")
        .withProperty("rev", 2)
        .isLatest(true)
        .withLabel("relationtype")
      )
      .withVertex(v -> v
        .withTimId(id2)
        .withType("relationstype")
        .withVre("test")
        .withProperty("rdfUri", "http://example.com/entity1")
        .isLatest(false)
        .withProperty("rev", 1)
        .withLabel("relationtype")
      )
      .withVertex(v -> v
        .withTimId(UUID.randomUUID())
        .withType("othertype")
        .withVre("test")
        .withProperty("rdfUri", "http://example.com/entity1")
        .isLatest(false)
        .withProperty("rev", 1)
        .withLabel("othertype")
      )
      .wrap();
    Vres vres = createConfiguration();
    TinkerPopOperations instance = forGraphWrapperAndMappings(graphManager, vres);

    List<RelationType> relationTypes = instance.getRelationTypes();

    assertThat(relationTypes, hasSize(2));
  }

  @Test
  public void addCollectionToVreAddsACollectionToTheVre() {
    TinkerPopOperations instance = TinkerPopOperationsStubs.newInstance();
    Vre vre = instance.ensureVreExists("vre");

    CreateCollection collection = CreateCollection.forEntityTypeName("entityTypeName");
    instance.addCollectionToVre(vre, collection);

    Vres vres = instance.loadVres();
    Vre vre1 = vres.getVre("vre");
    assertThat(vre1.getCollectionForCollectionName(collection.getCollectionName(vre1)), is(present()));
  }

  @Test
  public void addCollectionToVreDoesNotAddTheCollectionWhenTheVreAlreadyHasACollectionWithTheSameName() {
    TinkerPopGraphManager graphManager = newGraph().wrap();
    TinkerPopOperations instance = forGraphWrapper(graphManager);
    Vre vre = instance.ensureVreExists("vre");

    CreateCollection collection = CreateCollection.forEntityTypeName("entityTypeName");
    instance.addCollectionToVre(vre, collection);
    instance.addCollectionToVre(vre, collection);

    assertThat(graphManager.getGraph().traversal().V().hasLabel(Collection.DATABASE_LABEL)
                           .has(ENTITY_TYPE_NAME_PROPERTY_NAME, collection.getEntityTypeName(vre)).count()
                           .next(),
      is(1L));
  }

  @Test
  public void assertEntityCreatesANewEntityIfTheEntityDoesNotExist() {
    TinkerPopGraphManager graphManager = newGraph().wrap();
    TinkerPopOperations instance = forGraphWrapper(graphManager);
    Vre vre = minimalCorrectVre(instance, "vre");

    instance.assertEntity(vre, "http://example.org/1");

    assertThat(instance.getVertexByRdfUri(vre, "http://example.org/1"), is(present()));
  }

  @Test
  public void assertEntitySetsTheRdfUriProperty() {
    TinkerPopGraphManager graphManager = newGraph().wrap();
    TinkerPopOperations instance = forGraphWrapper(graphManager);
    Vre vre = minimalCorrectVre(instance, "vre");

    instance.assertEntity(vre, "http://example.org/1");

    assertThat(graphManager.getGraph().traversal().V().values(RDF_SYNONYM_PROP).next(),
      is(new String[] {"http://example.org/1"}));
  }

  @Test
  public void assertEntityAddsCreatedEntitiesToTheDefaultCollection() {
    TinkerPopGraphManager graphManager = newGraph().wrap();
    TinkerPopOperations instance = forGraphWrapper(graphManager);
    Vre vre = minimalCorrectVre(instance, "vre");

    instance.assertEntity(vre, "http://example.org/1");

    assertThat(graphManager.getGraph().traversal().V()
                           .has(ENTITY_TYPE_NAME_PROPERTY_NAME, defaultEntityTypeName(vre))
                           .out(HAS_ENTITY_NODE_RELATION_NAME)
                           .out(HAS_ENTITY_RELATION_NAME).count().next(),
      is(1L));
  }

  @Test
  public void assertEntityDoesNotReCreateEntitiesThatAlreadyExist() {
    TinkerPopGraphManager graphManager = newGraph().wrap();
    TinkerPopOperations instance = forGraphWrapper(graphManager);
    Vre vre = minimalCorrectVre(instance, "vre");

    long administrativeVertices = graphManager.getGraph().traversal().V().count().next();
    instance.assertEntity(vre, "http://example.org/1");
    instance.assertEntity(vre, "http://example.org/1");

    assertThat(graphManager.getGraph().traversal().V().count().next(), is(administrativeVertices + 1));
  }

  @Test
  public void assertPropertyAddsThePropertyOnTheEntity() {
    TinkerPopGraphManager graphManager = newGraph().wrap();
    TinkerPopOperations instance = forGraphWrapper(graphManager);
    String vreName = "vre";
    Vre vre = minimalCorrectVre(instance, vreName);

    instance.assertProperty(
      vre,
      "http://example.org/1",
      new RdfProperty(
        "http://example.org/propName",
        "value",
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"
      )
    );

    List<Object> values = graphManager.getGraph().traversal().V()
                                      .values(defaultEntityTypeName(vre) + "_" + "http://example.org/propName")
                                      .toList();
    assertThat(values, contains("value"));
  }

  @Test
  public void assertPropertyOverwritesThePropertyOnTheEntity() {
    TinkerPopGraphManager graphManager = newGraph().wrap();
    TinkerPopOperations instance = forGraphWrapper(graphManager);
    String vreName = "vre";
    Vre vre = minimalCorrectVre(instance, vreName);

    instance.assertProperty(
      vre,
      "http://example.org/1",
      new RdfProperty(
        "http://example.org/propName",
        "value",
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"
      )
    );

    instance.assertProperty(
      vre,
      "http://example.org/1",
      new RdfProperty(
        "http://example.org/propName",
        "somethingCompletelyDifferent",
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"
      )
    );

    List<Object> values = graphManager.getGraph().traversal().V()
                                      .values(defaultEntityTypeName(vre) + "_" + "http://example.org/propName")
                                      .toList();
    assertThat(values, contains("somethingCompletelyDifferent"));
  }

  @Test
  public void assertPropertyAlsoAddsAnAdminVersionOfTheProperty() {
    TinkerPopGraphManager graphManager = newGraph().wrap();
    TinkerPopOperations instance = forGraphWrapper(graphManager);
    Vre vre = minimalCorrectVre(instance, "vre");


    instance.assertProperty(
      vre,
      "http://example.org/1",
      new RdfProperty(
        "http://example.org/propName",
        "value",
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"
      )
    );

    List<Object> values = graphManager.getGraph().traversal().V()
                                      .values(defaultEntityTypeName("vre") + "_" + "http://example.org/propName")
                                      .toList();
    assertThat(values, contains("value"));
  }

  @Test
  public void assertPropertyWillKeepTrackOfThePredicate() {
    TinkerPopOperations instance = TinkerPopOperationsStubs.newInstance();
    Vre vre = instance.ensureVreExists("vre");
    instance.addCollectionToVre(vre, CreateCollection.defaultCollection("vre"));
    instance.addPredicateValueTypeVertexToVre(vre);
    vre = instance.loadVres().getVre("vre");
    Collection defaultCollection = vre.getCollectionForTypeName(defaultEntityTypeName(vre));

    instance.assertProperty(
      vre,
      "http://example.org/1",
      new RdfProperty(
        "http://example.org/propName",
        "value",
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"
      )
    );
    instance.assertProperty(
      vre,
      "http://example.org/2",
      new RdfProperty(
        "http://example.org/propName",
        "value",
        "http://www.w3.org/2001/XMLSchema#float"
      )
    );

    List<PredicateInUse> predicates = instance.getPredicatesFor(defaultCollection);
    assertThat(predicates, contains(hasProperty("predicateUri", equalTo("http://example.org/propName"))));
    List<ValueTypeInUse> valueTypes = predicates.get(0).getValueTypes();
    assertThat(valueTypes, containsInAnyOrder(
      allOf(
        hasProperty("typeUri", equalTo("http://www.w3.org/2001/XMLSchema#float")),
        hasProperty("entitiesConnected", contains("http://example.org/2"))
      ),
      allOf(
        hasProperty("typeUri", equalTo("http://www.w3.org/1999/02/22-rdf-syntax-ns#langString")),
        hasProperty("entitiesConnected", contains("http://example.org/1"))
      )
    ));
  }

  @Test
  public void retractPropertyRemovesTheProperty() {
    TinkerPopGraphManager graphManager = newGraph().wrap();
    TinkerPopOperations instance = forGraphWrapper(graphManager);
    Vre vre = minimalCorrectVre(instance, "vre");

    instance.assertEntity(vre, "http://example.org/1");

    long minimalPropertyCount = graphManager.getGraph().traversal().V()
                                            .has(RDF_URI_PROP, "http://example.org/1")
                                            .properties()
                                            .count().next();

    instance.assertProperty(
      vre,
      "http://example.org/1",
      new RdfProperty(
        "http://example.org/propName",
        "value",
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"
      )
    );

    instance.retractProperty(
      vre,
      "http://example.org/1",
      new RdfProperty(
        "http://example.org/propName",
        "somethingCompletelyDifferent",
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"
      )
    );

    Long entitiesWithPropName = graphManager.getGraph().traversal().V()
                                            .has(RDF_URI_PROP, "http://example.org/1")
                                            .properties()
                                            .count().next() - minimalPropertyCount;
    assertThat(entitiesWithPropName, is(0L));
  }

  @Test
  public void retractPropertyRemovesTheValueTypeFromThePredicateIfItDoesNotApplyToAnyEntity() {
    TinkerPopGraphManager graphManager = newGraph().wrap();
    TinkerPopOperations instance = forGraphWrapper(graphManager);
    Vre vre = minimalCorrectVre(instance, "vre");
    Collection defaultCollection = vre.getCollectionForTypeName(defaultEntityTypeName(vre));
    RdfProperty stringProperty = new RdfProperty(
      "http://example.org/propName",
      "value",
      "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"
    );
    RdfProperty floatProperty = new RdfProperty(
      "http://example.org/propName",
      "1.5",
      "http://www.w3.org/2001/XMLSchema#float"
    );
    instance.assertProperty(vre, "http://example.org/1", stringProperty);
    instance.assertProperty(vre, "http://example.org/2", floatProperty);
    instance.assertProperty(vre, "http://example.org/3", floatProperty);

    instance.retractProperty(vre, "http://example.org/1", stringProperty);
    instance.retractProperty(vre, "http://example.org/2", floatProperty);

    List<PredicateInUse> predicates = instance.getPredicatesFor(defaultCollection);
    assertThat(predicates, hasSize(1));
    assertThat(
      predicates.get(0).getValueTypes(),
      contains(hasProperty("typeUri", equalTo("http://www.w3.org/2001/XMLSchema#float")))
    );
  }

  @Test
  public void retractRemovesThePredicateWhenNoValueTypesAreConnected() {
    TinkerPopGraphManager graphManager = newGraph().wrap();
    TinkerPopOperations instance = forGraphWrapper(graphManager);
    Vre vre = minimalCorrectVre(instance, "vre");
    Collection defaultCollection = vre.getCollectionForTypeName(defaultEntityTypeName(vre));
    RdfProperty stringProperty = new RdfProperty(
      "http://example.org/propName",
      "value",
      "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"
    );
    instance.assertProperty(vre, "http://example.org/1", stringProperty);

    instance.retractProperty(vre, "http://example.org/1", stringProperty);

    List<PredicateInUse> predicates = instance.getPredicatesFor(defaultCollection);
    assertThat(predicates, is(empty()));
  }

  @Test
  public void retractPropertyWillBeANoopIfTheEntityDoesNotYetExist() {
    TinkerPopGraphManager graphManager = newGraph().wrap();
    TinkerPopOperations instance = forGraphWrapper(graphManager);
    Vre vre = instance.ensureVreExists("vre");

    instance.retractProperty(
      vre,
      "http://example.org/1",
      new RdfProperty(
        "http://example.org/propName",
        "somethingCompletelyDifferent",
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"
      )
    );

    Long entitiesWithPropName = graphManager.getGraph().traversal().V()
                                            .has(RDF_URI_PROP, "http://example.org/1")
                                            .count().next();
    assertThat(entitiesWithPropName, is(0L));
  }

  @Test
  public void retrievePropertyReturnsThePropertyOfTheEntity() {
    TinkerPopGraphManager graphManager = newGraph().wrap();
    TinkerPopOperations instance = forGraphWrapper(graphManager);
    String vreName = "vre";
    Vre vre = minimalCorrectVre(instance, vreName);
    String entityRdfUri = "http://example.org/1";
    String predicateUri = "http://example.org/propName";
    String value = "value";
    instance.assertProperty(
      vre,
      entityRdfUri,
      new RdfProperty(
        predicateUri,
        value,
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"
      )
    );

    Optional<RdfReadProperty> rdfProperty = instance.retrieveProperty(vre, entityRdfUri, predicateUri);

    assertThat(rdfProperty, is(present()));
    assertThat(rdfProperty.get().getValue(), is(value));
  }

  @Test
  public void retrievePropertyReturnsAnEmptyOptionalWhenTheEntityDoesNotExist() {
    TinkerPopGraphManager graphManager = newGraph().wrap();
    TinkerPopOperations instance = forGraphWrapper(graphManager);
    String vreName = "vre";
    Vre vre = minimalCorrectVre(instance, vreName);
    String entityRdfUri = "http://example.org/1";
    String predicateUri = "http://example.org/propName";

    Optional<RdfReadProperty> rdfProperty = instance.retrieveProperty(vre, entityRdfUri, predicateUri);

    assertThat(rdfProperty, is(not(present())));
  }

  @Test
  public void retrievePropertyReturnsAnEmtptyOptionWhenTheVertexDoesNotContainTheProperty() {
    TinkerPopGraphManager graphManager = newGraph().wrap();
    TinkerPopOperations instance = forGraphWrapper(graphManager);
    String vreName = "vre";
    Vre vre = minimalCorrectVre(instance, vreName);
    String entityRdfUri = "http://example.org/1";
    String predicateUri = "http://example.org/propName";
    instance.assertEntity(vre, entityRdfUri); // make sure the vertex exist

    Optional<RdfReadProperty> rdfProperty = instance.retrieveProperty(vre, entityRdfUri, predicateUri);

    assertThat(rdfProperty, is(not(present())));
  }

  @Test
  public void getEntitiesWithUnknownTypeReturnsAllTheEntitiesInTheDefaultCollectionOfTheVre() {
    TinkerPopOperations instance = TinkerPopOperationsStubs.newInstance();
    Vre vre = instance.ensureVreExists("vre");
    instance.addCollectionToVre(vre, CreateCollection.defaultCollection("vre"));
    vre = instance.loadVres().getVre("vre");
    instance.assertEntity(vre, "http://example.org/entity1");
    instance.assertEntity(vre, "http://example.org/entity2");

    List<String> entitiesWithUnknownType = instance.getEntitiesWithUnknownType(vre);

    assertThat(entitiesWithUnknownType, containsInAnyOrder("http://example.org/entity1", "http://example.org/entity2"));
  }

  @Test
  public void getEntitiesWithUnknownTypeDoesNotReturnEntitiesWithACollection() {
    TinkerPopGraphManager wrap = newGraph().wrap();
    TinkerPopOperations instance = forGraphWrapper(wrap);
    final Database legacyRdfDatabase = new Database(wrap);
    Vre vre = instance.ensureVreExists("vre");
    instance.addCollectionToVre(vre, CreateCollection.defaultCollection("vre"));

    Vre admin = instance.ensureVreExists("Admin");
    instance.addCollectionToVre(admin, CreateCollection.defaultCollection("Admin"));

    vre = instance.loadVres().getVre("vre");

    instance.assertEntity(vre, "http://example.org/entity1");
    instance.assertEntity(vre, "http://example.org/entity2");
    nl.knaw.huygens.timbuctoo.rdf.Collection collection =
      legacyRdfDatabase.findOrCreateCollection("vre",
        NodeFactory.createURI("http://example.org/myCollection").getURI(),
        NodeFactory.createURI("http://example.org/myCollection").getLocalName());
    Optional<Entity> entity = legacyRdfDatabase.findEntity("vre", NodeFactory.createURI("http://example.org/entity1"));
    entity.get().addToCollection(collection);

    List<String> entitiesWithUnknownType = instance.getEntitiesWithUnknownType(vre);

    assertThat(entitiesWithUnknownType, containsInAnyOrder("http://example.org/entity2"));
  }

  @Test
  public void finishEntitiesSetsTheAdministrativeProperties() {
    TinkerPopGraphManager graphManager = newGraph().wrap();
    TinkerPopOperations instance = forGraphWrapper(graphManager);
    Vre vre = instance.ensureVreExists("vre");
    instance.addCollectionToVre(vre, CreateCollection.defaultCollection("vre"));
    vre = instance.loadVres().getVre("vre");
    Vertex e1 = instance.assertEntity(vre, "http://example.org/entity1");
    Vertex e2 = instance.assertEntity(vre, "http://example.org/entity2");

    instance.finishEntities(vre, new EntityFinisherHelper());

    assertThat(graphManager.getGraph().traversal().V(e1.id())
                           .has("tim_id").has("rev").has("modified").has("created").has("types").hasNext(), is(true));
    assertThat(graphManager.getGraph().traversal().V(e2.id())
                           .has("tim_id").has("rev").has("modified").has("created").has("types").hasNext(), is(true));

  }

  @Test
  public void finishEntitiesCallsTheChangeListener() {
    ChangeListener changeListener = mock(ChangeListener.class);
    TinkerPopOperations instance = TinkerPopOperationsStubs.forChangeListenerMock(changeListener);
    Vre vre = instance.ensureVreExists("vre");
    instance.addCollectionToVre(vre, CreateCollection.defaultCollection("vre"));
    vre = instance.loadVres().getVre("vre");
    Collection defaultCollection = vre.getCollectionForTypeName(defaultEntityTypeName(vre));
    Vertex orig = instance.assertEntity(vre, "http://example.org/entity1");

    instance.finishEntities(vre, new EntityFinisherHelper());
    Vertex duplicate = orig.vertices(Direction.OUT, VERSION_OF).next();

    verify(changeListener)
      .onCreate(eq(defaultCollection), eq(duplicate));
    verify(changeListener).onAddToCollection(
      eq(defaultCollection),
      eq(Optional.empty()),
      eq(duplicate)
    );
  }

  @Test
  public void finishEntitiesDuplicatesTheVertices() {
    TinkerPopGraphManager graphManager = newGraph().wrap();
    TinkerPopOperations instance = forGraphWrapper(graphManager);
    Vre vre = instance.ensureVreExists("vre");
    instance.addCollectionToVre(vre, CreateCollection.defaultCollection("vre"));
    vre = instance.loadVres().getVre("vre");
    Vertex orig = instance.assertEntity(vre, "http://example.org/entity1");

    instance.finishEntities(vre, new EntityFinisherHelper());

    assertThat(orig.edges(Direction.OUT, VERSION_OF).hasNext(), is(true));
  }

  @Test
  public void addPropertiesToCollectionsAddsPropertyDescriptionsToTheCollection() {
    TinkerPopGraphManager graphManager = newGraph().wrap();
    TinkerPopOperations instance = forGraphWrapper(graphManager);
    Vre vre = instance.ensureVreExists("vre");
    instance.addCollectionToVre(vre, CreateCollection.defaultCollection("vre"));
    vre = instance.loadVres().getVre("vre");
    Collection collection = vre.getCollectionForTypeName(defaultEntityTypeName(vre));

    ImmutableCreateProperty prop1 = ImmutableCreateProperty.builder()
                                                           .clientName("clientName1")
                                                           .propertyType("string")
                                                           .rdfUri("http://example.org/pred1")
                                                           .typeUri("http://example.org/string")
                                                           .build();
    ImmutableCreateProperty prop2 = ImmutableCreateProperty.builder()
                                                           .clientName("clientName2")
                                                           .propertyType("string")
                                                           .rdfUri("http://example.org/pred2")
                                                           .typeUri("http://example.org/string")
                                                           .build();

    instance.addPropertiesToCollection(collection, Lists.newArrayList(prop1, prop2));

    collection = instance.loadVres().getCollectionForType(defaultEntityTypeName(vre)).get();
    assertThat(collection.getReadableProperties().values(), hasSize(2));
    List<Vertex> properties = graphManager.getGraph().traversal().V().hasLabel("property").toList();
    assertThat(properties, containsInAnyOrder(
      likeVertex().withProperty("clientName", "@displayName"),
      likeVertex()
        .withProperty("clientName", "clientName1")
        .withProperty("dbName", collection.getEntityTypeName() + "_" + "http://example.org/pred1")
        .withProperty("propertyType", "string")
        .withProperty("rdfUri", "http://example.org/pred1")
        .withProperty("typeUri", "http://example.org/string"),
      likeVertex()
        .withProperty("clientName", "clientName2")
        .withProperty("dbName", collection.getEntityTypeName() + "_" + "http://example.org/pred2")
        .withProperty("propertyType", "string")
        .withProperty("rdfUri", "http://example.org/pred2")
        .withProperty("typeUri", "http://example.org/string")
    ));
  }

  @Test
  public void deleteVreRemovesAllTheVresRawCollectionsFromDatabase() {
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex("vreName", v -> v
        .withLabel("VRE")
        .withProperty(Vre.VRE_NAME_PROPERTY_NAME, "vreName")
        .withOutgoingRelation(RAW_COLLECTION_EDGE_NAME, "rawCollection")
      )
      .withVertex("rawCollection", v -> v
        .withProperty(RAW_COLLECTION_NAME_PROPERTY_NAME, "rawCollection")
        .withOutgoingRelation(RAW_ITEM_EDGE_NAME, "rawItem")
        .withOutgoingRelation(RAW_PROPERTY_EDGE_NAME, "rawProperty")
      )
      .withVertex("rawProperty", v -> v
        .withProperty("tim_id", "a")
      )
      .withVertex("rawItem", v -> v
        .withProperty("tim_id", "b")
      )
      .withVertex("someThingFromDifferentVre", v -> v
        .withProperty("other", true)
      )
      .wrap();
    TinkerPopOperations instance = forGraphWrapper(graphManager);

    instance.deleteVre("vreName");

    Graph graph = graphManager.getGraph();
    assertThat(graph.traversal().V().has(Vre.VRE_NAME_PROPERTY_NAME, "vreName").hasNext(),
      equalTo(false));

    assertThat(graph.traversal().V().has(RAW_COLLECTION_NAME_PROPERTY_NAME, "rawCollection").hasNext(),
      equalTo(false));

    assertThat(graph.traversal().V().has("tim_id").hasNext(), equalTo(false));

    assertThat(graph.traversal().V().has("other").hasNext(), equalTo(true));
  }

  @Test
  public void deleteVreRemovesAllTheVresCollectionsFromDatabase() {
    TinkerPopGraphManager graphManager = newGraph()
      .withVertex("vreName", v -> v
        .withLabel("VRE")
        .withProperty(Vre.VRE_NAME_PROPERTY_NAME, "vreName")
        .withOutgoingRelation(HAS_COLLECTION_RELATION_NAME, "collection1")
        .withOutgoingRelation(HAS_COLLECTION_RELATION_NAME, "collection2")
      )
      .withVertex("collection1", v -> v
        .withProperty(COLLECTION_NAME_PROPERTY_NAME, "collection1")
        .withProperty(ENTITY_TYPE_NAME_PROPERTY_NAME, "entityType1")
        .withProperty(IS_RELATION_COLLECTION_PROPERTY_NAME, true)
        .withOutgoingRelation(HAS_DISPLAY_NAME_RELATION_NAME, "displayName")
        .withOutgoingRelation(HAS_PROPERTY_RELATION_NAME, "property")
        .withOutgoingRelation(HAS_ENTITY_NODE_RELATION_NAME, "entityNode")
      )
      .withVertex("displayName", v -> v
        .withProperty("displayName", true)
        .withProperty("propertyType", "string")
      )
      .withVertex("property", v -> v
        .withProperty("property", true)
        .withProperty("propertyType", "string")
      )
      .withVertex("entityNode", v -> v
        .withOutgoingRelation(HAS_ENTITY_RELATION_NAME, "entity")
      )
      .withVertex("entity", v -> v
        .withProperty("entity", true)
      )
      .withVertex("collection2", v -> v
        .withProperty(COLLECTION_NAME_PROPERTY_NAME, "collection2")
        .withProperty(ENTITY_TYPE_NAME_PROPERTY_NAME, "entityType2")
        .withProperty(IS_RELATION_COLLECTION_PROPERTY_NAME, false)
      )
      .withVertex("otherVreCollection", v -> v
        .withProperty(COLLECTION_NAME_PROPERTY_NAME, "otherVreCollection")
        .withProperty(ENTITY_TYPE_NAME_PROPERTY_NAME, "entityType3")
        .withProperty(IS_RELATION_COLLECTION_PROPERTY_NAME, false)
      )
      .wrap();
    TinkerPopOperations instance = forGraphWrapper(graphManager);

    instance.deleteVre("vreName");

    Graph graph = graphManager.getGraph();

    assertThat(graph.traversal().V().has(Vre.VRE_NAME_PROPERTY_NAME, "vreName").hasNext(),
      equalTo(false));

    assertThat(graph.traversal().V().has(COLLECTION_NAME_PROPERTY_NAME, "collection1").hasNext(),
      equalTo(false));

    assertThat(graph.traversal().V().has(COLLECTION_NAME_PROPERTY_NAME, "collection2").hasNext(),
      equalTo(false));

    assertThat(graph.traversal().V().has(COLLECTION_NAME_PROPERTY_NAME, "otherVreCollection").hasNext(),
      equalTo(true));

    assertThat(graph.traversal().V().has("entity").hasNext(), equalTo(false));
    assertThat(graph.traversal().V().has("displayName").hasNext(), equalTo(false));
  }

}

