/**
 * Production Security Utilities
 * Enhanced security measures for production deployment
 */

import { logger } from '../utils/productionLogger';

export class SecurityManager {
  constructor() {
    this.sessionTimeout = parseInt(process.env.REACT_APP_SESSION_TIMEOUT) || 3600000; // 1 hour
    this.storageKey = process.env.REACT_APP_JWT_STORAGE_KEY || 'thoughts_jwt';
    this.lastActivity = Date.now();
    this.sessionWarningShown = false;
    
    if (process.env.NODE_ENV === 'production') {
      this.initializeSecurityMonitoring();
    }
  }

  /**
   * Initialize security monitoring for production
   */
  initializeSecurityMonitoring() {
    // Monitor for session timeout
    this.startSessionMonitoring();
    
    // Monitor for suspicious activity
    this.detectSuspiciousActivity();
    
    // Set up CSP violation reporting
    this.setupCSPReporting();
    
    // Monitor for XSS attempts
    this.monitorXSS();
  }

  /**
   * Session timeout monitoring
   */
  startSessionMonitoring() {
    setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - this.lastActivity;
      
      // Warning at 55 minutes
      if (timeSinceLastActivity > this.sessionTimeout - 300000 && !this.sessionWarningShown) {
        this.showSessionWarning();
        this.sessionWarningShown = true;
      }
      
      // Force logout at 1 hour
      if (timeSinceLastActivity > this.sessionTimeout) {
        this.forceLogout('Session timeout');
      }
    }, 60000); // Check every minute

    // Reset activity timer on user interaction
    ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, () => {
        this.lastActivity = Date.now();
        this.sessionWarningShown = false;
      }, { passive: true });
    });
  }

  /**
   * Show session warning to user
   */
  showSessionWarning() {
    logger.warn('Session timeout warning shown');
    
    // You could show a toast or modal here
    if (window.confirm('Your session will expire in 5 minutes. Would you like to extend it?')) {
      this.extendSession();
    }
  }

  /**
   * Extend user session
   */
  extendSession() {
    this.lastActivity = Date.now();
    this.sessionWarningShown = false;
    logger.info('User session extended');
  }

  /**
   * Force logout user
   */
  forceLogout(reason) {
    logger.warn('Force logout triggered', { reason });
    
    // Clear all auth data
    localStorage.removeItem(this.storageKey);
    sessionStorage.clear();
    
    // Redirect to login
    window.location.href = '/auth';
  }

  /**
   * Detect suspicious activity
   */
  detectSuspiciousActivity() {
    let requestCount = 0;
    let lastRequestTime = Date.now();
    
    // Monitor API request frequency
    const originalFetch = window.fetch;
    window.fetch = (...args) => {
      const now = Date.now();
      
      // Reset counter every minute
      if (now - lastRequestTime > 60000) {
        requestCount = 0;
        lastRequestTime = now;
      }
      
      requestCount++;
      
      // Flag if more than 100 requests per minute
      if (requestCount > 100) {
        logger.error('Suspicious API activity detected', {
          requestCount,
          timeWindow: '1 minute',
          url: args[0]
        });
        
        // Could implement rate limiting here
      }
      
      return originalFetch.apply(this, args);
    };
  }

  /**
   * Setup CSP violation reporting
   */
  setupCSPReporting() {
    document.addEventListener('securitypolicyviolation', (e) => {
      logger.error('CSP Violation detected', {
        blockedURI: e.blockedURI,
        violatedDirective: e.violatedDirective,
        originalPolicy: e.originalPolicy,
        documentURI: e.documentURI,
        referrer: e.referrer,
        lineNumber: e.lineNumber,
        columnNumber: e.columnNumber,
        sourceFile: e.sourceFile
      });
    });
  }

  /**
   * Monitor for XSS attempts
   */
  monitorXSS() {
    // Monitor for script injection attempts
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const scripts = node.querySelectorAll?.('script') || [];
              if (scripts.length > 0 || node.tagName === 'SCRIPT') {
                logger.error('Potential XSS attempt detected', {
                  nodeType: node.nodeType,
                  tagName: node.tagName,
                  innerHTML: node.innerHTML?.substring(0, 100)
                });
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Sanitize user input
   */
  static sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  /**
   * Validate JWT token format
   */
  static isValidJWTFormat(token) {
    if (!token || typeof token !== 'string') return false;
    
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    try {
      // Basic format validation
      parts.forEach(part => {
        atob(part.replace(/-/g, '+').replace(/_/g, '/'));
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(token) {
    if (!this.isValidJWTFormat(token)) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch {
      return true;
    }
  }

  /**
   * Generate secure random string
   */
  static generateSecureToken(length = 32) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}

// Initialize security manager for production
const securityManager = new SecurityManager();

export default securityManager;
