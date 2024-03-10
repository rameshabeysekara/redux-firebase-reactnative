import {
  ADD_TODO,
  EDIT_TODO,
  DELETE_TODO,
  EDIT_STATUS,
  RESET_TODO_LIST,
} from "../actionTypes";

const initialState = {
  todo_list: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_TODO: {
      const { id, task, status } = action.payload;
      return {
        ...state,
        todo_list: [...state.todo_list, { id, task, status }],
      };
    }
    case EDIT_TODO: {
      const { id, task } = action.payload;
      const todoIndex = state.todo_list.findIndex((todo) => todo.id === id);
      if (todoIndex !== -1) {
        const updatedTodoList = [...state.todo_list];
        updatedTodoList[todoIndex] = {
          ...updatedTodoList[todoIndex],
          id,
          task,
        };
        return {
          ...state,
          todo_list: updatedTodoList,
        };
      }
      return state;
    }
    case EDIT_STATUS: {
      const { id, status } = action.payload;
      const todoIndex = state.todo_list.findIndex((todo) => todo.id === id);
      if (todoIndex !== -1) {
        const updatedTodoList = [...state.todo_list];
        updatedTodoList[todoIndex] = {
          ...updatedTodoList[todoIndex],
          id,
          status,
        };
        return {
          ...state,
          todo_list: updatedTodoList,
        };
      }
      return state;
    }
    case DELETE_TODO: {
      const { id } = action.payload;
      return {
        ...state,
        todo_list: state.todo_list.filter((todo) => todo.id != id),
      };
    }
    case RESET_TODO_LIST: {
      return {
        ...state,
        todo_list: [],
      };
    }
    default:
      return state;
  }
}
