import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Box, Typography, Button, Paper, Container } from '@mui/material';
import { ErrorOutline, Refresh, BugReport, Home } from '@mui/icons-material';
import Logger from '../utils/Logger';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Log the error with detailed information
  Logger.error('ErrorBoundary', 'Application error occurred', {
    error: error.message,
    stack: error.stack,
    errorId,
    url: window.location.href,
    userAgent: navigator.userAgent
  });

  const handleReportBug = () => {
    const subject = `Bug Report - Error ${errorId}`;
    const body = `
Error ID: ${errorId}
Error Message: ${error?.message || 'Unknown error'}
URL: ${window.location.href}
Browser: ${navigator.userAgent}
Timestamp: ${new Date().toISOString()}

Please describe what you were doing when this error occurred:

`;
    
    const mailtoLink = `mailto:support@socialapp.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };
  
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={6}
        sx={{
          p: 6,
          textAlign: 'center',
          borderRadius: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <ErrorOutline sx={{ fontSize: 80, mb: 3, opacity: 0.9 }} />
        
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Oops! Something went wrong
        </Typography>
        
        <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
          We encountered an unexpected error
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4, opacity: 0.8, maxWidth: '600px', mx: 'auto' }}>
          Don't worry, our team has been automatically notified about this issue. 
          You can try refreshing the page or go back to the home page.
        </Typography>

        <Typography variant="body2" sx={{ mb: 4, opacity: 0.7 }}>
          Error ID: {errorId}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<Refresh />}
            onClick={resetErrorBoundary}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              py: 1.5,
              px: 3,
              fontWeight: 600,
              borderRadius: 3,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.3)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            Try Again
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            startIcon={<Home />}
            onClick={handleGoHome}
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.5)',
              color: 'white',
              py: 1.5,
              px: 3,
              fontWeight: 600,
              borderRadius: 3,
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            Go Home
          </Button>

          <Button
            variant="text"
            size="medium"
            startIcon={<BugReport />}
            onClick={handleReportBug}
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: 500,
              '&:hover': {
                color: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            Report Bug
          </Button>
        </Box>

        {process.env.NODE_ENV === 'development' && (
          <Paper
            sx={{
              p: 3,
              mt: 4,
              bgcolor: 'rgba(0, 0, 0, 0.8)',
              color: '#ff6b6b',
              textAlign: 'left',
              fontFamily: 'Monaco, Consolas, monospace',
              fontSize: '0.85rem',
              maxHeight: 300,
              overflow: 'auto',
              borderRadius: 2
            }}
          >
            <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', margin: 0 }}>
              {error.message}
              {error.stack && `\n\nStack trace:\n${error.stack}`}
            </Typography>
          </Paper>
        )}
      </Paper>
    </Container>
  );
};

const AppErrorBoundary = ({ children }) => {
  const handleError = (error, errorInfo) => {
    Logger.error('ErrorBoundary', 'Application error caught', { 
      error: error.message, 
      stack: error.stack,
      componentStack: errorInfo.componentStack 
    });
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleError}
      onReset={() => {
        Logger.info('ErrorBoundary', 'Error boundary reset triggered');
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default AppErrorBoundary;
