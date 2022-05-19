import { Box, Button, Grid, Typography } from "@mui/material";
import { compareAsc, format } from "date-fns";
import { vi } from "date-fns/locale";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import Cookies from "universal-cookie";
import { LineChartValue } from ".";
import { DataGrid, GridToolbar, GridColDef } from "@mui/x-data-grid";
import {
    RequestContext,
    RequestValueResponseInitializer,
    SearchResult,
    SubrequestResponseValueInitializer,
} from "../src/context/RequestContext";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
} from "chart.js";

interface PairData {
    productName: string;
    buying: LineChartValue;
    selling: LineChartValue;
    buyingTotal: LineChartValue;
    sellingTotal: LineChartValue;
    currentSellingRequest: any[];
    currentBuyingRequest: any[];
}

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SearchResultPage = () => {
    const router = useRouter();
    const cookie = new Cookies();
    const dateFormat = "dd/MM/yyyy HH:mm";
    const currentDate = new Date(Date.now());
    const targetDateBegin = new Date(new Date(currentDate).setDate(new Date(currentDate).getDate() - 30));
    const buyingOrderLineChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "Mua vào",
            },
        },
    };
    const sellingOrderLineChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "Bán ra",
            },
        },
    };
    const { searchResult, loadSearchResult } = useContext(RequestContext);
    const [lineChartValues, setLineChartValues] = useState<PairData[]>([]);
    const [lineChartLabels, setLineChartLabels] = useState<string[]>([]);

    const buyingRequestColumns: GridColDef[] = [
        { field: "id", headerName: "id", width: 100 },
        { field: "createdBy", headerName: "Đăng bởi", width: 150 },
        { field: "specificProductName", headerName: "Tên nông sản", width: 150 },
        { field: "price", headerName: "Giá", width: 100 },
        { field: "quantity", headerName: "Số lượng", width: 100 },
        { field: "dateCompletedOrder", headerName: "Ngày hoàn thành", width: 200 },
        { field: "expiredDate", headerName: "Ngày nhận hàng", width: 200 },
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

    const sellingRequestColumns: GridColDef[] = [
        { field: "id", headerName: "id", width: 100 },
        { field: "createdBy", headerName: "Đăng bởi", width: 150 },
        { field: "specificProductName", headerName: "Tên nông sản", width: 150 },
        { field: "price", headerName: "Giá", width: 100 },
        { field: "quantity", headerName: "Số lượng", width: 100 },
        { field: "expiredDate", headerName: "Ngày hoàn thành", width: 200 },
        { field: "dateCompletedOrder", headerName: "Ngày giao hàng", width: 200 },
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
        const search = typeof router.query["search"] === "string" ? router.query["search"] : cookie.get("search");
        if (typeof search === "string") {
            loadSearchResult(search, targetDateBegin, currentDate);
        }
        return () => {
            cookie.remove("search");
        };
    }, [router.query["search"]]);

    useEffect(() => {
        let calculateDate = targetDateBegin;
        let temporaryLabelArray: string[] = [];
        while (compareAsc(calculateDate, currentDate) === -1) {
            temporaryLabelArray.push(format(new Date(calculateDate), "dd/MM", { locale: vi }));
            if (
                compareAsc(
                    new Date(new Date(calculateDate).setDate(new Date(calculateDate).getDate() + 3)),
                    currentDate
                ) !== -1
            ) {
                calculateDate = new Date(Date.now());
            } else {
                calculateDate = new Date(new Date(calculateDate).setDate(new Date(calculateDate).getDate() + 3));
            }
        }
        setLineChartLabels(temporaryLabelArray);
        temporaryLabelArray = [];
        let transitoryLineChartValues: PairData[] = [];
        searchResult.forEach((data: SearchResult) => {
            const filteredBuyingRequest = data.requests.filter(item => item.type === "buying");
            const filteredSellingRequest = data.requests.filter(item => item.type === "selling");
            const filteredBuyingSubrequest = data.subrequests.filter(item => item.transactionType === "selling");
            const filteredSellingSubrequest = data.subrequests.filter(item => item.transactionType === "buying");
            const transitoryPriceBuyingRequest: number[] = [];
            const transitoryPriceSellingRequest: number[] = [];
            const transitoryPriceSuccessBuyingSubrequest: number[] = [];
            const transitoryPriceSuccessSellingSubrequest: number[] = [];
            const transitoryTotalBuyingRequest: number[] = [];
            const transitoryTotalSellingRequest: number[] = [];
            let calculateDate = targetDateBegin;
            const currentBuyingRequest = filteredBuyingRequest
                .filter(
                    request =>
                        compareAsc(new Date(request.expiredDate), new Date(Date.now())) !== -1 &&
                        request.status !== "success" &&
                        request.isConfirmed
                )
                .map((request: RequestValueResponseInitializer) => {
                    const { id, owner, specificProductName, price, quantity, expiredDate } = request;
                    return {
                        id,
                        createdBy: owner.username,
                        specificProductName,
                        price,
                        quantity,
                        expiredDate: format(new Date(expiredDate), dateFormat),
                        dateCompletedOrder: format(
                            new Date(new Date(expiredDate).setHours(new Date(expiredDate).getHours() - 12)),
                            dateFormat
                        ),
                    };
                });
            const currentSellingRequest = filteredSellingRequest
                .filter(
                    request =>
                        compareAsc(new Date(request.expiredDate), new Date(Date.now())) !== -1 &&
                        request.status !== "success" &&
                        request.isConfirmed
                )
                .map((request: RequestValueResponseInitializer) => {
                    const { id, owner, specificProductName, price, quantity, expiredDate } = request;
                    return {
                        id,
                        createdBy: owner.username,
                        specificProductName,
                        price,
                        quantity,
                        expiredDate: format(new Date(expiredDate), dateFormat),
                        dateCompletedOrder: format(
                            new Date(new Date(expiredDate).setHours(new Date(expiredDate).getHours() + 12)),
                            dateFormat
                        ),
                    };
                });
            while (compareAsc(calculateDate, currentDate) === -1) {
                const previousCalculateDate = new Date(
                    new Date(calculateDate).setDate(new Date(calculateDate).getDate() - 3)
                );
                temporaryLabelArray.push(format(new Date(calculateDate), "dd/MM", { locale: vi }));
                const filteredByDateBuyingRequest = filteredBuyingRequest.filter(
                    (request: RequestValueResponseInitializer) =>
                        compareAsc(new Date(request.createdDate), new Date(calculateDate)) === -1 &&
                        compareAsc(new Date(previousCalculateDate), new Date(request.createdDate)) === -1
                );
                const filteredByDateSellingRequest = filteredSellingRequest.filter(
                    (request: RequestValueResponseInitializer) =>
                        compareAsc(new Date(request.createdDate), new Date(calculateDate)) === -1 &&
                        compareAsc(new Date(previousCalculateDate), new Date(request.createdDate)) === -1
                );
                const filteredByDateBuyingSubrequest = filteredBuyingSubrequest.filter(
                    (request: SubrequestResponseValueInitializer) =>
                        compareAsc(new Date(request.createdDate), new Date(calculateDate)) === -1 &&
                        compareAsc(new Date(previousCalculateDate), new Date(request.createdDate)) === -1
                );
                const filteredByDateSellingSubrequest = filteredSellingSubrequest.filter(
                    (request: SubrequestResponseValueInitializer) =>
                        compareAsc(new Date(request.createdDate), new Date(calculateDate)) === -1 &&
                        compareAsc(new Date(previousCalculateDate), new Date(request.createdDate)) === -1
                );
                const sellingRequestAvgPrice =
                    filteredByDateSellingRequest.length === 0
                        ? 0
                        : filteredByDateSellingRequest
                              .map(request => request.price)
                              .reduce((prev, next) => prev + next) / filteredByDateSellingRequest.length;
                const buyingRequestAvgPrice =
                    filteredByDateBuyingRequest.length === 0
                        ? 0
                        : filteredByDateBuyingRequest
                              .map(request => request.price)
                              .reduce((prev, next) => prev + next) / filteredByDateBuyingRequest.length;
                const sellingRequestQuantity = filteredByDateSellingRequest.length
                    ? filteredByDateSellingRequest
                          .map(request => request.quantity + request.process)
                          .reduce((prev, next) => prev + next)
                    : 0;
                const buyingRequestQuantity = filteredByDateBuyingRequest.length
                    ? filteredByDateBuyingRequest
                          .map(request => request.quantity + request.process)
                          .reduce((prev, next) => prev + next)
                    : 0;
                const buyingSubrequestSuccess = filteredByDateBuyingSubrequest
                    .filter(request => request.status === "success")
                    .map(request => request.price);
                const buyingSubrequestSuccessAvgPrice =
                    buyingSubrequestSuccess.length === 0
                        ? 0
                        : buyingSubrequestSuccess.reduce((prev, next) => prev + next) / buyingSubrequestSuccess.length;
                const sellingSubrequestSuccess = filteredByDateSellingSubrequest
                    .filter(request => request.status === "success")
                    .map(request => request.price);
                const sellingSubrequestSuccessAvgPrice =
                    sellingSubrequestSuccess.length === 0
                        ? 0
                        : sellingSubrequestSuccess.reduce((prev, next) => prev + next) /
                          sellingSubrequestSuccess.length;
                transitoryPriceBuyingRequest.push(
                    buyingRequestAvgPrice === 0 && transitoryPriceBuyingRequest.length > 0
                        ? transitoryPriceBuyingRequest[transitoryPriceBuyingRequest.length - 1]
                        : buyingRequestAvgPrice
                );
                transitoryPriceSellingRequest.push(
                    sellingRequestAvgPrice === 0 && transitoryPriceSellingRequest.length > 0
                        ? transitoryPriceSellingRequest[transitoryPriceSellingRequest.length - 1]
                        : sellingRequestAvgPrice
                );
                transitoryPriceSuccessBuyingSubrequest.push(
                    buyingSubrequestSuccessAvgPrice === 0 && transitoryPriceSuccessBuyingSubrequest.length > 0
                        ? transitoryPriceSuccessBuyingSubrequest[transitoryPriceSuccessBuyingSubrequest.length - 1]
                        : buyingSubrequestSuccessAvgPrice
                );
                transitoryPriceSuccessSellingSubrequest.push(
                    sellingSubrequestSuccessAvgPrice === 0 && transitoryPriceSuccessSellingSubrequest.length > 0
                        ? transitoryPriceSuccessSellingSubrequest[transitoryPriceSuccessSellingSubrequest.length - 1]
                        : sellingSubrequestSuccessAvgPrice
                );
                transitoryTotalSellingRequest.push(sellingRequestQuantity);
                transitoryTotalBuyingRequest.push(buyingRequestQuantity);
                if (
                    compareAsc(
                        new Date(new Date(calculateDate).setDate(new Date(calculateDate).getDate() + 3)),
                        currentDate
                    ) !== -1
                ) {
                    calculateDate = new Date(Date.now());
                } else {
                    calculateDate = new Date(new Date(calculateDate).setDate(new Date(calculateDate).getDate() + 3));
                }
            }
            const transitoryPairValues: PairData = {
                productName: data.requests[0].productName,
                buying: {
                    labels: lineChartLabels,
                    datasets: [
                        {
                            data: transitoryPriceBuyingRequest,
                            backgroundColor: "rgb(255, 99, 132)",
                            borderColor: "rgb(255, 99, 132,0.5)",
                            label: "Giá yêu cầu trung bình",
                        },
                        {
                            data: transitoryPriceSuccessBuyingSubrequest,
                            backgroundColor: "rgb(53, 162, 235)",
                            borderColor: "rgba(53, 162, 235,0.5)",
                            label: "Giá yêu cầu thành công",
                        },
                    ],
                },
                selling: {
                    labels: lineChartLabels,
                    datasets: [
                        {
                            data: transitoryPriceSellingRequest,
                            backgroundColor: "rgb(255, 99, 132)",
                            borderColor: "rgb(255, 99, 132,0.5)",
                            label: "Giá yêu cầu trung bình",
                        },
                        {
                            data: transitoryPriceSuccessSellingSubrequest,
                            backgroundColor: "rgb(53, 162, 235)",
                            borderColor: "rgba(53, 162, 235,0.5)",
                            label: "Giá yêu cầu thành công",
                        },
                    ],
                },
                buyingTotal: {
                    datasets: [
                        {
                            data: transitoryTotalBuyingRequest,
                            backgroundColor: "rgb(235, 229, 52)",
                            borderColor: "rgba(235, 229, 52, 0.5)",
                            label: "Tổng số lượng giao dịch",
                        },
                    ],
                    labels: lineChartLabels,
                },
                sellingTotal: {
                    datasets: [
                        {
                            data: transitoryTotalSellingRequest,
                            backgroundColor: "rgb(235, 229, 52)",
                            borderColor: "rgba(235, 229, 52, 0.5)",
                            label: "Tổng số lượng giao dịch",
                        },
                    ],
                    labels: lineChartLabels,
                },
                currentBuyingRequest,
                currentSellingRequest,
            };
            transitoryLineChartValues.push(transitoryPairValues);
        });
        setLineChartValues(transitoryLineChartValues);
        transitoryLineChartValues = [];
    }, [searchResult]);
    const renderData = () => {
        return lineChartValues.map((item: PairData, index: number) => {
            return (
                <Box key={index}>
                    <Typography variant="h2" textAlign="center">
                        {item.productName}
                    </Typography>
                    <Grid container>
                        <Grid item md={6} sm={12}>
                            <Line options={buyingOrderLineChartOptions} data={item.buying}></Line>
                        </Grid>
                        <Grid item md={6} sm={12}>
                            <Line
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: "top" as const,
                                        },
                                        title: {
                                            display: true,
                                            text: "Tổng số lượng yêu cầu",
                                        },
                                    },
                                }}
                                data={item.buyingTotal}
                            ></Line>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item md={6} sm={12}>
                            <Line options={sellingOrderLineChartOptions} data={item.selling}></Line>
                        </Grid>
                        <Grid item md={6} sm={12}>
                            <Line
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: "top" as const,
                                        },
                                        title: {
                                            display: true,
                                            text: "Tổng số lượng yêu cầu",
                                        },
                                    },
                                }}
                                data={item.sellingTotal}
                            ></Line>
                        </Grid>
                    </Grid>
                    <Typography variant="h5" textAlign="center">
                        Yêu cầu mua vào đang có trên hệ thống
                    </Typography>
                    <DataGrid
                        getRowId={row => row.id}
                        rows={item.currentBuyingRequest}
                        columns={buyingRequestColumns}
                        disableSelectionOnClick
                        autoHeight
                        onCellClick={row => {
                            if (row.field === "view") {
                                cookie.remove("pid");
                                cookie.set("pid", row.id.toString());
                                router.push(`/my_request/details/buying?id=${row.id.toString()}`);
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
                    <Typography variant="h5" textAlign="center">
                        Yêu cầu bán ra đang có trên hệ thống
                    </Typography>
                    <DataGrid
                        getRowId={row => row.id}
                        rows={item.currentSellingRequest}
                        columns={sellingRequestColumns}
                        disableSelectionOnClick
                        autoHeight
                        onCellClick={row => {
                            if (row.field === "view") {
                                cookie.remove("pid");
                                cookie.set("pid", row.id.toString());
                                router.push(`/my_request/details/selling?id=${row.id.toString()}`);
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
            );
        });
    };

    return <>{renderData()}</>;
};

export default SearchResultPage;
