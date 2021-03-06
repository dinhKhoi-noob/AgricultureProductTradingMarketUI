/* eslint-disable camelcase */
import axios from "axios";
import React, { createContext, ReactNode, useContext, useReducer, useState } from "react";
import { productTypeReducer } from "../reducer/productTypeReducer";
import { LayoutContext } from "./LayoutContext";

export type ProductTypeModalActionType = "type" | "title";
export type ProductTypeDefault = "processed" | "crude";
export type SubmitEventType = "adding" | "editing" | "removing";

export interface ProductTypeStateInitializer {
    type: ProductTypeDefault;
    title: string;
}

export interface ProductTypePropertyInitializer {
    id: string;
    createdBy: string;
    title: string;
    type: ProductTypeDefault;
    dateCreated: string;
    dateModified: string;
}

export interface InterestItemValueInitializer {
    id: string;
    title: string;
}

interface ProductTypeContextProps {
    children: ReactNode;
}

interface ProductTypeContextDefault {
    isToggleModal: boolean;
    currentProductTypeId: string;
    submitTypeEvent: SubmitEventType;
    productTypeValue: ProductTypeStateInitializer;
    categoryList: ProductTypePropertyInitializer[];
    interestList: InterestItemValueInitializer[];
    changeToggleModalStatus: (status?: boolean) => void;
    getCategoryList: () => void;
    postNewCategory: (category: ProductTypeStateInitializer) => void;
    updateCategory: (category: ProductTypeStateInitializer) => void;
    hideCategoryInUserSite: (id: string) => void;
    changeProductTypeValue: (value: ProductTypeDefault | string, type: "title" | "type") => void;
    getSpecificProductType: (id: string) => ProductTypePropertyInitializer | null;
    changeSubmitEventType: (type: SubmitEventType) => void;
    changeCurrentProductTypeId: (id: string) => void;
    changeInterestList: (value: InterestItemValueInitializer) => void;
    removeInterestItem: (id: string) => void;
    resetField: () => void;
}

export const ProductTypeContext = createContext<ProductTypeContextDefault>({
    isToggleModal: false,
    currentProductTypeId: "",
    submitTypeEvent: "adding",
    productTypeValue: { title: "", type: "crude" },
    categoryList: [],
    interestList: [],
    changeToggleModalStatus: () => null,
    getCategoryList: () => null,
    updateCategory: () => null,
    postNewCategory: () => null,
    hideCategoryInUserSite: () => null,
    changeProductTypeValue: () => null,
    getSpecificProductType: () => null,
    changeSubmitEventType: () => null,
    changeCurrentProductTypeId: () => null,
    changeInterestList: () => null,
    removeInterestItem: () => null,
    resetField: () => null,
});

const ProductTypeContextProvider = ({ children }: ProductTypeContextProps) => {
    const host = "http://localhost:4000";
    const [isToggleModal, setToggleModal] = useState(false);
    const [submitTypeEvent, setSubmitTypeEvent] = useState<SubmitEventType>("adding");
    const [categoryList, setCategoryList] = useState<ProductTypePropertyInitializer[]>([]);
    const [currentProductTypeId, setCurrentProductTypeId] = useState("");
    const { changeSnackbarValues, changeLoadingStatus } = useContext(LayoutContext);

    const [productTypeValue, dispatch] = useReducer(productTypeReducer, {
        productTypeValue: { title: "", type: "crude" },
        interestList: [],
    });

    const resetField = (): void => {
        dispatch({ type: "type", payload: "crude" });
        dispatch({ type: "title", payload: "" });
    };

    const changeToggleModalStatus = (status?: boolean): void => {
        if (status) {
            setToggleModal(status);
            console.log(isToggleModal);
            return;
        }
        setToggleModal(!isToggleModal);
        console.log(isToggleModal);
    };

    const getCategoryList = async (): Promise<void> => {
        try {
            const respone = await axios.get(`${host}/api/category`);
            const data = respone.data;
            const result: ProductTypePropertyInitializer[] = [];
            data.result.forEach((datum: any) => {
                const { id, title, type, created_by, date_created, date_modified } = datum;
                result.push({
                    id,
                    title,
                    type,
                    createdBy: created_by,
                    dateCreated: date_created,
                    dateModified: date_modified,
                });
            });
            setCategoryList(result);
        } catch (error) {
            setCategoryList([]);
            console.log(error);
        }
    };

    const postNewCategory = async (category: ProductTypeStateInitializer): Promise<void> => {
        try {
            console.log(`${host}/api/category`, category);
            await axios.post(`${host}/api/category`, category);
            changeLoadingStatus(false);
            getCategoryList();
            changeSnackbarValues({ content: "Th??m danh m???c m???i th??nh c??ng !", type: "success", isToggle: true });
            changeToggleModalStatus(false);
            resetField();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                changeLoadingStatus(false);
                changeSnackbarValues({
                    content: "T??n danh m???c kh??ng ???????c ????? tr???ng v?? t??n danh m???c ph???i l?? duy nh???t",
                    type: "error",
                    isToggle: true,
                });
                return;
            }
            changeLoadingStatus(false);
            changeSnackbarValues({ content: "L???i h??? th???ng", type: "error", isToggle: true });
        }
    };

    const updateCategory = async (category: ProductTypeStateInitializer): Promise<void> => {
        try {
            console.log(category);
            await axios.patch(`${host}/api/category/${currentProductTypeId}`, category);
            changeLoadingStatus(false);
            getCategoryList();
            changeSnackbarValues({ content: "Ch???nh s???a danh m???c th??nh c??ng", type: "success", isToggle: true });
            changeToggleModalStatus(false);
            resetField();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                changeLoadingStatus(false);
                changeSnackbarValues({
                    content: "T??n danh m???c kh??ng ???????c ????? tr???ng v?? t??n danh m???c ph???i l?? duy nh???t",
                    type: "error",
                    isToggle: true,
                });
                return;
            }
            changeLoadingStatus(false);
            changeSnackbarValues({ content: "L???i h??? th???ng", type: "error", isToggle: true });
        }
    };

    const hideCategoryInUserSite = async (id: string) => {
        try {
            await axios.delete(`${host}/api/category/${id}`);
            changeSnackbarValues({ content: "???n danh m???c th??nh c??ng", type: "success", isToggle: true });
            changeLoadingStatus(false);
            getCategoryList();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                changeLoadingStatus(false);
                changeSnackbarValues({
                    content: "Danh m???c kh??ng t???n t???i",
                    type: "error",
                    isToggle: true,
                });
                return;
            }
            changeLoadingStatus(false);
            changeSnackbarValues({ content: "L???i h??? th???ng", type: "error", isToggle: true });
        }
    };

    const changeProductTypeValue = (value: ProductTypeDefault | string, type: ProductTypeModalActionType) => {
        if (type === "title") {
            dispatch({ type: "title", payload: value });
        }
        if (type === "type") {
            dispatch({ type: "type", payload: value });
        }
    };

    const changeInterestList = (value: InterestItemValueInitializer) => {
        dispatch({ type: "addInterestItem", payload: value });
    };

    const removeInterestItem = (id: string) => {
        dispatch({ type: "removeInterestItem", payload: id });
    };

    const getSpecificProductType = (id: string): ProductTypePropertyInitializer | null => {
        const categoryIndex = categoryList.findIndex(category => category.id === id);
        return categoryIndex > -1 ? categoryList[categoryIndex] : null;
    };

    const changeSubmitEventType = (type: SubmitEventType) => {
        setSubmitTypeEvent(type);
    };

    const changeCurrentProductTypeId = (id: string) => {
        setCurrentProductTypeId(id);
    };

    const ProductTypeContextValue = {
        isToggleModal,
        currentProductTypeId,
        submitTypeEvent,
        categoryList,
        productTypeValue: productTypeValue.productTypeValue,
        interestList: productTypeValue.interestList,
        changeToggleModalStatus,
        getCategoryList,
        postNewCategory,
        updateCategory,
        hideCategoryInUserSite,
        changeSubmitEventType,
        changeProductTypeValue,
        getSpecificProductType,
        changeCurrentProductTypeId,
        changeInterestList,
        removeInterestItem,
        resetField,
    };
    return <ProductTypeContext.Provider value={ProductTypeContextValue}>{children}</ProductTypeContext.Provider>;
};

export default ProductTypeContextProvider;
