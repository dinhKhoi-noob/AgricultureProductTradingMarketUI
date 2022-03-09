/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { Alert, Snackbar, SnackbarOrigin } from "@mui/material";
import { LayoutContext, SnackbarType } from "../../context/LayoutContext";

interface SnackbarProps {
    type: SnackbarType;
    content: string;
    isToggle: boolean;
}

const Toast = (props: SnackbarProps) => {
    const { snackbarValues, snackbarPosition, changeSnackbarStatus } = useContext(LayoutContext);
    const { isToggle } = snackbarValues;
    useEffect(() => {
        if (isToggle) {
            setTimeout(() => {
                changeSnackbarStatus(false);
            }, 2000);
        }
    }, [snackbarValues]);
    const { type, content } = props;
    return (
        <Snackbar open={isToggle} anchorOrigin={snackbarPosition}>
            <Alert severity={type} color={type}>
                {content}
            </Alert>
        </Snackbar>
    );
};

export default Toast;
