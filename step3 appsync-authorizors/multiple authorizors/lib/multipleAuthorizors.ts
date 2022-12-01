import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from '@aws-cdk/aws-appsync-alpha';
import { aws_dynamodb as dynamodb, aws_lambda as lambda, Duration } from 'aws-cdk-lib'
import { AuthorizationType } from '@aws-cdk/aws-appsync-alpha';

export class multipleAuthorizors extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);



    const lambdaAuthorizor = new lambda.Function(this, 'AppsyncLambdaAuthorizor', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambdaAuthorizor'),
      memorySize: 1024
    });



    // Create an appSync API
    const appsyncApi = new appsync.GraphqlApi(this, 'api', {
      name: 'multiple-auth-api',
      schema: appsync.Schema.fromAsset('schema/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization:{
        authorizationType:AuthorizationType.LAMBDA,lambdaAuthorizerConfig:{handler: lambdaAuthorizor,resultsCacheTtl:cdk.Duration.seconds(0)}
        },
        additionalAuthorizationModes: [{authorizationType:AuthorizationType.API_KEY,   apiKeyConfig: {
          expires: cdk.Expiration.after(cdk.Duration.days(365))
        }}],
      }
    })


    const todosLambda = new lambda.Function(this, 'AppsyncTodoHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'main.handler',
      code: lambda.Code.fromAsset('functions'),
      memorySize: 1024
    });


    const todosTable = new dynamodb.Table(this, 'TodosTable', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
    });

    todosTable.grantFullAccess(todosLambda)
    todosLambda.addEnvironment('TODOS_TABLE', todosTable.tableName);


    // Add lambda as data source
    const lambdaDs = appsyncApi.addLambdaDataSource('lambdaDatasource', todosLambda);

    // Add resolvers
    lambdaDs.createResolver({
      typeName: 'Query',
      fieldName: 'getTodos',
    });
    lambdaDs.createResolver({
      typeName: 'Query',
      fieldName: 'getTodoById',
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
      typeName: 'Mutation',
      fieldName: 'deleteTodo',
    });
  }
}

