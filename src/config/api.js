import axios from "axios";
import envConfig from "./environment";

// API Base URL from environment configuration
export const API_BASE_URL = envConfig.api.baseUrl;

// Create axios instance with professional configuration
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: envConfig.api.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for adding authentication token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(envConfig.auth.storageKey);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log requests in development
    if (envConfig.app.isDevelopment) {
      console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.url}`, config);
    }
    
    return config;
  },
  (error) => {
    if (envConfig.features.errorLogging) {
      console.error('❌ Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor for handling common responses and errors
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (envConfig.app.isDevelopment) {
      console.log(`✅ API Response: ${response.config.url}`, response.data);
    }
    
    return response;
  },
  (error) => {
    // Handle common HTTP errors
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          console.warn('🔐 Unauthorized access - clearing session');
          localStorage.removeItem(envConfig.auth.storageKey);
          if (window.location.pathname !== '/auth') {
            window.location.href = '/auth';
          }
          break;
          
        case 403:
          console.warn('🚫 Forbidden access');
          break;
          
        case 404:
          console.warn('🔍 Resource not found');
          break;
          
        case 500:
          console.error('🔥 Server error');
          break;
          
        default:
          if (envConfig.features.errorLogging) {
            console.error(`❌ API Error ${status}:`, data);
          }
      }
    } else if (error.request) {
      // Network error
      console.error('🌐 Network Error:', error.message);
    } else {
      // Other error
      if (envConfig.features.errorLogging) {
        console.error('❌ Request Setup Error:', error.message);
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper functions for different HTTP methods
export const apiGet = (url, config = {}) => api.get(url, config);
export const apiPost = (url, data, config = {}) => api.post(url, data, config);
export const apiPut = (url, data, config = {}) => api.put(url, data, config);
export const apiDelete = (url, config = {}) => api.delete(url, config);

// API helper functions
export const apiHelpers = {
  /**
   * Upload file with progress tracking
   */
  uploadFile: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  },

  /**
   * Retry failed requests
   */
  retryRequest: async (requestConfig, maxRetries = envConfig.api.retryCount) => {
    let lastError;
    
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await api(requestConfig);
      } catch (error) {
        lastError = error;
        if (i < maxRetries) {
          const delay = Math.pow(2, i) * 1000; // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
          console.log(`🔄 Retrying request (attempt ${i + 2}/${maxRetries + 1})`);
        }
      }
    }
    
    throw lastError;
  },

  /**
   * Cancel pending requests
   */
  cancelToken: () => axios.CancelToken.source(),

  /**
   * Health check
   */
  healthCheck: () => api.get('/health'),
};

export default api;