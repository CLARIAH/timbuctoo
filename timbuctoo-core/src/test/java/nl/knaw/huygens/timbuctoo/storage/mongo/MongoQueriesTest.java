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

import static nl.knaw.huygens.timbuctoo.storage.XProperties.propertyName;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertEquals;

import java.util.Date;
import java.util.Map;

import org.junit.Before;
import org.junit.Test;

import test.model.BaseDomainEntity;

import com.google.common.collect.Maps;
import com.mongodb.DBObject;

public class MongoQueriesTest {

  private MongoQueries queries;

  @Before
  public void setupMongoQueries() {
    queries = new MongoQueries();
  }

  @Test
  public void testSelectAll() {
    Map<String, Object> expected = Maps.newHashMap();

    DBObject query = queries.selectAll();
    assertEquals(expected, query.toMap());
  }

  @Test
  public void testSelectById() {
    Map<String, Object> expected = Maps.newHashMap();
    expected.put("_id", "testId");

    DBObject query = queries.selectById("testId");
    assertEquals(expected, query.toMap());
  }

  @Test
  public void testSelectByProperty() {
    Map<String, Object> expected = Maps.newHashMap();
    expected.put(propertyName(BaseDomainEntity.class, "value1"), "testValue");

    DBObject query = queries.selectByProperty(BaseDomainEntity.class, "value1", "testValue");
    assertEquals(expected, query.toMap());
  }

  @Test
  public void testSelectVersionByIdAndRevision() {
    int revision = 2;
    String expected = String.format("{ \"versions\" : { \"$elemMatch\" : { \"^rev\" : %d}}}", revision);

    DBObject query = queries.getRevisionProjection(revision);

    String actual = query.toString();

    /* 
     * Ignore all the whitespaces. IsEqualIgnoringWhiteSpace cannot be used, because it ignores only the 
     * one before and after the string and converts multiple whitespaces to a single space.
     */
    assertThat(actual.replaceAll(" ", ""), equalTo(expected.replaceAll(" ", "")));
  }

  @Test
  public void testSelectByModifiedDate() {
    // setup
    Date dateValue = new Date();
    String expectedQuery = String.format("{\"^modified.timeStamp\":{\"$lt\":%d}}", dateValue.getTime());

    // action
    DBObject query = queries.selectByModifiedDate(dateValue);

    // verify
    assertThat(query.toString().replaceAll(" ", ""), is(equalTo(expectedQuery.replaceAll(" ", ""))));

  }
}
