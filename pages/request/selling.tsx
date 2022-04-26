import React, { useContext, useEffect } from "react";
import RequestModal from "../../src/components/request/buying/RequestModal";
import RequestTable from "../../src/components/request/buying/RequestTable";
import AddNewRequestModal from "../../src/components/request/buying/AddNewRequestModal";
import ConfirmationModal from "../../src/components/layouts/ConfirmationModal";
import { AuthContext } from "../../src/context/AuthContext";
import { RequestContext } from "../../src/context/RequestContext";
import ManagerRequestTable from "../../src/components/request/buying/ManagerRequestTable";
import Progress from "../../src/components/layouts/Progress";
import NewAddressModal from "../../src/components/auth/NewAddressModal";

const Selling = () => {
    const { userInfo, getUserInformation, renderUserAddress } = useContext(AuthContext);
    const { getUnconfirmedRequests, getConfirmedRequests, getAllRequestImage, getAllSubrequest } =
        useContext(RequestContext);

    useEffect(() => {
        renderUserAddress();
        getUserInformation();
        getUnconfirmedRequests("selling");
        getConfirmedRequests("selling");
        getAllSubrequest("buying");
        getAllRequestImage("request", "selling");
    }, []);
    return (
        <>
            <ConfirmationModal />
            <NewAddressModal />
            <Progress />
            <RequestModal type="selling" submitType="create" />
            <AddNewRequestModal type="selling" submitType="create" />
            {userInfo.role === "manager" ? (
                <ManagerRequestTable type="selling" />
            ) : (
                <RequestTable transactionType="selling" />
            )}
        </>
    );
};

export default Selling;
