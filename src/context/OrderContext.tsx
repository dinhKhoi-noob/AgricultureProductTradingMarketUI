/* eslint-disable camelcase */
import axios from "axios";
import React, { createContext, ReactElement, ReactNode, useContext, useReducer } from "react";
import { OrderActionType, orderReducer, OrderReducerState } from "../reducer/orderReducer";
import { LayoutContext } from "./LayoutContext";
import { TransactionType } from "./RequestContext";

export type orderStatus = "notbegin" | "process" | "done";

interface OrderStatusConverted {
    convertedStatus: string;
    isDone: boolean;
}

export interface OrderConfirmationValue {
    isRoot: boolean;
    type: TransactionType;
    id: string;
}

export interface StepValueInitializer {
    name: string;
    by: string;
    dateCreated: string;
    dateCompleted: string;
    color: string;
    icon: ReactElement;
    process: orderStatus;
}

export interface OrderValueInitializer {
    id: string;
    productName: string;
    quantity: number;
    price: number;
    total: number;
    requestUserId: string;
    subrequestUserId: string;
    requestUsername: string;
    subrequestUsername: string;
    requestAddress: string;
    subrequestAddress: string;
    fee: number;
    requestId: string;
    subrequestId: string;
    status: string;
    transactionType: string;
    dateCompletedOrder: string;
    expiredDate: string;
    orderCreatedDate: string;
    orderConfirmedDate: string;
    measure: string;
}

export interface ParticularAssignmentValueInitializer {
    id: string;
    userId: string;
    username: string;
    dateAssigned: Date;
    dateCompleted: Date;
}

export interface OrderAssignmentValueInitializer {
    order: OrderValueInitializer;
    grabbingAsignment: ParticularAssignmentValueInitializer;
    packagingAssignment: ParticularAssignmentValueInitializer;
    deliveringAssignment: ParticularAssignmentValueInitializer;
}

interface OrderContextDefault {
    orderList: OrderValueInitializer[];
    buyingOrders: OrderValueInitializer[];
    sellingOrders: OrderValueInitializer[];
    buyingComparingOrders: OrderValueInitializer[];
    sellingComparingOrders: OrderValueInitializer[];
    preparingOrders: any[];
    carryingOrders: any[];
    packagingOrders: any[];
    deliveringOrders: any[];
    successOrders: any[];
    canceledOrders: any[];
    orderDetails: OrderAssignmentValueInitializer | undefined;
    currentOrder: OrderValueInitializer | undefined;
    currentSubOrders: OrderValueInitializer[];
    currentOrderConfirmationValue: OrderConfirmationValue;
    loadAllOrders: (uid?: string, loadingHistory?: boolean, type?: TransactionType) => void;
    loadOrderStatistic: (
        uid: string | undefined,
        dateType: string,
        dateBegin: Date,
        dateEnd: Date,
        type: TransactionType,
        role?: string
    ) => void;
    loadComparingOrderStatistic: (
        uid: string,
        dateType: string,
        dateBegin: Date,
        dateEnd: Date,
        type: TransactionType,
        role?: string
    ) => void;
    storeOrders: (type: OrderActionType, data: any[]) => void;
    loadOrderDetails: (orderId: string) => void;
    loadSpecificRootOrder: (type: TransactionType, id: string) => void;
    changeCurrentOrderInformation: (order: OrderValueInitializer) => void;
    convertOrderStatus: (status: string) => OrderStatusConverted;
    changeOrderStatus: (status: string, uid: string) => void;
    changeCurrentOrderConfirmationValue: (value: OrderConfirmationValue) => void;
    checkStep: (currentStep: string, checkingStep: string) => boolean;
}

interface OrderContextProps {
    children: ReactNode;
}

const orderContextDefaultValue: OrderContextDefault = {
    orderList: [],
    buyingOrders: [],
    sellingOrders: [],
    buyingComparingOrders: [],
    sellingComparingOrders: [],
    preparingOrders: [],
    carryingOrders: [],
    packagingOrders: [],
    deliveringOrders: [],
    successOrders: [],
    canceledOrders: [],
    orderDetails: undefined,
    currentOrder: undefined,
    currentSubOrders: [],
    currentOrderConfirmationValue: {
        id: "",
        isRoot: false,
        type: "buying",
    },
    loadAllOrders: () => null,
    loadOrderStatistic: () => null,
    loadComparingOrderStatistic: () => null,
    storeOrders: () => null,
    loadOrderDetails: () => null,
    loadSpecificRootOrder: () => null,
    changeCurrentOrderInformation: () => null,
    convertOrderStatus: () => ({ isDone: false, convertedStatus: "Đang chuẩn bị" }),
    changeOrderStatus: () => null,
    changeCurrentOrderConfirmationValue: () => null,
    checkStep: () => false,
};

export const OrderContext = createContext<OrderContextDefault>(orderContextDefaultValue);

const OrderContextProvider = ({ children }: OrderContextProps) => {
    const host = "http://localhost:4000";
    const orderDetailsDefault: OrderAssignmentValueInitializer = {
        order: {
            id: "",
            productName: "",
            quantity: 0,
            price: 0,
            total: 0,
            requestUserId: "",
            subrequestUserId: "",
            requestAddress: "",
            subrequestAddress: "",
            fee: 10,
            requestId: "",
            subrequestId: "",
            status: "",
            transactionType: "",
            dateCompletedOrder: "",
            expiredDate: "",
            orderCreatedDate: "",
            orderConfirmedDate: "",
            subrequestUsername: "",
            requestUsername: "",
            measure: "kg",
        },
        grabbingAsignment: {
            id: "",
            dateAssigned: new Date(Date.now()),
            dateCompleted: new Date(Date.now()),
            userId: "",
            username: "",
        },
        packagingAssignment: {
            id: "",
            dateAssigned: new Date(Date.now()),
            dateCompleted: new Date(Date.now()),
            userId: "",
            username: "",
        },
        deliveringAssignment: {
            id: "",
            dateAssigned: new Date(Date.now()),
            dateCompleted: new Date(Date.now()),
            userId: "",
            username: "",
        },
    };
    const orderReducerStateInitial: OrderReducerState = {
        orderList: [],
        preparingOrders: [],
        carryingOrders: [],
        packagingOrders: [],
        deliveringOrders: [],
        successOrders: [],
        canceledOrders: [],
        buyingOrders: [],
        sellingOrders: [],
        buyingComparingOrders: [],
        sellingComparingOrders: [],
        orderDetails: orderDetailsDefault,
        currentOrder: undefined,
        currentSubOrders: [],
        currentOrderConfirmationValue: {
            id: "",
            isRoot: false,
            type: "buying",
        },
    };
    const { changeSnackbarValues } = useContext(LayoutContext);
    const [orderReducerState, dispatch] = useReducer(orderReducer, orderReducerStateInitial);
    const {
        orderList,
        buyingOrders,
        sellingOrders,
        buyingComparingOrders,
        sellingComparingOrders,
        currentOrder,
        preparingOrders,
        carryingOrders,
        packagingOrders,
        deliveringOrders,
        successOrders,
        canceledOrders,
        orderDetails,
        currentSubOrders,
        currentOrderConfirmationValue,
    } = orderReducerState;

    const convertOrderStatus = (status: string): OrderStatusConverted => {
        if (status === "ready") {
            return { convertedStatus: "Đang chờ nhận hàng", isDone: true };
        }
        if (status === "carrying_in") {
            return { convertedStatus: "Đang nhận hàng", isDone: false };
        }
        if (status === "carried_in") {
            return { convertedStatus: "Đang chờ đóng gói", isDone: true };
        }
        if (status === "packaging") {
            return { convertedStatus: "Đang đóng gói", isDone: false };
        }
        if (status === "packaged") {
            return { convertedStatus: "Đang chờ giao hàng", isDone: true };
        }
        if (status === "delivering") {
            return { convertedStatus: "Đang giao hàng", isDone: false };
        }
        if (status === "success") {
            return { convertedStatus: "Đã giao hàng", isDone: true };
        }
        if (status === "confirmed") {
            return { convertedStatus: "Đã xác nhận", isDone: true };
        }
        if (status === "cancel") {
            return {
                convertedStatus: "Đã huỷ",
                isDone: false,
            };
        }
        return {
            convertedStatus: "Đang chuẩn bị",
            isDone: false,
        };
    };

    const checkStep = (currentStep: string, checkingStep: string): boolean => {
        // ready => checking step
        // packaging => current step
        let flag = false;
        const statusArray = [
            "preparing",
            "ready",
            "carrying_in",
            "carried_in",
            "packaging",
            "packaged",
            "delivering",
            "success",
            "confirmed",
        ];
        const statusIndex = statusArray.findIndex((step: string) => step === checkingStep);
        for (let i = 0; i < statusIndex + 1 && !flag; i++) {
            if (statusArray[i] === currentStep) {
                console.log(statusArray[i]);
                flag = true;
            }
        }
        console.log(statusIndex, `currentStep: ${currentStep}`, `checkingStep: ${checkingStep}`, flag);
        return flag;
    };

    const handleError = (error: any) => {
        if (axios.isAxiosError(error)) {
            changeSnackbarValues({
                content: error.response?.data.message,
                isToggle: true,
                type: "error",
            });
            return;
        }
        changeSnackbarValues({
            content: "Lỗi hệ thống",
            isToggle: true,
            type: "error",
        });
    };

    const storeOrders = (type: OrderActionType, data: any) => {
        dispatch({ type, payload: data });
    };

    const loadOrderDetails = async (orderId: string) => {
        try {
            const response = await axios.get(`${host}/api/order/specific/${orderId}`);
            if (response.data.result) {
                const {
                    id,
                    product_name,
                    quantity,
                    price,
                    request_user,
                    subrequest_user,
                    request_address,
                    subrequest_address,
                    fee,
                    request_id,
                    subrequest_id,
                    status,
                    transaction_type,
                    date_complete_order,
                    expired_date,
                    order_created_date,
                    subrequest_username,
                    request_username,
                    measure,
                    grabbing_assignment_id,
                    grabbing_date_assigned,
                    grabbing_date_completed,
                    grabbing_user_id,
                    grabbing_username,
                    packaging_assignment_id,
                    packaging_date_assigned,
                    packaging_date_completed,
                    packaging_user_id,
                    packaging_username,
                    delivering_assignment_id,
                    delivering_date_assigned,
                    delivering_date_completed,
                    delivering_user_id,
                    delivering_username,
                    date_confirmed,
                } = response.data.result;
                const payload: OrderAssignmentValueInitializer = {
                    order: {
                        id,
                        productName: product_name,
                        quantity,
                        price,
                        total: price * quantity,
                        requestUserId: request_user,
                        subrequestUserId: subrequest_user,
                        requestAddress:
                            transaction_type === "buying"
                                ? subrequest_address.split("!^!")[0]
                                : request_address.split("!^!")[0],
                        subrequestAddress:
                            transaction_type === "selling"
                                ? subrequest_address.split("!^!")[0]
                                : request_address.split("!^!")[0],
                        fee,
                        requestId: request_id,
                        subrequestId: subrequest_id,
                        status,
                        transactionType: transaction_type,
                        dateCompletedOrder: transaction_type === "selling" ? expired_date : date_complete_order,
                        expiredDate: transaction_type === "buying" ? expired_date : date_complete_order,
                        orderCreatedDate: order_created_date,
                        subrequestUsername: transaction_type === "selling" ? subrequest_username : request_username,
                        requestUsername: transaction_type === "buying" ? subrequest_username : request_username,
                        measure,
                        orderConfirmedDate: date_confirmed,
                    },
                    grabbingAsignment: {
                        id: grabbing_assignment_id,
                        dateAssigned: new Date(grabbing_date_assigned),
                        dateCompleted: new Date(grabbing_date_completed),
                        userId: grabbing_user_id,
                        username: grabbing_username,
                    },
                    packagingAssignment: {
                        id: packaging_assignment_id,
                        dateAssigned: new Date(packaging_date_assigned),
                        dateCompleted: new Date(packaging_date_completed),
                        userId: packaging_user_id,
                        username: packaging_username,
                    },
                    deliveringAssignment: {
                        id: delivering_assignment_id,
                        dateAssigned: new Date(delivering_date_assigned),
                        dateCompleted: new Date(delivering_date_completed),
                        userId: delivering_user_id,
                        username: delivering_username,
                    },
                };
                dispatch({ type: "loadOrderDetails", payload });
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                dispatch({ type: "loadOrderDetails", payload: orderDetailsDefault });
                return;
            }
            handleError(error);
        }
    };

    const loadSpecificRootOrder = async (type: TransactionType, id: string) => {
        try {
            console.log(`${host}/api/order/root/${id}`);
            const response = await axios.get(`${host}/api/order/root/${id}`);
            if (response.data.result && response.data.result.length > 0) {
                const orderList = response.data.result;
                let totalOrderQuantity = 0;
                let totalOrderAmount = 0;
                let totalOrderPrice = 0;
                let users = "";
                const addressList: string[] = [];
                orderList.forEach((order: any) => {
                    const { quantity, price, subrequest_username, subrequest_address } = order;
                    totalOrderQuantity += quantity;
                    totalOrderPrice += price;
                    totalOrderAmount += quantity * price;
                    addressList.push(`${subrequest_address.split("!^!")[0]}`);
                    users += `${subrequest_username}, `;
                });
                const addresses = addressList.join("!^!");
                const mappedSubOrders: OrderValueInitializer[] = orderList.map((order: any) => {
                    const {
                        id,
                        product_name,
                        quantity,
                        price,
                        request_user,
                        subrequest_user,
                        request_address,
                        subrequest_address,
                        fee,
                        request_id,
                        subrequest_id,
                        status,
                        transaction_type,
                        date_complete_order,
                        expired_date,
                        subrequest_username,
                        request_username,
                        measure,
                        order_created_date,
                        date_confirmed,
                    } = order;
                    const temporaryDataSubOrder: OrderValueInitializer = {
                        id,
                        productName: product_name,
                        quantity,
                        price,
                        total: price * quantity,
                        requestUserId: request_user,
                        subrequestUserId: subrequest_user,
                        requestAddress: request_address,
                        subrequestAddress: subrequest_address,
                        fee,
                        requestId: request_id,
                        subrequestId: subrequest_id,
                        status,
                        transactionType: transaction_type,
                        dateCompletedOrder: date_complete_order,
                        expiredDate: expired_date,
                        subrequestUsername: subrequest_username,
                        requestUsername: request_username,
                        measure,
                        orderCreatedDate: order_created_date,
                        orderConfirmedDate: date_confirmed,
                    };
                    return temporaryDataSubOrder;
                });
                dispatch({ type: "changeCurrentSubOrders", payload: mappedSubOrders });
                const {
                    product_name,
                    request_user,
                    subrequest_user,
                    request_address,
                    subrequest_address,
                    fee,
                    request_id,
                    subrequest_id,
                    status,
                    transaction_type,
                    date_complete_order,
                    expired_date,
                    order_created_date,
                    subrequest_username,
                    request_username,
                    measure,
                    grabbing_assignment_id,
                    grabbing_date_assigned,
                    grabbing_date_completed,
                    grabbing_user_id,
                    grabbing_username,
                    packaging_assignment_id,
                    packaging_date_assigned,
                    packaging_date_completed,
                    packaging_user_id,
                    packaging_username,
                    delivering_assignment_id,
                    delivering_date_assigned,
                    delivering_date_completed,
                    delivering_user_id,
                    delivering_username,
                    date_confirmed,
                } = orderList[0];
                const initialOrderInfo: OrderAssignmentValueInitializer = {
                    order: {
                        id: request_id,
                        productName: product_name,
                        quantity: totalOrderQuantity,
                        price: totalOrderPrice / orderList.length,
                        total: totalOrderAmount,
                        requestUserId: request_user,
                        subrequestUserId: subrequest_user,
                        requestAddress: type === "selling" ? addresses : request_address.split("!^!")[0],
                        subrequestAddress: type === "selling" ? subrequest_address.split("!^!")[0] : addresses,
                        fee,
                        requestId: request_id,
                        subrequestId: subrequest_id,
                        status,
                        transactionType: transaction_type,
                        dateCompletedOrder: date_complete_order,
                        expiredDate: expired_date,
                        orderCreatedDate: order_created_date,
                        subrequestUsername:
                            type === "selling" ? subrequest_username : users.substring(0, users.length - 2),
                        requestUsername: type === "buying" ? request_username : users.substring(0, users.length - 2),
                        measure,
                        orderConfirmedDate: date_confirmed,
                    },
                    grabbingAsignment: {
                        id: grabbing_assignment_id,
                        dateAssigned: new Date(grabbing_date_assigned),
                        dateCompleted: new Date(grabbing_date_completed),
                        userId: grabbing_user_id,
                        username: grabbing_username,
                    },
                    packagingAssignment: {
                        id: packaging_assignment_id,
                        dateAssigned: new Date(packaging_date_assigned),
                        dateCompleted: new Date(packaging_date_completed),
                        userId: packaging_user_id,
                        username: packaging_username,
                    },
                    deliveringAssignment: {
                        id: delivering_assignment_id,
                        dateAssigned: new Date(delivering_date_assigned),
                        dateCompleted: new Date(delivering_date_completed),
                        userId: delivering_user_id,
                        username: delivering_username,
                    },
                };
                dispatch({ type: "loadOrderDetails", payload: initialOrderInfo });
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                dispatch({ type: "loadOrderDetails", payload: orderDetailsDefault });
                return;
            }
            handleError(error);
        }
    };

    const loadAllOrders = async (uid?: string, loadingHistory?: boolean, type?: TransactionType) => {
        try {
            console.log(`${host}/api/order${uid ? `/${uid}` : ``}${loadingHistory ? "?load_history=1" : ""}`);
            const response = await axios.get(
                `${host}/api/order${uid ? `/${uid}` : ``}${loadingHistory ? "?load_history=1" : ""}`
            );
            if (response.data.result) {
                const result = response.data.result;
                const temporaryData: OrderValueInitializer[] = result.map((order: any) => {
                    const {
                        id,
                        product_name,
                        quantity,
                        price,
                        request_user,
                        subrequest_user,
                        request_address,
                        subrequest_address,
                        fee,
                        request_id,
                        subrequest_id,
                        status,
                        transaction_type,
                        date_complete_order,
                        expired_date,
                        subrequest_username,
                        request_username,
                        measure,
                        order_created_date,
                        date_confirmed,
                    } = order;
                    const returnValue: OrderValueInitializer = {
                        id,
                        productName: product_name,
                        quantity,
                        price,
                        total: price * quantity,
                        requestUserId: request_user,
                        subrequestUserId: subrequest_user,
                        requestAddress: request_address,
                        subrequestAddress: subrequest_address,
                        fee,
                        requestId: request_id,
                        subrequestId: subrequest_id,
                        status,
                        transactionType: transaction_type,
                        dateCompletedOrder: date_complete_order,
                        expiredDate: expired_date,
                        subrequestUsername: subrequest_username,
                        requestUsername: request_username,
                        measure,
                        orderCreatedDate: order_created_date,
                        orderConfirmedDate: date_confirmed,
                    };
                    return returnValue;
                });
                const targetOrders =
                    type !== undefined ? temporaryData.filter(order => order.transactionType === type) : temporaryData;
                dispatch({ type: "loadOrders", payload: targetOrders });
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                dispatch({ type: "loadOrders", payload: [] });
            }
            handleError(error);
        }
    };

    const changeCurrentOrderInformation = (order: OrderValueInitializer) => {
        dispatch({ type: "changeCurrentOrder", payload: order });
    };

    const changeOrderStatus = async (status: string, uid: string) => {
        try {
            const { id, type, isRoot } = currentOrderConfirmationValue;
            console.log(id, type, isRoot);
            await axios.patch(`${host}/api/order/status/${id}`, {
                status,
                isRoot,
                uid,
            });
            isRoot ? loadSpecificRootOrder(type, id) : loadOrderDetails(id);
            changeSnackbarValues({
                content: "Thay đổi trạng thái đơn hàng thành công",
                isToggle: true,
                type: "success",
            });
        } catch (error) {
            handleError(error);
        }
    };

    const changeCurrentOrderConfirmationValue = (value: OrderConfirmationValue) => {
        dispatch({ type: "changeCurrentOrderConfirmationValue", payload: value });
    };

    const loadOrderStatistic = async (
        uid: string | undefined,
        dateType: string,
        dateBegin: Date,
        dateEnd: Date,
        type: TransactionType,
        role?: string
    ) => {
        try {
            console.log(dateType);
            console.log(
                `${host}/api/order${
                    uid ? `/${uid}` : ``
                }?date_begin=${dateBegin}&date_end=${dateEnd}&date_type=${dateType}${
                    role ? `&user_id_type=${role}` : ``
                }`
            );
            const response = await axios.get(
                `${host}/api/order${
                    uid ? `/${uid}` : ``
                }?date_begin=${dateBegin}&date_end=${dateEnd}&date_type=${dateType}${
                    role ? `&user_id_type=${role}` : ``
                }`
            );
            const data = response.data.result;
            if (data) {
                const temporaryData: OrderValueInitializer[] = data.map((order: any) => {
                    const {
                        id,
                        product_name,
                        quantity,
                        price,
                        request_user,
                        subrequest_user,
                        request_address,
                        subrequest_address,
                        fee,
                        request_id,
                        subrequest_id,
                        status,
                        transaction_type,
                        date_complete_order,
                        expired_date,
                        subrequest_username,
                        request_username,
                        measure,
                        order_created_date,
                        date_confirmed,
                    } = order;
                    const returnValue: OrderValueInitializer = {
                        id,
                        productName: product_name,
                        quantity,
                        price,
                        total: price * quantity,
                        requestUserId: request_user,
                        subrequestUserId: subrequest_user,
                        requestAddress: request_address,
                        subrequestAddress: subrequest_address,
                        fee,
                        requestId: request_id,
                        subrequestId: subrequest_id,
                        status,
                        transactionType: transaction_type,
                        dateCompletedOrder: date_complete_order,
                        expiredDate: expired_date,
                        subrequestUsername: subrequest_username,
                        requestUsername: request_username,
                        measure,
                        orderCreatedDate: order_created_date,
                        orderConfirmedDate: date_confirmed,
                    };
                    return returnValue;
                });
                const filterdOrders = temporaryData.filter(order => order.transactionType === type);
                dispatch({
                    type: type === "selling" ? "loadSellingOrders" : "loadBuyingOrders",
                    payload: filterdOrders,
                });
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                dispatch({
                    type: type === "selling" ? "loadSellingOrders" : "loadBuyingOrders",
                    payload: [],
                });
                return;
            }
            handleError(error);
        }
    };

    const loadComparingOrderStatistic = async (
        uid: string,
        dateType: string,
        dateBegin: Date,
        dateEnd: Date,
        type: TransactionType,
        role?: string
    ) => {
        try {
            console.log(dateType);
            const response = await axios.get(
                `${host}/api/order/${uid}?date_begin=${dateBegin}&date_end=${dateEnd}&date_type=${dateType}${
                    role ? `&user_id_type=${role}` : ``
                }`
            );
            const data = response.data.result;
            if (data) {
                const temporaryData: OrderValueInitializer[] = data.map((order: any) => {
                    const {
                        id,
                        product_name,
                        quantity,
                        price,
                        request_user,
                        subrequest_user,
                        request_address,
                        subrequest_address,
                        fee,
                        request_id,
                        subrequest_id,
                        status,
                        transaction_type,
                        date_complete_order,
                        expired_date,
                        subrequest_username,
                        request_username,
                        measure,
                        order_created_date,
                        date_confirmed,
                    } = order;
                    const returnValue: OrderValueInitializer = {
                        id,
                        productName: product_name,
                        quantity,
                        price,
                        total: price * quantity,
                        requestUserId: request_user,
                        subrequestUserId: subrequest_user,
                        requestAddress: request_address,
                        subrequestAddress: subrequest_address,
                        fee,
                        requestId: request_id,
                        subrequestId: subrequest_id,
                        status,
                        transactionType: transaction_type,
                        dateCompletedOrder: date_complete_order,
                        expiredDate: expired_date,
                        subrequestUsername: subrequest_username,
                        requestUsername: request_username,
                        measure,
                        orderCreatedDate: order_created_date,
                        orderConfirmedDate: date_confirmed,
                    };
                    return returnValue;
                });
                const filterdOrders = temporaryData.filter(order => order.transactionType === type);
                dispatch({
                    type: type === "selling" ? "loadSellingComparingOrders" : "loadBuyingComparingOrders",
                    payload: filterdOrders,
                });
            }
        } catch (error) {
            handleError(error);
        }
    };

    const orderContextValue: OrderContextDefault = {
        orderList,
        buyingOrders,
        sellingOrders,
        buyingComparingOrders,
        sellingComparingOrders,
        preparingOrders,
        carryingOrders,
        packagingOrders,
        deliveringOrders,
        successOrders,
        canceledOrders,
        orderDetails,
        currentOrder,
        currentSubOrders,
        currentOrderConfirmationValue,
        loadOrderStatistic,
        loadComparingOrderStatistic,
        convertOrderStatus,
        loadAllOrders,
        storeOrders,
        loadOrderDetails,
        loadSpecificRootOrder,
        changeCurrentOrderInformation,
        changeOrderStatus,
        changeCurrentOrderConfirmationValue,
        checkStep,
    };

    return <OrderContext.Provider value={orderContextValue}>{children}</OrderContext.Provider>;
};

export default OrderContextProvider;
