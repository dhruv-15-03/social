import { api, API_BASE_URL} from "../../config/api";
import axios from "axios"
import { GET_PROFILE_FAILURE, GET_PROFILE_PIC_FAILURE, GET_PROFILE_PIC_REQUEST, GET_PROFILE_PIC_SUCCESS, GET_PROFILE_REQUEST, GET_PROFILE_SUCCESS, LOGIN_FAILURE, LOGIN_SUCCESS, REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS, SEARCH_USER_FAILURE, SEARCH_USER_REQUEST, SEARCH_USER_SUCCESS, UPDATE_PROFILE_FAILURE, UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_SUCCESS} from "./auth.action.type";
export const loginUserAction=(loginData)=>async(dispatch)=>{
    try{
        const {data}=await axios.post(`${API_BASE_URL}/auth/login`,loginData.data)
        if(data.token){
            localStorage.setItem("jwt",data.token)
        }
        console.log("--Login")
        console.log(data)
        dispatch({type:LOGIN_SUCCESS,payload:data.jwt})
    }catch (error) {
        console.log(error)
        dispatch({type:LOGIN_FAILURE,payload:error})
    }
 }
export const registerUserAction=(loginData)=>async(dispatch)=>{
    dispatch({type:REGISTER_REQUEST})
    try{
        const {data}=await axios.post(`${API_BASE_URL}/auth/signup`,loginData.data)
        
        if(data.token){
            localStorage.setItem("jwt",data.token)
        }
        console.log("--Register--")
        console.log(data)
        dispatch({type:REGISTER_SUCCESS,payload:data.jwt})
    }catch (error) {
        console.log(error)
        dispatch({type:REGISTER_FAILURE,payload:error})
    }
}
export const getProfileAction=(jwt)=>async(dispatch)=>{
    dispatch({type:GET_PROFILE_REQUEST})
    try{
        const {data}=await api.get(`/api/user/profile`,
            {headers:{
                Authorization:`Bearer ${jwt}`,
            },
        }
        );
        dispatch({type:GET_PROFILE_SUCCESS,payload:data})
    }catch (error) {
        console.log("-----"+error)
        dispatch({type:GET_PROFILE_FAILURE,payload:error})
    }
        
}

export const updateProfileAction=(reqData)=>async(dispatch)=>{
    dispatch({type:UPDATE_PROFILE_REQUEST})
    try{
        const {data}=await api.put(`/api/user/update`,reqData
            
        );
        console.log("--Update Profile--")
        console.log(data)
        dispatch({type:UPDATE_PROFILE_SUCCESS,payload:data})
    }catch (error) {
        console.log("-----"+error)
        dispatch({type:UPDATE_PROFILE_FAILURE,payload:error})
    }
        
}

export const searchUser=(query)=>async(dispatch)=>{
    dispatch({type:SEARCH_USER_REQUEST})
    try{
        const {data}=await api.get(`/api/user/${query}`);
        console.log("-- Search User Profile--")
        console.log(data)
        dispatch({type:SEARCH_USER_SUCCESS,payload:data})
    }catch (error) {
        console.log(error)
        dispatch({type:SEARCH_USER_FAILURE,payload:error})
    }
        
}


export const updateProfPic=(user)=>async(dispatch)=>{
    dispatch({type:GET_PROFILE_PIC_REQUEST})
    try{
        const {data}=await api.put(`/api/user/profile`,user);
        console.log("-- Photu Uploaded--")
        console.log(data)
        dispatch({type:GET_PROFILE_PIC_SUCCESS,payload:data})
    }catch (error) {
        console.log("---Nahhhhhhhhhhh--"+error)
        dispatch({type:GET_PROFILE_PIC_FAILURE,payload:error})
    }
        
}

export const logoutAction = () => async(dispatch) => {
    localStorage.removeItem("jwt"); 
    dispatch({ type: 'LOGOUT' });
  };