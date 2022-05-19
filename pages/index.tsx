import React, { useContext, useEffect, useState } from "react";
import type { NextPage } from "next";
import { OrderContext, OrderValueInitializer } from "../src/context/OrderContext";
import { AuthContext } from "../src/context/AuthContext";
import {
    Box,
    Button,
    ButtonGroup,
    Card,
    CardContent,
    Collapse,
    Grid,
    IconButton,
    IconButtonProps,
    MenuItem,
    Select,
    SelectChangeEvent,
    styled,
    TextField,
    Typography,
} from "@mui/material";
import { VscPackage } from "react-icons/vsc";
import NumberFormat from "react-number-format";
import { GiBoxUnpacking, GiFarmer, GiFlyingFlag, GiPriceTag } from "react-icons/gi";
import { RiShipLine } from "react-icons/ri";
import { MdOutlineCancel, MdOutlineLocalShipping, MdOutlineNotificationsActive } from "react-icons/md";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { AiOutlineArrowDown, AiOutlineDollar } from "react-icons/ai";
import {
    RequestContext,
    RequestValueResponseInitializer,
    SubrequestResponseValueInitializer,
} from "../src/context/RequestContext";
import { BsPatchCheck } from "react-icons/bs";
import { FiClock } from "react-icons/fi";
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
import { Line, Pie } from "react-chartjs-2";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import viLocale from "date-fns/locale/vi";
import { compareAsc, format } from "date-fns";
import vi from "date-fns/locale/vi";
interface OrderStatisticValue {
    totalOrder: number;
    totalPreparingOrder: number;
    totalGrabbingOrder: number;
    totalPackingOrder: number;
    totalDeliveringOrder: number;
    totalSuccessOrder: number;
    totalBudget: number;
    totalAmount: number;
    totalFee: number;
}

interface RequestStatisticValue {
    totalRequest: number;
    totalConfirmedRequest: number;
    totalUnconfirmedRequest: number;
    totalCancelRequest: number;
}

interface ChartData {
    data: number[];
    backgroundColor: string[] | string;
    borderColor: string[] | string;
    borderWidth: number;
    label: string;
}

interface ChartValue {
    labels: string[];
    datasets: ChartData[];
}

export interface LineChartData {
    data: number[];
    backgroundColor: string;
    borderColor: string;
    label: string;
}

export interface LineChartValue {
    labels: string[];
    datasets: LineChartData[];
}

interface LineChartDataValue {
    success: number[];
    total: number[];
    amount: number[];
}

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    // eslint-disable-next-line no-unused-vars
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
    }),
}));

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Home: NextPage = () => {
    const currentDate = new Date(Date.now());
    const buyingOrderLineChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "Đơn hàng mua vào",
            },
        },

        yAxes: [
            {
                ticks: {
                    callback: function (value: any) {
                        if (Number.isInteger(value)) {
                            return value;
                        }
                    },
                    beginAtZero: true,
                    stepSize: 1,
                },
            },
        ],
    };
    const sellingOrderLineChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "Đơn hàng bán ra",
            },
        },

        yAxes: [
            {
                ticks: {
                    callback: function (value: any) {
                        if (Number.isInteger(value)) {
                            return value;
                        }
                    },
                    beginAtZero: true,
                    stepSize: 1,
                },
            },
        ],
    };
    const { userInfo, getUserInformation } = useContext(AuthContext);
    const { buyingOrders, sellingOrders, loadOrderStatistic } = useContext(OrderContext);
    const {
        confirmedRequests,
        unconfirmedRequests,
        subrequests,
        getConfirmedRequests,
        getUnconfirmedRequests,
        getAllSubrequest,
    } = useContext(RequestContext);
    const [stepDate, setStepDate] = useState(1);
    const [targetDateBegin, setTargetDateBegin] = useState<Date>(
        new Date(new Date(currentDate).setDate(new Date(currentDate).getDate() - 7))
    );
    const [targetRequestDateBegin, setTargetRequestDateBegin] = useState<Date>(
        new Date(new Date(currentDate).setDate(new Date(currentDate).getDate() - 7))
    );
    const [targetRequestDateEnd, setTargetRequestDateEnd] = useState<Date>(new Date(new Date(Date.now())));
    const [buyingOrderStatistic, setBuyingOrderStatistic] = useState<OrderStatisticValue | undefined>(undefined);
    const [sellingOrderStatistic, setSellingOrderStatistic] = useState<OrderStatisticValue | undefined>(undefined);
    const [buyingRequestStatistic, setBuyingRequestStatistic] = useState<RequestStatisticValue | undefined>(undefined);
    const [sellingRequestStatistic, setSellingRequestStatistic] = useState<RequestStatisticValue | undefined>(
        undefined
    );
    const [expandedOrder, setExpandedOrder] = useState(false);
    const [isClickOnSellingOrder, setIsClickOnSellingOrder] = useState(false);
    const [isClickOnSellingRequest, setIsClickOnSellingRequest] = useState(false);
    const [buyingSucceedOrder, setBuyingSucceedOrder] = useState<OrderValueInitializer[]>([]);
    const [sellingSucceedOrder, setSellingSucceedOrder] = useState<OrderValueInitializer[]>([]);
    const [buyingDoughnutChartValue, setBuyingDoughnutChartValue] = useState<ChartValue>({
        datasets: [
            {
                backgroundColor: [],
                data: [],
                borderColor: [],
                borderWidth: 1,
                label: "# of Votes",
            },
        ],
        labels: [],
    });
    const [sellingDoughnutChartValue, setSellingDoughnutChartValue] = useState<ChartValue>({
        datasets: [
            {
                backgroundColor: [],
                data: [],
                borderColor: [],
                borderWidth: 1,
                label: "# of Votes",
            },
        ],
        labels: [],
    });
    const [buyingLineChartValue, setBuyingLineChartValue] = useState<LineChartValue>({
        datasets: [
            {
                backgroundColor: "",
                data: [],
                borderColor: "",
                label: "# of Votes",
            },
        ],
        labels: [],
    });
    const [sellingLineChartValue, setSellingLineChartValue] = useState<LineChartValue>({
        datasets: [
            {
                backgroundColor: "",
                data: [],
                borderColor: "",
                label: "# of Votes",
            },
        ],
        labels: [],
    });
    const [buyingOrderAmountData, setBuyingOrderAmountData] = useState<LineChartValue>({
        datasets: [
            {
                backgroundColor: "",
                data: [],
                borderColor: "",
                label: "# of Votes",
            },
        ],
        labels: [],
    });
    const [sellingOrderAmountData, setSellingOrderAmountData] = useState<LineChartValue>({
        datasets: [
            {
                backgroundColor: "",
                data: [],
                borderColor: "",
                label: "# of Votes",
            },
        ],
        labels: [],
    });
    const [dataSellingArray, setDataSellingArray] = useState<number[]>([]);
    const [labelSellingArray, setLabelSellingArray] = useState<string[]>([]);
    const [backgroundSellingArray, setBackgroundSellingArray] = useState<string[]>([]);
    const [borderSellingArray, setBorderSellingArray] = useState<string[]>([]);
    const [dataBuyingArray, setDataBuyingArray] = useState<number[]>([]);
    const [labelBuyingArray, setLabelBuyingArray] = useState<string[]>([]);
    const [backgroundBuyingArray, setBackgroundBuyingArray] = useState<string[]>([]);
    const [borderBuyingArray, setBorderBuyingArray] = useState<string[]>([]);
    const [buyingOrderDataArray, setBuyingOrderDataArray] = useState<LineChartDataValue>({
        success: [],
        total: [],
        amount: [],
    });
    const [sellingOrderDataArray, setSellingOrderDataArray] = useState<LineChartDataValue>({
        total: [],
        success: [],
        amount: [],
    });
    const [orderLabelArray, setOrderLabelArray] = useState<string[]>([]);
    const randomNumber = () => {
        return Math.floor(Math.random() * 254);
    };

    const convertDateType = (role: string, isShippingAssigned?: boolean) => {
        let dateType = "order_created_date";
        if (role === "shipper" && !isShippingAssigned) {
            dateType = "grabbing_date_assigned";
        }
        if (role === "shipper" && isShippingAssigned) {
            dateType = "delivering_date_assigned";
        }
        if (role === "packing_staff") {
            dateType = "packaging_date_assigned";
        }
        return dateType;
    };

    const changeStepDate = (event: SelectChangeEvent<number>) => {
        const value = event.target.value;
        if (typeof value === "number") {
            setStepDate(value);
            if (value === 1) {
                setTargetDateBegin(new Date(new Date(currentDate).setDate(new Date(currentDate).getDate() - 7)));
            }
            if (value === 3) {
                setTargetDateBegin(new Date(new Date(currentDate).setDate(new Date(currentDate).getDate() - 30)));
            }
            if (value === 7) {
                setTargetDateBegin(new Date(new Date(currentDate).setDate(new Date(currentDate).getDate() - 90)));
            }
            if (value === 30) {
                setTargetDateBegin(new Date(new Date(currentDate).setDate(new Date(currentDate).getDate() - 365)));
            }
        }
    };

    useEffect(() => {
        getUserInformation();
    }, []);

    useEffect(() => {
        if (userInfo && userInfo.id.trim().length > 0) {
            const { id } = userInfo;
            let dateType = "order_created_date";
            if (userInfo.role === "shipper") {
                dateType = convertDateType(userInfo.role, false);
            }
            console.log(dateType);
            loadOrderStatistic(
                id,
                dateType,
                targetDateBegin,
                new Date(Date.now()),
                "selling",
                userInfo.role !== "consummer" ? userInfo.role : undefined
            );
            loadOrderStatistic(
                id,
                dateType,
                targetDateBegin,
                new Date(Date.now()),
                "buying",
                userInfo.role !== "consummer" ? userInfo.role : undefined
            );
            getAllSubrequest("selling", undefined, targetDateBegin, new Date(Date.now()));
        }
    }, [userInfo, targetDateBegin]);

    useEffect(() => {
        if (userInfo && userInfo.id.trim().length > 0) {
            const { id } = userInfo;
            getConfirmedRequests(
                isClickOnSellingRequest ? "selling" : "buying",
                true,
                userInfo.role === "consummer" ? id : undefined,
                targetRequestDateBegin,
                targetRequestDateEnd
            );
            getUnconfirmedRequests(
                isClickOnSellingRequest ? "selling" : "buying",
                true,
                userInfo.role === "consummer" ? id : undefined,
                targetRequestDateBegin,
                targetRequestDateEnd
            );
        }
    }, [userInfo, isClickOnSellingRequest, targetRequestDateBegin, targetRequestDateEnd]);

    useEffect(() => {
        const concatArray = buyingOrders.concat(sellingOrders);
        console.log(concatArray);
        if (userInfo && userInfo.id.trim().length > 0 && concatArray.length > 0) {
            const filterdOrders = concatArray.filter(
                order =>
                    (order.transactionType === "buying" && order.requestUserId === userInfo.id) ||
                    (order.transactionType === "selling" && order.subrequestUserId === userInfo.id) ||
                    (userInfo.role !== "consummer" && order.transactionType === "buying")
            );
            setBuyingSucceedOrder(filterdOrders);
            console.log("Not empty");
            const totalOrder = filterdOrders.length;
            const totalPreparingOrder = filterdOrders.filter(
                order => order.status === "preparing" || order.status === "ready"
            ).length;
            const totalGrabbingOrder = filterdOrders.filter(
                order => order.status === "carrying" || order.status === "carried_in"
            ).length;
            const totalPackingOrder = filterdOrders.filter(
                order => order.status === "packaging" || order.status === "packaged"
            ).length;
            const totalDeliveringOrder = filterdOrders.filter(order => order.status === "delivering").length;
            const totalSuccessOrder = filterdOrders.filter(
                order => order.status === "success" || order.status === "confirmed"
            ).length;
            const totalAmountArray = filterdOrders.map(
                order => order.price * order.quantity - (order.price * order.quantity * order.fee) / 100
            );
            const totalAmount = totalAmountArray.length > 0 ? totalAmountArray.reduce((prev, next) => prev + next) : 0;
            const totalBudgetArray = filterdOrders.map(order => order.price * order.quantity);
            const totalBudget = totalBudgetArray.length > 0 ? totalBudgetArray.reduce((prev, next) => prev + next) : 0;
            const totalFee = totalBudget - totalAmount;
            setBuyingOrderStatistic({
                totalAmount: Math.round(totalAmount),
                totalBudget: Math.round(totalBudget),
                totalFee: Math.round(totalFee),
                totalDeliveringOrder,
                totalGrabbingOrder,
                totalOrder,
                totalPackingOrder,
                totalPreparingOrder,
                totalSuccessOrder,
            });
        } else {
            setBuyingOrderStatistic({
                totalAmount: 0,
                totalBudget: 0,
                totalFee: 0,
                totalDeliveringOrder: 0,
                totalGrabbingOrder: 0,
                totalOrder: 0,
                totalPackingOrder: 0,
                totalPreparingOrder: 0,
                totalSuccessOrder: 0,
            });
        }
        if (userInfo && userInfo.id.trim().length > 0 && concatArray.length > 0) {
            const filterdOrders = concatArray.filter(
                order =>
                    (order.transactionType === "selling" && order.requestUserId === userInfo.id) ||
                    (order.transactionType === "buying" && order.subrequestUserId === userInfo.id) ||
                    (userInfo.role !== "consummer" && order.transactionType === "selling")
            );
            setSellingSucceedOrder(filterdOrders);
            console.log("Not empty");
            const totalOrder = filterdOrders.length;
            const totalPreparingOrder = filterdOrders.filter(
                order => order.status === "preparing" || order.status === "ready"
            ).length;
            const totalGrabbingOrder = filterdOrders.filter(
                order => order.status === "carrying" || order.status === "carried_in"
            ).length;
            const totalPackingOrder = filterdOrders.filter(
                order => order.status === "packaging" || order.status === "packaged"
            ).length;
            const totalDeliveringOrder = filterdOrders.filter(order => order.status === "delivering").length;
            const totalSuccessOrder = filterdOrders.filter(
                order => order.status === "success" || order.status === "confirmed"
            ).length;
            const totalAmountArray = filterdOrders.map(
                order => order.price * order.quantity - (order.price * order.quantity * order.fee) / 100
            );
            const totalAmount = totalAmountArray.length > 0 ? totalAmountArray.reduce((prev, next) => prev + next) : 0;
            const totalBudgetArray = filterdOrders.map(order => order.price * order.quantity);
            const totalBudget = totalBudgetArray.length > 0 ? totalBudgetArray.reduce((prev, next) => prev + next) : 0;
            const totalFee = totalBudget - totalAmount;
            setSellingOrderStatistic({
                totalAmount: Math.round(totalAmount),
                totalBudget: Math.round(totalBudget),
                totalFee: Math.round(totalFee),
                totalDeliveringOrder,
                totalGrabbingOrder,
                totalOrder,
                totalPackingOrder,
                totalPreparingOrder,
                totalSuccessOrder,
            });
        } else {
            setSellingOrderStatistic({
                totalAmount: 0,
                totalBudget: 0,
                totalFee: 0,
                totalDeliveringOrder: 0,
                totalGrabbingOrder: 0,
                totalOrder: 0,
                totalPackingOrder: 0,
                totalPreparingOrder: 0,
                totalSuccessOrder: 0,
            });
        }
    }, [buyingOrders, sellingOrders]);

    useEffect(() => {
        const sellingConcatArray = confirmedRequests
            .filter(request => request.type === "selling")
            .concat(unconfirmedRequests.filter(request => request.type === "selling"));
        const buyingConcatArray = confirmedRequests
            .filter(request => request.type === "buying")
            .concat(unconfirmedRequests.filter(request => request.type === "buying"));
        const uniqueSellingRequestProductIds: { id: string; title: string }[] = [];
        const uniqueBuyingRequestProductIds: { id: string; title: string }[] = [];
        if (confirmedRequests.length > 0 || unconfirmedRequests.length > 0) {
            const totalConfirmedBuyingRequest = confirmedRequests.filter(request => request.type === "buying").length;
            const totalUnconfirmedBuyingRequest = unconfirmedRequests.filter(
                request => request.type === "buying" && request.status !== "cancel"
            ).length;
            const totalCancelBuyingRequest =
                confirmedRequests.filter(request => request.type === "buying" && request.status === "cancel").length +
                unconfirmedRequests.filter(request => request.type === "buying" && request.status === "cancel").length;
            const totalBuyingRequest =
                totalConfirmedBuyingRequest + totalUnconfirmedBuyingRequest + totalCancelBuyingRequest;
            const totalConfirmedSellingRequest = confirmedRequests.filter(request => request.type === "selling").length;
            const totalUnconfirmedSellingRequest = unconfirmedRequests.filter(
                request => request.type === "selling" && request.status !== "cancel"
            ).length;
            const totalCancelSellingRequest =
                confirmedRequests.filter(request => request.type === "selling" && request.status === "cancel").length +
                unconfirmedRequests.filter(request => request.type === "selling" && request.status === "cancel").length;
            const totalSellingRequest =
                totalConfirmedSellingRequest + totalUnconfirmedSellingRequest + totalCancelSellingRequest;
            setBuyingRequestStatistic({
                totalCancelRequest: totalCancelBuyingRequest,
                totalConfirmedRequest: totalConfirmedBuyingRequest,
                totalRequest: totalBuyingRequest,
                totalUnconfirmedRequest: totalUnconfirmedBuyingRequest,
            });
            setSellingRequestStatistic({
                totalCancelRequest: totalCancelSellingRequest,
                totalConfirmedRequest: totalConfirmedSellingRequest,
                totalRequest: totalSellingRequest,
                totalUnconfirmedRequest: totalUnconfirmedSellingRequest,
            });
            const transitorySellingStatisticArray: number[] = [];
            const transitorySellingLabelArray: string[] = [];
            const transitoryBuyingStatisticArray: number[] = [];
            const transitoryBuyingLabelArray: string[] = [];
            sellingConcatArray.forEach((request: RequestValueResponseInitializer) => {
                if (uniqueSellingRequestProductIds.findIndex(element => element.id === request.productId) === -1) {
                    uniqueSellingRequestProductIds.push({ id: request.productId, title: request.productName });
                }
            });
            uniqueSellingRequestProductIds.forEach(item => {
                const totalExisted = sellingConcatArray.filter(request => request.productId === item.id).length;
                transitorySellingStatisticArray.push(totalExisted);
                transitorySellingLabelArray.push(item.title);
            });
            buyingConcatArray.forEach((request: RequestValueResponseInitializer) => {
                if (uniqueBuyingRequestProductIds.findIndex(element => element.id === request.productId) === -1) {
                    uniqueBuyingRequestProductIds.push({ id: request.productId, title: request.productName });
                }
            });
            uniqueBuyingRequestProductIds.forEach(item => {
                const totalExisted = buyingConcatArray.filter(request => request.productId === item.id).length;
                transitoryBuyingStatisticArray.push(totalExisted);
                transitoryBuyingLabelArray.push(item.title);
            });
            console.log(transitorySellingStatisticArray, transitoryBuyingStatisticArray);
            setDataSellingArray(transitorySellingStatisticArray);
            setLabelSellingArray(transitorySellingLabelArray);
            setDataBuyingArray(transitoryBuyingStatisticArray);
            setLabelBuyingArray(transitoryBuyingLabelArray);
        } else {
            setBuyingRequestStatistic({
                totalCancelRequest: 0,
                totalConfirmedRequest: 0,
                totalRequest: 0,
                totalUnconfirmedRequest: 0,
            });
            setSellingRequestStatistic({
                totalCancelRequest: 0,
                totalConfirmedRequest: 0,
                totalRequest: 0,
                totalUnconfirmedRequest: 0,
            });
        }
    }, [confirmedRequests, unconfirmedRequests]);

    useEffect(() => {
        if (userInfo && userInfo.id.trim().length > 0) {
            console.log(subrequests);
            const filteredBuyingSubrequest = subrequests.filter((request: SubrequestResponseValueInitializer) => {
                return (
                    (request.transactionType === "selling" && request.ownerRequestId === userInfo.id) ||
                    (request.transactionType === "buying" && request.createdBy === userInfo.id) ||
                    (userInfo.role !== "consummer" && request.transactionType === "selling")
                );
            });
            const filteredSellingSubrequest = subrequests.filter((request: SubrequestResponseValueInitializer) => {
                return (
                    (request.transactionType === "buying" && request.ownerRequestId === userInfo.id) ||
                    (request.transactionType === "selling" && request.createdBy === userInfo.id) ||
                    (userInfo.role !== "consummer" && request.transactionType === "buying")
                );
            });
            const temporarySellingSubrequestData: LineChartDataValue = {
                amount: [],
                success: [],
                total: [],
            };
            const temporaryBuyingSubrequestData: LineChartDataValue = {
                amount: [],
                success: [],
                total: [],
            };
            const temporaryLabelArray: string[] = [];
            let calculateDate = targetDateBegin;
            console.log(filteredBuyingSubrequest, filteredSellingSubrequest);
            while (compareAsc(calculateDate, currentDate) === -1) {
                const previousCalculateDate = new Date(
                    new Date(calculateDate).setDate(new Date(calculateDate).getDate() - stepDate)
                );
                const buyingSubrequest = filteredBuyingSubrequest.filter(
                    request =>
                        compareAsc(new Date(request.createdDate), new Date(calculateDate)) === -1 &&
                        compareAsc(new Date(previousCalculateDate), new Date(request.createdDate)) === -1
                );
                const sellingSubrequest = filteredSellingSubrequest.filter(
                    request =>
                        compareAsc(new Date(request.createdDate), new Date(calculateDate)) === -1 &&
                        compareAsc(new Date(previousCalculateDate), new Date(request.createdDate)) === -1
                );
                const totalBuyingRequest = buyingSubrequest.length;
                const totalSellingRequest = sellingSubrequest.length;
                // console.log(buyingSucceedOrder, sellingSucceedOrder);
                const successBuyingRequest = buyingSucceedOrder.filter(request => {
                    return (
                        compareAsc(new Date(request.orderCreatedDate), new Date(calculateDate)) === -1 &&
                        compareAsc(new Date(previousCalculateDate), new Date(request.orderCreatedDate)) === -1
                    );
                });
                const successSellingRequest = sellingSucceedOrder.filter(request => {
                    return (
                        compareAsc(new Date(request.orderCreatedDate), new Date(calculateDate)) === -1 &&
                        compareAsc(new Date(previousCalculateDate), new Date(request.orderCreatedDate)) === -1
                    );
                });
                const totalSuccessBuyingRequest = successBuyingRequest.length;
                const totalSuccessSellingRequest = successSellingRequest.length;
                const totalBuyingAmount =
                    totalSuccessBuyingRequest === 0
                        ? 0
                        : successBuyingRequest
                              .map(request => request.price * request.quantity)
                              .reduce((prev, next) => prev + next);
                const totalSellingAmount =
                    totalSuccessSellingRequest === 0
                        ? 0
                        : successSellingRequest
                              .map(request => request.price * request.quantity)
                              .reduce((prev, next) => prev + next);
                temporaryBuyingSubrequestData.total.push(totalBuyingRequest);
                temporaryBuyingSubrequestData.success.push(totalSuccessBuyingRequest);
                temporaryBuyingSubrequestData.amount.push(totalBuyingAmount);
                temporarySellingSubrequestData.total.push(totalSellingRequest);
                temporarySellingSubrequestData.success.push(totalSuccessSellingRequest);
                temporarySellingSubrequestData.amount.push(totalSellingAmount);
                if (stepDate !== 30) {
                    temporaryLabelArray.push(format(new Date(calculateDate), "dd/MM", { locale: vi }));
                } else {
                    temporaryLabelArray.push(format(new Date(calculateDate), "MM", { locale: vi }));
                }
                if (
                    compareAsc(
                        new Date(new Date(calculateDate).setDate(new Date(calculateDate).getDate() + stepDate)),
                        currentDate
                    ) !== -1
                ) {
                    calculateDate = new Date(Date.now());
                } else {
                    calculateDate = new Date(
                        new Date(calculateDate).setDate(new Date(calculateDate).getDate() + stepDate)
                    );
                }
            }
            setBuyingOrderDataArray(temporaryBuyingSubrequestData);
            setSellingOrderDataArray(temporarySellingSubrequestData);
            setOrderLabelArray(temporaryLabelArray);
        }
    }, [subrequests, userInfo, targetDateBegin, stepDate]);

    useEffect(() => {
        setBuyingLineChartValue({
            datasets: [
                {
                    data: buyingOrderDataArray.total,
                    backgroundColor: "rgb(255, 99, 132)",
                    borderColor: "rgb(255, 99, 132,0.5)",
                    label: "Tổng yêu cầu",
                },
                {
                    data: buyingOrderDataArray.success,
                    backgroundColor: "rgb(53, 162, 235)",
                    borderColor: "rgba(53, 162, 235,0.5)",
                    label: "Tổng yêu cầu thành công",
                },
            ],
            labels: orderLabelArray,
        });
        setSellingLineChartValue({
            datasets: [
                {
                    data: sellingOrderDataArray.total,
                    label: "Tổng yêu cầu",
                    backgroundColor: "rgb(255, 99, 132)",
                    borderColor: "rgba(255, 99, 132,0.5)",
                },
                {
                    data: sellingOrderDataArray.success,
                    backgroundColor: "rgb(53, 162, 235)",
                    borderColor: "rgba(53, 162, 235, 0.5)",
                    label: "Tổng yêu cầu thành công",
                },
            ],
            labels: orderLabelArray,
        });
        setBuyingOrderAmountData({
            datasets: [
                {
                    data: buyingOrderDataArray.amount,
                    backgroundColor: "rgb(235, 229, 52)",
                    borderColor: "rgba(235, 229, 52, 0.5)",
                    label: "Tổng giao dịch",
                },
            ],
            labels: orderLabelArray,
        });
        setSellingOrderAmountData({
            datasets: [
                {
                    data: sellingOrderDataArray.amount,
                    backgroundColor: "rgb(235, 229, 52)",
                    borderColor: "rgba(235, 229, 52, 0.5)",
                    label: "Tổng giao dịch",
                },
            ],
            labels: orderLabelArray,
        });
        // console.log(buyingOrderDataArray, sellingOrderDataArray, orderLabelArray);
    }, [buyingOrderDataArray, sellingOrderDataArray, orderLabelArray]);

    useEffect(() => {
        const transitoryRandomBackground: string[] = [];
        const transitoryRandomBorder: string[] = [];
        for (let i = 0; i < dataBuyingArray.length; i++) {
            const firstValue = randomNumber();
            const secondValue = randomNumber();
            const thirdValue = randomNumber();
            transitoryRandomBackground.push(`rgba(${firstValue},${secondValue},${thirdValue},0.2)`);
            transitoryRandomBorder.push(`rgba(${firstValue},${secondValue},${thirdValue},0.2)`);
        }
        setBackgroundBuyingArray(transitoryRandomBackground);
        setBorderBuyingArray(transitoryRandomBorder);
        for (let i = 0; i < dataSellingArray.length; i++) {
            const firstValue = randomNumber();
            const secondValue = randomNumber();
            const thirdValue = randomNumber();
            transitoryRandomBackground.push(`rgba(${firstValue},${secondValue},${thirdValue},0.2)`);
            transitoryRandomBorder.push(`rgba(${firstValue},${secondValue},${thirdValue},0.2)`);
        }
        setBackgroundSellingArray(transitoryRandomBackground);
        setBorderSellingArray(transitoryRandomBorder);
    }, [dataBuyingArray, dataSellingArray]);

    useEffect(() => {
        setSellingDoughnutChartValue({
            datasets: [
                {
                    backgroundColor: backgroundSellingArray,
                    borderColor: borderSellingArray,
                    borderWidth: 1,
                    data: dataSellingArray,
                    label: "# of Votes",
                },
            ],
            labels: labelSellingArray,
        });
        setBuyingDoughnutChartValue({
            datasets: [
                {
                    backgroundColor: backgroundBuyingArray,
                    borderColor: borderBuyingArray,
                    borderWidth: 1,
                    data: dataBuyingArray,
                    label: "# of Votes",
                },
            ],
            labels: labelBuyingArray,
        });
    }, [backgroundBuyingArray, borderBuyingArray, backgroundSellingArray, borderSellingArray]);

    return (
        <Box p={5}>
            <Typography variant="h4" margin={5} textAlign="center">
                Thống kê các yêu cầu
            </Typography>
            <Box display="flex" justifyContent="flex-end">
                <Box display="flex" alignItems="center">
                    <Typography>Từ: </Typography>&nbsp;
                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={viLocale}>
                        <DatePicker
                            mask="__/__/____"
                            value={targetRequestDateBegin}
                            onChange={newValue => {
                                setTargetRequestDateBegin(newValue ? newValue : targetRequestDateBegin);
                            }}
                            renderInput={params => <TextField {...params} size="small" sx={{ width: "165px" }} />}
                        />
                    </LocalizationProvider>
                </Box>
                <Box mr={2} ml={2} />
                <Box display="flex" alignItems="center">
                    <Typography>Đến: </Typography>&nbsp;
                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={viLocale}>
                        <DatePicker
                            mask="__/__/____"
                            value={targetRequestDateEnd}
                            onChange={newValue => {
                                setTargetRequestDateEnd(newValue ? newValue : targetRequestDateEnd);
                            }}
                            renderInput={params => <TextField {...params} size="small" sx={{ width: "165px" }} />}
                        />
                    </LocalizationProvider>
                </Box>
            </Box>
            <Box>
                <ButtonGroup>
                    <Box display="flex" alignItems="center">
                        <Button
                            variant="text"
                            size="large"
                            onClick={() => {
                                setIsClickOnSellingRequest(!isClickOnSellingRequest);
                            }}
                        >
                            <Typography sx={{ textDecoration: isClickOnSellingRequest ? "none" : "underline" }}>
                                Mua vào
                            </Typography>
                        </Button>
                        <Typography color="primary">/</Typography>
                        <Button
                            variant="text"
                            size="large"
                            onClick={() => {
                                setIsClickOnSellingRequest(!isClickOnSellingRequest);
                            }}
                        >
                            <Typography sx={{ textDecoration: isClickOnSellingRequest ? "underline" : "none" }}>
                                Bán ra
                            </Typography>
                        </Button>
                    </Box>
                </ButtonGroup>
            </Box>
            <Typography variant="h5" textAlign="center">
                {isClickOnSellingRequest ? "Bán ra" : "Mua vào"}
            </Typography>
            <Grid
                container
                display={isClickOnSellingRequest ? "none" : "flex"}
                justifyContent="center"
                alignItems="center"
            >
                <Grid item md={6} sm={12}>
                    <Grid container>
                        <Grid item>
                            <Card
                                sx={{
                                    width: 250,
                                    height: 200,
                                    backgroundColor: "#9ccc65",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    margin: 1,
                                }}
                            >
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" width="100%">
                                        <Typography variant="h6" sx={{ width: "70%" }}>
                                            Tổng yêu cầu
                                        </Typography>
                                        <MdOutlineNotificationsActive fontSize={50} />
                                    </Box>
                                </CardContent>
                                <CardContent>
                                    <Typography variant="h4" sx={{ width: "70%" }}>
                                        {buyingRequestStatistic ? buyingRequestStatistic.totalRequest : 0}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item>
                            <Card
                                sx={{
                                    width: 250,
                                    height: 200,
                                    backgroundColor: "#a1887f",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    margin: 1,
                                }}
                            >
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" width="100%">
                                        <Typography variant="h6" sx={{ width: "70%" }}>
                                            Đã duyệt
                                        </Typography>
                                        <BsPatchCheck fontSize={50} />
                                    </Box>
                                </CardContent>
                                <CardContent>
                                    <Typography variant="h4" sx={{ width: "70%" }}>
                                        {buyingRequestStatistic ? buyingRequestStatistic.totalConfirmedRequest : 0}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item>
                            <Card
                                sx={{
                                    width: 250,
                                    height: 200,
                                    backgroundColor: "#4527a0",
                                    display: "flex",
                                    flexDirection: "column",
                                    color: "white",
                                    justifyContent: "space-between",
                                    margin: 1,
                                }}
                            >
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" width="100%">
                                        <Typography variant="h6" sx={{ width: "70%" }}>
                                            Chưa duyệt
                                        </Typography>
                                        <FiClock fontSize={50} />
                                    </Box>
                                </CardContent>
                                <CardContent>
                                    <Typography variant="h4" sx={{ width: "70%" }}>
                                        {buyingRequestStatistic ? buyingRequestStatistic.totalUnconfirmedRequest : 0}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item>
                            <Card
                                sx={{
                                    width: 250,
                                    height: 200,
                                    backgroundColor: "#c2185b",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    color: "white",
                                    margin: 1,
                                }}
                            >
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" width="100%">
                                        <Typography variant="h6" sx={{ width: "70%" }}>
                                            Đã huỷ
                                        </Typography>
                                        <MdOutlineCancel fontSize={50} />
                                    </Box>
                                </CardContent>
                                <CardContent>
                                    <Typography variant="h4" sx={{ width: "70%" }}>
                                        {buyingRequestStatistic ? buyingRequestStatistic.totalCancelRequest : 0}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item md={6} sm={12}>
                    <Typography marginTop={5} marginBottom={3} textAlign="center">
                        Yêu cầu mua
                    </Typography>
                    <Pie
                        options={{
                            plugins: {
                                legend: {
                                    display: true,
                                    position: "right",
                                },
                                title: {
                                    display: true,
                                    position: "top",
                                },
                            },
                        }}
                        data={buyingDoughnutChartValue}
                    />
                </Grid>
            </Grid>
            <Grid
                container
                display={isClickOnSellingRequest ? "flex" : "none"}
                justifyContent="center"
                alignItems="center"
            >
                <Grid item md={6} sm={12}>
                    <Grid container>
                        <Grid item>
                            <Card
                                sx={{
                                    width: 250,
                                    height: 200,
                                    backgroundColor: "#9ccc65",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    margin: 1,
                                }}
                            >
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" width="100%">
                                        <Typography variant="h6" sx={{ width: "70%" }}>
                                            Tổng yêu cầu
                                        </Typography>
                                        <MdOutlineNotificationsActive fontSize={50} />
                                    </Box>
                                </CardContent>
                                <CardContent>
                                    <Typography variant="h4" sx={{ width: "70%" }}>
                                        {sellingRequestStatistic ? sellingRequestStatistic.totalRequest : 0}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item>
                            <Card
                                sx={{
                                    width: 250,
                                    height: 200,
                                    backgroundColor: "#a1887f",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    margin: 1,
                                }}
                            >
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" width="100%">
                                        <Typography variant="h6" sx={{ width: "70%" }}>
                                            Đã duyệt
                                        </Typography>
                                        <BsPatchCheck fontSize={50} />
                                    </Box>
                                </CardContent>
                                <CardContent>
                                    <Typography variant="h4" sx={{ width: "70%" }}>
                                        {sellingRequestStatistic ? sellingRequestStatistic.totalConfirmedRequest : 0}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item>
                            <Card
                                sx={{
                                    width: 250,
                                    height: 200,
                                    backgroundColor: "#4527a0",
                                    display: "flex",
                                    flexDirection: "column",
                                    color: "white",
                                    justifyContent: "space-between",
                                    margin: 1,
                                }}
                            >
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" width="100%">
                                        <Typography variant="h6" sx={{ width: "70%" }}>
                                            Chưa duyệt
                                        </Typography>
                                        <FiClock fontSize={50} />
                                    </Box>
                                </CardContent>
                                <CardContent>
                                    <Typography variant="h4" sx={{ width: "70%" }}>
                                        {sellingRequestStatistic ? sellingRequestStatistic.totalUnconfirmedRequest : 0}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item>
                            <Card
                                sx={{
                                    width: 250,
                                    height: 200,
                                    backgroundColor: "#c2185b",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    color: "white",
                                    margin: 1,
                                }}
                            >
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" width="100%">
                                        <Typography variant="h6" sx={{ width: "70%" }}>
                                            Đã huỷ
                                        </Typography>
                                        <MdOutlineCancel fontSize={50} />
                                    </Box>
                                </CardContent>
                                <CardContent>
                                    <Typography variant="h4" sx={{ width: "70%" }}>
                                        {sellingRequestStatistic ? sellingRequestStatistic.totalCancelRequest : 0}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item md={6} sm={12}>
                    <Typography marginTop={5} marginBottom={3} textAlign="center">
                        Yêu cầu bán
                    </Typography>
                    <Box width="100%">
                        <Pie
                            options={{
                                plugins: {
                                    legend: {
                                        display: true,
                                        position: "right",
                                    },
                                },
                                responsive: true,
                            }}
                            data={sellingDoughnutChartValue}
                        />
                    </Box>
                </Grid>
            </Grid>
            <Typography variant="h4" margin={5} textAlign="center">
                Thống kê các đơn hàng
            </Typography>
            <Box display="flex" justifyContent="flex-end">
                <Select
                    size="small"
                    value={stepDate}
                    defaultValue={1}
                    onChange={event => {
                        changeStepDate(event);
                    }}
                >
                    <MenuItem value={1}>7 ngày gần nhất</MenuItem>
                    <MenuItem value={3}>30 ngày gần nhất</MenuItem>
                    <MenuItem value={7}>3 tháng</MenuItem>
                    <MenuItem value={30}>1 năm</MenuItem>
                </Select>
            </Box>
            <Box>
                <ButtonGroup>
                    <Box display="flex" alignItems="center">
                        <Button
                            variant="text"
                            size="large"
                            onClick={() => {
                                setIsClickOnSellingOrder(!isClickOnSellingOrder);
                            }}
                        >
                            <Typography sx={{ textDecoration: isClickOnSellingOrder ? "none" : "underline" }}>
                                Mua vào
                            </Typography>
                        </Button>
                        <Typography color="primary">/</Typography>
                        <Button
                            variant="text"
                            size="large"
                            onClick={() => {
                                setIsClickOnSellingOrder(!isClickOnSellingOrder);
                            }}
                        >
                            <Typography sx={{ textDecoration: isClickOnSellingOrder ? "underline" : "none" }}>
                                Bán ra
                            </Typography>
                        </Button>
                    </Box>
                </ButtonGroup>
            </Box>
            <Grid
                container
                alignItems="center"
                justifyContent="center"
                display={isClickOnSellingOrder ? "none" : "flex"}
            >
                <Grid item>
                    <Card
                        sx={{
                            width: 1050,
                            height: 280,
                            backgroundColor: "#4527a0",
                            display: "flex",
                            flexDirection: "column",
                            color: "white",
                            justifyContent: "space-between",
                            margin: 1,
                        }}
                    >
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" width="100%">
                                <Typography variant="h6" sx={{ width: "70%" }}>
                                    Tổng tiền phải trả
                                </Typography>
                                <AiOutlineDollar fontSize={50} />
                            </Box>
                        </CardContent>
                        <CardContent>
                            <Typography variant="h4">
                                <NumberFormat
                                    value={buyingOrderStatistic ? buyingOrderStatistic.totalBudget : 0}
                                    suffix="VND"
                                    thousandSeparator={true}
                                    displayType="text"
                                />
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item>
                    <Card
                        sx={{
                            width: 340,
                            height: 280,
                            backgroundColor: "#9ccc65",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            margin: 1,
                        }}
                    >
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" width="100%">
                                <Typography variant="h6" sx={{ width: "70%" }}>
                                    Tổng đơn hàng
                                </Typography>
                                <VscPackage fontSize={50} />
                            </Box>
                        </CardContent>
                        <CardContent>
                            <Typography variant="h4" sx={{ width: "70%" }}>
                                {buyingOrderStatistic ? buyingOrderStatistic.totalOrder : 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item>
                    <Card
                        sx={{
                            width: 340,
                            height: 280,
                            backgroundColor: "#a1887f",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            margin: 1,
                        }}
                    >
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" width="100%">
                                <Typography variant="h6" sx={{ width: "70%" }}>
                                    Tổng giá trị các đơn hàng
                                </Typography>
                                <GiPriceTag fontSize={50} />
                            </Box>
                        </CardContent>
                        <CardContent>
                            <Typography variant="h4">
                                <NumberFormat
                                    value={buyingOrderStatistic ? buyingOrderStatistic.totalAmount : 0}
                                    suffix="VND"
                                    thousandSeparator={true}
                                    displayType="text"
                                />
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item>
                    <Card
                        sx={{
                            width: 340,
                            height: 280,
                            backgroundColor: "#37474f",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            color: "white",
                            margin: 1,
                        }}
                    >
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" width="100%">
                                <Typography variant="h6" sx={{ width: "70%" }}>
                                    Tổng phí
                                </Typography>
                                <FaFileInvoiceDollar fontSize={50} />
                            </Box>
                        </CardContent>
                        <CardContent>
                            <Typography variant="h4">
                                <NumberFormat
                                    value={buyingOrderStatistic ? buyingOrderStatistic.totalFee : 0}
                                    suffix="VND"
                                    thousandSeparator={true}
                                    displayType="text"
                                />
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Collapse in={expandedOrder} timeout="auto" unmountOnExit>
                    <Grid container display="flex" alignItems="center" justifyContent="center">
                        <Grid item>
                            <Card
                                sx={{
                                    width: 340,
                                    height: 280,
                                    backgroundColor: "#d4e157",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    margin: 1,
                                }}
                            >
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" width="100%">
                                        <Typography variant="h6" sx={{ width: "70%" }}>
                                            Đang chuẩn bị hoặc chuẩn bị xong
                                        </Typography>
                                        <GiFarmer fontSize={50} />
                                    </Box>
                                </CardContent>
                                <CardContent>
                                    <Typography variant="h4">
                                        {buyingOrderStatistic ? buyingOrderStatistic.totalPreparingOrder : 0}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item>
                            <Card
                                sx={{
                                    width: 340,
                                    height: 280,
                                    backgroundColor: "#c2185b",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    color: "white",
                                    margin: 1,
                                }}
                            >
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" width="100%">
                                        <Typography variant="h6" sx={{ width: "70%" }}>
                                            Đang vận chuyển về kho hoặc đã vận chuyển về kho
                                        </Typography>
                                        <RiShipLine fontSize={50} />
                                    </Box>
                                </CardContent>
                                <CardContent>
                                    <Typography variant="h4">
                                        {buyingOrderStatistic ? buyingOrderStatistic.totalGrabbingOrder : 0}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item>
                            <Card
                                sx={{
                                    width: 340,
                                    height: 280,
                                    backgroundColor: "#e1bee7",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    margin: 1,
                                }}
                            >
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" width="100%">
                                        <Typography variant="h6" sx={{ width: "70%" }}>
                                            Đang đóng gói hoặc đã đóng gói
                                        </Typography>
                                        <GiBoxUnpacking fontSize={50} />
                                    </Box>
                                </CardContent>
                                <CardContent>
                                    <Typography variant="h4">
                                        {buyingOrderStatistic ? buyingOrderStatistic.totalPackingOrder : 0}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item>
                            <Card
                                sx={{
                                    width: 340,
                                    height: 280,
                                    backgroundColor: "#42a5f5",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    margin: 1,
                                }}
                            >
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" width="100%">
                                        <Typography variant="h6" sx={{ width: "70%" }}>
                                            Đang giao hàng
                                        </Typography>
                                        <MdOutlineLocalShipping fontSize={50} />
                                    </Box>
                                </CardContent>
                                <CardContent>
                                    <Typography variant="h4">
                                        {buyingOrderStatistic ? buyingOrderStatistic.totalDeliveringOrder : 0}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item>
                            <Card
                                sx={{
                                    width: 340,
                                    height: 280,
                                    backgroundColor: "#ffe082",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    margin: 1,
                                }}
                            >
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" width="100%">
                                        <Typography variant="h6" sx={{ width: "70%" }}>
                                            Đã giao hàng
                                        </Typography>
                                        <GiFlyingFlag fontSize={50} />
                                    </Box>
                                </CardContent>
                                <CardContent>
                                    <Typography variant="h4">
                                        {buyingOrderStatistic ? buyingOrderStatistic.totalSuccessOrder : 0}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Collapse>
            </Grid>
            <Grid
                container
                alignItems="center"
                justifyContent="center"
                display={isClickOnSellingOrder ? "flex" : "none"}
            >
                <Grid item>
                    <Card
                        sx={{
                            width: 1050,
                            height: 280,
                            backgroundColor: "#4527a0",
                            display: "flex",
                            flexDirection: "column",
                            color: "white",
                            justifyContent: "space-between",
                            margin: 1,
                        }}
                    >
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" width="100%">
                                <Typography variant="h6" sx={{ width: "70%" }}>
                                    Tổng tiền nhận được
                                </Typography>
                                <AiOutlineDollar fontSize={50} />
                            </Box>
                        </CardContent>
                        <CardContent>
                            <Typography variant="h4">
                                <NumberFormat
                                    value={sellingOrderStatistic ? sellingOrderStatistic.totalAmount : 0}
                                    suffix="VND"
                                    thousandSeparator={true}
                                    displayType="text"
                                />
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item>
                    <Card
                        sx={{
                            width: 340,
                            height: 280,
                            backgroundColor: "#9ccc65",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            margin: 1,
                        }}
                    >
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" width="100%">
                                <Typography variant="h6" sx={{ width: "70%" }}>
                                    Tổng đơn hàng
                                </Typography>
                                <VscPackage fontSize={50} />
                            </Box>
                        </CardContent>
                        <CardContent>
                            <Typography variant="h4" sx={{ width: "70%" }}>
                                {sellingOrderStatistic ? sellingOrderStatistic.totalOrder : 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item>
                    <Card
                        sx={{
                            width: 340,
                            height: 280,
                            backgroundColor: "#a1887f",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            margin: 1,
                        }}
                    >
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" width="100%">
                                <Typography variant="h6" sx={{ width: "70%" }}>
                                    Tổng giá trị các đơn hàng
                                </Typography>
                                <GiPriceTag fontSize={50} />
                            </Box>
                        </CardContent>
                        <CardContent>
                            <Typography variant="h4">
                                <NumberFormat
                                    value={sellingOrderStatistic ? sellingOrderStatistic.totalBudget : 0}
                                    suffix="VND"
                                    thousandSeparator={true}
                                    displayType="text"
                                />
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item>
                    <Card
                        sx={{
                            width: 340,
                            height: 280,
                            backgroundColor: "#37474f",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            color: "white",
                            margin: 1,
                        }}
                    >
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" width="100%">
                                <Typography variant="h6" sx={{ width: "70%" }}>
                                    Tổng phí
                                </Typography>
                                <FaFileInvoiceDollar fontSize={50} />
                            </Box>
                        </CardContent>
                        <CardContent>
                            <Typography variant="h4">
                                <NumberFormat
                                    value={sellingOrderStatistic ? sellingOrderStatistic.totalFee : 0}
                                    suffix="VND"
                                    thousandSeparator={true}
                                    displayType="text"
                                />
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Collapse in={expandedOrder} timeout="auto" unmountOnExit>
                    <Grid container display="flex" alignItems="center" justifyContent="center">
                        <Grid item>
                            <Card
                                sx={{
                                    width: 340,
                                    height: 280,
                                    backgroundColor: "#d4e157",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    margin: 1,
                                }}
                            >
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" width="100%">
                                        <Typography variant="h6" sx={{ width: "70%" }}>
                                            Đang chuẩn bị hoặc chuẩn bị xong
                                        </Typography>
                                        <GiFarmer fontSize={50} />
                                    </Box>
                                </CardContent>
                                <CardContent>
                                    <Typography variant="h4">
                                        {sellingOrderStatistic ? sellingOrderStatistic.totalPreparingOrder : 0}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item>
                            <Card
                                sx={{
                                    width: 340,
                                    height: 280,
                                    backgroundColor: "#c2185b",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    color: "white",
                                    margin: 1,
                                }}
                            >
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" width="100%">
                                        <Typography variant="h6" sx={{ width: "70%" }}>
                                            Đang vận chuyển về kho hoặc đã vận chuyển về kho
                                        </Typography>
                                        <RiShipLine fontSize={50} />
                                    </Box>
                                </CardContent>
                                <CardContent>
                                    <Typography variant="h4">
                                        {sellingOrderStatistic ? sellingOrderStatistic.totalGrabbingOrder : 0}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item>
                            <Card
                                sx={{
                                    width: 340,
                                    height: 280,
                                    backgroundColor: "#e1bee7",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    margin: 1,
                                }}
                            >
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" width="100%">
                                        <Typography variant="h6" sx={{ width: "70%" }}>
                                            Đang đóng gói hoặc đã đóng gói
                                        </Typography>
                                        <GiBoxUnpacking fontSize={50} />
                                    </Box>
                                </CardContent>
                                <CardContent>
                                    <Typography variant="h4">
                                        {sellingOrderStatistic ? sellingOrderStatistic.totalPackingOrder : 0}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item>
                            <Card
                                sx={{
                                    width: 340,
                                    height: 280,
                                    backgroundColor: "#42a5f5",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    margin: 1,
                                }}
                            >
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" width="100%">
                                        <Typography variant="h6" sx={{ width: "70%" }}>
                                            Đang giao hàng
                                        </Typography>
                                        <MdOutlineLocalShipping fontSize={50} />
                                    </Box>
                                </CardContent>
                                <CardContent>
                                    <Typography variant="h4">
                                        {sellingOrderStatistic ? sellingOrderStatistic.totalDeliveringOrder : 0}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item>
                            <Card
                                sx={{
                                    width: 340,
                                    height: 280,
                                    backgroundColor: "#ffe082",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    margin: 1,
                                }}
                            >
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" width="100%">
                                        <Typography variant="h6" sx={{ width: "70%" }}>
                                            Đã giao hàng
                                        </Typography>
                                        <GiFlyingFlag fontSize={50} />
                                    </Box>
                                </CardContent>
                                <CardContent>
                                    <Typography variant="h4">
                                        {sellingOrderStatistic ? sellingOrderStatistic.totalSuccessOrder : 0}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Collapse>
            </Grid>

            <Button
                variant="text"
                onClick={() => {
                    setExpandedOrder(!expandedOrder);
                }}
                endIcon={
                    <ExpandMore
                        expand={expandedOrder}
                        onClick={() => {
                            setExpandedOrder(!expandedOrder);
                        }}
                        aria-expanded={expandedOrder}
                        aria-label="show more"
                    >
                        <AiOutlineArrowDown color="blue" />
                    </ExpandMore>
                }
            >
                Xem thêm
            </Button>
            <Grid container>
                <Grid item md={6} sm={12} display={isClickOnSellingOrder ? "none" : "flex"}>
                    <Line options={buyingOrderLineChartOptions} data={buyingLineChartValue} />
                    <Line options={buyingOrderLineChartOptions} data={buyingOrderAmountData} />
                </Grid>
                <Grid item sm={12} md={6} display={isClickOnSellingOrder ? "flex" : "none"}>
                    <Line options={sellingOrderLineChartOptions} data={sellingLineChartValue} />
                    <Line options={sellingOrderLineChartOptions} data={sellingOrderAmountData} />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Home;
