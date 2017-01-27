#### Context
The ResourceSync Framework is used to exchange rdf-data with remote quad stores.
Additions in this pull request include:
- nl.knaw.huygens.timbuctoo.remote.rs.xml - marshal and unmarshal sitemap documents to and from java classes
- nl.knaw.huygens.timbuctoo.remote.rs.discover - discover and navigate a remote ResourceSync document tree
- nl.knaw.huygens.timbuctoo.remote.rs.view - render the result of an expedition for json.
- nl/knaw/huygens/timbuctoo/remote/rs/ResourceSyncService.java - central service
- nl/knaw/huygens/timbuctoo/server/endpoints/v2/remote/rs/Discover.java - web service API

#### Definition of done
This issue is considered delivered when:
Being able to list the graphs that are exposed by a remote source.

#### Data model
The ResourceSync Framework is a well-documented protocol. According to the protocol sets of resources can be manifested with the aid of capabilitylists; a capabilitylist for each distinguished set. Specifications about naming these sets are not in the protocol.

CLARIAH adds to the protocol a convention about the communication of the graph iri's available at a remote source. At this point this is realized by translating the graph iri in base64 and taking this translation as the directory name for the capability list. At the client-side, also called destination, this directory name has to be decoded in order to get the graph iri. Other, more sophisticated conventions to get name and for instance a description of a remote graph across can be easily thought of. For instance by means of the 'discribedBy' relation of a link-element in a capabilitylist. The code anticipates changes in these conventions and enables adaptation to conventions with a minimum footprint.

### Steps to test the API
- Start the complete set of docker images as described in https://github.com/CLARIAH/virtuoso-quad-log/blob/master/DEPLOY.md with `docker-compose-example-setup.yml`.
  - The `docker-compose-example-setup.yml` uses `HTTP_SERVER_URL` `http://192.168.99.100:8085`, this is the ip used by older versions of docker for mac.
  - When you use docker on another system or use a more recent version of docker change the `HTTP_SERVER_URL` `http://localhost:8085`.
- Start Timbuctoo

The following urls should yield (if the `HTTP_SERVER_URL` was changed for the test api swap `192.168.99.100` for `localhost` in the examples below):
- http://localhost:8080/v2.1/remote/rs/discover/listgraphs/http%3A%2F%2F192.168.99.100%3A8085%2F  - list the graph iri's at the remote site
- http://localhost:8080/v2.1/remote/rs/discover/listsets/http%3A%2F%2F192.168.99.100%3A8085%2F  - same as previous, agnostic to base64-convention
- http://localhost:8080/v2.1/remote/rs/discover/framework/http%3A%2F%2F192.168.99.100%3A8085%2F  - flat representation of the ResourceSync Framework documents
- http://localhost:8080/v2.1/remote/rs/discover/tree/http%3A%2F%2F192.168.99.100%3A8085%2F  - hierarchical representation of the ResourceSync Framework documents

### Working with the ../remote/rs/xml package
When downloading a ResourceSync doument we do not always know whether we find a &lt;sitemapindex&gt; or a &lt;urlset&gt;. The two kinds of document are represented as java classes `Urlset` and `Sitemapindex`, both have a common superclass, `RsRoot`. The class `RsBuilder` in this package will take a variety of input types and produces an Optional of `RsRoot`. If the unmarshal operation succeeded then either one of the methods
`Optional<Urlset> getUrlset()` or `Optional<Sitemapindex> getSitemapindex()` will yield.

The RsBuilder class also has a convenience method for marshaling a `RsRoot` subclass to its xml-representation: `String toXml(RsRoot rsRoot, boolean formattedOutput)`. If needed this class could be extended to marshal to different types: `toXmlString`, `toXmlFile` etc.

To build a ResourceSync document from java, the JAXB-classes can be used and populated with values. However, extensive syntax checking is not done. To build valid ResourceSync documents you still need to consult the documentation.

### Working with the ../remote/rs/discover package
The principle behind the `AbstractUriExplorer` and `Result<?>` classes is agnostic to the ResourceSync Framework. It presents the opportunity to explore any URI and relate it to some kind of response or the absence of it. In case of a response, the response can be converted through some kind of function to some java class, the 'content' of the `Result`. Also any errors while getting the response or during conversion will be stored in the `Result` instance. Not handling errors in this code is natural. The maturity of possible errors will have a cause that is on the remote end. Here we register errors only to report them to end users.

The above abstraction comes together in the `AbstractUriExplorer` method with the signature
``
<T> Result<T> execute(URI uri, Function_WithExceptions<HttpResponse, T, ?> func)
``
Furthermore, the principle that any document on the internet can have incoming links and outgoing links is expressed in the `Result` class with parents (for incoming links) and children (for outgoing links).

The ResourceSync documents on a remote site can be seen as a tree or network; all documents have relations of some type to other documents. With the help of the concrete classes `LinkExplorer` and `RsExplorer` such a network can be explored. The `Expedition` class uses these explorers to test four methods of discovering a remote network of ResourceSync documents. At the moment an Expedition discovers _all_ ResourceSync documents at the remote site, which might be overkill in case we are looking for a particular document and the remote site has substantial amounts of related documents. 

> @ToDo: Introduce a Navigator class that is handed through `Expedition.explore` methods up to the `RsExplorer` class and that, having been given a target, knows whether the exploration has to go up, down or sideways through parent and child links in order to reach the target document. The enum `Capability` in the xml package already knows about parent and child relations between the various document types and might be useful in this navigation attempt.

All results come together in a `ResultIndex`, which is essentially a collection of mappings between URIs and `Result<?>`s. The `ResultIndexPivot` class is a wrapper around such a `ResultIndex` that facilitates data summarizations. Of course the `ResultIndex` itself can be used as a starting point to 'stream' summarizations without intermediate reduce operations. 

### Working with the ../remote/rs/view package

This package has several 'views' on results and result details that are shaped for (one way) Json serialization. Classes that take a `ResultIndex` are marked with the word 'Base': `SetListBase`, `FrameworkBase`, `TreeBase`.  The constructors of these classes take the result detail they are supposed to render and an `Interpreter` which introduces some flexibility on how a detail is rendered. The `Interpreter` and `Interpreters` classes should be extended with whatever interpreters are needed for more sophisticated renderings. Of course in such a case also particular methods in  the views have to be adopted to make use of the interpreter.

### The Discover API
The class `nl.knaw.huygens.timbuctoo.server.endpoints.v2.remote.rs.Discover` handles API calls that enable discovering a remote ResourceSync source. A CLARIAH-introduced convention of communicating the graph iri through the name of a directory is provided by means of an interpreter as mentioned in the previous paragraph. The methods `listSets` and `listGraphs` are essentially the same, except that the latter method uses the `Interpreters.base64EncodedItemNameInterpreter`.  Thus reducing the impact of changes in perhaps temporary conventions to a minimum.

### What remains to be done

A lot. Now we can discover remote ResourceSync metadata and represent it in several ways. We still need to do synchronization of the actual resources and import the rdf-patch files into Timbuctoo.