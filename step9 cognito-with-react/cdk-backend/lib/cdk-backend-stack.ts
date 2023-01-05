import { Stack, StackProps, CfnOutput, aws_lambda } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as appsync from '@aws-cdk/aws-appsync-alpha'

export class CdkBackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const userPool = new cognito.UserPool(this, "userPool-Amplify", {
      selfSignUpEnabled: true,
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      userVerification: {
        emailStyle: cognito.VerificationEmailStyle.CODE,
      },
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
        phoneNumber: {
          required: true,
          mutable: true
        },
      },
    })

    const userPoolClient = new cognito.UserPoolClient(this, "userPoolClient-Amplify", {
      userPool,
    })

    const appsyncApi = new appsync.GraphqlApi(this, 'api', {
      name: 'cognito-appsync-Api',
      schema: appsync.Schema.fromAsset('schema/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool: userPool
          }
        }
      }
    })

    const lambdaFnAppsync = new aws_lambda.Function(this, "appsynctestLambda", {
      functionName: `appsynctestlambda`,
      runtime: aws_lambda.Runtime.NODEJS_14_X,
      code: aws_lambda.Code.fromAsset("lambda"),
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

    DataSource.createResolver({
      typeName: "Mutation",
      fieldName: "updateTodo",
    });


    new CfnOutput(this, "UserPoolId", {
      value: userPool.userPoolId,
    })

    new CfnOutput(this, "UserPoolClientId", {
      value: userPoolClient.userPoolClientId,
    })

  }
}
