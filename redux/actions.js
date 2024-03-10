import { ADD_TODO, DELETE_TODO, EDIT_TODO, EDIT_STATUS } from "./actionTypes";

//let nextTodoId = 0;

export const addTodo = (id, task) => ({
  type: ADD_TODO,
  payload: {
    id,
    task,
    status: 'due'
  }
});

export const editTodo = (id, task) => ({
  type: EDIT_TODO,
  payload: {
    id: id,
    task: task,
  }
});

export const editStatus = (id, status) => ({
  type: EDIT_STATUS,
  payload: {
    id: id,
    status: status,
  }
});

export const deleteTodo = id => ({
  type: DELETE_TODO,
  payload: {
    id
  }
});


