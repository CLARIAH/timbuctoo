package nl.knaw.huygens.timbuctoo.database;

import com.google.common.collect.Lists;
import nl.knaw.huygens.timbuctoo.crud.HandleAdder;
import nl.knaw.huygens.timbuctoo.crud.HandleAdderParameters;
import nl.knaw.huygens.timbuctoo.database.dto.CreateEntity;
import nl.knaw.huygens.timbuctoo.database.dto.dataset.Collection;
import nl.knaw.huygens.timbuctoo.security.AuthorizationException;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InOrder;

import java.time.Clock;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static nl.knaw.huygens.timbuctoo.database.AuthorizerBuilder.allowedToWrite;
import static nl.knaw.huygens.timbuctoo.database.AuthorizerBuilder.notAllowedToWrite;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.argThat;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyZeroInteractions;
import static org.mockito.Mockito.when;

public class TimbuctooDbAccessCreateTest {

  public static final String COLLECTION_NAME = "collectionName";
  private DataAccess dataAccess;
  private Clock clock;
  private Instant instant;
  private Collection collection;
  private CreateEntity createEntity;
  private String userId;
  private Optional<Collection> baseCollection;
  private HandleAdder handleAdder;
  private TransactionState transactionState;

  @Before
  public void setUp() throws Exception {
    dataAccess = mock(DataAccess.class);
    transactionState = mock(TransactionState.class);
    when(dataAccess.createEntity(any(), any(), any())).thenReturn(transactionState);
    when(transactionState.wasCommitted()).thenReturn(false);

    clock = mock(Clock.class);
    instant = Instant.now();
    when(clock.instant()).thenReturn(instant);
    collection = mock(Collection.class);
    when(collection.getCollectionName()).thenReturn(COLLECTION_NAME);
    createEntity = mock(CreateEntity.class);
    userId = "userId";
    baseCollection = Optional.empty();
    handleAdder = mock(HandleAdder.class);
  }

  @Test(expected = AuthorizationException.class)
  public void createEntityThrowsAnAuthorizationExceptionWhenTheUserIsNotAllowedToWriteToTheCollection()
    throws Exception {
    TimbuctooDbAccess instance = new TimbuctooDbAccess(notAllowedToWrite(), dataAccess, clock, handleAdder);

    try {
      instance.createEntity(mock(Collection.class), baseCollection, new CreateEntity(Lists.newArrayList()), "userId");
    } finally {
      verifyZeroInteractions(dataAccess);
    }
  }


  @Test
  public void createEntityLetsDataAccessSaveTheEntity() throws Exception {
    TimbuctooDbAccess instance = new TimbuctooDbAccess(allowedToWrite(), dataAccess, clock, handleAdder);

    UUID id = instance.createEntity(collection, baseCollection, this.createEntity, userId);

    InOrder inOrder = inOrder(dataAccess, createEntity);
    inOrder.verify(createEntity).setId(id);
    inOrder.verify(createEntity).setCreated(argThat(allOf(
      hasProperty("userId", is(userId)),
      hasProperty("timeStamp", is(instant.toEpochMilli()))
      ))
    );
    inOrder.verify(dataAccess).createEntity(collection, baseCollection, this.createEntity);
  }

  @Test
  public void createEntityReturnsTheId() throws Exception {
    TimbuctooDbAccess instance = new TimbuctooDbAccess(allowedToWrite(), dataAccess, clock, handleAdder);

    UUID id = instance.createEntity(collection, baseCollection, this.createEntity, userId);

    assertThat(id, is(notNullValue()));
  }

  @Test
  public void createEntityNotifiesHandleAdderThatANewEntityIsCreated() throws Exception {
    when(transactionState.wasCommitted()).thenReturn(true);
    TimbuctooDbAccess instance = new TimbuctooDbAccess(allowedToWrite(), dataAccess, clock, handleAdder);

    UUID id = instance.createEntity(collection, baseCollection, this.createEntity, userId);

    verify(handleAdder).add(new HandleAdderParameters(COLLECTION_NAME, id, 1));
  }

  @Test
  public void createEntityDoesNotCallTheHandleAdderWhenTheTransactionIsRolledBack() throws Exception {
    when(transactionState.wasCommitted()).thenReturn(false);
    TimbuctooDbAccess instance = new TimbuctooDbAccess(allowedToWrite(), dataAccess, clock, handleAdder);

    UUID id = instance.createEntity(collection, baseCollection, this.createEntity, userId);

    verify(handleAdder, never()).add(new HandleAdderParameters(COLLECTION_NAME, id, 1));
  }

}
