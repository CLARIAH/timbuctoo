package nl.knaw.huygens.timbuctoo.index;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Set;

import nl.knaw.huygens.facetedsearch.model.FacetDefinition;
import nl.knaw.huygens.facetedsearch.model.parameters.IndexDescription;
import nl.knaw.huygens.facetedsearch.model.parameters.IndexDescriptionBuilder;
import nl.knaw.huygens.timbuctoo.index.model.ExplicitlyAnnotatedModel;
import nl.knaw.huygens.timbuctoo.model.DomainEntity;
import nl.knaw.huygens.timbuctoo.search.FacetFinder;
import nl.knaw.huygens.timbuctoo.search.FullTextSearchFieldFinder;
import nl.knaw.huygens.timbuctoo.search.IndexedFieldFinder;
import nl.knaw.huygens.timbuctoo.search.SortableFieldFinder;

import org.junit.Test;

import com.google.common.collect.Lists;
import com.google.common.collect.Sets;

public class IndexDescriptionFactoryTest {
  @Test
  public void testCreate() {
    // setup
    FacetFinder facetFinderMock = mock(FacetFinder.class);
    SortableFieldFinder sortableFieldFinderMock = mock(SortableFieldFinder.class);
    FullTextSearchFieldFinder fullTextSearchFieldFinderMock = mock(FullTextSearchFieldFinder.class);
    IndexedFieldFinder indexedFieldFinderMock = mock(IndexedFieldFinder.class);
    Class<? extends DomainEntity> type = ExplicitlyAnnotatedModel.class;

    List<FacetDefinition> facetDefinitions = Lists.newArrayList();
    when(facetFinderMock.findFacetDefinitions(type)).thenReturn(facetDefinitions);

    Set<String> fullTextSearchFields = Sets.newHashSet();
    when(fullTextSearchFieldFinderMock.findFields(type)).thenReturn(fullTextSearchFields);

    Set<String> indexFields = Sets.newHashSet();
    when(indexedFieldFinderMock.findFields(type)).thenReturn(indexFields);

    Set<String> sortFields = Sets.newHashSet();
    when(sortableFieldFinderMock.findFields(type)).thenReturn(sortFields);

    IndexDescription indexDescriptionMock = mock(IndexDescription.class);
    IndexDescriptionBuilder indexDescriptionBuilderMock = mock(IndexDescriptionBuilder.class);
    when(indexDescriptionBuilderMock.setFacetDefinitions(facetDefinitions)).thenReturn(indexDescriptionBuilderMock);
    when(indexDescriptionBuilderMock.setFullTextSearchFields(fullTextSearchFields)).thenReturn(indexDescriptionBuilderMock);
    when(indexDescriptionBuilderMock.setIndexedFields(indexFields)).thenReturn(indexDescriptionBuilderMock);
    when(indexDescriptionBuilderMock.setSortFields(sortFields)).thenReturn(indexDescriptionBuilderMock);
    when(indexDescriptionBuilderMock.build()).thenReturn(indexDescriptionMock);

    IndexDescriptionFactory instance = new IndexDescriptionFactory(indexDescriptionBuilderMock, facetFinderMock, fullTextSearchFieldFinderMock, indexedFieldFinderMock, sortableFieldFinderMock);

    // action
    IndexDescription indexDescription = instance.create(type);

    // verify
    verify(indexDescriptionBuilderMock).setFacetDefinitions(facetDefinitions);
    verify(indexDescriptionBuilderMock).setFullTextSearchFields(fullTextSearchFields);
    verify(indexDescriptionBuilderMock).setIndexedFields(indexFields);
    verify(indexDescriptionBuilderMock).setSortFields(sortFields);
    verify(indexDescriptionBuilderMock).build();
    assertThat(indexDescription, equalTo(indexDescriptionMock));
  }
}