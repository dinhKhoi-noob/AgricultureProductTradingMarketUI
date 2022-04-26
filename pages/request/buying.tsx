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

const Buying = () => {
    const { userInfo, getUserInformation, renderUserAddress } = useContext(AuthContext);
    const { getUnconfirmedRequests, getConfirmedRequests, getAllRequestImage, getAllSubrequest } =
        useContext(RequestContext);

    useEffect(() => {
        renderUserAddress();
        getUserInformation();
        getUnconfirmedRequests("buying");
        getConfirmedRequests("buying");
        getAllSubrequest("selling");
        getAllRequestImage("request", "buying");
        getAllRequestImage("subrequest", "selling");
    }, []);

    useEffect(() => {
        if (userInfo && userInfo.role === "manager") {
            getUnconfirmedRequests("buying", true);
            getConfirmedRequests("buying", true);
            return;
        }
        getUnconfirmedRequests("buying");
        getConfirmedRequests("buying");
    }, [userInfo]);

    return (
        <>
            <ConfirmationModal />
            <NewAddressModal />
            <Progress />
            <RequestModal type="buying" submitType="create" />
            <AddNewRequestModal type="buying" submitType="create" />
            {userInfo.role === "manager" ? (
                <ManagerRequestTable type="buying" />
            ) : (
                <RequestTable transactionType="buying" />
            )}
        </>
    );
};

export default Buying;
