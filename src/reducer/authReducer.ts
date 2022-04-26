import { UserInfomationInitializer, WarningFieldName, WarningStatusType } from "../context/AuthContext";

export interface UserAddressValue {
    id: string;
    address: string;
}

export interface AuthReducerAction {
    type: WarningFieldName | "role" | "info" | "loadAddressList";
    payload: boolean | string | UserInfomationInitializer | UserAddressValue[];
}

export interface AuthReducerState {
    accountState: WarningStatusType;
    addressList: UserAddressValue[];
    userRole: string;
    userInfo: UserInfomationInitializer;
}

export const authReducer = (state: AuthReducerState, action: AuthReducerAction) => {
    const { type, payload } = action;
    switch (type) {
        case "city":
            return {
                ...state,
                accountState: {
                    ...state.accountState,
                    city: typeof payload === "boolean" ? payload : true,
                },
            };
        case "district":
            return {
                ...state,
                accountState: {
                    ...state.accountState,
                    district: typeof payload === "boolean" ? payload : true,
                },
            };
        case "ward":
            return {
                ...state,
                accountState: {
                    ...state.accountState,
                    ward: typeof payload === "boolean" ? payload : true,
                },
            };
        case "street":
            return {
                ...state,
                accountState: {
                    ...state.accountState,
                    street: typeof payload === "boolean" ? payload : true,
                },
            };
        case "level":
            return {
                ...state,
                accountState: {
                    ...state.accountState,
                    level: typeof payload === "boolean" ? payload : true,
                },
            };
        case "username":
            return {
                ...state,
                accountState: {
                    ...state.accountState,
                    username: typeof payload === "boolean" ? payload : true,
                },
            };
        case "email":
            return {
                ...state,
                accountState: {
                    ...state.accountState,
                    email: typeof payload === "boolean" ? payload : true,
                },
            };
        case "password":
            return {
                ...state,
                accountState: {
                    ...state.accountState,
                    password: typeof payload === "boolean" ? payload : true,
                },
            };
        case "phone":
            return {
                ...state,
                accountState: {
                    ...state.accountState,
                    phone: typeof payload === "boolean" ? payload : true,
                },
            };
        case "role":
            return {
                ...state,
                userRole: payload.toString(),
            };
        case "info":
            return {
                ...state,
                userInfo: payload as UserInfomationInitializer,
            };
        case "loadAddressList":
            return {
                ...state,
                addressList: payload as UserAddressValue[],
            };
        default:
            return state;
    }
};
