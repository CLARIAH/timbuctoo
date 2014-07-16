package nl.knaw.huygens.timbuctoo.tools.importer.base;

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

import java.io.File;
import java.util.Map;

import nl.knaw.huygens.timbuctoo.Repository;
import nl.knaw.huygens.timbuctoo.index.IndexManager;
import nl.knaw.huygens.timbuctoo.model.base.BaseLocation;
import nl.knaw.huygens.timbuctoo.model.util.PlaceName;
import nl.knaw.huygens.timbuctoo.tools.importer.DefaultImporter;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.LineIterator;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Maps;

/**
 * Imports domain entities from a file with on each line a json object.
 */
public class LocationImporter extends DefaultImporter {

  private final ObjectMapper objectMapper;

  public LocationImporter(Repository repository, IndexManager indexManager, String vreId) {
    super(repository, indexManager, vreId);
    objectMapper = new ObjectMapper();
  }

  public void handleFile(File jsonFile) throws Exception {
    int count = 0;
    LineIterator iterator = FileUtils.lineIterator(jsonFile, "UTF-8");
    try {
      while (iterator.hasNext()) {
        count++;
        String line = iterator.nextLine();
        if (!line.isEmpty()) {
          Place place = objectMapper.readValue(line, Place.class);
          BaseLocation location = convert(place);
          addDomainEntity(BaseLocation.class, location, change);
        }
      }
    } finally {
      LineIterator.closeQuietly(iterator);
      System.out.printf("Number of items = %4d%n", count);
    }
  }

  private BaseLocation convert(Place place) {
    BaseLocation location = new BaseLocation();
    location.setDefLang(place.defLang);
    location.setNames(place.names);
    location.setLatitude(place.latitude);
    location.setLongitude(place.longitude);
    location.setUrn(place.urn);
    location.setNotes(place.notes);
    return location;
  }

  public static class Place {
    public String defLang;
    public Map<String, PlaceName> names = Maps.newHashMap();
    public String latitude;
    public String longitude;
    public String urn;
    public String notes;
  }

}
