import {applyMiddleware, combineReducers, legacy_createStore} from "redux";
import {thunk} from "redux-thunk";
import {authReducer} from "./Auth/authReducer";
import { postReducer } from "./Post/Post.Reducer";
import { messageReducer } from "./Messages/Message.reducer";
import { profilereducer } from "./Profile/profilereducer";

const rootReducers=combineReducers({
auth:authReducer,
post:postReducer,
message:messageReducer,
profile:profilereducer
})
export const store=legacy_createStore(rootReducers,applyMiddleware(thunk))