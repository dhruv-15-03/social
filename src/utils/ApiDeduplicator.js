/**
 * API Request Deduplication Utility
 * Prevents duplicate API calls for the same resource within a time window
 */

class ApiDeduplicator {
  constructor() {
    this.pendingRequests = new Map()
    this.cache = new Map()
    this.defaultTTL = 5 * 60 * 1000 // 5 minutes
  }

  /**
   * Creates a unique key for the request
   */
  createKey(endpoint, params = {}) {
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&')
    return `${endpoint}${paramString ? '?' + paramString : ''}`
  }

  /**
   * Checks if we have cached data that's still valid
   */
  getCached(key) {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data
    }
    if (cached) {
      this.cache.delete(key)
    }
    return null
  }

  /**
   * Stores data in cache
   */
  setCached(key, data, ttl = this.defaultTTL) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  /**
   * Deduplicates API requests
   */
  async dedupe(key, requestFn, ttl = this.defaultTTL) {
    // Check cache first
    const cached = this.getCached(key)
    if (cached) {
      return cached
    }

    // Check if request is already pending
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)
    }

    // Make the request
    const requestPromise = requestFn()
      .then(data => {
        this.setCached(key, data, ttl)
        this.pendingRequests.delete(key)
        return data
      })
      .catch(error => {
        this.pendingRequests.delete(key)
        throw error
      })

    this.pendingRequests.set(key, requestPromise)
    return requestPromise
  }

  /**
   * Clears cache for a specific key or pattern
   */
  invalidate(keyOrPattern) {
    if (typeof keyOrPattern === 'string') {
      this.cache.delete(keyOrPattern)
      this.pendingRequests.delete(keyOrPattern)
    } else if (keyOrPattern instanceof RegExp) {
      for (const key of this.cache.keys()) {
        if (keyOrPattern.test(key)) {
          this.cache.delete(key)
        }
      }
      for (const key of this.pendingRequests.keys()) {
        if (keyOrPattern.test(key)) {
          this.pendingRequests.delete(key)
        }
      }
    }
  }

  /**
   * Clears all cache
   */
  clear() {
    this.cache.clear()
    this.pendingRequests.clear()
  }
}

export const apiDeduplicator = new ApiDeduplicator()
export default ApiDeduplicator
