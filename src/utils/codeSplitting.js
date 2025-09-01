

import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, Skeleton } from '@mui/material';

const LoadingFallbacks = {
  default: (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="200px"
    >
      <CircularProgress />
    </Box>
  ),

  card: (
    <Box p={2}>
      <Skeleton variant="rectangular" width="100%" height={200} />
      <Box pt={1}>
        <Skeleton width="60%" />
        <Skeleton width="40%" />
      </Box>
    </Box>
  ),

  // List skeleton for feeds
  list: (
    <Box>
      {[...Array(5)].map((_, index) => (
        <Box key={index} p={2} borderBottom="1px solid #eee">
          <Box display="flex" alignItems="center" mb={1}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box ml={2} flex={1}>
              <Skeleton width="30%" />
              <Skeleton width="20%" />
            </Box>
          </Box>
          <Skeleton width="100%" />
          <Skeleton width="80%" />
        </Box>
      ))}
    </Box>
  ),

  // Profile skeleton
  profile: (
    <Box p={3}>
      <Box display="flex" alignItems="center" mb={3}>
        <Skeleton variant="circular" width={80} height={80} />
        <Box ml={3}>
          <Skeleton width={200} height={30} />
          <Skeleton width={150} height={20} />
          <Skeleton width={100} height={20} />
        </Box>
      </Box>
      <Skeleton variant="rectangular" height={300} />
    </Box>
  ),

  // Custom error boundary
  error: ({ error, retry }) => (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center"
      minHeight="200px"
      p={3}
    >
      <Typography variant="h6" color="error" gutterBottom>
        Failed to load component
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        {error?.message || 'An unexpected error occurred'}
      </Typography>
      <button onClick={retry} style={{ padding: '8px 16px' }}>
        Try Again
      </button>
    </Box>
  )
};

// Enhanced lazy loading with retry logic
export const createLazyComponent = (importFn, fallbackType = 'default') => {
  const LazyComponent = lazy(() => 
    importFn().catch(error => {
      console.error('Code splitting error:', error);
      // Return a fallback component on load failure
      return { 
        default: () => LoadingFallbacks.error({ 
          error, 
          retry: () => window.location.reload() 
        })
      };
    })
  );

  return React.memo((props) => (
    <Suspense fallback={LoadingFallbacks[fallbackType] || LoadingFallbacks.default}>
      <LazyComponent {...props} />
    </Suspense>
  ));
};

// Progressive loading component
export const ProgressiveLoader = React.memo(({ 
  children, 
  fallback = LoadingFallbacks.default,
  delay = 200,
  timeout = 10000 
}) => {
  const [showFallback, setShowFallback] = useState(false);
  const [hasTimedOut, setHasTimedOut] = useState(false);

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setShowFallback(true);
    }, delay);

    const timeoutTimer = setTimeout(() => {
      setHasTimedOut(true);
    }, timeout);

    return () => {
      clearTimeout(delayTimer);
      clearTimeout(timeoutTimer);
    };
  }, [delay, timeout]);

  if (hasTimedOut) {
    return LoadingFallbacks.error({ 
      error: new Error('Component load timeout'),
      retry: () => window.location.reload()
    });
  }

  return (
    <Suspense fallback={showFallback ? fallback : null}>
      {children}
    </Suspense>
  );
});

// Route-based code splitting utility
export const createRouteComponent = (importFn, fallbackType = 'default') => {
  return createLazyComponent(importFn, fallbackType);
};

// Feature-based code splitting
export const createFeatureComponent = (importFn, featureName) => {
  const LazyFeature = lazy(async () => {
    try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 Loading feature: ${featureName}`);
    }
      const startTime = performance.now();
      
      const module = await importFn();
      
      const loadTime = performance.now() - startTime;
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Feature ${featureName} loaded in ${loadTime.toFixed(2)}ms`);
    }
      
      return module;
    } catch (error) {
      console.error(`❌ Failed to load feature ${featureName}:`, error);
      throw error;
    }
  });

  return React.memo((props) => (
    <ProgressiveLoader fallback={LoadingFallbacks.card}>
      <LazyFeature {...props} />
    </ProgressiveLoader>
  ));
};

// Bundle analyzer helper
export const BundleAnalyzer = {
  // Track loaded chunks
  loadedChunks: new Set(),
  
  // Log chunk loading
  onChunkLoad: (chunkName) => {
    BundleAnalyzer.loadedChunks.add(chunkName);
  if (process.env.NODE_ENV === 'development') {
    console.log(`📦 Chunk loaded: ${chunkName}`);
    console.log(`📊 Total chunks loaded: ${BundleAnalyzer.loadedChunks.size}`);
  }
  },
  
  // Get bundle metrics
  getMetrics: () => ({
    loadedChunks: Array.from(BundleAnalyzer.loadedChunks),
    totalChunks: BundleAnalyzer.loadedChunks.size,
    estimatedBundleSize: BundleAnalyzer.loadedChunks.size * 50 // Rough estimate in KB
  })
};

// Preload utility for critical routes
export const preloadRoute = (importFn) => {
  const componentImport = importFn();
  return componentImport;
};

// Lazy load specific components with prefetching
export const LazyComponents = {
  // User Profile (heavy component)
  Profile: createFeatureComponent(
    () => import('../Pages/Profile/Profile'),
    'Profile'
  ),
  
  // Messages (real-time features)
  Messages: createFeatureComponent(
    () => import('../Pages/Messages/Messages'),
    'Messages'
  ),
  
  // Search Users (search functionality)
  SearchUser: createFeatureComponent(
    () => import('../Components/SearchUser/SearchUser'),
    'SearchUser'
  ),

  // Reels (video processing)
  Reels: createFeatureComponent(
    () => import('../Components/MiddlePart/Reels/Reels'),
    'Reels'
  )
};

// Preload critical components on app init
export const preloadCriticalComponents = () => {
  // Preload likely-to-be-used components
  const criticalImports = [
    () => import('../Components/Post/PostCard'),
    () => import('../Components/MiddlePart/MiddlePart'),
    () => import('../Components/SideBar/Sidebar')
  ];

  criticalImports.forEach((importFn, index) => {
    setTimeout(() => {
      importFn().catch(console.error);
    }, index * 100); // Stagger the preloads
  });
};

export default {
  createLazyComponent,
  createRouteComponent,
  createFeatureComponent,
  ProgressiveLoader,
  LazyComponents,
  BundleAnalyzer,
  preloadRoute,
  preloadCriticalComponents
};
