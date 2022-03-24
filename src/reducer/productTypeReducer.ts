import {
    ProductTypeStateInitializer,
    ProductTypeModalActionType,
    ProductTypeDefault,
    InterestItemValueInitializer,
} from "../context/ProductTypeContext";

interface productTypeReducerAction {
    type: ProductTypeModalActionType | "addInterestItem" | "removeInterestItem";
    payload: ProductTypeDefault | string | InterestItemValueInitializer;
}

export interface productTypeReducerState {
    productTypeValue: ProductTypeStateInitializer;
    interestList: InterestItemValueInitializer[];
}

export const productTypeReducer = (state: productTypeReducerState, action: productTypeReducerAction) => {
    const { type, payload } = action;
    let index = -1;
    if (type === "removeInterestItem") {
        index = state.interestList.findIndex(item => {
            return item.id === payload;
        });
    }
    if (type === "addInterestItem") {
        const temporaryPayload = payload as InterestItemValueInitializer;
        index = state.interestList.findIndex(item => {
            return item.id === temporaryPayload.id;
        });
    }
    switch (type) {
        case "title":
            return {
                ...state,
                productTypeValue: {
                    ...state.productTypeValue,
                    title: payload.toString(),
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
        case "addInterestItem":
            if (index < 0) {
                return {
                    ...state,
                    interestList: [...state.interestList, payload as InterestItemValueInitializer],
                };
            }
            return state;
        case "removeInterestItem":
            if (index > -1) {
                state.interestList.splice(index, 1);
                return {
                    ...state,
                    interestList: state.interestList,
                };
            }
            return state;
        default:
            return state;
    }
};
