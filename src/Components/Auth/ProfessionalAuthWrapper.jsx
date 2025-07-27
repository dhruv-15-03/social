import React from 'react';
import { Box, Typography, Button, Alert, Fade, LinearProgress } from '@mui/material';
import { AppLoader } from '../UI/LoadingComponents';
import { useSessionPersistence } from '../../hooks/useSessionPersistence';
import RefreshIcon from '@mui/icons-material/Refresh';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const AuthenticationWrapper = ({ 
  children, 
  loginComponent: LoginComponent,
  loadingComponent: LoadingComponent = AppLoader 
}) => {
  const {
    isInitializing,
    hasRestoredSession,
    isAuthenticated,
    needsAuthentication,
    authenticationStatus,
    error,
    isLoading,
    clearSession,
    reinitialize
  } = useSessionPersistence();

  // Show professional initialization screen
  if (isInitializing) {
    return (
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
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
            Thoughts
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8, mb: 4 }}>
            {hasRestoredSession ? 'Restoring your session...' : 'Initializing application...'}
          </Typography>
        </Box>

        <Box sx={{ width: '100%', maxWidth: 400, mb: 3 }}>
          <LinearProgress 
            sx={{ 
              height: 6, 
              borderRadius: 3,
              backgroundColor: 'rgba(255,255,255,0.2)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'white'
              }
            }} 
          />
        </Box>

        {hasRestoredSession && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.8 }}>
            <CheckCircleIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption">
              Session found, authenticating...
            </Typography>
          </Box>
        )}
      </Box>
    );
  }

  // Show loading state for ongoing authentication processes
  if (isLoading && authenticationStatus === 'loading') {
    return (
      <LoadingComponent 
        timeout={15000}
        onTimeout={() => {
          console.warn('Authentication timeout, reinitializing...');
          reinitialize();
        }}
      />
    );
  }

  // Show error state with recovery options
  if (authenticationStatus === 'error' && error) {
    return (
      <Fade in={true} timeout={300}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
            color: 'white',
            p: 3
          }}
        >
          <SecurityIcon sx={{ fontSize: 64, mb: 3, opacity: 0.8 }} />
          
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, textAlign: 'center' }}>
            Authentication Error
          </Typography>
          
          <Typography variant="body1" sx={{ opacity: 0.8, mb: 3, textAlign: 'center', maxWidth: 400 }}>
            We encountered an issue while verifying your session. This might be due to an expired token or network connectivity.
          </Typography>

          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              '& .MuiAlert-icon': { color: 'white' },
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            {error?.message || error || 'Authentication failed'}
          </Alert>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={reinitialize}
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
              onClick={clearSession}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.5)',
                color: 'white',
                '&:hover': { 
                  borderColor: 'rgba(255, 255, 255, 0.8)',
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Start Fresh
            </Button>
          </Box>

          <Typography variant="caption" sx={{ mt: 4, opacity: 0.6, textAlign: 'center' }}>
            If this persists, please check your internet connection
          </Typography>
        </Box>
      </Fade>
    );
  }

  // Show login page for unauthenticated users
  if (needsAuthentication || authenticationStatus === 'unauthenticated') {
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

  // Show authenticated content
  if (isAuthenticated && authenticationStatus === 'authenticated') {
    return (
      <Fade in={true} timeout={300}>
        <Box>
          {children}
        </Box>
      </Fade>
    );
  }

  // Fallback loading state
  return <LoadingComponent />;
};

export default AuthenticationWrapper;
