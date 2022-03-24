import { BuyingRequestImage, BuyingRequestValueResponseInitializer } from "../context/BuyingRequestContext";

type BuyingRequestActionType = "loadUnconfirmedRequests" | "loadConfirmedRequests" | "loadImages";

export interface BuyingRequestState {
    unconfirmedBuyingRequests: BuyingRequestValueResponseInitializer[];
    confirmedBuyingRequests: BuyingRequestValueResponseInitializer[];
    requestImages: BuyingRequestImage[];
}

interface BuyingRequestAction {
    type: BuyingRequestActionType;
    payload: BuyingRequestValueResponseInitializer[] | BuyingRequestImage[];
}

export const buyingRequestReducer = (state: BuyingRequestState, action: BuyingRequestAction) => {
    const { type, payload } = action;
    console.log(type, payload);
    switch (type) {
        case "loadUnconfirmedRequests":
            return {
                ...state,
                unconfirmedBuyingRequests: payload as BuyingRequestValueResponseInitializer[],
            };
        case "loadConfirmedRequests":
            return {
                ...state,
                confirmedBuyingRequests: payload as BuyingRequestValueResponseInitializer[],
            };
        case "loadImages":
            return {
                ...state,
                requestImages: payload as BuyingRequestImage[],
            };
        default:
            return state;
    }
};
