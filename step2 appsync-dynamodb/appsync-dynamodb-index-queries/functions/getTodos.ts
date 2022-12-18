import { DocumentClient } from "aws-sdk/clients/dynamodb";
const docClient = new DocumentClient();

async function getTodos() {
    const params : DocumentClient.ScanInput= {
        TableName: process.env.TODOS_TABLE!,
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