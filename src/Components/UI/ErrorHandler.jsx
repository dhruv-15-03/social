

import React, { useState, useEffect } from 'react';
import {
  Box,
  Alert,
  AlertTitle,
  Button,
  Typography,
  Collapse,
  IconButton,
  Snackbar,
  LinearProgress
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
  WifiOff as WifiOffIcon,
  Error as ErrorIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const ErrorContext = React.createContext({
  errors: [],
  addError: () => {},
  removeError: () => {},
  clearErrors: () => {}
});

export const useErrorHandler = () => {
  const context = React.useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorHandler must be used within ErrorProvider');
  }
  return context;
};

export const ErrorProvider = ({ children }) => {
  const [errors, setErrors] = useState([]);

  const addError = (error, options = {}) => {
    const errorId = Date.now() + Math.random();
    const newError = {
      id: errorId,
      message: error.message || 'An unknown error occurred',
      type: getErrorType(error),
      timestamp: new Date(),
      autoHide: options.autoHide !== false,
      duration: options.duration || 6000,
      retry: options.retry || null,
      ...options
    };

    setErrors(prev => [...prev, newError]);

    if (newError.autoHide) {
      setTimeout(() => {
        removeError(errorId);
      }, newError.duration);
    }

    return errorId;
  };

  const removeError = (errorId) => {
    setErrors(prev => prev.filter(error => error.id !== errorId));
  };

  const clearErrors = () => {
    setErrors([]);
  };

  const getErrorType = (error) => {
    if (error?.message?.includes('timeout') || error?.code === 'ECONNABORTED') {
      return 'timeout';
    }
    if (error?.message?.includes('Network Error') || !navigator.onLine) {
      return 'network';
    }
    if (error?.response?.status >= 500) {
      return 'server';
    }
    if (error?.response?.status === 429) {
      return 'rateLimit';
    }
    if (error?.response?.status === 401) {
      return 'auth';
    }
    return 'generic';
  };

  return (
    <ErrorContext.Provider value={{ errors, addError, removeError, clearErrors }}>
      {children}
      <ErrorDisplay />
    </ErrorContext.Provider>
  );
};

// Error display component
const ErrorDisplay = () => {
  const { errors, removeError } = useErrorHandler();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 9999,
        maxWidth: 400,
        width: '100%'
      }}
    >
      {errors.map((error) => (
        <ErrorSnackbar
          key={error.id}
          error={error}
          onClose={() => removeError(error.id)}
        />
      ))}
    </Box>
  );
};

// Individual error snackbar
const ErrorSnackbar = ({ error, onClose }) => {
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setTimeout(onClose, 300); // Wait for animation
  };

  const handleRetry = async () => {
    if (error.retry) {
      try {
        await error.retry();
        handleClose();
      } catch (retryError) {
        // Retry failed - handle silently
      }
    }
  };

  const getErrorConfig = () => {
    switch (error.type) {
      case 'timeout':
        return {
          severity: 'error',
          icon: <WifiOffIcon />,
          title: 'Request Timeout',
          description: 'The request took too long to complete. Please check your connection and try again.',
          color: '#f44336'
        };
      case 'network':
        return {
          severity: 'error',
          icon: <WifiOffIcon />,
          title: 'Network Error',
          description: 'Unable to connect to the server. Please check your internet connection.',
          color: '#f44336'
        };
      case 'server':
        return {
          severity: 'error',
          icon: <ErrorIcon />,
          title: 'Server Error',
          description: 'Something went wrong on our end. Please try again later.',
          color: '#f44336'
        };
      case 'rateLimit':
        return {
          severity: 'warning',
          icon: <WarningIcon />,
          title: 'Too Many Requests',
          description: 'You\'re sending requests too quickly. Please wait a moment and try again.',
          color: '#ff9800'
        };
      case 'auth':
        return {
          severity: 'warning',
          icon: <WarningIcon />,
          title: 'Authentication Required',
          description: 'Please log in to continue.',
          color: '#ff9800'
        };
      default:
        return {
          severity: 'error',
          icon: <ErrorIcon />,
          title: 'Error',
          description: error.message,
          color: '#f44336'
        };
    }
  };

  const config = getErrorConfig();

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ position: 'relative', mb: 1 }}
    >
      <Alert
        severity={config.severity}
        onClose={handleClose}
        sx={{
          width: '100%',
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
        action={
          <Box display="flex" alignItems="center" gap={1}>
            {error.retry && (
              <Button
                size="small"
                onClick={handleRetry}
                startIcon={<RefreshIcon />}
                sx={{ color: 'inherit' }}
              >
                Retry
              </Button>
            )}
            <IconButton
              size="small"
              onClick={() => setExpanded(!expanded)}
              sx={{ color: 'inherit' }}
            >
              <ExpandMoreIcon
                sx={{
                  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }}
              />
            </IconButton>
          </Box>
        }
      >
        <AlertTitle>{config.title}</AlertTitle>
        {config.description}
        
        <Collapse in={expanded}>
          <Box mt={2} pt={2} borderTop="1px solid rgba(255,255,255,0.2)">
            <Typography variant="body2" color="inherit">
              <strong>Details:</strong>
            </Typography>
            <Typography variant="body2" color="inherit" sx={{ opacity: 0.8 }}>
              Error: {error.message}
            </Typography>
            <Typography variant="body2" color="inherit" sx={{ opacity: 0.8 }}>
              Time: {error.timestamp.toLocaleTimeString()}
            </Typography>
            {error.url && (
              <Typography variant="body2" color="inherit" sx={{ opacity: 0.8 }}>
                URL: {error.url}
              </Typography>
            )}
          </Box>
        </Collapse>
      </Alert>
    </Snackbar>
  );
};

// Hook for handling API errors with automatic error reporting
export const useApiErrorHandler = () => {
  const { addError } = useErrorHandler();

  const handleError = (error, options = {}) => {
    // Handle API error

    const errorOptions = {
      url: error.config?.url,
      method: error.config?.method,
      ...options
    };

    return addError(error, errorOptions);
  };

  const handleTimeoutError = (error, retryFn = null) => {
    return handleError(error, {
      retry: retryFn,
      duration: 10000, // Show longer for timeout errors
      autoHide: !retryFn // Don't auto-hide if retry is available
    });
  };

  const handleNetworkError = (error, retryFn = null) => {
    return handleError(error, {
      retry: retryFn,
      duration: 8000,
      autoHide: !retryFn
    });
  };

  return {
    handleError,
    handleTimeoutError,
    handleNetworkError
  };
};

// Higher-order component for wrapping components with error boundaries
export const withErrorBoundary = (WrappedComponent, fallbackComponent = null) => {
  return class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
      // Error Boundary caught an error - handle silently or report to error service
    }

    render() {
      if (this.state.hasError) {
        if (fallbackComponent) {
          return fallbackComponent;
        }

        return (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="200px"
            p={3}
            textAlign="center"
          >
            <ErrorIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </Typography>
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
              startIcon={<RefreshIcon />}
            >
              Reload Page
            </Button>
          </Box>
        );
      }

      return <WrappedComponent {...this.props} />;
    }
  };
};

// Connection status indicator
export const ConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [reconnecting, setReconnecting] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setReconnecting(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setReconnecting(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !reconnecting) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bgcolor: reconnecting ? 'warning.main' : 'error.main',
        color: 'white',
        p: 1,
        textAlign: 'center',
        zIndex: 9998
      }}
    >
      <Typography variant="body2">
        {reconnecting ? (
          <>
            <WifiOffIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Reconnecting...
          </>
        ) : (
          <>
            <WifiOffIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            No internet connection
          </>
        )}
      </Typography>
      {reconnecting && <LinearProgress sx={{ mt: 1 }} />}
    </Box>
  );
};

export default {
  ErrorProvider,
  useErrorHandler,
  useApiErrorHandler,
  withErrorBoundary,
  ConnectionStatus
};
