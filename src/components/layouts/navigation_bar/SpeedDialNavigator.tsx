import { Backdrop, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import React from "react";
import { DialAction } from "../../../context/LayoutContext";

interface SpeedDialNavigatorProps {
    actions: DialAction[];
}

const SpeedDialNavigator = ({ actions }: SpeedDialNavigatorProps) => {
    const [openDial, setOpenDial] = React.useState(false);
    const handleOpen = () => setOpenDial(true);
    const handleClose = () => setOpenDial(false);
    return (
        <>
            <Backdrop open={openDial} />
            <SpeedDial
                ariaLabel="SpeedDial tooltip example"
                sx={{ position: "fixed", bottom: 16, right: 16 }}
                icon={<SpeedDialIcon />}
                onClose={handleClose}
                onOpen={handleOpen}
                open={openDial}
            >
                {actions.map(action => (
                    <SpeedDialAction
                        key={action.title}
                        icon={action.icon}
                        tooltipTitle={action.title}
                        onClick={() => {
                            action.ref.current?.scrollIntoView({ behavior: "smooth" });
                            handleClose();
                        }}
                    />
                ))}
            </SpeedDial>
        </>
    );
};

export default SpeedDialNavigator;
