package nl.knaw.huygens.repository.resources;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.List;

import javax.ws.rs.core.MediaType;

import nl.knaw.huygens.repository.managers.StorageManager;
import nl.knaw.huygens.repository.model.User;

import org.junit.Test;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;

import com.google.common.collect.Lists;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.GenericType;
import com.sun.jersey.api.client.WebResource;

public class UserResourceTest extends WebServiceTestSetup {
  private static final String USER_ID = "USR000000001";
  private static final String ADMIN_ROLE = "ADMIN";

  @Test
  public void testGetAllUsers() {
    setUpUserRoles(Lists.newArrayList(ADMIN_ROLE));
    WebResource webResource = super.resource();

    List<User> expectedList = Lists.<User> newArrayList(createUser("test", "test"), createUser("test1", "test1"), createUser("test", "test"));
    StorageManager storageManager = injector.getInstance(StorageManager.class);
    when(storageManager.getAllLimited(User.class, 0, 200)).thenReturn(expectedList);

    GenericType<List<User>> genericType = new GenericType<List<User>>() {};
    List<User> actualList = webResource.path("/resources/user/all").header("Authorization", "bearer 12333322abef").get(genericType);

    assertEquals(expectedList.size(), actualList.size());
  }

  @Test
  public void testGetAllUsersNonFound() {
    setUpUserRoles(Lists.newArrayList(ADMIN_ROLE));
    WebResource webResource = super.resource();

    List<User> expectedList = Lists.<User> newArrayList();
    StorageManager storageManager = injector.getInstance(StorageManager.class);
    when(storageManager.getAllLimited(User.class, 0, 200)).thenReturn(expectedList);

    GenericType<List<User>> genericType = new GenericType<List<User>>() {};
    List<User> actualList = webResource.path("/resources/user/all").header("Authorization", "bearer 12333322abef").get(genericType);

    assertEquals(expectedList.size(), actualList.size());
  }

  @Test
  public void testGetAllUsersNotInRole() {
    setUpUserRoles(null);
    WebResource webResource = super.resource();

    ClientResponse clientResponse = webResource.path("/resources/user/all").header("Authorization", "bearer 12333322abef").get(ClientResponse.class);

    assertEquals(ClientResponse.Status.FORBIDDEN, clientResponse.getClientResponseStatus());
  }

  @Test
  public void testGetAllUsersNotLoggedIn() {
    WebResource webResource = super.resource();

    ClientResponse clientResponse = webResource.path("/resources/user/all").get(ClientResponse.class);

    assertEquals(ClientResponse.Status.UNAUTHORIZED, clientResponse.getClientResponseStatus());
  }

  @Test
  public void testGetUser() {
    setUpUserRoles(Lists.newArrayList(ADMIN_ROLE));
    WebResource webResource = super.resource();

    User expected = createUser("test", "test");
    expected.setId(USER_ID);
    StorageManager storageManager = injector.getInstance(StorageManager.class);
    when(storageManager.getDocument(User.class, USER_ID)).thenReturn(expected);

    User actual = webResource.path("/resources/user").path(USER_ID).header("Authorization", "bearer 12333322abef").get(User.class);

    assertEquals(expected.getId(), actual.getId());
    assertEquals(expected.firstName, actual.firstName);
    assertEquals(expected.lastName, actual.lastName);
  }

  @Test
  public void testGetUserNotFound() {
    setUpUserRoles(Lists.newArrayList(ADMIN_ROLE));
    WebResource webResource = super.resource();

    StorageManager storageManager = injector.getInstance(StorageManager.class);
    when(storageManager.getDocument(User.class, USER_ID)).thenReturn(null);

    ClientResponse clientResponse = webResource.path("/resources/user").path(USER_ID).header("Authorization", "bearer 12333322abef").get(ClientResponse.class);

    assertEquals(ClientResponse.Status.NOT_FOUND, clientResponse.getClientResponseStatus());
  }

  @Test
  public void testGetUserNotInRole() {
    setUpUserRoles(null);
    WebResource webResource = super.resource();

    ClientResponse clientResponse = webResource.path("/resources/user").path(USER_ID).header("Authorization", "bearer 12333322abef").get(ClientResponse.class);

    assertEquals(ClientResponse.Status.FORBIDDEN, clientResponse.getClientResponseStatus());

  }

  @Test
  public void testGetUserNotLoggedIn() {
    WebResource webResource = super.resource();

    ClientResponse clientResponse = webResource.path("/resources/user").path(USER_ID).get(ClientResponse.class);

    assertEquals(ClientResponse.Status.UNAUTHORIZED, clientResponse.getClientResponseStatus());

  }

  @Test
  public void testPutUser() {
    setUpUserRoles(Lists.newArrayList(ADMIN_ROLE));

    User user = createUser("firstName", "lastName");
    user.setId(USER_ID);

    User original = createUser("test", "test");
    original.setId(USER_ID);

    StorageManager storageManager = injector.getInstance(StorageManager.class);
    when(storageManager.getDocument(User.class, USER_ID)).thenReturn(original);

    WebResource webResource = super.resource();

    ClientResponse clientResponse = webResource.path("/resources/user").path(USER_ID).type(MediaType.APPLICATION_JSON_TYPE).header("Authorization", "bearer 12333322abef")
        .put(ClientResponse.class, user);

    assertEquals(ClientResponse.Status.NO_CONTENT, clientResponse.getClientResponseStatus());

  }

  @Test
  public void testPutUserUserNotFound() throws IOException {
    setUpUserRoles(Lists.newArrayList(ADMIN_ROLE));

    User user = createUser("firstName", "lastName");
    user.setId(USER_ID);

    StorageManager storageManager = injector.getInstance(StorageManager.class);
    doAnswer(new Answer<Object>() {

      @Override
      public Object answer(InvocationOnMock invocation) throws IOException {
        // only if the document version does not exist an IOException is thrown.
        throw new IOException();
      }
    }).when(storageManager).modifyDocument(any(Class.class), any(User.class));

    WebResource webResource = super.resource();

    ClientResponse clientResponse = webResource.path("/resources/user").path(USER_ID).type(MediaType.APPLICATION_JSON_TYPE).header("Authorization", "bearer 12333322abef")
        .put(ClientResponse.class, user);

    assertEquals(ClientResponse.Status.NOT_FOUND, clientResponse.getClientResponseStatus());
  }

  @Test
  public void testPutUserNotInRole() {
    setUpUserRoles(null);

    User user = createUser("firstName", "lastName");
    user.setId(USER_ID);

    StorageManager storageManager = injector.getInstance(StorageManager.class);
    when(storageManager.getDocument(User.class, USER_ID)).thenReturn(null);

    WebResource webResource = super.resource();

    ClientResponse clientResponse = webResource.path("/resources/user").path(USER_ID).type(MediaType.APPLICATION_JSON_TYPE).header("Authorization", "bearer 12333322abef")
        .put(ClientResponse.class, user);

    assertEquals(ClientResponse.Status.FORBIDDEN, clientResponse.getClientResponseStatus());
  }

  @Test
  public void testPutUserNotLoggedIn() {
    User user = createUser("firstName", "lastName");
    user.setId(USER_ID);

    StorageManager storageManager = injector.getInstance(StorageManager.class);
    when(storageManager.getDocument(User.class, USER_ID)).thenReturn(null);

    WebResource webResource = super.resource();

    ClientResponse clientResponse = webResource.path("/resources/user").path(USER_ID).type(MediaType.APPLICATION_JSON_TYPE).put(ClientResponse.class, user);

    assertEquals(ClientResponse.Status.UNAUTHORIZED, clientResponse.getClientResponseStatus());
  }

  @Test
  public void testPostUser() {
    setUpUserRoles(Lists.newArrayList(ADMIN_ROLE));
    User user = createUser("firstName", "lastName");

    WebResource webResource = super.resource();

    ClientResponse clientResponse = webResource.path("/resources/user/all").type(MediaType.APPLICATION_JSON_TYPE).header("Authorization", "bearer 12333322abef").post(ClientResponse.class, user);

    assertEquals(ClientResponse.Status.CREATED, clientResponse.getClientResponseStatus());

    assertNotNull(clientResponse.getHeaders().getFirst("Location"));

  }

  @Test
  public void testPostUserNotInRole() {
    setUpUserRoles(null);
    User user = createUser("firstName", "lastName");

    WebResource webResource = super.resource();

    ClientResponse clientResponse = webResource.path("/resources/user/all").type(MediaType.APPLICATION_JSON_TYPE).header("Authorization", "bearer 12333322abef").post(ClientResponse.class, user);

    assertEquals(ClientResponse.Status.FORBIDDEN, clientResponse.getClientResponseStatus());

  }

  @Test
  public void testPostUserNotLoggedIn() {
    User user = createUser("firstName", "lastName");

    WebResource webResource = super.resource();

    ClientResponse clientResponse = webResource.path("/resources/user/all").type(MediaType.APPLICATION_JSON_TYPE).post(ClientResponse.class, user);

    assertEquals(ClientResponse.Status.UNAUTHORIZED, clientResponse.getClientResponseStatus());
  }

  @Test
  public void testDeleteUser() {
    setUpUserRoles(Lists.newArrayList(ADMIN_ROLE));
    WebResource webResource = super.resource();

    User expected = createUser("test", "test");
    expected.setId(USER_ID);
    StorageManager storageManager = injector.getInstance(StorageManager.class);
    when(storageManager.getDocument(User.class, USER_ID)).thenReturn(expected);

    ClientResponse clientResponse = webResource.path("/resources/user").path(USER_ID).header("Authorization", "bearer 12333322abef").delete(ClientResponse.class);

    assertEquals(ClientResponse.Status.OK, clientResponse.getClientResponseStatus());
  }

  @Test
  public void testDeleteUserUserNotFound() {
    setUpUserRoles(Lists.newArrayList(ADMIN_ROLE));
    WebResource webResource = super.resource();

    StorageManager storageManager = injector.getInstance(StorageManager.class);
    when(storageManager.getDocument(User.class, USER_ID)).thenReturn(null);

    ClientResponse clientResponse = webResource.path("/resources/user").path(USER_ID).header("Authorization", "bearer 12333322abef").delete(ClientResponse.class);

    assertEquals(ClientResponse.Status.NOT_FOUND, clientResponse.getClientResponseStatus());
  }

  @Test
  public void testDeleteUserNotInRole() {
    setUpUserRoles(null);
    WebResource webResource = super.resource();

    User expected = createUser("test", "test");
    expected.setId(USER_ID);
    StorageManager storageManager = injector.getInstance(StorageManager.class);
    when(storageManager.getDocument(User.class, USER_ID)).thenReturn(expected);

    ClientResponse clientResponse = webResource.path("/resources/user").path(USER_ID).header("Authorization", "bearer 12333322abef").delete(ClientResponse.class);

    assertEquals(ClientResponse.Status.FORBIDDEN, clientResponse.getClientResponseStatus());
  }

  @Test
  public void testDeleteUserNotLoggedIn() {
    WebResource webResource = super.resource();

    User expected = createUser("test", "test");
    expected.setId(USER_ID);
    StorageManager storageManager = injector.getInstance(StorageManager.class);
    when(storageManager.getDocument(User.class, USER_ID)).thenReturn(expected);

    ClientResponse clientResponse = webResource.path("/resources/user").path(USER_ID).delete(ClientResponse.class);

    assertEquals(ClientResponse.Status.UNAUTHORIZED, clientResponse.getClientResponseStatus());
  }

  protected User createUser(String firstName, String lastName) {
    User user = new User();
    user.firstName = firstName;
    user.lastName = lastName;

    return user;
  }

}
