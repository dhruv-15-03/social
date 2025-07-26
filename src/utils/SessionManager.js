

import { createError } from '../utils/errorHandler';
import envConfig from '../config/environment';

// Production logger - silent in production
const logger = {
  auth: {
    info: () => {},
    error: () => {},
    warn: () => {},
    login: () => {},
    logout: () => {}
  }
};

class SessionManager {
  constructor() {
    this.retryAttempts = 0;
    this.maxRetries = 3;
    this.retryDelay = 1000; // Start with 1 second
    this.sessionValidated = false;
  }

  validateTokenFormat(token) {
    if (!token || typeof token !== 'string') {
      return false;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    try {
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      
      if (!header.typ || !header.alg || !payload.exp) {
        return false;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp < currentTime) {
        logger.auth.warn('Token is expired');
        return false;
      }

      return true;
    } catch (error) {
      logger.auth.error('Invalid token format:', error);
      return false;
    }
  }

  
  getStoredSession() {
    try {
      const token = localStorage.getItem(envConfig.auth.storageKey);
      
      if (!token) {
        logger.auth.info('No stored session found');
        return null;
      }

      if (!this.validateTokenFormat(token)) {
        logger.auth.warn('Invalid stored token format, clearing session');
        this.clearSession();
        return null;
      }

      logger.auth.info('Valid session token found');
      return token;
    } catch (error) {
      logger.auth.error('Error reading stored session:', error);
      return null;
    }
  }

  /**
   * Clears session data
   */
  clearSession() {
    try {
      localStorage.removeItem(envConfig.auth.storageKey);
      this.sessionValidated = false;
      this.retryAttempts = 0;
      logger.auth.info('Session cleared');
    } catch (error) {
      logger.auth.error('Error clearing session:', error);
    }
  }

  /**
   * Stores session token
   */
  storeSession(token) {
    try {
      if (!this.validateTokenFormat(token)) {
        throw new Error('Invalid token format');
      }

      localStorage.setItem(envConfig.auth.storageKey, token);
      this.sessionValidated = true;
      logger.auth.info('Session stored successfully');
      return true;
    } catch (error) {
      logger.auth.error('Error storing session:', error);
      return false;
    }
  }

  /**
   * Determines if an error should trigger session clearing
   */
  shouldClearSession(error) {
    // Only clear session for authentication errors
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      return true;
    }

    // Don't clear session for server errors, network errors, or timeouts
    if (error?.response?.status >= 500) {
      return false;
    }

    if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
      return false;
    }

    if (!error?.response) {
      return false;
    }

    return false;
  }

  /**
   * Handles profile fetch errors with retry logic
   */
  async handleProfileError(error, dispatch, getProfileAction, token) {
    const appError = createError(error);
    
    logger.auth.error('Profile fetch error:', {
      type: appError.type,
      status: error?.response?.status,
      message: appError.message,
      attempt: this.retryAttempts + 1
    });

    // Check if we should clear the session
    if (this.shouldClearSession(error)) {
      logger.auth.warn('Clearing session due to auth error');
      this.clearSession();
      dispatch({ type: 'CLEAR_SESSION' });
      return false;
    }

    // For server errors, network issues, or timeouts - retry silently
    if (this.retryAttempts < this.maxRetries) {
      this.retryAttempts++;
      const delay = this.retryDelay * Math.pow(2, this.retryAttempts - 1); // Exponential backoff
      
      logger.auth.info(`Retrying profile fetch in ${delay}ms (attempt ${this.retryAttempts}/${this.maxRetries})`);
      
      return new Promise((resolve) => {
        setTimeout(async () => {
          try {
            await dispatch(getProfileAction(token));
            this.retryAttempts = 0; // Reset on success
            resolve(true);
          } catch (retryError) {
            resolve(await this.handleProfileError(retryError, dispatch, getProfileAction, token));
          }
        }, delay);
      });
    }

    // Max retries reached - keep session but don't show errors to user
    logger.auth.warn('Max retries reached, keeping session for future attempts');
    this.retryAttempts = 0;
    return false;
  }

  /**
   * Professional session restoration with silent error handling
   */
  async restoreSession(dispatch, getProfileAction) {
    try {
      // Step 1: Validate stored token format
      const token = this.getStoredSession();
      
      if (!token) {
        logger.auth.info('No valid session to restore');
        return { success: false, needsLogin: true };
      }

      // Step 2: Restore JWT in Redux store
      logger.auth.info('Restoring session from valid token');
      dispatch({ type: 'RESTORE_SESSION', payload: token });

      // Step 3: Attempt to fetch profile with error handling
      try {
        await dispatch(getProfileAction(token));
        logger.auth.info('Session restored successfully');
        this.sessionValidated = true;
        this.retryAttempts = 0;
        return { success: true, needsLogin: false };
      } catch (profileError) {
        // Handle profile errors professionally
        const handled = await this.handleProfileError(profileError, dispatch, getProfileAction, token);
        
        if (!handled && this.shouldClearSession(profileError)) {
          return { success: false, needsLogin: true };
        }

        // For server errors, return success but mark as pending validation
        return { success: true, needsLogin: false, pendingValidation: true };
      }

    } catch (error) {
      logger.auth.error('Session restoration failed:', error);
      this.clearSession();
      dispatch({ type: 'CLEAR_SESSION' });
      return { success: false, needsLogin: true };
    }
  }

  /**
   * Enhanced login with proper error handling
   */
  async login(loginData, dispatch, loginAction) {
    try {
      logger.auth.login('Attempting login...');
      this.retryAttempts = 0; // Reset retry count for new login
      
      const result = await dispatch(loginAction(loginData));
      
      if (result?.token) {
        this.storeSession(result.token);
        logger.auth.login('Login successful');
        return { success: true, data: result };
      }

      return { success: false, error: 'No token received' };
    } catch (error) {
      logger.auth.error('Login failed:', error);
      const appError = createError(error);
      return { success: false, error: appError };
    }
  }

  /**
   * Enhanced logout with cleanup
   */
  async logout(dispatch) {
    try {
      logger.auth.logout('Logging out user');
      this.clearSession();
      dispatch({ type: 'CLEAR_SESSION' });
      return { success: true };
    } catch (error) {
      logger.auth.error('Logout error:', error);
      return { success: false, error };
    }
  }
}

// Export singleton instance
export const sessionManager = new SessionManager();
export default sessionManager;
