import { api } from "../../config/api"
import { CREATE_CHAT_FAILURE, CREATE_CHAT_REQUEST, CREATE_CHAT_SUCCESS, CREATE_MESSAGE_FAILURE, CREATE_MESSAGE_REQUEST, CREATE_MESSAGE_SUCCESS, GET_ALL_CHATS_FAILURE, GET_ALL_CHATS_REQUEST, GET_ALL_CHATS_SUCCESS } from "./Message.actionType"

import { LIKE_MESSAGE_REQUEST, LIKE_MESSAGE_SUCCESS, LIKE_MESSAGE_FAILURE } from "./Message.actionType"

export const createMessage=(reqData)=>async(dispatch)=>{
    dispatch({type:CREATE_MESSAGE_REQUEST})
    try {
        const {data}=await api.post(`/api/message/new/${reqData.message.chatId}`,reqData.message);
        
        
        if (reqData.sendMessageToServer && typeof reqData.sendMessageToServer === 'function') {
            reqData.sendMessageToServer(data);
        } else {
            // Handle case where sendMessageToServer is not provided
        }
        
        dispatch({type:CREATE_MESSAGE_SUCCESS,payload:data})
        
    } catch (error) {
        dispatch({
            type:CREATE_MESSAGE_FAILURE,payload:error
        });
    }
}

export const createChat=(userId)=>async(dispatch)=>{
    dispatch({type:CREATE_CHAT_REQUEST})
    try {
        const {data}=await api.post(`/api/chat/new/${userId}`);
        dispatch({type:CREATE_CHAT_SUCCESS,payload:data})
        
    } catch (error) {

        dispatch({
            type:CREATE_CHAT_FAILURE,payload:error
        });
    }
}

export const getAllChats=()=>async(dispatch)=>{
    dispatch({type:GET_ALL_CHATS_REQUEST})
    try {
        const {data}=await api.get(`/api/chat/findAll`);
        dispatch({type:GET_ALL_CHATS_SUCCESS,payload:data})
        
    } catch (error) {
        dispatch({
            type:GET_ALL_CHATS_FAILURE,payload:error
        });
    }
}

export const likeMessage = ({ chatId, messageId }) => async (dispatch) => {
    dispatch({ type: LIKE_MESSAGE_REQUEST });
    try {
        const { data } = await api.get(`/api/message/like/${chatId},${messageId}`);
        dispatch({ type: LIKE_MESSAGE_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: LIKE_MESSAGE_FAILURE, payload: error });
    }
}
