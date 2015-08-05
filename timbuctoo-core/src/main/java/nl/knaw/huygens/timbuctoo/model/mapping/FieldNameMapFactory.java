package nl.knaw.huygens.timbuctoo.model.mapping;

import com.fasterxml.jackson.annotation.JsonProperty;
import nl.knaw.huygens.timbuctoo.facet.IndexAnnotation;
import nl.knaw.huygens.timbuctoo.facet.IndexAnnotations;
import nl.knaw.huygens.timbuctoo.model.DerivedProperty;
import nl.knaw.huygens.timbuctoo.model.DomainEntity;
import nl.knaw.huygens.timbuctoo.model.Entity;

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.lang.reflect.Method;

import static nl.knaw.huygens.timbuctoo.storage.graph.MethodHelper.getGetterName;
import static nl.knaw.huygens.timbuctoo.storage.graph.MethodHelper.getMethodByName;

public class FieldNameMapFactory {
  public <T extends DomainEntity> FieldNameMap create(Representation from, Representation to, Class<T> type) throws MappingException {
    FieldNameMap fieldNameMap = new FieldNameMap();

    Class<?> typeToAddFieldsFor = type;

    for (; isDomainEntity(typeToAddFieldsFor); typeToAddFieldsFor = typeToAddFieldsFor.getSuperclass()) {
      addFields(from, to, typeToAddFieldsFor, fieldNameMap);
    }

    try {
      T instance = type.newInstance();
      for (DerivedProperty derivedProperty : instance.getDerivedProperties()) {
        String key = from.getFieldName(type, derivedProperty);
        String value = to.getFieldName(type, derivedProperty);

        addField(fieldNameMap, key, value);
      }

      for (VirtualProperty property : instance.getVirtualProperties()) {
        String key = from.getFieldName(type, property);
        String value = to.getFieldName(type, property);

        addField(fieldNameMap, key, value);
      }


    } catch (InstantiationException | IllegalAccessException e) {
      throw new MappingException(type, e);
    }


    return fieldNameMap;
  }

  private boolean isDomainEntity(Class<?> typeToAddFieldsFor) {
    return DomainEntity.class.isAssignableFrom(typeToAddFieldsFor);
  }

  private void addFields(Representation from, Representation to, Class<?> type, FieldNameMap fieldNameMap) {
    for (Field field : type.getDeclaredFields()) {
      String key = from.getFieldName(type, field);
      String value = to.getFieldName(type, field);
      addField(fieldNameMap, key, value);
    }
  }

  private void addField(FieldNameMap fieldNameMap, String key, String value) {
    if (key != null && value != null) {
      fieldNameMap.put(key, value);
    }
  }

  public enum Representation {
    CLIENT {
      @Override
      protected String getFieldName(Class<?> type, Field field) {
        if (field.isAnnotationPresent(JsonProperty.class)) {
          return field.getAnnotation(JsonProperty.class).value();
        }

        Method method = getMethodByName(type, getGetterName(field));
        if (isAnnotationPresentOnMethod(method, JsonProperty.class)) {
          return method.getAnnotation(JsonProperty.class).value();
        }

        return field.getName();
      }

      @Override
      public String getFieldName(Class<?> type, DerivedProperty derivedProperty) {
        return derivedProperty.getPropertyName();
      }

      @Override
      public String getFieldName(Class<?> type, VirtualProperty virtualProperty) {
        return virtualProperty.getPropertyName();
      }
    },
    //    DATABASE, TODO implement when needed
    //    POJO,TODO implement when needed
    INDEX {
      @Override
      protected String getFieldName(Class<?> type, Field field) {
        return getFieldName(type, getGetterName(field));
      }

      @Override
      public String getFieldName(Class<?> type, DerivedProperty derivedProperty) {
        return getFieldName(type, derivedProperty.getLocalAccessor());
      }

      @Override
      public String getFieldName(Class<?> type, VirtualProperty virtualProperty) {
        return getFieldName(type, virtualProperty.getAccessor());
      }

      private String getFieldName(Class<?> type, String methodName) {

        Class<?> typeToGetMethodFrom = type;
        for (; !typeToGetMethodFrom.isAssignableFrom(Entity.class); typeToGetMethodFrom = typeToGetMethodFrom.getSuperclass()) {
          Method method = getMethodByName(typeToGetMethodFrom, methodName);
          if (isAnnotationPresentOnMethod(method, IndexAnnotation.class)) {
            IndexAnnotation annotation = method.getAnnotation(IndexAnnotation.class);
            return annotation.isSortable() ? null : annotation.fieldName();
          }

          if (isAnnotationPresentOnMethod(method, IndexAnnotations.class)) {
            for (IndexAnnotation indexAnnotation : method.getAnnotation(IndexAnnotations.class).value()) {
              if (!indexAnnotation.isSortable()) {
                return indexAnnotation.fieldName();
              }
            }
          }
        }

        return null;
      }

    };

    protected abstract String getFieldName(Class<?> type, Field field);

    protected abstract String getFieldName(Class<?> type, DerivedProperty derivedProperty);

    public abstract String getFieldName(Class<?> type, VirtualProperty virtualProperty);

    protected boolean isAnnotationPresentOnMethod(Method method, Class<? extends Annotation> annotation) {
      return method != null && method.getAnnotation(annotation) != null;
    }


  }
}
