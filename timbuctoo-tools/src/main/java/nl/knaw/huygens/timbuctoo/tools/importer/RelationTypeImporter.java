package nl.knaw.huygens.timbuctoo.tools.importer;

/*
 * #%L
 * Timbuctoo tools
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

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;

import nl.knaw.huygens.timbuctoo.config.TypeRegistry;
import nl.knaw.huygens.timbuctoo.model.DomainEntity;
import nl.knaw.huygens.timbuctoo.model.Entity;
import nl.knaw.huygens.timbuctoo.storage.RelationManager;
import nl.knaw.huygens.timbuctoo.storage.ValidationException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Imports all relation types.
 */
public class RelationTypeImporter extends CSVImporter {

  private final static Logger LOG = LoggerFactory.getLogger(RelationTypeImporter.class);

  private final TypeRegistry registry;
  private final RelationManager relationManager;

  public RelationTypeImporter(TypeRegistry registry, RelationManager relationManager) {
    super(new PrintWriter(System.err), ';', '"', 4);
    this.registry = registry;
    this.relationManager = relationManager;
  }

  /**
   * Reads {@code RelationType} definitions from the specified file which must be present on the classpath.
   */
  public void importRelationTypes(String fileName) throws ValidationException {
    try {
      InputStream stream = RelationManager.class.getClassLoader().getResourceAsStream(fileName);
      handleFile(stream, 6, false);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  @Override
  protected void handleLine(String[] items) throws ValidationException {
    String regularName = items[0];
    String inverseName = items[1];
    Class<? extends DomainEntity> sourceType = convertToType(items[2]);
    Class<? extends DomainEntity> targetType = convertToType(items[3]);
    boolean reflexive = Boolean.parseBoolean(items[4]);
    boolean symmetric = Boolean.parseBoolean(items[5]);

    // FIXME neither the regular name nor the inverse name should exist
    if (relationManager.getRelationTypeByName(regularName) != null) {
      LOG.debug("Relation type '{}' already exists", regularName);
    } else {
      relationManager.addRelationType(regularName, inverseName, sourceType, targetType, reflexive, symmetric);
    }
  }

  private Class<? extends DomainEntity> convertToType(String typeName) throws ValidationException {
    String iname = typeName.toLowerCase();
    if (iname.equals("domainentity")) {
      return DomainEntity.class;
    }
    Class<? extends Entity> type = registry.getTypeForIName(iname);
    if (type == null) {
      LOG.error("Name '{}' is not a registered entity", typeName);
      throw new ValidationException("Invalid entity type");
    }
    if (!TypeRegistry.isDomainEntity(type)) {
      LOG.error("Name '{}' is not a domain entity", typeName);
      throw new ValidationException("Invalid entity type");
    }
    return TypeRegistry.toDomainEntity(type);
  }

}
