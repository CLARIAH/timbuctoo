package nl.knaw.huygens.timbuctoo.rdf;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Sets;
import nl.knaw.huygens.timbuctoo.database.tinkerpop.changelistener.AddLabelChangeListener;
import org.apache.tinkerpop.gremlin.structure.Vertex;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.hamcrest.MockitoHamcrest.argThat;

public class TypesHelperTest {

  private TypesHelper instance;
  private AddLabelChangeListener labelChangeListener;

  @Before
  public void setup() {

    labelChangeListener = mock(AddLabelChangeListener.class);
    instance = new TypesHelper(labelChangeListener);
  }

  @Test
  public void updateTypeInformationGeneratesANewTypesPropertyFromTheCollections() throws Exception {
    Vertex vertex = mock(Vertex.class);
    Collection collection1 = mock(Collection.class);
    CollectionDescription desc1 = CollectionDescription.createCollectionDescription("entityTypeName", "vreName");
    when(collection1.getDescription()).thenReturn(desc1);
    Collection collection2 = mock(Collection.class);
    CollectionDescription desc2 = CollectionDescription.createCollectionDescription("otherEntityType", "vreName");
    when(collection2.getDescription()).thenReturn(desc2);

    instance.addTypeInformation(vertex, Sets.newHashSet(collection1, collection2), collection1);

    ArgumentCaptor<String> typesCaptor = ArgumentCaptor.forClass(String.class);
    verify(vertex).property(argThat(is("types")), typesCaptor.capture());
    List<String> typesList = new ObjectMapper().readValue(typesCaptor.getValue(), new TypeReference<List<String>>() {
    });
    assertThat(typesList, containsInAnyOrder(desc1.getEntityTypeName(), desc2.getEntityTypeName()));
    verify(labelChangeListener).handleRdfLabelAdd(vertex, "vreNameentityTypeName");
  }

  @Test
  public void updateTypeInformationUpdatesTheLabels() throws Exception {
    Collection collection1 = mock(Collection.class);
    when(collection1.getDescription()).thenReturn(
      CollectionDescription.createCollectionDescription("entityTypeName", "vreName"));
    Collection collection2 = mock(Collection.class);
    when(collection2.getDescription()).thenReturn(
      CollectionDescription.createCollectionDescription("otherEntityType", "vreName"));

    Vertex vertex = mock(Vertex.class);

    instance.removeTypeInformation(vertex, Sets.newHashSet(collection1), collection2);

    ArgumentCaptor<String> typesCaptor = ArgumentCaptor.forClass(String.class);
    verify(vertex).property(argThat(is("types")), typesCaptor.capture());
    assertThat(typesCaptor.getValue(), is("[\"vreNameentityTypeName\"]"));
    verify(labelChangeListener).handleRdfLabelRemove(vertex, "vreNameotherEntityType");
  }
}
