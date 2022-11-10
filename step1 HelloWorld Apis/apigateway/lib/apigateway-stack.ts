import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class ApigatewayStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    

    const lambdaFnRestApi = new cdk.aws_lambda.Function(this, "restapitestLambda", {
      functionName: `restapitestlambda`,
      runtime: cdk.aws_lambda.Runtime.NODEJS_14_X,
      code: cdk.aws_lambda.Code.fromAsset("lambda"),
      handler: "index.handler",
    })


// uncomment the proxy parameter and assign resources and methods to restrict calls.

   const api = new cdk.aws_apigateway.LambdaRestApi(this, "RestApi", {
      handler: lambdaFnRestApi,
      proxy:false
    });



    const items = api.root.addResource('items');
    items.addMethod('GET');  // GET /items
    items.addMethod('POST'); // POST /items

    const item = items.addResource('{item}');
    item.addMethod('GET');   // GET /items/{item}

  }
}
