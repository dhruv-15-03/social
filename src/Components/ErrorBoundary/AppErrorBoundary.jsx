import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import RefreshIcon from '@mui/icons-material/Refresh';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 3,
        bgcolor: 'background.default'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 500,
          textAlign: 'center',
          borderRadius: 2
        }}
      >
        <ErrorIcon 
          sx={{ 
            fontSize: 64, 
            color: 'error.main',
            mb: 2
          }} 
        />
        <Typography variant="h4" gutterBottom color="error">
          Oops! Something went wrong
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {error?.message || 'An unexpected error occurred. Please try refreshing the page.'}
        </Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={resetErrorBoundary}
          sx={{ mt: 2 }}
        >
          Try Again
        </Button>
      </Paper>
    </Box>
  );
};

const AppErrorBoundary = ({ children }) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Error caught by ErrorBoundary:', error, errorInfo);
        // You can add error reporting service here
        if (process.env.REACT_APP_ENABLE_ERROR_REPORTING === 'true') {
          // Add your error reporting logic here
        }
      }}
      onReset={() => {
        // Clear any cached data if needed
        window.location.reload();
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default AppErrorBoundary;
