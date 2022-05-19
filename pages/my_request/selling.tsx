import React, { useContext, useEffect, useRef, useState } from "react";
import { RequestContext, RequestValueResponseInitializer } from "../../src/context/RequestContext";
import { DataGrid, GridToolbar, GridColDef } from "@mui/x-data-grid";
import { compareAsc, formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Box, Button, Chip, Typography } from "@mui/material";
import Cookies from "universal-cookie";
import { useRouter } from "next/router";
import { DialAction } from "../../src/context/LayoutContext";
import { FiClock } from "react-icons/fi";
import { BsPatchCheck } from "react-icons/bs";
import { MdOutlineCancel } from "react-icons/md";
import SpeedDialNavigator from "../../src/components/layouts/navigation_bar/SpeedDialNavigator";
import NumberFormat from "react-number-format";

const MySellingRequest = () => {
    const {
        confirmedRequests,
        unconfirmedRequests,
        getUnconfirmedRequests,
        getConfirmedRequests,
        getAllRequestImage,
        getAllSubrequest,
    } = useContext(RequestContext);
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
    const rerenderRequestData = (type: "unconfirmed" | "confirmed", isDated?: boolean) => {
        const mappedArray = type === "unconfirmed" ? unconfirmedRequests : confirmedRequests;
        const mappedData = mappedArray
            .filter((request: RequestValueResponseInitializer) => {
                const uid = cookie.get("uid");
                if (type === "unconfirmed" && !isDated) {
                    return (
                        uid &&
                        uid === request.owner.id &&
                        compareAsc(
                            new Date(Date.now()),
                            new Date(request.expiredDate).setDate(new Date(request.expiredDate).getDate() - 1)
                        ) === -1 &&
                        request.status !== "cancel"
                    );
                }
                if (type === "confirmed") {
                    return uid && uid === request.owner.id && request.status !== "cancel";
                }
                return (
                    (uid &&
                        uid === request.owner.id &&
                        compareAsc(
                            new Date(Date.now()),
                            new Date(request.expiredDate).setDate(new Date(request.expiredDate).getDate() - 1)
                        ) !== -1) ||
                    (request.status === "cancel" && uid && uid === request.owner.id)
                );
            })
            .map((request: RequestValueResponseInitializer) => {
                const {
                    specificProductName,
                    price,
                    quantity,
                    createdDate,
                    expiredDate,
                    status,
                    id,
                    isConfirmed,
                    process,
                } = request;
                return {
                    id,
                    specificProductName,
                    price,
                    quantity: quantity + process,
                    createdDate: formatDistanceToNow(new Date(createdDate), { addSuffix: true, locale: vi }),
                    expiredDate: formatDistanceToNow(new Date(expiredDate), { addSuffix: true, locale: vi }),
                    status: (
                        <Chip
                            label={
                                isConfirmed
                                    ? compareAsc(
                                          new Date(expiredDate).setDate(new Date(expiredDate).getDate() - 1),
                                          new Date(Date.now())
                                      ) === -1
                                        ? status !== "success"
                                            ? "Đã đóng"
                                            : "Đã đủ số lượng"
                                        : status !== "success"
                                        ? "Đang thực hiện"
                                        : "Đã đủ số lượng"
                                    : "Chưa bắt đầu"
                            }
                            color={
                                status !== "success"
                                    ? compareAsc(
                                          new Date(expiredDate).setDate(new Date(expiredDate).getDate() - 1),
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
        getUnconfirmedRequests("selling", true);
        getConfirmedRequests("selling", true);
        getAllRequestImage("request", "selling");
        getAllRequestImage("subrequest", "buying");
        getAllSubrequest("buying");
    }, []);

    useEffect(() => {
        rerenderRequestData("confirmed");
        rerenderRequestData("unconfirmed");
        rerenderRequestData("unconfirmed", true);
    }, [confirmedRequests, unconfirmedRequests]);

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
        { field: "status", headerName: "Trạng thái", width: 150, renderCell: params => params.value },
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
                Yêu cầu bán của bạn
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
                    pagination
                    pageSize={10}
                    onCellClick={row => {
                        if (row.field === "view") {
                            cookie.remove("pid");
                            cookie.set("pid", row.id);
                            router.push(`/my_request/details/selling?id=${row.id}`);
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
                    rowsPerPageOptions={[5, 10, 15]}
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
                    pagination
                    onCellClick={row => {
                        if (row.field === "view") {
                            cookie.remove("pid");
                            cookie.set("pid", row.id);
                            router.push(`/my_request/details/selling?id=${row.id}`);
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
                    rowsPerPageOptions={[5, 10, 15]}
                />
            </Box>
            <Box ref={datedComponentRef} />
            <Typography className="text-camel" variant="h5" margin={5} mb={0}>
                Đã quá thời gian phê duyệt / Đã huỷ
            </Typography>
            <Box p={4}>
                <DataGrid
                    getRowId={row => row.id}
                    rows={mappedDataDatedRequests}
                    columns={requestDataGridColumn}
                    disableSelectionOnClick
                    autoHeight
                    pagination
                    onCellClick={row => {
                        if (row.field === "view") {
                            cookie.remove("pid");
                            cookie.set("pid", row.id);
                            router.push(`/my_request/details/selling?id=${row.id}`);
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
                    rowsPerPageOptions={[5, 10, 15]}
                />
            </Box>
            <SpeedDialNavigator actions={actions} />
        </>
    );
};

export default MySellingRequest;
