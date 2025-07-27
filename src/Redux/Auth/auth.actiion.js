import { api, API_BASE_URL} from "../../config/api";
import axios from "axios"
import { createError, ErrorTypes } from "../../utils/errorHandler";
import { logger } from "../../utils/productionLogger";
import { CREATE_STORY_FAILURE, CREATE_STORY_REQUEST, CREATE_STORY_SUCCESS, GET_PROFILE_FAILURE, GET_PROFILE_PIC_FAILURE, GET_PROFILE_PIC_REQUEST, GET_PROFILE_PIC_SUCCESS, GET_PROFILE_REQUEST, GET_PROFILE_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS, SEARCH_USER_FAILURE, SEARCH_USER_REQUEST, SEARCH_USER_SUCCESS, SELF_STORY_FAILURE, SELF_STORY_REQUEST, SELF_STORY_SUCCESS, UPDATE_PROFILE_FAILURE, UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_SUCCESS, USER_STORY_FAILURE, USER_STORY_REQUEST, USER_STORY_SUCCESS, USERS_FOR_STORY_FAILURE, USERS_FOR_STORY_REQUEST, USERS_FOR_STORY_SUCCESS, CLEAR_SESSION } from "./auth.action.type";

/**
 * Simplified session restoration for production safety
 */
export const restoreSessionAction = () => async (dispatch) => {
    try {
        const jwt = localStorage.getItem('jwt');
        
        if (jwt && jwt.length > 10) {
            logger.auth.info('Restoring session from localStorage');
            dispatch({ type: 'RESTORE_SESSION', payload: jwt });
            
            // Try to get profile
            try {
                await dispatch(getProfileAction(jwt));
                logger.auth.info('Session restored successfully');
            } catch (profileError) {
                logger.auth.error('Profile fetch failed:', profileError);
                
                // Only clear session for auth errors
                if (profileError?.response?.status === 401 || profileError?.response?.status === 403) {
                    logger.auth.warn('Invalid token, clearing session');
                    dispatch(clearSessionAction());
                }
            }
        } else {
            logger.auth.info('No valid JWT found');
        }
    } catch (error) {
        logger.auth.error('Session restoration failed:', error);
        dispatch(clearSessionAction());
    }
};

export const clearSessionAction = () => (dispatch) => {
    logger.auth.logout('Clearing session');
    localStorage.removeItem('jwt');
    dispatch({ type: CLEAR_SESSION });
};

export const loginUserAction = (loginData) => async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });
    try {
        logger.auth.login('Attempting login...');
        const { data } = await axios.post(`${API_BASE_URL}/auth/login`, loginData.data, {
            timeout: 15000,
        });
        
        if (data.token) {
            localStorage.setItem('jwt', data.token);
            logger.auth.login('Login successful, token stored');
        }
        
        dispatch({ type: LOGIN_SUCCESS, payload: data.token });
        
        // Fetch profile after successful login
        if (data.token) {
            try {
                await dispatch(getProfileAction(data.token));
                logger.auth.login('Login completed successfully with profile data');
                
                // Navigate to home page after successful authentication
                setTimeout(() => {
                    window.location.href = '/';
                }, 100);
            } catch (profileError) {
                logger.auth.warn('Profile fetch failed after login, but login was successful');
            }
        }
        
        return data;
    } catch (error) {
        logger.auth.error('Login failed:', error);
        const appError = createError(error, ErrorTypes.AUTHENTICATION);
        dispatch({ type: LOGIN_FAILURE, payload: appError.userMessage });
        throw appError;
    }
};
export const registerUserAction = (registerData) => async (dispatch) => {
    dispatch({ type: REGISTER_REQUEST });
    try {
        logger.auth.register('Attempting registration...');
        const { data } = await axios.post(`${API_BASE_URL}/auth/signup`, registerData.data, {
            timeout: 15000,
        });
        
        if (data.token) {
            localStorage.setItem('jwt', data.token);
            logger.auth.register('Registration successful, token stored');
        }
        
        dispatch({ type: REGISTER_SUCCESS, payload: data.token });
        
        // Fetch profile after successful registration
        if (data.token) {
            try {
                await dispatch(getProfileAction(data.token));
                logger.auth.register('Registration completed successfully with profile data');
                
                // Navigate to home page after successful registration
                setTimeout(() => {
                    window.location.href = '/';
                }, 100);
            } catch (profileError) {
                logger.auth.warn('Profile fetch failed after registration, but registration was successful');
            }
        }
        
        return data;
    } catch (error) {
        logger.auth.error('Registration failed:', error);
        const appError = createError(error, ErrorTypes.AUTHENTICATION);
        dispatch({ type: REGISTER_FAILURE, payload: appError.userMessage });
        throw appError;
    }
};
export const getProfileAction = (jwt) => async (dispatch) => {
    dispatch({ type: GET_PROFILE_REQUEST });
    
    try {
        // Basic JWT validation
        if (!jwt || typeof jwt !== 'string' || jwt.length < 10) {
            throw new Error('Invalid JWT token format');
        }

        logger.auth.profile('Fetching user profile...');
        
        const { data } = await api.get(`/api/user/profile`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            timeout: 15000,
        });
        
        logger.auth.profile('Profile fetched successfully');
        dispatch({ type: GET_PROFILE_SUCCESS, payload: data });
        return data;
        
    } catch (error) {
        logger.auth.error('Profile fetch failed:', error);
        
        const appError = createError(error);
        
        // Handle different types of errors
        if (appError.type === 'AUTH_ERROR') {
            logger.auth.warn('Authentication error, clearing session');
            localStorage.removeItem('jwt');
            dispatch({ type: CLEAR_SESSION });
        } else if (appError.type === 'SERVER_ERROR') {
            logger.auth.warn('Server error during profile fetch, keeping session');
        } else if (appError.type === 'NETWORK_ERROR') {
            logger.auth.warn('Network error during profile fetch, keeping session');
        }
        
        dispatch({ type: GET_PROFILE_FAILURE, payload: appError.userMessage });
        throw appError;
    }
};

export const updateProfileAction=(reqData)=>async(dispatch)=>{
    dispatch({type:UPDATE_PROFILE_REQUEST})
    try{
        const {data}=await api.put(`/api/user/update`,reqData
            
        );
        dispatch({type:UPDATE_PROFILE_SUCCESS,payload:data})
    }catch (error) {

        dispatch({type:UPDATE_PROFILE_FAILURE,payload:error})
    }
        
}

export const searchUser=(query)=>async(dispatch)=>{
    dispatch({type:SEARCH_USER_REQUEST})
    try{
        const {data}=await api.get(`/api/user/${query}`);
        dispatch({type:SEARCH_USER_SUCCESS,payload:data})
    }catch (error) {

        dispatch({type:SEARCH_USER_FAILURE,payload:error})
    }
        
}


export const updateProfPic=(user)=>async(dispatch)=>{
    dispatch({type:GET_PROFILE_PIC_REQUEST})
    try{
        const {data}=await api.put(`/api/user/profile`,user);
        dispatch({type:GET_PROFILE_PIC_SUCCESS,payload:data})
    }catch (error) {

        dispatch({type:GET_PROFILE_PIC_FAILURE,payload:error})
    }
        
}

export const logoutAction = () => async (dispatch) => {
    try {
        logger.auth.logout('Logout initiated');
        localStorage.removeItem('jwt');
        dispatch({ type: CLEAR_SESSION });
        logger.auth.logout('Logout completed successfully');
    } catch (error) {
        logger.auth.error('Logout error:', error);
        // Force cleanup even if there's an error
        localStorage.removeItem('jwt');
        dispatch({ type: CLEAR_SESSION });
    }
};


export const createStoryAction=(reqData)=>async(dispatch)=>{
    dispatch({type:CREATE_STORY_REQUEST})
    try {
        const {data}=await api.post("/api/story/new",reqData)
        dispatch({type:CREATE_STORY_SUCCESS,payload:data})
    } catch (error) {
        dispatch({type:CREATE_STORY_FAILURE,payload:error})

    }
};
export const authStory=()=>async(dispatch)=>{
    dispatch({type:SELF_STORY_REQUEST})
    try{
        const {data}=await api.get(`/api/story/self`);
        dispatch({type:SELF_STORY_SUCCESS,payload:data})
    }catch (error) {

        dispatch({type:SELF_STORY_FAILURE,payload:error})
    }
        
}

export const users=()=>async(dispatch)=>{
    dispatch({type:USERS_FOR_STORY_REQUEST})
    try{
        const {data}=await api.get(`/api/story/users`);
        dispatch({type:USERS_FOR_STORY_SUCCESS,payload:data})
    }catch (error) {

        dispatch({type:USERS_FOR_STORY_FAILURE,payload:error})
    }
        
}

export const getUser=(userID)=>async(dispatch)=>{
    dispatch({type:USER_STORY_REQUEST})
    try{
        const {data}=await api.get(`/api/story/getUser/${userID}`);
        dispatch({type:USER_STORY_SUCCESS,payload:data})
    }catch (error) {

        dispatch({type:USER_STORY_FAILURE,payload:error})
    }
        
}
