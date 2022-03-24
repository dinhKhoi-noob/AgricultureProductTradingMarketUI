/* eslint-disable no-unused-vars */
import React, { createContext, ReactNode, useState, useReducer } from "react";
import { SnackbarOrigin, useMediaQuery, useTheme } from "@mui/material";
import { layoutReducer } from "../reducer/layoutReducer";

export type SnackbarType = "error" | "info" | "success" | "warning";

export type ProductTypeConfirmationType = "deleteProductType" | "createProductType" | "editProductType";
export type ProductConfirmationType = "createProduct" | "editProduct" | "deleteProduct";
export type UserConfirmationType = "logout" | "editProfile" | "changePassword";
export type BuyingRequestConfirmationType = "newBuyingRequest" | "confirmBuyingRequest";
interface LayoutContextProviderProps {
    children: ReactNode;
}

interface SnackbarValuesProps {
    content: string;
    type: SnackbarType;
    isToggle: boolean;
}

interface ConfirmationModalValuesInitializer {
    title: string;
    isToggle: boolean;
    type: ProductTypeConfirmationType | ProductConfirmationType | UserConfirmationType | BuyingRequestConfirmationType;
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
    changeToggleOnNavbarStatus: (status?: boolean) => void;
    changeSnackbarStatus: (status: boolean) => void;
    changeSnackbarPosition: (position: SnackbarOrigin) => void;
    changeOnLoginPageStatus: (status: boolean) => void;
    changeSnackbarValues: (values: SnackbarValuesProps) => void;
    changeLoadingStatus: (status: boolean) => void;
    changeConfirmationModalValues: (value: ConfirmationModalValuesInitializer) => void;
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
    changeToggleOnNavbarStatus: () => null,
    changeSnackbarStatus: () => null,
    changeSnackbarPosition: () => null,
    changeOnLoginPageStatus: () => null,
    changeSnackbarValues: () => null,
    changeLoadingStatus: () => null,
    changeConfirmationModalValues: () => null,
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
    const [layoutState, dispatch] = useReducer(layoutReducer, { onLoading: false });
    const [isToggleOnNavbar, setIsToggleOnNavbar] = useState(false);
    const [isOnLoginPage, setIsOnLoginPage] = useState(false);
    const [snackbarValues, setSnackbarValues] = useState<SnackbarValuesProps>({
        content: "",
        type: "info",
        isToggle: false,
    });
    const [confirmationModalValue, setConfirmationModalValue] = useState<ConfirmationModalValuesInitializer>({
        isToggle: false,
        title: "",
        type: "deleteProductType",
    });

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

    const changeSnackbarValues = (values: SnackbarValuesProps) => {
        const { content, type, isToggle } = values;
        setSnackbarValues({ ...snackbarValues, content, type, isToggle });
    };

    const changeConfirmationModalValues = (value: ConfirmationModalValuesInitializer) => {
        setConfirmationModalValue(value);
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
        changeToggleOnNavbarStatus,
        changeSnackbarPosition,
        changeOnLoginPageStatus,
        changeSnackbarStatus,
        changeSnackbarValues,
        changeLoadingStatus,
        changeConfirmationModalValues,
    };
    return <LayoutContext.Provider value={layoutContextData}>{children}</LayoutContext.Provider>;
};

export default LayoutContextProvider;
