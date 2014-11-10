package nl.knaw.huygens.timbuctoo.tools.util.metadata;

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

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.List;

import nl.knaw.huygens.timbuctoo.storage.FieldMapper;

import com.google.common.collect.Lists;

public class TypeFacade {

  private final Class<?> type;
  private final TypeNameGenerator typeNameGenerator;

  public TypeFacade(Class<?> type) {
    this(type, new TypeNameGenerator());
  }

  public TypeFacade(Class<?> type, TypeNameGenerator typeNameGenerator) {
    this.type = type;
    this.typeNameGenerator = typeNameGenerator;
  }

  public String getFieldName(Field field) {
    return FieldMapper.getFieldName(type, field);
  }

  public FieldType getFieldType(Field field) {
    if (isEnumValueField(field, field.getType())) {
      return FieldType.ENUM;
    } else if (isConstantField(field)) {
      return FieldType.CONSTANT;
    } else if (isPoorMansEnumField(field)) {
      return FieldType.POOR_MANS_ENUM;
    } else if (!isStaticField(field)) {
      return FieldType.DEFAULT;
    } else {
      return FieldType.UNKNOWN;
    }
  }

  public enum FieldType {
    ENUM, CONSTANT, POOR_MANS_ENUM, DEFAULT, UNKNOWN
  }

  public String getTypeNameOfField(Field field) {
    StringBuilder builder = new StringBuilder();
    if (isOfInnerClassType(field)) {
      builder.append(type.getSimpleName());
      builder.append(".");
    }
    builder.append(typeNameGenerator.getTypeName(field));
    return builder.toString();
  }

  private boolean isOfInnerClassType(Field field) {
    return getInnerClasses(type).contains(field.getType());
  }

  private boolean isEnumValueField(Field field, Class<?> type) {
    if (!hasTypeParameters(type)) {
      return type.isEnum();
    }

    boolean isEnum = false;
    for (Type paramType : ((ParameterizedType) field.getGenericType()).getActualTypeArguments()) {
      if (paramType instanceof Class<?>) {
        isEnum |= isEnumValueField(field, (Class<?>) paramType);
      }
    }
    return isEnum;
  }

  private boolean isConstantField(Field field) {
    return isFinalField(field) && isStaticField(field);
  }

  private boolean isStaticField(Field field) {
    return Modifier.isStatic(field.getModifiers());
  }

  private boolean isFinalField(Field field) {
    return Modifier.isFinal(field.getModifiers());
  }

  private boolean hasTypeParameters(Class<?> type) {
    return type.getTypeParameters() != null && type.getTypeParameters().length > 0;
  }

  public Class<?> getPoorMansEnumType(Field field) {
    String fieldName = field.getName();
    for (Class<?> innerClass : getInnerClasses(type)) {
      if (isMatchingName(fieldName, innerClass)) {
        return innerClass;
      }
    }
    return null;
  }

  private boolean isMatchingName(String fieldName, Class<?> innerClass) {
    return fieldName.equalsIgnoreCase(innerClass.getSimpleName()) || fieldName.equalsIgnoreCase(innerClass.getSimpleName() + "s");
  }

  private boolean isPoorMansEnumField(Field field) {
    return getPoorMansEnumType(field) != null;
  }

  private List<Class<?>> getInnerClasses(Class<?> type) {
    List<Class<?>> classes = Lists.newArrayList(type.getDeclaredClasses());
    if (!Object.class.equals(type.getSuperclass())) {
      classes.addAll(getInnerClasses(type.getSuperclass()));
    }
    return classes;
  }

}
