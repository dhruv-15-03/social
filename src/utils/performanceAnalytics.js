/**
 * Professional Performance Analytics for Social Media App
 * Real-time monitoring and optimization insights
 */

import { logger } from '../utils/logger';

class PerformanceAnalytics {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
    this.enabled = process.env.NODE_ENV === 'development';
  }

  // Component render time monitoring
  startComponentRender(componentName) {
    if (!this.enabled) return null;
    
    const startTime = performance.now();
    const sessionId = `${componentName}_${Date.now()}_${Math.random()}`;
    
    this.metrics.set(sessionId, {
      component: componentName,
      startTime,
      type: 'render'
    });

    return sessionId;
  }

  endComponentRender(sessionId, props = {}) {
    if (!this.enabled || !sessionId) return;
    
    const metric = this.metrics.get(sessionId);
    if (!metric) return;

    const endTime = performance.now();
    const duration = endTime - metric.startTime;
    
    logger.performance(`Component ${metric.component} rendered in ${duration.toFixed(2)}ms`, {
      component: metric.component,
      duration,
      props: Object.keys(props).length,
      timestamp: new Date().toISOString()
    });

    // Alert for slow renders (>16ms for 60fps)
    if (duration > 16) {
      logger.warn(`Slow render detected: ${metric.component} took ${duration.toFixed(2)}ms`, {
        component: metric.component,
        duration,
        threshold: 16
      });
    }

    this.metrics.delete(sessionId);
  }

  // Memory usage monitoring
  checkMemoryUsage(context = 'general') {
    if (!this.enabled || !performance.memory) return;

    const memory = performance.memory;
    const memoryInfo = {
      used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
      total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
      limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024),
      context
    };

    logger.performance(`Memory usage: ${memoryInfo.used}MB/${memoryInfo.total}MB (${context})`, memoryInfo);

    // Alert for high memory usage (>100MB)
    if (memoryInfo.used > 100) {
      logger.warn(`High memory usage detected: ${memoryInfo.used}MB`, memoryInfo);
    }

    return memoryInfo;
  }

  // Redux action performance
  measureReduxAction(actionType, actionFn) {
    if (!this.enabled) return actionFn;

    return async (...args) => {
      const startTime = performance.now();
      
      try {
        const result = await actionFn(...args);
        const duration = performance.now() - startTime;
        
        logger.performance(`Redux action ${actionType} completed in ${duration.toFixed(2)}ms`, {
          action: actionType,
          duration,
          success: true
        });

        return result;
      } catch (error) {
        const duration = performance.now() - startTime;
        
        logger.error(`Redux action ${actionType} failed after ${duration.toFixed(2)}ms`, {
          action: actionType,
          duration,
          error: error.message
        });

        throw error;
      }
    };
  }

  // Network request monitoring
  measureNetworkRequest(url, requestFn) {
    if (!this.enabled) return requestFn;

    return async (...args) => {
      const startTime = performance.now();
      
      try {
        const result = await requestFn(...args);
        const duration = performance.now() - startTime;
        
        logger.performance(`Network request to ${url} completed in ${duration.toFixed(2)}ms`, {
          url,
          duration,
          success: true,
          status: result?.status
        });

        // Alert for slow requests (>2000ms)
        if (duration > 2000) {
          logger.warn(`Slow network request: ${url} took ${duration.toFixed(2)}ms`, {
            url,
            duration,
            threshold: 2000
          });
        }

        return result;
      } catch (error) {
        const duration = performance.now() - startTime;
        
        logger.error(`Network request to ${url} failed after ${duration.toFixed(2)}ms`, {
          url,
          duration,
          error: error.message
        });

        throw error;
      }
    };
  }

  // Performance summary
  getPerformanceSummary() {
    if (!this.enabled) return null;

    const summary = {
      timestamp: new Date().toISOString(),
      memory: this.checkMemoryUsage('summary'),
      activeMetrics: this.metrics.size,
      environment: process.env.NODE_ENV
    };

    logger.info('Performance Summary', summary);
    return summary;
  }

  // Initialize Intersection Observer for lazy loading
  initLazyLoadingObserver(callback) {
    if (!this.enabled || !window.IntersectionObserver) return null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const startTime = performance.now();
            callback(entry.target);
            const duration = performance.now() - startTime;
            
            logger.performance(`Lazy loaded element in ${duration.toFixed(2)}ms`, {
              element: entry.target.tagName,
              duration
            });
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    return observer;
  }
}

// Professional Performance Hook for React components
export const usePerformanceProfiler = (componentName) => {
  const analytics = window.performanceAnalytics || new PerformanceAnalytics();
  
  // Store analytics instance globally for access across components
  if (!window.performanceAnalytics) {
    window.performanceAnalytics = analytics;
  }

  const React = require('react');
  
  React.useEffect(() => {
    const sessionId = analytics.startComponentRender(componentName);
    
    return () => {
      analytics.endComponentRender(sessionId);
    };
  });

  React.useEffect(() => {
    analytics.checkMemoryUsage(componentName);
  }, [componentName]);

  return {
    measureOperation: (operationName, operationFn) => {
      return analytics.measureReduxAction(`${componentName}:${operationName}`, operationFn);
    },
    checkMemory: () => analytics.checkMemoryUsage(componentName),
    getSummary: () => analytics.getPerformanceSummary()
  };
};

export default PerformanceAnalytics;
