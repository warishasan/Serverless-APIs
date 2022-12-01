const docClient = new DocumentClient();
import { TodoByUsernameAndTitleInput } from "./types";
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export const getTodoByUsernameAndTitle = async (input: TodoByUsernameAndTitleInput) => {
    const { title, username } = input;
    const params: DocumentClient.QueryInput = {
        TableName: process.env.TODOS_TABLE!,
        KeyConditionExpression: '#username = :username and begins_with(#title, :title)',
        ExpressionAttributeNames: {
            "#username": "username",
            "#title": 'title'
        },
        ExpressionAttributeValues: {
            ':username': username,
            ':title': title
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