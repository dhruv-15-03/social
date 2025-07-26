

import React from 'react';
import { Box, Typography, Button, Alert, Fade } from '@mui/material';
import { AppLoader } from '../UI/LoadingComponents';
import { useAuthentication } from '../../hooks/useAuthentication';
import RefreshIcon from '@mui/icons-material/Refresh';
import SecurityIcon from '@mui/icons-material/Security';

const AuthenticationWrapper = ({ 
  children, 
  loginComponent: LoginComponent,
  loadingComponent: LoadingComponent = AppLoader 
}) => {
  const {
    authStatus,
    isInitializing,
    isLoading,
    isAuthenticated,
    error,
    retryAuth,
    clearError,
    canRetry,
    retryCount
  } = useAuthentication();

  if (isInitializing || authStatus === 'initializing') {
    return (
      <LoadingComponent 
        timeout={30000}
        onTimeout={() => {
          if (canRetry()) {
            retryAuth();
          }
        }}
      />
    );
  }

  if (isLoading || authStatus === 'loading') {
    return (
      <LoadingComponent 
        timeout={15000}
        onTimeout={() => {
          if (canRetry()) {
            retryAuth();
          }
        }}
      />
    );
  }

  if (authStatus === 'error' && error && canRetry()) {
    return (
      <Fade in={true} timeout={300}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: 3
          }}
        >
          <SecurityIcon sx={{ fontSize: 64, mb: 3, opacity: 0.8 }} />
          
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, textAlign: 'center' }}>
            Connection Issue
          </Typography>
          
          <Typography variant="body1" sx={{ opacity: 0.8, mb: 3, textAlign: 'center', maxWidth: 400 }}>
            We're having trouble connecting to our servers. This usually resolves quickly.
          </Typography>

          {retryCount > 0 && (
            <Alert 
              severity="info" 
              sx={{ 
                mb: 2, 
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                '& .MuiAlert-icon': { color: 'white' }
              }}
            >
              Retry attempt {retryCount} of 3
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={retryAuth}
              disabled={isLoading}
              startIcon={<RefreshIcon />}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' }
              }}
            >
              Try Again
            </Button>
            
            <Button
              variant="outlined"
              onClick={clearError}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.5)',
                color: 'white',
                '&:hover': { 
                  borderColor: 'rgba(255, 255, 255, 0.8)',
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Continue to Login
            </Button>
          </Box>

          <Typography variant="caption" sx={{ mt: 4, opacity: 0.6, textAlign: 'center' }}>
            If this persists, please check your internet connection
          </Typography>
        </Box>
      </Fade>
    );
  }

  if (authStatus === 'unauthenticated' || !isAuthenticated) {
    return (
      <Fade in={true} timeout={300}>
        <Box>
          {LoginComponent ? <LoginComponent /> : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                p: 3
              }}
            >
              <Typography variant="h4" gutterBottom>
                Please Login
              </Typography>
              <Typography variant="body1" color="text.secondary">
                You need to be authenticated to access this application.
              </Typography>
            </Box>
          )}
        </Box>
      </Fade>
    );
  }

  if (authStatus === 'authenticated' && isAuthenticated) {
    return (
      <Fade in={true} timeout={300}>
        <Box>
          {children}
        </Box>
      </Fade>
    );
  }

  return <LoadingComponent />;
};

export default AuthenticationWrapper;
