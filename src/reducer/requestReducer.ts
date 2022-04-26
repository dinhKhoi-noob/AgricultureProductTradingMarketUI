import {
    RequestImage,
    RequestValueInitializer,
    RequestValueResponseInitializer,
    SearchResult,
    SubrequestResponseValueInitializer,
} from "../context/RequestContext";

type RequestActionType =
    | "loadUnconfirmedRequests"
    | "loadConfirmedRequests"
    | "loadImages"
    | "loadSubrequest"
    | "loadSubrequestImage"
    | "changeCurrentRequest"
    | "loadSpecificRequestImage"
    | "loadSpecificSubrequest"
    | "loadSpecificRequest"
    | "changeRequestValue"
    | "loadSubrequestBuyingStatistic"
    | "loadSubrequestSellingStatistic"
    | "loadSearchResult";

export interface RequestState {
    unconfirmedRequests: RequestValueResponseInitializer[];
    confirmedRequests: RequestValueResponseInitializer[];
    requestImages: RequestImage[];
    subrequests: SubrequestResponseValueInitializer[];
    subrequestsImages: RequestImage[];
    currentTargetRequest: RequestValueResponseInitializer;
    currentTargetRequestImages: RequestImage[];
    subrequestForSpecificRequest: SubrequestResponseValueInitializer[];
    currentSubrequest: SubrequestResponseValueInitializer;
    requestValue: RequestValueInitializer;
    buyingSubrequestStatistic: SubrequestResponseValueInitializer[];
    sellingSubrequestStatistic: SubrequestResponseValueInitializer[];
    searchResult: SearchResult[];
}

interface RequestAction {
    type: RequestActionType;
    payload:
        | RequestValueResponseInitializer[]
        | RequestImage[]
        | SubrequestResponseValueInitializer[]
        | RequestValueResponseInitializer
        | SubrequestResponseValueInitializer
        | RequestValueInitializer
        | SearchResult[];
}

export const requestReducer = (state: RequestState, action: RequestAction) => {
    const { type, payload } = action;
    switch (type) {
        case "loadUnconfirmedRequests":
            return {
                ...state,
                unconfirmedRequests: payload as RequestValueResponseInitializer[],
            };
        case "loadConfirmedRequests":
            return {
                ...state,
                confirmedRequests: payload as RequestValueResponseInitializer[],
            };
        case "loadImages":
            return {
                ...state,
                requestImages: payload as RequestImage[],
            };
        case "loadSubrequest":
            return {
                ...state,
                subrequests: payload as SubrequestResponseValueInitializer[],
            };
        case "loadSubrequestImage":
            return {
                ...state,
                subrequestsImages: payload as RequestImage[],
            };
        case "changeCurrentRequest":
            return {
                ...state,
                currentTargetRequest: payload as RequestValueResponseInitializer,
            };
        case "loadSpecificRequestImage":
            return {
                ...state,
                currentTargetRequestImages: payload as RequestImage[],
            };
        case "loadSpecificSubrequest":
            return {
                ...state,
                subrequestForSpecificRequest: payload as SubrequestResponseValueInitializer[],
            };
        case "loadSpecificRequest":
            return {
                ...state,
                currentSubrequest: payload as SubrequestResponseValueInitializer,
            };
        case "changeRequestValue":
            return {
                ...state,
                requestValue: payload as RequestValueInitializer,
            };
        case "loadSubrequestBuyingStatistic":
            return {
                ...state,
                buyingSubrequestStatistic: payload as SubrequestResponseValueInitializer[],
            };
        case "loadSubrequestSellingStatistic":
            return {
                ...state,
                sellingSubrequestStatistic: payload as SubrequestResponseValueInitializer[],
            };
        case "loadSearchResult":
            return {
                ...state,
                searchResult: payload as SearchResult[],
            };
        default:
            return state;
    }
};
