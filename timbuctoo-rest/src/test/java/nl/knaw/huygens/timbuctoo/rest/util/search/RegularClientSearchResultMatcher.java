package nl.knaw.huygens.timbuctoo.rest.util.search;

/*
 * #%L
 * Timbuctoo REST api
 * =======
 * Copyright (C) 2012 - 2015 Huygens ING
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

import nl.knaw.huygens.facetedsearch.model.Facet;
import nl.knaw.huygens.timbuctoo.model.DomainEntity;
import nl.knaw.huygens.timbuctoo.model.DomainEntityDTO;
import nl.knaw.huygens.timbuctoo.model.RegularSearchResultDTO;

import org.hamcrest.Description;

import com.google.common.base.Objects;

public class RegularClientSearchResultMatcher extends ClientSearchResultMatcher<RegularSearchResultDTO> {

  private final String term;
  private final List<Facet> facets;
  private final List<DomainEntityDTO> refs;

  private RegularClientSearchResultMatcher( //
      String term, //
      List<Facet> facets, //
      int numFound, //
      List<String> ids, //
      List<DomainEntityDTO> refs, //
      List<? extends DomainEntity> results, //
      int start, //
      int rows, //
      Set<String> sortableFields, //
      String nextLink, //
      String prevLink) {

    super(numFound, ids, results, start, rows, sortableFields, nextLink, prevLink);

    this.term = term;
    this.facets = facets;
    this.refs = refs;
  }

  @Override
  public void describeTo(Description description) {
    description.appendText("RegularClientSearchResult with \n");

    addToDescription(description, "term", term);
    addToDescription(description, "facets", facets);
    addToDescription(description, "numFound", numFound);
    addToDescription(description, "ids", ids);
    addToDescription(description, "refs", refs);
    addToDescription(description, "results", results);
    addToDescription(description, "start", start);
    addToDescription(description, "rows", rows);
    addToDescription(description, "sortableFields", sortableFields);
    addToDescription(description, "nextLink", nextLink);
    addToDescription(description, "prevLink", prevLink);
  }

  @Override
  protected void describeMismatchSafely(RegularSearchResultDTO item, Description mismatchdescription) {
    mismatchdescription.appendText("RegularClientSearchResult with \n");

    addToDescription(mismatchdescription, "term", item.getTerm());
    addToDescription(mismatchdescription, "facets", item.getFacets());
    addToDescription(mismatchdescription, "numFound", item.getNumFound());
    addToDescription(mismatchdescription, "ids", item.getIds());
    addToDescription(mismatchdescription, "refs", item.getRefs());
    addToDescription(mismatchdescription, "start", item.getStart());
    addToDescription(mismatchdescription, "rows", item.getRows());
    addToDescription(mismatchdescription, "sortableFields", item.getSortableFields());
    addToDescription(mismatchdescription, "nextLink", item.getNextLink());
    addToDescription(mismatchdescription, "prevLink", item.getPrevLink());
  }

  @Override
  protected boolean matchesSafely(RegularSearchResultDTO item) {
    boolean isEqual = super.matchesSafely(item);
    isEqual &= Objects.equal(term, item.getTerm());
    isEqual &= Objects.equal(facets, item.getFacets());
    isEqual &= Objects.equal(refs, item.getRefs());

    return isEqual;
  }

  public static RegularClientSearchResultMatcherBuilder newRegularClientSearchResultMatcherBuilder() {
    return new RegularClientSearchResultMatcherBuilder();
  }

  public static class RegularClientSearchResultMatcherBuilder {
    private String term;
    private List<Facet> facets;
    private int numFound;
    private List<String> ids;
    private List<DomainEntityDTO> refs;
    private List<? extends DomainEntity> results;
    private int start;
    private int rows;
    private Set<String> sortableFields;
    private String nextLink;
    private String prevLink;

    public RegularClientSearchResultMatcherBuilder withTerm(String term) {
      this.term = term;
      return this;
    }

    public RegularClientSearchResultMatcherBuilder withFacets(List<Facet> facets) {
      this.facets = facets;
      return this;
    }

    public RegularClientSearchResultMatcherBuilder withNumFound(int numFound) {
      this.numFound = numFound;
      return this;
    }

    public RegularClientSearchResultMatcherBuilder withIds(List<String> ids) {
      this.ids = ids;
      return this;
    }

    public RegularClientSearchResultMatcherBuilder withRefs(List<DomainEntityDTO> refs) {
      this.refs = refs;
      return this;
    }

    public RegularClientSearchResultMatcherBuilder withResults(List<? extends DomainEntity> results) {
      this.results = results;
      return this;
    }

    public RegularClientSearchResultMatcherBuilder withStart(int start) {
      this.start = start;
      return this;
    }

    public RegularClientSearchResultMatcherBuilder withRows(int rows) {
      this.rows = rows;
      return this;
    }

    public RegularClientSearchResultMatcherBuilder withSortableFields(Set<String> sortableFields) {
      this.sortableFields = sortableFields;
      return this;
    }

    public RegularClientSearchResultMatcherBuilder withNextLink(String nextLink) {
      this.nextLink = nextLink;
      return this;
    }

    public RegularClientSearchResultMatcherBuilder withPrevLink(String prevLink) {
      this.prevLink = prevLink;
      return this;
    }

    public RegularClientSearchResultMatcher build() {
      return new RegularClientSearchResultMatcher(term, facets, numFound, ids, refs, results, start, rows, sortableFields, nextLink, prevLink);
    }
  }
}
