import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { AppLoader, PageLoader } from '../UI/LoadingComponents';
import Logger from '../utils/Logger';

// Lazy load components for better performance
const Authentication = React.lazy(() => import('../../Pages/Files/Authentication'));
const HomePage = React.lazy(() => import('../../Pages/Home/HomePage'));
const Messages = React.lazy(() => import('../../Pages/Messages/Messages'));
const Profile = React.lazy(() => import('../../Pages/Profile/Profile'));

/**
 * Route Guard Component
 * Protects routes based on authentication status
 */
const ProtectedRoute = ({ children, requireAuth = true, redirectTo = '/auth' }) => {
  const { auth } = useSelector(store => store);
  const isAuthenticated = auth.jwt && auth.user;
  
  if (requireAuth && !isAuthenticated) {
    Logger.warn('Route', 'Unauthorized access attempt, redirecting to auth');
    return <Navigate to={redirectTo} replace />;
  }
  
  if (!requireAuth && isAuthenticated) {
    Logger.info('Route', 'Authenticated user accessing public route, redirecting to home');
    return <Navigate to="/" replace />;
  }
  
  return children;
};

/**
 * Page Transition Wrapper
 * Provides smooth animations between routes
 */
const PageTransition = ({ children }) => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1]
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * Custom Suspense Wrapper with Enhanced Loading
 */
const RouteSuspense = ({ children, name }) => {
  return (
    <Suspense 
      fallback={
        <PageLoader message={`Loading ${name}...`} />
      }
    >
      {children}
    </Suspense>
  );
};

/**
 * Main App Router with Professional Features
 */
const AppRouter = () => {
  const { auth } = useSelector(store => store);
  const location = useLocation();
  
  // Log route changes for analytics
  React.useEffect(() => {
    Logger.info('Navigation', `Route changed to ${location.pathname}`, {
      pathname: location.pathname,
      search: location.search,
      isAuthenticated: !!auth.jwt
    });
  }, [location, auth.jwt]);

  return (
    <PageTransition>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/auth" 
          element={
            <ProtectedRoute requireAuth={false}>
              <RouteSuspense name="Authentication">
                <Authentication />
              </RouteSuspense>
            </ProtectedRoute>
          } 
        />
        
        {/* Protected Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute requireAuth={true}>
              <RouteSuspense name="Home">
                <HomePage />
              </RouteSuspense>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/messages" 
          element={
            <ProtectedRoute requireAuth={true}>
              <RouteSuspense name="Messages">
                <Messages />
              </RouteSuspense>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/profile/:userId?" 
          element={
            <ProtectedRoute requireAuth={true}>
              <RouteSuspense name="Profile">
                <Profile />
              </RouteSuspense>
            </ProtectedRoute>
          } 
        />
        
        {/* Catch-all route for 404 */}
        <Route 
          path="*" 
          element={
            <NotFoundPage />
          } 
        />
      </Routes>
    </PageTransition>
  );
};

/**
 * Professional 404 Page
 */
const NotFoundPage = () => {
  const { auth } = useSelector(store => store);
  const isAuthenticated = !!auth.jwt;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md mx-auto text-center px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            404
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. 
            It might have been moved or doesn't exist.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={() => window.location.href = isAuthenticated ? '/' : '/auth'}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg"
            >
              {isAuthenticated ? 'Go Home' : 'Go to Login'}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AppRouter;
