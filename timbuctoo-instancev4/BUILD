java_plugin(
    name = "immutables_processor",
    processor_class = "org.immutables.processor.ProxyProcessor",
    deps = [
        "//third_party:org_immutables_value",
    ],
)

java_binary(
    name = "checkstyle",
    main_class = "com.puppycrawl.tools.checkstyle.Main",
    runtime_deps = [
        "//third_party:com_puppycrawl_tools_checkstyle",
    ],
)

java_binary(
    name = "everything",
    srcs = glob([
        "src/main/java/**/*.java",
    ]),
    main_class = "nl.knaw.huygens.timbuctoo.server.TimbuctooV4",
    plugins = [
        ":immutables_processor",
    ],
    resources = glob([
        "src/main/resources/**/*",
    ]),
    deps = [
        "//security-client-agnostic",
        "//third_party:com_fasterxml_jackson_core_jackson_annotations",
        "//third_party:com_fasterxml_jackson_core_jackson_core",
        "//third_party:com_fasterxml_jackson_core_jackson_databind",
        "//third_party:com_fasterxml_jackson_dataformat_jackson_dataformat_xml",
        "//third_party:com_fasterxml_jackson_datatype_jackson_datatype_guava",
        "//third_party:com_fasterxml_jackson_datatype_jackson_datatype_jdk8",
        "//third_party:com_google_code_findbugs_jsr305",
        "//third_party:com_google_code_gson_gson",
        "//third_party:com_google_guava_guava",
        "//third_party:com_javaslang_javaslang",
        "//third_party:com_kjetland_dropwizard_dropwizard_activemq",
        "//third_party:com_microsoft_azure_azure_storage",
        "//third_party:com_sleepycat_je",
        "//third_party:com_twitter_util_hashing_2_11",
        "//third_party:commons_configuration_commons_configuration",
        "//third_party:commons_io_commons_io",
        "//third_party:commons_lang_commons_lang",
        "//third_party:io_dropwizard_dropwizard_assets",
        "//third_party:io_dropwizard_dropwizard_client",
        "//third_party:io_dropwizard_dropwizard_configuration",
        "//third_party:io_dropwizard_dropwizard_core",
        "//third_party:io_dropwizard_dropwizard_forms",
        "//third_party:io_dropwizard_dropwizard_jackson",
        "//third_party:io_dropwizard_dropwizard_jersey",
        "//third_party:io_dropwizard_dropwizard_jetty",
        "//third_party:io_dropwizard_dropwizard_lifecycle",
        "//third_party:io_dropwizard_dropwizard_logging",
        "//third_party:io_dropwizard_dropwizard_metrics",
        "//third_party:io_dropwizard_dropwizard_servlets",
        "//third_party:io_dropwizard_dropwizard_validation",
        "//third_party:io_dropwizard_metrics_metrics_annotation",
        "//third_party:io_dropwizard_metrics_metrics_core",
        "//third_party:io_dropwizard_metrics_metrics_healthchecks",
        "//third_party:io_dropwizard_metrics_metrics_httpclient",
        "//third_party:javax_annotation_javax_annotation_api",
        "//third_party:javax_validation_validation_api",
        "//third_party:javax_ws_rs_javax_ws_rs_api",
        "//third_party:nl_knaw_huygens_huygens_persistence",
        "//third_party:org_apache_activemq_activemq_broker",
        "//third_party:org_apache_activemq_activemq_kahadb_store",
        "//third_party:org_apache_commons_commons_csv",
        "//third_party:org_apache_commons_commons_lang3",
        "//third_party:org_apache_geronimo_specs_geronimo_jms_1_1_spec",
        "//third_party:org_apache_httpcomponents_httpclient",
        "//third_party:org_apache_httpcomponents_httpcore_osgi",
        "//third_party:org_apache_jena_jena_arq",
        "//third_party:org_apache_jena_jena_core",
        "//third_party:org_apache_lucene_lucene_queryparser",
        "//third_party:org_apache_tinkerpop_gremlin_core",
        "//third_party:org_apache_tinkerpop_gremlin_groovy",
        "//third_party:org_apache_tinkerpop_gremlin_shaded",
        "//third_party:org_apache_tinkerpop_neo4j_gremlin",
        "//third_party:org_codehaus_groovy_groovy_jsr223",
        "//third_party:org_codehaus_groovy_groovy_swing",
        "//third_party:org_eclipse_jetty_jetty_server",
        "//third_party:org_eclipse_jetty_jetty_util",
        "//third_party:org_eclipse_rdf4j_rdf4j_model",
        "//third_party:org_eclipse_rdf4j_rdf4j_rio_api",
        "//third_party:org_glassfish_jersey_core_jersey_common",
        "//third_party:org_glassfish_jersey_core_jersey_server",
        "//third_party:org_glassfish_jersey_media_jersey_media_multipart",
        "//third_party:org_hamcrest_hamcrest_all",
        "//third_party:org_hibernate_hibernate_validator",
        "//third_party:org_immutables_value",
        "//third_party:org_jsoup_jsoup",
        "//third_party:org_neo4j_neo4j_cluster",
        "//third_party:org_neo4j_neo4j_collections",
        "//third_party:org_neo4j_neo4j_graphdb_api",
        "//third_party:org_neo4j_neo4j_ha",
        "//third_party:org_neo4j_neo4j_kernel",
        "//third_party:org_neo4j_neo4j_logging",
        "//third_party:org_neo4j_neo4j_resource",
        "//third_party:org_neo4j_neo4j_slf4j",
        "//third_party:org_neo4j_neo4j_tinkerpop_api",
        "//third_party:org_neo4j_neo4j_tinkerpop_api_impl",
        "//third_party:org_slf4j_slf4j_api",
        "//timbuctoo-instancev4/src/main/java/nl/knaw/huygens/timbuctoo/bulkupload",
        "//timbuctoo-instancev4/src/main/java/nl/knaw/huygens/timbuctoo/rml",
        "//timbuctoo-instancev4/src/main/java/nl/knaw/huygens/timbuctoo/rml/datasource/jexl",
        "//timbuctoo-instancev4/src/main/java/nl/knaw/huygens/timbuctoo/rml/jena",
        "//timbuctoo-instancev4/src/main/java/nl/knaw/huygens/timbuctoo/security",
        "//timbuctoo-instancev4/src/main/java/nl/knaw/huygens/timbuctoo/util",
        "//timbuctoo-instancev4/src/main/java/nl/knaw/huygens/timbuctoo/v5",
        "//timbuctoo-instancev4/src/main/java/nl/knaw/huygens/timbuctoo/v5/backupforstaging/azureblob/dropwizardconfiguration",
        "//timbuctoo-instancev4/src/main/java/nl/knaw/huygens/timbuctoo/v5/filehelper",
        "//timbuctoo-instancev4/src/main/java/nl/knaw/huygens/timbuctoo/v5/security/twitterexample",
        "//timbuctoo-test-services",
    ],
)
