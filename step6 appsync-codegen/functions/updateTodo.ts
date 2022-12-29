import { Todo, UpdateTodoInput } from "./schemaTypes";

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

type Params = {
    TableName: string | undefined,
    Key: string | {},
    ExpressionAttributeValues: any,
    ExpressionAttributeNames: any,
    UpdateExpression: string,
    ReturnValues: string
}

async function updateTodo(todo: UpdateTodoInput):Promise<Todo | null> {
    

    let params: Params = {
        TableName: process.env.TODOS_TABLE,
        Key: {
            id: todo.id
        },
        ExpressionAttributeValues: {},
        ExpressionAttributeNames: {},
        UpdateExpression: "",
        ReturnValues: "ALL_NEW"
    };
    let prefix = "set ";
    let attributes = Object.keys(todo);

    for (let i = 0; i < attributes.length; i++) {                                                  //{
        let attribute = attributes[i];                                                             //   TableName: 'process.env.TODOS_TABLE', 
        if (attribute !== "id") {                                                                  //    Key: { id: '1' },
            params["UpdateExpression"] += prefix + "#" + attribute + " = :" + attribute;           //   UpdateExpression: 'set #title = :title, #done = :done',
            params["ExpressionAttributeNames"]["#" + attribute] = attribute;                       //   ExpressionAttributeNames: { '#title': 'title', '#done': 'done' },
            params["ExpressionAttributeValues"][":" + attribute] = todo[attribute as keyof UpdateTodoInput] ;                //   ExpressionAttributeValues: { ':title': '2nd todo', ':done': true },
            prefix = ", ";                                                                         //   ReturnValues: 'ALL_NEW' //  } 
        }
    }


    try {
        const updatedTodo = await docClient.update(params).promise()
        return updatedTodo.Attributes
    } catch (err) {
        console.log('DynamoDB error: ', err)
        return null
    }
}

export default updateTodo;