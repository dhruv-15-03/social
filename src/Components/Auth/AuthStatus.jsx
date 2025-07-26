/**
 * Professional Authentication Status Component
 * 
 * Provides visual feedback for authentication states with:
 * - Clean loading indicators
 * - Professional error messages
 * - Retry functionality
 * - Status indicators
 */

import React from 'react';
import { 
  Box, 
  Alert, 
  Typography, 
  Button, 
  LinearProgress,
  Chip,
  Fade
} from '@mui/material';
import { 
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

const AuthStatus = ({ 
  status = 'idle', 
  error = null, 
  isLoading = false,
  onRetry = null,
  canRetry = true,
  retryCount = 0,
  maxRetries = 3,
  message = '',
  showProgress = true
}) => {
  
  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          severity: 'success',
          icon: <SuccessIcon />,
          color: 'success',
          title: 'Success',
          defaultMessage: 'Authentication successful'
        };
      case 'error':
        return {
          severity: 'error',
          icon: <ErrorIcon />,
          color: 'error',
          title: 'Error',
          defaultMessage: error?.userMessage || error?.message || 'Authentication failed'
        };
      case 'warning':
        return {
          severity: 'warning',
          icon: <WarningIcon />,
          color: 'warning',
          title: 'Warning',
          defaultMessage: 'Please check your credentials'
        };
      case 'loading':
        return {
          severity: 'info',
          icon: <InfoIcon />,
          color: 'primary',
          title: 'Processing',
          defaultMessage: 'Authenticating...'
        };
      default:
        return null;
    }
  };

  const statusConfig = getStatusConfig();

  if (!statusConfig && !isLoading) {
    return null;
  }

  return (
    <Fade in={true} timeout={300}>
      <Box sx={{ width: '100%', mb: 2 }}>
        {/* Loading Progress Bar */}
        {(isLoading || status === 'loading') && showProgress && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress 
              variant="indeterminate"
              sx={{ 
                borderRadius: 1,
                height: 4
              }}
            />
          </Box>
        )}

        {/* Status Alert */}
        {statusConfig && (
          <Alert 
            severity={statusConfig.severity}
            icon={statusConfig.icon}
            sx={{ 
              mb: 2,
              '& .MuiAlert-message': {
                width: '100%'
              }
            }}
            action={
              status === 'error' && onRetry && canRetry && (
                <Button
                  color="inherit"
                  size="small"
                  onClick={onRetry}
                  disabled={isLoading}
                  startIcon={<RefreshIcon />}
                >
                  Retry
                </Button>
              )
            }
          >
            <Box sx={{ width: '100%' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                {statusConfig.title}
              </Typography>
              <Typography variant="body2">
                {message || statusConfig.defaultMessage}
              </Typography>
              
              {/* Retry Information */}
              {status === 'error' && retryCount > 0 && (
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={`Attempt ${retryCount} of ${maxRetries}`}
                    size="small"
                    variant="outlined"
                    color="warning"
                  />
                  {!canRetry && (
                    <Typography variant="caption" color="text.secondary">
                      Max retries reached
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </Alert>
        )}

        {/* Additional Information */}
        {status === 'error' && error?.type && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Error Type: {error.type}
              {error.statusCode && ` (${error.statusCode})`}
            </Typography>
          </Box>
        )}
      </Box>
    </Fade>
  );
};

export default AuthStatus;
