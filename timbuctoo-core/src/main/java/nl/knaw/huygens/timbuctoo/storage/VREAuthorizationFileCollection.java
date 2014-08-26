package nl.knaw.huygens.timbuctoo.storage;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import nl.knaw.huygens.timbuctoo.model.VREAuthorization;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

@JsonSerialize(using = FileCollectionSerializer.class)
@JsonDeserialize(using = VREAuthorizationFileCollectionDeserializer.class)
public class VREAuthorizationFileCollection extends FileCollection<VREAuthorization> {
  private Map<String, VREAuthorization> idAuthorizationMap;
  private Map<String, String> vreIdUserIdIdMap;

  public VREAuthorizationFileCollection() {
    this(Lists.<VREAuthorization> newArrayList());
  }

  public VREAuthorizationFileCollection(List<VREAuthorization> authorizations) {
    idAuthorizationMap = Maps.newConcurrentMap();
    vreIdUserIdIdMap = Maps.newConcurrentMap();
    initialize(authorizations);
  }

  private void initialize(List<VREAuthorization> authorizations) {
    for (VREAuthorization authorization : authorizations) {
      String id = authorization.getId();
      idAuthorizationMap.put(id, authorization);
      vreIdUserIdIdMap.put(createVREIdUserIdIndexEntry(authorization), id);
    }
  }

  @Override
  public String add(VREAuthorization entity) {
    String vreIdUserId = createVREIdUserIdIndexEntry(entity);

    if (vreIdUserIdIdMap.containsKey(vreIdUserId)) {
      return vreIdUserIdIdMap.get(vreIdUserId);
    }

    String id = createId(VREAuthorization.ID_PREFIX);
    entity.setId(id);

    idAuthorizationMap.put(id, entity);
    vreIdUserIdIdMap.put(vreIdUserId, id);

    return id;
  }

  private String createVREIdUserIdIndexEntry(VREAuthorization entity) {
    return String.format("%s%s", entity.getVreId(), entity.getUserId());
  }

  @Override
  public VREAuthorization findItem(VREAuthorization example) {
    String id = findIdForAuthorization(example);

    return this.get(id);
  }

  @Override
  public VREAuthorization get(String id) {
    return id != null ? idAuthorizationMap.get(id) : null;
  }

  @Override
  public StorageIterator<VREAuthorization> getAll() {
    return StorageIteratorStub.newInstance(Lists.newArrayList(idAuthorizationMap.values()));
  }

  @Override
  public void updateItem(VREAuthorization item) {
    String id = findIdForAuthorization(item);

    if (id != null) {
      item.setId(id); // make sure the item has the right id
      idAuthorizationMap.remove(id);
      idAuthorizationMap.put(id, item);
    }

  }

  private String findIdForAuthorization(VREAuthorization item) {
    String vreIdUserId = createVREIdUserIdIndexEntry(item);
    String id = vreIdUserIdIdMap.get(vreIdUserId);
    return id;
  }

  @Override
  public void deleteItem(VREAuthorization item) {
    String vreIdUserId = createVREIdUserIdIndexEntry(item);
    String id = vreIdUserIdIdMap.remove(vreIdUserId);

    if (id != null) {
      idAuthorizationMap.remove(id);
    }

  }

  @Override
  protected LinkedList<String> getIds() {
    return Lists.newLinkedList(idAuthorizationMap.keySet());
  }

  @Override
  public VREAuthorization[] asArray() {
    return idAuthorizationMap.values().toArray(new VREAuthorization[] {});
  }

}
