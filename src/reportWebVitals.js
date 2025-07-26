

const reportWebVitals = (onPerfEntry, options = {}) => {
  const {
    enableConsoleLogging = process.env.NODE_ENV === 'development',
    enableAnalytics = process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    threshold = {
      CLS: 0.1,     // Cumulative Layout Shift
      FID: 100,     // First Input Delay (ms)
      FCP: 1800,    // First Contentful Paint (ms)
      LCP: 2500,    // Largest Contentful Paint (ms)
      TTFB: 800,    // Time to First Byte (ms)
    }
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
          const emoji = rating === 'good' ? '🟢' : rating === 'needs-improvement' ? '🟡' : '🔴';
        if (process.env.NODE_ENV === 'development') {
          console.log(`${emoji} ${name}: ${value.toFixed(2)}ms (${rating})`);
        }
          
          // Warn about performance issues
          if (rating === 'poor') {
            console.warn(`⚠️ Performance Warning: ${name} is ${value.toFixed(2)}ms (threshold: ${threshold[name] || 'N/A'})`);
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
        console.log('ℹ️ onINP not available in this web-vitals version. Consider upgrading to v3+ for INP support.');
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
        console.log('📊 Navigation Timing:', {
          'DNS Lookup': navigation.domainLookupEnd - navigation.domainLookupStart,
          'TCP Connection': navigation.connectEnd - navigation.connectStart,
          'Request': navigation.responseStart - navigation.requestStart,
          'Response': navigation.responseEnd - navigation.responseStart,
          'DOM Processing': navigation.domContentLoadedEventEnd - navigation.responseEnd,
          'Load Complete': navigation.loadEventEnd - navigation.domContentLoadedEventEnd,
          'Total Load Time': navigation.loadEventEnd - navigation.navigationStart
        });
      }
    });

    // Track resource loading performance
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 1000 && enableConsoleLogging) { // Log slow resources
          console.warn(`🐌 Slow Resource: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
        }
      }
    });
    
    observer.observe({ entryTypes: ['resource'] });
  }
};

export default reportWebVitals;
