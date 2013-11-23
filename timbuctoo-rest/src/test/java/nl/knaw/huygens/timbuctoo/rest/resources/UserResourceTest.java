package nl.knaw.huygens.timbuctoo.rest.resources;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.ws.rs.core.MediaType;

import nl.knaw.huygens.timbuctoo.config.Paths;
import nl.knaw.huygens.timbuctoo.mail.MailSender;
import nl.knaw.huygens.timbuctoo.model.User;
import nl.knaw.huygens.timbuctoo.storage.StorageManager;

import org.apache.commons.collections.map.HashedMap;
import org.junit.Before;
import org.junit.Test;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;

import com.google.common.collect.Lists;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.GenericType;
import com.sun.jersey.api.client.WebResource;

public class UserResourceTest extends WebServiceTestSetup {

  private static final String USERS_RESOURCE = "/" + Paths.SYSTEM_PREFIX + "/users";
  private static final String OTHER_USER_ID = "otherUserId";
  private static final String USER_ROLE = "USER";
  private static final String ADMIN_ROLE = "ADMIN";

  private WebResource resource;

  @Before
  public void setupWebResource() {
    resource = resource().path(USERS_RESOURCE);
  }

  @Test
  public void testGetAllUsers() {
    setupUser(USER_ID, ADMIN_ROLE);

    List<User> expectedList = Lists.newArrayList(createUser("test", "test"), createUser("test1", "test1"), createUser("test", "test"));
    StorageManager storageManager = injector.getInstance(StorageManager.class);
    when(storageManager.getAllLimited(User.class, 0, 200)).thenReturn(expectedList);

    GenericType<List<User>> genericType = new GenericType<List<User>>() {};
    List<User> actualList = resource.header("Authorization", "bearer 12333322abef").get(genericType);
    assertEquals(expectedList.size(), actualList.size());
  }

  @Test
  public void testGetAllUsersNonFound() {
    setupUser(USER_ID, ADMIN_ROLE);

    List<User> expectedList = Lists.newArrayList();
    StorageManager storageManager = injector.getInstance(StorageManager.class);
    when(storageManager.getAllLimited(User.class, 0, 200)).thenReturn(expectedList);

    GenericType<List<User>> genericType = new GenericType<List<User>>() {};
    List<User> actualList = resource.header("Authorization", "bearer 12333322abef").get(genericType);
    assertEquals(expectedList.size(), actualList.size());
  }

  @Test
  public void testGetAllUsersNotInRole() {
    setupUser(USER_ID, null);

    ClientResponse response = resource.header("Authorization", "bearer 12333322abef").get(ClientResponse.class);
    assertEquals(ClientResponse.Status.FORBIDDEN, response.getClientResponseStatus());
  }

  @Test
  public void testGetAllUsersNotLoggedIn() {
    setUserNotLoggedIn();

    ClientResponse response = resource.get(ClientResponse.class);
    assertEquals(ClientResponse.Status.UNAUTHORIZED, response.getClientResponseStatus());
  }

  @Test
  public void testGetUserAsAdmin() {
    setupUser(OTHER_USER_ID, ADMIN_ROLE);

    User expected = createUser(USER_ID, "test", "test");
    StorageManager storageManager = injector.getInstance(StorageManager.class);
    when(storageManager.getEntity(User.class, USER_ID)).thenReturn(expected);

    User actual = resource.path(USER_ID).header("Authorization", "bearer 12333322abef").get(User.class);
    assertEquals(expected.getId(), actual.getId());
    assertEquals(expected.firstName, actual.firstName);
    assertEquals(expected.lastName, actual.lastName);
  }

  @Test
  public void testGetUserNotFound() {
    setupUser(USER_ID, ADMIN_ROLE);

    StorageManager storageManager = injector.getInstance(StorageManager.class);
    when(storageManager.getEntity(User.class, USER_ID)).thenReturn(null);

    ClientResponse response = resource.path(USER_ID).header("Authorization", "bearer 12333322abef").get(ClientResponse.class);
    assertEquals(ClientResponse.Status.NOT_FOUND, response.getClientResponseStatus());
  }

  @Test
  public void testGetMyUserDataAsAdmin() {
    setupUser(USER_ID, ADMIN_ROLE);

    User expected = createUser(USER_ID, "test", "test");
    StorageManager storageManager = injector.getInstance(StorageManager.class);
    when(storageManager.getEntity(User.class, USER_ID)).thenReturn(expected);

    User actual = resource.path("me").header("Authorization", "bearer 12333322abef").get(User.class);
    assertEquals(expected.getId(), actual.getId());
    assertEquals(expected.firstName, actual.firstName);
    assertEquals(expected.lastName, actual.lastName);
  }

  @Test
  public void testGetMyUserDataAsUser() {
    setupUser(USER_ID, USER_ROLE);

    User expected = createUser(USER_ID, "test", "test");
    StorageManager storageManager = injector.getInstance(StorageManager.class);
    when(storageManager.getEntity(User.class, USER_ID)).thenReturn(expected);

    User actual = resource.path("me").header("Authorization", "bearer 12333322abef").get(User.class);
    assertEquals(expected.getId(), actual.getId());
    assertEquals(expected.firstName, actual.firstName);
    assertEquals(expected.lastName, actual.lastName);
  }

  @SuppressWarnings("unchecked")
  @Test
  public void testGetMyUserDataAsUnverifiedUser() throws IOException {
    setupUser(USER_ID, "UNVERIFIED_USER");

    MailSender mailSender = injector.getInstance(MailSender.class);

    User expected = createUser(USER_ID, "test", "test");
    StorageManager storageManager = injector.getInstance(StorageManager.class);
    when(storageManager.getEntity(User.class, USER_ID)).thenReturn(expected);

    final User admin = createUser("admin", "admin");
    admin.email = "admin@admin.com";

    final Map<String, User> createdUsers = new HashedMap();

    doAnswer(new Answer<Object>() {
      @Override
      public Object answer(InvocationOnMock invocation) throws Throwable {
        User user = (User) invocation.getArguments()[1];
        user.setId(USER_ID);
        createdUsers.put(USER_ID, user);
        return null;
      }
    }).when(storageManager).addEntity(any(Class.class), any(User.class));

    doAnswer(new Answer<User>() {
      @Override
      public User answer(InvocationOnMock invocation) throws Throwable {

        User user = (User) invocation.getArguments()[1];
        if (user.getRoles() != null && user.getRoles().contains("ADMIN")) {
          return admin;
        }

        return createdUsers.get(USER_ID);
      }
    }).when(storageManager).findEntity(any(Class.class), any(User.class));

    User actual = resource.path("me").header("Authorization", "bearer 12333322abef").get(User.class);

    assertEquals(expected.getId(), actual.getId());
    assertEquals(expected.firstName, actual.firstName);
    assertEquals(expected.lastName, actual.lastName);

    verify(mailSender).sendMail(anyString(), anyString(), anyString());
  }

  @Test
  public void testGetUserAsUser() {
    setupUser(OTHER_USER_ID, USER_ROLE);

    ClientResponse response = resource.path(USER_ID).header("Authorization", "bearer 12333322abef").get(ClientResponse.class);
    assertEquals(ClientResponse.Status.FORBIDDEN, response.getClientResponseStatus());
  }

  @Test
  public void testGetUserNotLoggedIn() {
    setUserNotLoggedIn();

    ClientResponse response = resource.path(USER_ID).get(ClientResponse.class);
    assertEquals(ClientResponse.Status.UNAUTHORIZED, response.getClientResponseStatus());
  }

  @Test
  public void testPutUser() {
    setupUser(USER_ID, ADMIN_ROLE);
    MailSender sender = injector.getInstance(MailSender.class);

    User user = createUser(USER_ID, "firstName", "lastName");
    user.email = "test@test.com";

    User original = createUser(USER_ID, "test", "test");
    original.email = "test@test.com";

    StorageManager storageManager = injector.getInstance(StorageManager.class);
    when(storageManager.getEntity(User.class, USER_ID)).thenReturn(original);

    ClientResponse response = resource.path(USER_ID).type(MediaType.APPLICATION_JSON_TYPE).header("Authorization", "bearer 12333322abef").put(ClientResponse.class, user);
    assertEquals(ClientResponse.Status.NO_CONTENT, response.getClientResponseStatus());
    verify(sender).sendMail(anyString(), anyString(), anyString());
  }

  @SuppressWarnings("unchecked")
  @Test
  public void testPutUserUserNotFound() throws IOException {
    setupUser(USER_ID, ADMIN_ROLE);

    User user = createUser(USER_ID, "firstName", "lastName");
    StorageManager storageManager = injector.getInstance(StorageManager.class);
    doAnswer(new Answer<Object>() {

      @Override
      public Object answer(InvocationOnMock invocation) throws IOException {
        // only if the document version does not exist an IOException is thrown.
        throw new IOException();
      }
    }).when(storageManager).modifyEntity(any(Class.class), any(User.class));

    ClientResponse response = resource.path(USER_ID).type(MediaType.APPLICATION_JSON_TYPE).header("Authorization", "bearer 12333322abef").put(ClientResponse.class, user);
    assertEquals(ClientResponse.Status.NOT_FOUND, response.getClientResponseStatus());
  }

  @Test
  public void testPutUserNotInRole() {
    setupUser(USER_ID, null);

    User user = createUser(USER_ID, "firstName", "lastName");
    StorageManager storageManager = injector.getInstance(StorageManager.class);
    when(storageManager.getEntity(User.class, USER_ID)).thenReturn(null);

    ClientResponse response = resource.path(USER_ID).type(MediaType.APPLICATION_JSON_TYPE).header("Authorization", "bearer 12333322abef").put(ClientResponse.class, user);
    assertEquals(ClientResponse.Status.FORBIDDEN, response.getClientResponseStatus());
  }

  @Test
  public void testPutUserNotLoggedIn() {
    User user = createUser(USER_ID, "firstName", "lastName");
    StorageManager storageManager = injector.getInstance(StorageManager.class);
    when(storageManager.getEntity(User.class, USER_ID)).thenReturn(null);

    setUserNotLoggedIn();

    ClientResponse response = resource.path(USER_ID).type(MediaType.APPLICATION_JSON_TYPE).put(ClientResponse.class, user);
    assertEquals(ClientResponse.Status.UNAUTHORIZED, response.getClientResponseStatus());
  }

  @Test
  public void testDeleteUser() {
    setupUser(USER_ID, ADMIN_ROLE);

    User expected = createUser(USER_ID, "test", "test");
    StorageManager storageManager = injector.getInstance(StorageManager.class);
    when(storageManager.getEntity(User.class, USER_ID)).thenReturn(expected);

    ClientResponse response = resource.path(USER_ID).header("Authorization", "bearer 12333322abef").delete(ClientResponse.class);
    assertEquals(ClientResponse.Status.NO_CONTENT, response.getClientResponseStatus());
  }

  @Test
  public void testDeleteUserUserNotFound() {
    setupUser(USER_ID, ADMIN_ROLE);

    StorageManager storageManager = injector.getInstance(StorageManager.class);
    when(storageManager.getEntity(User.class, USER_ID)).thenReturn(null);

    ClientResponse response = resource.path(USER_ID).header("Authorization", "bearer 12333322abef").delete(ClientResponse.class);
    assertEquals(ClientResponse.Status.NOT_FOUND, response.getClientResponseStatus());
  }

  @Test
  public void testDeleteUserNotInRole() {
    setupUser(USER_ID, null);

    User expected = createUser(USER_ID, "test", "test");
    StorageManager storageManager = injector.getInstance(StorageManager.class);
    when(storageManager.getEntity(User.class, USER_ID)).thenReturn(expected);

    ClientResponse response = resource.path(USER_ID).header("Authorization", "bearer 12333322abef").delete(ClientResponse.class);
    assertEquals(ClientResponse.Status.FORBIDDEN, response.getClientResponseStatus());
  }

  @Test
  public void testDeleteUserNotLoggedIn() {
    User expected = createUser(USER_ID, "test", "test");
    StorageManager storageManager = injector.getInstance(StorageManager.class);
    when(storageManager.getEntity(User.class, USER_ID)).thenReturn(expected);
    setUserNotLoggedIn();

    ClientResponse response = resource.path(USER_ID).delete(ClientResponse.class);
    assertEquals(ClientResponse.Status.UNAUTHORIZED, response.getClientResponseStatus());
  }

  private User createUser(String firstName, String lastName) {
    User user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    return user;
  }

  private User createUser(String id, String firstName, String lastName) {
    User user = new User();
    user.setId(id);
    user.firstName = firstName;
    user.lastName = lastName;
    return user;
  }

}
