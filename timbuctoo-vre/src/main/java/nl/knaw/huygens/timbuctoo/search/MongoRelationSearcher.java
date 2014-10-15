package nl.knaw.huygens.timbuctoo.search;

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

import java.util.List;
import java.util.Set;

import nl.knaw.huygens.solr.RelationSearchParameters;
import nl.knaw.huygens.timbuctoo.Repository;
import nl.knaw.huygens.timbuctoo.model.DomainEntity;
import nl.knaw.huygens.timbuctoo.model.Relation;
import nl.knaw.huygens.timbuctoo.model.SearchResult;
import nl.knaw.huygens.timbuctoo.storage.StorageException;
import nl.knaw.huygens.timbuctoo.vre.SearchException;
import nl.knaw.huygens.timbuctoo.vre.VRE;

import org.apache.commons.lang3.time.StopWatch;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.base.Predicate;
import com.google.inject.Inject;
import com.google.inject.Singleton;

@Singleton
public class MongoRelationSearcher extends RelationSearcher {

  private static final Logger LOG = LoggerFactory.getLogger(MongoRelationSearcher.class);

  private final CollectionConverter collectionConverter;
  private final RelationSearchResultCreator relationSearchResultCreator;

  @Inject
  public MongoRelationSearcher(Repository repository, CollectionConverter collectionConverter, RelationSearchResultCreator relationSearchResultCreator) {
    super(repository);
    this.collectionConverter = collectionConverter;
    this.relationSearchResultCreator = relationSearchResultCreator;
  }

  @Override
  public SearchResult search(VRE vre, Class<? extends DomainEntity> relationType, RelationSearchParameters relationSearchParameters) throws SearchException {
    List<String> sourceIds = getSearchResultIds(relationSearchParameters.getSourceSearchId());
    List<String> targetIds = getSearchResultIds(relationSearchParameters.getTargetSearchId());

    List<String> relationTypeIds = getRelationTypes(relationSearchParameters.getRelationTypeIds(), vre);

    // retrieve the relations
    StopWatch relationRetrievelStopWatch = new StopWatch();
    relationRetrievelStopWatch.start();

    FilterableSet<Relation> filterableRelations = getRelationsAsFilterableSet(relationTypeIds);

    relationRetrievelStopWatch.stop();
    logStopWatchTimeInSeconds(relationRetrievelStopWatch, "relation retrieval duration");

    //Start filtering
    StopWatch filterStopWatch = new StopWatch();
    filterStopWatch.start();

    Predicate<Relation> predicate = new RelationSourceTargetPredicate<Relation>(sourceIds, targetIds);
    Set<Relation> filteredRelations = filterableRelations.filter(predicate);

    filterStopWatch.stop();
    logStopWatchTimeInSeconds(filterStopWatch, "filter duration");

    //Create the search result
    StopWatch searchResultCreationStopWatch = new StopWatch();
    searchResultCreationStopWatch.start();

    String typeString = relationSearchParameters.getTypeString();
    SearchResult searchResult = relationSearchResultCreator.create(vre.getVreId(), typeString, filteredRelations, sourceIds, targetIds, relationTypeIds);

    searchResultCreationStopWatch.stop();
    logStopWatchTimeInSeconds(searchResultCreationStopWatch, "search result creation");

    return searchResult;
  }

  private FilterableSet<Relation> getRelationsAsFilterableSet(List<String> relationTypeIds) throws SearchException {
    List<Relation> relations;
    try {
      relations = repository.getRelationsByType(Relation.class, relationTypeIds);
    } catch (StorageException e) {
      throw new SearchException(e);
    }
    return collectionConverter.toFilterableSet(relations);
  }

  private List<String> getSearchResultIds(String searchId) {
    SearchResult sourceSearch = repository.getEntity(SearchResult.class, searchId);
    return sourceSearch.getIds();
  }

}
