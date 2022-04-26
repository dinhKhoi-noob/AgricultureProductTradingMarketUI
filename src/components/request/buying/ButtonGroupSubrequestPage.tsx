import { Box, Button } from "@mui/material";
import React, { useContext } from "react";
import { LayoutContext } from "../../../context/LayoutContext";
import { RequestContext, TransactionType } from "../../../context/RequestContext";

type RoleType = "owner" | "customer" | "manager";
type StatusType = "success" | "unconfirmed" | "refused";

interface ButtonGroupDetailsPageProps {
    role: RoleType;
    status: StatusType;
    isDated: boolean;
    id: string;
    type: TransactionType;
}

const ButtonGroupDetailsPage = (props: ButtonGroupDetailsPageProps) => {
    const { role, status, isDated, id, type } = props;
    const { fillSubrequest, changeCurrentRequestId, getAllSubrequest } = useContext(RequestContext);
    const { changeConfirmationModalValues } = useContext(LayoutContext);
    const handleChangeSubrequestStatus = (isRefused: boolean) => {
        const confirmType = isRefused
            ? type === "selling"
                ? "cancelSellingSubrequest"
                : "cancelBuyingSubrequest"
            : type === "buying"
            ? "confirmBuyingSubrequest"
            : "confirmSellingSubrequest";
        changeConfirmationModalValues({
            isToggle: true,
            title: isRefused ? "Bạn chắc chắn muốn huỷ yêu cầu này ?" : "Bạn chắc chắn muốn xác nhận yêu cầu này ?",
            type: confirmType,
        });
    };

    const renderButtonGroups = (role: RoleType, status: StatusType, isDated: boolean) => {
        if (role === "owner" && status !== "success" && status !== "refused" && !isDated) {
            return (
                <Box display="flex" justifyContent="center">
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={() => {
                            getAllSubrequest(type);
                            changeCurrentRequestId(id);
                            fillSubrequest(id);
                        }}
                    >
                        Chỉnh sửa yêu cầu
                    </Button>
                    &nbsp;
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            changeCurrentRequestId(id);
                            handleChangeSubrequestStatus(true);
                        }}
                    >
                        Huỷ yêu cầu
                    </Button>
                </Box>
            );
        }
        if (role === "manager" && status !== "success" && status !== "refused" && !isDated) {
            return (
                <Box display="flex" justifyContent="center">
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={() => {
                            changeCurrentRequestId(id);
                            handleChangeSubrequestStatus(false);
                        }}
                    >
                        Duyệt yêu cầu
                    </Button>
                    &nbsp;
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            changeCurrentRequestId(id);
                            handleChangeSubrequestStatus(true);
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

export default ButtonGroupDetailsPage;
