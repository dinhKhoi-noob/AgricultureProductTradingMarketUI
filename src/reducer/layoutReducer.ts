import { layoutActionType } from "../constant/types";

interface layoutReducerAction {
    type: layoutActionType;
    payload: Boolean;
}

export interface layoutReducerState {
    isToggleOnNavbar: Boolean;
}

export const layoutReducer = (state: layoutReducerState, action: layoutReducerAction) => {
    const { type, payload } = action;
    switch (type) {
        case layoutActionType.TOGGLE_ON_NAVBAR:
            return {
                ...state,
                isToggleOnNavbar: payload,
            };
        default:
            return state;
    }
};
