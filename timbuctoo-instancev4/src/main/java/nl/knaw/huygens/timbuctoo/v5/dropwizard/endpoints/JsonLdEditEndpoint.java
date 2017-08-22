package nl.knaw.huygens.timbuctoo.v5.dropwizard.endpoints;

import com.github.jsonldjava.core.DocumentLoader;
import com.github.jsonldjava.core.JsonLdError;
import com.google.common.base.Charsets;
import com.google.common.io.Resources;
import nl.knaw.huygens.timbuctoo.security.Authorizer;
import nl.knaw.huygens.timbuctoo.security.LoggedInUsers;
import nl.knaw.huygens.timbuctoo.security.dto.User;
import nl.knaw.huygens.timbuctoo.v5.dataset.DataSetRepository;
import nl.knaw.huygens.timbuctoo.v5.dataset.ImportManager;
import nl.knaw.huygens.timbuctoo.v5.dataset.QuadStore;
import nl.knaw.huygens.timbuctoo.v5.dataset.dto.DataSet;
import nl.knaw.huygens.timbuctoo.v5.filestorage.exceptions.LogStorageFailedException;
import nl.knaw.huygens.timbuctoo.v5.jsonldimport.ConcurrentUpdateException;
import nl.knaw.huygens.timbuctoo.v5.util.TimbuctooRdfIdHelper;
import org.apache.http.impl.client.CloseableHttpClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.HeaderParam;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.time.Clock;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

import static nl.knaw.huygens.timbuctoo.v5.dropwizard.endpoints.auth.AuthCheck.checkWriteAccess;
import static nl.knaw.huygens.timbuctoo.v5.jsonldimport.JsonProvenanceToRdfPatch.fromCurrentState;
import static nl.knaw.huygens.timbuctoo.v5.util.RdfConstants.TIM_JSONLD_UPLOAD_CONTEXT;
import static nl.knaw.huygens.timbuctoo.v5.util.RdfConstants.TIM_USERS;

@Path("/v5/{user}/{dataset}/upload/jsonld")
public class JsonLdEditEndpoint {

  private static final Logger LOG = LoggerFactory.getLogger(JsonLdEditEndpoint.class);

  private final DataSetRepository dataSetRepository;
  private final TimbuctooRdfIdHelper rdfIdHelper;
  private final LoggedInUsers loggedInUsers;
  private final Authorizer authorizer;
  private DocumentLoader documentLoader;

  public JsonLdEditEndpoint(LoggedInUsers loggedInUsers, Authorizer authorizer, DataSetRepository dataSetRepository,
                            TimbuctooRdfIdHelper rdfIdHelper, CloseableHttpClient httpClient
  ) throws JsonLdError, IOException {
    this.dataSetRepository = dataSetRepository;
    this.authorizer = authorizer;
    this.loggedInUsers = loggedInUsers;
    this.rdfIdHelper = rdfIdHelper;
    documentLoader = new DocumentLoader();
    documentLoader.setHttpClient(httpClient);
    final String prefilledContext =
      Resources.toString(JsonLdEditEndpoint.class.getResource("/static/v5/jsonLdUploadContext.json"), Charsets.UTF_8);
    documentLoader.addInjectedDoc(
      TIM_JSONLD_UPLOAD_CONTEXT,
      prefilledContext
    );
  }

  @PUT
  public Response submitChanges(String jsonLdImport,
                                @PathParam("user") String userId,
                                @PathParam("dataset") String dataSetId,
                                @HeaderParam("authorization") String authHeader) throws LogStorageFailedException {

    Optional<DataSet> dataSetOpt = dataSetRepository.getDataSet(userId, dataSetId);
    if (!dataSetOpt.isPresent()) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    final DataSet dataSet = dataSetOpt.get();
    final QuadStore quadStore = dataSet.getQuadStore();
    final ImportManager importManager = dataSet.getImportManager();
    Optional<User> user = loggedInUsers.userFor(authHeader);

    final Response response = checkWriteAccess(dataSet, user, authorizer);
    if (response != null) {
      return response;
    }

    try {
      importManager.generateLog(
        rdfIdHelper.dataSet(userId, dataSetId),
        rdfIdHelper.dataSet(userId, dataSetId),
        fromCurrentState(
          documentLoader,
          jsonLdImport,
          quadStore,
          TIM_USERS + user.get().getPersistentId(),
          UUID.randomUUID().toString(),
          Clock.systemUTC()
        )
      ).get();
    } catch (IOException e) {
      return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
    } catch (ConcurrentUpdateException e) {
      return Response.status(Response.Status.CONFLICT).entity(e.getMessage()).build();
    } catch (InterruptedException | ExecutionException e) {
      LOG.error("interrupted", e);
    }

    return Response.noContent().build();
  }

}

