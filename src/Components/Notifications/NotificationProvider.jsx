

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Alert, AlertTitle, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationContext = createContext();

const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

const DEFAULT_SETTINGS = {
  duration: 6000,
  position: { vertical: 'top', horizontal: 'right' },
  maxVisible: 3,
  preventDuplicates: true,
};

let notificationId = 0;

const NotificationProvider = ({ children, settings = {} }) => {
  const config = { ...DEFAULT_SETTINGS, ...settings };
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const addNotification = useCallback((notification) => {
    const id = ++notificationId;
    const newNotification = {
      id,
      type: NOTIFICATION_TYPES.INFO,
      duration: config.duration,
      dismissible: true,
      persistent: false,
      ...notification,
      timestamp: Date.now(),
    };

    setNotifications(prev => {
      if (config.preventDuplicates) {
        const isDuplicate = prev.some(n => 
          n.message === newNotification.message && 
          n.type === newNotification.type &&
          (Date.now() - n.timestamp) < 5000 
        );
        
        if (isDuplicate) {
          return prev;
        }
      }

      const updated = [newNotification, ...prev];
      if (updated.length > config.maxVisible) {
        return updated.slice(0, config.maxVisible);
      }
      
      return updated;
    });

    if (!newNotification.persistent && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, [config.duration, config.maxVisible, config.preventDuplicates, removeNotification]);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const showSuccess = useCallback((message, options = {}) => {
    return addNotification({
      ...options,
      message,
      type: NOTIFICATION_TYPES.SUCCESS,
    });
  }, [addNotification]);

  const showError = useCallback((message, options = {}) => {
    return addNotification({
      ...options,
      message,
      type: NOTIFICATION_TYPES.ERROR,
      duration: options.duration || 8000, // Longer for errors
    });
  }, [addNotification]);

  const showWarning = useCallback((message, options = {}) => {
    return addNotification({
      ...options,
      message,
      type: NOTIFICATION_TYPES.WARNING,
      duration: options.duration || 7000,
    });
  }, [addNotification]);

  const showInfo = useCallback((message, options = {}) => {
    return addNotification({
      ...options,
      message,
      type: NOTIFICATION_TYPES.INFO,
    });
  }, [addNotification]);

  const contextValue = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  useEffect(() => {
    window.showNotification = addNotification;
    window.showSuccess = showSuccess;
    window.showError = showError;
    window.showWarning = showWarning;
    window.showInfo = showInfo;

    return () => {
      delete window.showNotification;
      delete window.showSuccess;
      delete window.showError;
      delete window.showWarning;
      delete window.showInfo;
    };
  }, [addNotification, showSuccess, showError, showWarning, showInfo]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <NotificationContainer 
        notifications={notifications}
        onRemove={removeNotification}
        position={config.position}
      />
    </NotificationContext.Provider>
  );
};

const NotificationItem = ({ notification, onRemove, index }) => {
  const { id, type, message, title, dismissible, action, icon } = notification;

  const handleClose = useCallback((event, reason) => {
    if (reason === 'clickaway' && !dismissible) {
      return;
    }
    onRemove(id);
  }, [id, onRemove, dismissible]);

  const notificationVariants = {
    initial: { 
      opacity: 0, 
      x: 300, 
      scale: 0.8,
      rotateZ: 10 
    },
    animate: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      rotateZ: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: index * 0.1
      }
    },
    exit: { 
      opacity: 0, 
      x: 300, 
      scale: 0.8,
      rotateZ: -10,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div
      layout
      variants={notificationVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        marginBottom: '8px',
        transformOrigin: 'right center'
      }}
    >
      <Alert
        severity={type}
        onClose={dismissible ? handleClose : undefined}
        icon={icon}
        action={
          <>
            {action}
            {dismissible && (
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </>
        }
        sx={{
          minWidth: '300px',
          maxWidth: '500px',
          boxShadow: 3,
          borderRadius: 2,
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </motion.div>
  );
};

// Notification Container
const NotificationContainer = ({ notifications, onRemove, position }) => {
  const containerStyle = {
    position: 'fixed',
    zIndex: 9999,
    pointerEvents: 'none',
    [position.vertical]: '24px',
    [position.horizontal]: '24px',
    maxHeight: 'calc(100vh - 48px)',
    overflow: 'hidden',
  };

  return (
    <div style={containerStyle}>
      <AnimatePresence mode="popLayout">
        {notifications.map((notification, index) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRemove={onRemove}
            index={index}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const withNotifications = (Component) => {
  return function WrappedComponent(props) {
    return (
      <NotificationProvider>
        <Component {...props} />
      </NotificationProvider>
    );
  };
};

export { NotificationProvider, NOTIFICATION_TYPES };
export default NotificationProvider;
