import addTodo from './addTodo';
import getTodos from './getTodos';
import updateTodo from "./updateTodo";

export type Todo = {
    id: string;
    title: string;
    done: boolean;
}

export type User = {
    id: string;
    title: string;
    done: boolean;
}

import { AppSyncResolverEvent } from 'aws-lambda';

export async function handler(event: AppSyncResolverEvent<any>)  {
    console.log("event ", event);
    switch (event.info.fieldName) {
        case "addTodo":
            return addTodo(event.arguments.todo);
        case "getTodos":
            return getTodos();
        case "updateTodo":
            return updateTodo(event.arguments);
        default:
            return null;
    }
}