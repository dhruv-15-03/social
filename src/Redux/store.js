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

// Optimized middleware for development
const middleware = [thunk];
if (process.env.NODE_ENV === 'development') {
  // Skip Redux DevTools extension in development for faster loading
  // It can be manually enabled via browser extension if needed
}

export const store=legacy_createStore(rootReducers,applyMiddleware(...middleware))