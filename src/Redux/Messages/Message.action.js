import { api } from "../../config/api"
import { CREATE_CHAT_FAILURE, CREATE_CHAT_REQUEST, CREATE_CHAT_SUCCESS, CREATE_MESSAGE_FAILURE, CREATE_MESSAGE_REQUEST, CREATE_MESSAGE_SUCCESS, GET_ALL_CHATS_FAILURE, GET_ALL_CHATS_REQUEST, GET_ALL_CHATS_SUCCESS } from "./Message.actionType"

export const createMessage=(reqData)=>async(dispatch)=>{
    dispatch({type:CREATE_MESSAGE_REQUEST})
    try {
        const {data}=await api.post(`/api/message/new/${reqData.message.chatId}`,reqData.message);
        reqData.sendMessageToServer(data)
        console.log("create success of message ")
        dispatch({type:CREATE_MESSAGE_SUCCESS,payload:data})
        
    } catch (error) {
        console.log(error + "catched error")
        dispatch({
            type:CREATE_MESSAGE_FAILURE,payload:error
        });
    }
}

export const createChat=(userId)=>async(dispatch)=>{
    dispatch({type:CREATE_CHAT_REQUEST})
    try {
        const {data}=await api.post(`/api/chat/new/${userId}`);
        console.log("create success of chat ")
        dispatch({type:CREATE_CHAT_SUCCESS,payload:data})
        
    } catch (error) {
        console.log(error + "catched error")
        dispatch({
            type:CREATE_CHAT_FAILURE,payload:error
        });
    }
}

export const getAllChats=()=>async(dispatch)=>{
    dispatch({type:GET_ALL_CHATS_REQUEST})
    try {
        const {data}=await api.get(`/api/chat/findAll`);
        console.log("Got all chat ",data)
        dispatch({type:GET_ALL_CHATS_SUCCESS,payload:data})
        
    } catch (error) {
        console.log(error + "catched error in getting chats")
        dispatch({
            type:GET_ALL_CHATS_FAILURE,payload:error
        });
    }
}
