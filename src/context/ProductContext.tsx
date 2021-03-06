/* eslint-disable camelcase */
import axios from "axios";
import React, { createContext, ReactNode, useContext, useReducer, useState } from "react";
import { productReducer } from "../reducer/productReducer";
import { LayoutContext } from "./LayoutContext";

type SubmitEventType = "editing" | "adding";

export type ProductModalActionType = "title" | "typeId" | "status";

export interface ProductValueInitializer {
    id: string;
    typeId: string;
    createdBy: string;
    title: string;
    dateCreated: string;
    dateModified: string;
    categoryName: string;
}

export interface ProductModalValueInitializer {
    title: string;
    typeId: string;
    isToggle: boolean;
}

interface ProductContextProps {
    children: ReactNode;
}

interface ProductContextDefault {
    productList: ProductValueInitializer[];
    modalValues: ProductModalValueInitializer;
    currentProductId: string;
    eventType: SubmitEventType;
    getProduct: () => void;
    createNewProduct: (value: ProductModalValueInitializer) => void;
    updateProduct: (value: ProductModalValueInitializer, id: string) => void;
    deleteProduct: (id: string) => void;
    changeModalValues: (value: string | boolean, action: ProductModalActionType) => void;
    changeCurrentId: (id: string) => void;
    changeSubmitTypeEvent: (type: SubmitEventType) => void;
    resetField: () => void;
}

export const ProductContext = createContext<ProductContextDefault>({
    productList: [],
    modalValues: {
        title: "",
        typeId: "",
        isToggle: false,
    },
    currentProductId: "",
    eventType: "adding",
    getProduct: () => null,
    createNewProduct: () => null,
    updateProduct: () => null,
    deleteProduct: () => null,
    changeModalValues: () => null,
    changeCurrentId: () => null,
    changeSubmitTypeEvent: () => null,
    resetField: () => null,
});

const ProductContextProvider = ({ children }: ProductContextProps) => {
    const host = "http://localhost:4000";
    const [eventType, setEventType] = useState<SubmitEventType>("adding");
    const [productList, setProductList] = useState<ProductValueInitializer[]>([]);
    const [currentProductId, setCurrentId] = useState("");
    const [productReducerState, dispatch] = useReducer(productReducer, {
        productValue: {
            title: "",
            typeId: "",
            isToggle: false,
        },
    });
    const { changeSnackbarValues, changeLoadingStatus } = useContext(LayoutContext);
    const changeModalValues = (value: string | boolean, action: ProductModalActionType) => {
        dispatch({ type: action, payload: value });
    };

    const getProduct = async () => {
        try {
            const response = await axios.get(`${host}/api/product`);
            const data = response.data;
            if (data.result) {
                const result: ProductValueInitializer[] = [];
                data.result.forEach((datum: any) => {
                    const { id, title, type_id, created_by, date_created, date_modified, category_title } = datum;
                    result.push({
                        id,
                        title,
                        typeId: type_id,
                        createdBy: created_by,
                        dateCreated: date_created,
                        dateModified: date_modified,
                        categoryName: category_title,
                    });
                });
                setProductList(result);
                console.log(result);
            }
        } catch (error) {
            console.log(error);
            changeSnackbarValues({
                content: "Kh??ng t??m th???y n??ng s???n",
                type: "error",
                isToggle: true,
            });
        }
    };

    const createNewProduct = async (value: ProductModalValueInitializer) => {
        const { title, typeId } = value;
        const data = {
            title,
            typeId,
        };
        try {
            await axios.post(`${host}/api/product/`, data);
            changeLoadingStatus(false);
            getProduct();
            resetField();
            changeSnackbarValues({
                type: "success",
                content: "Th??m n??ng s???n m???i th??nh c??ng!",
                isToggle: true,
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                changeLoadingStatus(false);
                changeSnackbarValues({
                    type: "error",
                    content: "T??n n??ng s???n kh??ng ???????c ????? tr???ng v?? ph???i l?? duy nh???t !",
                    isToggle: true,
                });
                return;
            }
            changeLoadingStatus(false);
            changeSnackbarValues({
                type: "error",
                content: "L???i h??? th???ng!",
                isToggle: true,
            });
        }
    };

    const updateProduct = async (value: ProductModalValueInitializer, id: string) => {
        const { title, typeId } = value;
        const data = {
            title,
            typeId,
        };
        try {
            await axios.patch(`${host}/api/product/${id}`, data);
            changeLoadingStatus(false);
            getProduct();
            resetField();
            changeSubmitTypeEvent("adding");
            changeSnackbarValues({
                type: "success",
                content: "Ch???nh s???a th??nh c??ng!",
                isToggle: true,
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                changeLoadingStatus(false);
                changeSnackbarValues({
                    type: "error",
                    isToggle: true,
                    content: "T??n n??ng s???n ???? t???n t???i, vui l??ng th??? l???i !",
                });
            }
            changeLoadingStatus(false);
            changeSnackbarValues({
                type: "error",
                isToggle: true,
                content: "L???i h??? th???ng !",
            });
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            await axios.delete(`${host}/api/product/${id}`);
            getProduct();
            changeLoadingStatus(false);
            changeSnackbarValues({
                type: "success",
                content: "Xo?? n??ng s???n th??nh c??ng!",
                isToggle: true,
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                changeLoadingStatus(false);
                changeSnackbarValues({
                    type: "error",
                    isToggle: true,
                    content: "N??ng s???n kh??ng t???n t???i !",
                });
            }
            changeLoadingStatus(false);
            changeSnackbarValues({
                type: "error",
                isToggle: true,
                content: "L???i h??? th???ng !",
            });
        }
    };

    const changeCurrentId = (id: string) => {
        setCurrentId(id);
    };

    const changeSubmitTypeEvent = (type: SubmitEventType) => {
        setEventType(type);
    };

    const resetField = () => {
        dispatch({ type: "status", payload: false });
        dispatch({ type: "title", payload: "" });
        dispatch({ type: "typeId", payload: "" });
    };

    const productContextValue = {
        eventType,
        currentProductId,
        productList,
        modalValues: productReducerState.productValue,
        resetField,
        getProduct,
        updateProduct,
        deleteProduct,
        createNewProduct,
        changeCurrentId,
        changeModalValues,
        changeSubmitTypeEvent,
    };
    return <ProductContext.Provider value={productContextValue}>{children}</ProductContext.Provider>;
};

export default ProductContextProvider;
