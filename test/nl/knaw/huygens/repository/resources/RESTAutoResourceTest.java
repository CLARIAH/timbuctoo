package nl.knaw.huygens.repository.resources;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;

import net.handle.hdllib.HandleException;
import nl.knaw.huygens.repository.managers.StorageManager;
import nl.knaw.huygens.repository.model.util.DocumentTypeRegister;
import nl.knaw.huygens.repository.server.security.OAuthAuthorizationServerConnector;
import nl.knaw.huygens.repository.variation.model.TestConcreteDoc;

import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;

import com.google.common.collect.Lists;
import com.google.inject.Guice;
import com.google.inject.Injector;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.GenericType;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.core.ResourceConfig;
import com.sun.jersey.test.framework.AppDescriptor;
import com.sun.jersey.test.framework.JerseyTest;
import com.sun.jersey.test.framework.WebAppDescriptor;

public class RESTAutoResourceTest extends JerseyTest {
  private static Injector injector;
  private SecurityContext securityContext;
  private OAuthAuthorizationServerConnector oAuthAuthorizationServerConnector;

  @BeforeClass
  public static void setUpClass() {
    injector = Guice.createInjector(new RESTAutoResourceTestModule());
  }

  @Before
  public void setUpAuthorizationServerConnectorMock() {
    securityContext = mock(SecurityContext.class);
    oAuthAuthorizationServerConnector = injector.getInstance(OAuthAuthorizationServerConnector.class);

    doAnswer(new Answer<Object>() {
      @Override
      public Object answer(InvocationOnMock invocation) throws HandleException {
        String authorizationString = (String) invocation.getArguments()[0];

        if (authorizationString == null || authorizationString.trim().isEmpty()) {
          throw new WebApplicationException(Response.Status.UNAUTHORIZED);
        }

        return securityContext;
      }
    }).when(oAuthAuthorizationServerConnector).authenticate(anyString());
  }

  @After
  public void tearDownAuthorizationServerConnectorMock() {
    securityContext = null;
    oAuthAuthorizationServerConnector = null;
  }

  public RESTAutoResourceTest() {
    super(new GuiceTestContainerFactory(injector));
  }

  @Override
  protected AppDescriptor configure() {
    WebAppDescriptor webAppDescriptor = new WebAppDescriptor.Builder("nl.knaw.huygens.repository.resources").build();
    webAppDescriptor.getInitParams().put(ResourceConfig.PROPERTY_CONTAINER_REQUEST_FILTERS, "nl.knaw.huygens.repository.server.security.SecurityFilter");
    webAppDescriptor.getInitParams().put(ResourceConfig.PROPERTY_RESOURCE_FILTER_FACTORIES, "com.sun.jersey.api.container.filter.RolesAllowedResourceFilterFactory");

    return webAppDescriptor;
  }

  private void setUserInRole(boolean userInRole) {
    when(securityContext.isUserInRole(anyString())).thenReturn(userInRole);
  }

  @Test
  public void testGetDocExisting() {
    StorageManager storageManager = injector.getInstance(StorageManager.class);
    DocumentTypeRegister documentTypeRegister = injector.getInstance(DocumentTypeRegister.class);
    String id = "tst0000000001";

    TestConcreteDoc expectedDoc = new TestConcreteDoc();
    expectedDoc.setId(id);

    when(storageManager.getCompleteDocument(TestConcreteDoc.class, id)).thenReturn(expectedDoc);

    doReturn(TestConcreteDoc.class).when(documentTypeRegister).getClassFromTypeString(anyString());

    WebResource webResource = super.resource();
    TestConcreteDoc actualDoc = webResource.path("/resources/testconcretedoc/" + id).get(TestConcreteDoc.class);

    assertNotNull(actualDoc);
    assertEquals(expectedDoc.getId(), actualDoc.getId());
  }

  @Test
  public void testGetDocNonExistingInstance() {
    StorageManager storageManager = injector.getInstance(StorageManager.class);
    DocumentTypeRegister documentTypeRegister = injector.getInstance(DocumentTypeRegister.class);
    String id = "tst0000000001";

    when(storageManager.getCompleteDocument(TestConcreteDoc.class, id)).thenReturn(null);

    doReturn(TestConcreteDoc.class).when(documentTypeRegister).getClassFromTypeString(anyString());

    WebResource webResource = super.resource();
    ClientResponse clientResponse = webResource.path("/resources/testconcretedoc/" + id).get(ClientResponse.class);

    assertEquals(ClientResponse.Status.NOT_FOUND, clientResponse.getClientResponseStatus());
  }

  @Test
  public void testGetDocNonExistingClass() {
    DocumentTypeRegister documentTypeRegister = injector.getInstance(DocumentTypeRegister.class);
    String id = "tst0000000001";

    doReturn(null).when(documentTypeRegister).getClassFromTypeString(anyString());

    WebResource webResource = super.resource();
    ClientResponse clientResponse = webResource.path("/resources/testconcretedoc/" + id).get(ClientResponse.class);

    assertEquals(ClientResponse.Status.NOT_FOUND, clientResponse.getClientResponseStatus());
  }

  @Test
  public void testGetAllDocs() {
    StorageManager storageManager = injector.getInstance(StorageManager.class);
    DocumentTypeRegister documentTypeRegister = injector.getInstance(DocumentTypeRegister.class);

    List<TestConcreteDoc> expectedList = Lists.newArrayList();
    TestConcreteDoc doc1 = new TestConcreteDoc();
    doc1.setId("tst0000000001");
    expectedList.add(doc1);
    TestConcreteDoc doc2 = new TestConcreteDoc();
    doc2.setId("tst0000000002");
    expectedList.add(doc2);
    TestConcreteDoc doc3 = new TestConcreteDoc();
    doc3.setId("tst0000000001");
    expectedList.add(doc3);

    when(storageManager.getAllLimited(TestConcreteDoc.class, 0, 200)).thenReturn(expectedList);

    doReturn(TestConcreteDoc.class).when(documentTypeRegister).getClassFromTypeString(anyString());
    WebResource webResource = super.resource();

    GenericType<List<TestConcreteDoc>> genericType = new GenericType<List<TestConcreteDoc>>() {};
    List<TestConcreteDoc> actualList = webResource.path("/resources/testconcretedoc/all").header("Authorization", "bearer 12333322abef").get(genericType);

    assertEquals(expectedList.size(), actualList.size());
  }

  @Test
  public void testGetAllDocsNonFound() {
    StorageManager storageManager = injector.getInstance(StorageManager.class);
    DocumentTypeRegister documentTypeRegister = injector.getInstance(DocumentTypeRegister.class);

    List<TestConcreteDoc> expectedList = Lists.newArrayList();

    when(storageManager.getAllLimited(TestConcreteDoc.class, 0, 200)).thenReturn(expectedList);

    doReturn(TestConcreteDoc.class).when(documentTypeRegister).getClassFromTypeString(anyString());
    WebResource webResource = super.resource();

    GenericType<List<TestConcreteDoc>> genericType = new GenericType<List<TestConcreteDoc>>() {};
    List<TestConcreteDoc> actualList = webResource.path("/resources/testconcretedoc/all").get(genericType);

    assertEquals(expectedList.size(), actualList.size());
  }

  @Test
  public void testPutDocExistingDocument() {
    DocumentTypeRegister documentTypeRegister = injector.getInstance(DocumentTypeRegister.class);
    this.setUserInRole(true);
    String id = "tst0000000001";

    doReturn(TestConcreteDoc.class).when(documentTypeRegister).getClassFromTypeString(anyString());

    WebResource webResource = super.resource();
    ClientResponse clientResponse = webResource.path("/resources/testconcretedoc/" + id).type(MediaType.APPLICATION_JSON_TYPE).header("Authorization", "bearer 12333322abef").put(ClientResponse.class);

    assertEquals(ClientResponse.Status.NO_CONTENT, clientResponse.getClientResponseStatus());
  }

  @Test
  public void testPutDocNonExistingDocument() {
    DocumentTypeRegister documentTypeRegister = injector.getInstance(DocumentTypeRegister.class);
    this.setUserInRole(true);
    String id = "NonExistingID";

    doReturn(TestConcreteDoc.class).when(documentTypeRegister).getClassFromTypeString(anyString());

    WebResource webResource = super.resource();
    ClientResponse clientResponse = webResource.path("/resources/testconcretedoc/" + id).type(MediaType.APPLICATION_JSON_TYPE).header("Authorization", "bearer 12333322abef").put(ClientResponse.class);

    assertEquals(ClientResponse.Status.NOT_FOUND, clientResponse.getClientResponseStatus());
  }

  @Test
  public void testPutDocNonExistingType() {
    DocumentTypeRegister documentTypeRegister = injector.getInstance(DocumentTypeRegister.class);
    this.setUserInRole(true);
    String id = "tst0000000001";

    doReturn(null).when(documentTypeRegister).getClassFromTypeString(anyString());

    WebResource webResource = super.resource();
    ClientResponse clientResponse = webResource.path("/resources/unknownDoc/" + id).type(MediaType.APPLICATION_JSON_TYPE).header("Authorization", "bearer 12333322abef").put(ClientResponse.class);

    assertEquals(ClientResponse.Status.NOT_FOUND, clientResponse.getClientResponseStatus());
  }

  // Security tests

  @Test
  public void testGetDocNotLoggedIn() {
    StorageManager storageManager = injector.getInstance(StorageManager.class);
    DocumentTypeRegister documentTypeRegister = injector.getInstance(DocumentTypeRegister.class);
    String id = "tst0000000001";

    TestConcreteDoc expectedDoc = new TestConcreteDoc();
    expectedDoc.setId(id);

    when(storageManager.getCompleteDocument(TestConcreteDoc.class, id)).thenReturn(expectedDoc);

    doReturn(TestConcreteDoc.class).when(documentTypeRegister).getClassFromTypeString(anyString());

    WebResource webResource = super.resource();
    ClientResponse clientResponse = webResource.path("/resources/testconcretedoc/" + id).get(ClientResponse.class);

    assertEquals(ClientResponse.Status.OK, clientResponse.getClientResponseStatus());
  }

  @Test
  public void testGetDocEmptyAuthorizationKey() {
    StorageManager storageManager = injector.getInstance(StorageManager.class);
    DocumentTypeRegister documentTypeRegister = injector.getInstance(DocumentTypeRegister.class);
    String id = "tst0000000001";

    TestConcreteDoc expectedDoc = new TestConcreteDoc();
    expectedDoc.setId(id);

    when(storageManager.getCompleteDocument(TestConcreteDoc.class, id)).thenReturn(expectedDoc);

    doReturn(TestConcreteDoc.class).when(documentTypeRegister).getClassFromTypeString(anyString());

    WebResource webResource = super.resource();
    ClientResponse clientResponse = webResource.path("/resources/testconcretedoc/" + id).get(ClientResponse.class);

    assertEquals(ClientResponse.Status.OK, clientResponse.getClientResponseStatus());
  }

  @Test
  public void testPutDocUserNotLoggedIn() {
    StorageManager storageManager = injector.getInstance(StorageManager.class);
    DocumentTypeRegister documentTypeRegister = injector.getInstance(DocumentTypeRegister.class);
    String id = "tst0000000001";

    TestConcreteDoc expectedDoc = new TestConcreteDoc();
    expectedDoc.setId(id);

    when(storageManager.getCompleteDocument(TestConcreteDoc.class, id)).thenReturn(expectedDoc);

    doReturn(TestConcreteDoc.class).when(documentTypeRegister).getClassFromTypeString(anyString());

    WebResource webResource = super.resource();
    ClientResponse clientResponse = webResource.path("/resources/testconcretedoc/" + id).type(MediaType.APPLICATION_JSON_TYPE).put(ClientResponse.class);

    assertEquals(ClientResponse.Status.UNAUTHORIZED, clientResponse.getClientResponseStatus());
  }

  @Test
  public void testPutDocNotInRole() {
    this.setUserInRole(false);
    StorageManager storageManager = injector.getInstance(StorageManager.class);
    DocumentTypeRegister documentTypeRegister = injector.getInstance(DocumentTypeRegister.class);
    String id = "tst0000000001";

    TestConcreteDoc expectedDoc = new TestConcreteDoc();
    expectedDoc.setId(id);

    when(storageManager.getCompleteDocument(TestConcreteDoc.class, id)).thenReturn(expectedDoc);

    doReturn(TestConcreteDoc.class).when(documentTypeRegister).getClassFromTypeString(anyString());

    WebResource webResource = super.resource();
    ClientResponse clientResponse = webResource.path("/resources/testconcretedoc/" + id).type(MediaType.APPLICATION_JSON_TYPE).header("Authorization", "bearer 12333322abef").put(ClientResponse.class);

    assertEquals(ClientResponse.Status.FORBIDDEN, clientResponse.getClientResponseStatus());
  }

  // Variation tests

  @Test
  public void testGetDocWithVariation() {
    this.setUserInRole(true);
    StorageManager storageManager = injector.getInstance(StorageManager.class);
    DocumentTypeRegister documentTypeRegister = injector.getInstance(DocumentTypeRegister.class);
    String id = "tst0000000001";

    TestConcreteDoc expectedDoc = new TestConcreteDoc();
    expectedDoc.setId(id);

    String variation = "projecta";
    when(storageManager.getCompleteVariation(TestConcreteDoc.class, id, variation)).thenReturn(expectedDoc);

    doReturn(TestConcreteDoc.class).when(documentTypeRegister).getClassFromTypeString(anyString());

    WebResource webResource = super.resource();
    TestConcreteDoc actualDoc = webResource.path("/resources/testconcretedoc/" + id + "/" + variation).header("Authorization", "bearer 12333322abef").get(TestConcreteDoc.class);

    assertNotNull(actualDoc);
    assertEquals(expectedDoc.getId(), actualDoc.getId());
  }

  @Test
  public void testGetDocWithVariationDocDoesNotExist() {
    this.setUserInRole(true);
    StorageManager storageManager = injector.getInstance(StorageManager.class);
    DocumentTypeRegister documentTypeRegister = injector.getInstance(DocumentTypeRegister.class);
    String id = "tst0000000002";

    String variation = "projecta";
    when(storageManager.getCompleteVariation(TestConcreteDoc.class, id, variation)).thenReturn(null);

    doReturn(TestConcreteDoc.class).when(documentTypeRegister).getClassFromTypeString(anyString());

    WebResource webResource = super.resource();
    ClientResponse clientResponse = webResource.path("/resources/testconcretedoc/" + id + "/" + variation).header("Authorization", "bearer 12333322abef").get(ClientResponse.class);

    assertEquals(ClientResponse.Status.NOT_FOUND, clientResponse.getClientResponseStatus());
  }

}
