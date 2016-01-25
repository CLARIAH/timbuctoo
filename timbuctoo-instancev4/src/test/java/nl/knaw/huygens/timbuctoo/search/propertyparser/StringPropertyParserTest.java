package nl.knaw.huygens.timbuctoo.search.propertyparser;

import nl.knaw.huygens.timbuctoo.search.PropertyParser;
import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;

public class StringPropertyParserTest extends AbstractPropertyParserTest {

  private StringPropertyParser instance;

  @Before
  public void setUp() throws Exception {
    instance = new StringPropertyParser();
  }

  @Test
  public void parseReturnsTheInputValue() {
    String input = "input";

    String output = instance.parse(input);

    assertThat(output, is(equalTo(input)));
  }

  @Override
  protected PropertyParser getInstance() {
    return instance;
  }
}