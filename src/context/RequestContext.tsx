/* eslint-disable camelcase */
import { MenuItem } from "@mui/material";
import axios from "axios";
import { compareAsc } from "date-fns";
import React, { createContext, ReactNode, useContext, useReducer, useState } from "react";
import { UserAddressValue } from "../reducer/authReducer";
import { requestReducer, RequestState } from "../reducer/requestReducer";
import { AuthContext } from "./AuthContext";
import { LayoutContext, RequestConfirmationType } from "./LayoutContext";
import { UploadFileContext } from "./UploadFileContext";

type GetImageType = "request" | "subrequest";
export type TransactionType = "selling" | "buying";
interface RequestProps {
    children: ReactNode;
}

export interface SucceedTradingUserProps {
    id: string;
    username: string;
    avatar: string;
    quantity: number;
}

export interface OwnerProps {
    id: string;
    username: string;
    avatar: string;
}

export interface ModalProps {
    owner: OwnerProps;
    quantity: number;
    process: number;
    title: string;
    price: number;
    selledUser: SucceedTradingUserProps[];
}

export interface SubrequestValueInitializer {
    id: string;
    price: number;
    quantity: number;
    uid: string;
    description: string;
    dateCompletedOrder: Date;
    address: string;
}

export interface RequestImage {
    id: string;
    requestId: string;
    url: string;
}

export interface RequestValueResponseInitializer {
    id: string;
    specificProductName: string;
    owner: OwnerProps;
    createdDate: Date;
    expiredDate: Date;
    productId: string;
    quantity: number;
    price: number;
    process: number;
    measure: string;
    description: string;
    productName: string;
    status: string;
    address: string;
    isConfirmed: boolean;
    fee: number;
    type: TransactionType;
}

export interface SubrequestResponseValueInitializer {
    id: string;
    createdBy: string;
    createdDate: Date;
    completedDateOrder: Date;
    status: string;
    requestId: string;
    quantity: number;
    price: number;
    description: string;
    username: string;
    avatar: string;
    measure: string;
    productName: string;
    address: string;
    specificProductName: string;
    customerName: string;
    ownerRequestId: string;
    fee: number;
    transactionType: TransactionType;
}

export interface RequestValueInitializer {
    id: string;
    product: string;
    price: number;
    quantity: number;
    measure: string;
    expiredDate: Date;
    desc: string;
    address: string;
    productName: string;
    fee: number;
}

export interface StatisticProps {
    fee: number;
    avgPrice: number;
    budget: number;
    amount: number;
}

export interface SearchResult {
    subrequests: SubrequestResponseValueInitializer[];
    requests: RequestValueResponseInitializer[];
}

interface RequestProviderProps {
    isOpenedModal: boolean;
    isBeginSlide: boolean;
    modalInformation: ModalProps;
    isToggleCreateNewRequestModal: boolean;
    newRequest: RequestValueInitializer;
    confirmedRequests: RequestValueResponseInitializer[];
    unconfirmedRequests: RequestValueResponseInitializer[];
    requestImages: RequestImage[];
    submitType: RequestConfirmationType;
    currentSellingRequest: SubrequestValueInitializer;
    transactionAddress: string;
    isToggleAddNewAddress: boolean;
    subrequests: SubrequestResponseValueInitializer[];
    currentTargetRequest: RequestValueResponseInitializer;
    specificRequestImages: RequestImage[];
    subrequestForSpecificRequest: SubrequestResponseValueInitializer[];
    currentSubrequest: SubrequestResponseValueInitializer;
    buyingSubrequestStatistic: SubrequestResponseValueInitializer[];
    sellingSubrequestStatistic: SubrequestResponseValueInitializer[];
    currentRequestId: string;
    searchResult: SearchResult[];
    loadSpecificRequest: (id: string, isSubRequest: boolean, type: TransactionType, refId?: string) => void;
    loadSpecificBuyingRequest: (id: string) => void;
    changeIsOpenModalStatus: (status: boolean) => void;
    setIsBeginSlide: (status: boolean) => void;
    changeModalInformation: (information: ModalProps) => void;
    changeToggleCreateNewRequestModal: (status: boolean) => void;
    changeNewRequestValue: (value: RequestValueInitializer) => void;
    getConfirmedRequests: (
        type: TransactionType,
        loadHistory?: boolean,
        id?: string,
        dateBegin?: Date,
        dateEnd?: Date
    ) => void;
    getUnconfirmedRequests: (
        type: TransactionType,
        loadHistory?: boolean,
        id?: string,
        dateBegin?: Date,
        dateEnd?: Date
    ) => void;
    createNewRequest: (value: RequestValueInitializer, id: string, type: TransactionType, imageList?: string[]) => void;
    confirmRequest: (type: TransactionType) => void;
    registerSubrequest: (
        uid: string,
        request: SubrequestValueInitializer,
        imageList: string[],
        type: TransactionType
    ) => void;
    loadSubrequestStatistic: (
        uid: string,
        role: string,
        type: TransactionType,
        dateBegin?: Date,
        dateEnd?: Date
    ) => void;
    loadSearchResult: (search: string, dateBegin?: Date, dateEnd?: Date) => void;
    getAllRequestImage: (type: GetImageType, transactionType: TransactionType) => void;
    fillRequest: (id: string) => void;
    fillSubrequest: (id: string) => void;
    resetField: (type: TransactionType) => void;
    changeSubmitType: (type: RequestConfirmationType) => void;
    changeCurrentSubrequest: (subrequestValue: SubrequestValueInitializer) => void;
    changeCurrentRequestId: (id: string) => void;
    changeTransactionAddress: (id: string) => void;
    renderTransactionAddressSelector: () => ReactNode;
    changeToggleOnAddNewAddressModalStatus: () => void;
    getAllSubrequest: (type: TransactionType, id?: string, dateBegin?: Date, dateEnd?: Date) => void;
    changeSubrequestStatus: (status: string, successMessage: string, type: TransactionType) => void;
    updateRequest: (type: TransactionType, imageList?: string[]) => void;
    updateSubrequest: (type: TransactionType, imageList?: string[]) => void;
    changeRequestStatus: (status: string, type: TransactionType) => void;
}

const RequestContextDefault: RequestProviderProps = {
    isOpenedModal: false,
    isBeginSlide: false,
    modalInformation: {
        owner: {
            username: "",
            avatar: "",
            id: "",
        },
        quantity: 0,
        process: 0,
        title: "",
        price: 0,
        selledUser: [],
    },
    isToggleCreateNewRequestModal: false,
    newRequest: {
        id: "",
        desc: "",
        quantity: 0,
        expiredDate: new Date(new Date(Date.now()).setDate(new Date(Date.now()).getDate() + 2)),
        price: 0,
        measure: "kg",
        product: "",
        address: "default",
        productName: "",
        fee: 10,
    },
    confirmedRequests: [],
    unconfirmedRequests: [],
    requestImages: [],
    submitType: "newBuyingRequest",
    currentRequestId: "",
    currentSellingRequest: {
        description: "",
        id: "",
        price: 0,
        quantity: 0,
        uid: "",
        address: "default",
        dateCompletedOrder: new Date(
            new Date(Date.now()).setDate(
                new Date(new Date(Date.now()).setDate(new Date(Date.now()).getDate() + 2)).getDate() + 1
            )
        ),
    },
    transactionAddress: "",
    isToggleAddNewAddress: false,
    subrequests: [],
    currentTargetRequest: {
        id: "",
        owner: {
            username: "",
            avatar: "",
            id: "",
        },
        price: 0,
        process: 0,
        productId: "",
        productName: "",
        createdDate: new Date(new Date()),
        status: "",
        description: "",
        expiredDate: new Date(new Date(new Date(new Date()).setDate(new Date(new Date()).getDate() + 2))),
        measure: "kg",
        quantity: 0,
        address: "",
        specificProductName: "",
        isConfirmed: false,
        fee: 10,
        type: "buying",
    },
    specificRequestImages: [],
    subrequestForSpecificRequest: [],
    currentSubrequest: {
        id: "",
        address: "",
        avatar: "",
        completedDateOrder: new Date(Date.now()),
        createdBy: "",
        createdDate: new Date(Date.now()),
        description: "",
        measure: "",
        price: 0,
        quantity: 0,
        productName: "",
        requestId: "",
        specificProductName: "",
        status: "",
        username: "",
        customerName: "",
        fee: 0,
        ownerRequestId: "",
        transactionType: "selling",
    },
    buyingSubrequestStatistic: [],
    sellingSubrequestStatistic: [],
    searchResult: [],
    loadSpecificRequest: () => null,
    loadSpecificBuyingRequest: () => null,
    setIsBeginSlide: () => null,
    changeIsOpenModalStatus: () => null,
    changeModalInformation: () => null,
    changeToggleCreateNewRequestModal: () => null,
    changeNewRequestValue: () => null,
    createNewRequest: () => null,
    getConfirmedRequests: () => null,
    getUnconfirmedRequests: () => null,
    getAllRequestImage: () => null,
    loadSubrequestStatistic: () => null,
    fillRequest: () => null,
    fillSubrequest: () => null,
    resetField: () => null,
    changeSubmitType: () => null,
    confirmRequest: () => null,
    registerSubrequest: () => null,
    changeCurrentSubrequest: () => null,
    changeCurrentRequestId: () => null,
    changeTransactionAddress: () => null,
    renderTransactionAddressSelector: () => null,
    changeToggleOnAddNewAddressModalStatus: () => null,
    getAllSubrequest: () => null,
    changeSubrequestStatus: () => null,
    updateRequest: () => null,
    updateSubrequest: () => null,
    changeRequestStatus: () => null,
    loadSearchResult: () => null,
};

export const RequestContext = createContext<RequestProviderProps>(RequestContextDefault);

const RequestContextProvider = ({ children }: RequestProps) => {
    const { addressList } = useContext(AuthContext);
    const currentDate = new Date(Date.now());
    const defaultShippingDate = new Date(currentDate.setDate(currentDate.getDate() + 2));
    const defaultTakeOrderDate = new Date(currentDate.setDate(defaultShippingDate.getDate() - 1));
    const host = "http://localhost:4000";
    const buyingRequestStateInitializer: RequestState = {
        unconfirmedRequests: [],
        confirmedRequests: [],
        requestImages: [],
        subrequests: [],
        subrequestsImages: [],
        buyingSubrequestStatistic: [],
        sellingSubrequestStatistic: [],
        searchResult: [],
        currentTargetRequest: {
            id: "",
            owner: {
                username: "",
                avatar: "",
                id: "",
            },
            price: 0,
            process: 0,
            productId: "",
            productName: "",
            createdDate: new Date(currentDate),
            status: "",
            description: "",
            expiredDate: new Date(defaultShippingDate),
            measure: "kg",
            quantity: 0,
            address: "",
            specificProductName: "",
            isConfirmed: false,
            fee: 10,
            type: "buying",
        },
        currentTargetRequestImages: [],
        subrequestForSpecificRequest: [],
        currentSubrequest: {
            id: "",
            address: "",
            avatar: "",
            completedDateOrder: new Date(Date.now()),
            createdBy: "",
            createdDate: new Date(Date.now()),
            description: "",
            measure: "",
            price: 0,
            quantity: 0,
            productName: "",
            requestId: "",
            specificProductName: "",
            status: "",
            username: "",
            customerName: "",
            fee: 0,
            ownerRequestId: "",
            transactionType: "buying",
        },
        requestValue: {
            id: "",
            desc: "",
            price: 0,
            expiredDate: defaultShippingDate,
            product: "",
            quantity: 0,
            measure: "kg",
            address: "default",
            productName: "",
            fee: 10,
        },
    };
    const [isOpenedModal, setIsOpenedModal] = useState(false);
    const [isToggleCreateNewRequestModal, setIsToggleCreateNewRequestModal] = useState(false);
    const [isToggleAddNewAddress, setIsToggleAddNewAddress] = useState(false);
    const [isBeginSlide, setIsBeginSlide] = useState(true);
    const [submitType, setSubmitType] = useState<RequestConfirmationType>("newBuyingRequest");
    const [currentRequestId, setCurrentRequestId] = useState("");
    const [modalInformation, setModalInformation] = useState<ModalProps>({
        owner: {
            id: "",
            username: "",
            avatar: "",
        },
        quantity: 0,
        process: 0,
        title: "",
        price: 0,
        selledUser: [],
    });
    const [subrequest, setSubrequest] = useState<SubrequestValueInitializer>({
        id: "",
        price: 0,
        quantity: 0,
        uid: "",
        description: "",
        dateCompletedOrder: defaultTakeOrderDate,
        address: "default",
    });
    const [transactionAddress, setTransactionAddress] = useState("");

    const [buyingRequestState, dispatch] = useReducer(requestReducer, buyingRequestStateInitializer);
    const { changeCurrentFilePaths } = useContext(UploadFileContext);
    const { changeSnackbarValues, changeLoadingStatus, changeHaveNewNotificationStatus } = useContext(LayoutContext);
    const {
        unconfirmedRequests,
        confirmedRequests,
        requestImages,
        subrequests,
        subrequestsImages,
        buyingSubrequestStatistic,
        sellingSubrequestStatistic,
        searchResult,
    } = buyingRequestState;

    const changeToggleOnAddNewAddressModalStatus = () => {
        setIsToggleAddNewAddress(!isToggleAddNewAddress);
    };

    const changeTransactionAddress = (id: string) => {
        setTransactionAddress(id);
    };

    const changeSubmitType = (type: RequestConfirmationType) => {
        setSubmitType(type);
    };

    const changeCurrentRequestId = (id: string) => {
        setCurrentRequestId(id);
    };

    const changeModalInformation = (information: ModalProps) => {
        setModalInformation(information);
    };

    const changeNewRequestValue = (value: RequestValueInitializer) => {
        dispatch({ type: "changeRequestValue", payload: value });
    };

    const changeToggleCreateNewRequestModal = (status: boolean) => {
        setIsToggleCreateNewRequestModal(status ? status : !isToggleCreateNewRequestModal);
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

    const getConfirmedRequests = async (
        type: TransactionType,
        loadHistory?: boolean,
        id?: string,
        dateBegin?: Date,
        dateEnd?: Date
    ) => {
        const confirmedBuyingRequestEndPoint = id
            ? `${host}/api/request/${id}?confirmed=0&type=${type}${
                  loadHistory ? "&list_history=0" : "&list_history=1"
              }${dateBegin ? `&date_begin=${dateBegin}&date_end=${dateEnd}` : ``}`
            : `${host}/api/request?confirmed=0&type=${type}${loadHistory ? "&list_history=0" : "&list_history=1"}${
                  dateBegin ? `&date_begin=${dateBegin}&date_end=${dateEnd}` : ``
              }`;
        try {
            console.log(confirmedBuyingRequestEndPoint);
            const confirmedBuyingRequestResponse = await axios.get(confirmedBuyingRequestEndPoint);
            const confirmedBuyingRequestData = confirmedBuyingRequestResponse.data;
            if (confirmedBuyingRequestData) {
                const temporaryConfirmedResult: RequestValueResponseInitializer[] =
                    confirmedBuyingRequestData.result.map((item: any) => {
                        const {
                            id,
                            product_specific_name,
                            created_by,
                            date_created,
                            status,
                            product_id,
                            quantity,
                            price,
                            process,
                            expired_date,
                            measure,
                            description,
                            product_name,
                            username,
                            avatar,
                            address,
                            is_confirm,
                            fee,
                            transaction_type,
                        } = item;
                        return {
                            id: id,
                            owner: {
                                username,
                                avatar,
                                id: created_by,
                            },
                            price,
                            process,
                            productId: product_id,
                            productName: product_name,
                            createdDate: date_created,
                            status,
                            description,
                            expiredDate: expired_date,
                            measure,
                            quantity,
                            address,
                            specificProductName: product_specific_name,
                            isConfirmed: is_confirm === 1 ? false : true,
                            fee,
                            type: transaction_type === "buying" ? "buying" : "selling",
                        };
                    });
                dispatch({ type: "loadConfirmedRequests", payload: temporaryConfirmedResult });
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                dispatch({ type: "loadConfirmedRequests", payload: [] });
                return;
            }
            handleError(error);
        }
    };

    const getUnconfirmedRequests = async (
        type: TransactionType,
        loadHistory?: boolean,
        id?: string,
        dateBegin?: Date,
        dateEnd?: Date
    ) => {
        const unconfirmedBuyingRequestEndPoint = id
            ? `${host}/api/request/${id}?confirmed=1&type=${type}${
                  loadHistory ? "&list_history=0" : "&list_history=0"
              }${dateBegin ? `&date_begin=${dateBegin}&date_end=${dateEnd}` : ``}`
            : `${host}/api/request?confirmed=1&type=${type}${loadHistory ? "&list_history=0" : "&list_history=0"}${
                  dateBegin ? `&date_begin=${dateBegin}&date_end=${dateEnd}` : ``
              }`;
        try {
            const unconfirmedBuyingRequestResponse = await axios.get(unconfirmedBuyingRequestEndPoint);
            const unconfirmedBuyingRequestData = unconfirmedBuyingRequestResponse.data;
            if (unconfirmedBuyingRequestData.result) {
                const temporaryUnconfirmedResult: RequestValueResponseInitializer[] =
                    unconfirmedBuyingRequestData.result.map((item: any) => {
                        const {
                            id,
                            created_by,
                            date_created,
                            status,
                            product_id,
                            quantity,
                            price,
                            process,
                            expired_date,
                            measure,
                            description,
                            product_name,
                            username,
                            avatar,
                            address,
                            product_specific_name,
                            is_confirm,
                            fee,
                            transaction_type,
                        } = item;
                        return {
                            id: id,
                            owner: {
                                username,
                                avatar,
                                id: created_by,
                            },
                            price,
                            process,
                            productId: product_id,
                            productName: product_name,
                            createdDate: date_created,
                            status,
                            description,
                            expiredDate: expired_date,
                            measure,
                            quantity,
                            address,
                            specificProductName: product_specific_name,
                            isConfirmed: is_confirm === 1 ? false : true,
                            fee,
                            type: transaction_type === "buying" ? "buying" : "selling",
                        };
                    });

                dispatch({ type: "loadUnconfirmedRequests", payload: temporaryUnconfirmedResult });
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                dispatch({ type: "loadUnconfirmedRequests", payload: [] });
                return;
            }
            handleError(error);
        }
    };

    const changeIsOpenModalStatus = (status: boolean) => {
        setIsOpenedModal(status);
        setTimeout(() => {
            setIsBeginSlide(false);
        }, 1000);
    };

    const resetField = (type: TransactionType) => {
        setIsToggleCreateNewRequestModal(false);
        setSubmitType(type === "selling" ? "newSellingRequest" : "newBuyingRequest");
        changeCurrentFilePaths([]);
        dispatch({
            type: "changeRequestValue",
            payload: {
                id: "",
                desc: "",
                price: 0,
                expiredDate: defaultShippingDate,
                product: "",
                quantity: 0,
                measure: "kg",
                address: "default",
                productName: "",
                fee: 10,
            },
        });
    };

    const getAllRequestImage = async (type: GetImageType, transactionType: TransactionType) => {
        try {
            const endPoint =
                type === "request"
                    ? `${host}/api/image/request?type=${transactionType}`
                    : `${host}/api/image/subrequest?type=${transactionType}`;
            const response = await axios.get(endPoint);
            if (response.data.result) {
                const result: RequestImage[] = response.data.result.map((image: any) => {
                    const { image_id, request_id, url } = image;
                    return {
                        id: image_id,
                        requestId: request_id,
                        url,
                    };
                });
                switch (type) {
                    case "request":
                        dispatch({ type: "loadImages", payload: result });
                        break;
                    case "subrequest":
                        dispatch({ type: "loadSubrequestImage", payload: result });
                        break;
                    default:
                        break;
                }
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                dispatch({ type: "loadImages", payload: [] });
                dispatch({ type: "loadSubrequestImage", payload: [] });
                return;
            }
            handleError(error);
        }
    };

    const createNewRequest = async (
        value: RequestValueInitializer,
        id: string,
        type: TransactionType,
        imageList?: string[]
    ) => {
        const { product, price, quantity, desc, measure, expiredDate, productName, address, fee } = value;
        const newDate = new Date(expiredDate).toISOString().slice(0, 19).replace("T", " ");
        const temporaryData = {
            productId: product,
            price,
            quantity,
            measure,
            desc,
            expiredDate: newDate,
            productName,
            address,
            type,
            fee,
        };
        try {
            console.log(temporaryData);
            const response = await axios.post(`${host}/api/request/${id}`, temporaryData);
            if (response.data.id && imageList) {
                const requestId = response.data.id;
                await axios.post(`${host}/api/image/request/${requestId}`, {
                    images: imageList,
                    type,
                });
                getAllRequestImage("request", type);
            }
            changeSnackbarValues({
                content:
                    "Yêu cầu mua nông sản / sản phẩm của bạn đã được thêm thành công, vui lòng đợi người quản lý phê duyệt !",
                isToggle: true,
                type: "success",
            });
            changeHaveNewNotificationStatus();
            resetField(type);
            changeLoadingStatus(false);
            setIsToggleCreateNewRequestModal(false);
            getUnconfirmedRequests(type);
        } catch (error) {
            changeLoadingStatus(false);
            handleError(error);
        }
    };

    const updateRequest = async (type: TransactionType, imageList?: string[]) => {
        try {
            console.log(buyingRequestState.requestValue);
            const { product, price, quantity, desc, measure, expiredDate, productName, address, id, fee } =
                buyingRequestState.requestValue;
            if (
                !address ||
                address === "default" ||
                !desc ||
                desc === "" ||
                !expiredDate ||
                compareAsc(new Date(Date.now()), new Date(expiredDate).setDate(new Date(expiredDate).getDate() + 2)) ===
                    1 ||
                !measure ||
                measure === "" ||
                !price ||
                price <= 0 ||
                !product ||
                product === "" ||
                !productName ||
                productName === "" ||
                quantity <= 0 ||
                !quantity
            ) {
                changeSnackbarValues({
                    content: "Vui lòng nhập đầy đủ các thông tin cần thiết !",
                    isToggle: true,
                    type: "error",
                });
                return;
            }
            const newDate = new Date(expiredDate).toISOString().slice(0, 19).replace("T", " ");
            const temporaryData = {
                productId: product,
                price,
                quantity,
                measure,
                desc,
                expiredDate: newDate,
                productName,
                address,
                fee,
            };
            if (imageList && imageList.length > 0) {
                await axios.patch(`${host}/api/image/request/${id}`, { images: imageList, type, isSubrequest: false });
            }
            changeLoadingStatus(false);
            await axios.patch(`${host}/api/request/${id}`, temporaryData);
            changeSnackbarValues({
                content: "Đã cập nhật thông tin yêu cầu !",
                isToggle: true,
                type: "success",
            });
            loadSpecificRequest(id, false, type);
        } catch (error) {
            console.log(error);
        }
    };

    const updateSubrequest = async (type: TransactionType, imageList?: string[]) => {
        try {
            type = type === "buying" ? "selling" : "buying";
            const { address, dateCompletedOrder, description, price, quantity, id } = subrequest;
            console.log(subrequest, type);
            if (imageList && imageList.length > 0) {
                await axios.patch(`${host}/api/image/request/${id}`, {
                    images: imageList,
                    type,
                    isSubrequest: true,
                });
            }
            changeLoadingStatus(false);
            const newDate = new Date(dateCompletedOrder).toISOString().slice(0, 19).replace("T", " ");
            await axios.patch(`${host}/api/subrequest/${id}`, {
                quantity,
                price,
                description,
                address,
                dateCompletedOrder: newDate,
            });
            changeSnackbarValues({
                content: "Cập nhật yêu cầu thành công !",
                isToggle: true,
                type: "success",
            });
            getAllSubrequest(type);
            loadSpecificRequest(id, true, type);
        } catch (error) {
            handleError(error);
        }
    };

    const changeRequestStatus = async (status: string, type: TransactionType) => {
        try {
            await axios.patch(`${host}/api/request/status/${currentRequestId}`, { status });
            changeSnackbarValues({
                content: "Đã hủy yêu cầu thành công",
                type: "success",
                isToggle: true,
            });
            loadSpecificRequest(currentRequestId, false, type);
        } catch (error) {
            handleError(error);
        }
    };

    const confirmRequest = async (type: TransactionType) => {
        try {
            console.log(currentRequestId);
            await axios.patch(`${host}/api/request/confirm/${currentRequestId}`, { isConfirmed: 0 });
            changeSnackbarValues({
                content: "Yêu cầu đã được phê duyệt !",
                isToggle: true,
                type: "success",
            });
            changeLoadingStatus(false);
            loadSpecificRequest(currentRequestId, false, type);
        } catch (error) {
            changeLoadingStatus(false);
            handleError(error);
        }
    };

    const fillSubrequest = (id: string) => {
        changeIsOpenModalStatus(true);
        const index = subrequests.findIndex((item: SubrequestResponseValueInitializer) => {
            return item.id === id;
        });
        const images = subrequestsImages
            .filter((image: RequestImage) => {
                return image.requestId === id;
            })
            .map((image: RequestImage) => {
                return image.url;
            });
        if (index > -1) {
            const { address, completedDateOrder, description, id, price, quantity, createdBy } = subrequests[index];
            const currentSubrequest: SubrequestValueInitializer = {
                address,
                dateCompletedOrder: completedDateOrder,
                description,
                id,
                price,
                quantity,
                uid: createdBy,
            };
            changeCurrentSubrequest(currentSubrequest);
            changeCurrentFilePaths(images);
        }
    };

    const fillRequest = (id: string, isSubRequest?: boolean) => {
        const focusingArray = isSubRequest ? subrequests : unconfirmedRequests;
        changeToggleCreateNewRequestModal(true);
        const index = focusingArray.findIndex(
            (item: RequestValueResponseInitializer | SubrequestResponseValueInitializer) => {
                const requesetId = item.id;
                return requesetId === id;
            }
        );
        const images = requestImages
            .filter((image: RequestImage) => {
                return image.requestId === id;
            })
            .map((image: RequestImage) => {
                return image.url;
            });
        if (index > -1) {
            const currentRequest = unconfirmedRequests[index];
            const { expiredDate, description, price, measure, productId, quantity, address, specificProductName } =
                currentRequest;
            const filledRequest: RequestValueInitializer = {
                id,
                desc: description,
                expiredDate,
                measure,
                price,
                product: productId,
                quantity,
                address,
                productName: specificProductName,
                fee: 10,
            };
            dispatch({ type: "changeRequestValue", payload: filledRequest });
            changeCurrentFilePaths(images);
        }
    };

    const changeCurrentSubrequest = (subrequestValue: SubrequestValueInitializer) => {
        setSubrequest(subrequestValue);
    };

    const registerSubrequest = async (
        uid: string,
        request: SubrequestValueInitializer,
        imageList: string[],
        type: TransactionType
    ) => {
        try {
            const { id, price, quantity, dateCompletedOrder, address, description } = request;
            const newDate = new Date(dateCompletedOrder).toISOString().slice(0, 19).replace("T", " ");
            const response = await axios.post(`${host}/api/subrequest/${id}`, {
                uid,
                price,
                quantity,
                dateCompletedOrder: newDate,
                address,
                description,
                type,
            });
            getAllSubrequest(type);
            if (response.data.id && type === "selling") {
                await axios.post(`${host}/api/image/subrequest/${response.data.id}?type=selling`, {
                    images: imageList,
                    type,
                });
                changeLoadingStatus(false);
                changeSnackbarValues({
                    content: "Đã đăng ký thành công, vui lòng đợi người đăng yêu cầu phê duyệt !",
                    isToggle: true,
                    type: "success",
                });
                return;
            }
            changeLoadingStatus(false);
            changeSnackbarValues({
                content: "Đã đăng ký thành công, vui lòng đợi người đăng yêu cầu phê duyệt !",
                isToggle: true,
                type: "success",
            });
        } catch (error) {
            changeLoadingStatus(false);
            handleError(error);
        }
    };

    const getAllSubrequest = async (type: TransactionType, id?: string, dateBegin?: Date, dateEnd?: Date) => {
        try {
            const response = await axios.get(
                `${host}/api/subrequest?something=1${id ? `&id=${id}` : ``}${
                    dateBegin && dateEnd ? `&date_begin=${dateBegin}&date_end=${dateEnd}` : ``
                }`
            );
            if (response.data.result) {
                const result: any[] = response.data.result;
                const mappedResponse: SubrequestResponseValueInitializer[] = result.map((request: any) => {
                    const {
                        id,
                        created_by,
                        date_created,
                        date_complete_order,
                        status,
                        request_id,
                        quantity,
                        price,
                        description,
                        username,
                        avatar,
                        specific_product_name,
                        measure,
                        product_name,
                        address,
                        customer_name,
                        fee,
                        owner_request_id,
                        transaction_type,
                    } = request;
                    console.log(transaction_type);
                    return {
                        avatar,
                        id,
                        price,
                        quantity,
                        status,
                        username,
                        description,
                        createdBy: created_by,
                        createdDate: date_created,
                        completedDateOrder: date_complete_order,
                        requestId: request_id,
                        specificProductName: specific_product_name,
                        measure,
                        productName: product_name,
                        address,
                        customerName: customer_name,
                        fee,
                        ownerRequestId: owner_request_id,
                        transactionType: transaction_type === "selling" ? "selling" : "buying",
                    };
                });
                dispatch({ type: "loadSubrequest", payload: mappedResponse });
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                dispatch({ type: "loadSubrequest", payload: [] });
                return;
            }
            handleError(error);
        }
    };

    const renderTransactionAddressSelector = (): ReactNode => {
        return addressList.map((item: UserAddressValue, index) => {
            return (
                <MenuItem key={index} value={item.id}>
                    {item.address.split("!^!")[0]}
                </MenuItem>
            );
        });
    };

    const loadSpecificBuyingRequest = async (id: string) => {
        try {
            const requestResponse = await axios.get(`${host}/api/request/specific/${id}`);
            if (requestResponse.data.result) {
                const {
                    id,
                    created_by,
                    date_created,
                    status,
                    product_id,
                    quantity,
                    price,
                    process,
                    expired_date,
                    measure,
                    description,
                    product_name,
                    username,
                    avatar,
                    address,
                    product_specific_name,
                    is_confirm,
                    fee,
                    transaction_type,
                } = requestResponse.data.result;
                const temporaryData: RequestValueResponseInitializer = {
                    id: id,
                    owner: {
                        username,
                        avatar,
                        id: created_by,
                    },
                    price,
                    process,
                    productId: product_id,
                    productName: product_name,
                    createdDate: date_created,
                    status,
                    description,
                    expiredDate: expired_date,
                    measure,
                    quantity,
                    address,
                    specificProductName: product_specific_name,
                    isConfirmed: is_confirm === 1 ? false : true,
                    fee,
                    type: transaction_type === "buying" ? "buying" : "selling",
                };
                dispatch({ type: "changeCurrentRequest", payload: temporaryData });
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                dispatch({ type: "changeCurrentRequest", payload: [] });
                return;
            }
            handleError(error);
        }
    };

    const loadSpecificSubrequest = async (id: string) => {
        try {
            const requestResponse = await axios.get(`${host}/api/subrequest/specific/${id}`);
            if (requestResponse.data.result) {
                const {
                    id,
                    created_by,
                    date_created,
                    date_complete_order,
                    status,
                    quantity,
                    price,
                    description,
                    username,
                    avatar,
                    measure,
                    product_name,
                    request_id,
                    specific_product_name,
                    address,
                    customer_name,
                    fee,
                    owner_request_id,
                    transaction_type,
                } = requestResponse.data.result;
                const requestStorage: SubrequestResponseValueInitializer = {
                    address,
                    avatar,
                    id,
                    measure,
                    price,
                    quantity,
                    status,
                    username,
                    description,
                    specificProductName: specific_product_name,
                    createdBy: created_by,
                    createdDate: date_created,
                    requestId: request_id,
                    productName: product_name,
                    completedDateOrder: date_complete_order,
                    customerName: customer_name,
                    fee,
                    ownerRequestId: owner_request_id,
                    transactionType: transaction_type === "buying" ? "buying" : "selling",
                };
                dispatch({ type: "loadSpecificRequest", payload: requestStorage });
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                dispatch({ type: "loadSpecificRequest", payload: [] });
                return;
            }
            handleError(error);
        }
    };

    const loadSubrequestStatistic = async (
        uid: string,
        role: string,
        type: TransactionType,
        dateBegin?: Date,
        dateEnd?: Date
    ) => {
        try {
            const response = await axios.get(
                `${host}/api/subrequest/all/${uid}?user_role=${role}&type=${type}${
                    dateBegin && dateEnd ? `&date_begin=${dateBegin}&date_end=${dateEnd}` : ``
                }`
            );
            const data = response.data.result;
            if (data) {
                const mappedData: SubrequestResponseValueInitializer[] = data.map((request: any) => {
                    const {
                        id,
                        created_by,
                        date_created,
                        date_complete_order,
                        status,
                        request_id,
                        quantity,
                        price,
                        description,
                        username,
                        avatar,
                        specific_product_name,
                        measure,
                        product_name,
                        address,
                        customer_name,
                        fee,
                        owner_request_id,
                        transaction_type,
                    } = request;
                    console.log(transaction_type);
                    return {
                        avatar,
                        id,
                        price,
                        quantity,
                        status,
                        username,
                        description,
                        createdBy: created_by,
                        createdDate: date_created,
                        completedDateOrder: date_complete_order,
                        requestId: request_id,
                        specificProductName: specific_product_name,
                        measure,
                        productName: product_name,
                        address,
                        customerName: customer_name,
                        fee,
                        ownerRequestId: owner_request_id,
                        transactionType: transaction_type === "buying" ? "buying" : "selling",
                    };
                });
                if (type === "selling") {
                    dispatch({ type: "loadSubrequestSellingStatistic", payload: mappedData });
                    return;
                }
                dispatch({ type: "loadSubrequestBuyingStatistic", payload: mappedData });
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                if (type === "buying") {
                    dispatch({ type: "loadSubrequestBuyingStatistic", payload: [] });
                    return;
                }
                dispatch({ type: "loadSubrequestBuyingStatistic", payload: [] });
                return;
            }
            handleError(error);
        }
    };

    const loadRequestImages = async (id: string, isSubRequest: boolean) => {
        try {
            const imageResponse = await axios.get(`${host}/api/image/${isSubRequest ? "subrequest" : "request"}/${id}`);
            if (imageResponse.data.result) {
                const mappedImageArray: RequestImage[] = imageResponse.data.result.map((image: any) => {
                    const { image_id, request_id, url } = image;
                    return {
                        id: image_id,
                        requestId: request_id,
                        url,
                    };
                });
                dispatch({ type: "loadSpecificRequestImage", payload: mappedImageArray });
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                dispatch({ type: "loadSpecificRequestImage", payload: [] });
                return;
            }
            handleError(error);
        }
    };

    const loadSpecificRequest = async (id: string, isSubRequest: boolean, type: TransactionType, refId?: string) => {
        try {
            console.log(type);
            if (type === "selling" || (type === "buying" && !isSubRequest)) {
                loadRequestImages(id, isSubRequest);
            }
            if (!isSubRequest) {
                loadSpecificBuyingRequest(id);
                const requestForHandleResponse = await axios.get(`http://localhost:4000/api/subrequest/${id}`);
                if (requestForHandleResponse.data.result) {
                    const mappedComponentRequest: SubrequestResponseValueInitializer[] =
                        requestForHandleResponse.data.result.map((item: any) => {
                            const {
                                id,
                                created_by,
                                date_created,
                                date_complete_order,
                                status,
                                request_id,
                                quantity,
                                price,
                                description,
                                username,
                                avatar,
                                fee,
                            } = item;
                            return {
                                avatar,
                                id,
                                price,
                                quantity,
                                status,
                                username,
                                description,
                                createdBy: created_by,
                                createdDate: date_created,
                                completedDateOrder: date_complete_order,
                                requestId: request_id,
                                fee,
                            };
                        });
                    dispatch({ type: "loadSpecificSubrequest", payload: mappedComponentRequest });
                }
                return;
            }
            loadSpecificSubrequest(id);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                dispatch({ type: "loadSpecificSubrequest", payload: [] });
                return;
            }
            handleError(error);
        }
    };

    const changeSubrequestStatus = async (status: string, successMessage: string, type: TransactionType) => {
        try {
            await axios.patch(`${host}/api/subrequest/status/${currentRequestId}`, { status });
            loadSpecificRequest(currentRequestId, true, type);
            changeSnackbarValues({ content: successMessage, type: "success", isToggle: true });
        } catch (error) {
            handleError(error);
        }
    };

    const loadSearchResult = async (search: string, dateBegin?: Date, dateEnd?: Date) => {
        try {
            const requestResponse = await axios.get(
                `${host}/api/request?search=${search}${
                    dateBegin && dateEnd ? `&date_begin=${dateBegin}&date_end=${dateEnd}` : ""
                }`
            );
            const subrequestResponse = await axios.get(
                `${host}/api/subrequest?search=${search}${
                    dateBegin && dateEnd ? `&date_begin=${dateBegin}&date_end=${dateEnd}` : ""
                }`
            );
            const requestResponseData = requestResponse.data.result;
            const subrequestResponseData = subrequestResponse.data.result;
            const transitorySearchResult: SearchResult[] = [];
            if (requestResponseData) {
                const uniqueProducts: { id: string; title: string }[] = [];
                requestResponseData.forEach((request: any) => {
                    if (uniqueProducts.findIndex(element => element.id === request.product_id) === -1) {
                        uniqueProducts.push({ id: request.product_id, title: request.product_name });
                    }
                });
                uniqueProducts.forEach(element => {
                    const mappedRequestSearchResult: RequestValueResponseInitializer[] = requestResponseData
                        .filter((request: any) => request.product_id === element.id)
                        .map((request: any) => {
                            const {
                                id,
                                created_by,
                                date_created,
                                status,
                                product_id,
                                quantity,
                                price,
                                process,
                                expired_date,
                                measure,
                                description,
                                product_name,
                                username,
                                avatar,
                                address,
                                product_specific_name,
                                is_confirm,
                                fee,
                                transaction_type,
                            } = request;
                            const returnValues: RequestValueResponseInitializer = {
                                id: id,
                                owner: {
                                    username,
                                    avatar,
                                    id: created_by,
                                },
                                price,
                                process,
                                productId: product_id,
                                productName: product_name,
                                createdDate: date_created,
                                status,
                                description,
                                expiredDate: expired_date,
                                measure,
                                quantity,
                                address,
                                specificProductName: product_specific_name,
                                isConfirmed: is_confirm === 1 ? false : true,
                                fee,
                                type: transaction_type === "buying" ? "buying" : "selling",
                            };
                            return returnValues;
                        });
                    const mappedSubrequestSearchResult: SubrequestResponseValueInitializer[] = subrequestResponseData
                        .filter((request: any) => request.product_id === element.id)
                        .map((request: any) => {
                            const {
                                id,
                                created_by,
                                date_created,
                                date_complete_order,
                                status,
                                request_id,
                                quantity,
                                price,
                                description,
                                username,
                                avatar,
                                specific_product_name,
                                measure,
                                product_name,
                                address,
                                customer_name,
                                fee,
                                owner_request_id,
                                transaction_type,
                            } = request;
                            const returnValues: SubrequestResponseValueInitializer = {
                                avatar,
                                id,
                                price,
                                quantity,
                                status,
                                username,
                                description,
                                createdBy: created_by,
                                createdDate: date_created,
                                completedDateOrder: date_complete_order,
                                requestId: request_id,
                                specificProductName: specific_product_name,
                                measure,
                                productName: product_name,
                                address,
                                customerName: customer_name,
                                fee,
                                ownerRequestId: owner_request_id,
                                transactionType: transaction_type === "buying" ? "buying" : "selling",
                            };
                            return returnValues;
                        });
                    transitorySearchResult.push({
                        requests: mappedRequestSearchResult,
                        subrequests: mappedSubrequestSearchResult,
                    });
                    dispatch({
                        type: "loadSearchResult",
                        payload: transitorySearchResult,
                    });
                });
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                dispatch({
                    type: "loadSearchResult",
                    payload: [],
                });
                return;
            }
            handleError(error);
        }
    };

    const RequestContextData = {
        isOpenedModal,
        isBeginSlide,
        modalInformation,
        isToggleCreateNewRequestModal,
        newRequest: buyingRequestState.requestValue,
        unconfirmedRequests,
        confirmedRequests,
        requestImages,
        submitType,
        currentSellingRequest: subrequest,
        transactionAddress,
        isToggleAddNewAddress,
        subrequests: buyingRequestState.subrequests,
        currentTargetRequest: buyingRequestState.currentTargetRequest,
        specificRequestImages: buyingRequestState.currentTargetRequestImages,
        subrequestForSpecificRequest: buyingRequestState.subrequestForSpecificRequest,
        currentSubrequest: buyingRequestState.currentSubrequest,
        currentRequestId,
        buyingSubrequestStatistic,
        sellingSubrequestStatistic,
        searchResult,
        loadSpecificRequest,
        loadSpecificBuyingRequest,
        changeIsOpenModalStatus,
        setIsBeginSlide,
        changeModalInformation,
        changeToggleCreateNewRequestModal,
        changeNewRequestValue,
        createNewRequest,
        confirmRequest,
        getConfirmedRequests,
        getUnconfirmedRequests,
        getAllRequestImage,
        fillRequest,
        fillSubrequest,
        resetField,
        changeSubmitType,
        changeCurrentRequestId,
        changeCurrentSubrequest,
        registerSubrequest,
        changeTransactionAddress,
        renderTransactionAddressSelector,
        changeToggleOnAddNewAddressModalStatus,
        getAllSubrequest,
        loadSubrequestStatistic,
        changeSubrequestStatus,
        updateRequest,
        updateSubrequest,
        changeRequestStatus,
        loadSearchResult,
    };

    return <RequestContext.Provider value={RequestContextData}>{children}</RequestContext.Provider>;
};

export default RequestContextProvider;
