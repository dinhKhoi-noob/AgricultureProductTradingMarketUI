/* eslint-disable camelcase */
import React, { createContext, ReactNode, useState } from "react";
import socket from "../socket";

export interface MessageValueResponseInitializer {
    id: string;
    sentBy: string;
    content: string;
    dateSent: Date;
}

export interface MessageValueInitializer {
    uid: string;
    content: string;
}

interface ChatContextProps {
    children: ReactNode;
}

interface ChatContextDefault {
    messages: MessageValueResponseInitializer[];
    haveNewMessage: boolean;
    changeMessageList: (messages: MessageValueResponseInitializer[]) => void;
    loadMessages: (userId: string, roomId: string) => void;
    addNewMessage: (message: MessageValueInitializer, roomId: string) => void;
}

export const ChatContext = createContext<ChatContextDefault>({
    messages: [],
    haveNewMessage: false,
    changeMessageList: () => null,
    loadMessages: () => null,
    addNewMessage: () => null,
});

const ChatContextProvier = ({ children }: ChatContextProps) => {
    const [haveNewMessage, setHaveNewMessage] = useState(false);

    const [messages, setMessages] = useState<MessageValueResponseInitializer[]>([]);

    const changeMessageList = (messages: MessageValueResponseInitializer[]) => {
        setMessages(messages);
    };

    const loadMessages = (userId: string, roomId: string) => {
        socket.emit("messages:load", { roomId, userId });
        socket.on("loadMessages:success", result => {
            const mappedMessages: MessageValueResponseInitializer[] = result.map((message: any) => {
                const { content, date_created, sent_by, id } = message;
                return {
                    id,
                    sentBy: sent_by,
                    content,
                    dateSent: new Date(date_created),
                };
            });
            changeMessageList(mappedMessages);
        });
    };

    const addNewMessage = (message: MessageValueInitializer, roomId: string) => {
        if (message.content.trim().length === 0) {
            return;
        }
        setHaveNewMessage(!haveNewMessage);
        socket.emit("newMessage:post", { roomId, message: message.content, files: [], sendBy: message.uid });
    };

    const chatContextValue = {
        messages,
        haveNewMessage,
        changeMessageList,
        loadMessages,
        addNewMessage,
    };
    return <ChatContext.Provider value={chatContextValue}>{children}</ChatContext.Provider>;
};

export default ChatContextProvier;
