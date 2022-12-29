import { Stack, StackProps, aws_lambda as lambda, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from '@aws-cdk/aws-appsync-alpha'
import { aws_dynamodb as dynamodb} from 'aws-cdk-lib'

export class AppsyncDynamodbLambdaDataSourceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const appsyncApi = new appsync.GraphqlApi(this, 'api', {
      name: 'appsync-dynodb-lambda-api',
      schema: appsync.Schema.fromAsset('schema/schema.graphql')
    })

    const todosLambda = new lambda.Function(this, 'AppsyncTodoHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'main.handler',
      code: lambda.Code.fromAsset('functions'),
      memorySize: 1024
    });

    const lambdaDs = appsyncApi.addLambdaDataSource('lambdaDatasource', todosLambda);

    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "getTodos"
    });

    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "getTodoById"
    });


    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "addTodo"
    });

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "deleteTodo"
    });

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "updateTodo"
    });

    const todosTable = new dynamodb.Table(this, 'TodosTable', {
      
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    removalPolicy:RemovalPolicy.DESTROY
    });
    
    

    todosTable.grantFullAccess(todosLambda)
    todosLambda.addEnvironment('TODOS_TABLE', todosTable.tableName);

  }
}
