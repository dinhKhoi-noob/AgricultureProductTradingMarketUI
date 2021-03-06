import { Box, Button, Chip, Typography } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../src/context/AuthContext";
import { OrderContext, OrderValueInitializer } from "../../src/context/OrderContext";
import { DataGrid, GridToolbar, GridColDef } from "@mui/x-data-grid";
import Cookies from "universal-cookie";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { DialAction } from "../../src/context/LayoutContext";
import { GiFarmer } from "react-icons/gi";
import { RiShipLine } from "react-icons/ri";
import { VscPackage } from "react-icons/vsc";
import { MdOutlineLocalShipping } from "react-icons/md";
import { BsPatchCheck } from "react-icons/bs";
import SpeedDialNavigator from "../../src/components/layouts/navigation_bar/SpeedDialNavigator";
import NumberFormat from "react-number-format";

const BuyingDashboard = () => {
    const cookie = new Cookies();
    const router = useRouter();
    const { userInfo, getUserInformation } = useContext(AuthContext);
    const {
        orderList,
        preparingOrders,
        carryingOrders,
        packagingOrders,
        deliveringOrders,
        successOrders,
        loadAllOrders,
        storeOrders,
        convertOrderStatus,
    } = useContext(OrderContext);
    const preparingStageRef = useRef<HTMLInputElement | null>(null);
    const carryingStageRef = useRef<HTMLInputElement | null>(null);
    const packingStageRef = useRef<HTMLInputElement | null>(null);
    const deliveringStageRef = useRef<HTMLInputElement | null>(null);
    const successStageRef = useRef<HTMLInputElement | null>(null);
    const actions: DialAction[] = [
        {
            icon: <GiFarmer />,
            title: "Đang chuẩn bị/chờ giao hàng",
            ref: preparingStageRef,
        },
        { icon: <RiShipLine />, title: "Đang nhận hàng/chờ đóng gói", ref: carryingStageRef },
        { icon: <VscPackage />, title: "Đang đóng gói/chờ giao hàng", ref: packingStageRef },
        { icon: <MdOutlineLocalShipping />, title: "Đang giao hàng", ref: deliveringStageRef },
        { icon: <BsPatchCheck />, title: "Đã giao hàng", ref: successStageRef },
    ];
    const [uniqueRequestId, setUniqueRequestId] = useState<string[]>([]);
    const [sellingPreparingStageOrders, setSellingPreparingStageOrders] = useState<any[]>([]);

    const checkIsExistedData = (orderList: any[], data: any) => {
        return (
            orderList.map((order: OrderValueInitializer) => order.id).findIndex((id: string) => id === data.id) !== -1
        );
    };

    const filterOrder = (status: string, data: any) => {
        switch (status) {
            case "preparing":
            case "ready":
                if (!checkIsExistedData(preparingOrders, data)) {
                    storeOrders("loadPreparingOrders", data);
                }
                break;
            case "carrying_in":
            case "carried_in":
                if (!checkIsExistedData(carryingOrders, data)) {
                    storeOrders("loadCarryingOrders", data);
                }
                break;
            case "packaging":
            case "packaged":
                if (!checkIsExistedData(packagingOrders, data)) {
                    storeOrders("loadPackagingOrders", data);
                }
                break;
            case "delivering":
                if (!checkIsExistedData(deliveringOrders, data)) {
                    storeOrders("loadDeliveringOrders", data);
                }
                break;
            case "success":
            case "confirmed":
                if (!checkIsExistedData(successOrders, data)) {
                    storeOrders("loadSuccessOrders", data);
                }
                break;
            // case "cancel":
            //     if (!checkIsExistedData(canceledOrders, data)) {
            //         storeOrders("loadCanceledOrders", data);
            //     }
            //     break;
            default:
                break;
        }
    };

    const navigateToOrderDetailsPage = (id: string) => {
        const idArray = id.toString().split("_");
        const endPoint =
            idArray[0] === "SUB"
                ? `/order/order_details?id=${idArray[1]}`
                : idArray[0] === "ROOTS"
                ? `/order/selling_order_details?id=${idArray[1]}`
                : `/order/buying_order_details?id=${idArray[1]}`;
        cookie.remove("order_id");
        cookie.set("order_id", idArray[1]);
        router.push(endPoint);
    };

    useEffect(() => {
        getUserInformation();
    }, []);

    useEffect(() => {
        if (userInfo && userInfo.id !== "") {
            if (userInfo.role === "manager" || userInfo.role === "shipper" || userInfo.role === "packing_staff") {
                loadAllOrders(undefined, true, "buying");
            }
            if (userInfo.role === "consummer") {
                loadAllOrders(userInfo.id, true);
            }
        }
    }, [userInfo]);

    useEffect(() => {
        if (userInfo && orderList.length > 0) {
            const temporaryRequestIdList: string[] = [];
            orderList.forEach((order: OrderValueInitializer) => {
                const { requestId } = order;
                if (
                    uniqueRequestId.findIndex((item: any) => {
                        return item === requestId;
                    }) === -1
                ) {
                    temporaryRequestIdList.push(requestId);
                }
            });
            setUniqueRequestId(temporaryRequestIdList);
            orderList.forEach((order: OrderValueInitializer) => {
                const {
                    id,
                    productName,
                    price,
                    quantity,
                    requestUsername,
                    subrequestUsername,
                    expiredDate,
                    dateCompletedOrder,
                    status,
                    transactionType,
                    requestUserId,
                    subrequestUserId,
                } = order;

                const { convertedStatus, isDone } = convertOrderStatus(status);

                const temporaryData = {
                    id: "SUB_" + id,
                    productName,
                    price,
                    quantity,
                    total: Math.round(price * quantity),
                    requestUsername: transactionType === "selling" ? requestUsername : subrequestUsername,
                    subrequestUsername: transactionType === "selling" ? subrequestUsername : requestUsername,
                    expiredDate:
                        transactionType === "buying"
                            ? format(new Date(dateCompletedOrder), "dd/MM/yyyy HH:mm:ss")
                            : format(new Date(expiredDate), "dd/MM/yyyy HH:mm:ss"),
                    dateCompletedOrder:
                        transactionType === "buying"
                            ? format(new Date(expiredDate), "dd/MM/yyyy HH:mm:ss")
                            : format(new Date(dateCompletedOrder), "dd/MM/yyyy HH:mm:ss"),
                    status: <Chip label={convertedStatus} color={isDone ? "success" : "warning"} />,
                    transactionType,
                };
                if (
                    (transactionType === "buying" &&
                        userInfo.role === "consummer" &&
                        userInfo.id === requestUserId &&
                        (status === "preparing" || status === "ready" || status === "carrying_in")) ||
                    (transactionType === "buying" &&
                        userInfo.role !== "consummer" &&
                        (status === "preparing" || status === "ready" || status === "carrying_in")) ||
                    (transactionType === "selling" &&
                        userInfo.role === "consummer" &&
                        userInfo.id === subrequestUserId &&
                        status !== "preparing" &&
                        status !== "ready" &&
                        status !== "carrying_in")
                ) {
                    filterOrder(status, temporaryData);
                }
            });
        }
    }, [userInfo, orderList]);

    useEffect(() => {
        if (uniqueRequestId.length > 0) {
            const transitorySellingPreparingStageOrders: any[] = [];
            const loopedOrderIds: string[] = [];
            uniqueRequestId.forEach((reqId: any) => {
                const unitedSellingRequest: OrderValueInitializer[] = [];
                orderList.forEach((order: OrderValueInitializer) => {
                    const { requestId, status, transactionType, subrequestUserId, requestUserId } = order;
                    if (
                        (requestId === reqId &&
                            transactionType === "buying" &&
                            userInfo.role === "consummer" &&
                            userInfo.id === requestUserId &&
                            status !== "preparing" &&
                            status !== "ready" &&
                            status !== "carrying_in") ||
                        (requestId === reqId &&
                            transactionType === "buying" &&
                            userInfo.role !== "consummer" &&
                            status !== "preparing" &&
                            status !== "ready" &&
                            status !== "carrying_in") ||
                        (requestId === reqId &&
                            transactionType === "selling" &&
                            userInfo.role === "consummer" &&
                            userInfo.id === subrequestUserId &&
                            (status === "preparing" || status === "ready" || status === "carrying_in"))
                    ) {
                        unitedSellingRequest.push(order);
                    }
                });
                if (unitedSellingRequest.length > 0 && !loopedOrderIds.includes(reqId)) {
                    transitorySellingPreparingStageOrders.push(unitedSellingRequest);
                }
                loopedOrderIds.push(reqId);
            });

            setSellingPreparingStageOrders(transitorySellingPreparingStageOrders);
        }
    }, [uniqueRequestId]);

    useEffect(() => {
        console.log(sellingPreparingStageOrders);
        if (sellingPreparingStageOrders.length > 0) {
            sellingPreparingStageOrders.forEach((orderArray: OrderValueInitializer[]) => {
                const {
                    dateCompletedOrder,
                    expiredDate,
                    measure,
                    requestUsername,
                    status,
                    requestId,
                    productName,
                    transactionType,
                } = orderArray[0];
                const { convertedStatus, isDone } = convertOrderStatus(status);
                let totalOrderQuantity = 0;
                let totalOrderAmount = 0;
                let users = "";
                orderArray.forEach((order: OrderValueInitializer) => {
                    totalOrderQuantity += order.quantity;
                    totalOrderAmount += order.quantity * order.price;
                    users += `${order.subrequestUsername}, `;
                });
                console.log(orderArray, totalOrderQuantity, totalOrderAmount, productName);
                const unitedOrder = {
                    id: "ROOTB_" + requestId,
                    quantity: totalOrderQuantity,
                    measure,
                    requestUsername:
                        transactionType === "buying" ? users.substring(0, users.length - 2) : requestUsername, // owner
                    subrequestUsername:
                        transactionType === "buying" ? requestUsername : users.substring(0, users.length - 2), // customer
                    productName,
                    status: <Chip label={convertedStatus} color={isDone ? "success" : "warning"} />,
                    expiredDate: format(new Date(dateCompletedOrder), "dd/MM/yyyy HH:mm:ss"),
                    dateCompletedOrder: format(new Date(expiredDate), "dd/MM/yyyy HH:mm:ss"),
                    total: totalOrderAmount,
                    transactionType,
                };
                filterOrder(status, unitedOrder);
            });
        }
    }, [sellingPreparingStageOrders]);

    const orderColumns: GridColDef[] = [
        { field: "id", headerName: "id", width: 100 },
        { field: "productName", headerName: "Tên nông sản", width: 150 },
        {
            field: "price",
            headerName: "Giá",
            width: 100,
            renderCell: params => {
                return (
                    <Box display="flex" justifyContent="flex-end" alignItems="flex-end">
                        <NumberFormat value={params.value} displayType="text" thousandSeparator={true} suffix="VND" />
                    </Box>
                );
            },
        },
        {
            field: "quantity",
            headerName: "Số lượng",
            width: 100,
            renderCell: params => {
                return (
                    <Box display="flex" justifyContent="flex-end" alignItems="flex-end">
                        <NumberFormat value={params.value} displayType="text" thousandSeparator={true} />
                    </Box>
                );
            },
        },
        {
            field: "total",
            headerName: "Tổng cộng",
            width: 150,
            renderCell: params => {
                return (
                    <Box display="flex" justifyContent="flex-end" alignItems="flex-end">
                        <NumberFormat value={params.value} displayType="text" thousandSeparator={true} suffix="VND" />
                    </Box>
                );
            },
        },
        { field: "requestUsername", headerName: "Nhận hàng từ", width: 200 },
        { field: "subrequestUsername", headerName: "Giao hàng đến", width: 200 },
        { field: "expiredDate", headerName: "Ngày nhận hàng", width: 200 },
        { field: "dateCompletedOrder", headerName: "Ngày giao hàng", width: 200 },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 200,
            valueFormatter: ({ value }) => value,
            renderCell: params => params.value,
        },
        {
            field: "view",
            headerName: "",
            width: 150,
            valueFormatter: ({ value }) => value,
            renderCell: () => {
                return (
                    <Button variant="contained" color="info">
                        Xem yêu cầu
                    </Button>
                );
            },
        },
    ];

    return (
        <Box>
            <Box ref={preparingStageRef} />
            <Typography variant="h4" textAlign="center" margin={4}>
                Đơn hàng mua vào
            </Typography>
            <Typography className="text-camel" variant="h5" margin={5} mb={0}>
                Đang chuẩn bị / chờ nhận hàng
            </Typography>
            <Box p={4}>
                <DataGrid
                    getRowId={row => row.id}
                    rows={preparingOrders}
                    columns={orderColumns}
                    disableSelectionOnClick
                    autoHeight
                    onCellClick={row => {
                        if (row.field === "view") {
                            navigateToOrderDetailsPage(row.id.toString());
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
            <Box ref={carryingStageRef} />
            <Typography className="text-camel" variant="h5" margin={5} mb={0}>
                Đang nhận hàng / chờ đóng gói
            </Typography>
            <Box p={4}>
                <DataGrid
                    getRowId={row => row.id}
                    rows={carryingOrders}
                    columns={orderColumns}
                    disableSelectionOnClick
                    autoHeight
                    onCellClick={row => {
                        if (row.field === "view") {
                            navigateToOrderDetailsPage(row.id.toString());
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
            <Box ref={packingStageRef} />
            <Typography className="text-camel" variant="h5" margin={5} mb={0}>
                Đang đóng gói / chờ giao hàng
            </Typography>
            <Box p={4}>
                <DataGrid
                    getRowId={row => row.id}
                    rows={packagingOrders}
                    columns={orderColumns}
                    disableSelectionOnClick
                    autoHeight
                    onCellClick={row => {
                        if (row.field === "view") {
                            navigateToOrderDetailsPage(row.id.toString());
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
            <Box ref={deliveringStageRef} />
            <Typography className="text-camel" variant="h5" margin={5} mb={0}>
                Đang giao hàng
            </Typography>
            <Box p={4}>
                <DataGrid
                    getRowId={row => row.id}
                    rows={deliveringOrders}
                    columns={orderColumns}
                    disableSelectionOnClick
                    autoHeight
                    onCellClick={row => {
                        if (row.field === "view") {
                            navigateToOrderDetailsPage(row.id.toString());
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
            <Box ref={successStageRef} />
            <Typography className="text-camel" variant="h5" margin={5} mb={0}>
                Đã giao hàng
            </Typography>
            <Box p={4}>
                <DataGrid
                    getRowId={row => row.id}
                    rows={successOrders}
                    columns={orderColumns}
                    disableSelectionOnClick
                    autoHeight
                    onCellClick={row => {
                        if (row.field === "view") {
                            navigateToOrderDetailsPage(row.id.toString());
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
            <SpeedDialNavigator actions={actions} />
        </Box>
    );
};

export default BuyingDashboard;
