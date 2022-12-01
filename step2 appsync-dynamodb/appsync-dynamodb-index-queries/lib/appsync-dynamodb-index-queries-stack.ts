import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from '@aws-cdk/aws-appsync-alpha';
import { aws_dynamodb as dynamodb, aws_lambda as lambda } from 'aws-cdk-lib'
import { DynamoEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AppsyncDynamodbIndexQueriesStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const appsyncApi = new appsync.GraphqlApi(this, 'api', {
      name: 'appsync-dynodb-query-api',
      schema: appsync.Schema.fromAsset('schema/schema.graphql')
    })
    
    const todosLambda = new lambda.Function(this, 'AppsyncTodoHandler', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'main.handler',
      code: lambda.Code.fromAsset('functions'),
      memorySize: 1024
    });

    const todosTable = new dynamodb.Table(this, 'TodosTable', {
      partitionKey: {
        name: 'username',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'title',
        type: dynamodb.AttributeType.STRING
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      stream: dynamodb.StreamViewType.NEW_IMAGE,
      removalPolicy: RemovalPolicy.DESTROY
    });

    todosTable.addLocalSecondaryIndex({
      indexName: "Todos-Year-Index",
      sortKey: {
        name: "year",
        type: dynamodb.AttributeType.NUMBER
      }
    })

    todosTable.addGlobalSecondaryIndex({
      indexName: "Todos-Title-Year-Index",
      partitionKey: {
        name: "year",
        type: dynamodb.AttributeType.NUMBER
      },
      sortKey: {
        name: "title",
        type: dynamodb.AttributeType.STRING
      }
    })

    const TableStreamHandler = new lambda.Function(this, 'StreamHandlerDyanmodb', {
      code: lambda.Code.fromAsset('functions/TableStreamHandler'),
      handler: 'index.handler',
      functionName: 'TableStreamHandler',
      runtime: lambda.Runtime.NODEJS_16_X,
    });

    TableStreamHandler.addEventSource(new DynamoEventSource(todosTable, {
      startingPosition: lambda.StartingPosition.LATEST,
    }));


    todosTable.grantFullAccess(todosLambda);
    todosLambda.addEnvironment('TODOS_TABLE', todosTable.tableName);
    todosLambda.addEnvironment('TODOS_TITLE_YEAR_INDEX', "Todos-Title-Year-Index");
    todosLambda.addEnvironment('TODOS_YEAR_INDEX', "Todos-Year-Index");

    // Add lambda as data source
    const lambdaDs = appsyncApi.addLambdaDataSource('lambdaDatasource', todosLambda);

    // Add resolvers
    lambdaDs.createResolver({
      typeName: 'Query',
      fieldName: 'getTodos',
    });

    lambdaDs.createResolver({
      typeName: 'Query',
      fieldName: 'getTodoByUsername',
    });

    lambdaDs.createResolver({
      typeName: 'Query',
      fieldName: 'getTodoByUsernameAndTitle',
    });

    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "getTodoByUsernameAndId",
    })

    lambdaDs.createResolver({
      typeName: 'Query',
      fieldName: 'getTodosByUsernameAndYear',
    });
    lambdaDs.createResolver({
      typeName: 'Query',
      fieldName: 'getTodosByYearAndTitle',
    });

    lambdaDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'addTodo',
    });

    lambdaDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'updateTodo',
    });

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "deleteTodo"
    })
  }
}
