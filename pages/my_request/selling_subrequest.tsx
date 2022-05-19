import React, { useContext, useEffect, useRef, useState } from "react";
import { RequestContext, SubrequestResponseValueInitializer } from "../../src/context/RequestContext";
import { DataGrid, GridToolbar, GridColDef } from "@mui/x-data-grid";
import { compareAsc, formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Box, Button, Chip, Typography } from "@mui/material";
import Cookies from "universal-cookie";
import { useRouter } from "next/router";
import { AuthContext } from "../../src/context/AuthContext";
import { DialAction } from "../../src/context/LayoutContext";
import { FiClock } from "react-icons/fi";
import { BsPatchCheck } from "react-icons/bs";
import { MdOutlineCancel } from "react-icons/md";
import SpeedDialNavigator from "../../src/components/layouts/navigation_bar/SpeedDialNavigator";
import NumberFormat from "react-number-format";

const SellingSubRequest = () => {
    const { subrequests, getAllRequestImage, getAllSubrequest } = useContext(RequestContext);
    const { userInfo, getUserInformation } = useContext(AuthContext);
    const cookie = new Cookies();
    const router = useRouter();
    const unconfirmedComponentRef = useRef<HTMLInputElement | null>(null);
    const confirmedComponentRef = useRef<HTMLInputElement | null>(null);
    const datedComponentRef = useRef<HTMLInputElement | null>(null);
    const actions: DialAction[] = [
        {
            icon: <FiClock />,
            title: "Đang chờ phê duyệt",
            ref: unconfirmedComponentRef,
        },
        { icon: <BsPatchCheck />, title: "Đã được phê duyệt", ref: confirmedComponentRef },
        { icon: <MdOutlineCancel />, title: "Đã quá thời hạn phê duyệt, đã huỷ", ref: datedComponentRef },
    ];
    const [mappedDataUnconfirmedRequests, setMappedDataUnconfirmedRequests] = useState<any[]>([]);
    const [mappedDataConfirmedRequests, setMappedDataConfirmedRequests] = useState<any[]>([]);
    const [mappedDataDatedRequests, setMappedDataDatedRequests] = useState<any[]>([]);
    useEffect(() => {
        getAllRequestImage("subrequest", "selling");
        getUserInformation();
    }, []);

    useEffect(() => {
        if (userInfo && userInfo.id) {
            getAllSubrequest("selling", userInfo.id);
        }
    }, [userInfo]);
    const rerenderRequestData = (type: "unconfirmed" | "confirmed", isDated?: boolean) => {
        const unconfirmedRequests = subrequests.filter((request: SubrequestResponseValueInitializer) => {
            return (
                request.status !== "success" &&
                compareAsc(
                    new Date(request.completedDateOrder).setHours(new Date(request.completedDateOrder).getHours() - 12),
                    new Date(Date.now())
                ) !== -1 &&
                request.status !== "refused"
            );
        });
        const datedRequest = subrequests.filter((request: SubrequestResponseValueInitializer) => {
            return (
                (request.status !== "success" &&
                    compareAsc(
                        new Date(request.completedDateOrder).setHours(
                            new Date(request.completedDateOrder).getHours() - 12
                        ),
                        new Date(Date.now())
                    ) === -1) ||
                request.status === "refused"
            );
        });
        const confirmedRequests = subrequests.filter((request: SubrequestResponseValueInitializer) => {
            return request.status === "success";
        });
        const mappedArray = type === "unconfirmed" ? (isDated ? datedRequest : unconfirmedRequests) : confirmedRequests;
        const mappedData = mappedArray.map((request: SubrequestResponseValueInitializer) => {
            const { specificProductName, price, quantity, createdDate, completedDateOrder, status, id } = request;
            return {
                id,
                specificProductName,
                price,
                quantity,
                createdDate: formatDistanceToNow(new Date(createdDate), { addSuffix: true, locale: vi }),
                expiredDate: formatDistanceToNow(new Date(completedDateOrder), { addSuffix: true, locale: vi }),
                status: (
                    <Chip
                        label={
                            status !== "success"
                                ? compareAsc(
                                      new Date(completedDateOrder).setHours(
                                          new Date(completedDateOrder).getHours() - 12
                                      ),
                                      new Date(Date.now())
                                  ) === -1
                                    ? status === "waiting"
                                        ? "Quá hạn phê duyệt"
                                        : "Đã huỷ"
                                    : status === "waiting"
                                    ? "Đang chờ phê duyệt"
                                    : "Đã huỷ"
                                : "Đã phê duyệt"
                        }
                        color={
                            status !== "success"
                                ? compareAsc(
                                      new Date(completedDateOrder).setHours(
                                          new Date(completedDateOrder).getHours() - 12
                                      ),
                                      new Date(Date.now())
                                  ) === -1
                                    ? "error"
                                    : "warning"
                                : "success"
                        }
                    />
                ),
            };
        });
        type === "unconfirmed"
            ? !isDated
                ? setMappedDataUnconfirmedRequests(mappedData)
                : setMappedDataDatedRequests(mappedData)
            : setMappedDataConfirmedRequests(mappedData);
    };

    useEffect(() => {
        rerenderRequestData("confirmed");
        rerenderRequestData("unconfirmed");
        rerenderRequestData("unconfirmed", true);
    }, [subrequests]);

    const requestDataGridColumn: GridColDef[] = [
        { field: "id", headerName: "id", width: 100 },
        { field: "specificProductName", headerName: "Tên nông sản", width: 150 },
        {
            field: "price",
            headerName: "Giá",
            width: 100,
            renderCell: params => (
                <NumberFormat value={params.value} displayType="text" thousandSeparator={true} suffix="VND" />
            ),
        },
        {
            field: "quantity",
            headerName: "Số lượng",
            width: 100,
            renderCell: params => <NumberFormat value={params.value} displayType="text" thousandSeparator={true} />,
        },
        { field: "createdDate", headerName: "Ngày tạo", width: 200 },
        { field: "expiredDate", headerName: "Ngày giao hàng", width: 200 },
        { field: "status", headerName: "Trạng thái", width: 180, renderCell: params => params.value },
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

    return (
        <>
            <Box ref={unconfirmedComponentRef} />
            <Typography className="text-camel" textAlign="center" variant="h3" margin={8}>
                Yêu cầu bán của bạn tới người dùng khác
            </Typography>
            <Typography className="text-camel" variant="h5" margin={5} mb={0}>
                Đang chờ phê duyệt
            </Typography>
            <Box p={4}>
                <DataGrid
                    getRowId={row => row.id}
                    rows={mappedDataUnconfirmedRequests}
                    columns={requestDataGridColumn}
                    disableSelectionOnClick
                    autoHeight
                    pageSize={10}
                    rowsPerPageOptions={[5, 10, 20]}
                    pagination
                    onCellClick={row => {
                        if (row.field === "view") {
                            cookie.remove("pid");
                            cookie.set("pid", row.id);
                            router.push(`/my_request/details/selling_request_for_buying?id=${row.id}`);
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
                />
            </Box>
            <Box ref={confirmedComponentRef} />
            <Typography className="text-camel" variant="h5" margin={5} mb={0}>
                Đã được phê duyệt
            </Typography>
            <Box p={4}>
                <DataGrid
                    getRowId={row => row.id}
                    rows={mappedDataConfirmedRequests}
                    columns={requestDataGridColumn}
                    disableSelectionOnClick
                    autoHeight
                    onCellClick={row => {
                        if (row.field === "view") {
                            cookie.remove("pid");
                            cookie.set("pid", row.id);
                            router.push(`/my_request/details/selling_request_for_buying?id=${row.id}`);
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
            <Box ref={datedComponentRef} />
            <Typography className="text-camel" variant="h5" margin={5} mb={0}>
                Đã quá thời gian phê duyệt
            </Typography>
            <Box p={4}>
                <DataGrid
                    getRowId={row => row.id}
                    rows={mappedDataDatedRequests}
                    columns={requestDataGridColumn}
                    disableSelectionOnClick
                    autoHeight
                    pageSize={10}
                    rowsPerPageOptions={[5, 10, 20]}
                    pagination
                    onCellClick={row => {
                        if (row.field === "view") {
                            cookie.remove("pid");
                            cookie.set("pid", row.id);
                            router.push(`/my_request/details/selling_request_for_buying?id=${row.id}`);
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
                />
            </Box>
            <SpeedDialNavigator actions={actions} />
        </>
    );
};

export default SellingSubRequest;
