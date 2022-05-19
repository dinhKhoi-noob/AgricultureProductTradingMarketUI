import { Box, Button, ImageList, ImageListItem, Input, Typography } from "@mui/material";
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
import Image from "next/image";
import PreviewImageModal from "./PreviewImageModal";
import { AiFillCloseCircle } from "react-icons/ai";

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
    const { fileNames, currentFilePaths, changeFilesArray, changeCurrentFilePaths, uploadMultipleFiles } =
        useContext(UploadFileContext);
    const { changeSnackbarValues, changeIsTogglePreviewImage } = useContext(LayoutContext);
    const scrollToBottom = () => {
        chatSheetRef.current?.scrollTo({ behavior: "smooth", top: chatSheetRef.current.scrollHeight });
    };
    const [isToggleSendingImage, setIsToggleSendingImage] = useState(false);

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
        if (!fileNames || fileNames?.length === 0) {
            changeFilesArray(undefined);
            return;
        }
        const imageFiles = Array.prototype.slice.call(fileNames);
        const temporaryFilePaths = imageFiles.map((item: File) => {
            const objectURL = URL.createObjectURL(item);
            return objectURL;
        });
        changeCurrentFilePaths(temporaryFilePaths);
        return () => {
            currentFilePaths.forEach((item: string) => {
                URL.revokeObjectURL(item);
            });
            changeCurrentFilePaths([]);
        };
    }, [fileNames]);

    useEffect(() => {
        console.log(messages);
        scrollToBottom();
    }, [messages]);

    const reRenderMessages = () => {
        return (
            <Box style={{ backgroundColor: "#eee", height: "90%" }} className="scrollable" ref={chatSheetRef} pb={4}>
                {messages.map((message: MessageValueResponseInitializer, index) => {
                    const { content, sentBy, dateSent, files } = message;
                    return (
                        <Box key={index} className={sentBy === userId ? "message-right" : "message-left"}>
                            <Typography variant="caption">
                                {formatDistanceToNow(new Date(dateSent), { addSuffix: true, locale: vi })}
                            </Typography>
                            {content.length > 0 && (
                                <Box className={sentBy === userId ? "own-message" : "other-message"}>
                                    <Typography>{content}</Typography>
                                </Box>
                            )}
                            {files && files.length > 0 && (
                                <Box>
                                    <Box display="flex" alignItems="center" sx={{ backgroundColor: "#eee" }}>
                                        <ImageList sx={{ height: "90%", width: "90%" }}>
                                            {files.map((imageSrc: string, index) => {
                                                if (index < 2) {
                                                    return (
                                                        <ImageListItem key={index}>
                                                            <Image
                                                                src={`${imageSrc}`}
                                                                width="164px"
                                                                height="164px"
                                                                onClick={() => {
                                                                    changeCurrentFilePaths(files);
                                                                    changeIsTogglePreviewImage();
                                                                    setIsToggleSendingImage(false);
                                                                }}
                                                                className="object-fit-cover"
                                                            />
                                                        </ImageListItem>
                                                    );
                                                }
                                            })}
                                        </ImageList>
                                        &nbsp;
                                        {currentFilePaths.length > 2 && (
                                            <Typography variant="h4">+{currentFilePaths.length - 2}</Typography>
                                        )}
                                    </Box>
                                </Box>
                            )}
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

    const postNewMessage = async (event: SyntheticEvent) => {
        event.preventDefault();
        if (fileNames && fileNames.length > 0) {
            const form = new FormData();
            const files = Array.prototype.slice.call(fileNames);
            files.forEach((file: File) => {
                form.append("data", file, file.name);
            });
            const response = await uploadMultipleFiles(form);
            if (response) {
                addNewMessage({ content: message, uid: userId }, roomId, response);
            }
            return;
        }
        addNewMessage({ content: message, uid: userId }, roomId, []);
    };
    return (
        <>
            {currentFilePaths.length > 0 && (
                <Box sx={{ position: "absolute", bottom: 0, right: 50 }}>
                    <Box display="flex" alignItems="center" sx={{ backgroundColor: "#eee" }}>
                        <ImageList sx={{ height: "90%", width: "90%" }}>
                            {currentFilePaths.map((imageSrc: string, index) => {
                                if (index < 2) {
                                    return (
                                        <ImageListItem key={index}>
                                            <Image
                                                src={`${imageSrc}`}
                                                width="164px"
                                                height="164px"
                                                onClick={() => {
                                                    changeIsTogglePreviewImage();
                                                    setIsToggleSendingImage(true);
                                                }}
                                                className="object-fit-cover"
                                            />
                                        </ImageListItem>
                                    );
                                }
                            })}
                        </ImageList>
                        &nbsp;
                        {currentFilePaths.length > 2 && (
                            <Typography variant="h4">+{currentFilePaths.length - 2}</Typography>
                        )}
                    </Box>
                    <Button
                        sx={{ position: "absolute", top: 0, right: 0 }}
                        variant="text"
                        color="primary"
                        onClick={() => {
                            changeFilesArray(undefined);
                            changeCurrentFilePaths([]);
                        }}
                    >
                        <AiFillCloseCircle />
                    </Button>
                </Box>
            )}
            <PreviewImageModal images={currentFilePaths} isSendingMessage={isToggleSendingImage} />
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
        </>
    );
};

export default MessageBox;
