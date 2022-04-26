import {
    Timeline,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineOppositeContent,
    TimelineSeparator,
} from "@mui/lab";
import { Box, Button, Chip, Grid, Typography } from "@mui/material";
import { format } from "date-fns";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { BsFileEarmarkCheck, BsJournalCheck, BsPatchCheck } from "react-icons/bs";
import { GoPackage } from "react-icons/go";
import { GrDeliver, GrUserWorker } from "react-icons/gr";
import Cookies from "universal-cookie";
import OrderInformation from "../../src/components/order/OrderInformation";
import { OrderContext, OrderValueInitializer, StepValueInitializer } from "../../src/context/OrderContext";
import { DataGrid, GridToolbar, GridColDef } from "@mui/x-data-grid";
import OrderButtonGroup from "../../src/components/order/OrderButtonGroup";
import { AuthContext } from "../../src/context/AuthContext";
import ConfirmationModal from "../../src/components/layouts/ConfirmationModal";
import Progress from "../../src/components/layouts/Progress";

const SellingOrderDetails = () => {
    const router = useRouter();
    const cookie = new Cookies();
    const formatDateString = "dd/MM/yyyy HH:mm:ss";
    const {
        orderDetails,
        currentOrder,
        currentSubOrders,
        loadSpecificRootOrder,
        changeCurrentOrderInformation,
        convertOrderStatus,
        checkStep,
    } = useContext(OrderContext);
    const [steps, setSteps] = useState<any[]>([]);
    const [subOrdersDisplay, setSubOrdersDisplay] = useState<any[]>([]);
    const { userInfo, getUserInformation } = useContext(AuthContext);
    const orderColumns: GridColDef[] = [
        { field: "id", headerName: "id", width: 100 },
        { field: "productName", headerName: "Tên nông sản", width: 150 },
        { field: "price", headerName: "Giá", width: 100 },
        { field: "quantity", headerName: "Số lượng", width: 100 },
        { field: "total", headerName: "Tổng cộng", width: 100 },
        {
            field: orderDetails?.order.transactionType === "selling" ? "requestUsername" : "subrequestUsername",
            headerName: "Nhận hàng từ",
            width: 200,
        },
        {
            field: orderDetails?.order.transactionType === "buying" ? "requestUsername" : "subrequestUsername",
            headerName: "Giao hàng đến",
            width: 200,
        },
        { field: "expiredDate", headerName: "Ngày nhận hàng", width: 200 },
        { field: "dateCompletedOrder", headerName: "Ngày giao hàng", width: 200 },
        { field: "status", headerName: "Trạng thái", width: 200, renderCell: params => params.value },
        { field: "transactionType", headerName: "Loại giao dịch", width: 150 },
        {
            field: "view",
            headerName: "",
            width: 150,
            renderCell: () => {
                return (
                    <Button variant="contained" color="info">
                        Xem yêu cầu
                    </Button>
                );
            },
        },
    ];
    useEffect(() => {
        const id = typeof router.query["id"] === "string" ? router.query["id"] : cookie.get("order_id");
        getUserInformation();
        if (typeof id === "string") {
            loadSpecificRootOrder("buying", id);
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
            const formatDateString = "dd/MM/yyyy HH:mm:ss";
            const stepsValue: StepValueInitializer[] = [
                {
                    name: "Duyệt yêu cầu",
                    by: requestUsername,
                    dateCreated: format(new Date(orderCreatedDate), formatDateString),
                    dateCompleted: format(new Date(orderCreatedDate), formatDateString),
                    color: "#00c853",
                    icon: <BsFileEarmarkCheck color="white" />,
                    process: "done",
                },
                {
                    name: "Chuẩn bị hàng",
                    by: transactionType === "selling" ? requestUsername : subrequestUsername,
                    dateCreated: format(new Date(orderCreatedDate), formatDateString),
                    dateCompleted: format(
                        new Date(transactionType === "selling" ? expiredDate : dateCompletedOrder),
                        formatDateString
                    ),
                    color: status === "preparing" ? "#f57f17" : checkStep("ready", status) ? "#00c853" : "#263238",
                    icon: <GrUserWorker className="white-icon" />,
                    process: status === "preparing" ? "process" : checkStep("ready", status) ? "done" : "notbegin",
                },
                {
                    name: "Chuyển hàng về kho",
                    by: grabbingAsignment.username,
                    dateCreated: format(new Date(grabbingAsignment.dateAssigned), formatDateString),
                    dateCompleted: format(new Date(grabbingAsignment.dateCompleted), formatDateString),
                    color: status === "carrying_in" ? "#f57f17" : checkStep("ready", status) ? "#00c853" : "#263238",
                    icon: <GrDeliver className="white-icon" />,
                    process:
                        status === "carrying_in" ? "process" : checkStep("carried_in", status) ? "done" : "notbegin",
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
                    by: transactionType !== "selling" ? requestUsername : subrequestUsername,
                    dateCreated: format(new Date(deliveringAssignment.dateCompleted), formatDateString),
                    dateCompleted: format(new Date(orderConfirmedDate), formatDateString),
                    color: checkStep("confirmed", status) ? "#00c853" : status === "success" ? "#f57f17" : "#263238",
                    icon: <BsJournalCheck />,
                    process: checkStep("confirmed", status) ? "done" : status === "success" ? "process" : "notbegin",
                },
                {
                    name: "Hoàn thành",
                    by: transactionType !== "selling" ? requestUsername : subrequestUsername,
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

    useEffect(() => {
        if (currentSubOrders.length > 0) {
            const mappedSubOrders = currentSubOrders.map((order: OrderValueInitializer) => {
                const { orderConfirmedDate, dateCompletedOrder, expiredDate, orderCreatedDate, status } = order;
                return {
                    ...order,
                    orderConfirmedDate: format(new Date(orderConfirmedDate), formatDateString),
                    dateCompletedOrder: format(new Date(dateCompletedOrder), formatDateString),
                    expiredDate: format(new Date(expiredDate), formatDateString),
                    orderCreatedDate: format(new Date(orderCreatedDate), formatDateString),
                    status: (
                        <Chip
                            label={convertOrderStatus(status).convertedStatus}
                            color={convertOrderStatus(status).isDone ? "success" : "warning"}
                        />
                    ),
                };
            });
            setSubOrdersDisplay(mappedSubOrders);
        }
    }, [currentSubOrders]);

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
                    <OrderButtonGroup
                        id={currentOrder?.id}
                        status={currentOrder?.status}
                        role={userInfo?.role}
                        isRoot={true}
                        type="selling"
                        requestUserId={currentOrder?.requestUserId}
                        subrequestUserId={currentOrder?.subrequestUserId}
                        userId={userInfo?.id}
                    />
                </Grid>
                <Grid item md={6} sm={12}>
                    <Timeline position="alternate">{renderTimeline()}</Timeline>
                </Grid>
            </Grid>
            <Typography variant="h4" textAlign="center">
                Đơn hàng thành phần
            </Typography>
            <Box p={4}>
                <DataGrid
                    getRowId={row => row.id}
                    rows={subOrdersDisplay}
                    columns={orderColumns}
                    disableSelectionOnClick
                    autoHeight
                    onCellClick={row => {
                        if (row.field === "view") {
                            cookie.remove("order_id");
                            cookie.set("order_id", row.id.toString());
                            router.push(`/order/order_details?id=${row.id}`);
                        }
                    }}
                    localeText={{
                        toolbarDensity: "Size",
                        toolbarDensityLabel: "Size",
                        toolbarDensityCompact: "Small",
                        toolbarDensityStandard: "Medium",
                        toolbarDensityComfortable: "Large",
                    }}
                    components={{
                        Toolbar: GridToolbar,
                    }}
                    pageSize={10}
                    rowsPerPageOptions={[5, 10, 20]}
                    pagination
                />
            </Box>
        </>
    );
};

export default SellingOrderDetails;
