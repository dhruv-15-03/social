/**
 * Optimized Data Fetching Hook
 * Combines caching, deduplication, and smart loading strategies
 */

import { useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { apiDeduplicator } from '../utils/ApiDeduplicator'

export const useOptimizedDataFetch = (config) => {
  const {
    action,           // Redux action to dispatch
    selector,         // Redux selector to get data
    dependencies = [], // Dependencies that trigger refetch
    cacheKey,         // Unique cache key
    cacheDuration = 5 * 60 * 1000, // 5 minutes default
    immediate = true, // Fetch immediately on mount
    condition = null, // Condition function to determine if fetch is needed
  } = config

  const dispatch = useDispatch()
  const data = useSelector(selector)
  const fetchedRef = useRef(false)
  const lastDepsRef = useRef(dependencies)

  // Check if dependencies have changed
  const depsChanged = useCallback(() => {
    return dependencies.some((dep, index) => dep !== lastDepsRef.current[index])
  }, [dependencies])

  // Optimized fetch function
  const fetchData = useCallback(async () => {
    if (!action || !cacheKey) return

    // Check condition if provided
    if (condition && !condition(data)) {
      return
    }

    try {
      await apiDeduplicator.dedupe(
        cacheKey,
        () => dispatch(action()),
        cacheDuration
      )
      fetchedRef.current = true
      lastDepsRef.current = dependencies
    } catch (error) {
      console.error(`Optimized fetch failed for ${cacheKey}:`, error)
    }
  }, [action, cacheKey, cacheDuration, condition, data, dispatch, dependencies])

  // Effect for initial fetch and dependency changes
  useEffect(() => {
    const shouldFetch = immediate && (!fetchedRef.current || depsChanged())
    
    if (shouldFetch) {
      fetchData()
    }
  }, [immediate, fetchData, depsChanged])

  // Manual refetch function
  const refetch = useCallback(() => {
    if (cacheKey) {
      apiDeduplicator.invalidate(cacheKey)
    }
    return fetchData()
  }, [cacheKey, fetchData])

  // Clear cache function
  const clearCache = useCallback(() => {
    if (cacheKey) {
      apiDeduplicator.invalidate(cacheKey)
    }
  }, [cacheKey])

  return {
    data,
    refetch,
    clearCache,
    fetchData
  }
}

/**
 * Hook for conditional data fetching
 * Only fetches if data doesn't exist or is stale
 */
export const useConditionalFetch = (actionCreator, selector, cacheKey, condition) => {
  const dispatch = useDispatch()
  const data = useSelector(selector)

  const fetch = useCallback(() => {
    if (condition && condition(data)) {
      return // Don't fetch if condition is not met
    }

    return apiDeduplicator.dedupe(
      cacheKey,
      () => dispatch(actionCreator()),
      5 * 60 * 1000 // 5 minutes default
    )
  }, [actionCreator, dispatch, cacheKey, condition, data])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { data, refetch: fetch }
}

/**
 * Hook for bulk data operations
 * Combines multiple related data fetches into a single optimized operation
 */
export const useBulkDataFetch = (operations) => {
  const dispatch = useDispatch()

  const executeBulk = useCallback(async () => {
    const promises = operations.map(op => 
      apiDeduplicator.dedupe(
        op.cacheKey,
        () => dispatch(op.action()),
        op.cacheDuration || 5 * 60 * 1000
      )
    )

    try {
      await Promise.all(promises)
    } catch (error) {
      console.error('Bulk fetch failed:', error)
    }
  }, [dispatch, operations])

  useEffect(() => {
    executeBulk()
  }, [executeBulk])

  return { executeBulk }
}
