

import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sessionManager } from '../utils/SessionManager';
import { getProfileAction, loginUserAction, registerUserAction } from '../Redux/Auth/auth.actiion';

// Production logger - silent in production
const logger = {
  auth: {
    info: () => {},
    error: () => {}
  }
};

export const useAuthentication = () => {
  const dispatch = useDispatch();
  const { auth } = useSelector(store => store);
  const [authState, setAuthState] = useState({
    isInitializing: true,
    isLoading: false,
    error: null,
    needsLogin: true,
    retryCount: 0
  });

  
  const initializeAuth = useCallback(async () => {
    if (!authState.isInitializing) return;

    logger.auth.info('Initializing authentication...');
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await sessionManager.restoreSession(dispatch, getProfileAction);
      
      setAuthState(prev => ({
        ...prev,
        isInitializing: false,
        isLoading: false,
        needsLogin: !result.success,
        error: null
      }));

      if (result.success) {
        logger.auth.info('Authentication initialized successfully');
      } else {
        logger.auth.info('No valid session found, user needs to login');
      }

    } catch (error) {
      logger.auth.error('Auth initialization failed:', error);
      setAuthState(prev => ({
        ...prev,
        isInitializing: false,
        isLoading: false,
        needsLogin: true,
        error: error.message
      }));
    }
  }, [dispatch, authState.isInitializing]);

  
  const login = useCallback(async (loginData) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await sessionManager.login(loginData, dispatch, loginUserAction);
      
      if (result.success) {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          needsLogin: false,
          error: null,
          retryCount: 0
        }));
        return { success: true, data: result.data };
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error?.userMessage || result.error
        }));
        return { success: false, error: result.error };
      }
    } catch (error) {
      logger.auth.error('Login error in hook:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.userMessage || error.message || 'Login failed'
      }));
      return { success: false, error };
    }
  }, [dispatch]);

  
  const register = useCallback(async (registerData) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await dispatch(registerUserAction(registerData));
      
      if (result?.token) {
        sessionManager.storeSession(result.token);
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          needsLogin: false,
          error: null
        }));
        return { success: true, data: result };
      }

      return { success: false, error: 'Registration failed' };
    } catch (error) {
      logger.auth.error('Registration error:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.userMessage || error.message || 'Registration failed'
      }));
      return { success: false, error };
    }
  }, [dispatch]);

  
  const logout = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      await sessionManager.logout(dispatch);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        needsLogin: true,
        error: null
      }));
      return { success: true };
    } catch (error) {
      logger.auth.error('Logout error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error };
    }
  }, [dispatch]);

  const retryAuth = useCallback(async () => {
    if (authState.retryCount >= 3) {
      logger.auth.warn('Max retry attempts reached');
      return;
    }

    setAuthState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null,
      retryCount: prev.retryCount + 1
    }));

    await initializeAuth();
  }, [initializeAuth, authState.retryCount]);

  
  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  useEffect(() => {
    if (authState.isInitializing) {
      initializeAuth();
    }
  }, [initializeAuth, authState.isInitializing]);

  // Sync local needsLogin state with Redux auth state
  useEffect(() => {
    // If we have both JWT and user from Redux, and we're not initializing/loading,
    // then set needsLogin to false to allow authentication
    if (auth.jwt && auth.user && !authState.isInitializing && !authState.isLoading && !auth.loading) {
      if (authState.needsLogin) {
        logger.auth.info('Redux auth state is ready, updating needsLogin to false');
        setAuthState(prev => ({ ...prev, needsLogin: false }));
      }
    }
    // If we don't have JWT or user, ensure needsLogin is true
    else if ((!auth.jwt || !auth.user) && !authState.needsLogin && !authState.isInitializing) {
      logger.auth.info('Redux auth state cleared, updating needsLogin to true');
      setAuthState(prev => ({ ...prev, needsLogin: true }));
    }
  }, [auth.jwt, auth.user, auth.loading, authState.isInitializing, authState.isLoading, authState.needsLogin]);

  const getAuthStatus = () => {
    if (authState.isInitializing) {
      return 'initializing';
    }
    
    if (authState.isLoading || auth.loading) {
      return 'loading';
    }
    
    if (auth.user && auth.jwt && !authState.needsLogin) {
      return 'authenticated';
    }
    
    if (authState.error) {
      return 'error';
    }
    
    return 'unauthenticated';
  };

  return {
    user: auth.user,
    jwt: auth.jwt,
    isInitializing: authState.isInitializing,
    isLoading: authState.isLoading || auth.loading,
    isAuthenticated: auth.user && auth.jwt && !authState.needsLogin,
    needsLogin: authState.needsLogin,
    error: authState.error || auth.error,
    authStatus: getAuthStatus(),
    retryCount: authState.retryCount,
    
    login,
    register,
    logout,
    retryAuth,
    clearError,
    
    hasValidSession: () => !!sessionManager.getStoredSession(),
    canRetry: () => authState.retryCount < 3
  };
};

export default useAuthentication;
