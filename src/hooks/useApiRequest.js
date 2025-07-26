/**
 * Professional API Request Hook with Timeout Management
 * Handles loading states, errors, retries, and timeouts
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { api, withApiErrorBoundary } from '../utils/ApiClient';

export const useApiRequest = (
  apiCall,
  options = {}
) => {
  const {
    immediate = false,
    timeout = 30000,
    retryAttempts = 3,
    retryDelay = 1000,
    onSuccess = null,
    onError = null,
    dependencies = []
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const abortControllerRef = useRef(null);
  const timeoutRef = useRef(null);

  // Enhanced API call with timeout and retry logic
  const execute = useCallback(async (...args) => {
    // Abort previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError(null);

    // Set timeout
    timeoutRef.current = setTimeout(() => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        setError(new Error('Request timeout'));
        setLoading(false);
      }
    }, timeout);

    try {
      const wrappedApiCall = withApiErrorBoundary(apiCall);
      const result = await wrappedApiCall(...args, {
        signal: abortControllerRef.current.signal
      });

      clearTimeout(timeoutRef.current);
      
      setData(result);
      setRetryCount(0);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      clearTimeout(timeoutRef.current);
      
      // Don't set error if request was aborted
      if (err.name === 'AbortError') {
        return;
      }

      // Handle timeout or network errors with retry
      const shouldRetry = 
        retryCount < retryAttempts && 
        (err.message?.includes('timeout') || err.code === 'ECONNABORTED');

      if (shouldRetry) {
        setRetryCount(prev => prev + 1);
        
        // Wait before retry
        setTimeout(() => {
          execute(...args);
        }, retryDelay * Math.pow(2, retryCount)); // Exponential backoff
        
        return;
      }

      setError(err);
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, timeout, retryAttempts, retryDelay, retryCount, onSuccess, onError]);

  // Retry function for manual retries
  const retry = useCallback(() => {
    setRetryCount(0);
    execute();
  }, [execute]);

  // Cancel ongoing request
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setLoading(false);
  }, []);

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute();
    }

    // Cleanup on unmount
    return () => {
      cancel();
    };
  }, [immediate, ...dependencies]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return {
    data,
    loading,
    error,
    execute,
    retry,
    cancel,
    retryCount
  };
};

// Hook for paginated data with infinite scroll
export const useInfiniteApiRequest = (
  apiCall,
  options = {}
) => {
  const {
    pageSize = 20,
    timeout = 30000,
    onSuccess = null,
    onError = null
  } = options;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [page, setPage] = useState(0);

  const loadPage = useCallback(async (pageNum = 0, append = false) => {
    const isLoadingMore = append && data.length > 0;
    
    if (isLoadingMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    
    setError(null);

    try {
      const wrappedApiCall = withApiErrorBoundary(apiCall);
      const result = await wrappedApiCall({
        page: pageNum,
        size: pageSize,
        timeout
      });

      const newData = result.data || result;
      const hasMore = result.hasNext !== undefined ? result.hasNext : newData.length === pageSize;

      if (append) {
        setData(prev => [...prev, ...newData]);
      } else {
        setData(newData);
      }

      setHasNextPage(hasMore);
      setPage(pageNum);

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (err) {
      setError(err);
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [apiCall, pageSize, timeout, data.length, onSuccess, onError]);

  const loadMore = useCallback(() => {
    if (!loadingMore && !loading && hasNextPage) {
      return loadPage(page + 1, true);
    }
  }, [loadPage, page, loadingMore, loading, hasNextPage]);

  const refresh = useCallback(() => {
    setPage(0);
    setHasNextPage(true);
    return loadPage(0, false);
  }, [loadPage]);

  const reset = useCallback(() => {
    setData([]);
    setPage(0);
    setHasNextPage(true);
    setError(null);
  }, []);

  return {
    data,
    loading,
    loadingMore,
    error,
    hasNextPage,
    loadMore,
    refresh,
    reset,
    page
  };
};

// Hook for real-time data with polling
export const usePollingApiRequest = (
  apiCall,
  options = {}
) => {
  const {
    interval = 30000,
    immediate = true,
    timeout = 15000,
    onSuccess = null,
    onError = null,
    dependencies = []
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPolling, setIsPolling] = useState(false);
  
  const intervalRef = useRef(null);
  const abortControllerRef = useRef(null);

  const fetchData = useCallback(async (showLoading = true) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    if (showLoading) {
      setLoading(true);
    }
    setError(null);

    try {
      const wrappedApiCall = withApiErrorBoundary(apiCall);
      const result = await wrappedApiCall({
        signal: abortControllerRef.current.signal,
        timeout
      });

      setData(result);
      
      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err);
        
        if (onError) {
          onError(err);
        }
      }
      
      throw err;
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [apiCall, timeout, onSuccess, onError]);

  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setIsPolling(true);
    
    intervalRef.current = setInterval(() => {
      fetchData(false); // Don't show loading for polling updates
    }, interval);
  }, [fetchData, interval]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  const refresh = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  // Start/stop polling based on dependencies
  useEffect(() => {
    if (immediate) {
      fetchData(true);
      
      if (interval > 0) {
        startPolling();
      }
    }

    return () => {
      stopPolling();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [immediate, interval, fetchData, startPolling, stopPolling, ...dependencies]);

  return {
    data,
    loading,
    error,
    isPolling,
    refresh,
    startPolling,
    stopPolling
  };
};

export default {
  useApiRequest,
  useInfiniteApiRequest,
  usePollingApiRequest
};
