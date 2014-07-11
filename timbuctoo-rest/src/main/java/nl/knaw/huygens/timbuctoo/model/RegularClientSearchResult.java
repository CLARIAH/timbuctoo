package nl.knaw.huygens.timbuctoo.model;

import java.util.List;

import nl.knaw.huygens.facetedsearch.model.Facet;

public class RegularClientSearchResult extends ClientSearchResult {

  private String term;
  private List<Facet> facets;
  private List<ClientEntityRepresentation> refs;

  public String getTerm() {
    return term;
  }

  public List<Facet> getFacets() {
    return facets;
  }

  public List<ClientEntityRepresentation> getRefs() {
    return refs;
  }

  public void setRefs(List<ClientEntityRepresentation> refs) {
    this.refs = refs;
  }

  public void setFacets(List<Facet> facets) {
    this.facets = facets;
  }

  public void setTerm(String term) {
    this.term = term;
  }

}