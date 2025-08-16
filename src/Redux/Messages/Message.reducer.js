import { CREATE_CHAT_SUCCESS, CREATE_MESSAGE_SUCCESS, CREATE_MESSAGE_REQUEST, CREATE_MESSAGE_FAILURE, GET_ALL_CHATS_SUCCESS, LIKE_MESSAGE_REQUEST, LIKE_MESSAGE_SUCCESS, LIKE_MESSAGE_FAILURE } from "./Message.actionType";

const initialState={
    messages:[],
    chats:[],
    loading:false,
    error:null,
    message:null
}
export const messageReducer=(state=initialState,action)=>{
    switch (action.type) {
        case CREATE_MESSAGE_REQUEST:
            return {...state, loading: true, error: null};
            
        case CREATE_MESSAGE_SUCCESS:
            
            const newMessage = action.payload;
            const updatedChats = state.chats.map(chat => {
                if (chat.chatId === newMessage.chatId) {
                    
                    const updatedChat = {
                        ...chat,
                        message: [...(chat.message || []), newMessage]
                    };
                    return updatedChat;
                }
                return chat;
            });
            
            const newState = {
                ...state,
                loading: false,
                message: newMessage,
                chats: updatedChats
            };
            return newState;
            
        case CREATE_MESSAGE_FAILURE:
            return {...state, loading: false, error: action.payload};

        case LIKE_MESSAGE_REQUEST:
            return { ...state, loading: true, error: null };

        case LIKE_MESSAGE_SUCCESS:
            const updatedMessage = action.payload; 
            const chatsAfterLike = state.chats.map(chat => {
                if (chat.chatId === updatedMessage.chatId) {
                    const updatedMessages = (chat.message || []).map(m => {
                        if (m.id === updatedMessage.id || m._id === updatedMessage._id) {
                            return updatedMessage;
                        }
                        return m;
                    });
                    return { ...chat, message: updatedMessages };
                }
                return chat;
            });
            return { ...state, loading: false, message: updatedMessage, chats: chatsAfterLike };

        case LIKE_MESSAGE_FAILURE:
            return { ...state, loading: false, error: action.payload };
            
        case CREATE_CHAT_SUCCESS:
            return {...state,chats:[action.payload,...state.chats]}  
        case GET_ALL_CHATS_SUCCESS:
            return {...state,chats:action.payload}
        default:
            return state;
    }
}