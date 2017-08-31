package nl.knaw.huygens.timbuctoo.v5.rdfio.implementations.rdf4j;

import nl.knaw.huygens.timbuctoo.v5.dataset.RdfProcessor;
import org.junit.Before;
import org.junit.Test;

import java.io.StringReader;

import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

public class NquadsUdParserTest {

  private RdfProcessor rdfProcessor;
  private NquadsUdParser instance;

  @Before
  public void setUp() throws Exception {
    rdfProcessor = mock(RdfProcessor.class);
    instance = new NquadsUdParser();
    instance.setRDFHandler(new NquadsUdHandler(rdfProcessor, "http://example.org/file", "", 0));
  }

  @Test
  public void parseStripsTheActionAddsItToTheActionsHolder() throws Exception {
    instance.setRDFHandler(new NquadsUdHandler(rdfProcessor, "http://example.org/file", "", 0));
    StringReader reader =
      new StringReader("-<http://example.org/subject1> <http://pred> \"12\"^^<http://number> <http://some_graph> .");

    instance.parse(reader, "http://example.org/");

    verify(rdfProcessor).onQuad(
      false,
      "0",
      "http://example.org/subject1",
      "http://pred",
      "12",
      "http://number",
      null,
      "http://some_graph"
    );
  }

  @Test
  public void itAdds() throws Exception {
    StringReader reader =
      new StringReader("+<http://example.org/subject1> <http://pred> \"12\"^^<http://number> <http://some_graph> .");

    instance.parse(reader, "http://example.org/");

    verify(rdfProcessor).onQuad(
      true,
      "0",
      "http://example.org/subject1",
      "http://pred",
      "12",
      "http://number",
      null,
      "http://some_graph"
    );
  }

  @Test
  public void itIgnoresLinesThatStartWithoutAPlusOrAMinus() throws Exception {
    StringReader reader = new StringReader(
      " <http://example.org/subject1> <http://pred> \"12\"^^<http://number> <http://some_graph> .\n" +
        "@@ -1,4 +1,4 @@"
    );

    instance.parse(reader, "http://example.org/");

    verify(rdfProcessor, never()).onQuad(
      anyBoolean(), anyString(), anyString(), anyString(), anyString(), anyString(), anyString(), anyString()
    );
  }

  @Test
  public void itIgnoresLinesThatStartWithTriplePlusSigns() throws Exception {
    StringReader reader = new StringReader("+++ fruits2\t2017-08-16 11:38:05.327645535 +0200");

    instance.parse(reader, "http://example.org/");

    verify(rdfProcessor, never()).onQuad(
      anyBoolean(), anyString(), anyString(), anyString(), anyString(), anyString(), anyString(), anyString()
    );
  }

  @Test
  public void itIgnoresLinesThatStartWithTripleMinusSigns() throws Exception {
    StringReader reader = new StringReader("--- fruits1\t2017-08-16 11:37:47.247741827 +0200");

    instance.parse(reader, "http://example.org/");

    verify(rdfProcessor, never()).onQuad(
      anyBoolean(), anyString(), anyString(), anyString(), anyString(), anyString(), anyString(), anyString()
    );
  }

}
