import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as appsync from '@aws-cdk/aws-appsync-alpha'

export class AppsyncStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

 

    const appsyncApi = new appsync.GraphqlApi(this, 'api', {
      name: 'test Api',
      schema: appsync.Schema.fromAsset('schema/schema.graphql')
    })


    const lambdaFnAppsync = new cdk.aws_lambda.Function(this, "appsynctestLambda", {
      functionName: `appsynctestlambda`,
      runtime: cdk.aws_lambda.Runtime.NODEJS_14_X,
      code: cdk.aws_lambda.Code.fromAsset("lambda"),
      handler: "index.handler",
    })

    const DataSource = appsyncApi.addLambdaDataSource('ds', lambdaFnAppsync);


    DataSource.createResolver({
      typeName: "Mutation",
      fieldName: "addTodo",
    });


    DataSource.createResolver({
      typeName: "Query",
      fieldName: "getTodos",
    });


  }
}
