import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { UpdateTodoInput } from "./types";

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

type Params = {
    TableName: string | undefined,
    Key: string | {},
    ConditionExpression: any,
    ExpressionAttributeValues: any,
    ExpressionAttributeNames: any,
    UpdateExpression: string,
    ReturnValues: string
}

async function updateTodo(todo: any) {
    let params: Params = {
        TableName: process.env.TODOS_TABLE,
        Key: {
            username: todo.username,
            title: todo.title
        },
        ConditionExpression: "#id = :id",
        ExpressionAttributeValues: {},
        ExpressionAttributeNames: {},
        UpdateExpression: "",
        ReturnValues: "ALL_NEW"
    };
    let prefix = "set ";
    let attributes = Object.keys(todo);

    for (let i = 0; i < attributes.length; i++) {                                                  //{
        let attribute = attributes[i];                                                             //   TableName: 'process.env.TODOS_TABLE', 
        if (attribute !== "title" && attribute !== "username" && attribute !== "id") {             //   Key: {username: todo.username, title: todo.title },
            params["UpdateExpression"] += prefix + "#" + attribute + " = :" + attribute;           //   UpdateExpression: 'set #year = :year, #done = :done',
            params["ExpressionAttributeNames"]["#" + attribute] = attribute;                       //   ExpressionAttributeNames: { '#year': 'year', '#done': 'done' },
            params["ExpressionAttributeValues"][":" + attribute] = todo[attribute];                //   ExpressionAttributeValues: { ':year': 2022, ':done': true },
            prefix = ", ";                                                                         //   ReturnValues: 'ALL_NEW' //  } 
        }
    }
    params["ExpressionAttributeNames"]["#" + "id"] = "id";
    params["ExpressionAttributeValues"][":" + "id"] = todo["id"].toString();

    try {
        const updatedTodo = await docClient.update(params).promise()
        return updatedTodo.Attributes
    } catch (err) {
        console.log('DynamoDB error: ', err)
        return null
    }
}

export default updateTodo;