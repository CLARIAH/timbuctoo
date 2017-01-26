package nl.knaw.huygens.timbuctoo.rdf.tripleprocessor;

import com.fasterxml.jackson.databind.ObjectMapper;
import nl.knaw.huygens.timbuctoo.model.PersonName;
import nl.knaw.huygens.timbuctoo.model.PersonNameComponent;
import nl.knaw.huygens.timbuctoo.rdf.Database;
import nl.knaw.huygens.timbuctoo.rdf.Entity;
import nl.knaw.huygens.timbuctoo.rdf.UriBearingPersonNames;
import org.apache.jena.graph.Triple;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.util.Optional;

import static nl.knaw.huygens.timbuctoo.rdf.TripleHelper.createSingleTripleWithLiteralObject;
import static nl.knaw.huygens.timbuctoo.rdf.UriBearingPersonNamesJsonStringMatcher.matchesPersonNames;
import static org.junit.Assert.fail;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.hamcrest.MockitoHamcrest.argThat;

public class PersonNamesTripleProcessorTest {
  private static final String PERSON_URI = "http://example.com/Jan";
  private static final String TEI_NAMESPACE = "http://www.tei-c.org/ns/1.0/";
  private static final String PREDICATE_URI = TEI_NAMESPACE + "forename";
  private static final String DIFFERENT_PERSON_URI = "http://example.com/Other_Jan";
  private static final String NAMES_PROPERTY_NAME = "names";
  private static final String PERSON_NAMES_TYPE_NAME = "person-names";
  private static final String FORENAME = "Jan";
  private static final String FORENAME_LITERAL = "\"" + FORENAME + "\"^^<http://www.w3.org/2001/XMLSchema#string>";
  private static final String SURNAME = "Pietersz.";
  private static final String VRE_NAME = "vreName";
  private static final Triple
    TRIPLE_FOR_PERSON_URI = createSingleTripleWithLiteralObject(PERSON_URI, PREDICATE_URI, FORENAME_LITERAL);
  private Entity entity;
  private PersonNamesTripleProcessor instance;

  @Before
  public void setup() {
    final Database database = mock(Database.class);
    instance = new PersonNamesTripleProcessor(database);
    entity = mock(Entity.class);
    given(database.findOrCreateEntity(VRE_NAME, TRIPLE_FOR_PERSON_URI.getSubject())).willReturn(entity);
  }

  @Test
  public void processCreatesANewName() throws IOException {
    given(entity.getPropertyValue(NAMES_PROPERTY_NAME)).willReturn(Optional.empty());

    instance.process(VRE_NAME, true, TRIPLE_FOR_PERSON_URI);

    verify(entity).addProperty(
      eq(NAMES_PROPERTY_NAME),
      argThat(matchesPersonNames().withPersonName(0, forename(FORENAME), PERSON_URI)),
      eq(PERSON_NAMES_TYPE_NAME)
    );
  }


  @Test
  public void processAddsANewNameComponentWithTheSameSubjectUri() throws IOException {
    final UriBearingPersonNames existing = new UriBearingPersonNames();
    final PersonName existingName = new PersonName();
    existingName.addNameComponent(PersonNameComponent.Type.SURNAME, SURNAME);
    existing.list.add(existingName);
    existing.nameUris.put(PERSON_URI, 0);
    given(entity.getPropertyValue(NAMES_PROPERTY_NAME))
      .willReturn(Optional.of(new ObjectMapper().writeValueAsString(existing)));

    instance.process(VRE_NAME, true, TRIPLE_FOR_PERSON_URI);

    verify(entity).addProperty(
      eq(NAMES_PROPERTY_NAME),
      argThat(matchesPersonNames().withPersonName(0, PersonName.newInstance(FORENAME, SURNAME), PERSON_URI)),
      eq(PERSON_NAMES_TYPE_NAME)
    );
  }

  @Test
  public void processAddsANewNameWithADifferentSubjectUri() throws IOException {
    final UriBearingPersonNames existing = new UriBearingPersonNames();
    final PersonName existingName = surname(SURNAME);
    existing.list.add(existingName);
    existing.nameUris.put(DIFFERENT_PERSON_URI, 0);
    given(entity.getPropertyValue(NAMES_PROPERTY_NAME))
      .willReturn(Optional.of(new ObjectMapper().writeValueAsString(existing)));

    instance.process(VRE_NAME, true, TRIPLE_FOR_PERSON_URI);

    verify(entity).addProperty(
      eq(NAMES_PROPERTY_NAME),
      argThat(matchesPersonNames()
        .withPersonName(0, surname(SURNAME), DIFFERENT_PERSON_URI)
        .withPersonName(1, forename(FORENAME), PERSON_URI)
      ),
      eq(PERSON_NAMES_TYPE_NAME)
    );
  }

  
  private PersonName forename(String forename) {
    PersonName personName = new PersonName();
    personName.addNameComponent(PersonNameComponent.Type.FORENAME, forename);
    return personName;
  }

  private PersonName surname(String surname) {
    PersonName personName = new PersonName();
    personName.addNameComponent(PersonNameComponent.Type.SURNAME, surname);
    return personName;
  }
}
