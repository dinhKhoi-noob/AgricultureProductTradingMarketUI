import {
    ProductTypeStateInitializer,
    ProductTypeModalActionType,
    ProductTypeDefault,
} from "../context/ProductTypeContext";

interface productTypeReducerAction {
    type: ProductTypeModalActionType;
    payload: ProductTypeDefault | string;
}

export interface productTypeReducerState {
    productTypeValue: ProductTypeStateInitializer;
}

export const productTypeReducer = (state: productTypeReducerState, action: productTypeReducerAction) => {
    const { type, payload } = action;
    console.log(payload);
    switch (type) {
        case "title":
            return {
                ...state,
                productTypeValue: {
                    ...state.productTypeValue,
                    title: payload,
                },
            };
        case "type":
            return {
                ...state,
                productTypeValue: {
                    ...state.productTypeValue,
                    type: payload as ProductTypeDefault,
                },
            };
        default:
            return state;
    }
};
