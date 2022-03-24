import { Button, Grid, Input, Typography } from "@mui/material";
import React, { SyntheticEvent, useContext, useState } from "react";
import { BsFileImage } from "react-icons/bs";
import { GrSend } from "react-icons/gr";
import { ChatContext } from "../../src/context/ChatContext";
import socket from "../../src/socket";

const ChatBox = () => {
    const { currentTargetUser, users, addNewMessage, hasNewMessage } = useContext(ChatContext);
    const { uid, username } = currentTargetUser;
    const [currentMessage, setCurrentMessage] = useState("");

    const changeCurrentMessage = (event: SyntheticEvent) => {
        const target = event.target as HTMLInputElement;
        setCurrentMessage(target.value);
    };

    const sendMessage = (event: SyntheticEvent) => {
        event.preventDefault();
        socket.emit("private message", {
            content: currentMessage,
            to: uid,
        });
        addNewMessage({
            content: currentMessage,
            self: true,
            uid,
        });
    };

    socket.on("private message", ({ content, from }) => {
        for (let i = 0; i <= users.length; i++) {
            const user = users[i];
            if (user.uid === from) {
                addNewMessage({
                    uid: from,
                    content,
                    self: false,
                });
            }
            if (user !== currentTargetUser) {
                hasNewMessage(user.uid);
            }
        }
    });
    // const renderMessage = () => {
    //     console.log(users);
    //     let usersArray = users;
    //     if (typeof users === "object") {
    //         usersArray = Object.values(users);
    //     }
    //     const index = usersArray.findIndex((user: UserValueInitializer) => {
    //         return user.uid === uid;
    //     });
    //     if (index > -1) {
    //         return usersArray[index].messages.map((message, ind) => {
    //             if (message.self) {
    //                 return <Typography key={ind}>You:{message.content}</Typography>;
    //             }
    //             return (
    //                 <Typography key={ind}>
    //                     {username}:{message.content}
    //                 </Typography>
    //             );
    //         });
    //     }
    //     return <>No message yet</>;
    // };
    return (
        <Grid
            flexDirection="column"
            justifyContent="space-between"
            alignItems="center"
            height="700px"
            border="1px solid black"
            width="80%"
            margin="auto"
            container
        >
            <Grid item height="10%" width="100%">
                <Typography variant="h4" textAlign="center">
                    {username}
                </Typography>
            </Grid>
            <Grid
                item
                height="80%"
                width="100%"
                padding={2}
                borderTop="1px solid black"
                borderBottom="1px solid black"
            ></Grid>
            <Grid item height="10%" width="100%" padding={2}>
                <form onSubmit={event => sendMessage(event)}>
                    <Grid container alignItems="center">
                        <Grid item xs={11} sm={11} md={11} lg={11} xl={11}>
                            <Input
                                placeholder="Nhập tin nhắn"
                                fullWidth
                                onChange={event => changeCurrentMessage(event)}
                            />
                        </Grid>
                        <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
                            <Grid container justifyContent="space-between" alignItems="center">
                                <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                    <Button variant="text" className="chat-button">
                                        <BsFileImage></BsFileImage>
                                    </Button>
                                </Grid>
                                <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                    <Button variant="text" className="chat-button" type="submit">
                                        <GrSend></GrSend>
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
        </Grid>
    );
};

export default ChatBox;
