
type Todo = {
    id: string;
    title: string;
    done: boolean;
}

 function addTodo(todo: Todo):Todo {
    

    console.log('mutation started')

    return todo
}

export default addTodo;