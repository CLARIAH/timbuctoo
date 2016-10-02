package nl.knaw.huygens.timbuctoo.server.endpoints.v2.remote.rs;


import com.codahale.metrics.annotation.Timed;
import nl.knaw.huygens.timbuctoo.remote.rs.ResourceSyncService;
import nl.knaw.huygens.timbuctoo.remote.rs.view.FrameworkBase;
import nl.knaw.huygens.timbuctoo.remote.rs.view.Interpreter;
import nl.knaw.huygens.timbuctoo.remote.rs.view.Interpreters;
import nl.knaw.huygens.timbuctoo.remote.rs.view.SetListBase;
import nl.knaw.huygens.timbuctoo.remote.rs.view.TreeBase;
import org.apache.commons.lang.exception.ExceptionUtils;

import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.net.URISyntaxException;

@Path("/v2.1/remote/rs/discover")
@Produces(MediaType.APPLICATION_JSON)
public class Discover {

  private final ResourceSyncService resourceSyncService;

  public Discover(ResourceSyncService resourceSyncService) {
    this.resourceSyncService = resourceSyncService;
  }

  @GET
  @Path("/listsets/{url}")
  @Timed
  public Response listSets(@PathParam("url") String url,
                           @QueryParam("debug") @DefaultValue("false") boolean debug) {
    try {
      SetListBase setListBase = resourceSyncService.listSets(url,
        new Interpreter()
          .withStackTrace(debug));
      return Response.ok(setListBase).build();
    } catch (URISyntaxException e) {
      throw new WebApplicationException(ExceptionUtils.getStackTrace(e), Response.Status.BAD_REQUEST);
    } catch (InterruptedException e) {
      throw new WebApplicationException(ExceptionUtils.getStackTrace(e), Response.Status.INTERNAL_SERVER_ERROR);
    }
  }

  @GET
  @Path("/listgraphs/{url}")
  @Timed
  public Response listGraphs(@PathParam("url") String url,
                             @QueryParam("debug") @DefaultValue("false") boolean debug) {
    try {
      SetListBase graphList = resourceSyncService.listSets(url,
        new Interpreter()
          .withItemNameInterpreter(Interpreters.base64EncodedItemNameInterpreter)
          .withStackTrace(debug));
      return Response.ok(graphList).build();
    } catch (URISyntaxException e) {
      throw new WebApplicationException(ExceptionUtils.getStackTrace(e), Response.Status.BAD_REQUEST);
    } catch (InterruptedException e) {
      throw new WebApplicationException(ExceptionUtils.getStackTrace(e), Response.Status.INTERNAL_SERVER_ERROR);
    }
  }

  @GET
  @Path("/framework/{url}")
  @Timed
  public Response getFramework(@PathParam("url") String url,
                           @QueryParam("debug") @DefaultValue("false") boolean debug) {
    try {
      FrameworkBase frameworkBase = resourceSyncService.getFramework(url,
        new Interpreter()
          .withStackTrace(debug));
      return Response.ok(frameworkBase).build();
    } catch (URISyntaxException e) {
      throw new WebApplicationException(ExceptionUtils.getStackTrace(e), Response.Status.BAD_REQUEST);
    } catch (InterruptedException e) {
      throw new WebApplicationException(ExceptionUtils.getStackTrace(e), Response.Status.INTERNAL_SERVER_ERROR);
    }
  }

  @GET
  @Path("/tree/{url}")
  @Timed
  public Response getTree(@PathParam("url") String url,
                               @QueryParam("debug") @DefaultValue("false") boolean debug) {
    try {
      TreeBase treeBase = resourceSyncService.getTree(url,
        new Interpreter()
          .withStackTrace(debug));
      return Response.ok(treeBase).build();
    } catch (URISyntaxException e) {
      throw new WebApplicationException(ExceptionUtils.getStackTrace(e), Response.Status.BAD_REQUEST);
    } catch (InterruptedException e) {
      throw new WebApplicationException(ExceptionUtils.getStackTrace(e), Response.Status.INTERNAL_SERVER_ERROR);
    }
  }

}


