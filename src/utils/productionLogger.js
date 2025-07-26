
class ProductionLogger {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.isProduction = process.env.NODE_ENV === 'production';
    this.enableErrorLogging = process.env.REACT_APP_ENABLE_ERROR_LOGGING === 'true';
  }

  dev(message, ...args) {
    if (this.isDevelopment) {
      console.log(`🔧 [DEV] ${message}`, ...args);
    }
  }

  info(message, ...args) {
    if (this.isDevelopment) {
      console.log(`ℹ️ [INFO] ${message}`, ...args);
    }
  }

  warn(message, ...args) {
    if (this.isDevelopment) {
      console.warn(`⚠️ [WARN] ${message}`, ...args);
    } else if (this.enableErrorLogging) {
      this.sendToErrorService('warning', message, args);
    }
  }

  error(message, ...args) {
    if (this.isDevelopment) {
      console.error(`❌ [ERROR] ${message}`, ...args);
    } else if (this.enableErrorLogging) {
      // In production, send to error tracking service
      this.sendToErrorService('error', message, args);
    }
  }

  performance(message, data) {
    if (this.isDevelopment && process.env.REACT_APP_ENABLE_PERFORMANCE_MONITORING === 'true') {
      console.log(`⚡ [PERF] ${message}`, data);
    }
  }

  api(type, message, data) {
    if (this.isDevelopment) {
      const emoji = type === 'request' ? '📡' : type === 'response' ? '✅' : '❌';
      console.log(`${emoji} [API] ${message}`, data);
    }
  }

  auth = {
    info: (message, ...args) => this.info(`[AUTH] ${message}`, ...args),
    login: (message, ...args) => this.info(`[LOGIN] ${message}`, ...args),
    register: (message, ...args) => this.info(`[REGISTER] ${message}`, ...args),
    profile: (message, ...args) => this.info(`[PROFILE] ${message}`, ...args),
    error: (message, ...args) => this.error(`[AUTH] ${message}`, ...args),
    warn: (message, ...args) => this.warn(`[AUTH] ${message}`, ...args),
    logout: (message, ...args) => this.info(`[LOGOUT] ${message}`, ...args)
  };

  sendToErrorService(level, message, args) {
    try {
      const errorData = {
        level,
        message,
        args,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: localStorage.getItem(process.env.REACT_APP_JWT_STORAGE_KEY) ? 'authenticated' : 'anonymous'
      };

      if (level === 'error') {
        const errors = JSON.parse(localStorage.getItem('production_errors') || '[]');
        errors.push(errorData);
        if (errors.length > 50) {
          errors.splice(0, errors.length - 50);
        }
        localStorage.setItem('production_errors', JSON.stringify(errors));
      }
    } catch (e) {
    }
  }

  getProductionErrors() {
    try {
      return JSON.parse(localStorage.getItem('production_errors') || '[]');
    } catch {
      return [];
    }
  }

  clearProductionErrors() {
    localStorage.removeItem('production_errors');
  }
}

const logger = new ProductionLogger();

export const console_safe = {
  log: logger.dev.bind(logger),
  info: logger.info.bind(logger),
  warn: logger.warn.bind(logger),
  error: logger.error.bind(logger)
};

export { logger };
export default logger;
