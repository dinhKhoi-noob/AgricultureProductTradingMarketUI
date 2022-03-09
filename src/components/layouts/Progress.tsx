import { CircularProgress, Modal } from "@mui/material";
import React, { useContext } from "react";
import { LayoutContext } from "../../context/LayoutContext";

const Progress = () => {
    const { onLoading } = useContext(LayoutContext);
    return (
        <Modal open={onLoading} aria-labelledby="unstyled-modal-title" aria-describedby="unstyled-modal-description">
            <CircularProgress color="info" className="central" />
        </Modal>
    );
};

export default Progress;
