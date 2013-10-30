package nl.knaw.huygens.timbuctoo.search;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;

import nl.knaw.huygens.solr.FacetInfo;
import nl.knaw.huygens.solr.FacetParameter;
import nl.knaw.huygens.solr.FacetedSearchParameters;
import nl.knaw.huygens.solr.SolrUtils;
import nl.knaw.huygens.timbuctoo.config.TypeRegistry;
import nl.knaw.huygens.timbuctoo.facet.FacetCount;
import nl.knaw.huygens.timbuctoo.index.LocalSolrServer;
import nl.knaw.huygens.timbuctoo.model.Entity;
import nl.knaw.huygens.timbuctoo.model.SearchResult;
import nl.knaw.huygens.timbuctoo.vre.Scope;

import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrQuery.SortClause;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.response.FacetField;
import org.apache.solr.client.solrj.response.FacetField.Count;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrDocument;
import org.apache.solr.common.SolrDocumentList;

import com.google.common.collect.Lists;
import com.google.inject.Inject;
import com.google.inject.Singleton;

@Singleton
public class SearchManager {

  private final LocalSolrServer server;
  private final FacetFinder facetFinder;
  private final AbstractFieldFinder fullTextSearchFieldFinder;
  private final TypeRegistry typeRegistry;
  private final SortableFieldFinder sortableFieldFinder;

  @Inject
  public SearchManager(LocalSolrServer server, TypeRegistry registry) {
    this.server = server;
    this.facetFinder = new FacetFinder();
    this.fullTextSearchFieldFinder = new FullTextSearchFieldFinder();
    this.typeRegistry = registry;
    this.sortableFieldFinder = new SortableFieldFinder();
  }

  public Set<String> findSortableFields(Class<? extends Entity> type) {
    return sortableFieldFinder.findFields(type);
  }

  public SearchResult search(Scope scope, Class<? extends Entity> type, FacetedSearchParameters searchParameters) throws SolrServerException, NoSuchFacetException {
    String core = getCoreName(scope, type);
    Map<String, FacetInfo> facetInfoMap = facetFinder.findFacets(type);
    Set<String> fullTextSearchFields = fullTextSearchFieldFinder.findFields(type);
    String searchTerm = createSearchTerm(type, searchParameters, facetInfoMap.keySet(), fullTextSearchFields);
    QueryResponse response = doFacettedSearch(core, searchTerm, facetInfoMap.keySet(), searchParameters.getSort());
    SolrDocumentList documents = response.getResults();

    List<FacetCount> facets = getFacetCounts(response.getFacetFields(), facetInfoMap);

    List<String> ids = Lists.newArrayList();
    for (SolrDocument document : documents) {
      ids.add(document.getFieldValue("id").toString());
    }

    SearchResult searchResult = new SearchResult(ids, typeRegistry.getINameForType(type), searchTerm, searchParameters.getSort(), new Date());
    searchResult.setFacets(facets);

    return searchResult;
  }

  private String getCoreName(Scope scope, Class<? extends Entity> type) {
    Class<? extends Entity> baseType = typeRegistry.getBaseClass(type);
    String collectionName = typeRegistry.getINameForType(baseType);
    return String.format("%s.%s", scope.getName(), collectionName);
  }

  // FIXME this is probably suboptimal:
  private static final int ROWS = 20000;
  private static final int FACET_LIMIT = 10000;

  private QueryResponse doFacettedSearch(String core, String query, Collection<String> facetFieldNames, String sortField) throws SolrServerException {
    SolrQuery solrQuery = new SolrQuery();
    solrQuery.setQuery(query);
    solrQuery.setFields("id");
    solrQuery.setRows(ROWS);
    solrQuery.addFacetField(facetFieldNames.toArray(new String[facetFieldNames.size()]));
    solrQuery.setFacetMinCount(0);
    solrQuery.setFacetLimit(FACET_LIMIT);
    solrQuery.setFilterQueries("!cache=false");
    solrQuery.setSort(new SortClause(sortField, SolrQuery.ORDER.asc));
    return server.search(core, solrQuery);
  }

  private String createSearchTerm(Class<? extends Entity> type, FacetedSearchParameters searchParameters, Set<String> existingFacets, Set<String> fullTextSearchFields) throws NoSuchFacetException {
    List<FacetParameter> facetValues = searchParameters.getFacetValues();
    boolean usesFacets = facetValues != null && !facetValues.isEmpty();
    StringBuilder builder = new StringBuilder();
    String prefix = "";
    for (String field : fullTextSearchFields) {
      builder.append(prefix).append(usesFacets ? "+" : "").append(field).append(":");
      builder.append(formatTerm(searchParameters.getTerm()));
      prefix = " ";
    }
    if (usesFacets) {
      for (FacetParameter facetParameter : facetValues) {
        String name = facetParameter.getName();
        if (existingFacets.contains(name)) {
          builder.append(" +").append(name).append(":");
          builder.append(formatFacetValues(facetParameter.getValues()));
        } else {
          throw new NoSuchFacetException(name);
        }
      }
    }
    return builder.toString();
  }

  private String formatFacetValues(List<String> values) {
    if (values.size() > 1) {
      StringBuilder builder = new StringBuilder();
      builder.append("(");
      String prefix = "";
      for (String value : values) {
        builder.append(prefix).append(SolrUtils.escapeFacetId(value));
        prefix = " ";
      }
      builder.append(")");
      return builder.toString();
    }
    return SolrUtils.escapeFacetId(values.get(0));
  }

  private String formatTerm(String term) {
    if (term.trim().contains(" ")) {
      return String.format("(%s)", term);
    }
    return term;
  }

  private List<FacetCount> getFacetCounts(List<FacetField> facetFields, Map<String, FacetInfo> facetInfoMap) {
    List<FacetCount> facets = Lists.newArrayList();
    for (FacetField facetField : facetFields) {
      FacetInfo info = facetInfoMap.get(facetField.getName());

      FacetCount facet = new FacetCount();
      facet.setName(facetField.getName());
      facet.setTitle(info.getTitle());
      facet.setType(info.getType());

      for (Count count : facetField.getValues()) {
        if (count.getCount() > 0) {
          facet.addOption(new FacetCount.Option().setName(count.getName()).setCount(count.getCount()));
        }
      }

      if (!facet.getOptions().isEmpty()) {
        facets.add(facet);
      }
    }

    return facets;
  }

}
