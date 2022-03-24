import { Button } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../src/context/AuthContext";

const Order = () => {
    const { navigateUser } = useContext(AuthContext);
    useEffect(() => {
        navigateUser("/order", ["manager", "shipper", "packing_staff"]);
    }, []);
    return (
        <div>
            <Button variant="outlined">Hello World</Button>
        </div>
    );
};

export default Order;
