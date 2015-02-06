package nl.knaw.huygens.timbuctoo.model.neww;

/*
 * #%L
 * Timbuctoo model
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
import java.util.Map;

import nl.knaw.huygens.facetedsearch.model.FacetType;
import nl.knaw.huygens.timbuctoo.facet.IndexAnnotation;
import nl.knaw.huygens.timbuctoo.model.DerivedProperty;
import nl.knaw.huygens.timbuctoo.model.Document;
import nl.knaw.huygens.timbuctoo.model.RelationRef;
import nl.knaw.huygens.timbuctoo.oaipmh.DublinCoreMetadataField;
import nl.knaw.huygens.timbuctoo.oaipmh.OAIDublinCoreField;
import nl.knaw.huygens.timbuctoo.util.Text;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

public class WWDocument extends Document {

  private boolean source;
  private String notes;
  private List<String> topoi;
  private String englishTitle;

  // --- temporary fields ------------------------------------------------------

  /**
   * Identification of record in NEWW database.
   * Used by COBWWEB services for linking records.
   */
  public String tempOldId;

  public String tempCreator;
  public String tempLanguage;
  public String tempOrigin;

  // ---------------------------------------------------------------------------

  public WWDocument() {
    source = false;
    topoi = Lists.newArrayList();
  }

  @Override
  public String getIdentificationName() {
    StringBuilder builder = new StringBuilder();
    for (RelationRef ref : getRelations("isCreatedBy")) {
      Text.appendTo(builder, ref.getDisplayName(), "; ");
    }
    Text.appendTo(builder, getTitle(), " - ");
    if (getDate() != null) {
      int year = getDate().getFromYear();
      builder.append(String.format(" (%d)", year));
    }
    return builder.toString();
  }

  @IndexAnnotation(fieldName = "dynamic_b_is_source", facetType = FacetType.BOOLEAN, isFaceted = true)
  public boolean isSource() {
    return source;
  }

  public void setSource(boolean source) {
    this.source = source;
  }

  public String getNotes() {
    return notes;
  }

  public void setNotes(String notes) {
    this.notes = notes;
  }

  public List<String> getTopoi() {
    return topoi;
  }

  public void setTopoi(List<String> topoi) {
    this.topoi = topoi;
  }

  public void addTopos(String topos) {
    if (topos != null) {
      topoi.add(topos);
    }
  }

  @JsonIgnore
  public boolean isValid() {
    return getTitle() != null;
  }

  @JsonIgnore
  @IndexAnnotation(fieldName = "dynamic_s_genre", accessors = { "getDisplayName" }, canBeEmpty = true, isFaceted = true)
  public List<RelationRef> getGenres() {
    return getRelations("hasGenre");
  }

  @JsonIgnore
  @IndexAnnotation(fieldName = "dynamic_s_library", accessors = { "getDisplayName" }, canBeEmpty = true, isFaceted = false)
  public List<RelationRef> getLibraries() {
    // Relation with collectives with type "library".
    return getRelations("isStoredAt");
  }

  @JsonIgnore
  @IndexAnnotation(fieldName = "dynamic_s_origin", accessors = { "getDisplayName" }, canBeEmpty = true, isFaceted = true)
  public List<RelationRef> getOrigins() {
    return getRelations("hasPublishLocation");
  }

  public String getEnglishTitle() {
    return englishTitle;
  }

  public void setEnglishTitle(String englishTitle) {
    this.englishTitle = englishTitle;
  }

  // ---------------------------------------------------------------------------

  private static final DerivedProperty AUTHOR_GENDER = new DerivedProperty("authorGender", "isCreatedBy", "getGender");
  private static final List<DerivedProperty> DERIVED_PROPERTIES = ImmutableList.of(AUTHOR_GENDER);

  @Override
  public List<DerivedProperty> getDerivedProperties() {
    return DERIVED_PROPERTIES;
  }

  @Override
  public Map<String, String> getClientRepresentation() {
    Map<String, String> data = Maps.newTreeMap();
    addItemToRepresentation(data, "id", getId());
    addItemToRepresentation(data, "title", getTitle());
    addItemToRepresentation(data, "type", getDocumentType());
    addItemToRepresentation(data, "date", getDate() != null ? getDate().getFromYear() : null);
    addRelationToRepresentation(data, "genre", "hasGenre");
    addRelationToRepresentation(data, "language", "hasWorkLanguage");
    addRelationToRepresentation(data, "publishLocation", "hasPublishLocation");
    addRelationToRepresentation(data, "createdBy", "isCreatedBy");
    addItemToRepresentation(data, "authorGender", getProperty("authorGender"));
    return data;
  }

  // ---------------------------------------------------------------------------
  @JsonIgnore
  @OAIDublinCoreField(dublinCoreField = DublinCoreMetadataField.TITLE)
  public String getCMDITitle() {
    return getTitle();
  }

  @JsonIgnore
  @OAIDublinCoreField(dublinCoreField = DublinCoreMetadataField.DESCRIPTION)
  public String getCMDIDescription() {
    StringBuilder sb = new StringBuilder();

    List<RelationRef> origins = getOrigins();
    if (origins != null) {
      for (RelationRef ref : origins) {
        Text.appendTo(sb, ref.getDisplayName(), " ");
      }
    }

    Text.appendTo(sb, getDocumentType(), " ");

    return sb.toString();
  }

}
