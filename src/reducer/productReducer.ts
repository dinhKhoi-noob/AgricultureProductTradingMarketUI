import { ProductModalValueInitializer, ProductModalActionType } from "../context/ProductContext";

interface productReducerAction {
    type: ProductModalActionType;
    payload: string | boolean;
}

export interface productReducerState {
    productValue: ProductModalValueInitializer;
}

export const productReducer = (state: productReducerState, action: productReducerAction) => {
    const { type, payload } = action;
    console.log(payload);
    switch (type) {
        case "title":
            return {
                ...state,
                productValue: {
                    ...state.productValue,
                    title: payload.toString(),
                },
            };
        case "typeId":
            return {
                ...state,
                productValue: {
                    ...state.productValue,
                    typeId: payload.toString(),
                },
            };
        case "status":
            return {
                ...state,
                productValue: {
                    ...state.productValue,
                    isToggle: payload as boolean,
                },
            };
        default:
            return state;
    }
};
