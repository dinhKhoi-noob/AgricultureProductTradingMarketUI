import { UserValueInitializer } from "../context/ChatContext";

type ChatActionType = "loadUser" | "addUser" | "sendMessage" | "hasNewMessage";

interface ChatState {
    user: UserValueInitializer[];
}

interface ChatAction {
    type: ChatActionType;
    payload: any;
}

export const chatReducer = (state: ChatState, action: ChatAction) => {
    const { type, payload } = action;
    let index = 0;
    if (type === "addUser") {
        index = state.user.findIndex(user => {
            return user === payload;
        });
    }
    if (type === "sendMessage" || type === "hasNewMessage") {
        index = state.user.findIndex(user => {
            return user.uid === payload.uid;
        });
    }
    const temporaryUserList = state.user;
    console.log(type, payload);
    switch (type) {
        case "loadUser":
            return {
                ...state,
                user: payload,
            };
        case "addUser":
            if (index > -1) {
                return state;
            }
            temporaryUserList.push(payload);
            return {
                ...state,
                user: temporaryUserList,
            };
        default:
            return state;
    }
};
