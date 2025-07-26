import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { Snackbar, Alert, AlertTitle, Slide, Fade } from '@mui/material';
import { CheckCircleOutline, ErrorOutline, WarningAmber, InfoOutlined } from '@mui/icons-material';

export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

export const TOAST_POSITIONS = {
  TOP_LEFT: { vertical: 'top', horizontal: 'left' },
  TOP_CENTER: { vertical: 'top', horizontal: 'center' },
  TOP_RIGHT: { vertical: 'top', horizontal: 'right' },
  BOTTOM_LEFT: { vertical: 'bottom', horizontal: 'left' },
  BOTTOM_CENTER: { vertical: 'bottom', horizontal: 'center' },
  BOTTOM_RIGHT: { vertical: 'bottom', horizontal: 'right' }
};

const initialState = {
  toasts: [],
  queue: []
};

const TOAST_ACTIONS = {
  ADD_TOAST: 'ADD_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
  CLEAR_ALL: 'CLEAR_ALL'
};

const toastReducer = (state, action) => {
  switch (action.type) {
    case TOAST_ACTIONS.ADD_TOAST:
      return {
        ...state,
        toasts: [...state.toasts, action.payload]
      };
    
    case TOAST_ACTIONS.REMOVE_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload)
      };
    
    case TOAST_ACTIONS.CLEAR_ALL:
      return {
        ...state,
        toasts: []
      };
    
    default:
      return state;
  }
};

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children, maxToasts = 5, defaultDuration = 5000 }) => {
  const [state, dispatch] = useReducer(toastReducer, initialState);

  const addToast = useCallback((message, type = TOAST_TYPES.INFO, options = {}) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const toast = {
      id,
      message,
      type,
      duration: options.duration || defaultDuration,
      persistent: options.persistent || false,
      action: options.action || null,
      position: options.position || TOAST_POSITIONS.TOP_RIGHT,
      title: options.title || null,
      createdAt: Date.now()
    };

    // Remove oldest toast if we've reached the limit
    if (state.toasts.length >= maxToasts) {
      dispatch({ 
        type: TOAST_ACTIONS.REMOVE_TOAST, 
        payload: state.toasts[0].id 
      });
    }

    dispatch({ type: TOAST_ACTIONS.ADD_TOAST, payload: toast });

    if (!toast.persistent) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration);
    }

    return id;
  }, [state.toasts, maxToasts, defaultDuration]);

  const removeToast = useCallback((id) => {
    dispatch({ type: TOAST_ACTIONS.REMOVE_TOAST, payload: id });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: TOAST_ACTIONS.CLEAR_ALL });
  }, []);

  const showSuccess = useCallback((message, options) => 
    addToast(message, TOAST_TYPES.SUCCESS, options), [addToast]);
  
  const showError = useCallback((message, options) => 
    addToast(message, TOAST_TYPES.ERROR, options), [addToast]);
  
  const showWarning = useCallback((message, options) => 
    addToast(message, TOAST_TYPES.WARNING, options), [addToast]);
  
  const showInfo = useCallback((message, options) => 
    addToast(message, TOAST_TYPES.INFO, options), [addToast]);

  const value = {
    toasts: state.toasts,
    addToast,
    removeToast,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={state.toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, onRemove }) => {
  const toastsByPosition = toasts.reduce((acc, toast) => {
    const positionKey = `${toast.position.vertical}-${toast.position.horizontal}`;
    if (!acc[positionKey]) {
      acc[positionKey] = [];
    }
    acc[positionKey].push(toast);
    return acc;
  }, {});

  return (
    <>
      {Object.entries(toastsByPosition).map(([positionKey, positionToasts]) => {
        const position = positionToasts[0]?.position || TOAST_POSITIONS.TOP_RIGHT;
        
        return (
          <div
            key={positionKey}
            style={{
              position: 'fixed',
              zIndex: 9999,
              [position.vertical]: 24,
              [position.horizontal]: 24,
              display: 'flex',
              flexDirection: position.vertical === 'top' ? 'column' : 'column-reverse',
              gap: '12px',
              maxWidth: '400px',
              width: '100%'
            }}
          >
            {positionToasts.map((toast) => (
              <ToastItem
                key={toast.id}
                toast={toast}
                onRemove={onRemove}
              />
            ))}
          </div>
        );
      })}
    </>
  );
};

const ToastItem = ({ toast, onRemove }) => {
  const getIcon = (type) => {
    const iconProps = { sx: { fontSize: 20 } };
    
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return <CheckCircleOutline {...iconProps} />;
      case TOAST_TYPES.ERROR:
        return <ErrorOutline {...iconProps} />;
      case TOAST_TYPES.WARNING:
        return <WarningAmber {...iconProps} />;
      case TOAST_TYPES.INFO:
      default:
        return <InfoOutlined {...iconProps} />;
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    onRemove(toast.id);
  };

  return (
    <Slide
      direction={toast.position.horizontal === 'right' ? 'left' : 'right'}
      in={true}
      mountOnEnter
      unmountOnExit
    >
      <Snackbar
        open={true}
        autoHideDuration={toast.persistent ? null : toast.duration}
        onClose={handleClose}
        TransitionComponent={Fade}
        sx={{
          position: 'static',
          transform: 'none',
          '& .MuiSnackbarContent-root': {
            padding: 0,
            backgroundColor: 'transparent',
            boxShadow: 'none'
          }
        }}
      >
        <Alert
          severity={toast.type}
          onClose={toast.persistent ? undefined : handleClose}
          icon={getIcon(toast.type)}
          sx={{
            minWidth: '300px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            borderRadius: '12px',
            border: '1px solid',
            borderColor: `${toast.type}.light`,
            '& .MuiAlert-message': {
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            },
            '& .MuiAlert-action': {
              paddingTop: '4px'
            }
          }}
          action={toast.action}
        >
          {toast.title && (
            <AlertTitle sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
              {toast.title}
            </AlertTitle>
          )}
          <div style={{ fontSize: '0.875rem', lineHeight: '1.4' }}>
            {toast.message}
          </div>
        </Alert>
      </Snackbar>
    </Slide>
  );
};

// Higher-order component for easy integration
export const withToast = (Component) => {
  return React.forwardRef((props, ref) => (
    <Component {...props} ref={ref} toast={useToast()} />
  ));
};

// Utility function for global toast access (for use in actions, etc.)
let globalToastRef = null;

export const setGlobalToastRef = (ref) => {
  globalToastRef = ref;
};

export const globalToast = {
  success: (message, options) => globalToastRef?.showSuccess(message, options),
  error: (message, options) => globalToastRef?.showError(message, options),
  warning: (message, options) => globalToastRef?.showWarning(message, options),
  info: (message, options) => globalToastRef?.showInfo(message, options)
};

export default ToastProvider;
