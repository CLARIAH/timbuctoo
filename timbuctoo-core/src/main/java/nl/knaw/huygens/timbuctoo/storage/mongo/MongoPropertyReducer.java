package nl.knaw.huygens.timbuctoo.storage.mongo;

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

import java.util.List;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import nl.knaw.huygens.timbuctoo.model.util.Datable;
import nl.knaw.huygens.timbuctoo.storage.PropertyReducer;
import nl.knaw.huygens.timbuctoo.storage.StorageException;

public class MongoPropertyReducer implements PropertyReducer {

  private final ObjectMapper jsonMapper;

  public MongoPropertyReducer() {
    jsonMapper = new ObjectMapper();
  }

  @Override
  public Object reduce(Class<?> type, JsonNode node) throws StorageException {
    if (node.isArray()) {
      return createCollection(node);
    } else if (type == Integer.class || type == int.class) {
      return node.asInt();
    } else if (type == Boolean.class || type == boolean.class) {
      return node.asBoolean();
    } else if (type == Character.class || type == char.class) {
      return node.asText().charAt(0);
    } else if (type == Double.class || type == double.class) {
      return node.asDouble();
    } else if (type == Float.class || type == float.class) {
      return (float) node.asDouble();
    } else if (type == Long.class || type == long.class) {
      return node.asLong();
    } else if (type == Short.class || type == short.class) {
      return (short) node.asInt();
    } else if (Datable.class.isAssignableFrom(type)) {
      return new Datable(node.asText());
    } else {
      return jsonMapper.convertValue(node, type);
    }
  }

  private Object createCollection(JsonNode value) throws StorageException {
    try {
      return jsonMapper.readValue(value.toString(), new TypeReference<List<? extends Object>>() {});
    } catch (Exception e) {
      throw new StorageException(e);
    }
  }

}
