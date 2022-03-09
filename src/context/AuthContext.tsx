import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import React, { createContext, ReactNode, SyntheticEvent, useContext, useReducer, useState } from "react";
import Cookie from "universal-cookie";
import { LoginUserType } from "../../pages/authentication/login";
import { RegisterUserType } from "../../pages/authentication/register/default";
import { authReducer, AuthReducerState } from "../reducer/authReducer";
import { LayoutContext } from "./LayoutContext";

type AddressPickerType = "city" | "district" | "ward" | "address";
type AddressTypingType = "street" | "level";
export type WarningFieldName =
    | "username"
    | "password"
    | "retypePassword"
    | "phone"
    | "city"
    | "district"
    | "ward"
    | "street"
    | "level";

interface AuthContextProps {
    children: ReactNode;
}
export interface WarningStatusType {
    username: boolean;
    password: boolean;
    retypePassword: boolean;
    phone: boolean;
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
    changeWarningStatus: (type: WarningFieldName, value: boolean) => void;
    setCookie: () => void;
    checkCookie: () => boolean;
    loginUser: (user: LoginUserType) => void;
    registerUser: (user: RegisterUserType) => void;
    getCityNameApi: () => void;
    renderAddressSelector: (type: AddressPickerType, selector: any[]) => void;
    changeAddressLineOne: (event: SyntheticEvent, type: AddressTypingType) => void;
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
        city: false,
        district: false,
        ward: false,
        street: false,
        level: false,
    },
    changeWarningStatus: () => null,
    setCookie: () => null,
    checkCookie: () => false,
    loginUser: () => null,
    registerUser: () => null,
    getCityNameApi: () => null,
    renderAddressSelector: () => null,
    changeAddressLineOne: () => null,
});

const AuthContextProvider = ({ children }: AuthContextProps) => {
    const authReducerStateDefault: AuthReducerState = {
        accountState: {
            username: false,
            password: false,
            retypePassword: false,
            phone: false,
            city: false,
            district: false,
            ward: false,
            street: false,
            level: false,
        },
        step: "first",
    };
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
    const { changeSnackbarValues } = useContext(LayoutContext);
    const [authState, dispatch] = useReducer(authReducer, authReducerStateDefault);
    const host = `http://localhost:4000`;
    const router = useRouter();
    const cookie = new Cookie();

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

    const setCookie = async (providedToken?: string) => {
        const token = providedToken ? providedToken : router.query["token"];
        if (token) {
            const response = await axios.post(`${host}/api/user/verify`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response) {
                cookie.set("uid", response?.data?.id, {
                    path: "/",
                    expires: new Date(new Date().setDate(new Date().getDate() + 1)),
                });
                router.push("/");
            }
        }
    };

    const loginUser = async (user: LoginUserType) => {
        axios
            .post(`${host}/api/user/login`, user)
            .then(response => response.data)
            .then(data => {
                const token = data?.token;
                if (token) {
                    setCookie(token);
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

    const registerUser = (user: RegisterUserType) => {
        const { city, district, ward, street, level } = userAddress;
        const { username, password, phone } = user;
        const pairCheckerArray: { type: WarningFieldName; field: any }[] = [
            { type: "username", field: username },
            { type: "password", field: password },
            { type: "phone", field: phone },
            { type: "city", field: city },
            { type: "district", field: district },
            { type: "ward", field: ward },
            { type: "street", field: street },
            { type: "level", field: level },
        ];
        let flag = true;
        let index = 0;
        while (flag && index < pairCheckerArray.length) {
            const { type, field } = pairCheckerArray[index];
            flag = emptyFieldCheck(type, field);
            index++;
        }
        index = 0;
        console.log(username);
        if (!flag) {
            return;
        }
        const currentAddress = level + ", " + street + ", " + ward + ", " + district + ", " + city;
        user.address = currentAddress;
        console.log(user);
        // axios
        //     .post(`${host}/api/user/register`, user)
        //     .then(response => response.data)
        //     .then(data => {
        //         const token = data?.token;
        //         if (token) {
        //             setCookie(token);
        //             return;
        //         }
        //     })
        //     .catch((error: AxiosError) => {
        //         const errorMessage = error?.response?.data?.message;
        //         changeSnackbarValues({ content: errorMessage, type: "error", isToggle: true });
        //     });
    };

    const changeAddress = (event: SelectChangeEvent, type: AddressPickerType) => {
        const value = event.target.value;
        const valueId = parseInt(value.split("_")[0]);
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

    const authContextValue = {
        cities,
        districtSelection,
        wardSelection,
        userAddress,
        warningStatus: authState.accountState,
        changeWarningStatus,
        dispatch,
        setCookie,
        checkCookie,
        loginUser,
        registerUser,
        getCityNameApi,
        renderAddressSelector,
        changeAddressLineOne,
    };
    return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
