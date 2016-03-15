package nl.knaw.huygens.timbuctoo.tools.importer;

/*
 * #%L
 * Timbuctoo tools
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

import java.util.List;

import nl.knaw.huygens.timbuctoo.Repository;
import nl.knaw.huygens.timbuctoo.model.DomainEntity;
import nl.knaw.huygens.timbuctoo.model.util.Change;
import nl.knaw.huygens.timbuctoo.storage.StorageException;
import nl.knaw.huygens.timbuctoo.storage.ValidationException;
import nl.knaw.huygens.timbuctoo.tools.process.Progress;

/**
 * A sub class of the GenericDataHandler, that imports the data directly into the database. 
 */
public class GenericImporter extends GenericDataHandler {

  protected final Repository repository;

  public GenericImporter(Repository repository) {
    this.repository = repository;
  }

  @Override
  protected <T extends DomainEntity> void save(Class<T> type, List<T> objects, Change change) throws StorageException, ValidationException {
    Progress progress = new Progress();
    for (T object : objects) {
      progress.step();
      repository.addDomainEntity(type, object, change);
    }
    progress.done();
  }

}
