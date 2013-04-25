package nl.knaw.huygens.repository.model;

import nl.knaw.huygens.repository.indexdata.IndexAnnotation;
import nl.knaw.huygens.repository.model.util.Datable;
import nl.knaw.huygens.repository.model.util.IDPrefix;

import com.fasterxml.jackson.annotation.JsonProperty;

@IDPrefix("PER")
public class Person extends Document {
  public String name;
  public Datable birthDate;
  public Datable deathDate;
  private String currentVariation;

  @Override
  public String getDescription() {
    return name;
  }

  @IndexAnnotation(fieldName = "facet_d_birthDate", isFaceted = true)
  public Datable getBirthDate() {
    return this.birthDate;
  }

  @IndexAnnotation(fieldName = "facet_d_deathDate", isFaceted = true)
  public Datable getDeathDate() {
    return this.deathDate;
  }

  @Override
  @JsonProperty("!currentVariation")
  public String getCurrentVariation() {
    return currentVariation;
  }

  @Override
  @JsonProperty("!currentVariation")
  public void setCurrentVariation(String currentVariation) {
    this.currentVariation = currentVariation;
  }

}
