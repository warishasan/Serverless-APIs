import { DocumentClient } from 'aws-sdk/clients/dynamodb';
const docClient = new DocumentClient({ apiVersion: '2012-08-10' });
import { TodoByUsernameAndIdInput } from "./types";

export const getTodoByUsernameAndId = async (input: TodoByUsernameAndIdInput) => {
    const { id, username } = input;
    const params: DocumentClient.QueryInput = {
        TableName: process.env.TODOS_TABLE!,
        KeyConditionExpression: "username = :username",
        FilterExpression: "id = :id",
        ExpressionAttributeValues: {
            ":username": username,
            ":id": id,
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