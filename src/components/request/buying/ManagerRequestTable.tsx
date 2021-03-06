import { Box, Button, Chip, Grid, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import {
    RequestContext,
    RequestImage,
    RequestValueResponseInitializer,
    TransactionType,
} from "../../../context/RequestContext";
import { ProductContext } from "../../../context/ProductContext";
import { formatDistanceToNow } from "date-fns";
import vi from "date-fns/locale/vi";
import NoThumbnailImage from "../../../../public/assets/default-thumbnail.jpeg";
import { AuthContext } from "../../../context/AuthContext";
import { compareAsc } from "date-fns";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import Cookies from "universal-cookie";
import { useRouter } from "next/router";
import Image from "next/image";
import NumberFormat from "react-number-format";

interface ManagerBuyingRequestTableProps {
    type: TransactionType;
}

const ManagerBuyingRequestTable = ({ type }: ManagerBuyingRequestTableProps) => {
    const cookie = new Cookies();
    const router = useRouter();
    const { confirmedRequests, unconfirmedRequests, requestImages } = useContext(RequestContext);
    const { renderUserAddress } = useContext(AuthContext);
    const { getProduct } = useContext(ProductContext);
    const [mappedDataUnconfirmedRequests, setMappedDataUnconfirmedRequests] = useState<any[]>([]);
    const [mappedDataConfirmedRequests, setMappedDataConfirmedRequests] = useState<any[]>([]);
    const [mappedDataDatedRequests, setMappedDataDatedRequests] = useState<any[]>([]);

    useEffect(() => {
        renderUserAddress();
        getProduct();
    }, []);

    useEffect(() => {
        reRenderRequestCard(true);
        reRenderRequestCard(false, true);
        reRenderRequestCard(false, false);
    }, [unconfirmedRequests, confirmedRequests]);

    const requestDataGridColumn: GridColDef[] = [
        { field: "id", headerName: "id", width: 100 },
        {
            field: "thumbnail",
            headerName: "",
            renderCell: params => {
                return (
                    <Image
                        className="deep-element"
                        width={60}
                        height={60}
                        src={params.value === "none" ? NoThumbnailImage : params.value}
                    ></Image>
                );
            },
        },
        { field: "specificProductName", headerName: "T??n n??ng s???n", width: 150 },
        { field: "username", headerName: "T???o b???i", width: 150 },
        { field: "price", headerName: "Gi??", width: 100, renderCell: params => params.value },
        { field: "quantity", headerName: "S??? l?????ng", width: 100 },
        { field: "createdDate", headerName: "Ng??y t???o", width: 200 },
        { field: "expiredDate", headerName: "Ng??y giao h??ng", width: 200 },
        {
            field: "status",
            headerName: "Tr???ng th??i",
            width: 150,
            cellClassName: "status-color",
            renderCell: params => params.value,
        },
        {
            field: "view",
            headerName: "",
            width: 150,
            renderCell: () => {
                return (
                    <Button variant="contained" color="info">
                        Xem y??u c???u
                    </Button>
                );
            },
        },
    ];

    const reRenderRequestCard = (isRenderingConfirmedRequest: boolean, isDated?: boolean) => {
        const isDatedRequest = unconfirmedRequests.filter((request: RequestValueResponseInitializer) => {
            const { expiredDate, status } = request;
            return (
                compareAsc(new Date(expiredDate).setDate(new Date(expiredDate).getDate() - 1), new Date(Date.now())) ===
                    -1 || status === "cancel"
            );
        });

        const waitingRequest = unconfirmedRequests.filter((request: RequestValueResponseInitializer) => {
            const { expiredDate } = request;
            return (
                compareAsc(new Date(expiredDate).setDate(new Date(expiredDate).getDate() - 1), new Date(Date.now())) ===
                1
            );
        });

        const mappingList = isRenderingConfirmedRequest ? confirmedRequests : isDated ? isDatedRequest : waitingRequest;
        const mappedList = mappingList.map((item: RequestValueResponseInitializer, index) => {
            const {
                id,
                specificProductName,
                quantity,
                expiredDate,
                price,
                status,
                createdDate,
                owner,
                measure,
                process,
            } = item;
            const images = requestImages
                .filter((image: RequestImage) => {
                    return image.requestId === id;
                })
                .map((image: RequestImage) => {
                    return image.url;
                });
            return {
                id,
                thumbnail: images.length > 0 ? images[0] : "none",
                specificProductName,
                price: <NumberFormat value={price} thousandSeparator={true} displayType="text" suffix="VND" />,
                quantity: (quantity + process).toString() + " " + measure,
                createdDate: formatDistanceToNow(new Date(createdDate), { addSuffix: true, locale: vi }),
                expiredDate: formatDistanceToNow(new Date(expiredDate), { addSuffix: true, locale: vi }),
                status: (
                    <Chip
                        label={
                            status === "success" ? "???? ho??n th??nh" : status === "process" ? "??ang th???c hi???n" : "???? hu???"
                        }
                        color={status === "success" ? "success" : status === "process" ? "warning" : "error"}
                    />
                ),
                username: owner.username,
            };
        });

        if (isRenderingConfirmedRequest) {
            setMappedDataConfirmedRequests(mappedList);
        }
        if (!isRenderingConfirmedRequest && isDated) {
            setMappedDataDatedRequests(mappedList);
        }
        if (!isRenderingConfirmedRequest && !isDated) {
            setMappedDataUnconfirmedRequests(mappedList);
        }
    };
    return (
        <>
            <Box padding={8}>
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    className="text-uppercase"
                    textAlign="center"
                    marginBottom={4}
                >
                    Trang qu???n l?? y??u c???u thu mua n??ng s???n,
                    <br />
                    s???n ph???m t??? n??ng nghi???p
                </Typography>
                <Grid container>
                    <Grid item md={9}>
                        {/* <Box display="flex">
                        <TextField fullWidth />
                        <Button startIcon={<FiSearch />} variant="outlined" />
                    </Box> */}
                    </Grid>
                </Grid>
                <Typography variant="h5" fontWeight="bold" className="text-camel" textAlign="center">
                    Y??u c???u ch??a ???????c duy???t
                </Typography>
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
                            router.push(`/my_request/details/${type}?id=${row.id}`);
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
                ></DataGrid>
                <Typography
                    variant="h5"
                    fontWeight="bold"
                    className="text-camel"
                    textAlign="center"
                    marginTop={12}
                    marginBottom={4}
                >
                    Y??u c???u ???? ???????c duy???t
                </Typography>
                <DataGrid
                    getRowId={row => row.id}
                    rows={mappedDataConfirmedRequests}
                    columns={requestDataGridColumn}
                    disableSelectionOnClick
                    autoHeight
                    pageSize={10}
                    pagination
                    onCellClick={row => {
                        if (row.field === "view") {
                            cookie.remove("pid");
                            cookie.set("pid", row.id);
                            router.push(`/my_request/details/${type}?id=${row.id}`);
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
                ></DataGrid>
                <Typography
                    variant="h5"
                    fontWeight="bold"
                    className="text-camel"
                    textAlign="center"
                    marginTop={12}
                    marginBottom={4}
                >
                    Y??u c???u ???? qu?? h???n ph?? duy???t / ???? hu???
                </Typography>
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
                            router.push(`/my_request/details/${type}?id=${row.id}`);
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
                ></DataGrid>
            </Box>
        </>
    );
};

export default ManagerBuyingRequestTable;
