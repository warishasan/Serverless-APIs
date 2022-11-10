import addTodo from './addTodo';
import getTodos from './getTodos';


import { AppSyncResolverEvent } from 'aws-lambda';

export async function handler(event: AppSyncResolverEvent<any>)  {

    switch (event.info.fieldName) {
        case "addTodo":
            return addTodo(event.arguments.todo);
        case "getTodos":
            return getTodos();
        default:
            return null;
    }
}