import { DocumentClient } from 'aws-sdk/clients/dynamodb';
const docClient = new DocumentClient({ apiVersion: '2012-08-10' });

export const getTodoByUsername = async (username: string) => {
    const params: DocumentClient.QueryInput = {
        TableName: process.env.TODOS_TABLE!,
        KeyConditionExpression: "username = :username",
        ExpressionAttributeValues: {
            ":username": username
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