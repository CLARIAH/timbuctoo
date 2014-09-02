package nl.knaw.huygens.timbuctoo.model;

/*
 * #%L
 * Timbuctoo REST api
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

import java.util.Map;

import nl.knaw.huygens.timbuctoo.config.Paths;

import com.google.common.base.Joiner;

public class ClientEntityRepresentation {

  private final String type;
  private final String id;
  private final String path;
  private final String displayName;
  private final Map<String, String> data;

  public ClientEntityRepresentation(String type, String xtype, String id, String displayName, Map<String, String> data) {
    this.type = type;
    this.id = id;
    this.path = Joiner.on('/').join(Paths.DOMAIN_PREFIX, xtype, id);
    this.displayName = displayName;
    this.data = data;
  }

  public ClientEntityRepresentation(String type, String xtype, String id, String displayName) {
    this(type, xtype, id, displayName, null);
  }

  public String getType() {
    return type;
  }

  public String getId() {
    return id;
  }

  public String getPath() {
    return path;
  }

  public String getDisplayName() {
    return displayName;
  }

  public Map<String, String> getData() {
    return data;
  }

}
