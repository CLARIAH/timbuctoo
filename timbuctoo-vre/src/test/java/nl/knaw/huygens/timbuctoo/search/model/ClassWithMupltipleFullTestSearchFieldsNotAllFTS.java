package nl.knaw.huygens.timbuctoo.search.model;

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

import nl.knaw.huygens.timbuctoo.facet.IndexAnnotation;
import nl.knaw.huygens.timbuctoo.model.DomainEntity;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class ClassWithMupltipleFullTestSearchFieldsNotAllFTS extends DomainEntity {

  private String simpleIndexField;

  @Override
  @JsonIgnore
  @IndexAnnotation(fieldName = "desc")
  public String getDisplayName() {
    // TODO Auto-generated method stub
    return null;
  }

  @IndexAnnotation(fieldName = "dynamic_t_simple", isFaceted = true, title = "Simple")
  public String getSimpleIndexField() {
    return simpleIndexField;
  }

  public void setSimpleIndexField(String simpleIndexField) {
    this.simpleIndexField = simpleIndexField;
  }

  @IndexAnnotation(fieldName = "dynamic_s_simple", isFaceted = true, title = "Simple1")
  public String getSimpleIndexField1() {
    return simpleIndexField;
  }

  public void setSimpleIndexField1(String simpleIndexField) {
    this.simpleIndexField = simpleIndexField;
  }

}
