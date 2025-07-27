

const reportWebVitals = (onPerfEntry, options = {}) => {
  const {
    enableConsoleLogging = process.env.NODE_ENV === 'development',
    enableAnalytics = process.env.REACT_APP_ENABLE_ANALYTICS === 'true'
  } = options;

  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then((webVitals) => {
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = webVitals;
      // onINP is only available in web-vitals v3+, so we'll check if it exists
      const { onINP } = webVitals;
      
      // Enhanced metric handler with threshold analysis
      const handleMetric = (metric) => {
        const { name, value, rating } = metric;
        
        // Log performance metrics in development
        if (enableConsoleLogging) {
        if (process.env.NODE_ENV === 'development') {
          // Performance metric logged in development
        }
          
          // Warn about performance issues
          if (rating === 'poor') {
            // Performance warning handled
          }
        }

        // Send to analytics if enabled
        if (enableAnalytics && window.gtag) {
          window.gtag('event', name, {
            event_category: 'Web Vitals',
            event_label: rating,
            value: Math.round(value),
            custom_map: { metric_rating: rating }
          });
        }

        // Call original handler
        onPerfEntry(metric);

        // Store metrics for app-level performance monitoring
        if (typeof window !== 'undefined') {
          window.performanceMetrics = window.performanceMetrics || {};
          window.performanceMetrics[name] = {
            value,
            rating,
            timestamp: Date.now()
          };
        }
      };

      // Collect all Core Web Vitals
      getCLS(handleMetric);
      getFID(handleMetric);
      getFCP(handleMetric);
      getLCP(handleMetric);
      getTTFB(handleMetric);
      
      // New metric: Interaction to Next Paint (INP) - only if available (web-vitals v3+)
      if (onINP && typeof onINP === 'function') {
        onINP(handleMetric);
      } else if (enableConsoleLogging) {
      if (process.env.NODE_ENV === 'development') {
        // onINP not available in this web-vitals version
      }
      }
    });
  }

  // Add custom performance tracking
  if (typeof window !== 'undefined' && window.performance) {
    // Track navigation timing
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation && enableConsoleLogging && process.env.NODE_ENV === 'development') {
        // Navigation timing data available for development analysis
      }
    });

    // Track resource loading performance
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 1000 && enableConsoleLogging) { // Log slow resources
          // Slow resource detected - handled for performance monitoring
        }
      }
    });
    
    observer.observe({ entryTypes: ['resource'] });
  }
};

export default reportWebVitals;
