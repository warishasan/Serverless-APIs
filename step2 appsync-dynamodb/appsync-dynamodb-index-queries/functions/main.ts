import addTodo from './addTodo';
import deleteTodo from './deleteTodo';
import getTodos from './getTodos';
import updateTodo from './updateTodo';
import { Todo } from './types';
import { getTodoByUsername } from './getTodoByUsername';
import { getTodoByUsernameAndTitle } from './getTodoByUsernameAndTitle';
import { getTodoByUsernameAndId } from './getTodoByUsernameAndId';
import { getTodosByUsernameAndYear } from './getTodosByUsernameAndYear';
import { getTodosByYearAndTitle } from './getTodosByYearAndTitle';

type AppSyncEvent = {
    info: {
        fieldName: string
    },
    arguments: {
        todo: Todo,
        username: string,
        input: any
    }
}

exports.handler = async (event: AppSyncEvent) => {
    switch (event.info.fieldName) {
        case "addTodo":
            return await addTodo(event.arguments.todo);
        case "getTodos":
            return await getTodos();
        case "getTodoByUsername":
            return await getTodoByUsername(event.arguments.username);
        case "getTodoByUsernameAndTitle":
            return await getTodoByUsernameAndTitle(event.arguments.input);
        case "getTodoByUsernameAndId":
            return await getTodoByUsernameAndId(event.arguments.input);
        case "getTodosByUsernameAndYear":
            return await getTodosByUsernameAndYear(event.arguments.input);
        case "getTodosByYearAndTitle":
            return await getTodosByYearAndTitle(event.arguments.input);
        case "deleteTodo":
            return await deleteTodo(event.arguments.input);
        case "updateTodo":
            return await updateTodo(event.arguments.todo);
        default:
            return null;
    }
}