package nl.knaw.huygens.timbuctoo.bulkupload;

import nl.knaw.huygens.timbuctoo.bulkupload.loaders.Loader;
import nl.knaw.huygens.timbuctoo.bulkupload.loaders.dataperfect.DataPerfectLoader;
import nl.knaw.huygens.timbuctoo.bulkupload.loaders.excel.allsheetloader.AllSheetLoader;
import nl.knaw.huygens.timbuctoo.bulkupload.parsingstatemachine.Importer;
import nl.knaw.huygens.timbuctoo.bulkupload.parsingstatemachine.ResultReporter;
import nl.knaw.huygens.timbuctoo.bulkupload.parsingstatemachine.StateMachine;
import nl.knaw.huygens.timbuctoo.bulkupload.savers.TinkerpopSaver;
import nl.knaw.huygens.timbuctoo.model.vre.Vre;
import nl.knaw.huygens.timbuctoo.model.vre.Vres;
import nl.knaw.huygens.timbuctoo.server.TinkerPopGraphManager;

import java.io.File;
import java.io.IOException;
import java.util.function.Consumer;

public class BulkUploadService {

  private final Vres vres;
  private final TinkerPopGraphManager graphwrapper;
  private final int maxVertices;

  public BulkUploadService(Vres vres, TinkerPopGraphManager graphwrapper, int maxVerticesPerTransaction) {
    this.vres = vres;
    this.graphwrapper = graphwrapper;
    this.maxVertices = maxVerticesPerTransaction;
  }

  public void saveToDb(String vreName, File file, String fileName, String vreLabel,
                       Consumer<String> statusUpdate)
    throws InvalidFileException, IOException {

    try (TinkerpopSaver saver = new TinkerpopSaver(vres, graphwrapper, vreName, vreLabel, maxVertices, fileName)) {
      Loader loader;
      if (fileName.endsWith(".xlsx")) {
        loader = new AllSheetLoader();
      } else {
        loader = new DataPerfectLoader();
      }
      try {
        loader.loadData(file, new Importer(new StateMachine(saver), new ResultReporter(statusUpdate)));
        saver.setUploadFinished(vreName, Vre.PublishState.MAPPING_CREATION);
      } catch (IOException | InvalidFileException e) {
        saver.setUploadFinished(vreName, Vre.PublishState.UPLOAD_FAILED);
        throw e;
      }
    }
  }

}
