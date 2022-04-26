import { MessageValueResponseInitializer } from "../context/ChatContext";

type ChatActionType = "loadMessages";

interface ChatState {
    messages: MessageValueResponseInitializer[];
}

interface ChatAction {
    type: ChatActionType;
    payload: MessageValueResponseInitializer[];
}

export const chatReducer = (state: ChatState, action: ChatAction) => {
    const { type, payload } = action;
    console.log(type, payload);
    switch (type) {
        case "loadMessages":
            return {
                ...state,
                messages: payload as MessageValueResponseInitializer[],
            };
        default:
            return state;
    }
};
