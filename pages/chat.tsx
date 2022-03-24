import { Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { ChatContext } from "../src/context/ChatContext";
import socket from "../src/socket";

const Chat = () => {
    const { users, loadUser, addUser, changeCurrentTargetUser } = useContext(ChatContext);
    const router = useRouter();
    useEffect(() => {
        loadUser();
        console.log(users);
    }, []);
    socket.on("connect", () => {
        socket.on("user connected", user => {
            addUser(user);
        });
    });

    const renderUsers = () => {
        return (
            <>
                {users.map((user, index) => {
                    const { username } = user;
                    return (
                        <div
                            key={index}
                            onClick={() => {
                                changeCurrentTargetUser(user);
                                router.push("/chat/chat_box");
                            }}
                        >
                            <Grid container>
                                <Grid item>
                                    <Typography>User: {username}</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography>{}</Typography>
                                </Grid>
                            </Grid>
                        </div>
                    );
                })}
            </>
        );
    };
    return <>{renderUsers()}</>;
};
export default Chat;
