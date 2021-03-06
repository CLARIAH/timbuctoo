package nl.knaw.huygens.timbuctoo.v5.graphql.serializable;

import graphql.ExecutionResult;
import graphql.ExecutionResultImpl;
import graphql.execution.AsyncExecutionStrategy;
import graphql.execution.ExecutionContext;
import graphql.execution.ExecutionStrategyParameters;
import graphql.execution.NonNullableFieldWasNullException;
import graphql.language.Field;
import graphql.language.StringValue;
import graphql.schema.GraphQLFieldDefinition;
import graphql.schema.GraphQLObjectType;
import nl.knaw.huygens.timbuctoo.v5.datastores.quadstore.dto.Direction;
import nl.knaw.huygens.timbuctoo.v5.graphql.datafetchers.dto.DatabaseResult;
import nl.knaw.huygens.timbuctoo.v5.graphql.datafetchers.dto.PaginatedList;
import nl.knaw.huygens.timbuctoo.v5.graphql.datafetchers.dto.SubjectReference;
import nl.knaw.huygens.timbuctoo.v5.graphql.datafetchers.dto.TypedValue;
import nl.knaw.huygens.timbuctoo.v5.serializable.dto.Entity;
import nl.knaw.huygens.timbuctoo.v5.serializable.dto.GraphqlIntrospectionList;
import nl.knaw.huygens.timbuctoo.v5.serializable.dto.GraphqlIntrospectionValue;
import nl.knaw.huygens.timbuctoo.v5.serializable.dto.PredicateInfo;
import nl.knaw.huygens.timbuctoo.v5.serializable.dto.QueryContainer;
import nl.knaw.huygens.timbuctoo.v5.serializable.dto.Serializable;
import nl.knaw.huygens.timbuctoo.v5.serializable.dto.Value;
import nl.knaw.huygens.timbuctoo.v5.util.RdfConstants;
import org.slf4j.Logger;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

import static nl.knaw.huygens.timbuctoo.v5.serializable.dto.GraphqlIntrospectionList.graphqlIntrospectionList;
import static nl.knaw.huygens.timbuctoo.v5.serializable.dto.GraphqlIntrospectionObject.graphqlIntrospectionObject;
import static nl.knaw.huygens.timbuctoo.v5.serializable.dto.SerializableList.serializableList;
import static org.slf4j.LoggerFactory.getLogger;

public class SerializerExecutionStrategy extends AsyncExecutionStrategy {
  private static final Logger LOG = getLogger(SerializerExecutionStrategy.class);


  @Override
  public CompletableFuture<ExecutionResult> execute(ExecutionContext executionContext,
                                                    ExecutionStrategyParameters parameters)
      throws NonNullableFieldWasNullException {
    Map<String, java.util.List<Field>> fields = parameters.fields();
    GraphQLObjectType parentType = parameters.typeInfo().castType(GraphQLObjectType.class);

    return super.execute(executionContext, parameters).thenApply(sourceResult -> {
      Map<String, Object> data  = sourceResult.getData();
      if (parameters.source() instanceof TypedValue) {
        String value = ((TypedValue) parameters.source()).getValue();
        String typename = ((TypedValue) parameters.source()).getType();
        Value result;
        if (value == null) {
          result = null;
        } else if (data.containsKey("__typename")) {
          result = Value.create(value, typename, (String) data.get("__typename"));
        } else {
          result = Value.create(value, typename);
        }
        return new ExecutionResultImpl(
          result,
          sourceResult.getErrors(),
          sourceResult.getExtensions()
        );
      } else if (parameters.source() instanceof SubjectReference) {
        final String uri = ((SubjectReference) parameters.source()).getSubjectUri();
        final Set<String> types = ((SubjectReference) parameters.source()).getTypes();
        final String graphqlType = getDirectiveArgument(parentType, "rdfType", "uri").orElse(null);
        String type;
        if (graphqlType != null && types.contains(graphqlType)) {
          type = graphqlType;
        } else {
          Optional<String> firstType = types.stream().sorted().findFirst();
          if (firstType.isPresent()) {
            type = firstType.get();
          } else {
            LOG.error("No type present on " + uri + ". Expected at least TIM_UNKNOWN");
            type = RdfConstants.UNKNOWN;
          }
        }

        LinkedHashMap<PredicateInfo, Serializable> copy = new LinkedHashMap<>();
        for (Map.Entry<String, Object> entry : data.entrySet()) {
          final String graphqlFieldName = entry.getKey();
          final GraphQLFieldDefinition fieldDesc = parentType.getFieldDefinition(entry.getKey());
          Optional<String> predicateUri = getDirectiveArgument(fieldDesc, "rdf", "predicate");
          Optional<Direction> direction =
            getDirectiveArgument(fieldDesc, "rdf", "direction").map(Direction::valueOf);
          final PredicateInfo predicateInfo;
          predicateInfo = predicateUri
            .map(predUri -> PredicateInfo.predicateInfo(graphqlFieldName, predUri, direction.orElse(Direction.OUT)))
            .orElseGet(() -> PredicateInfo.predicateInfo(graphqlFieldName, null, Direction.OUT));

          if (entry.getValue() == null || entry.getValue() instanceof Serializable) {
            copy.put(predicateInfo, (Serializable) entry.getValue());
          } else {
            copy.put(predicateInfo, Value.fromRawJavaType(entry.getValue()));
          }
        }
        return new ExecutionResultImpl(
          Entity.entity(uri, type, copy),
          sourceResult.getErrors(),
          sourceResult.getExtensions()
        );
      } else if (parameters.source() instanceof PaginatedList) {
        PaginatedList<? extends DatabaseResult> source = (PaginatedList) parameters.source();
        return new ExecutionResultImpl(
          serializableList(
            source.getPrevCursor().orElse(null),
            source.getNextCursor().orElse(null),
            ((GraphqlIntrospectionList) data.get("items")).getItems()
          ),
          sourceResult.getErrors(),
          sourceResult.getExtensions()
        );
      } else if (executionContext.getGraphQLSchema().getQueryType() == parentType) {
        return new ExecutionResultImpl(
          QueryContainer.queryContainer(sourceResult.getData()),
          sourceResult.getErrors(),
          sourceResult.getExtensions()
        );
      } else {
        LinkedHashMap<String, Serializable> copy = new LinkedHashMap<>();
        for (Map.Entry<String, Object> entry : data.entrySet()) {
          if (entry.getValue() == null || entry.getValue() instanceof Serializable) {
            copy.put(entry.getKey(), (Serializable) entry.getValue());
          } else {
            copy.put(entry.getKey(), GraphqlIntrospectionValue.fromRawJavaType(entry.getValue()));
          }
        }

        return new ExecutionResultImpl(
          graphqlIntrospectionObject(copy),
          sourceResult.getErrors(),
          sourceResult.getExtensions()
        );
      }
    });

  }

  public Optional<String> getDirectiveArgument(GraphQLObjectType parentType, String directiveName,
                                                    String argumentName) {
    return Optional.ofNullable(parentType.getDefinition().getDirective(directiveName))
      .map(d -> d.getArgument(argumentName))
      .map(v -> (StringValue) v.getValue())
      .map(StringValue::getValue);
  }

  public Optional<String> getDirectiveArgument(GraphQLFieldDefinition field, String directiveName,
                                               String argumentName) {
    return Optional.ofNullable(field.getDefinition().getDirective(directiveName))
      .map(d -> d.getArgument(argumentName))
      .map(v -> (StringValue) v.getValue())
      .map(StringValue::getValue);
  }

  @Override
  protected CompletableFuture<ExecutionResult> completeValueForList(ExecutionContext executionContext,
                                                                    ExecutionStrategyParameters parameters,
                                                                    Iterable<Object> result) {
    return super.completeValueForList(executionContext, parameters, result).thenApply(completedResult -> {
      List<Object> data = completedResult.getData();
      List<Serializable> copy = data.stream().map(item -> {
        if (item == null || item instanceof Serializable) {
          return ((Serializable) item);
        } else {
          return Value.fromRawJavaType(item);
        }
      }).collect(Collectors.toList());
      return new ExecutionResultImpl(
        graphqlIntrospectionList(copy),
        completedResult.getErrors(),
        completedResult.getExtensions()
      );
    });
  }

}
