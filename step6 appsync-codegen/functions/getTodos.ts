import { Todo } from "./schemaTypes";

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function getTodos():Promise<Todo[]|null> {
    const params = {
        TableName: process.env.TODOS_TABLE,
    }
    try {
        const data = await docClient.scan(params).promise()
        return data.Items
    } catch (err) {
        console.log('DynamoDB error: ', err)
        return null
    }
}

export default getTodos;

// const params = {
//     TableName: 'process.env.TODOS_TABLE',
//     FilterExpression : "begins_with(#title, :title)",
//     ExpressionAttributeNames: { "#title": "title" },
//     ExpressionAttributeValues: {
//         ':title':"todo"
//     }
// };