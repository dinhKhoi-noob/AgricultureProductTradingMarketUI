/* eslint-disable camelcase */
import axios from "axios";
import React, { createContext, ReactNode, useContext, useReducer, useState } from "react";
import { buyingRequestReducer, BuyingRequestState } from "../reducer/buyingRequestReducer";
import { LayoutContext, BuyingRequestConfirmationType } from "./LayoutContext";
import { UploadFileContext } from "./UploadFileContext";

interface BuyingRequestProps {
    children: ReactNode;
}

export interface SelledUserProps {
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

interface ModalProps {
    owner: OwnerProps;
    quantity: number;
    process: number;
    title: string;
    price: number;
    selledUser: SelledUserProps[];
}

export interface BuyingRequestImage {
    id: string;
    requestId: string;
    url: string;
}

export interface BuyingRequestValueResponseInitializer {
    id: string;
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
}

interface BuyingRequestProviderProps {
    isOpenedModal: boolean;
    isBeginSlide: boolean;
    modalInformation: ModalProps;
    isToggleCreateNewRequestModal: boolean;
    newBuyingRequest: BuyingRequestValueInitializer;
    confirmedBuyingRequests: BuyingRequestValueResponseInitializer[];
    unconfirmedBuyingRequests: BuyingRequestValueResponseInitializer[];
    requestImages: BuyingRequestImage[];
    submitType: BuyingRequestConfirmationType;
    changeIsOpenModalStatus: (status: boolean) => void;
    setIsBeginSlide: (status: boolean) => void;
    changeModalInformation: (information: ModalProps) => void;
    changeToggleCreateNewRequestModal: (status: boolean) => void;
    changeNewBuyingRequestValue: (value: BuyingRequestValueInitializer) => void;
    getConfirmedBuyingRequests: (id?: string) => void;
    getUnconfirmedBuyingRequests: (id?: string) => void;
    createNewBuyingRequest: (value: BuyingRequestValueInitializer, id: string, imageList?: string[]) => void;
    confirmBuyingRequest: () => void;
    getAllBuyingRequestImage: () => void;
    fillBuyingRequest: (id: string, type: "unconfirmed" | "confirmed") => void;
    resetField: () => void;
    changeSubmitType: (type: BuyingRequestConfirmationType) => void;
    changeCurrentRequestId: (id: string) => void;
}

interface BuyingRequestValueInitializer {
    product: string;
    price: number;
    quantity: number;
    measure: string;
    expiredDate: Date;
    desc: string;
}

const BuyingRequestContextDefault: BuyingRequestProviderProps = {
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
    newBuyingRequest: {
        desc: "",
        quantity: 0,
        expiredDate: new Date(Date.now()),
        price: 0,
        measure: "kg",
        product: "",
    },
    confirmedBuyingRequests: [],
    unconfirmedBuyingRequests: [],
    requestImages: [],
    submitType: "newBuyingRequest",
    setIsBeginSlide: () => null,
    changeIsOpenModalStatus: () => null,
    changeModalInformation: () => null,
    changeToggleCreateNewRequestModal: () => null,
    changeNewBuyingRequestValue: () => null,
    createNewBuyingRequest: () => null,
    getConfirmedBuyingRequests: () => null,
    getUnconfirmedBuyingRequests: () => null,
    getAllBuyingRequestImage: () => null,
    fillBuyingRequest: () => null,
    resetField: () => null,
    changeSubmitType: () => null,
    confirmBuyingRequest: () => null,
    changeCurrentRequestId: () => null,
};

export const BuyingRequestContext = createContext<BuyingRequestProviderProps>(BuyingRequestContextDefault);

const BuyingRequestContextProvider = ({ children }: BuyingRequestProps) => {
    const host = "http://localhost:4000";
    const buyingRequestStateInitializer: BuyingRequestState = {
        unconfirmedBuyingRequests: [],
        confirmedBuyingRequests: [],
        requestImages: [],
    };
    const [isOpenedModal, setIsOpenedModal] = useState(false);
    const [isToggleCreateNewRequestModal, setIsToggleCreateNewRequestModal] = useState(false);
    const [isBeginSlide, setIsBeginSlide] = useState(true);
    const [submitType, setSubmitType] = useState<BuyingRequestConfirmationType>("newBuyingRequest");
    const [currentRequestId, setCurrentRequestId] = useState("");
    const [newBuyingRequest, setNewBuyingRequest] = useState<BuyingRequestValueInitializer>({
        desc: "",
        price: 0,
        expiredDate: new Date(Date.now()),
        product: "",
        quantity: 0,
        measure: "kg",
    });
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

    const [buyingRequestState, dispatch] = useReducer(buyingRequestReducer, buyingRequestStateInitializer);
    const { changeCurrentFilePaths } = useContext(UploadFileContext);
    const { changeSnackbarValues, changeLoadingStatus } = useContext(LayoutContext);

    const { unconfirmedBuyingRequests, confirmedBuyingRequests, requestImages } = buyingRequestState;

    const changeSubmitType = (type: BuyingRequestConfirmationType) => {
        setSubmitType(type);
    };

    const changeCurrentRequestId = (id: string) => {
        setCurrentRequestId(id);
    };

    const changeModalInformation = (information: ModalProps) => {
        const { owner, quantity, title, price, process, selledUser } = information;
        setModalInformation({
            owner,
            quantity,
            title,
            price,
            process,
            selledUser,
        });
    };

    const changeNewBuyingRequestValue = (value: BuyingRequestValueInitializer) => {
        setNewBuyingRequest(value);
    };

    const changeToggleCreateNewRequestModal = (status: boolean) => {
        setIsToggleCreateNewRequestModal(status ? status : !isToggleCreateNewRequestModal);
    };

    const getConfirmedBuyingRequests = async (id?: string) => {
        const confirmedBuyingRequestEndPoint = id
            ? `${host}/api/buying_request/${id}?confirmed=0`
            : `${host}/api/buying_request?confirmed=0`;
        try {
            const confirmedBuyingRequestResponse = await axios.get(confirmedBuyingRequestEndPoint);
            const confirmedBuyingRequestData = confirmedBuyingRequestResponse.data;
            if (confirmedBuyingRequestData) {
                const temporaryConfirmedResult: BuyingRequestValueResponseInitializer[] =
                    confirmedBuyingRequestData.result.map((item: any) => {
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
                        } = item;
                        if (
                            id &&
                            created_by &&
                            date_created &&
                            status &&
                            product_id &&
                            quantity &&
                            price &&
                            process > -1 &&
                            expired_date &&
                            measure &&
                            description &&
                            product_name &&
                            username &&
                            avatar
                        ) {
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
                            };
                        }
                    });
                dispatch({ type: "loadConfirmedRequests", payload: temporaryConfirmedResult });
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                error.response?.status !== 404
                    ? changeSnackbarValues({
                          content: error.response?.data.message,
                          isToggle: true,
                          type: "error",
                      })
                    : dispatch({ type: "loadConfirmedRequests", payload: [] });
                return;
            }
            changeSnackbarValues({
                content: "Lỗi hệ thống",
                isToggle: true,
                type: "error",
            });
        }
    };

    const getUnconfirmedBuyingRequests = async (id?: string) => {
        const unconfirmedBuyingRequestEndPoint = id
            ? `${host}/api/buying_request/${id}?confirmed=1`
            : `${host}/api/buying_request?confirmed=1`;
        try {
            const unconfirmedBuyingRequestResponse = await axios.get(unconfirmedBuyingRequestEndPoint);
            const unconfirmedBuyingRequestData = unconfirmedBuyingRequestResponse.data;
            if (unconfirmedBuyingRequestData.result) {
                const temporaryUnconfirmedResult: BuyingRequestValueResponseInitializer[] =
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
                        } = item;
                        if (
                            id &&
                            created_by &&
                            date_created &&
                            status &&
                            product_id &&
                            quantity &&
                            price &&
                            process > -1 &&
                            expired_date &&
                            measure &&
                            description &&
                            product_name &&
                            username &&
                            avatar
                        ) {
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
                            };
                        }
                    });

                dispatch({ type: "loadUnconfirmedRequests", payload: temporaryUnconfirmedResult });
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                error.response?.status !== 404
                    ? changeSnackbarValues({
                          content: error.response?.data.message,
                          isToggle: true,
                          type: "error",
                      })
                    : dispatch({ type: "loadUnconfirmedRequests", payload: [] });
                return;
            }
            changeSnackbarValues({
                content: "Lỗi hệ thống",
                isToggle: true,
                type: "error",
            });
        }
    };

    const changeIsOpenModalStatus = (status: boolean) => {
        setIsOpenedModal(status);
        setTimeout(() => {
            setIsBeginSlide(false);
        }, 1000);
    };

    const resetField = () => {
        setIsToggleCreateNewRequestModal(false);
        setSubmitType("newBuyingRequest");
        setNewBuyingRequest({
            desc: "",
            price: 0,
            expiredDate: new Date(Date.now()),
            product: "",
            quantity: 0,
            measure: "kg",
        });
    };

    const getAllBuyingRequestImage = async () => {
        try {
            const response = await axios.get(`${host}/api/image/buying_request`);
            if (response.data.result) {
                const result: BuyingRequestImage[] = response.data.result.map((image: any) => {
                    const { image_id, request_id, url } = image;
                    return {
                        id: image_id,
                        requestId: request_id,
                        url,
                    };
                });
                dispatch({ type: "loadImages", payload: result });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const createNewBuyingRequest = async (value: BuyingRequestValueInitializer, id: string, imageList?: string[]) => {
        const { product, price, quantity, desc, measure, expiredDate } = value;
        const newDate = new Date(expiredDate).toISOString().slice(0, 19).replace("T", " ");
        const temporaryData = {
            productId: product,
            price,
            quantity,
            measure,
            desc,
            expiredDate: newDate,
        };
        try {
            console.log(temporaryData);
            const response = await axios.post(`${host}/api/buying_request/${id}`, temporaryData);
            if (response.data.id && imageList) {
                const requestId = response.data.id;
                await axios.post(`${host}/api/image/buying_request/${requestId}`, {
                    images: imageList,
                });
                getAllBuyingRequestImage();
            }
            changeSnackbarValues({
                content:
                    "Yêu cầu mua nông sản / sản phẩm của bạn đã được thêm thành công, vui lòng đợi người quản lý phê duyệt !",
                isToggle: true,
                type: "success",
            });
            resetField();
            changeLoadingStatus(false);
            setIsToggleCreateNewRequestModal(false);
            getUnconfirmedBuyingRequests();
        } catch (error) {
            changeLoadingStatus(false);
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
        }
    };

    const confirmBuyingRequest = async () => {
        try {
            console.log(currentRequestId);
            await axios.patch(`${host}/api/buying_request/confirm/${currentRequestId}`, { isConfirmed: 0 });
            changeSnackbarValues({
                content: "Yêu cầu đã được phê duyệt !",
                isToggle: true,
                type: "success",
            });
            changeLoadingStatus(false);
            setIsToggleCreateNewRequestModal(false);
            getUnconfirmedBuyingRequests();
            getConfirmedBuyingRequests();
            resetField();
        } catch (error) {
            changeLoadingStatus(false);
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
        }
    };

    const fillBuyingRequest = (id: string, type: "unconfirmed" | "confirmed") => {
        changeToggleCreateNewRequestModal(true);
        if (type === "unconfirmed") {
            const index = unconfirmedBuyingRequests.findIndex((item: BuyingRequestValueResponseInitializer) => {
                const requesetId = item.id;
                return requesetId === id;
            });
            const images = requestImages
                .filter((image: BuyingRequestImage) => {
                    return image.requestId === id;
                })
                .map((image: BuyingRequestImage) => {
                    return image.url;
                });
            if (index > -1) {
                const currentRequest = unconfirmedBuyingRequests[index];
                const { expiredDate, description, price, measure, productId, quantity } = currentRequest;
                const filledRequest: BuyingRequestValueInitializer = {
                    desc: description,
                    expiredDate,
                    measure,
                    price,
                    product: productId,
                    quantity,
                };
                setNewBuyingRequest(filledRequest);
                changeCurrentFilePaths(images);
            }
        }
    };

    const BuyingRequestContextData = {
        isOpenedModal,
        isBeginSlide,
        modalInformation,
        isToggleCreateNewRequestModal,
        newBuyingRequest,
        unconfirmedBuyingRequests,
        confirmedBuyingRequests,
        requestImages,
        submitType,
        changeIsOpenModalStatus,
        setIsBeginSlide,
        changeModalInformation,
        changeToggleCreateNewRequestModal,
        changeNewBuyingRequestValue,
        createNewBuyingRequest,
        confirmBuyingRequest,
        getConfirmedBuyingRequests,
        getUnconfirmedBuyingRequests,
        getAllBuyingRequestImage,
        fillBuyingRequest,
        resetField,
        changeSubmitType,
        changeCurrentRequestId,
    };

    return <BuyingRequestContext.Provider value={BuyingRequestContextData}>{children}</BuyingRequestContext.Provider>;
};

export default BuyingRequestContextProvider;
