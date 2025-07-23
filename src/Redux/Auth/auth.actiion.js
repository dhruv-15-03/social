import { api, API_BASE_URL} from "../../config/api";
import axios from "axios"
import envConfig from "../../config/environment";
import { CREATE_STORY_FAILURE, CREATE_STORY_REQUEST, CREATE_STORY_SUCCESS, GET_PROFILE_FAILURE, GET_PROFILE_PIC_FAILURE, GET_PROFILE_PIC_REQUEST, GET_PROFILE_PIC_SUCCESS, GET_PROFILE_REQUEST, GET_PROFILE_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS, SEARCH_USER_FAILURE, SEARCH_USER_REQUEST, SEARCH_USER_SUCCESS, SELF_STORY_FAILURE, SELF_STORY_REQUEST, SELF_STORY_SUCCESS, UPDATE_PROFILE_FAILURE, UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_SUCCESS, USER_STORY_FAILURE, USER_STORY_REQUEST, USER_STORY_SUCCESS, USERS_FOR_STORY_FAILURE, USERS_FOR_STORY_REQUEST, USERS_FOR_STORY_SUCCESS, RESTORE_SESSION, CLEAR_SESSION } from "./auth.action.type";

export const restoreSessionAction = () => (dispatch) => {
    try {
        const jwt = localStorage.getItem(envConfig.auth.storageKey);
        if (jwt) {
            console.log('🔄 Restoring session from localStorage');
            dispatch({ type: RESTORE_SESSION, payload: jwt });
            dispatch(getProfileAction(jwt));
        }
    } catch (error) {
        console.error('❌ Failed to restore session:', error);
        dispatch(clearSessionAction());
    }
};

export const clearSessionAction = () => (dispatch) => {
    console.log('🔓 Clearing session');
    localStorage.removeItem(envConfig.auth.storageKey);
    dispatch({ type: CLEAR_SESSION });
};

export const loginUserAction=(loginData)=>async(dispatch)=>{
    dispatch({type:LOGIN_REQUEST})
    try{
        console.log('🔐 Attempting login...');
        const {data}=await axios.post(`${API_BASE_URL}/auth/login`,loginData.data)
        
        if(data.token){
            localStorage.setItem(envConfig.auth.storageKey, data.token)
            console.log('✅ Login successful, token stored');
        }
        
        dispatch({type:LOGIN_SUCCESS,payload:data.token})
        
        if(data.token) {
            dispatch(getProfileAction(data.token));
        }
        
        return data;
    }catch (error) {
        console.error('❌ Login failed:', error);
        dispatch({type:LOGIN_FAILURE,payload:error})
        throw error; // Re-throw for component handling
    }
 }
export const registerUserAction=(loginData)=>async(dispatch)=>{
    dispatch({type:REGISTER_REQUEST})
    try{
        console.log('📝 Attempting registration...');
        const {data}=await axios.post(`${API_BASE_URL}/auth/signup`,loginData.data)
        
        if(data.token){
            // Use environment config for storage key
            localStorage.setItem(envConfig.auth.storageKey, data.token)
            console.log('✅ Registration successful, token stored');
        }
        
        dispatch({type:REGISTER_SUCCESS,payload:data.token})
        
        // Immediately fetch user profile after successful registration
        if(data.token) {
            dispatch(getProfileAction(data.token));
        }
        
        return data;
    }catch (error) {
        console.error('❌ Registration failed:', error);
        dispatch({type:REGISTER_FAILURE,payload:error})
        throw error; // Re-throw for component handling
    }
}
export const getProfileAction=(jwt)=>async(dispatch)=>{
    dispatch({type:GET_PROFILE_REQUEST})
    try{
        console.log('👤 Fetching user profile...');
        const {data}=await api.get(`/api/user/profile`,
            {headers:{
                Authorization:`Bearer ${jwt}`,
            },
        }
        );
        console.log('✅ Profile fetched successfully');
        dispatch({type:GET_PROFILE_SUCCESS,payload:data})
        return data;
    }catch (error) {
        console.error('❌ Profile fetch failed:', error);
        
        // If token is invalid, clear session
        if (error.response?.status === 401 || error.response?.status === 403) {
            console.log('🔐 Invalid token, clearing session');
            dispatch(clearSessionAction());
        }
        
        dispatch({type:GET_PROFILE_FAILURE,payload:error})
        throw error;
    }
        
}

export const updateProfileAction=(reqData)=>async(dispatch)=>{
    dispatch({type:UPDATE_PROFILE_REQUEST})
    try{
        const {data}=await api.put(`/api/user/update`,reqData
            
        );
        dispatch({type:UPDATE_PROFILE_SUCCESS,payload:data})
    }catch (error) {
        console.log(error)
        dispatch({type:UPDATE_PROFILE_FAILURE,payload:error})
    }
        
}

export const searchUser=(query)=>async(dispatch)=>{
    dispatch({type:SEARCH_USER_REQUEST})
    try{
        const {data}=await api.get(`/api/user/${query}`);
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
        dispatch({type:GET_PROFILE_PIC_SUCCESS,payload:data})
    }catch (error) {
        console.log(error)
        dispatch({type:GET_PROFILE_PIC_FAILURE,payload:error})
    }
        
}

export const logoutAction = () => async(dispatch) => {
    localStorage.removeItem("jwt"); 
    dispatch({ type: 'LOGOUT' });
  };


export const createStoryAction=(reqData)=>async(dispatch)=>{
    dispatch({type:CREATE_STORY_REQUEST})
    try {
        const {data}=await api.post("/api/story/new",reqData)
        dispatch({type:CREATE_STORY_SUCCESS,payload:data})
    } catch (error) {
        dispatch({type:CREATE_STORY_FAILURE,payload:error})
        console.log(error)
    }
};
export const authStory=()=>async(dispatch)=>{
    dispatch({type:SELF_STORY_REQUEST})
    try{
        const {data}=await api.get(`/api/story/self`);
        dispatch({type:SELF_STORY_SUCCESS,payload:data})
    }catch (error) {
        console.log(error)
        dispatch({type:SELF_STORY_FAILURE,payload:error})
    }
        
}

export const users=()=>async(dispatch)=>{
    dispatch({type:USERS_FOR_STORY_REQUEST})
    try{
        const {data}=await api.get(`/api/story/users`);
        dispatch({type:USERS_FOR_STORY_SUCCESS,payload:data})
    }catch (error) {
        console.log(error)
        dispatch({type:USERS_FOR_STORY_FAILURE,payload:error})
    }
        
}

export const getUser=(userID)=>async(dispatch)=>{
    dispatch({type:USER_STORY_REQUEST})
    try{
        const {data}=await api.get(`/api/story/getUser/${userID}`);
        dispatch({type:USER_STORY_SUCCESS,payload:data})
    }catch (error) {
        console.log(error)
        dispatch({type:USER_STORY_FAILURE,payload:error})
    }
        
}