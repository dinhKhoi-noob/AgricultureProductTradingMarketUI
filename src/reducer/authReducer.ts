import { WarningFieldName, WarningStatusType } from "../context/AuthContext";

export type RegisterationStepType = "first" | "second" | "third" | "fourth";

export interface AuthReducerAction {
    type: WarningFieldName | "step";
    payload: any;
}

export interface AuthReducerState {
    accountState: WarningStatusType;
    step: RegisterationStepType;
}

export const authReducer = (state: AuthReducerState, action: AuthReducerAction) => {
    const { type, payload } = action;
    switch (type) {
        case "city":
            return {
                ...state,
                accountState: {
                    ...state.accountState,
                    city: payload,
                },
            };
        case "district":
            return {
                ...state,
                accountState: {
                    ...state.accountState,
                    district: payload,
                },
            };
        case "ward":
            return {
                ...state,
                accountState: {
                    ...state.accountState,
                    ward: payload,
                },
            };
        case "street":
            return {
                ...state,
                accountState: {
                    ...state.accountState,
                    street: payload,
                },
            };
        case "level":
            return {
                ...state,
                accountState: {
                    ...state.accountState,
                    level: payload,
                },
            };
        case "username":
            return {
                ...state,
                accountState: {
                    ...state.accountState,
                    username: payload,
                },
            };
        case "password":
            return {
                ...state,
                accountState: {
                    ...state.accountState,
                    password: payload,
                },
            };
        case "phone":
            return {
                ...state,
                accountState: {
                    ...state.accountState,
                    phone: payload,
                },
            };
        case "step":
            return {
                ...state,
                step: payload,
            };
        default:
            return state;
    }
};
