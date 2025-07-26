

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppLoader } from '../UI/LoadingComponents';
import { restoreSessionAction } from '../../Redux/Auth/auth.actiion';

const SimpleAuthWrapper = ({ children, loginComponent: LoginComponent }) => {
  const { auth } = useSelector(store => store);
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const jwt = localStorage.getItem('jwt');
        if (jwt && jwt.length > 10) {
          // Restoring session...
          await dispatch(restoreSessionAction());
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();
  }, [dispatch]);

  if (isInitializing || auth.loading) {
    return <AppLoader />;
  }

  if (!auth.user) {
    return LoginComponent ? <LoginComponent /> : <div>Please login</div>;
  }

  return children;
};

export default SimpleAuthWrapper;
