package nl.knaw.huygens.timbuctoo.config;

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

import nl.knaw.huygens.timbuctoo.model.DomainEntity;
import nl.knaw.huygens.timbuctoo.model.SystemEntity;

/**
 * Encapsulates business rules for handling of entities.
 */
public class BusinessRules {

  // --- API -----------------------------------------------------------

  /**
   * Timbuctoo only accepts primitive system entities,
   * immediate subclasses of {@code SystemEntity}.
   */
  public static boolean isValidSystemEntity(Class<?> cls) {
    return superclass(cls, SystemEntity.class, 1);
  }

  /**
   * Timbuctoo only accepts primitive domain entities,
   * immediate subclasses of {@code DomainEntity},
   * and immediate subclasses of primitive domain entities.
   */
  public static boolean isValidDomainEntity(Class<?> cls) {
    return superclass(cls, DomainEntity.class, 2);
  }

  /**
   * Can a system entity with the specfied type be added to the data store.
   */
  public static boolean allowSystemEntityAdd(Class<?> type) {
    return type != null && type.getSuperclass() == SystemEntity.class;
  }

  /**
   * Can a domain entity with the specfied type be added to the data store.
   */
  public static boolean allowDomainEntityAdd(Class<?> type) {
    return type != null && type.getSuperclass() != null && type.getSuperclass().getSuperclass() == DomainEntity.class;
  }

  // -------------------------------------------------------------------
  /**
   * Checks if the super class is the desired level.
   * @param cls the sub class of {@code target}
   * @param target the super class to find the level for
   * @param level the maximum number of levels between {@code cls} and {@code target} 
   * @return {@code true} in the level of {@code target} is lower or equal to {@code level} else {@code false}. 
   */
  private static boolean superclass(Class<?> cls, Class<?> target, int level) {
    while (cls != null && level > 0) {
      cls = cls.getSuperclass();
      level--;
      if (cls == target) {
        return true;
      }
    }
    return false;
  }

}
