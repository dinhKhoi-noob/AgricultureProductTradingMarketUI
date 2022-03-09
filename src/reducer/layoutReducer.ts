interface layoutReducerAction {
    type: "loading";
    payload: boolean;
}

export interface layoutReducerState {
    onLoading: boolean;
}

export const layoutReducer = (state: layoutReducerState, action: layoutReducerAction) => {
    const { type, payload } = action;
    switch (type) {
        case "loading":
            return {
                ...state,
                onLoading: payload,
            };
        default:
            return state;
    }
};
