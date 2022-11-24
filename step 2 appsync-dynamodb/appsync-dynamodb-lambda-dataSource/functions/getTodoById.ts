import AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient();

async function getTodoById(todoId: string) {
    const params = {
        TableName: process.env.TODOS_TABLE as string,
        Key: { id: todoId },
    }
    try {
        const { Item } = await docClient.get(params).promise()
        return Item
    } catch (err) {
        console.log('DynamoDB error: ', err)
        return null
    }
}
export default getTodoById;