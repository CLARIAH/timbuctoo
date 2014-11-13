package nl.knaw.huygens.timbuctoo.storage;

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

import static nl.knaw.huygens.timbuctoo.storage.FieldMap.propertyName;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;

import java.util.List;
import java.util.Map;

import nl.knaw.huygens.timbuctoo.model.util.Datable;
import nl.knaw.huygens.timbuctoo.model.util.PersonName;
import nl.knaw.huygens.timbuctoo.model.util.PersonNameComponent.Type;

import org.junit.Test;

import test.variation.model.MongoObjectMapperEntity;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

public class PropertyMapTest {

  private static final Class<?> TYPE = MongoObjectMapperEntity.class;

  // keys
  private static final String PWAA_KEY = propertyName(TYPE, "pwaa");
  private static final String PROP_ANNOTATED_KEY = propertyName(TYPE, "propAnnotated");
  private static final String TEST_VALUE2_KEY = propertyName(TYPE, "testValue2");
  private static final String TEST_VALUE1_KEY = propertyName(TYPE, "testValue1");
  private static final String NAME_KEY = propertyName(TYPE, "name");

  // default values
  private static final String ID = "testID";
  private static final String PROP_WITH_ANNOTATED_ACCESSORS = "propWithAnnotatedAccessors";
  private static final String ANNOTATED_PROPERTY = "annotatedProperty";
  private static final String TEST_VALUE2 = "testValue2";
  private static final String TEST_VALUE1 = "testValue1";
  private static final String NAME = "name";

  private MongoObjectMapperEntity createMongoObjectMapperEntity(String name, String testValue1, String testValue2, String annotatedProperty, String propWithAnnotatedAccessors) {
    MongoObjectMapperEntity entity = new MongoObjectMapperEntity();
    entity.setName(name);
    entity.setTestValue1(testValue1);
    entity.setTestValue2(testValue2);
    entity.setAnnotatedProperty(annotatedProperty);
    entity.setPropWithAnnotatedAccessors(propWithAnnotatedAccessors);
    return entity;
  }

  @Test
  public void testPropertyMapForNullObject() {
    PropertyMap properties = new PropertyMap(null, TYPE);
    assertThat(properties.keySet(), empty());
  }

  @Test
  public void testPropertyMapForObject() {
    MongoObjectMapperEntity entity = createMongoObjectMapperEntity(NAME, TEST_VALUE1, TEST_VALUE2, ANNOTATED_PROPERTY, PROP_WITH_ANNOTATED_ACCESSORS);

    Map<String, Object> map = Maps.newHashMap();
    map.put(NAME_KEY, NAME);
    map.put(TEST_VALUE1_KEY, TEST_VALUE1);
    map.put(TEST_VALUE2_KEY, TEST_VALUE2);
    map.put(PROP_ANNOTATED_KEY, ANNOTATED_PROPERTY);
    map.put(PWAA_KEY, PROP_WITH_ANNOTATED_ACCESSORS);

    assertThat(new PropertyMap(entity, TYPE), equalTo(map));
  }

  @Test
  public void testPropertyMapForObjectWithNullValues() {
    MongoObjectMapperEntity entity = createMongoObjectMapperEntity(NAME, TEST_VALUE1, TEST_VALUE2, null, null);

    Map<String, Object> map = Maps.newHashMap();
    map.put(NAME_KEY, NAME);
    map.put(TEST_VALUE1_KEY, TEST_VALUE1);
    map.put(TEST_VALUE2_KEY, TEST_VALUE2);

    assertThat(new PropertyMap(entity, TYPE), equalTo(map));
  }

  @Test
  public void testPropertyMapForPrimitiveCollectionFields() {
    MongoObjectMapperEntity entity = new MongoObjectMapperEntity();
    List<String> list = Lists.newArrayList("String1", "String2", "String3", "String4");
    entity.setPrimitiveTestCollection(list);

    Map<String, Object> map = Maps.newHashMap();
    map.put(propertyName(TYPE, "primitiveTestCollection"), list);

    assertThat(new PropertyMap(entity, TYPE), equalTo(map));
  }

  @Test
  public void testPropertyMapForNonPrimitiveCollectionFields() {
    MongoObjectMapperEntity entity = new MongoObjectMapperEntity();
    entity.setId(ID);
    entity.setNonPrimitiveTestCollection(Lists.newArrayList(entity));

    assertThat(new PropertyMap(entity, TYPE).keySet(), hasSize(1));
  }

  @Test
  public void testPropertyMapForClass() {
    MongoObjectMapperEntity entity = new MongoObjectMapperEntity();
    entity.setType(TYPE);

    Map<String, Object> map = Maps.newHashMap();
    map.put(propertyName(TYPE, "type"), TYPE);

    assertThat(new PropertyMap(entity, TYPE), equalTo(map));
  }

  @Test
  public void testPropertyMapForDatable() {
    MongoObjectMapperEntity entity = new MongoObjectMapperEntity();
    entity.setDate(new Datable("20031011"));

    Map<String, Object> map = Maps.newHashMap();
    map.put(propertyName(TYPE, "date"), "20031011");

    assertThat(new PropertyMap(entity, TYPE), equalTo(map));
  }

  @Test
  public void testPropertyMapForPersonName() {
    MongoObjectMapperEntity entity = new MongoObjectMapperEntity();
    PersonName personName = new PersonName();
    personName.addNameComponent(Type.FORENAME, "test");
    personName.addNameComponent(Type.SURNAME, "test");
    entity.setPersonName(personName);

    Map<String, Object> map = Maps.newLinkedHashMap();
    map.put(propertyName(TYPE, "personName"), personName);

    assertThat(new PropertyMap(entity, TYPE), equalTo(map));
  }

}
