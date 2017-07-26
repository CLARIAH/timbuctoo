package nl.knaw.huygens.timbuctoo.v5.datastores.implementations.json;

import com.google.common.collect.ArrayListMultimap;
import com.google.common.collect.ListMultimap;
import nl.knaw.huygens.timbuctoo.v5.dataset.PredicateData;
import nl.knaw.huygens.timbuctoo.v5.dataset.ValuePredicate;
import nl.knaw.huygens.timbuctoo.v5.datastores.schema.SchemaEntityProcessor;
import nl.knaw.huygens.timbuctoo.v5.datastores.schema.SchemaUpdater;
import nl.knaw.huygens.timbuctoo.v5.datastores.schema.dto.Type;
import org.assertj.core.util.Maps;
import org.junit.Test;
import org.mockito.ArgumentCaptor;

import java.util.Map;

import static nl.knaw.huygens.timbuctoo.v5.datastores.implementations.json.TypeMatcher.type;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasEntry;
import static org.hamcrest.Matchers.instanceOf;
import static org.hamcrest.Matchers.not;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

public class SchemaEntityProcessorTest {

  public static final String SUBJECT = "http://example.org/subject";

  @Test
  public void createsACompleteNewSchemaEachTime() throws Exception {
    ListMultimap<String, PredicateData> predicates = ArrayListMultimap.create();
    ValuePredicate hasNumberPred1 =
      new ValuePredicate("http://example.org/hasNumber", "12", "http://example.org/number");
    ValuePredicate hasNumberPred2 =
      new ValuePredicate("http://example.org/hasNumber", "14", "http://example.org/number");
    predicates.put("http://example.org/hasNumber", hasNumberPred1);
    predicates.put("http://example.org/hasNumber", hasNumberPred2);
    SchemaUpdater schemaUpdater = mock(SchemaUpdater.class);
    SchemaEntityProcessor instance = new SchemaEntityProcessor(schemaUpdater);

    instance.start();
    instance.processEntity("", SUBJECT, predicates, Maps.newHashMap());
    instance.finish();

    ArgumentCaptor<Map<String, Type>> argumentCaptor = ArgumentCaptor.forClass(Map.class);
    verify(schemaUpdater).replaceSchema(argumentCaptor.capture());
    assertThat(argumentCaptor.getValue(), hasEntry(
        instanceOf(String.class),
      type().withListPredicateWithName("http://example.org/hasNumber")
    ));

    ListMultimap<String, PredicateData> predicatesAfterFirstCreate = ArrayListMultimap.create();
    ValuePredicate hasIntPred = new ValuePredicate("http://example.org/hasInt", "14", "http://example.org/int");
    predicatesAfterFirstCreate.put("http://example.org/hasInt", hasIntPred);

    instance.start();
    instance.processEntity("", SUBJECT, predicatesAfterFirstCreate, Maps.newHashMap());
    instance.finish();

    ArgumentCaptor<Map<String, Type>> argumentCaptor2 = ArgumentCaptor.forClass(Map.class);
    verify(schemaUpdater, atLeastOnce()).replaceSchema(argumentCaptor2.capture());
    assertThat(argumentCaptor2.getValue(), not(hasEntry(
      instanceOf(String.class),
      type().withListPredicateWithName("http://example.org/hasNumber")
    )));
    assertThat(argumentCaptor2.getValue(), hasEntry(
      instanceOf(String.class),
      type().withSinglePredicateWithName("http://example.org/hasInt")
    ));
  }
}
