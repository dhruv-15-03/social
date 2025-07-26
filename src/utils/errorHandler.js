/**
 * Professional Error Handling Utilities
 * Centralized error handling with user-friendly messages
 */

import { logger } from './logger';

// Error types for better categorization
export const ErrorTypes = {
  NETWORK: 'NETWORK_ERROR',
  AUTHENTICATION: 'AUTH_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  PERMISSION: 'PERMISSION_ERROR',
  SERVER: 'SERVER_ERROR',
  CLIENT: 'CLIENT_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

// User-friendly error messages
const ErrorMessages = {
  [ErrorTypes.NETWORK]: 'Network connection issue. Please check your internet connection.',
  [ErrorTypes.AUTHENTICATION]: 'Authentication failed. Please log in again.',
  [ErrorTypes.VALIDATION]: 'Please check your input and try again.',
  [ErrorTypes.PERMISSION]: 'You don\'t have permission to perform this action.',
  [ErrorTypes.SERVER]: 'Server error. Please try again later.',
  [ErrorTypes.CLIENT]: 'Something went wrong. Please refresh the page.',
  [ErrorTypes.UNKNOWN]: 'An unexpected error occurred. Please try again.'
};

export class AppError extends Error {
  constructor(message, type = ErrorTypes.UNKNOWN, statusCode = null, originalError = null) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.statusCode = statusCode;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
    this.userMessage = ErrorMessages[type] || message;
  }
}

export const createError = (error, type = ErrorTypes.UNKNOWN) => {
  if (error instanceof AppError) {
    return error;
  }

  // Handle different error types
  if (error?.response) {
    const { status, data } = error.response;
    const message = data?.message || error.message;
    
    if (status === 401) {
      return new AppError(message, ErrorTypes.AUTHENTICATION, status, error);
    }
    
    if (status === 403) {
      return new AppError(message, ErrorTypes.PERMISSION, status, error);
    }
    
    if (status >= 400 && status < 500) {
      return new AppError(message, ErrorTypes.CLIENT, status, error);
    }
    
    if (status >= 500) {
      return new AppError(message, ErrorTypes.SERVER, status, error);
    }
  }

  if (error?.code === 'NETWORK_ERROR' || !navigator.onLine) {
    return new AppError(error.message, ErrorTypes.NETWORK, null, error);
  }

  return new AppError(error.message || 'An unexpected error occurred', type, null, error);
};

export const handleError = (error, context = '') => {
  const appError = createError(error);
  
  logger.error(`Error in ${context}:`, {
    type: appError.type,
    message: appError.message,
    statusCode: appError.statusCode,
    timestamp: appError.timestamp,
    originalError: appError.originalError
  });

  return appError;
};

export const handleAsyncError = (asyncFn) => {
  return async (...args) => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      throw handleError(error, asyncFn.name);
    }
  };
};

// Redux error handler
export const handleReduxError = (error, actionType) => {
  const appError = handleError(error, `Redux Action: ${actionType}`);
  
  return {
    type: actionType,
    payload: {
      error: appError.userMessage,
      details: {
        type: appError.type,
        statusCode: appError.statusCode,
        timestamp: appError.timestamp
      }
    }
  };
};

const errorHandlerUtils = {
  AppError,
  createError,
  handleError,
  handleAsyncError,
  handleReduxError,
  ErrorTypes,
  ErrorMessages
};

export default errorHandlerUtils;
