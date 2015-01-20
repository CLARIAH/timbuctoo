package nl.knaw.huygens.timbuctoo.rest.resources;

import static com.google.common.net.HttpHeaders.AUTHORIZATION;
import static nl.knaw.huygens.timbuctoo.config.TypeNames.getExternalName;
import static nl.knaw.huygens.timbuctoo.rest.util.CustomHeaders.VRE_ID_KEY;
import static nl.knaw.huygens.timbuctoo.security.UserRoles.ADMIN_ROLE;
import static nl.knaw.huygens.timbuctoo.security.UserRoles.USER_ROLE;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import javax.jms.JMSException;
import javax.ws.rs.core.MediaType;

import nl.knaw.huygens.timbuctoo.config.Paths;
import nl.knaw.huygens.timbuctoo.config.TypeNames;
import nl.knaw.huygens.timbuctoo.messages.ActionType;
import nl.knaw.huygens.timbuctoo.model.DomainEntity;
import nl.knaw.huygens.timbuctoo.model.util.RelationBuilder;
import nl.knaw.huygens.timbuctoo.vre.VRE;
import test.rest.model.projecta.ProjectADomainEntity;
import test.rest.model.projecta.ProjectARelation;

import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.ClientResponse.Status;

public class DomainEntityResourceV2Test extends DomainEntityResourceTest {
  @Override
  protected String getAPIVersion() {
    return Paths.V2_PATH;
  }

  @Override
  public void testPutAsAdmin() throws Exception {
    testPut(ADMIN_ROLE);
  }

  @Override
  public void testPutAsUser() throws Exception {
    testPut(USER_ROLE);
  }

  private void testPut(String userRole) throws Exception {
    setupRolesAndVRE(userRole);

    ProjectADomainEntity entity = createEntityWithId();

    when(repository.getEntity(DEFAULT_TYPE, DEFAULT_ID)).thenReturn(entity);
    whenJsonProviderReadFromThenReturn(entity);

    ClientResponse response = createResource(DEFAULT_RESOURCE, DEFAULT_ID) //
        .type(MediaType.APPLICATION_JSON_TYPE) //
        .accept(MediaType.APPLICATION_JSON_TYPE) //
        .header(AUTHORIZATION, CREDENTIALS) //
        .header(VRE_ID_KEY, VRE_ID).put(ClientResponse.class, entity);

    verifyResponseStatus(response, Status.OK);

    ProjectADomainEntity returnedEntity = response.getEntity(DEFAULT_TYPE);
    verifyDomainEntity(DEFAULT_TYPE, returnedEntity, DEFAULT_ID);
  }

  private ProjectADomainEntity createEntityWithId() {
    ProjectADomainEntity entity = new ProjectADomainEntity(DEFAULT_ID);
    entity.setPid("65262031-c5c2-44f9-b90e-11f9fc7736cf");
    when(repository.getEntityWithRelations(DEFAULT_TYPE, DEFAULT_ID)).thenReturn(entity);

    return entity;
  }

  private void setupRolesAndVRE(String userRole) {
    setupUserWithRoles(VRE_ID, USER_ID, userRole);

    VRE vre = mock(VRE.class);
    when(vre.inScope(DEFAULT_TYPE, DEFAULT_ID)).thenReturn(true);
    makeVREAvailable(vre, VRE_ID);
  }

  @Override
  public void testPutRelation() throws Exception {
    Class<ProjectARelation> type = ProjectARelation.class;
    String id = "RELA000000000001";
    String sourceType = TypeNames.getInternalName(BASE_TYPE);
    String sourceId = "TEST000000000001";
    String targetType = TypeNames.getInternalName(BASE_TYPE);
    String targetId = "TEST000000000002";

    setupUserWithRoles(VRE_ID, USER_ID, USER_ROLE);

    VRE vre = mock(VRE.class);
    when(vre.inScope(type, id)).thenReturn(true);
    makeVREAvailable(vre, VRE_ID);

    ProjectARelation entity = RelationBuilder.newInstance(type) //
        .withId(id) //
        .withSourceType(sourceType) //
        .withSourceId(sourceId) //
        .withTargetType(targetType) //
        .withTargetId(targetId) //
        .withPid("65262031-c5c2-44f9-b90e-11f9fc7736cf") //
        .build();
    when(repository.getEntity(type, id)).thenReturn(entity);
    when(repository.getEntityWithRelations(type, id)).thenReturn(entity);
    whenJsonProviderReadFromThenReturn(entity);

    ClientResponse response = createResource(getExternalName(type), id) //
        .type(MediaType.APPLICATION_JSON_TYPE) //
        .header(AUTHORIZATION, CREDENTIALS) //
        .header(VRE_ID_KEY, VRE_ID).put(ClientResponse.class, entity);
    verifyResponseStatus(response, Status.OK);

    verifyDomainEntity(type, response.getEntity(type), id);

    // handling of the relation entity itself
    verify(getProducer(PERSISTENCE_PRODUCER), times(1)).send(ActionType.MOD, type, id);
    verify(getProducer(INDEX_PRODUCER), times(1)).send(ActionType.MOD, type, id);
    verifySourceAndTargetAreReIndexed(sourceId, targetId);
  }

  private <T extends DomainEntity> void verifyDomainEntity(Class<T> type, T entity, String expectedId) {
    assertThat(entity, is(notNullValue(type)));
    assertThat(entity.getId(), is(equalTo(expectedId)));
  }

  protected void verifySourceAndTargetAreReIndexed(String sourceId, String targetId) throws JMSException {
    // handling of source and target entities of the relation
    verify(getProducer(INDEX_PRODUCER), times(1)).send(ActionType.MOD, BASE_TYPE, sourceId);
    verify(getProducer(INDEX_PRODUCER), times(1)).send(ActionType.MOD, BASE_TYPE, targetId);
  }
}