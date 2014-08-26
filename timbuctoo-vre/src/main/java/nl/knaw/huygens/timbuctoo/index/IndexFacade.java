package nl.knaw.huygens.timbuctoo.index;

/*
 * #%L
 * Timbuctoo VRE
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

import static nl.knaw.huygens.timbuctoo.config.TypeRegistry.toBaseDomainEntity;

import java.util.List;

import nl.knaw.huygens.timbuctoo.Repository;
import nl.knaw.huygens.timbuctoo.model.DomainEntity;
import nl.knaw.huygens.timbuctoo.vre.VRE;

import com.google.inject.Inject;
import com.google.inject.Singleton;

@Singleton
public class IndexFacade implements IndexManager {

  private final Repository repository;

  @Inject
  public IndexFacade(Repository repository) {
    this.repository = repository;
  }

  @Override
  public <T extends DomainEntity> void addEntity(Class<T> type, String id) throws IndexException {
    IndexChanger indexAdder = new IndexChanger() {
      @Override
      public void executeIndexAction(Class<? extends DomainEntity> type, VRE vre, List<? extends DomainEntity> variations) throws IndexException {
        vre.addToIndex(type, variations);
      }
    };
    changeIndex(type, id, indexAdder);
  }

  private <T extends DomainEntity> void changeIndex(Class<T> type, String id, IndexChanger indexChanger) throws IndexException {
    Class<? extends DomainEntity> baseType = toBaseDomainEntity(type);
    List<? extends DomainEntity> variations = repository.getAllVariations(baseType, id);
    if (!variations.isEmpty()) {
      for (VRE vre : repository.getAllVREs()) {
        indexChanger.executeIndexAction(baseType, vre, variations);
      }
    }
  }

  @Override
  public <T extends DomainEntity> void updateEntity(Class<T> type, String id) throws IndexException {
    IndexChanger indexUpdater = new IndexChanger() {
      @Override
      public void executeIndexAction(Class<? extends DomainEntity> type, VRE vre, List<? extends DomainEntity> variations) throws IndexException {
        vre.updateIndex(type, variations);
      }
    };
    changeIndex(type, id, indexUpdater);
  }

  @Override
  public <T extends DomainEntity> void deleteEntity(Class<T> type, String id) throws IndexException {
    for (VRE vre : repository.getAllVREs()) {
      vre.deleteFromIndex(type, id);
    }
  }

  @Override
  public <T extends DomainEntity> void deleteEntities(Class<T> type, List<String> ids) throws IndexException {
    for (VRE vre : repository.getAllVREs()) {
      vre.deleteFromIndex(type, ids);
    }
  }

  @Override
  public void deleteAllEntities() throws IndexException {
    for (VRE vre : repository.getAllVREs()) {
      vre.clearIndexes();
    }
  }

  @Override
  public IndexStatus getStatus() {
    IndexStatus indexStatus = createIndexStatus();

    for (VRE vre : repository.getAllVREs()) {
      vre.addToIndexStatus(indexStatus);
    }

    return indexStatus;
  }

  protected IndexStatus createIndexStatus() {
    return new IndexStatus();
  }

  @Override
  public void commitAll() throws IndexException {
    for (VRE vre : repository.getAllVREs()) {
      vre.commitAll();
    }
  }

  @Override
  public void close() {
    for (VRE vre : repository.getAllVREs()) {
      vre.close();
    }
  }

  private static interface IndexChanger {
    void executeIndexAction(Class<? extends DomainEntity> type, VRE vre, List<? extends DomainEntity> variations) throws IndexException;
  }

}
