import addTodo from './addTodo';
import deleteTodo from './deleteTodo';
import getTodos from './getTodos';
import updateTodo from './updateTodo';
import Todo from './Todo';
import getTodoById from './getTodoById';

type AppSyncEvent = {
    info: {
        fieldName: string
    },
    arguments: {
        todoId: string,
        todo: Todo
    }
}

exports.handler = async (event: AppSyncEvent) => {

    console.log('event====>',event)
    switch (event.info.fieldName) {

        case "addTodo":
            return await addTodo(event.arguments.todo);
        case "getTodos":
            return await getTodos();
        case "getTodoById":
            return await getTodoById(event.arguments.todoId);
        case "deleteTodo":
            return await deleteTodo(event.arguments.todoId);
        case "updateTodo":
            return await updateTodo(event.arguments.todo);
        default:
            return null;
    }
}