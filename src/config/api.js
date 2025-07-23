import axios from "axios";
import envConfig from "./environment";

export const API_BASE_URL = envConfig.api.baseUrl;

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: envConfig.api.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(envConfig.auth.storageKey);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
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

api.interceptors.response.use(
  (response) => {
    if (envConfig.app.isDevelopment) {
      console.log(`✅ API Response: ${response.config.url}`, response.data);
    }
    
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
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
      console.error('🌐 Network Error:', error.message);
    } else {
      if (envConfig.features.errorLogging) {
        console.error('❌ Request Setup Error:', error.message);
      }
    }
    
    return Promise.reject(error);
  }
);

export const apiGet = (url, config = {}) => api.get(url, config);
export const apiPost = (url, data, config = {}) => api.post(url, data, config);
export const apiPut = (url, data, config = {}) => api.put(url, data, config);
export const apiDelete = (url, config = {}) => api.delete(url, config);

export const apiHelpers = {
  
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

  
  cancelToken: () => axios.CancelToken.source(),

  
  healthCheck: () => api.get('/health'),
};

export default api;
