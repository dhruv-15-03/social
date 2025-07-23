import { useEffect } from 'react';

const PerformanceMonitor = () => {
  useEffect(() => {
    // Only enable in development
    if (process.env.NODE_ENV !== 'production' || 
        process.env.REACT_APP_ENABLE_PERFORMANCE_MONITORING !== 'true') {
      return;
    }

    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'measure') {
          console.log(`Performance: ${entry.name} took ${entry.duration}ms`);
        }
        
        // Log Web Vitals
        if (entry.entryType === 'navigation') {
          console.log('Navigation timing:', entry);
        }
        
        if (entry.entryType === 'paint') {
          console.log(`${entry.name}: ${entry.startTime}ms`);
        }
      });
    });

    // Observe different types of performance entries
    try {
      observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] });
    } catch (e) {
      console.warn('Performance monitoring not fully supported:', e);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // This component doesn't render anything
  return null;
};

export default PerformanceMonitor;
