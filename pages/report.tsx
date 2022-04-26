import React, { useContext, useEffect } from "react";
import { AuthContext } from "../src/context/AuthContext";

const Report = () => {
    const { navigateUser } = useContext(AuthContext);

    useEffect(() => {
        navigateUser("/product", ["manager"]);
    }, []);
    return <div></div>;
};

export default Report;
