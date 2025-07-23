import {
    CREATE_STORY_FAILURE,
    CREATE_STORY_REQUEST,
    CREATE_STORY_SUCCESS,
    GET_PROFILE_PIC_SUCCESS,
    GET_PROFILE_REQUEST,
    GET_PROFILE_SUCCESS,
    GET_PROFILE_FAILURE,
    LOGIN_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    REGISTER_FAILURE,
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    SEARCH_USER_SUCCESS,
    SELF_STORY_SUCCESS,
    UPDATE_PROFILE_SUCCESS,
    USER_STORY_SUCCESS,
    USERS_FOR_STORY_SUCCESS,
    RESTORE_SESSION,
    CLEAR_SESSION
} from "./auth.action.type";

const initialState={
    jwt:null,
    error:null,
    loading:false,
    user:null,
    searchUser:[],
    story:null,
    My_story:[],
    users:[],
    usStory:[],
}
export const authReducer=(state=initialState,action)=>{
    switch (action.type) {
        case LOGIN_REQUEST:
        case REGISTER_REQUEST:
        case CREATE_STORY_REQUEST:
        case GET_PROFILE_REQUEST:
            return {...state,loading:true,error:null}

        case GET_PROFILE_SUCCESS:
        case UPDATE_PROFILE_SUCCESS:
            return {...state,user:action.payload,error:null,loading:false}
        case CREATE_STORY_SUCCESS:
            return{...state,story:action.payload,stories:[action.payload,...state.stories],My_story:[action.payload,...state.My_story],loading:false,error:null}
        case SELF_STORY_SUCCESS:
            return{...state,My_story:action.payload,loading:false,error:null}
        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            return {...state,jwt:action.payload,loading:false,error: null}
        case GET_PROFILE_PIC_SUCCESS:
            return{...state,user:action.payload,loading:false,error:null}
        case SEARCH_USER_SUCCESS:
            return {...state,searchUser:action.payload,loading:false,error:null}
        case USER_STORY_SUCCESS:
            return {...state,usStory:action.payload,loading:false,error:null}
        case USERS_FOR_STORY_SUCCESS:
            return {...state,users:action.payload,loading:false,error:null}
        case LOGIN_FAILURE:
        case CREATE_STORY_FAILURE:
        case REGISTER_FAILURE:
            return {...state,loading: false,error: action.payload}
        case GET_PROFILE_FAILURE:
            return {...state,loading: false,error: action.payload,jwt:null,user:null}
        case RESTORE_SESSION:
            return {...state,jwt:action.payload,error:null}
        case CLEAR_SESSION:
            return {...state,jwt:null,user:null,error:null,loading:false}
        default:
            return state;
    }
}