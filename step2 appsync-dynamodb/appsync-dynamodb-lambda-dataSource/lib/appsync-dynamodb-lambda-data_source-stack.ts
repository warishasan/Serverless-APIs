import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from '@aws-cdk/aws-appsync-alpha';
import { aws_dynamodb as dynamodb, aws_lambda as lambda } from 'aws-cdk-lib'

export class AppsyncDynamodbLambdaDataSourceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an appSync API
    const appsyncApi = new appsync.GraphqlApi(this, 'api', {
      name: 'appsync-dynodb-lambda-api',
      schema: appsync.Schema.fromAsset('schema/schema.graphql')
    })

    // Create a new lambda function
    // const lambdaFnAppsync = new cdk.aws_lambda.Function(
    //   this,
    //   'appsynctestLambda',
    //   {
    //     functionName: `appsynctestlambda`,
    //     runtime: cdk.aws_lambda.Runtime.NODEJS_14_X,
    //     code: cdk.aws_lambda.Code.fromAsset('functions'),
    //     handler: 'main.handler',
    //   }
    // );

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
      typeName: 'Mutation',
      fieldName: 'addTodo',
    });
    lambdaDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'updateTodo',
    });
  }
}


// import { Stack, StackProps, aws_lambda as lambda } from 'aws-cdk-lib';
// import { Construct } from 'constructs';
// import * as appsync from '@aws-cdk/aws-appsync-alpha'
// import { aws_dynamodb as dynamodb } from 'aws-cdk-lib'

// export class AppsyncDynamodbLambdaDataSourceStack extends Stack {
//   constructor(scope: Construct, id: string, props?: StackProps) {
//     super(scope, id, props);

//     const appsyncApi = new appsync.GraphqlApi(this, 'api', {
//       name: 'appsync-dynodb-lambda-api',
//       schema: appsync.Schema.fromAsset('schema/schema.graphql')
//     })

//     const todosLambda = new lambda.Function(this, 'AppsyncTodoHandler', {
//       runtime: lambda.Runtime.NODEJS_12_X,
//       handler: 'main.handler',
//       code: lambda.Code.fromAsset('functions'),
//       memorySize: 1024
//     });

//     const lambdaDs = appsyncApi.addLambdaDataSource('lambdaDatasource', todosLambda);

//     lambdaDs.createResolver({
//       typeName: "Query",
//       fieldName: "getTodos"
//     });

//     lambdaDs.createResolver({
//       typeName: "Query",
//       fieldName: "getTodoById"
//     });


//     lambdaDs.createResolver({
//       typeName: "Mutation",
//       fieldName: "addTodo"
//     });

//     lambdaDs.createResolver({
//       typeName: "Mutation",
//       fieldName: "deleteTodo"
//     });

//     lambdaDs.createResolver({
//       typeName: "Mutation",
//       fieldName: "updateTodo"
//     });

//     const todosTable = new dynamodb.Table(this, 'TodosTable', {
//       partitionKey: {
//         name: 'id',
//         type: dynamodb.AttributeType.STRING,
//       },
//       billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
//     });

//     todosTable.grantFullAccess(todosLambda)
//     todosLambda.addEnvironment('TODOS_TABLE', todosTable.tableName);

//   }
// }
