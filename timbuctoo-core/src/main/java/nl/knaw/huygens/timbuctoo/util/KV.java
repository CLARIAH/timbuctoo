package nl.knaw.huygens.timbuctoo.util;

/*
 * #%L
 * Timbuctoo core
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

/**
 * Represents a key-value pair with optional info.
 */
public class KV<T> {

  private final String key;
  private final T value;
  private final String info;

  public KV(String key, T value, String info) {
    this.key = key;
    this.value = value;
    this.info = info;
  }

  public KV(String key, T value) {
    this(key, value, "");
  }

  public String getKey() {
    return key;
  }

  public T getValue() {
    return value;
  }

  public String getInfo() {
    return info;
  }

}
