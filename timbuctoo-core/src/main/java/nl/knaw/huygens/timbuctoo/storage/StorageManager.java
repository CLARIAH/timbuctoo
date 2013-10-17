package nl.knaw.huygens.timbuctoo.storage;

import java.io.IOException;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import javax.jms.JMSException;

import nl.knaw.huygens.persistence.PersistenceException;
import nl.knaw.huygens.timbuctoo.config.TypeRegistry;
import nl.knaw.huygens.timbuctoo.messages.ActionType;
import nl.knaw.huygens.timbuctoo.messages.Broker;
import nl.knaw.huygens.timbuctoo.messages.Producer;
import nl.knaw.huygens.timbuctoo.model.DomainEntity;
import nl.knaw.huygens.timbuctoo.model.Entity;
import nl.knaw.huygens.timbuctoo.model.EntityRef;
import nl.knaw.huygens.timbuctoo.model.Reference;
import nl.knaw.huygens.timbuctoo.model.Relation;
import nl.knaw.huygens.timbuctoo.model.RelationType;
import nl.knaw.huygens.timbuctoo.model.SearchResult;
import nl.knaw.huygens.timbuctoo.model.SystemEntity;
import nl.knaw.huygens.timbuctoo.persistence.PersistenceWrapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.Inject;
import com.google.inject.Singleton;

@Singleton
public class StorageManager {

  private static final Logger LOG = LoggerFactory.getLogger(StorageManager.class);

  private final TypeRegistry registry;
  private final VariationStorage storage;
  private final PersistenceWrapper persistenceWrapper;
  private final Producer producer;

  @Inject
  public StorageManager(VariationStorage storage, Broker broker, TypeRegistry registry, PersistenceWrapper persistenceWrapper) {
    this.registry = registry;
    this.storage = storage;
    this.persistenceWrapper = persistenceWrapper;
    producer = setupProducer(broker);
  }

  /**
   * Clears the data store.
   */
  public void clear() {
    storage.empty();
  }

  /**
   * Closes the data store.
   */
  public void close() {
    storage.close();
    if (producer != null) {
      producer.closeQuietly();
    }
  }

  // -------------------------------------------------------------------

  private Producer setupProducer(Broker broker) {
    try {
      return broker.newProducer(Broker.INDEX_QUEUE, "StorageManagerProducer");
    } catch (JMSException e) {
      throw new RuntimeException(e);
    }
  }

  private void sendIndexMessage(ActionType action, String type, String id) {
    if (producer != null) {
      try {
        producer.send(action, type, id);
      } catch (JMSException e) {
        LOG.error("Error while sending message {} - {} - {}\n{}", action, type, id, e.getMessage());
        throw new RuntimeException(e);
      }
    }
  }

  // -------------------------------------------------------------------

  public <T extends Entity> T getEntity(Class<T> type, String id) {
    try {
      return storage.getItem(type, id);
    } catch (IOException e) {
      LOG.error("Error while handling {} {}", type.getName(), id);
      return null;
    }
  }

  public <T extends DomainEntity> T getEntityWithRelations(Class<T> type, String id) {
    try {
      T entity = storage.getItem(type, id);
      StorageIterator<Relation> iterator = storage.getRelationsOf(type, id);
      while (iterator.hasNext()) {
        Relation relation = iterator.next();
        RelationType relType = getEntity(RelationType.class, relation.getTypeRef().getId());
        if (relation.getSourceId().equals(id)) {
          Reference reference = relation.getTargetRef();
          entity.addRelation(relType.getRegularName(), getEntityRef(reference));
        } else if (relation.getTargetId().equals(id)) {
          Reference reference = relation.getSourceRef();
          entity.addRelation(relType.getInverseName(), getEntityRef(reference));
        } else {
          // impossible
        }
      }
      return entity;
    } catch (IOException e) {
      LOG.error("Error while handling {} {}", type.getName(), id);
      return null;
    }
  }

  public EntityRef getEntityRef(Reference reference) {
    String iname = reference.getType();
    String xname = registry.getXNameForIName(iname);
    Class<? extends Entity> type = registry.getTypeForIName(iname);
    Entity entity = getEntity(type, reference.getId());
    return new EntityRef(iname, xname, reference.getId(), entity.getDisplayName());
  }

  public <T extends SystemEntity> T findEntity(Class<T> type, String key, String value) {
    try {
      return storage.findItemByKey(type, key, value);
    } catch (IOException e) {
      LOG.error("Error while handling {}", type.getName());
      return null;
    }
  }

  /**
   * Returns a single system entity matching the non-null fields of
   * the specified entity, or null if no such entity exists.
   */
  public <T extends SystemEntity> T findEntity(Class<T> type, T example) {
    try {
      return storage.findItem(type, example);
    } catch (IOException e) {
      LOG.error("Error while handling {} {}", type.getName(), example.getId());
      return null;
    }
  }

  public <T extends DomainEntity> T getCompleteVariation(Class<T> type, String id, String variation) {
    try {
      return storage.getVariation(type, id, variation);
    } catch (Exception e) {
      LOG.error("Error while handling {} {}", type.getName(), id);
      return null;
    }
  }

  public <T extends DomainEntity> List<T> getAllVariations(Class<T> type, String id) {
    try {
      return storage.getAllVariations(type, id);
    } catch (IOException e) {
      LOG.error("Error while handling {} {}", type.getName(), id);
      return null;
    }
  }

  public <T extends Entity> StorageIterator<T> getAll(Class<T> type) {
    return storage.getAllByType(type);
  }

  public <T extends Entity> RevisionChanges<T> getVersions(Class<T> type, String id) {
    try {
      return storage.getAllRevisions(type, id);
    } catch (IOException e) {
      LOG.error("Error while handling {} {}", type.getName(), id);
      return null;
    }
  }

  /* A bit of code duplication, but I think it is more readable than calling this method from addEntity and then persisting it.
   * This code is needed, because of issue #1774 in Redmine. It contains the question if the persistent identifier should be added autmaticallly. 
   */
  public <T extends Entity> String addEntityWithoutPersisting(Class<T> type, T doc, boolean isComplete) throws IOException {
    String id = storage.addItem(type, doc);
    if (DomainEntity.class.isAssignableFrom(type) && isComplete) {
      sendIndexMessage(ActionType.INDEX_ADD, registry.getINameForType(type), id);
    }
    return id;
  }

  /**
   * A convenience method for ${@code addEntity(type, doc, true)}
   */
  public <T extends Entity> String addEntity(Class<T> type, T doc) throws IOException {
    return addEntity(type, doc, true);
  }

  /**
   * Stores an item into the database. When no exception is thrown and the entity is of the type DomainEntity, the entity is persisted. 
   * If the boolean isComplete is true the entity will be indexed as well.
   * 
   * @param type should be a DomainEntity
   * @param doc should be of a the type used in type.
   * @param isComplete marks if the entity contains all it's references and relations, 
   * when this boolean is true the entity will be indexed
   * @throws IOException when thrown by storage
   */
  public <T extends Entity> String addEntity(Class<T> type, T doc, boolean isComplete) throws IOException {
    String id = storage.addItem(type, doc);
    if (DomainEntity.class.isAssignableFrom(type)) {
      @SuppressWarnings("unchecked")
      Class<? extends DomainEntity> domainType = (Class<? extends DomainEntity>) type;
      persistEntityVersion(domainType, id);
      if (isComplete) {
        sendIndexMessage(ActionType.INDEX_ADD, registry.getINameForType(type), id);
      }
    }
    return id;
  }

  private <T extends DomainEntity> void persistEntityVersion(Class<T> type, String id) {
    try {
      // TODO make persistent id dependent on version.
      String collection = registry.getXNameForType(registry.getBaseClass(type));
      String pid = persistenceWrapper.persistObject(collection, id);
      storage.setPID(type, id, pid);
    } catch (PersistenceException e) {
      LOG.error("Error while handling {} {}", type.getName(), id);
    }
  }

  public <T extends Entity> void modifyEntityWithoutPersisting(Class<T> type, T doc) throws IOException {
    storage.updateItem(type, doc.getId(), doc);
    if (DomainEntity.class.isAssignableFrom(type)) {
      sendIndexMessage(ActionType.INDEX_MOD, registry.getINameForType(type), doc.getId());
    }
  }

  public <T extends Entity> void modifyEntity(Class<T> type, T doc) throws IOException {
    storage.updateItem(type, doc.getId(), doc);
    if (DomainEntity.class.isAssignableFrom(type)) {
      @SuppressWarnings("unchecked")
      Class<? extends DomainEntity> domainType = (Class<? extends DomainEntity>) type;
      persistEntityVersion(domainType, doc.getId());
      sendIndexMessage(ActionType.INDEX_MOD, registry.getINameForType(type), doc.getId());
    }
  }

  public <T extends Entity> void removeEntity(Class<T> type, T doc) throws IOException {
    storage.deleteItem(type, doc.getId(), doc.getLastChange());
    //TODO do something with the PID.
    if (DomainEntity.class.isAssignableFrom(type)) {
      sendIndexMessage(ActionType.INDEX_DEL, registry.getINameForType(type), doc.getId());
    }
  }

  public int removeAllSearchResults() {
    return storage.removeAll(SearchResult.class);
  }

  public int removeSearchResultsBefore(Date date) {
    return storage.removeByDate(SearchResult.class, SearchResult.DATE_FIELD, date);
  }

  /**
   * Retrieves all the id's of type {@code <T>} that does not have a persistent id. 
   * 
   * @param type the type of the id's that should be retrieved
   * @return a list with all the ids.
   * @throws IOException when the storage layer throws an exception it will be forwarded.
   */
  public <T extends DomainEntity> List<String> getAllIdsWithoutPIDOfType(Class<T> type) throws IOException {
    return storage.getAllIdsWithoutPIDOfType(type);
  }

  /**
   * Returns the id's of the relations, connected to the entities with the input id's.
   * The input id's can be the source id as well as the target id of the Relation. 
   * 
   * @param ids a list of id's to find the relations for
   * @return a list of id's of the corresponding relations
   * @throws IOException re-throws the IOExceptions of the storage
   */
  public List<String> getRelationIds(List<String> ids) throws IOException {
    return storage.getRelationIds(ids);
  }

  /**
   * Removes non-persistent domain entities with the specified type and id's..
   * The idea behind this method is that domain entities without persistent identifier are not validated yet.
   * After a bulk import non of the imported entity will have a persistent identifier, until a user has agreed with the imported collection.  
   * 
   * @param <T> extends {@code DomainEntity}, because system entities have no persistent identifiers.
   * @param type the type all of the objects should removed permanently from
   * @param ids the id's to remove permanently
   * @throws IOException when the storage layer throws an exception it will be forwarded
   */
  public <T extends DomainEntity> void removeNonPersistent(Class<T> type, List<String> ids) throws IOException {
    storage.removeNonPersistent(type, ids);
  }

  public <T extends Entity> List<T> getAllLimited(Class<T> type, int offset, int limit) {
    if (limit == 0) {
      return Collections.<T> emptyList();
    }
    return StorageUtils.resolveIterator(storage.getAllByType(type), offset, limit);
  }

  public int countRelations(Relation relation) {
    return storage.countRelations(relation);
  }

}
