import { ADD_TODO, DELETE_TODO, EDIT_TODO, EDIT_STATUS, RESET_TODO_LIST } from "./actionTypes";

export const addTodo = (id, task, status) => ({
  type: ADD_TODO,
  payload: {
    id,
    task,
    status
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

export const resetTodoList = () => ({
  type: RESET_TODO_LIST
});
