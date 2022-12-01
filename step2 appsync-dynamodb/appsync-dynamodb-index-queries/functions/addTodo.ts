const docClient = new DocumentClient();
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Todo } from './types';

async function addTodo(todo: Todo) {
    const params: DocumentClient.PutItemInput = {
        TableName: process.env.TODOS_TABLE!,
        Item: todo
    }
    try {
        await docClient.put(params).promise();
        return todo;
    } catch (err) {
        console.log('DynamoDB error: ', err);
        return null;
    }
}

export default addTodo;