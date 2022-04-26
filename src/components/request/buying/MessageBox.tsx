import { Box, Button, Input, Typography } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useRouter } from "next/router";
import React, { SyntheticEvent, useContext, useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { RiImageAddFill } from "react-icons/ri";
import { ChatContext, MessageValueResponseInitializer } from "../../../context/ChatContext";
import { LayoutContext } from "../../../context/LayoutContext";
import { UploadFileContext } from "../../../context/UploadFileContext";
import socket from "../../../socket";

interface MessageBoxProps {
    userId: string;
    roomId: string;
}

const MessageBox = (props: MessageBoxProps) => {
    const { userId, roomId } = props;
    const [message, setMessage] = useState("");
    const router = useRouter();
    const chatSheetRef = useRef<HTMLDivElement>(null);
    const { messages, haveNewMessage, loadMessages, addNewMessage } = useContext(ChatContext);
    const { changeFilesArray } = useContext(UploadFileContext);
    const { changeSnackbarValues } = useContext(LayoutContext);
    const scrollToBottom = () => {
        chatSheetRef.current?.scrollTo({ behavior: "smooth", top: chatSheetRef.current.scrollHeight });
    };

    useEffect(() => {
        socket.on("newMessage:error", result => {
            console.log(result);
        });
        setMessage("");
        socket.off("newMessage:success").on("newMessage:success", result => {
            if (router.basePath.includes("my_request/details/selling_request_for_buying")) {
                changeSnackbarValues({
                    content: "Bạn có tin nhắn trao đổi từ đơn hàng " + roomId,
                    isToggle: true,
                    type: "info",
                    link: "/my_request/details/selling_request_for_buying?id=" + roomId,
                });
            }
            loadMessages(userId, roomId);
            return;
        });
        loadMessages(userId, roomId);
    }, [haveNewMessage]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    const reRenderMessages = () => {
        return (
            <Box style={{ backgroundColor: "#eee", height: "90%" }} className="scrollable" ref={chatSheetRef} pb={4}>
                {messages.map((message: MessageValueResponseInitializer, index) => {
                    const { content, sentBy, dateSent } = message;
                    return (
                        <Box key={index} className={sentBy === userId ? "message-right" : "message-left"}>
                            <Typography variant="caption">
                                {formatDistanceToNow(new Date(dateSent), { addSuffix: true, locale: vi })}
                            </Typography>
                            <Box className={sentBy === userId ? "own-message" : "other-message"}>
                                <Typography>{content}</Typography>
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        );
    };

    const changeMessageInput = (event: SyntheticEvent) => {
        const target = event.target as HTMLInputElement;
        setMessage(target.value);
    };

    const handleChangeMessageImages = (event: SyntheticEvent) => {
        const target = event.target as HTMLInputElement;
        const files = target.files;
        if (files) {
            changeFilesArray(files);
        }
    };

    const postNewMessage = (event: SyntheticEvent) => {
        event.preventDefault();
        addNewMessage({ content: message, uid: userId }, roomId);
    };
    return (
        <Box display="flex" flexDirection="column" height="40rem">
            {reRenderMessages()}
            <form
                style={{ height: "10%" }}
                onSubmit={event => {
                    postNewMessage(event);
                }}
            >
                <Box display="flex" alignItems="center">
                    <Input
                        style={{ width: "90%" }}
                        value={message}
                        onChange={event => {
                            changeMessageInput(event);
                        }}
                    ></Input>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box>
                            <input
                                accept="image/*"
                                multiple
                                style={{ display: "none" }}
                                id="raised-button-message"
                                type="file"
                                onChange={event => {
                                    handleChangeMessageImages(event);
                                }}
                            />
                            <label htmlFor="raised-button-message">
                                <RiImageAddFill fontSize={25} />
                            </label>
                        </Box>
                        <Button variant="text" type="submit">
                            <FiSend fontSize={25} />
                        </Button>
                    </Box>
                </Box>
            </form>
        </Box>
    );
};

export default MessageBox;
