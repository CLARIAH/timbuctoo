package nl.knaw.huygens.timbuctoo.index.solr;

/*
 * #%L
 * Timbuctoo VRE
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

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.util.Collection;

import nl.knaw.huygens.facetedsearch.model.FacetType;
import nl.knaw.huygens.timbuctoo.facet.IndexAnnotation;
import nl.knaw.huygens.timbuctoo.model.Entity;
import nl.knaw.huygens.timbuctoo.model.util.Datable;
import nl.knaw.huygens.timbuctoo.search.model.ClassWithMultipleFacetTypes;

import org.apache.solr.common.SolrInputDocument;
import org.apache.solr.common.SolrInputField;
import org.junit.Test;

import test.timbuctoo.index.model.TestExtraBaseDoc;

public class SolrInputDocGeneratorTest {

  private static final String GET_DISPLAY_NAME = "getIdentificationName";
  private int id = 0;

  private Entity createEntity(String displayName) {
    id++;
    return createEntity(displayName, "" + id);
  }

  private Entity createEntity(final String displayName, String id) {
    TestExtraBaseDoc entity = new TestExtraBaseDoc() {
      @Override
      public String getIdentificationName() {
        return displayName;
      }
    };
    entity.setId(id);
    return entity;
  }

  private IndexAnnotation createIndexAnnotation(final boolean canBeEmpty, final String fieldName, final FacetType facetType) {
    IndexAnnotation annotation = new IndexAnnotation() {

      @Override
      public Class<? extends Annotation> annotationType() {
        // TODO Auto-generated method stub
        return null;
      }

      @Override
      public String title() {
        // TODO Auto-generated method stub
        return null;
      }

      @Override
      public boolean isSortable() {
        // TODO Auto-generated method stub
        return false;
      }

      @Override
      public boolean isFaceted() {
        // TODO Auto-generated method stub
        return false;
      }

      @Override
      public String fieldName() {
        // TODO Auto-generated method stub
        return fieldName;
      }

      @Override
      public FacetType facetType() {
        return facetType;
      }

      @Override
      public boolean canBeEmpty() {
        return canBeEmpty;
      }

      @Override
      public String[] accessors() {
        // TODO Auto-generated method stub
        return new String[] {};
      }
    };
    return annotation;
  }

  private void processMethod(Entity entity, SolrInputDocGenerator generator, String methodName, boolean fieldCanBeEmpty, String fieldName, FacetType facetType) throws NoSuchMethodException {
    Method method = entity.getClass().getMethod(methodName);
    IndexAnnotation annotation = createIndexAnnotation(fieldCanBeEmpty, fieldName, facetType);
    generator.process(method, annotation);
  }

  @Test
  public void testGetResultOneDocumentWithoutEmptyFields() throws NoSuchMethodException, SecurityException {
    String expected = "test";
    Entity entity = createEntity(expected);
    SolrInputDocGenerator generator = new SolrInputDocGenerator(entity);

    processMethod(entity, generator, GET_DISPLAY_NAME, false, "desc", FacetType.LIST);

    SolrInputDocument solrInputDocument = generator.getResult();
    SolrInputField field = solrInputDocument.getField("desc");
    Object actual = field.getFirstValue();

    assertEquals(expected, actual);
  }

  @Test
  // Datable is currently the only supported type for ranges.
  public void testGetResultOneDocumentWithDatableRangeFacetField() throws NoSuchMethodException {
    ClassWithMultipleFacetTypes entity = new ClassWithMultipleFacetTypes();
    Datable datable = new Datable("2014");
    entity.setDatable(datable);

    SolrInputDocGenerator generator = new SolrInputDocGenerator(entity);

    String fieldName = "dynamic_d_range";
    String lowFieldName = "dynamic_d_range_low";
    String highFieldName = "dynamic_d_range_high";

    processMethod(entity, generator, "getDatable", false, fieldName, FacetType.RANGE);

    SolrInputDocument solrInputDocument = generator.getResult();

    SolrInputField lowField = solrInputDocument.getField(lowFieldName);
    SolrInputField highField = solrInputDocument.getField(highFieldName);
    SolrInputField field = solrInputDocument.getField(fieldName);

    assertThat(field, is(nullValue(SolrInputField.class)));
    assertThat(getValueAsString(lowField), is(equalTo("20140101")));
    assertThat(getValueAsString(highField), is(equalTo("20141231")));
  }

  private String getValueAsString(SolrInputField field) {
    return field.getValue().toString();
  }

  @Test
  public void testGetResultOneDocumentWithDatableOpenRangeFacetField() throws NoSuchMethodException {
    ClassWithMultipleFacetTypes entity = new ClassWithMultipleFacetTypes();
    Datable datable = new Datable("open/2014");
    entity.setDatable(datable);

    SolrInputDocGenerator generator = new SolrInputDocGenerator(entity);

    String fieldName = "dynamic_d_range";
    String lowFieldName = "dynamic_d_range_low";
    String highFieldName = "dynamic_d_range_high";

    processMethod(entity, generator, "getDatable", false, fieldName, FacetType.RANGE);

    SolrInputDocument solrInputDocument = generator.getResult();

    SolrInputField lowField = solrInputDocument.getField(lowFieldName);
    SolrInputField highField = solrInputDocument.getField(highFieldName);
    SolrInputField field = solrInputDocument.getField(fieldName);

    assertThat(field, is(nullValue(SolrInputField.class)));
    assertThat(lowField, is(nullValue(SolrInputField.class)));
    assertThat(highField, is(nullValue(SolrInputField.class)));
  }

  @Test
  public void testGetResultOneDocumentWithEmptyFieldsThatShouldBeIndexed() throws NoSuchMethodException {
    String description = null;
    String expected = "(empty)";
    Entity entity = createEntity(description);
    SolrInputDocGenerator generator = new SolrInputDocGenerator(entity);

    processMethod(entity, generator, GET_DISPLAY_NAME, false, "desc", FacetType.LIST);

    SolrInputDocument solrInputDocument = generator.getResult();
    SolrInputField field = solrInputDocument.getField("desc");
    Object actual = field.getFirstValue();

    assertEquals(expected, actual);
  }

  @Test
  public void testGetResultOneDocument_WithEmptyFieldsThatShouldNotBeIndexed() throws NoSuchMethodException {
    Entity entity = createEntity(null);
    SolrInputDocGenerator generator = new SolrInputDocGenerator(entity);

    processMethod(entity, generator, GET_DISPLAY_NAME, true, "desc", FacetType.LIST);

    SolrInputDocument solrInputDocument = generator.getResult();
    SolrInputField field = solrInputDocument.getField("desc");

    assertNull(field);
  }

  @Test
  public void testGetResultMultipleDocumentsWithoutEmptyFields() throws NoSuchMethodException {
    String descriptionDoc1 = "doc1";
    Entity entity1 = createEntity(descriptionDoc1);
    SolrInputDocGenerator doc1Generator = new SolrInputDocGenerator(entity1);
    processMethod(entity1, doc1Generator, GET_DISPLAY_NAME, false, "desc", FacetType.LIST);
    SolrInputDocument inputDoc1 = doc1Generator.getResult();

    String descriptionDoc2 = "doc2";
    Entity entity2 = createEntity(descriptionDoc2, entity1.getId());
    SolrInputDocGenerator doc2Generator = new SolrInputDocGenerator(entity2, inputDoc1);
    processMethod(entity2, doc2Generator, GET_DISPLAY_NAME, false, "desc", FacetType.LIST);
    SolrInputDocument inputDoc2 = doc1Generator.getResult();

    SolrInputField descriptionField = inputDoc2.getField("desc");
    Collection<Object> actualDescriptions = descriptionField.getValues();

    assertEquals(2, actualDescriptions.size());
    assertTrue(actualDescriptions.contains(descriptionDoc1));
    assertTrue(actualDescriptions.contains(descriptionDoc2));
  }

  @Test
  public void testGetResultMultipleDocumentsWithEmptyFieldsThatShouldBeIndexedOneEmpty() throws NoSuchMethodException {
    String descriptionDoc1 = "doc1";
    Entity entity1 = createEntity(descriptionDoc1);
    SolrInputDocGenerator doc1Generator = new SolrInputDocGenerator(entity1);
    processMethod(entity1, doc1Generator, GET_DISPLAY_NAME, false, "desc", FacetType.LIST);
    SolrInputDocument inputDoc1 = doc1Generator.getResult();

    Entity entity2 = createEntity(null, entity1.getId());
    SolrInputDocGenerator doc2Generator = new SolrInputDocGenerator(entity2, inputDoc1);
    processMethod(entity2, doc2Generator, GET_DISPLAY_NAME, false, "desc", FacetType.LIST);
    SolrInputDocument inputDoc2 = doc1Generator.getResult();

    SolrInputField descriptionField = inputDoc2.getField("desc");
    Collection<Object> actualValues = descriptionField.getValues();

    assertEquals(1, actualValues.size());
    assertTrue(actualValues.contains(descriptionDoc1));
  }

  @Test
  public void testGetResultMultipleDocumentsWithEmptyFieldsThatShouldBeIndexedAllEmpty() throws NoSuchMethodException {
    Entity entity1 = createEntity(null);
    SolrInputDocGenerator doc1Generator = new SolrInputDocGenerator(entity1);
    processMethod(entity1, doc1Generator, GET_DISPLAY_NAME, false, "desc", FacetType.LIST);
    SolrInputDocument inputDoc1 = doc1Generator.getResult();

    Entity entity2 = createEntity(null, entity1.getId());
    SolrInputDocGenerator doc2Generator = new SolrInputDocGenerator(entity2, inputDoc1);
    processMethod(entity2, doc2Generator, GET_DISPLAY_NAME, false, "desc", FacetType.LIST);
    SolrInputDocument inputDoc2 = doc1Generator.getResult();

    SolrInputField descriptionField = inputDoc2.getField("desc");
    Collection<Object> actualValues = descriptionField.getValues();

    assertEquals(1, actualValues.size());
    assertTrue(actualValues.contains("(empty)"));
  }

  @Test
  public void testGetResultMultipleDocumentsWithEmptyFieldsThatShouldNotBeIndexed() throws NoSuchMethodException {
    Entity entity1 = createEntity(null);
    SolrInputDocGenerator doc1Generator = new SolrInputDocGenerator(entity1);
    processMethod(entity1, doc1Generator, GET_DISPLAY_NAME, true, "desc", FacetType.LIST);
    SolrInputDocument inputDoc1 = doc1Generator.getResult();

    Entity entity2 = createEntity(null, entity1.getId());
    SolrInputDocGenerator doc2Generator = new SolrInputDocGenerator(entity2, inputDoc1);
    processMethod(entity2, doc2Generator, GET_DISPLAY_NAME, true, "desc", FacetType.LIST);
    SolrInputDocument inputDoc2 = doc1Generator.getResult();

    SolrInputField descriptionField = inputDoc2.getField("desc");

    assertNull(descriptionField);
  }

  @Test
  public void testGetResultMultipleDocumentsWithDuplicateValues() throws NoSuchMethodException {
    String description = "doc";
    Entity entity1 = createEntity(description);
    SolrInputDocGenerator doc1Generator = new SolrInputDocGenerator(entity1);
    processMethod(entity1, doc1Generator, GET_DISPLAY_NAME, false, "desc", FacetType.LIST);
    SolrInputDocument inputDoc1 = doc1Generator.getResult();

    Entity entity2 = createEntity(description, entity1.getId());
    SolrInputDocGenerator doc2Generator = new SolrInputDocGenerator(entity2, inputDoc1);
    processMethod(entity2, doc2Generator, GET_DISPLAY_NAME, false, "desc", FacetType.LIST);
    SolrInputDocument inputDoc2 = doc1Generator.getResult();

    SolrInputField descriptionField = inputDoc2.getField("desc");
    Collection<Object> actualValues = descriptionField.getValues();

    assertEquals(1, actualValues.size());
    assertTrue(actualValues.contains(description));
  }

  @Test
  public void testGetResultMultipleDocumentsIdField() throws NoSuchMethodException {
    Entity entity1 = createEntity("doc1");
    SolrInputDocGenerator doc1Generator = new SolrInputDocGenerator(entity1);
    processMethod(entity1, doc1Generator, "getId", false, "_id", FacetType.LIST);
    SolrInputDocument inputDoc1 = doc1Generator.getResult();

    Entity entity2 = createEntity("doc2", entity1.getId());
    SolrInputDocGenerator doc2Generator = new SolrInputDocGenerator(entity2, inputDoc1);
    processMethod(entity2, doc2Generator, "getId", false, "_id", FacetType.LIST);
    SolrInputDocument inputDoc2 = doc1Generator.getResult();

    SolrInputField descriptionField = inputDoc2.getField("_id");
    Collection<Object> actualIds = descriptionField.getValues();

    assertEquals(1, actualIds.size());
    assertTrue(actualIds.contains(entity1.getId()));
  }

  @Test
  public void testGetResultMultipleDocumentsSortingField() throws NoSuchMethodException {
    Entity entity1 = createEntity("doc1");
    SolrInputDocGenerator doc1Generator = new SolrInputDocGenerator(entity1);
    processMethod(entity1, doc1Generator, GET_DISPLAY_NAME, false, "dynamic_sort_desc", FacetType.LIST);
    SolrInputDocument inputDoc1 = doc1Generator.getResult();

    Entity entity2 = createEntity("doc2", entity1.getId());
    SolrInputDocGenerator doc2Generator = new SolrInputDocGenerator(entity2, inputDoc1);
    processMethod(entity2, doc2Generator, GET_DISPLAY_NAME, false, "dynamic_sort_desc", FacetType.LIST);
    SolrInputDocument inputDoc2 = doc1Generator.getResult();

    SolrInputField descriptionField = inputDoc2.getField("dynamic_sort_desc");
    Collection<Object> actualIds = descriptionField.getValues();

    assertEquals(1, actualIds.size());
    assertTrue(actualIds.contains(entity1.getIdentificationName()));
  }

}
