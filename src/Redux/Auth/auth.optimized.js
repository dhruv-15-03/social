

import { api } from "../../config/api"
import { apiDeduplicator } from "../../utils/ApiDeduplicator"
import { 
  GET_PROFILE_REQUEST, 
  GET_PROFILE_SUCCESS, 
  GET_PROFILE_FAILURE,
  SEARCH_USER_REQUEST,
  SEARCH_USER_SUCCESS,
  SEARCH_USER_FAILURE,
  USERS_FOR_STORY_REQUEST,
  USERS_FOR_STORY_SUCCESS,
  USERS_FOR_STORY_FAILURE
} from "./auth.action.type"

export const getProfileActionOptimized = (jwt) => async (dispatch, getState) => {
  const key = `profile-${jwt?.substring(0, 10) || 'current'}`
  
  try {
    const result = await apiDeduplicator.dedupe(
      key,
      async () => {
        dispatch({ type: GET_PROFILE_REQUEST })
        
        const { data } = await api.get("/api/user/profile", {
          headers: {
            Authorization: `Bearer ${jwt}`
          }
        })
        
        dispatch({ type: GET_PROFILE_SUCCESS, payload: data })
        return data
      },
      2 * 60 * 1000 // 2 minutes cache for profile
    )
    
    return result
  } catch (error) {
    dispatch({ type: GET_PROFILE_FAILURE, payload: error })
    throw error
  }
}

// Optimized search with debouncing and deduplication
export const searchUserOptimized = (query) => async (dispatch) => {
  if (!query || query.length < 2) return
  
  const key = `search-${query.toLowerCase()}`
  
  try {
    const result = await apiDeduplicator.dedupe(
      key,
      async () => {
        dispatch({ type: SEARCH_USER_REQUEST })
        
        const { data } = await api.get(`/api/user/${query}`)
        
        dispatch({ type: SEARCH_USER_SUCCESS, payload: data })
        return data
      },
      30 * 1000 // 30 seconds cache for search
    )
    
    return result
  } catch (error) {
    dispatch({ type: SEARCH_USER_FAILURE, payload: error })
    throw error
  }
}

// Bulk user fetch for stories (replaces individual getUser calls)
export const usersForStoryOptimized = () => async (dispatch) => {
  const key = 'users-for-story'
  
  try {
    const result = await apiDeduplicator.dedupe(
      key,
      async () => {
        dispatch({ type: USERS_FOR_STORY_REQUEST })
        
        const { data } = await api.get(`/api/story/users`)
        
        dispatch({ type: USERS_FOR_STORY_SUCCESS, payload: data })
        return data
      },
      5 * 60 * 1000 // 5 minutes cache for story users
    )
    
    return result
  } catch (error) {
    dispatch({ type: USERS_FOR_STORY_FAILURE, payload: error })
    throw error
  }
}

export const clearUserCache = () => {
  apiDeduplicator.invalidate(/^(profile|search|users)/i)
}
