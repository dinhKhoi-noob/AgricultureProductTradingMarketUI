import { Box, Button } from "@mui/material";
import React, { useContext } from "react";
import { LayoutContext } from "../../../context/LayoutContext";
import { RequestContext, TransactionType } from "../../../context/RequestContext";

type RoleType = "owner" | "customer" | "manager";
type StatusType = "success" | "unconfirmed" | "cancel";

interface ButtonGroupRequestPageProps {
    role: RoleType;
    status: StatusType;
    isDated: boolean;
    id: string;
    type: TransactionType;
}

const ButtonGroupRequestPage = (props: ButtonGroupRequestPageProps) => {
    const { role, status, isDated, id, type } = props;
    const { fillRequest, changeCurrentRequestId, getUnconfirmedRequests } = useContext(RequestContext);
    const { changeConfirmationModalValues } = useContext(LayoutContext);

    const handleCancelRequest = () => {
        changeCurrentRequestId(id);
        changeConfirmationModalValues({
            isToggle: true,
            title: "Bạn chắc chắn muốn huỷ yêu cầu này ?",
            type: type === "buying" ? "cancelBuyingRequest" : "cancelSellingRequest",
        });
    };

    const handleConfirmRequest = (type: TransactionType) => {
        changeConfirmationModalValues({
            isToggle: true,
            title: "Bạn chắc chắn muốn xác nhận yêu cầu này? sau khi xác nhận yêu cầu sẽ được đưa lên hệ thống !",
            type: type === "selling" ? "confirmSellingRequest" : "confirmBuyingRequest",
        });
    };

    const renderButtonGroups = (role: RoleType, status: StatusType, isDated: boolean) => {
        if (role === "owner" && status !== "success" && status !== "cancel" && !isDated) {
            return (
                <Box display="flex" justifyContent="center">
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={() => {
                            console.log(id);
                            getUnconfirmedRequests(type);
                            changeCurrentRequestId(id);
                            fillRequest(id);
                        }}
                    >
                        Chỉnh sửa yêu cầu
                    </Button>
                    &nbsp;
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            handleCancelRequest();
                        }}
                    >
                        Huỷ yêu cầu
                    </Button>
                </Box>
            );
        }
        if (role === "manager" && status !== "success" && status !== "cancel" && !isDated) {
            return (
                <Box display="flex" justifyContent="center">
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={() => {
                            changeCurrentRequestId(id);
                            handleConfirmRequest(type);
                        }}
                    >
                        Duyệt yêu cầu
                    </Button>
                    &nbsp;
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            handleCancelRequest();
                        }}
                    >
                        Huỷ yêu cầu
                    </Button>
                </Box>
            );
        }
        return <></>;
    };
    return renderButtonGroups(role, status, isDated);
};

export default ButtonGroupRequestPage;
