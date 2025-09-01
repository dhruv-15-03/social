/**
 * Professional API Timeout and Error Handling System
 * Advanced request management with retry logic and fallback strategies
 */

import axios from 'axios';
import { logger } from '../utils/logger';

const TIMEOUT_CONFIG = {
  default: 30000,        // 30 seconds default
  upload: 120000,        // 2 minutes for uploads
  download: 180000,      // 3 minutes for downloads
  critical: 60000,       // 1 minute for critical operations
  background: 15000      // 15 seconds for background tasks
};

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
  backoffMultiplier: 2,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
  retryableErrors: ['ECONNABORTED', 'ETIMEDOUT', 'ENOTFOUND']
};

// Network quality detection
class NetworkQualityDetector {
  constructor() {
    this.quality = 'good'; // good, poor, offline
    this.lastCheck = 0;
    this.checkInterval = 30000; // 30 seconds
  }

  async detectQuality() {
    const now = Date.now();
    if (now - this.lastCheck < this.checkInterval) {
      return this.quality;
    }

    try {
      const start = performance.now();
      const response = await fetch('/health/ping', { 
        method: 'HEAD',
        cache: 'no-cache',
        signal: AbortSignal.timeout(5000)
      });
      const latency = performance.now() - start;

      if (response.ok) {
        this.quality = latency > 2000 ? 'poor' : 'good';
      } else {
        this.quality = 'poor';
      }
    } catch (error) {
      this.quality = navigator.onLine ? 'poor' : 'offline';
    }

    this.lastCheck = now;
    return this.quality;
  }

  getTimeoutForQuality(baseTimeout) {
    switch (this.quality) {
      case 'poor': return baseTimeout * 2;
      case 'offline': return 5000; // Quick fail for offline
      default: return baseTimeout;
    }
  }
}

const networkDetector = new NetworkQualityDetector();

const createRetryInterceptor = () => {
  return async (error) => {
    const { config } = error;
    
    if (config.__skipRetry) {
      return Promise.reject(error);
    }

    config.__retryCount = config.__retryCount || 0;

    const shouldRetry = 
      config.__retryCount < RETRY_CONFIG.maxRetries &&
      (
        RETRY_CONFIG.retryableStatuses.includes(error.response?.status) ||
        RETRY_CONFIG.retryableErrors.includes(error.code) ||
        error.message?.includes('timeout')
      );

    if (!shouldRetry) {
      logger.error('Request failed after all retries', {
        url: config.url,
        method: config.method,
        retries: config.__retryCount,
        error: error.message
      });
      return Promise.reject(error);
    }

    config.__retryCount++;

    const delay = RETRY_CONFIG.retryDelay * 
      Math.pow(RETRY_CONFIG.backoffMultiplier, config.__retryCount - 1);

    logger.warn(`Retrying request (${config.__retryCount}/${RETRY_CONFIG.maxRetries})`, {
      url: config.url,
      delay,
      reason: error.message
    });

    const networkQuality = await networkDetector.detectQuality();
    config.timeout = networkDetector.getTimeoutForQuality(config.timeout);
    await new Promise(resolve => setTimeout(resolve, delay));

    return axios(config);
  };
};

// Request queue for managing concurrent requests
class RequestQueue {
  constructor(maxConcurrent = 6) {
    this.maxConcurrent = maxConcurrent;
    this.active = new Set();
    this.queue = [];
  }

  async add(requestFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ requestFn, resolve, reject });
      this.process();
    });
  }

  async process() {
    if (this.active.size >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    const { requestFn, resolve, reject } = this.queue.shift();
    const requestId = Date.now() + Math.random();
    
    this.active.add(requestId);

    try {
      const result = await requestFn();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.active.delete(requestId);
      this.process(); // Process next in queue
    }
  }
}

const requestQueue = new RequestQueue();

// Enhanced API client with timeout management
export class ApiClient {
  constructor(baseURL, options = {}) {
    this.client = axios.create({
      baseURL,
      timeout: TIMEOUT_CONFIG.default,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      ...options
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config) => {
        // Add auth token
        const token = localStorage.getItem('jwt');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Adjust timeout based on network quality
        const networkQuality = await networkDetector.detectQuality();
        config.timeout = networkDetector.getTimeoutForQuality(config.timeout);

        // Add request tracking
        config.metadata = {
          startTime: Date.now(),
          requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };

        logger.debug('API Request started', {
          id: config.metadata.requestId,
          method: config.method?.toUpperCase(),
          url: config.url,
          timeout: config.timeout,
          networkQuality
        });

        return config;
      },
      (error) => {
        logger.error('Request configuration error', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        const duration = Date.now() - response.config.metadata.startTime;
        
        logger.debug('API Request completed', {
          id: response.config.metadata.requestId,
          status: response.status,
          duration: `${duration}ms`
        });

        return response;
      },
      createRetryInterceptor()
    );
  }

  // Enhanced request methods with timeout management
  async request(config) {
    // Determine timeout based on request type
    if (!config.timeout) {
      if (config.url?.includes('upload')) {
        config.timeout = TIMEOUT_CONFIG.upload;
      } else if (config.url?.includes('download')) {
        config.timeout = TIMEOUT_CONFIG.download;
      } else if (config.priority === 'critical') {
        config.timeout = TIMEOUT_CONFIG.critical;
      } else if (config.priority === 'background') {
        config.timeout = TIMEOUT_CONFIG.background;
      }
    }

    // Add to request queue for high-priority requests
    if (config.priority === 'high' || config.priority === 'critical') {
      return requestQueue.add(() => this.client.request(config));
    }

    return this.client.request(config);
  }

  // Convenience methods
  async get(url, options = {}) {
    return this.request({ method: 'GET', url, ...options });
  }

  async post(url, data, options = {}) {
    return this.request({ method: 'POST', url, data, ...options });
  }

  async put(url, data, options = {}) {
    return this.request({ method: 'PUT', url, data, ...options });
  }

  async patch(url, data, options = {}) {
    return this.request({ method: 'PATCH', url, data, ...options });
  }

  async delete(url, options = {}) {
    return this.request({ method: 'DELETE', url, ...options });
  }

  // Upload with progress tracking
  async upload(url, formData, onProgress = null) {
    return this.request({
      method: 'POST',
      url,
      data: formData,
      timeout: TIMEOUT_CONFIG.upload,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onProgress,
      priority: 'high'
    });
  }

  // Batch requests with concurrency control
  async batch(requests, options = {}) {
    const { maxConcurrent = 3, failFast = false } = options;
    const results = [];
    const errors = [];

    for (let i = 0; i < requests.length; i += maxConcurrent) {
      const batch = requests.slice(i, i + maxConcurrent);
      const promises = batch.map(async (request, index) => {
        try {
          const result = await this.request(request);
          return { index: i + index, result, error: null };
        } catch (error) {
          const errorResult = { index: i + index, result: null, error };
          if (failFast) throw error;
          return errorResult;
        }
      });

      const batchResults = await Promise.all(promises);
      batchResults.forEach(({ index, result, error }) => {
        if (error) {
          errors.push({ index, error });
        } else {
          results[index] = result;
        }
      });
    }

    return { results, errors };
  }
}

// Global API instance
export const api = new ApiClient(process.env.REACT_APP_API_URL || 'http://localhost:8080');

// Error boundary for API calls
export const withApiErrorBoundary = (apiCall) => {
  return async (...args) => {
    try {
      return await apiCall(...args);
    } catch (error) {
      // Handle different types of errors
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        logger.error('API timeout error', {
          url: error.config?.url,
          timeout: error.config?.timeout,
          method: error.config?.method
        });
        
        throw new Error('Request timed out. Please check your connection and try again.');
      }

      if (!navigator.onLine) {
        throw new Error('No internet connection. Please check your network and try again.');
      }

      if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }

      if (error.response?.status === 429) {
        throw new Error('Too many requests. Please wait a moment and try again.');
      }

      // Re-throw original error for other cases
      throw error;
    }
  };
};

export default api;
