package nl.knaw.huygens.timbuctoo.rest.util.search;

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

import static nl.knaw.huygens.timbuctoo.rest.util.search.RelationClientSearchResultMatcher.newClientSearchResultMatcher;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import nl.knaw.huygens.timbuctoo.model.ClientRelationRepresentation;
import nl.knaw.huygens.timbuctoo.model.RelationClientSearchResult;
import nl.knaw.huygens.timbuctoo.model.SearchResult;

import org.junit.Before;
import org.junit.Test;

import test.rest.model.TestRelation;

import com.google.common.collect.Lists;

public class RelationClientSearchResultCreatorTest extends ClientSearchResultCreatorTest {
  private static final String TYPE_STRING = "testrelation";
  private static final ArrayList<ClientRelationRepresentation> REFS = Lists.newArrayList(new ClientRelationRepresentation(TYPE_STRING, "xtype", "id", "relationName", "sourceName", "targetName"));
  private RelationClientSearchResultCreator instance;
  private ClientRelationRepresentationCreator clientRelationRepresentationCreatorMock;

  @Before
  public void setUp() {
    initializeRepository();
    initializeHATEOASURICreator();
    initilizeSortableFieldFinder();

    clientRelationRepresentationCreatorMock = mock(ClientRelationRepresentationCreator.class);

    instance = new RelationClientSearchResultCreator(repositoryMock, sortableFieldFinderMock, hateoasURICreatorMock, clientRelationRepresentationCreatorMock);
  }

  @Test
  public void testCreateStartIsZero() throws InstantiationException, IllegalAccessException {
    // setup
    int start = 0;
    int rows = 10;

    Class<TestRelation> type = TestRelation.class;
    SearchResult searchResult = new SearchResult();
    searchResult.setIds(ID_LIST_WITH_TEN_IDS);
    searchResult.setId(QUERY_ID);

    final List<String> idsToGet = ID_LIST_WITH_TEN_IDS;
    List<TestRelation> result = setupRepository(type, idsToGet);
    RelationClientSearchResultMatcher likeRelationClientResult = newClientSearchResultMatcher()//
        .withIds(idsToGet) //
        .withNumFound(TEN_RESULTS_FOUND) //
        .withRefs(REFS) //
        .withResults(result) //
        .withStart(start) //
        .withRows(rows) //
        .withSortableFields(SORTABLE_FIELDS) //
        .build();

    when(clientRelationRepresentationCreatorMock.createRefs(type, result)).thenReturn(REFS);

    testCreate(start, rows, type, searchResult, likeRelationClientResult);
  }

  @Test
  public void testCreateStartIsGreaterThanZero() throws InstantiationException, IllegalAccessException {
    // setup
    int start = 1;
    int previousStart = 0;
    int rows = 9;

    Class<TestRelation> type = TestRelation.class;
    SearchResult searchResult = new SearchResult();
    searchResult.setIds(ID_LIST_WITH_TEN_IDS);
    searchResult.setId(QUERY_ID);

    final List<String> idsToGet = ID_LIST_WITH_TEN_IDS.subList(1, 10);
    List<TestRelation> result = setupRepository(type, idsToGet);
    RelationClientSearchResultMatcher likeRelationClientResult = newClientSearchResultMatcher()//
        .withIds(idsToGet) //
        .withNumFound(TEN_RESULTS_FOUND) //
        .withRefs(REFS) //
        .withResults(result) //
        .withStart(start) //
        .withRows(rows) //
        .withSortableFields(SORTABLE_FIELDS) //
        .withPrevLink(PREV_LINK) //
        .build();

    when(clientRelationRepresentationCreatorMock.createRefs(type, result)).thenReturn(REFS);
    when(hateoasURICreatorMock.createHATEOASURIAsString(previousStart, rows, QUERY_ID)).thenReturn(PREV_LINK);

    testCreate(start, rows, type, searchResult, likeRelationClientResult);
  }

  @Test
  public void testCreateStartIsSmallerThanZero() throws InstantiationException, IllegalAccessException {
    // setup
    int start = -1;
    int normalizedStart = 0;
    int rows = 10;

    Class<TestRelation> type = TestRelation.class;
    SearchResult searchResult = new SearchResult();
    searchResult.setIds(ID_LIST_WITH_TEN_IDS);
    searchResult.setId(QUERY_ID);

    final List<String> idsToGet = ID_LIST_WITH_TEN_IDS;
    List<TestRelation> result = setupRepository(type, idsToGet);
    RelationClientSearchResultMatcher likeRelationClientResult = newClientSearchResultMatcher()//
        .withIds(idsToGet) //
        .withNumFound(TEN_RESULTS_FOUND) //
        .withRefs(REFS) //
        .withResults(result) //
        .withStart(normalizedStart) //
        .withRows(rows) //
        .withSortableFields(SORTABLE_FIELDS) //
        .build();

    when(clientRelationRepresentationCreatorMock.createRefs(type, result)).thenReturn(REFS);

    testCreate(start, rows, type, searchResult, likeRelationClientResult);
  }

  @Test
  public void testCreateStartAndRowsIsSmallerThatMax() throws InstantiationException, IllegalAccessException {
    // setup
    int start = 0;
    int nextStart = 5;
    int rows = 5;

    Class<TestRelation> type = TestRelation.class;
    SearchResult searchResult = new SearchResult();
    searchResult.setIds(ID_LIST_WITH_TEN_IDS);
    searchResult.setId(QUERY_ID);

    final List<String> idsToGet = ID_LIST_WITH_TEN_IDS.subList(0, 5);
    List<TestRelation> result = setupRepository(type, idsToGet);
    RelationClientSearchResultMatcher likeRelationClientResult = newClientSearchResultMatcher()//
        .withIds(idsToGet) //
        .withNumFound(TEN_RESULTS_FOUND) //
        .withRefs(REFS) //
        .withResults(result) //
        .withStart(start) //
        .withRows(rows) //
        .withSortableFields(SORTABLE_FIELDS) //
        .withNextLink(NEXT_LINK) //
        .build();

    when(clientRelationRepresentationCreatorMock.createRefs(type, result)).thenReturn(REFS);
    when(hateoasURICreatorMock.createHATEOASURIAsString(nextStart, rows, QUERY_ID)).thenReturn(NEXT_LINK);

    testCreate(start, rows, type, searchResult, likeRelationClientResult);
  }

  @Test
  public void testCreateWithRowsMoreThanMax() throws InstantiationException, IllegalAccessException {
    // setup
    int start = 0;
    int rows = 15;
    int normalizedRows = 10;

    Class<TestRelation> type = TestRelation.class;
    SearchResult searchResult = new SearchResult();
    searchResult.setIds(ID_LIST_WITH_TEN_IDS);
    searchResult.setId(QUERY_ID);

    final List<String> idsToGet = ID_LIST_WITH_TEN_IDS;
    List<TestRelation> result = setupRepository(type, idsToGet);
    RelationClientSearchResultMatcher likeRelationClientResult = newClientSearchResultMatcher()//
        .withIds(idsToGet) //
        .withNumFound(TEN_RESULTS_FOUND) //
        .withRefs(REFS) //
        .withResults(result) //
        .withStart(start) //
        .withRows(normalizedRows) //
        .withSortableFields(SORTABLE_FIELDS) //
        .build();

    when(clientRelationRepresentationCreatorMock.createRefs(type, result)).thenReturn(REFS);

    testCreate(start, rows, type, searchResult, likeRelationClientResult);
  }

  @Test
  public void testCreateStartGreaterThanNumFound() throws InstantiationException, IllegalAccessException {
    // setup
    int start = 11;
    int rows = 10;
    int normalizedStart = 10;
    int normalizedRows = 0;

    Class<TestRelation> type = TestRelation.class;
    SearchResult searchResult = new SearchResult();
    searchResult.setIds(ID_LIST_WITH_TEN_IDS);
    searchResult.setId(QUERY_ID);

    final List<String> idsToGet = ID_LIST_WITH_TEN_IDS.subList(normalizedStart, 10);
    List<TestRelation> result = setupRepository(type, idsToGet);
    RelationClientSearchResultMatcher likeRelationClientResult = newClientSearchResultMatcher()//
        .withIds(idsToGet) //
        .withNumFound(TEN_RESULTS_FOUND) //
        .withRefs(REFS) //
        .withResults(result) //
        .withStart(normalizedStart) //
        .withRows(normalizedRows) //
        .withSortableFields(SORTABLE_FIELDS) //
        .withPrevLink(PREV_LINK) //
        .build();

    int prevStart = 0;
    when(clientRelationRepresentationCreatorMock.createRefs(type, result)).thenReturn(REFS);
    when(hateoasURICreatorMock.createHATEOASURIAsString(prevStart, rows, QUERY_ID)).thenReturn(PREV_LINK);

    testCreate(start, rows, type, searchResult, likeRelationClientResult);
  }

  @Test
  public void testCreateWithSearchResultWithoutIds() throws InstantiationException, IllegalAccessException {
    // setup
    int start = 0;
    int rows = 0;

    Class<TestRelation> type = TestRelation.class;
    SearchResult searchResult = new SearchResult();
    searchResult.setId(QUERY_ID);

    final List<String> idsToGet = Lists.newArrayList();
    List<TestRelation> result = setupRepository(type, idsToGet);
    final List<ClientRelationRepresentation> emptyRefList = Lists.newArrayList();

    RelationClientSearchResultMatcher likeRelationClientResult = newClientSearchResultMatcher()//
        .withIds(idsToGet) //
        .withNumFound(0) //
        .withRefs(emptyRefList) //
        .withResults(result) //
        .withStart(start) //
        .withRows(rows) //
        .withSortableFields(SORTABLE_FIELDS) //
        .build();

    testCreate(start, rows, type, searchResult, likeRelationClientResult);
  }

  private void testCreate(int start, int rows, Class<TestRelation> type, SearchResult searchResult, RelationClientSearchResultMatcher likeRelationClientResult) {
    // action
    RelationClientSearchResult clientSearchResult = instance.create(type, searchResult, start, rows);

    assertThat(clientSearchResult, likeRelationClientResult);
  }
}
