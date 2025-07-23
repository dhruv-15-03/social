import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { authReducer } from './Auth/authReducer';
import { postReducer } from './Post/Post.Reducer';
import { messageReducer } from './Messages/Message.reducer';
import { profilereducer } from './Profile/profilereducer';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: ['post', 'message'] // Don't persist these for performance
};

const rootReducer = combineReducers({
  auth: authReducer,
  post: postReducer,
  message: messageReducer,
  profile: profilereducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);
