import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Skeleton, Typography, Button, Alert } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import WifiOffIcon from '@mui/icons-material/WifiOff';

export const AppLoader = ({ timeout = 30000, onTimeout = null }) => {
  const [showTimeout, setShowTimeout] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTimeout(true);
      if (onTimeout) onTimeout();
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout, onTimeout]);

  const handleRetry = () => {
    setIsRetrying(true);
    setShowTimeout(false);
    window.location.reload();
  };

  if (showTimeout) {
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
        <WifiOffIcon sx={{ fontSize: 64, mb: 2, opacity: 0.8 }} />
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, textAlign: 'center' }}>
          Connection Timeout
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.8, mb: 3, textAlign: 'center' }}>
          The application is taking longer than expected to load.
        </Typography>
        <Button
          variant="contained"
          onClick={handleRetry}
          disabled={isRetrying}
          startIcon={isRetrying ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' }
          }}
        >
          {isRetrying ? 'Retrying...' : 'Try Again'}
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}
    >
      <Box sx={{ position: 'relative', mb: 3 }}>
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '24px',
        }}
      >
        🚀
      </Box>
    </Box>
    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
      Loading Social
    </Typography>
    <Typography variant="body2" sx={{ opacity: 0.8 }}>
      Getting everything ready for you...
    </Typography>
  </Box>
  );
};

export const PageLoader = ({ 
  message = "Loading...", 
  timeout = 15000,
  onTimeout = null,
  onRetry = null 
}) => {
  const [showTimeout, setShowTimeout] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (timeout > 0) {
      const timer = setTimeout(() => {
        setShowTimeout(true);
        if (onTimeout) onTimeout();
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [timeout, onTimeout]);

  const handleRetry = async () => {
    setIsRetrying(true);
    setShowTimeout(false);
    
    if (onRetry) {
      try {
        await onRetry();
      } catch (error) {
        console.error('Retry failed:', error);
        setShowTimeout(true);
      }
    }
    
    setIsRetrying(false);
  };

  if (showTimeout) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
          padding: 3
        }}
      >
        <Alert 
          severity="warning" 
          sx={{ mb: 2, width: '100%', maxWidth: 400 }}
        >
          Request is taking longer than expected
        </Alert>
        {onRetry && (
          <Button
            variant="outlined"
            onClick={handleRetry}
            disabled={isRetrying}
            startIcon={isRetrying ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
          >
            {isRetrying ? 'Retrying...' : 'Try Again'}
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        padding: 3
      }}
    >
      <CircularProgress 
        size={48} 
        thickness={4} 
        sx={{ 
          mb: 2,
          color: 'primary.main',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          },
        }} 
      />
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

export const ApiErrorBoundary = ({ 
  error, 
  onRetry = null, 
  message = "Something went wrong" 
}) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (onRetry) {
      setIsRetrying(true);
      try {
        await onRetry();
      } catch (err) {
        console.error('Retry failed:', err);
      }
      setIsRetrying(false);
    }
  };

  const getErrorMessage = () => {
    if (error?.message?.includes('timeout')) {
      return "Request timed out. Please check your connection and try again.";
    }
    if (error?.message?.includes('Network Error')) {
      return "Network error. Please check your internet connection.";
    }
    if (error?.response?.status >= 500) {
      return "Server error. Please try again later.";
    }
    if (error?.response?.status === 429) {
      return "Too many requests. Please wait a moment and try again.";
    }
    return error?.message || message;
  };

  const getErrorIcon = () => {
    if (error?.message?.includes('timeout') || error?.message?.includes('Network Error')) {
      return <WifiOffIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />;
    }
    return <Box sx={{ fontSize: 48, mb: 2 }}>⚠️</Box>;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        p: 3,
        textAlign: 'center'
      }}
    >
      {getErrorIcon()}
      <Typography variant="h6" color="error" gutterBottom>
        {getErrorMessage()}
      </Typography>
      {error?.response?.status && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Error Code: {error.response.status}
        </Typography>
      )}
      {onRetry && (
        <Button
          variant="contained"
          onClick={handleRetry}
          disabled={isRetrying}
          startIcon={isRetrying ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
        >
          {isRetrying ? 'Retrying...' : 'Try Again'}
        </Button>
      )}
    </Box>
  );
};

export const PostCardSkeleton = () => (
  <Box
    sx={{
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 2,
      p: 2,
      mb: 2,
      bgcolor: 'background.paper'
    }}
  >
    {/* Header */}
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Skeleton variant="circular" width={44} height={44} />
      <Box sx={{ ml: 2, flex: 1 }}>
        <Skeleton variant="text" width="30%" height={20} />
        <Skeleton variant="text" width="20%" height={16} />
      </Box>
      <Skeleton variant="circular" width={24} height={24} />
    </Box>
    
    {/* Content */}
    <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
    <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
    
    {/* Image placeholder */}
    <Skeleton 
      variant="rectangular" 
      width="100%" 
      height={200} 
      sx={{ borderRadius: 1, mb: 2 }} 
    />
    
    {/* Actions */}
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="circular" width={32} height={32} />
      </Box>
      <Skeleton variant="circular" width={32} height={32} />
    </Box>
  </Box>
);

export const StoryCircleSkeleton = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 2 }}>
    <Skeleton 
      variant="circular" 
      width={60} 
      height={60} 
      sx={{ mb: 1 }}
    />
    <Skeleton variant="text" width={50} height={14} />
  </Box>
);

export const UserCardSkeleton = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      p: 2,
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 2,
      mb: 1
    }}
  >
    <Skeleton variant="circular" width={40} height={40} />
    <Box sx={{ ml: 2, flex: 1 }}>
      <Skeleton variant="text" width="60%" height={18} />
      <Skeleton variant="text" width="40%" height={14} />
    </Box>
    <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
  </Box>
);

export const ButtonLoader = ({ size = 20 }) => (
  <CircularProgress 
    size={size} 
    thickness={4}
    sx={{ 
      color: 'inherit',
      '& .MuiCircularProgress-circle': {
        strokeLinecap: 'round',
      },
    }} 
  />
);

export const TextShimmer = ({ width = '100%', height = 20, lines = 1 }) => (
  <Box>
    {Array.from({ length: lines }, (_, index) => (
      <Skeleton
        key={index}
        variant="text"
        width={typeof width === 'string' ? width : `${width}%`}
        height={height}
        sx={{ mb: index < lines - 1 ? 0.5 : 0 }}
      />
    ))}
  </Box>
);

export const ImageLoader = ({ src, alt, width, height, borderRadius = 1 }) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  return (
    <Box sx={{ position: 'relative', width, height }}>
      {loading && (
        <Skeleton
          variant="rectangular"
          width={width}
          height={height}
          sx={{ 
            position: 'absolute', 
            borderRadius,
            zIndex: 1 
          }}
        />
      )}
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: borderRadius * 8,
          opacity: loading ? 0 : 1,
          transition: 'opacity 0.3s ease'
        }}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
      />
      {error && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'grey.100',
            borderRadius,
            color: 'text.secondary'
          }}
        >
          <Typography variant="body2">Failed to load</Typography>
        </Box>
      )}
    </Box>
  );
};

export const FormLoader = ({ loading, children }) => (
  <Box sx={{ position: 'relative' }}>
    {children}
    {loading && (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: 1,
          zIndex: 10
        }}
      >
        <CircularProgress size={32} />
      </Box>
    )}
  </Box>
);

const LoadingComponentsExport = {
  AppLoader,
  PageLoader,
  PostCardSkeleton,
  StoryCircleSkeleton,
  UserCardSkeleton,
  ButtonLoader,
  TextShimmer,
  ImageLoader,
  FormLoader,
  ApiErrorBoundary
};

export default LoadingComponentsExport;
