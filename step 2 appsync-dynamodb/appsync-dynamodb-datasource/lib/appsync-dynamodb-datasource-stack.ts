import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from '@aws-cdk/aws-appsync-alpha'
import { aws_dynamodb as dynamodb } from 'aws-cdk-lib'

export class AppsyncDynamodbDatasourceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const appsyncApi = new appsync.GraphqlApi(this, 'api', {
      name: 'appsync-dynodb-datasource-api',
      schema: appsync.Schema.fromAsset('schema/schema.gql')
    })

    const dynamoDBTable = new dynamodb.Table(this, 'NotesTable', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
    });

    ///Attaching Datasource to api
    const db_data_source = appsyncApi.addDynamoDbDataSource('DataSources', dynamoDBTable);

    db_data_source.createResolver({
      typeName: "Mutation",
      fieldName: "createNote",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(
        appsync.PrimaryKey.partition('id').auto(),        ///Create an autoID for your primary Key Id
        appsync.Values.projecting()                       ///Add Remaining input values
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()   ////Mapping template for a single result item from DynamoDB.
    })

    db_data_source.createResolver({
      typeName: "Query",
      fieldName: "notes",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),      ///Mapping template to scan a DynamoDB table to fetch all entries.
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList(),    ////Mapping template for a result list from DynamoDB.
    })

    db_data_source.createResolver({
      typeName: "Mutation",
      fieldName: "deleteNote",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbDeleteItem('id', 'id'),   ///Mapping template to delete a single item from a DynamoDB table.
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()             ////Mapping template for a single result item from DynamoDB.
    });

    db_data_source.createResolver({
      typeName: "Mutation",
      fieldName: "updateNote",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(                ///Mapping template to save a single item to a DynamoDB table.
        appsync.PrimaryKey.partition('id').is('id'),                                  ///Where id is input ID
        appsync.Values.projecting()),                                                 ///Add Remaining input values
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()     ////Mapping template for a single result item from DynamoDB.
    });

  }
}
