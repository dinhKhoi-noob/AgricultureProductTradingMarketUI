interface layoutReducerAction {
    type: "loading" | "changeOnSellingPageStatus";
    payload: boolean;
}

export interface layoutReducerState {
    onLoading: boolean;
    onSellingPage: boolean;
}

export const layoutReducer = (state: layoutReducerState, action: layoutReducerAction) => {
    const { type, payload } = action;
    switch (type) {
        case "loading":
            return {
                ...state,
                onLoading: payload,
            };
        case "changeOnSellingPageStatus":
            return {
                ...state,
                onSellingPage: payload,
            };
        default:
            return state;
    }
};
