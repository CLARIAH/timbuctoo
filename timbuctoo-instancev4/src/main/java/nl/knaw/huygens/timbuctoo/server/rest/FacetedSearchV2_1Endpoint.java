package nl.knaw.huygens.timbuctoo.server.rest;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriBuilder;
import java.net.URI;
import java.util.UUID;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;

@Path("/v2.1/search")
@Produces(APPLICATION_JSON)
public class FacetedSearchV2_1Endpoint {

  private Searcher searcher;

  public FacetedSearchV2_1Endpoint(Searcher searcher) {
    this.searcher = searcher;
  }

  @POST
  @Path("wwpersons")
  public Response post(SearchRequestV2_1 searchRequest) {
    UUID uuid = UUID.randomUUID();

    URI uri = createUri(uuid);

    return Response.created(uri).build();
  }

  private URI createUri(UUID uuid) {
    return UriBuilder.fromResource(FacetedSearchV2_1Endpoint.class).path("{id}").build(uuid);
  }

  @GET
  @Path("{id}")
  public Response get(@PathParam("id") UUID id) {
    WwPersonSearchDescription description = getDescription();

    return Response.ok(SearchResponseV2_1.from(description)).build();
  }

  private WwPersonSearchDescription getDescription() {
    return new WwPersonSearchDescription();
  }

}
