import { CREATE_COMMENT_SUCCESS, CREATE_POST_FAILURE, CREATE_POST_REQUEST, CREATE_POST_SUCCESS, DELETE_POST_SUCCESS, GET_ALL_POST_FAILURE, GET_ALL_POST_REQUEST, GET_ALL_POST_SUCCESS, GET_USER_POST_SUCCESS, LIKE_POST_FAILURE, LIKE_POST_REQUEST, LIKE_POST_SUCCESS, LIKED_POST_SUCCESS, REELS_SUCCESS, SAVE_POST_FAILURE, SAVE_POST_REQUEST, SAVE_POST_SUCCESS, SAVED_POST_SUCCESS } from "./Post.ActionType";

const initialState={
    post:null,
    loading:false,
    error:null,
    posts:[],
    like:null,
    comments:[],
    newComment:null,
    liked:[],
    userPost:[],
    save:null,
    saved:[],
    reels:[],
}

export const postReducer=(state=initialState,action)=>{
    switch (action.type) {
        case CREATE_POST_REQUEST:
        case GET_ALL_POST_REQUEST:
        case LIKE_POST_REQUEST:
        case SAVE_POST_REQUEST:
            return {...state,error:null,loading:false};

        case CREATE_POST_SUCCESS:
            return {
                ...state,post:action.payload,posts:[action.payload,...state.posts],loading:false,error:null
            };
        case DELETE_POST_SUCCESS:
            return{
                ...state,
                posts: state.posts.filter(post => post.id !== action.payload),
                loading:false,
                error:null
        }
        case GET_ALL_POST_SUCCESS:
            return{
                ...state,
                posts:action.payload,
                comments:action.payload.comments,
                loading:false,
                error:null
            };
        case LIKED_POST_SUCCESS:
            return{
                ...state,
                liked:action.payload,
                loading:false,
                error:null
            }
        case REELS_SUCCESS:
            return{
                ...state,
                reels:action.payload,
                loading:false,
                error:null
            }
        case SAVED_POST_SUCCESS:
            return{
                ...state,
                saved:action.payload,
                loading:false,
                error:null
            }
        case GET_USER_POST_SUCCESS:
            return{
                ...state,
                userPost:action.payload,
                loading:false,
                error:null
            }
        case LIKE_POST_SUCCESS:
            return{
                ...state,
                like:action.payload,
                posts:state.posts.map((item)=>item.id===action.payload.id?action.payload:item),
                loading:false,
                error:null
            };
        case SAVE_POST_SUCCESS:
            return{
                ...state,
                save:action.payload,
                posts:state.posts.map((item)=>item.id===action.payload.id?action.payload:item),
                loading:false,
                error:null
            };
        case CREATE_COMMENT_SUCCESS:
            return {
                ...state,
                newComment:action.payload,
                loading:false,
                error:null
            };
        case CREATE_POST_FAILURE:
        case GET_ALL_POST_FAILURE:
        case LIKE_POST_FAILURE:
        case SAVE_POST_FAILURE:
            return {
                ...state,error:action.payload,loading:false
            };
        default:
           return state;
    }

}