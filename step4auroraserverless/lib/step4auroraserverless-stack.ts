import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as apigtw from 'aws-cdk-lib/aws-apigateway';
import { Stack, StackProps, aws_lambda as lambda } from 'aws-cdk-lib';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Step4AuroraserverlessStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const vpc = new ec2.Vpc(this, 'VPC', {
      // cidr: '10.0.0.0/16',
      subnetConfiguration: [{ name: 'egress', subnetType: ec2.SubnetType.PUBLIC }], // only one subnet is needed
      natGateways: 0 // disable NAT gateways
    });

    const dbSecurityGroup = new ec2.SecurityGroup(this, 'DbSecurityGroup', {
      vpc: vpc, // use the vpc created above
      allowAllOutbound: true // allow outbound traffic to anywhere
    });

    // allow inbound traffic from anywhere to the db
    dbSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(5432), // allow inbound traffic on port 5432 (postgres)
      'allow inbound traffic from anywhere to the db on port 5432'
    );

    // create a db cluster
    const dbCluster = new rds.DatabaseCluster(this, 'DbCluster', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_13_6
      }),
      instances: 1,
      // defaultDatabaseName: "todo",
      instanceProps: {
        vpc: vpc,
        instanceType: new ec2.InstanceType('serverless'),
        autoMinorVersionUpgrade: true,
        publiclyAccessible: true,
        securityGroups: [dbSecurityGroup],
        vpcSubnets: vpc.selectSubnets({
          subnetType: ec2.SubnetType.PUBLIC // use the public subnet created above for the db
        })
      },
      port: 5432 // use port 5432 instead of 3306
    });

    const writerLambda = new lambda.Function(this, 'writerLambdaHandler', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'addDB.handler',
      code: lambda.Code.fromAsset('functions'),
      memorySize: 1024,
      environment: {
        databaseSecretArn: dbCluster.secret?.secretArn || '', // pass the secret arn to the lambda function
      },
    });

    const addTables = new lambda.Function(this, 'addTables', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'addTables.handler',
      code: lambda.Code.fromAsset('functions'),
      memorySize: 1024,
      environment: {
        databaseSecretArn: dbCluster.secret?.secretArn || '', // pass the secret arn to the lambda function
      },
    });

    const insertDatas = new lambda.Function(this, 'insertDatas', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'insertData.handler',
      code: lambda.Code.fromAsset('functions'),
      memorySize: 1024,
      environment: {
        databaseSecretArn: dbCluster.secret?.secretArn || '', // pass the secret arn to the lambda function
      },
    });

    const getTables = new lambda.Function(this, 'getTables', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'getData.handler',
      code: lambda.Code.fromAsset('functions'),
      memorySize: 1024,
      environment: {
        databaseSecretArn: dbCluster.secret?.secretArn || '', // pass the secret arn to the lambda function
      },
    });


    dbCluster.secret?.grantRead(addTables);
    dbCluster.secret?.grantRead(writerLambda);
    dbCluster.secret?.grantRead(insertDatas);
    dbCluster.secret?.grantRead(getTables);

    // create a lambda rest api
    const api = new apigtw.RestApi(this, 'Api', {
      defaultCorsPreflightOptions: {
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
        ],
        allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowCredentials: true,
        allowOrigins: ['*'],
      }
    });

    const addDBRoute = api.root.addResource('addDB');
    addDBRoute.addMethod('GET', new apigtw.LambdaIntegration(writerLambda, {proxy: true}));

    const addTableRoute = api.root.addResource('addTables');
    addTableRoute.addMethod('GET', new apigtw.LambdaIntegration(addTables, {proxy: true}));

    const getTableRoute = api.root.addResource('getTable');
    getTableRoute.addMethod('GET', new apigtw.LambdaIntegration(getTables, {proxy: true}));

    const insertDataRoute = api.root.addResource('insertData');
    const insertDataSingle = insertDataRoute.addResource('{item}');
    insertDataSingle.addMethod('GET', new apigtw.LambdaIntegration(insertDatas, {proxy: true}));

    // create a cfn output for the api url
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url
    });

  }
}
