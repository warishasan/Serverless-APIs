import { Stack, StackProps, aws_lambda as lambda, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from '@aws-cdk/aws-appsync-alpha'
import { aws_dynamodb as dynamodb} from 'aws-cdk-lib'

export class LambdaLayerExample extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const appsyncApi = new appsync.GraphqlApi(this, 'api', {
      name: 'lambdaLayerApi',
      schema: appsync.Schema.fromAsset('schema/schema.graphql')
    })

    const apiDependencies = new lambda.LayerVersion(
      this,
      "apiDependencies",
      {
        code: lambda.Code.fromAsset("lambdaLayers/apiDependencies"),

      }
    );

    const todosLambda = new lambda.Function(this, 'AppsyncTodoHandlerLambdalayer', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'main.handler',
      code: lambda.Code.fromAsset('functions'),
      memorySize: 1024,
      layers: [apiDependencies],
    });

    const lambdaDs = appsyncApi.addLambdaDataSource('lambdaDatasourceLambdalayer', todosLambda);

    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "generateUUID"
    });

    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "generateCustomId"
    });


  }
}
