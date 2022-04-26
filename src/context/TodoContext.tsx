import React, { createContext, ReactNode, useContext, useState } from "react";
import socket from "../socket";
import { LayoutContext } from "./LayoutContext";
interface TodoContextProps {
    children: ReactNode;
}

interface TodoContextDefault {
    todo: TodoValueInitializer;
    todos: TodoValueInitializer[];
    changeTodoValue: (todo: TodoValueInitializer) => void;
    postTodo: (todo: TodoValueInitializer, uid: string) => void;
    getAllTodos: () => void;
    changeTodoList: (todos: TodoValueInitializer[]) => void;
}

export interface TodoValueInitializer {
    username: string;
    todo: string;
}

const todoContextDefaultValue: TodoContextDefault = {
    todo: { username: "", todo: "" },
    todos: [],
    changeTodoValue: () => null,
    postTodo: () => null,
    getAllTodos: () => null,
    changeTodoList: () => null,
};

export const TodoContext = createContext<TodoContextDefault>(todoContextDefaultValue);

const TodoContextProvider = ({ children }: TodoContextProps) => {
    const { postNotification } = useContext(LayoutContext);
    const [todo, setTodo] = useState<TodoValueInitializer>({
        username: "",
        todo: "",
    });

    const [todos, setTodos] = useState<TodoValueInitializer[]>([]);

    const changeTodoValue = (todo: TodoValueInitializer) => {
        setTodo(todo);
    };

    const postTodo = (todo: TodoValueInitializer, uid: string) => {
        setTodos([...todos, todo]);
        socket.emit("test:post", { todo: todo.todo, username: todo.username, uid, to: "04rVlrUUjG" });
        postNotification("Hello world", "12314", "04rVlrUUjG", "Dinh Khoi", "newRequest");
    };

    const getAllTodos = () => {
        socket.emit("test:load");
    };

    const changeTodoList = (todos: TodoValueInitializer[]) => {
        setTodos(todos);
    };

    const todoContextValue: TodoContextDefault = {
        todo,
        todos,
        changeTodoValue,
        postTodo,
        getAllTodos,
        changeTodoList,
    };
    return <TodoContext.Provider value={todoContextValue}>{children}</TodoContext.Provider>;
};

export default TodoContextProvider;
