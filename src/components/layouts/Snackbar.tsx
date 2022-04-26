/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { Alert, Snackbar, SnackbarOrigin } from "@mui/material";
import { LayoutContext, SnackbarType } from "../../context/LayoutContext";
import Link from "next/link";
import { useRouter } from "next/router";

interface SnackbarProps {
    type: SnackbarType;
    content: string;
    isToggle: boolean;
    link?: string;
}

const Toast = (props: SnackbarProps) => {
    const { snackbarValues, snackbarPosition, changeSnackbarStatus } = useContext(LayoutContext);
    const { isToggle } = snackbarValues;
    const router = useRouter();
    useEffect(() => {
        if (isToggle) {
            setTimeout(() => {
                changeSnackbarStatus(false);
            }, 3000);
        }
    }, [snackbarValues]);
    const { type, content, link } = props;
    return (
        <Snackbar open={isToggle} anchorOrigin={snackbarPosition}>
            <Alert
                severity={type}
                color={type}
                onClick={() => {
                    if (link) {
                        console.log("Click");
                        router.push(link);
                    }
                }}
            >
                {content}
            </Alert>
        </Snackbar>
    );
};

export default Toast;
