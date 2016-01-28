package nl.knaw.huygens.timbuctoo.search.description.facet;

import nl.knaw.huygens.timbuctoo.search.description.FacetDescription;
import nl.knaw.huygens.timbuctoo.search.description.PropertyParser;
import nl.knaw.huygens.timbuctoo.search.description.propertyparser.PropertyParserFactory;
import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.instanceOf;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

public class FacetDescriptionFactoryTest {

  private FacetDescriptionFactory instance;
  private PropertyParserFactory parserFactory;

  @Before
  public void setUp() throws Exception {
    parserFactory = mock(PropertyParserFactory.class);
    instance = new FacetDescriptionFactory(parserFactory);
  }

  @Test
  public void createListFacetDescriptionCreatesAListFacetDescription() {
    PropertyParser parser = mock(PropertyParser.class);

    FacetDescription description = instance.createListFacetDescription("facetName", parser, "propertyName");

    assertThat(description, is(instanceOf(ListFacetDescription.class)));
  }

  @Test
  public void createListFacetLetsThePropertyParserFactoryCreateAParser() {
    FacetDescription description = instance.createListFacetDescription("facetName", String.class, "propertyName");

    assertThat(description, is(notNullValue()));
    verify(parserFactory).getParser(String.class);
  }

  @Test
  public void createListFacetDescriptionWithARelationCreatesADerivedListFacetDescription() {
    PropertyParser parser = mock(PropertyParser.class);

    FacetDescription description = instance.createListFacetDescription("facetName", parser, "propertyName", "relation");

    assertThat(description, is(instanceOf(DerivedListFacetDescription.class)));
  }

  @Test
  public void createListFacetDescriptionWithARelationLetsThePropertyParserFactoryCreateAParser() {
    FacetDescription description =
      instance.createListFacetDescription("facetName", String.class, "propertyName", "relation");

    verify(parserFactory).getParser(String.class);
  }

  @Test
  public void createListFacetDescriptionWithMultipleRelationsCreatesADerivedListFacetDescription() {
    PropertyParser parser = mock(PropertyParser.class);

    FacetDescription description =
      instance.createListFacetDescription("facetName", parser, "propertyName", "relation", "relation2");

    assertThat(description, is(instanceOf(DerivedListFacetDescription.class)));
  }

  @Test
  public void createListFacetDescriptionWithMultipleRelationsLetsThePropertyParserFactoryCreateAParser() {
    FacetDescription description =
      instance.createListFacetDescription("facetName", String.class, "propertyName", "relation", "relation2");

    verify(parserFactory).getParser(String.class);
  }

  @Test
  public void createKeywordFacetDescriptionCreatesADerivedListFacetDescription() {
    FacetDescription description = instance.createKeywordDescription("facetName", "relationName");

    assertThat(description, is(instanceOf(DerivedListFacetDescription.class)));
    verify(parserFactory).getParser(String.class);
  }

  @Test
  public void createRangeFacetCreatesARangeFacetDescriptionCreateARangeFacetDescription() {
    FacetDescription facetDescription = instance.createRangeFacetDescription("facetName", "propertyName");

    assertThat(facetDescription, is(instanceOf(DateRangeFacetDescription.class)));
  }

}
