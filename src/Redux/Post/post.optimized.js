

import { api } from "../../config/api"
import { apiDeduplicator } from "../../utils/ApiDeduplicator"
import {
  GET_ALL_POST_REQUEST,
  GET_ALL_POST_SUCCESS,
  GET_ALL_POST_FAILURE,
  LIKE_POST_REQUEST,
  LIKE_POST_SUCCESS,
  LIKE_POST_FAILURE,
  LIKED_POST_REQUEST,
  LIKED_POST_SUCCESS,
  LIKED_POST_FAILURE,
  SAVED_POST_REQUEST,
  SAVED_POST_SUCCESS,
  SAVED_POST_FAILURE
} from "./Post.ActionType"

export const getAllPostActionOptimized = (page = 0, refresh = false) => async (dispatch, getState) => {
  const key = `posts-all-${page}`
  
  if (refresh) {
    apiDeduplicator.invalidate(/^posts-all/i)
  }
  
  try {
    const result = await apiDeduplicator.dedupe(
      key,
      async () => {
        dispatch({ type: GET_ALL_POST_REQUEST })
        
        const { data } = await api.get(`/api/post/getAll?page=${page}`)
        
        dispatch({ type: GET_ALL_POST_SUCCESS, payload: data })
        return data
      },
      2 * 60 * 1000 // 2 minutes cache for posts
    )
    
    return result
  } catch (error) {
    dispatch({ type: GET_ALL_POST_FAILURE, payload: error })
    throw error
  }
}

export const likePostActionOptimized = (postId) => async (dispatch, getState) => {
  const key = `like-post-${postId}`
  
  try {
    dispatch({ type: LIKE_POST_REQUEST, payload: { postId, optimistic: true } })
    
    const result = await apiDeduplicator.dedupe(
      key,
      async () => {
        const { data } = await api.get(`/api/post/like/${postId}`)
        
        dispatch({ type: LIKE_POST_SUCCESS, payload: data })
        
        // Invalidate posts cache to refresh like counts
        apiDeduplicator.invalidate(/^posts-/i)
        
        return data
      },
      1000 // Very short cache to prevent rapid duplicate clicks
    )
    
    return result
  } catch (error) {
    // Revert optimistic update on error
    dispatch({ type: LIKE_POST_FAILURE, payload: { postId, error } })
    throw error
  }
}

// Optimized liked posts fetch
export const likedPostActionOptimized = () => async (dispatch) => {
  const key = 'posts-liked'
  
  try {
    const result = await apiDeduplicator.dedupe(
      key,
      async () => {
        dispatch({ type: LIKED_POST_REQUEST })
        
        const { data } = await api.get(`/api/post/liked`)
        
        dispatch({ type: LIKED_POST_SUCCESS, payload: data })
        return data
      },
      3 * 60 * 1000 // 3 minutes cache for liked posts
    )
    
    return result
  } catch (error) {
    dispatch({ type: LIKED_POST_FAILURE, payload: error })
    throw error
  }
}

// Optimized saved posts fetch
export const savedPostActionOptimized = () => async (dispatch) => {
  const key = 'posts-saved'
  
  try {
    const result = await apiDeduplicator.dedupe(
      key,
      async () => {
        dispatch({ type: SAVED_POST_REQUEST })
        
        const { data } = await api.get(`/api/post/saved`)
        
        dispatch({ type: SAVED_POST_SUCCESS, payload: data })
        return data
      },
      3 * 60 * 1000 // 3 minutes cache for saved posts
    )
    
    return result
  } catch (error) {
    dispatch({ type: SAVED_POST_FAILURE, payload: error })
    throw error
  }
}

// Utility to clear post-related cache when needed
export const clearPostCache = () => {
  apiDeduplicator.invalidate(/^posts-/i)
}
