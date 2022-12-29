import { Stack, StackProps, aws_lambda as lambda, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from '@aws-cdk/aws-appsync-alpha'
import { aws_dynamodb as dynamodb } from 'aws-cdk-lib'
import { ApiConstruct } from './apiConstruct';

export class CustomConstructs extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);


    const apiConstruct = new ApiConstruct(this, 'apiConstruct', { apiName: 'customApi' })


    const todosTable = new dynamodb.Table(this, 'TodosTable', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
    });

    todosTable.grantFullAccess(apiConstruct.apiLambda)
    apiConstruct.apiLambda.addEnvironment('TODOS_TABLE', todosTable.tableName);

  }
}
