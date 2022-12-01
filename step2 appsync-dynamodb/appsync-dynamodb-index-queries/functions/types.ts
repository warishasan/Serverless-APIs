export type Todo = {
  username: string;
  year: number;
  id: string;
  title: string;
  done: boolean;
}

export type UpdateTodoInput = {
  username: string
  id: string
  title: string
  done: boolean
  year: Number
}


export type TodoByUsernameAndTitleInput = {
  username: string
  title: string
}

export type TodoByUsernameAndIdInput = {
  username: string
  id: string
}

export type TodosByUsernameAndYearInput = {
  username: string
  year: number
}

export type TodosByYearAndTitleInput = {
  title: string
  year: number
}

export type deleteTodoInput = {
  username: string
  title: string
}
