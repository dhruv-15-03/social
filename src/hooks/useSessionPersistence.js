import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { restoreSessionAction, clearSessionAction } from '../Redux/Auth/auth.actiion';
import { logger } from '../utils/productionLogger';


export const useSessionPersistence = () => {
    const dispatch = useDispatch();
    const { auth } = useSelector(store => store);
    const [initializationState, setInitializationState] = useState({
        isInitializing: true,
        hasRestoredSession: false,
        initializationComplete: false,
        error: null
    });

    const initializeAuthentication = useCallback(async () => {
        logger.auth.info('🚀 Initializing authentication system...');
        
        try {
            setInitializationState(prev => ({
                ...prev,
                isInitializing: true,
                error: null
            }));

            const storedJWT = localStorage.getItem('jwt');
            
            if (storedJWT && storedJWT.length > 10) {
                logger.auth.info('📱 Found stored JWT token, attempting session restoration...');
                
                await dispatch(restoreSessionAction());
                
                setInitializationState(prev => ({
                    ...prev,
                    hasRestoredSession: true
                }));
                
                logger.auth.info('✅ Session restoration completed');
            } else {
                logger.auth.info('❌ No valid JWT token found, user needs to login');
                setInitializationState(prev => ({
                    ...prev,
                    hasRestoredSession: false
                }));
            }
            
        } catch (error) {
            logger.auth.error('❌ Authentication initialization failed:', error);
            
            dispatch(clearSessionAction());
            
            setInitializationState(prev => ({
                ...prev,
                error: error.message,
                hasRestoredSession: false
            }));
        } finally {
            setTimeout(() => {
                setInitializationState(prev => ({
                    ...prev,
                    isInitializing: false,
                    initializationComplete: true
                }));
                logger.auth.info('🎯 Authentication initialization complete');
            }, 500);
        }
    }, [dispatch]);

    const clearSession = useCallback(() => {
        logger.auth.info('🔓 Clearing user session...');
        dispatch(clearSessionAction());
        setInitializationState(prev => ({
            ...prev,
            hasRestoredSession: false,
            error: null
        }));
    }, [dispatch]);

    
    const isAuthenticated = useCallback(() => {
        return !!(auth.jwt && auth.user && !auth.loading);
    }, [auth.jwt, auth.user, auth.loading]);

    const needsAuthentication = useCallback(() => {
        if (initializationState.isInitializing) {
            return false;
        }
        
        return initializationState.initializationComplete && !isAuthenticated();
    }, [initializationState.isInitializing, initializationState.initializationComplete, isAuthenticated]);

    const getAuthenticationStatus = useCallback(() => {
        if (initializationState.isInitializing) {
            return 'initializing';
        }
        
        if (auth.loading) {
            return 'loading';
        }
        
        if (initializationState.error) {
            return 'error';
        }
        
        if (isAuthenticated()) {
            return 'authenticated';
        }
        
        return 'unauthenticated';
    }, [initializationState.isInitializing, initializationState.error, auth.loading, isAuthenticated]);

    useEffect(() => {
        initializeAuthentication();
    }, [initializeAuthentication]);

    // Debug logging removed for production
    useEffect(() => {
        // Authentication state monitoring for development purposes
        // State tracking logic here if needed for debugging
    }, [
        auth.jwt, 
        auth.user, 
        auth.loading, 
        initializationState.isInitializing,
        initializationState.initializationComplete,
        initializationState.hasRestoredSession,
        getAuthenticationStatus
    ]);

    return {
        // State
        isInitializing: initializationState.isInitializing,
        initializationComplete: initializationState.initializationComplete,
        hasRestoredSession: initializationState.hasRestoredSession,
        isAuthenticated: isAuthenticated(),
        needsAuthentication: needsAuthentication(),
        authenticationStatus: getAuthenticationStatus(),
        error: initializationState.error || auth.error,
        
        // Auth data
        user: auth.user,
        jwt: auth.jwt,
        isLoading: auth.loading,
        
        // Actions
        clearSession,
        reinitialize: initializeAuthentication
    };
};

export default useSessionPersistence;
