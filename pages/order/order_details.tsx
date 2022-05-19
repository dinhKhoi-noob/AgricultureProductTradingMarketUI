import {
    Timeline,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineOppositeContent,
    TimelineSeparator,
} from "@mui/lab";
import { Grid, Typography } from "@mui/material";
import { format } from "date-fns";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { BsFileEarmarkCheck, BsJournalCheck, BsPatchCheck } from "react-icons/bs";
import { GoPackage } from "react-icons/go";
import { GrDeliver, GrUserWorker } from "react-icons/gr";
import Cookies from "universal-cookie";
import ConfirmationModal from "../../src/components/layouts/ConfirmationModal";
import Progress from "../../src/components/layouts/Progress";
import OrderButtonGroup from "../../src/components/order/OrderButtonGroup";
import OrderInformation from "../../src/components/order/OrderInformation";
import RatingList from "../../src/components/order/RatingList";
import { AuthContext } from "../../src/context/AuthContext";
import { OrderContext, OrderValueInitializer, StepValueInitializer } from "../../src/context/OrderContext";

const OrderDetails = () => {
    const router = useRouter();
    const cookie = new Cookies();
    const { orderDetails, currentOrder, loadOrderDetails, changeCurrentOrderInformation, checkStep, loadRatingList } =
        useContext(OrderContext);
    const [steps, setSteps] = useState<any[]>([]);
    const { userInfo, getUserInformation } = useContext(AuthContext);
    useEffect(() => {
        const id = typeof router.query["id"] === "string" ? router.query["id"] : cookie.get("order_id");
        getUserInformation();
        if (typeof id === "string") {
            loadOrderDetails(id);
        }
    }, []);
    useEffect(() => {
        if (orderDetails && orderDetails?.order.id !== "") {
            console.log(orderDetails);
            const { order, deliveringAssignment, grabbingAsignment, packagingAssignment } = orderDetails;
            const {
                id,
                productName,
                quantity,
                price,
                total,
                requestAddress,
                subrequestAddress,
                fee,
                status,
                dateCompletedOrder,
                expiredDate,
                subrequestUsername,
                requestUsername,
                measure,
                transactionType,
                orderCreatedDate,
                orderConfirmedDate,
                requestId,
                requestUserId,
                subrequestId,
                subrequestUserId,
            } = order;
            if (status === "confirmed") {
                loadRatingList(subrequestId, "subrequest");
            }
            const formatDateString = "dd/MM/yyyy HH:mm:ss";
            const stepsValue: StepValueInitializer[] = [
                {
                    name: "Duyệt yêu cầu",
                    by: transactionType === "selling" ? requestUsername : subrequestUsername,
                    dateCreated: format(new Date(orderCreatedDate), formatDateString),
                    dateCompleted: format(new Date(orderCreatedDate), formatDateString),
                    color: "#00c853",
                    icon: <BsFileEarmarkCheck color="white" />,
                    process: "done",
                },
                {
                    name: "Chuẩn bị hàng",
                    by: requestUsername,
                    dateCreated: format(new Date(orderCreatedDate), formatDateString),
                    dateCompleted: format(
                        new Date(transactionType === "selling" ? expiredDate : dateCompletedOrder),
                        formatDateString
                    ),
                    color: checkStep("ready", status) ? "#00c853" : status === "preparing" ? "#f57f17" : "#263238",
                    icon: <GrUserWorker className="white-icon" />,
                    process: checkStep("ready", status) ? "done" : status === "preparing" ? "process" : "notbegin",
                },
                {
                    name: "Chuyển hàng về kho",
                    by: grabbingAsignment.username,
                    dateCreated: format(new Date(grabbingAsignment.dateAssigned), formatDateString),
                    dateCompleted: format(new Date(grabbingAsignment.dateCompleted), formatDateString),
                    color: checkStep("carried_in", status)
                        ? "#00c853"
                        : status === "carrying_in"
                        ? "#f57f17"
                        : "#263238",
                    icon: <GrDeliver className="white-icon" />,
                    process: checkStep("carried_in", status)
                        ? "done"
                        : status === "carrying_in"
                        ? "process"
                        : "notbegin",
                },
                {
                    name: "Đóng gói đơn hàng",
                    by: packagingAssignment.username,
                    dateCreated: format(new Date(packagingAssignment.dateAssigned), formatDateString),
                    dateCompleted: format(new Date(packagingAssignment.dateCompleted), formatDateString),
                    color: checkStep("packaged", status) ? "#00c853" : status === "packaging" ? "#f57f17" : "#263238",
                    icon: <GoPackage />,
                    process: checkStep("packaged", status) ? "done" : status === "packaging" ? "process" : "notbegin",
                },
                {
                    name: "Giao hàng",
                    by: deliveringAssignment.username,
                    dateCreated: format(new Date(deliveringAssignment.dateAssigned), formatDateString),
                    dateCompleted: format(new Date(deliveringAssignment.dateCompleted), formatDateString),
                    color: checkStep("success", status) ? "#00c853" : status === "delivering" ? "#f57f17" : "#263238",
                    icon: <GrDeliver className="white-icon" />,
                    process: checkStep("success", status) ? "done" : status === "delivering" ? "process" : "notbegin",
                },
                {
                    name: "Xác nhận đơn hàng",
                    by: transactionType !== "buying" ? requestUsername : subrequestUsername,
                    dateCreated: format(new Date(deliveringAssignment.dateCompleted), formatDateString),
                    dateCompleted: format(new Date(orderConfirmedDate), formatDateString),
                    color: checkStep("success", status) ? "#00c853" : status === "success" ? "#f57f17" : "#263238",
                    icon: <BsJournalCheck />,
                    process: checkStep("success", status) ? "done" : status === "success" ? "process" : "notbegin",
                },
                {
                    name: "Hoàn thành",
                    by: transactionType !== "buying" ? requestUsername : subrequestUsername,
                    dateCreated: format(new Date(orderConfirmedDate), formatDateString),
                    dateCompleted:
                        status === "confirmed"
                            ? format(new Date(orderConfirmedDate), formatDateString)
                            : "Đang thực hiện",
                    color: status === "confirmed" ? "#00c853" : "#263238",
                    icon: <BsPatchCheck />,
                    process: status === "confirmed" ? "done" : "notbegin",
                },
            ];
            setSteps(stepsValue);
            const orderInfo: OrderValueInitializer = {
                id,
                productName,
                quantity,
                price,
                total,
                requestAddress,
                subrequestAddress,
                fee,
                status,
                dateCompletedOrder,
                expiredDate,
                subrequestUsername,
                requestUsername,
                measure,
                transactionType,
                orderCreatedDate,
                orderConfirmedDate,
                requestId,
                requestUserId,
                subrequestId,
                subrequestUserId,
            };
            changeCurrentOrderInformation(orderInfo);
        }
    }, [orderDetails]);

    const renderTimeline = () => {
        return steps.map((step: StepValueInitializer, index: number) => {
            const { by, color, dateCompleted, dateCreated, icon, name, process } = step;
            return (
                <TimelineItem key={index}>
                    <TimelineOppositeContent sx={{ m: "auto 0" }} align="right" variant="body2">
                        {process === "notbegin" ? (
                            <></>
                        ) : (
                            <>
                                <Typography variant="caption">Bắt đầu vào: {dateCreated}</Typography>
                                <br />
                                {process === "done" ? (
                                    <Typography variant="caption">Kết thúc vào: {dateCompleted}</Typography>
                                ) : (
                                    <Typography>Đang thực hiện</Typography>
                                )}
                            </>
                        )}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineConnector color={color} />
                        <TimelineDot
                            color={process === "done" ? "success" : process === "process" ? "warning" : "grey"}
                        >
                            {icon}
                        </TimelineDot>
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: "12px", px: 2 }}>
                        {process === "notbegin" ? (
                            <Typography variant="h6" component="span" color={color}>
                                {name}
                            </Typography>
                        ) : (
                            <>
                                <Typography variant="h6" component="span" color={color}>
                                    {name}
                                </Typography>
                                <Typography>Người thực hiện: {by}</Typography>
                            </>
                        )}
                    </TimelineContent>
                </TimelineItem>
            );
        });
    };

    return (
        <>
            <ConfirmationModal />
            <Progress />
            <Typography variant="h3" textAlign="center">
                Chi tiết đơn hàng
            </Typography>
            <Grid container justifyContent="center">
                <Grid item md={6} sm={12}>
                    <OrderInformation order={currentOrder} />
                </Grid>
                <Grid item md={6} sm={12}>
                    <Timeline position="alternate">{renderTimeline()}</Timeline>
                </Grid>
            </Grid>
            <OrderButtonGroup
                id={currentOrder?.id}
                status={currentOrder?.status}
                role={userInfo?.role}
                isRoot={false}
                type={currentOrder?.transactionType === "selling" ? "selling" : "buying"}
                requestUserId={currentOrder?.requestUserId}
                subrequestUserId={currentOrder?.subrequestUserId}
                userId={userInfo?.id}
                subOrders={currentOrder ? [currentOrder] : []}
            />
            {currentOrder?.status === "confirmed" ? <RatingList /> : <></>}
        </>
    );
};

export default OrderDetails;
