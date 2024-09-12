import {  GET_FOLLOWING_SUCCESS, GET_POST_SUCCESS, GET_USERS_REELS_SUCCESS, GET_USERS_SUCCESS, PROFILE_REQUEST, PROFILE_SUCCESS } from "./profiletype"


const initialState={
    error:null,
    loading:false,
    user:null,
    following:[],
    posts:[],
    users:[],
    userReel:[]
}

export const profilereducer=(state=initialState,action)=>{
    switch (action.type){
        case PROFILE_REQUEST:
            return {...state,loading:true,error:null}
        
        case PROFILE_SUCCESS:
            return {...state,user:action.payload,loading:false,error:null}
        case GET_FOLLOWING_SUCCESS:
            return{...state,following:action.payload,loading:false,error:null}
        case GET_USERS_SUCCESS:
            return{...state,users:action.payload,loading:false,error:null}
        case GET_USERS_REELS_SUCCESS:
            return{...state,userReel:action.payload,loading:false,error:null}
        case GET_POST_SUCCESS:
            return {...state,posts:action.payload,loading:false,error:null}
        default:
            return state;
    }
}