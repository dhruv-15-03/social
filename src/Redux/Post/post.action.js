import { api } from "../../config/api";
import { CREATE_COMMENT_FAILURE, CREATE_COMMENT_REQUEST, CREATE_COMMENT_SUCCESS, CREATE_POST_FAILURE, CREATE_POST_REQUEST, CREATE_POST_SUCCESS, DELETE_POST_FAILURE, DELETE_POST_REQUEST, DELETE_POST_SUCCESS, GET_ALL_POST_FAILURE, GET_ALL_POST_REQUEST, GET_ALL_POST_SUCCESS, GET_USER_POST_FAILURE, GET_USER_POST_REQUEST, GET_USER_POST_SUCCESS, LIKE_POST_FAILURE, LIKE_POST_REQUEST, LIKE_POST_SUCCESS, LIKED_POST_FAILURE, LIKED_POST_REQUEST, LIKED_POST_SUCCESS, REELS_FAILURE, REELS_REQUEST, REELS_SUCCESS, SAVE_POST_FAILURE, SAVE_POST_REQUEST, SAVE_POST_SUCCESS, SAVED_POST_FAILURE, SAVED_POST_REQUEST, SAVED_POST_SUCCESS } from "./Post.ActionType"

export const createPostAction=(postData)=>async(dispatch)=>{
    dispatch({type:CREATE_POST_REQUEST})
    try {
        const {data}=await api.post("/api/post/new",postData)
        dispatch({type:CREATE_POST_SUCCESS,payload:data})
        console.log("created post",data)
    } catch (error) {
        dispatch({type:CREATE_POST_FAILURE,payload:error})
        console.log(error)
    }
};

export const getAllPostAction=()=>async(dispatch)=>{
    dispatch({type:GET_ALL_POST_REQUEST})
    try {
        const {data}=await api.get("/api/post/getAll")
        dispatch({type:GET_ALL_POST_SUCCESS,payload:data})
    } catch (error) {
        dispatch({type:GET_ALL_POST_FAILURE,payload:error})
    }
};
export const getUsersAction=()=>async(dispatch)=>{
    dispatch({type:GET_USER_POST_REQUEST})
    try {
        const {data}=await api.get(`/api/post/user`)
        dispatch({type:GET_USER_POST_SUCCESS,payload:data})
    } catch (error) {
        dispatch({type:GET_USER_POST_FAILURE,payload:error})
    }
};
export const likePostAction=(postId)=>async(dispatch)=>{
    dispatch({type:LIKE_POST_REQUEST})
    try {
        const {data}=await api.get(`/api/post/like/${postId}`)
        dispatch({type:LIKE_POST_SUCCESS,payload:data})
    } catch (error) {
        dispatch({type:LIKE_POST_FAILURE,payload:error})
    }
};

export const createCommentAction=(reqData)=>async(dispatch)=>{
    dispatch({type:CREATE_COMMENT_REQUEST})
    try {
        const {data}=await api.post(`/api/post/comment/${reqData.postId}`,reqData.data)
        dispatch({type:CREATE_COMMENT_SUCCESS,payload:data})
    } catch (error) {
        dispatch({type:CREATE_COMMENT_FAILURE,payload:error})
    }
};
export const likedPostAction=()=>async(dispatch)=>{
    dispatch({type:LIKED_POST_REQUEST})
    try {
        const {data}=await api.get(`/api/post/liked`)
        dispatch({type:LIKED_POST_SUCCESS,payload:data})
    } catch (error) {
        dispatch({type:LIKED_POST_FAILURE,payload:error})
    }
};
export const savePostAction=(postId)=>async(dispatch)=>{
    dispatch({type:SAVE_POST_REQUEST})
    try {
        const {data}=await api.get(`/api/post/save/${postId}`)
        dispatch({type:SAVE_POST_SUCCESS,payload:data})
    } catch (error) {
        dispatch({type:SAVE_POST_FAILURE,payload:error})
    }
};
export const savedPostAction=()=>async(dispatch)=>{
    dispatch({type:SAVED_POST_REQUEST})
    try {
        const {data}=await api.get(`/api/post/saved`)
        dispatch({type:SAVED_POST_SUCCESS,payload:data})
    } catch (error) {
        dispatch({type:SAVED_POST_FAILURE,payload:error})
    }
};

export const deletePostAction=(postId)=>async(dispatch)=>{
    dispatch({type:DELETE_POST_REQUEST})
    try {
        const {data}=await api.delete(`/api/post/delete/${postId}`)
        dispatch({type:DELETE_POST_SUCCESS,payload:data})
    } catch (error) {
        dispatch({type:DELETE_POST_FAILURE,payload:error})
    }
};

export const reels=()=>async(dispatch)=>{
    dispatch({type:REELS_REQUEST})
    try {
        const {data}=await api.get(`/api/post/reels`)
        dispatch({type:REELS_SUCCESS,payload:data})
        console.log("reels......",data)
    } catch (error) {
        dispatch({type:REELS_FAILURE,payload:error})
        console.log("Error in reels", error)
    }
};