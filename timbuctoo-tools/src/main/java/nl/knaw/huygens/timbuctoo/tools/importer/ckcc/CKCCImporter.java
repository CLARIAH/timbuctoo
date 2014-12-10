package nl.knaw.huygens.timbuctoo.tools.importer.ckcc;

/*
 * #%L
 * Timbuctoo tools
 * =======
 * Copyright (C) 2012 - 2014 Huygens ING
 * =======
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the 
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public 
 * License along with this program.  If not, see
 * <http://www.gnu.org/licenses/gpl-3.0.html>.
 * #L%
 */

import java.io.File;
import java.io.PrintWriter;
import java.util.Collection;
import java.util.Set;

import nl.knaw.huygens.tei.DelegatingVisitor;
import nl.knaw.huygens.tei.Document;
import nl.knaw.huygens.tei.Element;
import nl.knaw.huygens.tei.ElementHandler;
import nl.knaw.huygens.tei.Traversal;
import nl.knaw.huygens.tei.Visitor;
import nl.knaw.huygens.tei.XmlContext;
import nl.knaw.huygens.tei.handlers.DefaultElementHandler;
import nl.knaw.huygens.timbuctoo.Repository;
import nl.knaw.huygens.timbuctoo.config.TypeNames;
import nl.knaw.huygens.timbuctoo.index.IndexManager;
import nl.knaw.huygens.timbuctoo.model.Collective;
import nl.knaw.huygens.timbuctoo.model.Location;
import nl.knaw.huygens.timbuctoo.model.Person;
import nl.knaw.huygens.timbuctoo.model.Reference;
import nl.knaw.huygens.timbuctoo.model.RelationType;
import nl.knaw.huygens.timbuctoo.model.ckcc.CKCCCollective;
import nl.knaw.huygens.timbuctoo.model.ckcc.CKCCDocument;
import nl.knaw.huygens.timbuctoo.model.ckcc.CKCCPerson;
import nl.knaw.huygens.timbuctoo.model.ckcc.CKCCRelation;
import nl.knaw.huygens.timbuctoo.model.util.Datable;
import nl.knaw.huygens.timbuctoo.model.util.FloruitPeriod;
import nl.knaw.huygens.timbuctoo.model.util.Link;
import nl.knaw.huygens.timbuctoo.model.util.PersonName;
import nl.knaw.huygens.timbuctoo.model.util.PersonNameComponent;
import nl.knaw.huygens.timbuctoo.model.util.RelationBuilder;
import nl.knaw.huygens.timbuctoo.storage.ValidationException;
import nl.knaw.huygens.timbuctoo.tools.config.ToolsInjectionModule;
import nl.knaw.huygens.timbuctoo.tools.importer.CSVImporter;
import nl.knaw.huygens.timbuctoo.tools.importer.CaptureHandler;
import nl.knaw.huygens.timbuctoo.tools.importer.DefaultImporter;
import nl.knaw.huygens.timbuctoo.tools.importer.neww.LocationConcordance;
import nl.knaw.huygens.timbuctoo.util.Files;
import nl.knaw.huygens.timbuctoo.util.Text;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.base.Splitter;
import com.google.common.base.Stopwatch;
import com.google.common.collect.Sets;
import com.google.inject.Injector;

/**
 * Imports data of the CKCC project into the repository.
 */
public class CKCCImporter extends DefaultImporter {

  private static final Logger LOG = LoggerFactory.getLogger(CKCCImporter.class);

  public static void main(String[] args) throws Exception {
    Stopwatch stopWatch = Stopwatch.createStarted();

    // Handle commandline arguments
    String directory = (args.length > 0) ? args[0] : "../../timbuctoo-testdata/src/main/resources/ckcc/";

    CKCCImporter importer = null;
    try {
      Injector injector = ToolsInjectionModule.createInjector();
      Repository repository = injector.getInstance(Repository.class);
      IndexManager indexManager = injector.getInstance(IndexManager.class);

      importer = new CKCCImporter(repository, indexManager, directory);
      importer.importAll(false);
    } finally {
      if (importer != null) {
        importer.close();
      }
      LOG.info("Time used: {}", stopWatch);
    }
  }

  // ---------------------------------------------------------------------------

  private static final String VRE_ID = "CKCC";
  private static final String[] TEI_EXTENSIONS = { "xml" };
  private static final String ORGANIZATIONS = "CKCC-organizations.xml";

  private final File inputDir;
  private final LocationConcordance concordance;

  public CKCCImporter(Repository repository, IndexManager indexManager, String inputDirName) throws Exception {
    super(repository, indexManager, VRE_ID);

    inputDir = new File(inputDirName);
    if (inputDir.isDirectory()) {
      System.out.printf("%nImporting from %s%n", inputDir.getCanonicalPath());
    } else {
      System.out.printf("%nNot a directory: %s%n", inputDir.getAbsolutePath());
    }
    concordance = new LocationConcordance(new File(inputDir, "location-concordance.csv"));
  }

  private void importAll(boolean letters) throws Exception {
    try {
      openImportLog("ckcc-log.txt");
      importRelationTypes();
      setupRelationTypeDefs();

      // collectives and persons
      Collection<File> files = FileUtils.listFiles(inputDir, TEI_EXTENSIONS, true);
      for (File file : Sets.newTreeSet(files)) {
        handleXmlFile(file);
      }

      // relations
      new RelationImporter().handleFile(new File(inputDir, "relations.csv"), 0, false);

      // documents and relations
      if (letters) {
        new LetterImporter().handleFile(new File(inputDir, "meta-barl001.csv"), 0, false);
        new LetterImporter().handleFile(new File(inputDir, "meta-beec002.csv"), 0, false);
        new LetterImporter().handleFile(new File(inputDir, "meta-groo001.csv"), 0, false);
        new LetterImporter().handleFile(new File(inputDir, "meta-huyg001.csv"), 0, false);
        new LetterImporter().handleFile(new File(inputDir, "meta-huyg003.csv"), 0, false);
        new LetterImporter().handleFile(new File(inputDir, "meta-leeu027.csv"), 0, false);
        new LetterImporter().handleFile(new File(inputDir, "meta-nier005.csv"), 0, false);
      }

    } finally {
      displayStatus();
      closeImportLog();
    }
  }

  // ---------------------------------------------------------------------------

  private void handleXmlFile(File file) throws Exception {
    String fileName = file.getName();
    log(".. %s%n", fileName);
    String xml = Files.readTextFromFile(file);
    Visitor visitor = fileName.equals(ORGANIZATIONS) ? new CollectivesVisitor() : new PersonsVisitor();
    Document.createFromXml(xml).accept(visitor);
  }

  private class ImportContext extends XmlContext {
    public CKCCCollective collective;
    public CKCCPerson person;
    public PersonName personName;
  }

  // ---------------------------------------------------------------------------

  /*
   * We have chosen to use the CKCC data "as is".
   * CKCC handles organizations (collectives) as persons, so the visitor must respect this.
   * However, we store these entities as collectives.
   */
  private class CollectivesVisitor extends DelegatingVisitor<ImportContext> {
    public CollectivesVisitor() {
      super(new ImportContext());
      setDefaultElementHandler(new DefaultHandler("listPerson", "occupation", "persName", "sex", "TEI"));
      addElementHandler(new CollectiveHandler(), "person");
      addElementHandler(new CollectiveNameHandler(), "surname");
      addElementHandler(new CollectiveXrefHandler(), "xref");
    }
  }

  private class CollectiveHandler implements ElementHandler<ImportContext> {
    @Override
    public Traversal enterElement(Element element, ImportContext context) {
      context.collective = new CKCCCollective();
      return Traversal.NEXT;
    }

    @Override
    public Traversal leaveElement(Element element, ImportContext context) {
      try {
        String storedId = addDomainEntity(CKCCCollective.class, context.collective);
        indexManager.addEntity(CKCCCollective.class, storedId);
      } catch (Exception e) {
        e.printStackTrace();
      }
      return Traversal.NEXT;
    }
  }

  private class CollectiveNameHandler extends CaptureHandler<ImportContext> {
    @Override
    public void handleContent(Element element, ImportContext context, String text) {
      context.collective.setName(text);
    }
  }

  private class CollectiveXrefHandler extends CaptureHandler<ImportContext> {
    @Override
    public void handleContent(Element element, ImportContext context, String text) {
      if (element.hasType("CKCC")) {
        context.collective.setUrn(text);
      } else {
        log("## Unknown xref type %s%n", element.getType());
      }
    }
  }

  // ---------------------------------------------------------------------------

  private class PersonsVisitor extends DelegatingVisitor<ImportContext> {
    public PersonsVisitor() {
      super(new ImportContext());
      setDefaultElementHandler(new DefaultHandler("listPerson", "placeName", "TEI"));
      addElementHandler(new PersonHandler(), "person");
      addElementHandler(new PersNameHandler(), "persName");
      addElementHandler(new NameComponentHandler(), "surname", "forename", "roleName", "addName", "nameLink", "genName");
      addElementHandler(new GenderHandler(), "sex");
      addElementHandler(new BirthHandler(), "birth");
      addElementHandler(new DeathHandler(), "death");
      addElementHandler(new FloruitHandler(), "floruit");
      addElementHandler(new LinkHandler(), "link");
      addElementHandler(new PersonXrefHandler(), "xref");
      addElementHandler(new NotesHandler(), "occupation", "relation");
    }
  }

  private class DefaultHandler extends DefaultElementHandler<ImportContext> {
    private final Set<String> ignoredNames;

    public DefaultHandler(String... names) {
      ignoredNames = Sets.newHashSet(names);
    }

    @Override
    public Traversal enterElement(Element element, ImportContext context) {
      String name = element.getName();
      if (!ignoredNames.contains(name)) {
        log("## Unexpected element: %s%n", name);
      }
      return Traversal.NEXT;
    }
  }

  private class PersonHandler implements ElementHandler<ImportContext> {
    @Override
    public Traversal enterElement(Element element, ImportContext context) {
      context.person = new CKCCPerson();
      return Traversal.NEXT;
    }

    @Override
    public Traversal leaveElement(Element element, ImportContext context) {
      try {
        String storedId = addDomainEntity(CKCCPerson.class, context.person);
        indexManager.addEntity(CKCCPerson.class, storedId);
      } catch (Exception e) {
        e.printStackTrace();
      }
      return Traversal.NEXT;
    }
  }

  private class PersNameHandler implements ElementHandler<ImportContext> {
    @Override
    public Traversal enterElement(Element element, ImportContext context) {
      context.personName = new PersonName();
      return Traversal.NEXT;
    }

    @Override
    public Traversal leaveElement(Element element, ImportContext context) {
      context.person.addName(context.personName);
      return Traversal.NEXT;
    }
  }

  private class NameComponentHandler extends CaptureHandler<ImportContext> {
    @Override
    public void handleContent(Element element, ImportContext context, String text) {
      if (element.hasName("surname")) {
        context.personName.addNameComponent(PersonNameComponent.Type.SURNAME, text);
      } else if (element.hasName("forename")) {
        context.personName.addNameComponent(PersonNameComponent.Type.FORENAME, text);
      } else if (element.hasName("roleName")) {
        context.personName.addNameComponent(PersonNameComponent.Type.ROLE_NAME, text);
      } else if (element.hasName("addName")) {
        context.personName.addNameComponent(PersonNameComponent.Type.ADD_NAME, text);
      } else if (element.hasName("nameLink")) {
        context.personName.addNameComponent(PersonNameComponent.Type.NAME_LINK, text);
      } else if (element.hasName("genName")) {
        context.personName.addNameComponent(PersonNameComponent.Type.GEN_NAME, text);
      } else {
        log("## Unknown component: %s", element.getName());
      }
    }
  }

  private class GenderHandler extends CaptureHandler<ImportContext> {
    @Override
    public void handleContent(Element element, ImportContext context, String text) {
      if (text.equals("male")) {
        context.person.setGender(Person.Gender.MALE);
      } else if (text.equals("female")) {
        context.person.setGender(Person.Gender.FEMALE);
      } else if (text.equals("not applicable")) {
        context.person.setGender(Person.Gender.NOT_APPLICABLE);
      } else {
        context.person.setGender(Person.Gender.UNKNOWN);
      }
    }
  }

  private class BirthHandler extends DefaultElementHandler<ImportContext> {
    @Override
    public Traversal enterElement(Element element, ImportContext context) {
      String text = element.getAttribute("when");
      if (!text.isEmpty()) {
        context.person.setBirthDate(new Datable(text));
      }
      return Traversal.NEXT;
    }
  }

  private class DeathHandler extends DefaultElementHandler<ImportContext> {
    @Override
    public Traversal enterElement(Element element, ImportContext context) {
      String text = element.getAttribute("when");
      if (!text.isEmpty()) {
        context.person.setDeathDate(new Datable(text));
      }
      return Traversal.NEXT;
    }
  }

  private class FloruitHandler extends DefaultElementHandler<ImportContext> {
    @Override
    public Traversal enterElement(Element element, ImportContext context) {
      String start = null;
      String end = null;
      if (element.hasAttribute("when")) {
        start = element.getAttribute("when");
        end = start;
      } else {
        // The use of "notBefore" and "notAfter" is consistent with CKCC,
        // but probably not as how it is intended in the TEI guidelines!
        if (element.hasAttribute("notBefore")) {
          start = element.getAttribute("notBefore");
        }
        if (element.hasAttribute("notAfter")) {
          end = element.getAttribute("notAfter");
        }
      }
      context.person.setFloruit(createFloruit(start, end));
      return Traversal.NEXT;
    }

    private FloruitPeriod createFloruit(String start, String end) {
      if (!StringUtils.isBlank(start) && !StringUtils.isBlank(end)) {
        return new FloruitPeriod(start, end);
      } else if (!StringUtils.isBlank(start) && StringUtils.isBlank(end)) {
        return new FloruitPeriod(start);
      } else if (!StringUtils.isBlank(end) && StringUtils.isBlank(start)) {
        return new FloruitPeriod(end);
      } else {
        return null;
      }
    }
  }

  private class LinkHandler extends CaptureHandler<ImportContext> {
    @Override
    protected void handleContent(Element element, ImportContext context, String text) {
      context.person.addLink(new Link(text));
    }
  }

  private class PersonXrefHandler extends CaptureHandler<ImportContext> {
    @Override
    public void handleContent(Element element, ImportContext context, String text) {
      if (element.hasType("CKCC")) {
        context.person.setUrn(text);
      } else if (element.hasType("CEN")) {
        context.person.setCenId(text);
      } else {
        log("## Unknown xref type %s%n", element.getType());
      }
    }
  }

  private class NotesHandler extends CaptureHandler<ImportContext> {
    @Override
    protected void handleContent(Element element, ImportContext context, String text) {
      StringBuilder builder = new StringBuilder();
      Text.appendTo(builder, context.person.getNotes(), "");
      Text.appendTo(builder, text, "; ");
      context.person.setNotes(builder.toString());
    }
  }

  // ---------------------------------------------------------------------------

  public class RelationImporter extends CSVImporter {

    private static final int FIELDS = 3;

    public RelationImporter() {
      super(new PrintWriter(System.err));
    }

    @Override
    protected void handleLine(String[] items) throws Exception {
      if (items.length < FIELDS) {
        throw new ValidationException("Lines must have at least %d items", FIELDS);
      }
      Reference typeRef = relationTypes.get(items[0]);
      RelationType relationType = repository.getRelationTypeById(typeRef.getId(), true);
      Reference sourceRef = getReference(relationType.getSourceTypeName(), items[1]);
      Reference targetRef = getReference(relationType.getTargetTypeName(), items[2]);
      if (typeRef != null && sourceRef != null && targetRef != null) {
        addRelation(CKCCRelation.class, typeRef, sourceRef, targetRef, change, "");
      }
    }

    private Reference getReference(String iname, String urn) {
      if (iname.equalsIgnoreCase("collective")) {
        CKCCCollective entity = repository.findEntity(CKCCCollective.class, "urn", urn);
        if (entity == null) {
          log("Did not find collective with urn %s%n", urn);
          return null;
        }
        return new Reference(Collective.class, entity.getId());
      }
      if (iname.equalsIgnoreCase("person")) {
        CKCCPerson entity = repository.findEntity(CKCCPerson.class, "urn", urn);
        if (entity == null) {
          log("Did not find person with urn %s%n", urn);
          return null;
        }
        return new Reference(Person.class, entity.getId());
      }
      if (iname.equalsIgnoreCase("location")) {
        Location entity = repository.findEntity(Location.class, "^urn", urn);
        if (entity == null) {
          log("Did not find location with urn %s%n", urn);
          return null;
        }
        return new Reference(Location.class, entity.getId());
      }
      log("Unknown type name %s%n", iname);
      return null;
    }
  }

  // ---------------------------------------------------------------------------

  /**
   * Imports metada of letters
   */
  public class LetterImporter extends CSVImporter {

    private static final int FIELDS = 8;

    private static final String URL_PREFIX = "http://ckcc.huygens.knaw.nl/epistolarium/letter.html?id=";

    private final String isCreatedById;
    private final String hasRecipientId;
    private final String hasSenderLocationId;
    private final String hasRecipientLocationId;

    public LetterImporter() {
      super(new PrintWriter(System.err));
      isCreatedById = repository.getRelationTypeByName("isCreatedBy", true).getId();
      hasRecipientId = repository.getRelationTypeByName("hasRecipient", true).getId();
      hasSenderLocationId = repository.getRelationTypeByName("hasSenderLocation", true).getId();
      hasRecipientLocationId = repository.getRelationTypeByName("hasRecipientLocation", true).getId();
    }

    @Override
    protected void handleLine(String[] items) throws Exception {
      if (items.length < FIELDS) {
        throw new ValidationException("Lines must have at least %d items", FIELDS);
      }
      String letterId = items[0];
      String date = items[1];
      String senders = items[2];
      String senderLoc = items[3];
      // String senderLocCertainty = items[4];
      String recipients = items[5];
      String recipientLoc = items[6];
      // String recipientLocCertainty = items[7];

      CKCCDocument document = new CKCCDocument();
      document.setUrn(letterId);
      document.setDate(new Datable(date));
      document.setTitle("Letter " + letterId);
      document.addLink(new Link(URL_PREFIX + letterId));
      String storedId = addDomainEntity(CKCCDocument.class, document);

      if (valid(senders)) {
        for (String sender : Splitter.on('#').split(senders)) {
          String urn = sender.replace("?", "");
          CKCCPerson person = repository.findEntity(CKCCPerson.class, "urn", urn);
          if (person != null) {
            CKCCRelation relation = RelationBuilder.newInstance(CKCCRelation.class).withRelationTypeId(isCreatedById).withSourceType(TypeNames.getInternalName(Document.class)).withSourceId(storedId)
                .withTargetType(TypeNames.getInternalName(Person.class)).withTargetId(person.getId()).build();
            addDomainEntity(CKCCRelation.class, relation);
          } else if (repository.findEntity(CKCCCollective.class, "urn", urn) == null) {
            System.out.printf("%s: failed to find sender %s%n", letterId, urn);
          }
        }
      }

      if (valid(senderLoc)) {
        String urn = concordance.convert(senderLoc.replace("?", ""));
        if (!urn.equals("?")) {
          Location location = repository.findEntity(Location.class, "^urn", urn);
          if (location != null) {
            CKCCRelation relation = RelationBuilder.newInstance(CKCCRelation.class).withRelationTypeId(hasSenderLocationId).withSourceType(TypeNames.getInternalName(Document.class))
                .withSourceId(storedId).withTargetType(TypeNames.getInternalName(Location.class)).withTargetId(location.getId()).build();
            addDomainEntity(CKCCRelation.class, relation);
          } else {
            System.out.printf("%s: failed to find sender location %s (mapped to %s)%n", letterId, senderLoc, urn);
          }
        }
      }

      if (valid(recipients)) {
        for (String recipient : Splitter.on('#').split(recipients)) {
          String urn = recipient.replace("?", "");
          CKCCPerson person = repository.findEntity(CKCCPerson.class, "urn", urn);
          if (person != null) {
            CKCCRelation relation = RelationBuilder.newInstance(CKCCRelation.class).withRelationTypeId(hasRecipientId).withSourceType(TypeNames.getInternalName(Document.class)).withSourceId(storedId)
                .withTargetType(TypeNames.getInternalName(Person.class)).withTargetId(person.getId()).build();
            addDomainEntity(CKCCRelation.class, relation);
          } else if (repository.findEntity(CKCCCollective.class, "urn", urn) == null) {
            System.out.printf("%s: failed to find recipient %s%n", letterId, urn);
          }
        }
      }

      if (valid(recipientLoc)) {
        String urn = concordance.convert(recipientLoc.replace("?", ""));
        if (!urn.equals("?")) {
          Location location = repository.findEntity(Location.class, "^urn", urn);
          if (location != null) {
            CKCCRelation relation = RelationBuilder.newInstance(CKCCRelation.class).withRelationTypeId(hasRecipientLocationId).withSourceType(TypeNames.getInternalName(Document.class))
                .withSourceId(storedId).withTargetType(TypeNames.getInternalName(Location.class)).withTargetId(location.getId()).build();
            addDomainEntity(CKCCRelation.class, relation);
          } else {
            System.out.printf("%s: failed to find recipient location %s (mapped to %s)%n", letterId, recipientLoc, urn);
          }
        }
      }
    }

    private boolean valid(String text) {
      return !text.isEmpty() && !text.equals("?");
    }
  }

}
