/* eslint-disable camelcase */
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import React, { createContext, ReactNode, SyntheticEvent, useContext, useEffect, useReducer, useState } from "react";
import Cookie from "universal-cookie";
import { LoginUserType } from "../../pages/authentication/login";
import { RegisterUserType } from "../../pages/authentication/register/default";
import { authReducer, AuthReducerState, UserAddressValue } from "../reducer/authReducer";
import socket from "../socket";
import { LayoutContext } from "./LayoutContext";
import { InterestItemValueInitializer } from "./ProductTypeContext";

export type InputFieldType = "username" | "password" | "phone" | "retypePassword" | "email";
type AddressPickerType = "city" | "district" | "ward" | "address";
type AddressTypingType = "street" | "level";
export type WarningFieldName =
    | "username"
    | "password"
    | "retypePassword"
    | "phone"
    | "email"
    | "city"
    | "district"
    | "ward"
    | "street"
    | "level";

interface AuthContextProps {
    children: ReactNode;
}

export interface UserInformationValue {
    id: string;
    username: string;
    avatar: string;
    role: string;
    address: string;
    phone: string;
    email: string;
    loginMethod: string;
    createdDate: Date;
    isActive: boolean;
}

export interface UserInfomationInitializer {
    id: string;
    username: string;
    avatar: string;
    role: string;
    address: string;
    phone: string;
    email: string;
    loginMethod: string;
}

export interface WarningStatusType {
    username: boolean;
    password: boolean;
    retypePassword: boolean;
    phone: boolean;
    email: boolean;
    city: boolean;
    district: boolean;
    ward: boolean;
    street: boolean;
    level: boolean;
}

interface UserAddress {
    city: string;
    district: string;
    ward: string;
    street: string;
    level: string;
    cityCode: string;
    districtCode: string;
    wardCode: string;
}

interface AuthContextDefault {
    cities: any[];
    districtSelection: any[];
    wardSelection: any[];
    userAddress: UserAddress;
    warningStatus: WarningStatusType;
    currentUser: RegisterUserType;
    userRole: string;
    userInfo: UserInfomationInitializer;
    addressList: UserAddressValue[];
    users: UserInformationValue[];
    currentUserId: string;
    isToggleOnCreateUserModal: boolean;
    changeWarningStatus: (type: WarningFieldName, value: boolean) => void;
    setCookie: () => void;
    checkCookie: () => boolean;
    loginUser: (user: LoginUserType) => void;
    registerUser: (user: RegisterUserType, interestList: InterestItemValueInitializer[]) => void;
    updateAdditionalInformation: (
        uid: string,
        phone: string,
        address: string,
        isEditing: boolean,
        filePath?: string
    ) => void;
    getCityNameApi: () => void;
    renderAddressSelector: (type: AddressPickerType, selector: any[]) => void;
    changeAddressLineOne: (event: SyntheticEvent, type: AddressTypingType) => void;
    changeCurrentUserInformation: (event: SyntheticEvent, inputFieldType: InputFieldType) => void;
    storeUserLoginInformation: () => void;
    navigateUser: (path: string, role: string[]) => void;
    isLoggedIn: () => boolean;
    loggoutUser: () => void;
    getCurrenUserRole: () => void;
    changeUserInformation: (user: UserInfomationInitializer) => void;
    getUserInformation: () => void;
    fillUserInformationOnEditing: () => void;
    renderUserAddress: () => void;
    addNewAddress: (address: string, uid: string) => void;
    loadUsers: (role: string) => void;
    createUser: (user: RegisterUserType, role: string) => void;
    changeUserActiveStatus: (status: boolean) => void;
    changeCurrentUserId: (userId: string, role: string) => void;
    changeIsToggleOnCreateUserModal: (status?: boolean) => void;
}

export const AuthContext = createContext<AuthContextDefault>({
    cities: [],
    districtSelection: [],
    wardSelection: [],
    userAddress: {
        city: "",
        district: "",
        ward: "",
        street: "",
        level: "",
        cityCode: "",
        districtCode: "",
        wardCode: "",
    },
    warningStatus: {
        username: false,
        password: false,
        retypePassword: false,
        phone: false,
        email: false,
        city: false,
        district: false,
        ward: false,
        street: false,
        level: false,
    },
    currentUser: {
        address: "",
        password: "",
        phone: "",
        username: "",
        email: "",
    },
    userRole: "",
    userInfo: {
        id: "",
        username: "",
        email: "",
        phone: "",
        address: "",
        avatar: "",
        role: "",
        loginMethod: "",
    },
    addressList: [],
    users: [],
    currentUserId: "",
    isToggleOnCreateUserModal: false,
    changeWarningStatus: () => null,
    setCookie: () => null,
    checkCookie: () => false,
    loginUser: () => null,
    registerUser: () => null,
    updateAdditionalInformation: () => null,
    getCityNameApi: () => null,
    renderAddressSelector: () => null,
    changeAddressLineOne: () => null,
    changeCurrentUserInformation: () => null,
    storeUserLoginInformation: () => null,
    navigateUser: () => null,
    isLoggedIn: () => false,
    loggoutUser: () => null,
    getCurrenUserRole: () => null,
    changeUserInformation: () => null,
    getUserInformation: () => null,
    fillUserInformationOnEditing: () => null,
    renderUserAddress: () => null,
    addNewAddress: () => null,
    loadUsers: () => null,
    createUser: () => null,
    changeUserActiveStatus: () => null,
    changeCurrentUserId: () => null,
    changeIsToggleOnCreateUserModal: () => null,
});

const AuthContextProvider = ({ children }: AuthContextProps) => {
    const authReducerStateDefault: AuthReducerState = {
        accountState: {
            username: false,
            password: false,
            retypePassword: false,
            phone: false,
            email: false,
            city: false,
            district: false,
            ward: false,
            street: false,
            level: false,
        },
        userRole: "",
        userInfo: {
            id: "",
            username: "",
            email: "",
            phone: "",
            role: "",
            address: "",
            avatar: "",
            loginMethod: "",
        },
        addressList: [],
        users: [],
    };
    const [loadSelector, setLoadSelector] = useState(false);
    const [currentRole, setCurrentRole] = useState("1234567890");
    const [isToggleOnCreateUserModal, setIsToggleOnCreateUserModal] = useState(false);
    const [cities, setCities] = useState([]);
    const [districtSelection, setDistrictSelection] = useState([]);
    const [wardSelection, setWardSelection] = useState([]);
    const [userAddress, setUserAddress] = useState<UserAddress>({
        city: "",
        district: "",
        ward: "",
        street: "",
        level: "",
        cityCode: "",
        districtCode: "",
        wardCode: "",
    });
    const [currentUser, setCurrentUser] = useState<RegisterUserType>({
        username: "",
        password: "",
        phone: "",
        address: "",
        email: "",
    });
    const [currentUserId, setCurrentUserId] = useState("");

    const { changeSnackbarValues, changeLoadingStatus } = useContext(LayoutContext);
    const [authState, dispatch] = useReducer(authReducer, authReducerStateDefault);
    const host = `http://localhost:4000`;
    const router = useRouter();
    const cookie = new Cookie();

    const changeIsToggleOnCreateUserModal = (status?: boolean) => {
        if (status !== undefined) {
            setIsToggleOnCreateUserModal(status);
        }
        setIsToggleOnCreateUserModal(!isToggleOnCreateUserModal);
    };

    const changeCurrentUserId = (userId: string, role: string) => {
        setCurrentUserId(userId);
        setCurrentRole(role);
    };

    const renderDistrictEditingSelector = () => {
        const addressSelectorCode = authState.userInfo.address.split("!^!")[1];
        if (addressSelectorCode) {
            const addressSelectorCodeArray = addressSelectorCode.split("&");
            if (addressSelectorCodeArray[1]) {
                setUserAddress({
                    ...userAddress,
                    district: districtSelection[parseInt(addressSelectorCodeArray[1].split("_")[0])]["name"],
                    wardCode: addressSelectorCodeArray[2],
                });
                setWardSelection(districtSelection[parseInt(addressSelectorCodeArray[1].split("_")[0])]["wards"]);
            }
        }
    };

    const renderWardEditingSelector = () => {
        const addressSelectorCode = authState.userInfo.address.split("!^!")[1];
        if (addressSelectorCode) {
            const addressSelectorCodeArray = addressSelectorCode.split("&");
            if (addressSelectorCodeArray[2]) {
                setUserAddress({
                    ...userAddress,
                    ward: wardSelection[parseInt(addressSelectorCodeArray[2].split("_")[0])]["name"],
                });
            }
        }
    };

    useEffect(() => {
        if (router.pathname === "/authentication/profile" && !loadSelector) {
            renderDistrictEditingSelector();
        }
    }, [districtSelection]);

    useEffect(() => {
        if (router.pathname === "/authentication/profile" && !loadSelector) {
            renderWardEditingSelector();
            setLoadSelector(true);
        }
    }, [wardSelection]);

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

    const checkCookie = () => {
        const uid = cookie.get("uid");
        if (uid) {
            return true;
        }
        return false;
    };

    const getCityNameApi = async () => {
        try {
            const response = await axios.get("https://provinces.open-api.vn/api/?depth=3");
            const cities = response?.data;
            setCities(cities);
        } catch (error) {
            console.log(error);
        }
    };

    const isLoggedIn = () => {
        let flag = false;
        if (typeof window !== "undefined") {
            const uid = cookie.get("uid");
            if (uid) {
                flag = true;
            } else {
                localStorage.removeItem("user");
            }
        }
        return flag;
    };

    const storeUserLoginInformation = async () => {
        if (typeof window !== "undefined") {
            const uid = cookie.get("uid");
            try {
                const response = await axios.get(`${host}/api/user/${uid}`);
                const userData = response.data.result;
                if (userData) {
                    const { role, username, address, avatar, phone, email, id, login_method } = userData;
                    const userInfo: UserInfomationInitializer = {
                        id,
                        role,
                        username,
                        address,
                        phone,
                        email,
                        avatar,
                        loginMethod: login_method,
                    };
                    localStorage.setItem("user", JSON.stringify(userInfo));
                    dispatch({ type: "role", payload: role });
                    dispatch({ type: "info", payload: userInfo });
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    changeSnackbarValues({ content: error.response?.data.message, type: "error", isToggle: true });
                    return;
                }
                changeSnackbarValues({ content: "Lỗi hệ thống", type: "error", isToggle: true });
            }
        }
    };

    const setCookie = async (
        providedToken?: string,
        type?: "login" | "register",
        interestList?: InterestItemValueInitializer[]
    ) => {
        const token = providedToken ? providedToken : router.query["token"];
        try {
            if (token) {
                const response = await axios.post(`${host}/api/user/verify`, null, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response) {
                    const id = response?.data?.id;
                    cookie.set("uid", id, {
                        path: "/",
                        expires: new Date(new Date().setDate(new Date().getDate() + 1)),
                    });
                    socket.auth = { uid: id };
                    socket.connect();
                    storeUserLoginInformation();
                    router.push("/");
                }
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                changeSnackbarValues({
                    content: "Xác thực người dùng không thành công",
                    type: "error",
                    isToggle: true,
                });
                return;
            }
            changeSnackbarValues({
                content: "Lỗi hệ thống",
                type: "error",
                isToggle: true,
            });
        }
    };

    const loginUser = async (user: LoginUserType) => {
        axios
            .post(`${host}/api/user/login`, user)
            .then(response => response.data)
            .then(data => {
                const token = data?.token;
                if (token) {
                    setCookie(token, "login");
                    return;
                }
            })
            .catch((error: AxiosError) => {
                const errorMessage = error?.response?.data?.message;
                changeSnackbarValues({ content: errorMessage, type: "error", isToggle: true });
            });
    };

    const changeWarningStatus = (type: WarningFieldName, value: boolean): void => {
        dispatch({ type: type, payload: value });
    };

    const emptyFieldCheck = (type: WarningFieldName, field: string): boolean => {
        if (!field || field === "") {
            dispatch({ type: type, payload: true });
            changeSnackbarValues({
                content: "Vui lòng nhập đầy đủ các thông tin cần thiết!",
                type: "error",
                isToggle: true,
            });
            return false;
        }
        dispatch({ type: type, payload: false });
        return true;
    };

    const registerUser = async (user: RegisterUserType, interestList: InterestItemValueInitializer[]) => {
        const { city, district, ward, street, level, cityCode, districtCode, wardCode } = userAddress;
        const { username, password, phone, email } = user;
        const pairCheckerArray: { type: WarningFieldName; field: any }[] = [
            { type: "username", field: username },
            { type: "password", field: password },
            { type: "phone", field: phone },
            { type: "city", field: city },
            { type: "district", field: district },
            { type: "ward", field: ward },
            { type: "street", field: street },
            { type: "level", field: level },
            { type: "email", field: email },
        ];
        let flag = true;
        let index = 0;
        while (flag && index < pairCheckerArray.length) {
            const { type, field } = pairCheckerArray[index];
            flag = emptyFieldCheck(type, field);
            index++;
        }
        index = 0;
        if (!flag) {
            return;
        }
        const currentAddress =
            level +
            ", " +
            street +
            ", " +
            ward +
            ", " +
            district +
            ", " +
            city +
            "!^!" +
            cityCode +
            "&" +
            districtCode +
            "&" +
            wardCode;
        user.address = currentAddress;
        console.log(user);
        try {
            const registerationResponse = await axios.post(`${host}/api/user/register`, user);
            const registerationData = registerationResponse.data;
            const token = registerationData.token;
            console.log(token);
            setCookie(token, "register");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                changeSnackbarValues({ content: error.response?.data.message, type: "error", isToggle: true });
                return;
            }
            changeSnackbarValues({ content: "Lỗi hệ thống", type: "error", isToggle: true });
        }
    };

    const updateAdditionalInformation = async (
        uid: string,
        phone: string,
        address: string,
        isEditing: boolean,
        filePath?: string
    ) => {
        try {
            const data = {
                phone,
                address,
                filePath: filePath && filePath !== "" ? filePath : null,
            };
            changeLoadingStatus(false);
            await axios.patch(`${host}/api/user/additional/${uid}`, data);
            changeSnackbarValues({
                content: isEditing
                    ? "Cập nhật thông tin người dùng thành công !"
                    : "Đã hoàn tất đăng ký tài khoản, bạn sẽ được điều hướng về trang chủ sau vài giây !",
                type: "success",
                isToggle: true,
            });
            if (typeof window !== "undefined") {
                const userValue = localStorage.getItem("user");
                if (userValue) {
                    const userData = JSON.parse(userValue);
                    let temporaryUserData = userData;
                    temporaryUserData = { ...userData, address, phone };
                    if (isEditing) {
                        if (filePath && filePath !== "") {
                            temporaryUserData = { ...userData, address, phone, avatar: filePath };
                        }
                        localStorage.setItem("user", JSON.stringify(temporaryUserData));
                        dispatch({ type: "info", payload: temporaryUserData });
                    } else {
                        localStorage.setItem("user", JSON.stringify(temporaryUserData));
                        dispatch({ type: "info", payload: temporaryUserData });
                        setTimeout(() => {
                            router.push("/");
                        }, 3000);
                    }
                }
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                changeSnackbarValues({ content: error.response?.data.message, type: "error", isToggle: true });
                return;
            }
            changeSnackbarValues({ content: "Lỗi hệ thống", type: "error", isToggle: true });
        }
    };

    const changeAddress = (event: SelectChangeEvent, type: AddressPickerType) => {
        const value = event.target.value;
        const valueId = parseInt(value.split("_")[0]);
        console.log(value);
        switch (type) {
            case "city":
                setUserAddress({
                    ...userAddress,
                    cityCode: value,
                    city: cities[valueId]["name"],
                });
                setDistrictSelection(cities[valueId]["districts"]);
                setWardSelection([]);
                break;
            case "district":
                setUserAddress({
                    ...userAddress,
                    districtCode: value,
                    district: districtSelection[valueId]["name"],
                });
                setWardSelection(districtSelection[valueId]["wards"]);
                break;
            case "ward":
                setUserAddress({
                    ...userAddress,
                    wardCode: value,
                    ward: wardSelection[valueId]["name"],
                });
                break;
            default:
                return;
        }
    };

    const changeAddressLineOne = (event: SyntheticEvent, type: AddressTypingType) => {
        const target = event.target as HTMLInputElement;
        const value = target.value;
        if (type === "street") {
            setUserAddress({ ...userAddress, street: value });
            return;
        }
        setUserAddress({ ...userAddress, level: value });
    };

    const renderAddressSelector = (type: AddressPickerType, selector: any[]) => {
        let labelText = "";
        let labelId = "";
        let selectId = "";
        let codeType;
        let errorType;
        if (type === "city") {
            labelText = "Tỉnh / Thành Phố";
            labelId = "city-selector-label";
            selectId = "city-selector";
            codeType = userAddress.cityCode;
            errorType = authState.accountState.city;
        }
        if (type === "district") {
            labelText = "Quận / Huyện / Thị xã";
            labelId = "district-selector-label";
            selectId = "district-selector";
            codeType = userAddress.districtCode;
            errorType = authState.accountState.district;
        }
        if (type === "ward") {
            labelText = "Phường / Xã / Thị trấn";
            labelId = "district-selector-label";
            selectId = "district-selector";
            codeType = userAddress.wardCode;
            errorType = authState.accountState.ward;
        }
        return (
            <FormControl fullWidth>
                <InputLabel id={labelId}>{labelText}</InputLabel>
                <Select
                    labelId={labelId}
                    id={selectId}
                    value={codeType}
                    onChange={event => changeAddress(event, type)}
                    error={errorType}
                >
                    {selector.map((district, index) => {
                        return (
                            <MenuItem key={index} value={index + "_" + type}>
                                {district["name"]}
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        );
    };

    const changeCurrentUserInformation = (event: SyntheticEvent, inputFieldType: InputFieldType) => {
        const target = event.target as HTMLInputElement;
        const value = target?.value;
        switch (inputFieldType) {
            case "password":
                setCurrentUser({ ...currentUser, password: value });
                break;
            case "phone":
                setCurrentUser({ ...currentUser, phone: value });
                break;
            case "username":
                setCurrentUser({ ...currentUser, username: value });
                break;
            case "email":
                setCurrentUser({ ...currentUser, email: value });
                break;
            default:
                return;
        }
    };

    const navigateUser = (path: string, role: string[]) => {
        if (typeof window !== "undefined") {
            const userStoreValue = localStorage.getItem("user");
            if (userStoreValue) {
                const userInfo = JSON.parse(userStoreValue);
                let flag = false;
                for (let i = 0; i < role.length && !flag; i++) {
                    if (role[i] === userInfo.role) {
                        flag = true;
                    }
                }
                if (!flag) {
                    router.push("/");
                }
            }
        }
    };

    const loggoutUser = () => {
        cookie.remove("uid");
        if (typeof window !== "undefined") {
            localStorage.removeItem("user");
        }
        router.push("/authentication/login");
    };

    const getCurrenUserRole = () => {
        if (typeof window !== "undefined") {
            const user = window.localStorage.getItem("user");
            if (user) {
                const userInfo = JSON.parse(user);
                dispatch({ type: "role", payload: userInfo.role });
            }
        }
    };

    const changeUserInformation = (userInfo: UserInfomationInitializer) => {
        dispatch({ type: "info", payload: userInfo });
    };

    const getUserInformation = () => {
        if (typeof window !== "undefined") {
            const userValue = localStorage.getItem("user");
            if (userValue) {
                const userData = JSON.parse(userValue);
                dispatch({ type: "info", payload: userData });
            }
        }
    };

    const fillUserInformationOnEditing = () => {
        const addressSelectorCode = authState.userInfo.address.split("!^!")[1];
        const addressValue = authState.userInfo.address.split("!^!")[0];
        setCurrentUser({ ...currentUser, phone: authState.userInfo.phone });
        if (addressSelectorCode && addressValue) {
            const addressValueArray = addressValue.split(", ");
            const addressSelectorCodeArray = addressSelectorCode.split("&");
            setUserAddress({
                ...userAddress,
                level: addressValueArray[0],
                street: addressValueArray[1],
                cityCode: addressSelectorCodeArray[0],
                city: cities[parseInt(addressSelectorCodeArray[0].split("_")[0])]["name"],
                districtCode: addressSelectorCodeArray[1],
            });
            setDistrictSelection(cities[parseInt(addressSelectorCodeArray[0].split("_")[0])]["districts"]);
            setLoadSelector(false);
        }
    };

    const renderUserAddress = async () => {
        try {
            const id = cookie.get("uid");
            console.log(`${host}/api/address/${id}`);
            const response = await axios.get(`${host}/api/address/${id}`);
            const result: any[] = response.data.result;
            if (result) {
                const mappedAddressList: UserAddressValue[] = result.map((value: any) => {
                    const { id, address } = value;
                    return {
                        id,
                        address,
                    };
                });
                dispatch({ type: "loadAddressList", payload: mappedAddressList });
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                changeSnackbarValues({ content: error.response?.data.message, type: "error", isToggle: true });
                return;
            }
            changeSnackbarValues({ content: "Lỗi hệ thống", type: "error", isToggle: true });
        }
    };

    const addNewAddress = async (address: string, uid: string) => {
        try {
            console.log(address);
            await axios.post(`${host}/api/address/${uid}`, { address });
            changeLoadingStatus(false);
            renderUserAddress();
        } catch (error) {
            changeLoadingStatus(false);
            if (axios.isAxiosError(error)) {
                changeSnackbarValues({ content: error.response?.data.message, type: "error", isToggle: true });
                return;
            }
            changeSnackbarValues({ content: "Lỗi hệ thống", type: "error", isToggle: true });
        }
    };

    const loadUsers = async (role: string) => {
        try {
            const response = await axios.get(`${host}/api/user${role ? `?role=${role}` : ""}`);
            const data = response.data.result;
            console.log(data);
            if (data) {
                const mappedUserList: UserInformationValue[] = data.map((user: any) => {
                    const {
                        id,
                        username,
                        address,
                        login_method,
                        role_id,
                        phone,
                        email,
                        avatar,
                        is_active,
                        created_date,
                    } = user;
                    const transitoryInformation: UserInformationValue = {
                        address,
                        id,
                        username,
                        avatar,
                        createdDate: new Date(created_date),
                        email,
                        isActive: is_active === 0 ? true : false,
                        loginMethod: login_method,
                        phone,
                        role: role_id,
                    };
                    return transitoryInformation;
                });
                dispatch({ type: "loadUsers", payload: mappedUserList });
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                dispatch({ type: "loadUsers", payload: [] });
                return;
            }
            handleError(error);
        }
    };

    const createUser = async (user: RegisterUserType, role: string) => {
        try {
            const { password, phone, email, username, address } = user;
            await axios.post(`${host}/api/user/create`, {
                username,
                password,
                address,
                email,
                phone,
                role_id: role,
            });
            changeSnackbarValues({
                type: "success",
                isToggle: true,
                content: "Tạo người dùng mới thành công !",
            });
            loadUsers(role);
        } catch (error) {
            handleError(error);
        }
    };

    const changeUserActiveStatus = async (status: boolean) => {
        try {
            console.log(`${host}/api/user/status/${currentUserId}`);
            await axios.patch(`${host}/api/user/status/${currentUserId}`, { status: status ? 0 : 1 });
            changeSnackbarValues({
                type: "success",
                isToggle: true,
                content: status ? "Tái kích hoạt người dùng thành công" : "Vô hiệu hoá dùng thành công !",
            });
            loadUsers(currentRole);
        } catch (error) {
            handleError(error);
        }
    };

    const authContextValue = {
        cities,
        districtSelection,
        wardSelection,
        userAddress,
        warningStatus: authState.accountState,
        currentUser,
        userRole: authState.userRole,
        userInfo: authState.userInfo,
        addressList: authState.addressList,
        users: authState.users,
        currentUserId,
        isToggleOnCreateUserModal,
        changeWarningStatus,
        dispatch,
        setCookie,
        checkCookie,
        loginUser,
        registerUser,
        updateAdditionalInformation,
        getCityNameApi,
        renderAddressSelector,
        changeAddressLineOne,
        changeCurrentUserInformation,
        storeUserLoginInformation,
        navigateUser,
        isLoggedIn,
        loggoutUser,
        getCurrenUserRole,
        changeUserInformation,
        getUserInformation,
        fillUserInformationOnEditing,
        renderUserAddress,
        addNewAddress,
        loadUsers,
        createUser,
        changeUserActiveStatus,
        changeCurrentUserId,
        changeIsToggleOnCreateUserModal,
    };
    return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
