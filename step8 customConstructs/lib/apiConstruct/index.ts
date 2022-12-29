import * as cdk from 'aws-cdk-lib';
import * as appsync from '@aws-cdk/aws-appsync-alpha'
import { Construct } from 'constructs';
import {  aws_lambda as lambda } from 'aws-cdk-lib';


interface props {
   apiName:string
}

export class ApiConstruct extends Construct {

    public readonly apiLambda: cdk.aws_lambda.Function;

    constructor(scope: Construct, id: string, props: props) {
        super(scope, id);

        const appsyncApi = new appsync.GraphqlApi(this, 'api', {
            name: props.apiName,
            schema: appsync.Schema.fromAsset('schema/schema.graphql')
        })

        const todosLambda = new lambda.Function(this, 'customConstructTodo', {
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
    }
}