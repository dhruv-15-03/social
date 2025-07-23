import { useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { follow } from '../Redux/Profile/profileaction';

export const useFollowState = (userId) => {
  const dispatch = useDispatch();
  const { auth, profile } = useSelector(store => store);
  const [isLoading, setIsLoading] = useState(false);

  // Check if current user follows this user
  const isFollowing = useMemo(() => {
    if (!profile.following || !auth?.user?.id) return false;
    return profile.following.some(user => user.id === userId);
  }, [profile.following, auth?.user?.id, userId]);

  const toggleFollow = useCallback(async () => {
    if (isLoading || !userId) return;
    
    setIsLoading(true);
    try {
      await dispatch(follow(userId));
      return true;
    } catch (error) {
      console.error('Follow action failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, userId, isLoading]);

  return {
    isFollowing,
    isLoading,
    toggleFollow
  };
};

export default useFollowState;
