import React, { useContext, useEffect } from "react";
import BuyingRequestModal from "../../src/components/request/BuyingRequestModal";
import BuyingRequestTable from "../../src/components/request/BuyingRequestTable";
import AddNewRequestModal from "../../src/components/request/AddNewRequestModal";
import ConfirmationModal from "../../src/components/layouts/ConfirmationModal";
import { AuthContext } from "../../src/context/AuthContext";
import { BuyingRequestContext } from "../../src/context/BuyingRequestContext";
import ManagerBuyingRequestTable from "../../src/components/request/ManagerBuyingRequestTable";
import Progress from "../../src/components/layouts/Progress";

const Buying = () => {
    const { userInfo } = useContext(AuthContext);
    const {
        confirmedBuyingRequests,
        unconfirmedBuyingRequests,
        requestImages,
        getUnconfirmedBuyingRequests,
        getConfirmedBuyingRequests,
        getAllBuyingRequestImage,
    } = useContext(BuyingRequestContext);
    useEffect(() => {
        getUnconfirmedBuyingRequests();
        getConfirmedBuyingRequests();
        getAllBuyingRequestImage();
        console.log(confirmedBuyingRequests, unconfirmedBuyingRequests, requestImages);
    }, []);
    return (
        <>
            <ConfirmationModal />
            <Progress />
            <BuyingRequestModal />
            <AddNewRequestModal />
            {userInfo.role === "manager" ? <ManagerBuyingRequestTable /> : <BuyingRequestTable />}
        </>
    );
};

export default Buying;
