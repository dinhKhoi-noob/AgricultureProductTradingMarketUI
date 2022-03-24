import React, { createContext, ReactNode, useReducer, useState } from "react";
import { chatReducer } from "../reducer/chatReducer";
import socket from "../socket";

export interface MessageValueInitializer {
    content: string;
    self: boolean;
    uid: string;
}

export interface UserValueInitializer {
    username: string;
    uid: string;
}

interface ChatContextProps {
    children: ReactNode;
}

interface ChatContextDefault {
    users: UserValueInitializer[];
    currentTargetUser: UserValueInitializer;
    loadUser: () => void;
    addUser: (user: UserValueInitializer) => void;
    changeCurrentTargetUser: (user: UserValueInitializer) => void;
    addNewMessage: (message: MessageValueInitializer) => void;
    hasNewMessage: (uid: string) => void;
}

export const ChatContext = createContext<ChatContextDefault>({
    users: [],
    currentTargetUser: {
        username: "",
        uid: "",
    },
    loadUser: () => null,
    addUser: () => null,
    changeCurrentTargetUser: () => null,
    addNewMessage: () => null,
    hasNewMessage: () => null,
});

const ChatContextProvier = ({ children }: ChatContextProps) => {
    const [chatReducerState, dispatch] = useReducer(chatReducer, {
        user: [],
    });

    const [currentTargetUser, setCurrentTargetUser] = useState<UserValueInitializer>({
        uid: "",
        username: "",
    });

    const loadUser = () => {
        const currentUsers: UserValueInitializer[] = [];
        socket.on("users", users => {
            users.forEach((user: UserValueInitializer) => {
                if (user.uid !== socket.id) {
                    currentUsers.push(user);
                }
            });
            console.log("users: ", users);
            dispatch({ type: "loadUser", payload: currentUsers });
        });
    };

    const addUser = (user: UserValueInitializer) => {
        dispatch({ type: "addUser", payload: user });
    };

    const changeCurrentTargetUser = (user: UserValueInitializer) => {
        setCurrentTargetUser(user);
    };

    const addNewMessage = (message: MessageValueInitializer) => {
        // dispatch({ type: "sendMessage", payload: message });
    };

    const hasNewMessage = (uid: string) => {
        // dispatch({ type: "hasNewMessage", payload: { uid } });
    };

    const chatContextValue = {
        currentTargetUser,
        users: chatReducerState.user,
        loadUser,
        addUser,
        changeCurrentTargetUser,
        addNewMessage,
        hasNewMessage,
    };
    return <ChatContext.Provider value={chatContextValue}>{children}</ChatContext.Provider>;
};

export default ChatContextProvier;
