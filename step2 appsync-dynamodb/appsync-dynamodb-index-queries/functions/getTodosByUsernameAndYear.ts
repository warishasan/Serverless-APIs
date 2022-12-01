import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { TodosByUsernameAndYearInput } from "./types";
const docClient = new DocumentClient();

export const getTodosByUsernameAndYear = async (input: TodosByUsernameAndYearInput) => {
    const { year, username } = input;
    const params: DocumentClient.QueryInput = {
        TableName: process.env.TODOS_TABLE!,
        IndexName: process.env.TODOS_YEAR_INDEX!,
        KeyConditionExpression: '#username = :username and #year = :year',
        ExpressionAttributeNames: {
            "#username": "username",
            "#year": 'year'
        },
        ExpressionAttributeValues: {
            ':username': username,
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