package nl.knaw.huygens.timbuctoo.tools.importer.neww;

/*
 * #%L
 * Timbuctoo tools
 * =======
 * Copyright (C) 2012 - 2015 Huygens ING
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

import java.io.IOException;
import java.util.List;

import javax.ws.rs.core.MediaType;

import nl.knaw.huygens.tei.DelegatingVisitor;
import nl.knaw.huygens.tei.Element;
import nl.knaw.huygens.tei.Traversal;
import nl.knaw.huygens.tei.Visitor;
import nl.knaw.huygens.tei.XmlContext;
import nl.knaw.huygens.tei.handlers.DefaultElementHandler;
import nl.knaw.huygens.timbuctoo.tools.importer.DefaultConverter;

import com.google.common.base.Joiner;
import com.google.common.collect.Lists;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;

/**
 * Base class for COBWWWEB converters.
 */
public abstract class CobwwwebConverter extends DefaultConverter {

  public CobwwwebConverter(String vreId) {
    super(vreId);
  }

  protected String getResource(String... urlParts) throws Exception {
    String url = Joiner.on("/").join(urlParts);
    logSourceName(url);
    WebResource resource = Client.create().resource(url);
    ClientResponse response = resource.accept(MediaType.APPLICATION_XML).get(ClientResponse.class);
    if (response.getClientResponseStatus() != ClientResponse.Status.OK) {
      throw new IOException("Failed to retrieve " + url);
    }
    return response.getEntity(String.class);
  }

  protected List<String> parseIdResource(String xml, String idElementName) {
    IdContext context = new IdContext();
    parseXml(xml, new IdVisitor(context, idElementName));
    return context.getIds();
  }

  protected void parseXml(String xml, Visitor visitor) {
    nl.knaw.huygens.tei.Document.createFromXml(xml).accept(visitor);
  }

  // ---------------------------------------------------------------------------

  /**
   * Context for storing the id's in the parsed XML.
   */
  private class IdContext extends XmlContext {
    private final List<String> ids = Lists.newArrayList();

    public List<String> getIds() {
      return ids;
    }

    public void addId(String id) {
      // somewhat inefficent, but we want to preserve ordering
      if (ids.contains(id)) {
        log("## Duplicate id: %s%n", id);
      } else {
        ids.add(id);
      }
    }
  }

  /**
   * Document visitor for handling the id's stored in the specified element.
   */
  private class IdVisitor extends DelegatingVisitor<IdContext> {
    public IdVisitor(IdContext context, String idElementName) {
      super(context);
      addElementHandler(new IdHandler(), idElementName);
    }
  }

  /**
   * Captures the text in the id-element and adds it to the context id-list.
   */
  private class IdHandler extends DefaultElementHandler<IdContext> {
    @Override
    public Traversal enterElement(Element element, IdContext context) {
      context.openLayer();
      return Traversal.NEXT;
    }

    @Override
    public Traversal leaveElement(Element element, IdContext context) {
      String id = context.closeLayer().trim();
      context.addId(id);
      return Traversal.NEXT;
    }
  }

}
