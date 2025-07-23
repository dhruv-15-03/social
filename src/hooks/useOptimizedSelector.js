import { useSelector, shallowEqual } from 'react-redux';

export const useOptimizedSelector = (selector, deps = []) => {
  return useSelector(selector, shallowEqual);
};

export const selectAuth = (state) => state.auth;
export const selectPosts = (state) => state.post.posts;
export const selectProfile = (state) => state.profile;
export const selectMessages = (state) => state.message;

export const useAuthUser = () => useOptimizedSelector(state => state.auth.user);
export const usePostsList = () => useOptimizedSelector(selectPosts);
export const useProfileData = () => useOptimizedSelector(selectProfile);
