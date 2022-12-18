import { DocumentClient } from 'aws-sdk/clients/dynamodb';
const docClient = new DocumentClient({ apiVersion: '2012-08-10' });
import { TodosByYearAndTitleInput } from "./types";

export const getTodosByYearAndTitle = async (input: TodosByYearAndTitleInput) => {
    const { year, title } = input;
    const params: DocumentClient.QueryInput = {
        TableName: process.env.TODOS_TABLE!,
        IndexName: process.env.TODOS_TITLE_YEAR_INDEX!,
        KeyConditionExpression: '#year = :year and begins_with(#title, :title)',
        ExpressionAttributeNames: {
            "#title": "title",
            "#year": 'year'
        },
        ExpressionAttributeValues: {
            ':title': title,
            ':year': year
        }
    }
    try {
        const { Items } = await docClient.query(params).promise()
        return Items
    } catch (err) {
        console.log('DynamoDB error: ', err)
        return null
    }

}