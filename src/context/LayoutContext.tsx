/* eslint-disable no-unused-vars */
import React, { createContext, ReactNode, useState, useReducer, ReactElement, MutableRefObject } from "react";
import { SnackbarOrigin, useMediaQuery, useTheme } from "@mui/material";
import { layoutReducer } from "../reducer/layoutReducer";
import socket from "../socket";

export type SnackbarType = "error" | "info" | "success" | "warning";

export type ProductTypeConfirmationType = "deleteProductType" | "createProductType" | "editProductType";
export type ProductConfirmationType = "createProduct" | "editProduct" | "deleteProduct";
export type UserConfirmationType =
    | "logout"
    | "editProfile"
    | "changePassword"
    | "createCustomer"
    | "createPackingStaff"
    | "createManager"
    | "createShipper"
    | "activeUser"
    | "inactiveUser";
export type RequestConfirmationType =
    | "newBuyingRequest"
    | "newSellingRequest"
    | "confirmBuyingRequest"
    | "confirmSellingRequest"
    | "viewRequest"
    | "registerBuyingSubrequest"
    | "registerSellingSubrequest"
    | "newAddress"
    | "updateBuyingRequest"
    | "updateSellingRequest"
    | "cancelBuyingRequest"
    | "cancelSellingRequest"
    | "updateBuyingSubrequest"
    | "updateSellingSubrequest"
    | "cancelBuyingSubrequest"
    | "cancelSellingSubrequest"
    | "confirmBuyingSubrequest"
    | "confirmSellingSubrequest";

export type OrderConfirmationType =
    | "changeToReady"
    | "changeToCarryingIn"
    | "changeToCarriedIn"
    | "changeToPackaging"
    | "changeToPackaged"
    | "changeToDelivering"
    | "changeToSuccess"
    | "ratingRequest"
    | "ratingSubrequest";

interface LayoutContextProviderProps {
    children: ReactNode;
}

interface SnackbarValuesProps {
    content: string;
    type: SnackbarType;
    isToggle: boolean;
    link?: string;
}

export interface DialAction {
    icon: ReactElement;
    title: string;
    ref: MutableRefObject<HTMLInputElement | null>;
}

interface ConfirmationModalValuesInitializer {
    title: string;
    isToggle: boolean;
    type:
        | ProductTypeConfirmationType
        | ProductConfirmationType
        | UserConfirmationType
        | RequestConfirmationType
        | OrderConfirmationType;
}

interface LayoutContextDefault {
    onLoading: boolean;
    isToggleOnNavbar: Boolean;
    isOnLoginPage: Boolean;
    snackbarPosition: SnackbarOrigin;
    snackbarValues: SnackbarValuesProps;
    xsMatched: Boolean;
    smMatched: Boolean;
    mdMatched: Boolean;
    lgMatched: Boolean;
    xlMatched: Boolean;
    confirmationModalValue: ConfirmationModalValuesInitializer;
    onSellingPage: boolean;
    haveNewNotification: boolean;
    isTogglePreviewImage: boolean;
    notifications: any[];
    postNotification: (content: string, requestId: string, id: string, username: string, type: string) => void;
    changeNotificationList: (notifications: any[]) => void;
    loadNotifications: () => void;
    changeHaveNewNotificationStatus: () => void;
    changeToggleOnNavbarStatus: (status?: boolean) => void;
    changeSnackbarStatus: (status: boolean) => void;
    changeSnackbarPosition: (position: SnackbarOrigin) => void;
    changeOnLoginPageStatus: (status: boolean) => void;
    changeSnackbarValues: (values: SnackbarValuesProps) => void;
    changeLoadingStatus: (status: boolean) => void;
    changeConfirmationModalValues: (value: ConfirmationModalValuesInitializer) => void;
    changeOnSellingPageStatus: (status: boolean) => void;
    changeIsTogglePreviewImage: (status?: boolean) => void;
}

export const LayoutContext = createContext<LayoutContextDefault>({
    onLoading: false,
    isToggleOnNavbar: false,
    isOnLoginPage: false,
    snackbarPosition: { vertical: "top", horizontal: "right" },
    snackbarValues: { content: "", type: "info", isToggle: false },
    xsMatched: false,
    smMatched: false,
    mdMatched: false,
    lgMatched: false,
    xlMatched: false,
    confirmationModalValue: {
        isToggle: false,
        title: "",
        type: "createProductType",
    },
    onSellingPage: false,
    haveNewNotification: false,
    isTogglePreviewImage: false,
    notifications: [],
    postNotification: () => null,
    changeNotificationList: () => null,
    loadNotifications: () => null,
    changeHaveNewNotificationStatus: () => null,
    changeToggleOnNavbarStatus: () => null,
    changeSnackbarStatus: () => null,
    changeSnackbarPosition: () => null,
    changeOnLoginPageStatus: () => null,
    changeSnackbarValues: () => null,
    changeLoadingStatus: () => null,
    changeConfirmationModalValues: () => null,
    changeOnSellingPageStatus: () => null,
    changeIsTogglePreviewImage: () => null,
});

const LayoutContextProvider = ({ children }: LayoutContextProviderProps) => {
    const theme = useTheme();
    const xsMatched = useMediaQuery(theme.breakpoints.up("xs"));
    const mdMatched = useMediaQuery(theme.breakpoints.up("md"));
    const smMatched = useMediaQuery(theme.breakpoints.up("sm"));
    const lgMatched = useMediaQuery(theme.breakpoints.up("lg"));
    const xlMatched = useMediaQuery(theme.breakpoints.up("xl"));
    const [snackbarPosition, setSnackbarPosition] = useState<SnackbarOrigin>({
        vertical: "top",
        horizontal: "right",
    });
    const [layoutState, dispatch] = useReducer(layoutReducer, { onLoading: false, onSellingPage: false });
    const [isToggleOnNavbar, setIsToggleOnNavbar] = useState(false);
    const [isOnLoginPage, setIsOnLoginPage] = useState(false);
    const [snackbarValues, setSnackbarValues] = useState<SnackbarValuesProps>({
        content: "",
        type: "info",
        isToggle: false,
    });
    const [haveNewNotification, setHaveNewNotification] = useState(false);
    const [confirmationModalValue, setConfirmationModalValue] = useState<ConfirmationModalValuesInitializer>({
        isToggle: false,
        title: "",
        type: "deleteProductType",
    });
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isTogglePreviewImage, setIsTogglePreviewImage] = useState(false);
    const postNotification = (content: string, requestId: string, id: string, username: string, type: string) => {
        setNotifications([...notifications, { content, username }]);
        switch (type) {
            case "newRequest":
                socket.emit("notification:create:newRequest", { user: { username, id }, data: { content, requestId } });
                break;
            default:
                return;
        }
    };

    const loadNotifications = () => {
        socket.emit("notification:get:all");
    };

    const changeNotificationList = (notifications: any[]) => {
        setNotifications(notifications);
    };

    const changeHaveNewNotificationStatus = () => {
        setHaveNewNotification(!haveNewNotification);
    };

    const changeLoadingStatus = (status: boolean) => {
        dispatch({ type: "loading", payload: status });
        return;
    };

    const changeSnackbarStatus = (status: boolean) => {
        setSnackbarValues({ ...snackbarValues, isToggle: status });
    };

    const changeToggleOnNavbarStatus = (status?: boolean) => {
        setIsToggleOnNavbar(status ? status : !isToggleOnNavbar);
    };

    const changeOnLoginPageStatus = (status: boolean) => {
        setIsOnLoginPage(status);
    };

    const changeSnackbarPosition = (position: SnackbarOrigin) => {
        setSnackbarPosition(position);
    };

    const changeIsTogglePreviewImage = (status?: boolean) => {
        if (status === undefined) {
            console.log(1);
            setIsTogglePreviewImage(!isTogglePreviewImage);
            return;
        }
        setIsTogglePreviewImage(status);
    };

    const changeSnackbarValues = (values: SnackbarValuesProps) => {
        console.log(values);
        const { content, type, isToggle } = values;
        setSnackbarValues({ ...snackbarValues, content, type, isToggle });
    };

    const changeConfirmationModalValues = (value: ConfirmationModalValuesInitializer) => {
        setConfirmationModalValue(value);
    };

    const changeOnSellingPageStatus = (status: boolean) => {
        dispatch({ type: "changeOnSellingPageStatus", payload: status });
    };

    const layoutContextData = {
        onLoading: layoutState.onLoading,
        isToggleOnNavbar,
        isOnLoginPage,
        snackbarValues,
        snackbarPosition,
        xsMatched,
        mdMatched,
        smMatched,
        lgMatched,
        xlMatched,
        confirmationModalValue,
        onSellingPage: layoutState.onSellingPage,
        haveNewNotification,
        notifications,
        isTogglePreviewImage,
        changeNotificationList,
        postNotification,
        loadNotifications,
        changeHaveNewNotificationStatus,
        changeToggleOnNavbarStatus,
        changeSnackbarPosition,
        changeOnLoginPageStatus,
        changeSnackbarStatus,
        changeSnackbarValues,
        changeLoadingStatus,
        changeConfirmationModalValues,
        changeOnSellingPageStatus,
        changeIsTogglePreviewImage,
    };
    return <LayoutContext.Provider value={layoutContextData}>{children}</LayoutContext.Provider>;
};

export default LayoutContextProvider;
