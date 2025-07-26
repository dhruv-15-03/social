import React from 'react';
import { Box, Button, Typography, Card, Container } from '@mui/material';
import { Refresh as RefreshIcon, Home as HomeIcon, BugReport as BugReportIcon } from '@mui/icons-material';
import { logger } from '../../utils/productionLogger';

class ProductionErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorId: `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error, errorInfo) {
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Log error for production monitoring
    logger.error('React Error Boundary caught error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });

    this.setState({
      error,
      errorInfo,
      errorId
    });

    // In production, you might want to send this to an error tracking service
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo, errorId);
    }
  }

  reportError = (error, errorInfo, errorId) => {
    // Example: Send to error tracking service
    try {
      // This would typically be Sentry, LogRocket, or similar
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        errorId,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        userId: localStorage.getItem(process.env.REACT_APP_JWT_STORAGE_KEY) ? 'authenticated' : 'anonymous'
      };

      // For now, store in localStorage for debugging
      const errors = JSON.parse(localStorage.getItem('react_errors') || '[]');
      errors.push(errorReport);
      if (errors.length > 10) {
        errors.splice(0, errors.length - 10);
      }
      localStorage.setItem('react_errors', JSON.stringify(errors));
    } catch (e) {
      // Fail silently
    }
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReportBug = () => {
    const { error, errorId } = this.state;
    const subject = encodeURIComponent(`Bug Report - ${errorId}`);
    const body = encodeURIComponent(`
Error ID: ${errorId}
Error Message: ${error?.message || 'Unknown error'}
URL: ${window.location.href}
Time: ${new Date().toISOString()}

Please describe what you were doing when this error occurred:
`);
    
    window.open(`mailto:support@thoughts.app?subject=${subject}&body=${body}`);
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md" sx={{ mt: 8 }}>
          <Card 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3
            }}
          >
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
              🚧 Oops! Something went wrong
            </Typography>
            
            <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
              We encountered an unexpected error
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 4, opacity: 0.8, maxWidth: '600px', mx: 'auto' }}>
              Don't worry, our team has been automatically notified about this issue. 
              You can try refreshing the page or go back to the home page.
            </Typography>

            <Typography variant="body2" sx={{ mb: 4, opacity: 0.7 }}>
              Error ID: {this.state.errorId}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<RefreshIcon />}
                onClick={this.handleReset}
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
                startIcon={<HomeIcon />}
                onClick={this.handleGoHome}
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
                startIcon={<BugReportIcon />}
                onClick={this.handleReportBug}
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

            {/* Development-only error details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box
                sx={{
                  mt: 4,
                  p: 3,
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
                <Typography variant="h6" sx={{ color: '#ff6b6b', mb: 2 }}>
                  Development Error Details:
                </Typography>
                <div>
                  <strong>Error:</strong> {this.state.error.message}
                </div>
                <div style={{ marginTop: '10px' }}>
                  <strong>Stack:</strong>
                  <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {this.state.error.stack}
                  </pre>
                </div>
                {this.state.errorInfo?.componentStack && (
                  <div style={{ marginTop: '10px' }}>
                    <strong>Component Stack:</strong>
                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </Box>
            )}
          </Card>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ProductionErrorBoundary;
