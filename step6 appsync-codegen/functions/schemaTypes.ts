export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Mutation = {
  __typename?: 'Mutation';
  addTodo?: Maybe<Todo>;
  deleteTodo?: Maybe<Scalars['String']>;
  updateTodo?: Maybe<Todo>;
};


export type MutationAddTodoArgs = {
  todo: TodoInput;
};


export type MutationDeleteTodoArgs = {
  todoId: Scalars['String'];
};


export type MutationUpdateTodoArgs = {
  todo: UpdateTodoInput;
};

export type Query = {
  __typename?: 'Query';
  getTodoById?: Maybe<Todo>;
  getTodos?: Maybe<Array<Maybe<Todo>>>;
};


export type QueryGetTodoByIdArgs = {
  todoId: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  onAddTodo?: Maybe<Todo>;
};


export type SubscriptionOnAddTodoArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type Todo = {
  __typename?: 'Todo';
  done: Scalars['Boolean'];
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type TodoInput = {
  done: Scalars['Boolean'];
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type UpdateTodoInput = {
  done?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  title?: InputMaybe<Scalars['String']>;
};
