import { api} from "../../config/api";
import { GET_FOLLOW_FAILURE, GET_FOLLOW_REQUEST, GET_FOLLOW_SUCCESS, GET_FOLLOWERS_FAILURE, GET_FOLLOWERS_REQUEST, GET_FOLLOWERS_SUCCESS, GET_FOLLOWING_FAILURE, GET_FOLLOWING_REQUEST, GET_FOLLOWING_SUCCESS, GET_POST_FAILURE, GET_POST_REQUEST, GET_POST_SUCCESS, GET_USERS_FAILURE, GET_USERS_REELS_FAILURE, GET_USERS_REELS_REQUEST, GET_USERS_REELS_SUCCESS, GET_USERS_REQUEST, GET_USERS_SUCCESS, PROFILE_FAILURE, PROFILE_REQUEST, PROFILE_SUCCESS } from "./profiletype";

export const userPro=(userId)=>async(dispatch)=>{
    dispatch({type:PROFILE_REQUEST})
    try{
        const {data}=await api.get(`/api/user/getUser/${userId}`);
        console.log("Profile Founded")
        console.log(data)
        dispatch({type:PROFILE_SUCCESS,payload:data})
    }catch (error) {
        console.log("---PROFFFF--"+error)
        dispatch({type:PROFILE_FAILURE,payload:error})
    }
        
}
export const getFollowing=(userId)=>async(dispatch)=>{
    dispatch({type:GET_FOLLOWING_REQUEST})
    try{
        const {data}=await api.get(`/api/user/getFollowing/${userId}`);
        console.log("FOLLOwing list......",data)
        dispatch({type:GET_FOLLOWING_SUCCESS,payload:data})
    }catch (error) {
        console.log("---FWING--"+error)
        dispatch({type:GET_FOLLOWING_FAILURE,payload:error})
    }
        
}
export const getFollowers=(userId)=>async(dispatch)=>{
    dispatch({type:GET_FOLLOWERS_REQUEST})
    try{
        const {data}=await api.get(`/api/user/getFollowers/${userId}`);
        console.log("FOLLOwers list......",data)
        dispatch({type:GET_FOLLOWERS_SUCCESS,payload:data})
    }catch (error) {
        console.log(error)
        dispatch({type:GET_FOLLOWERS_FAILURE,payload:error})
    }
        
}

export const getPost=(userId)=>async(dispatch)=>{
    dispatch({type:GET_POST_REQUEST})
    try{
        const {data}=await api.get(`/api/user/postAll/${userId}`);
        console.log("POSTS.,,,,,,,,,,",data)
        dispatch({type:GET_POST_SUCCESS,payload:data})
    }catch (error) {
        console.log("---post--"+error)
        dispatch({type:GET_POST_FAILURE,payload:error})
    }
        
}

export const getUsers=()=>async(dispatch)=>{
    dispatch({type:GET_USERS_REQUEST})
    try{
        const {data}=await api.get(`/api/user/userAll`);
        dispatch({type:GET_USERS_SUCCESS,payload:data})
    }catch (error) {
        dispatch({type:GET_USERS_FAILURE,payload:error})
    }
        
}

export const userReels=(id)=>async(dispatch)=>{
    dispatch({type:GET_USERS_REELS_REQUEST})
    try{
        const {data}=await api.get(`/api/post/userReels/${id}`);
        dispatch({type:GET_USERS_REELS_SUCCESS,payload:data})
        console.log(data,'in user Reels')
    }catch (error) {
        dispatch({type:GET_USERS_REELS_FAILURE,payload:error})
        console.log('In user Reels',error)
    }
        
}

export const follow=(id)=>async(dispatch)=>{
    dispatch({type:GET_FOLLOW_REQUEST})
    try{
        const {data}=await api.get(`/api/user/follow/${id}`);
        dispatch({type:GET_FOLLOW_SUCCESS,payload:data})
        console.log("Following")
    }catch (error) {
        dispatch({type:GET_FOLLOW_FAILURE,payload:error})
        console.log('In follow',error)
    }
        
}