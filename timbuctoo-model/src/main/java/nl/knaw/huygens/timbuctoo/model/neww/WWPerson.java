package nl.knaw.huygens.timbuctoo.model.neww;

/*
 * #%L
 * Timbuctoo model
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
import java.util.Map;

import nl.knaw.huygens.timbuctoo.facet.IndexAnnotation;
import nl.knaw.huygens.timbuctoo.model.DerivedRelationType;
import nl.knaw.huygens.timbuctoo.model.Person;
import nl.knaw.huygens.timbuctoo.model.RelationRef;

import org.apache.commons.lang.StringUtils;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

public class WWPerson extends Person {

  private String bibliography;
  private String children;
  private List<String> fsPseudonyms;
  private String health;
  private String livedIn;
  private String nationality;
  private String notes;
  private String personalSituation;

  // --- temporary fields ------------------------------------------------------

  /**
   * Identification of record in NEWW database.
   * Used by COBWWEB services for linking records.
   */
  public String tempOldId;

  public String tempBirthPlace;
  public String tempChildren;
  public String tempCollaborations; // as relation
  public String tempDeathPlace;
  public String tempDeath;
  public String tempFinancialSituation;
  public String tempMemberships; // as relation
  public String tempMotherTongue;
  private String tempName;
  public String tempPlaceOfBirth;
  public String tempPsChildren;
  public String tempPseudonyms;
  private String tempSpouse;

  // ---------------------------------------------------------------------------

  public WWPerson() {
    fsPseudonyms = Lists.newArrayList();
    setChildren(null); // default
  }

  @Override
  public String getDisplayName() {
    String name = defaultName().getShortName();
    return StringUtils.stripToEmpty(name).isEmpty() ? "[TEMP] " + tempName : name;
  }

  public String getBibliography() {
    return bibliography;
  }

  public void setBibliography(String bibliography) {
    this.bibliography = bibliography;
  }

  public String getChildren() {
    return children;
  }

  public void setChildren(String value) {
    children = Children.normalize(value);
  }

  public List<String> getFsPseudonyms() {
    return fsPseudonyms;
  }

  public void setFsPseudonyms(List<String> fsPseudonyms) {
    this.fsPseudonyms = fsPseudonyms;
  }

  public void addFsPseudonym(String value) {
    if (value != null) {
      fsPseudonyms.add(value);
    }
  }

  public String getHealth() {
    return health;
  }

  public void setHealth(String health) {
    this.health = health;
  }

  public String getLivedIn() {
    return livedIn;
  }

  public void setLivedIn(String livedIn) {
    this.livedIn = livedIn;
  }

  public String getNationality() {
    return nationality;
  }

  public void setNationality(String nationality) {
    this.nationality = nationality;
  }

  @IndexAnnotation(fieldName = "dynamic_t_notes", canBeEmpty = true)
  public String getNotes() {
    return notes;
  }

  public void setNotes(String notes) {
    this.notes = notes;
  }

  public String getPersonalSituation() {
    return personalSituation;
  }

  public void setPersonalSituation(String personalSituation) {
    this.personalSituation = personalSituation;
  }

  // Indexed for curation phase only
  @IndexAnnotation(fieldName = "dynamic_t_tempname", canBeEmpty = true)
  public String getTempName() {
    return tempName;
  }

  public void setTempName(String tempName) {
    this.tempName = tempName;
  }

  // Indexed for curation phase only
  @IndexAnnotation(fieldName = "dynamic_t_tempspouse", canBeEmpty = true)
  public String getTempSpouse() {
    return tempSpouse;
  }

  public void setTempSpouse(String tempSpouse) {
    this.tempSpouse = tempSpouse;
  }

  // NOTE. Some relations are generic, but a project need not be interested
  // So it seems to make sense to define relations here and not in Person

  @JsonIgnore
  @IndexAnnotation(fieldName = "dynamic_s_residence", accessors = { "getDisplayName" }, canBeEmpty = true, isFaceted = true)
  public List<RelationRef> getResidenceLocation() {
    return getRelations().get("hasResidenceLocation");
  }

  @JsonIgnore
  @IndexAnnotation(fieldName = "dynamic_s_language", accessors = { "getDisplayName" }, canBeEmpty = true, isFaceted = true)
  public List<RelationRef> getPrimaryLanguages() {
    return getRelations("hasPersonLanguage");
  }

  @JsonIgnore
  @IndexAnnotation(fieldName = "dynamic_s_collective", accessors = { "getDisplayName" }, canBeEmpty = true, isFaceted = true)
  public List<RelationRef> getCollectives() {
    return getRelations("isMemberOf");
  }

  @JsonIgnore
  @IndexAnnotation(fieldName = "dynamic_s_religion", accessors = { "getDisplayName" }, canBeEmpty = true, isFaceted = true)
  public List<RelationRef> getReligions() {
    return getRelations("hasReligion");
  }

  @Override
  @JsonIgnore
  public List<DerivedRelationType> getDerivedRelationTypes() {
    // adds works of pseudonyms of a person to that person
    // return ImmutableList.of(new DerivedRelationType("isCreatorOf", "hasPseudonym", "isCreatorOf"));
    return ImmutableList.of(new DerivedRelationType("hasPersonLanguage", "isCreatorOf", "hasWorkLanguage"));
  }

  @Override
  public Map<String, String> getClientRepresentation() {
    Map<String, String> data = Maps.newTreeMap();
    String name = defaultName().getShortName();
    addItemToRepresentation(data, "name", StringUtils.stripToEmpty(name).isEmpty() ? getTempName() : name);
    addItemToRepresentation(data, "gender", getGender());
    addItemToRepresentation(data, "birthDate", getBirthDate() != null ? getBirthDate().getFromYear() : null);
    addItemToRepresentation(data, "deathDate", getDeathDate() != null ? getDeathDate().getFromYear() : null);
    addRelationToRepresentation(data, "residenceLocation", "hasResidenceLocation");
    return data;
  }

  // ---------------------------------------------------------------------------

  // Not an enumerated type because of serialization problems.
  public static class Children {
    public static final String UNKNOWN = "UNKNOWN";
    public static final String NO = "NO";
    public static final String YES = "YES";

    public static String normalize(String value) {
      if (NO.equalsIgnoreCase(value)) {
        return NO;
      } else if (YES.equalsIgnoreCase(value)) {
        return YES;
      } else {
        return UNKNOWN;
      }
    }
  }

}
