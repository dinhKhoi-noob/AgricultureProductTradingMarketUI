import {
    OrderAssignmentValueInitializer,
    OrderConfirmationValue,
    OrderValueInitializer,
    RatingInputValue,
    RatingValueInitializer,
} from "../context/OrderContext";

export type OrderActionType =
    | "loadOrders"
    | "loadOrderDetails"
    | "loadPreparingOrders"
    | "loadCarryingOrders"
    | "loadPackagingOrders"
    | "loadDeliveringOrders"
    | "loadSuccessOrders"
    | "loadCanceledOrders"
    | "loadBuyingOrders"
    | "loadSellingOrders"
    | "loadBuyingComparingOrders"
    | "loadSellingComparingOrders"
    | "changeCurrentOrder"
    | "changeCurrentSubOrders"
    | "changeCurrentOrderConfirmationValue"
    | "setRatingList"
    | "loadRatingList";

export interface OrderReducerState {
    orderList: OrderValueInitializer[];
    orderDetails: OrderAssignmentValueInitializer;
    currentOrder: OrderValueInitializer | undefined;
    currentSubOrders: OrderValueInitializer[];
    currentOrderConfirmationValue: OrderConfirmationValue;
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
    inputRatingList: RatingInputValue[];
    ratingList: RatingValueInitializer[];
}

interface OrderAction {
    type: OrderActionType;
    payload:
        | OrderValueInitializer[]
        | any[]
        | OrderAssignmentValueInitializer
        | OrderValueInitializer
        | OrderConfirmationValue
        | RatingInputValue[]
        | RatingValueInitializer[];
}

export const orderReducer = (state: OrderReducerState, action: OrderAction) => {
    const { type, payload } = action;
    console.log(type, payload);
    switch (type) {
        case "loadOrders":
            return {
                ...state,
                orderList: payload as OrderValueInitializer[],
            };
        case "loadOrderDetails":
            return {
                ...state,
                orderDetails: payload as OrderAssignmentValueInitializer,
            };
        case "loadPreparingOrders":
            return {
                ...state,
                preparingOrders: [...state.preparingOrders, payload],
            };
        case "loadCarryingOrders":
            return {
                ...state,
                carryingOrders: [...state.carryingOrders, payload],
            };
        case "loadPackagingOrders":
            return {
                ...state,
                packagingOrders: [...state.packagingOrders, payload],
            };
        case "loadDeliveringOrders":
            return {
                ...state,
                deliveringOrders: [...state.deliveringOrders, payload],
            };
        case "loadSuccessOrders":
            return {
                ...state,
                successOrders: [...state.successOrders, payload],
            };
        case "loadCanceledOrders":
            return {
                ...state,
                canceledOrders: [...state.canceledOrders, payload],
            };
        case "changeCurrentOrder":
            return {
                ...state,
                currentOrder: payload as OrderValueInitializer,
            };
        case "changeCurrentSubOrders":
            return {
                ...state,
                currentSubOrders: payload as OrderValueInitializer[],
            };
        case "changeCurrentOrderConfirmationValue":
            return {
                ...state,
                currentOrderConfirmationValue: payload as OrderConfirmationValue,
            };
        case "loadBuyingOrders":
            return {
                ...state,
                buyingOrders: payload as OrderValueInitializer[],
            };
        case "loadSellingOrders":
            return {
                ...state,
                sellingOrders: payload as OrderValueInitializer[],
            };
        case "loadBuyingComparingOrders":
            return {
                ...state,
                buyingComparingOrders: payload as OrderValueInitializer[],
            };
        case "loadSellingComparingOrders":
            return {
                ...state,
                sellingComparingOrders: payload as OrderValueInitializer[],
            };
        case "setRatingList":
            return {
                ...state,
                inputRatingList: payload as RatingInputValue[],
            };
        case "loadRatingList":
            return {
                ...state,
                ratingList: payload as RatingValueInitializer[],
            };
        default:
            return state;
    }
};
