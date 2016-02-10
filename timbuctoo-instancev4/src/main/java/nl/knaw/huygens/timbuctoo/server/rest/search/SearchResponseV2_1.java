package nl.knaw.huygens.timbuctoo.server.rest.search;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.common.collect.Lists;
import nl.knaw.huygens.timbuctoo.search.description.facet.Facet;

import java.util.List;

public class SearchResponseV2_1 {
  private List<Facet> facets;
  private List<String> fullTextSearchFields;
  private List<SearchResponseV2_1Ref> refs;
  private List<String> sortableFields;
  private int start;
  private int rows;
  private int numFound;
  private String next;

  public SearchResponseV2_1() {
    facets = Lists.newArrayList();
    fullTextSearchFields = Lists.newArrayList();
    refs = Lists.newArrayList();
    sortableFields = Lists.newArrayList();
  }

  public List<Facet> getFacets() {
    return facets;
  }

  public void setFacets(List<Facet> facets) {
    this.facets = facets;
  }

  public List<String> getFullTextSearchFields() {
    return fullTextSearchFields;
  }

  public void setFullTextSearchFields(List<String> fullTextSearchFields) {
    this.fullTextSearchFields = fullTextSearchFields;
  }

  public List<SearchResponseV2_1Ref> getRefs() {
    return refs;
  }

  public List<String> getSortableFields() {
    return sortableFields;
  }

  public void setSortableFields(List<String> sortableFields) {
    this.sortableFields = sortableFields;
  }

  public int getStart() {
    return start;
  }

  public void setStart(int start) {
    this.start = start;
  }

  public int getRows() {
    return rows;
  }

  public int getNumFound() {
    return numFound;
  }

  public void addRef(SearchResponseV2_1Ref ref) {
    refs.add(ref);
  }

  @JsonProperty("_next")
  public String getNext() {
    return next;
  }

  public void setNext(String next) {
    this.next = next;
  }
}
