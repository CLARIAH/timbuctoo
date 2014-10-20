package nl.knaw.huygens.timbuctoo.model;

/*
 * #%L
 * Timbuctoo core
 * =======
 * Copyright (C) 2012 - 2014 Huygens ING
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

import static org.mockito.Matchers.anyBoolean;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import nl.knaw.huygens.timbuctoo.Repository;
import nl.knaw.huygens.timbuctoo.config.EntityMapper;
import nl.knaw.huygens.timbuctoo.config.EntityMappers;
import nl.knaw.huygens.timbuctoo.storage.StorageException;
import nl.knaw.huygens.timbuctoo.util.RelationRefCreator;

import com.google.common.collect.Lists;

public class AddRelationsTestHelper {

  public static final String ENTITY_ID = "id";
  public static final Class<Relation> RELATION_TYPE = Relation.class;
  public static final int RELATION_LIMIT = 5;

  public static Relation createRelation(String sourceId, String targetId, String id, double relationNumber) {
    return createRelation(sourceId, targetId, id, "typeId" + relationNumber);
  }

  public static Relation createRelation(String sourceId, String targetId, String id, String relationType) {
    Relation relation = new Relation();
    relation.setSourceId(sourceId);
    relation.setSourceType("sourceType");
    relation.setTargetId(targetId);
    relation.setTargetType("targetType");
    relation.setTypeId(relationType);
    relation.setId(id);
    return relation;
  }

  public static Relation createRelationWhereEntityIsTarget(String targetId, double relationNumber) {
    return createRelation("sourceId" + relationNumber, targetId, ENTITY_ID + relationNumber, relationNumber);
  }

  public static Relation createRelationWhereEntityIsSource(String sourceId, double relationNumber) {
    return createRelation(sourceId, "targetId" + relationNumber, ENTITY_ID + relationNumber, relationNumber);
  }

  public static EntityMappers setupEntityMappers(Class<? extends DomainEntity> entityType, EntityMapper entityMapperMock) {
    EntityMappers entityMappersMock = mock(EntityMappers.class);
    when(entityMappersMock.getEntityMapper(entityType)).thenReturn(entityMapperMock);
    doReturn(RELATION_TYPE).when(entityMapperMock).map(RELATION_TYPE);

    return entityMappersMock;
  }

  public static void verifyRelationRefIsCreatedForRelation(Relation relation, boolean isRegularRelation, RelationRefCreator relationRefCreator, EntityMapper entityMapper) throws StorageException {
    Reference ref = null;
    if (isRegularRelation) {
      ref = relation.getTargetRef();
    } else {
      ref = relation.getSourceRef();
    }
    verify(relationRefCreator).newRelationRef(entityMapper, ref, relation.getId(), relation.isAccepted(), relation.getRev());
  }

  public static Repository setupRepositoryWithRelations(String entityId, Relation... relations) throws StorageException {
    Repository repositoryMock = mock(Repository.class);
    doReturn(Lists.newArrayList(relations)).when(repositoryMock).getRelationsByEntityId(entityId, RELATION_LIMIT, RELATION_TYPE);
    when(repositoryMock.getRelationTypeById(anyString(), anyBoolean())).thenReturn(mock(RelationType.class));
    when(repositoryMock.getRelationTypeById(anyString(), anyBoolean())).thenReturn(mock(RelationType.class));
    return repositoryMock;
  }

}
