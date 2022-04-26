import React, { useContext, useEffect, useState } from "react";
import { RequestContext, RequestValueResponseInitializer } from "../../src/context/RequestContext";
import { DataGrid, GridToolbar, GridColDef } from "@mui/x-data-grid";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Box, Button, Chip, Typography } from "@mui/material";
import Cookies from "universal-cookie";
import { useRouter } from "next/router";
import { compareAsc } from "date-fns";

const MyBuyingRequest = () => {
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
    const [mappedDataUnconfirmedRequests, setMappedDataUnconfirmedRequests] = useState<any[]>([]);
    const [mappedDataConfirmedRequests, setMappedDataConfirmedRequests] = useState<any[]>([]);
    const [mappedDataDatedRequests, setMappedDataDatedRequests] = useState<any[]>([]);
    const rerenderRequestData = (type: "unconfirmed" | "confirmed", isDated?: boolean) => {
        const uid = cookie.get("uid");
        const mappedArray = type === "unconfirmed" ? unconfirmedRequests : confirmedRequests;
        const mappedData = mappedArray
            .filter((request: RequestValueResponseInitializer) => {
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
                    (uid && uid === request.owner.id && request.status === "cancel")
                );
            })
            .map((request: RequestValueResponseInitializer) => {
                const { specificProductName, price, quantity, createdDate, expiredDate, status, id, isConfirmed } =
                    request;
                return {
                    id,
                    specificProductName,
                    price,
                    quantity,
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
        getUnconfirmedRequests("buying", true);
        getConfirmedRequests("buying", true);
        getAllRequestImage("request", "buying");
        getAllRequestImage("subrequest", "selling");
        getAllSubrequest("selling");
    }, []);

    useEffect(() => {
        rerenderRequestData("confirmed");
        rerenderRequestData("unconfirmed");
        rerenderRequestData("unconfirmed", true);
    }, [confirmedRequests, unconfirmedRequests]);

    const requestDataGridColumn: GridColDef[] = [
        { field: "id", headerName: "id", width: 100 },
        { field: "specificProductName", headerName: "Tên nông sản", width: 150 },
        { field: "price", headerName: "Giá", width: 100 },
        { field: "quantity", headerName: "Số lượng", width: 100 },
        { field: "createdDate", headerName: "Ngày tạo", width: 200 },
        { field: "expiredDate", headerName: "Ngày giao hàng", width: 200 },
        {
            field: "status",
            headerName: "Trạng thái",
            renderCell: params => {
                return params.value;
            },
            width: 150,
        },
        {
            field: "view",
            headerName: "",
            width: 150,
            renderCell: () => {
                return (
                    <Button onClick={() => {}} variant="contained" color="info">
                        Xem yêu cầu
                    </Button>
                );
            },
        },
    ];

    return (
        <>
            <Typography className="text-camel" textAlign="center" variant="h3" margin={8}>
                Yêu cầu mua của bạn
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
                    onCellClick={row => {
                        if (row.field === "view") {
                            cookie.remove("pid");
                            cookie.set("pid", row.id);
                            router.push(`/my_request/details/buying?id=${row.id}`);
                        }
                    }}
                    pageSize={10}
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
                    pageSize={10}
                    onCellClick={row => {
                        if (row.field === "view") {
                            cookie.remove("pid");
                            cookie.set("pid", row.id);
                            router.push(`/my_request/details/buying?id=${row.id}`);
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
                            router.push(`/my_request/details/buying?id=${row.id}`);
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
        </>
    );
};

export default MyBuyingRequest;
