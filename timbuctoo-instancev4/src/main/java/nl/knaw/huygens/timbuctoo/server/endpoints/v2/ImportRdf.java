package nl.knaw.huygens.timbuctoo.server.endpoints.v2;

import nl.knaw.huygens.timbuctoo.model.vre.Vres;
import nl.knaw.huygens.timbuctoo.rdf.RdfImporter;
import nl.knaw.huygens.timbuctoo.server.GraphWrapper;
import org.apache.jena.riot.Lang;
import org.glassfish.jersey.media.multipart.FormDataParam;

import javax.ws.rs.Consumes;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ExecutorService;

@Path("/v2.1/rdf/import")
public class ImportRdf {

  private final GraphWrapper graphWrapper;
  private Vres vres;
  private ExecutorService rfdExecutorService;

  public ImportRdf(GraphWrapper graphWrapper, Vres vres, ExecutorService rfdExecutorService) {
    this.graphWrapper = graphWrapper;
    this.vres = vres;
    this.rfdExecutorService = rfdExecutorService;
  }

  @Consumes("application/n-quads")
  @POST
  public void post(String rdfString, @HeaderParam("VRE_ID") String vreName) {
    final RdfImporter rdfImporter = new RdfImporter(graphWrapper, vreName, vres);
    final ByteArrayInputStream rdfInputStream = new ByteArrayInputStream(rdfString.getBytes(StandardCharsets.UTF_8));
    final ImportRunner importRunner = new ImportRunner(rdfImporter, rdfInputStream);

    rfdExecutorService.submit(importRunner);
  }

  @Consumes(MediaType.MULTIPART_FORM_DATA)
  @POST
  public void upload(@FormDataParam("file") final InputStream rdfInputStream,
                     @FormDataParam("VRE_ID") String vreNameInput) {

    final String vreName = vreNameInput != null && vreNameInput.length() > 0 ? vreNameInput : "RdfImport";
    final RdfImporter rdfImporter = new RdfImporter(graphWrapper, vreName, vres);
    rdfImporter.importRdf(rdfInputStream, Lang.NQUADS);
  }

  private static final class ImportRunner implements Runnable {

    private RdfImporter rdfImporter;
    private InputStream rdfStream;

    public ImportRunner(RdfImporter rdfImporter, InputStream rdfStream) {

      this.rdfImporter = rdfImporter;
      this.rdfStream = rdfStream;
    }

    @Override
    public void run() {
      rdfImporter.importRdf(rdfStream, Lang.NQUADS);
    }
  }
}
