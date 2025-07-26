class Logger {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.levels = {
      ERROR: 0,
      WARN: 1,
      INFO: 2,
      DEBUG: 3
    };
    this.currentLevel = this.isDevelopment ? this.levels.DEBUG : this.levels.ERROR;
    
    this.initializeAuthMethods();
    this.initializeApiMethods();
    this.initializePerformanceMethods();
  }

  error(message, ...args) {
    if (this.currentLevel >= this.levels.ERROR) {
      console.error(`🔴 [ERROR] ${message}`, ...args);
    }
  }

  warn(message, ...args) {
    if (this.currentLevel >= this.levels.WARN) {
      console.warn(`🟡 [WARN] ${message}`, ...args);
    }
  }

  info(message, ...args) {
    if (this.currentLevel >= this.levels.INFO) {
      console.info(`🔵 [INFO] ${message}`, ...args);
    }
  }

  debug(message, ...args) {
    if (this.currentLevel >= this.levels.DEBUG) {
      console.log(`⚪ [DEBUG] ${message}`, ...args);
    }
  }

  initializeAuthMethods() {
    this.auth = {
      login: (message, ...args) => this.info(`🔐 AUTH: ${message}`, ...args),
      logout: (message, ...args) => this.info(`🔓 AUTH: ${message}`, ...args),
      register: (message, ...args) => this.info(`📝 AUTH: ${message}`, ...args),
      profile: (message, ...args) => this.info(`👤 AUTH: ${message}`, ...args),
      error: (message, ...args) => this.error(`❌ AUTH: ${message}`, ...args),
      warn: (message, ...args) => this.warn(`⚠️ AUTH: ${message}`, ...args),
      info: (message, ...args) => this.info(`ℹ️ AUTH: ${message}`, ...args)
    };
  }

  initializeApiMethods() {
    this.api = {
      request: (message, ...args) => this.debug(`📡 API: ${message}`, ...args),
      response: (message, ...args) => this.debug(`✅ API: ${message}`, ...args),
      error: (message, ...args) => this.error(`🚨 API: ${message}`, ...args)
    };
  }

  initializePerformanceMethods() {
    this.performance = {
      start: (label) => {
        if (this.isDevelopment && typeof performance !== 'undefined') {
          performance.mark(`${label}-start`);
        }
      },
      end: (label) => {
        if (this.isDevelopment && typeof performance !== 'undefined') {
          performance.mark(`${label}-end`);
          performance.measure(label, `${label}-start`, `${label}-end`);
          const measure = performance.getEntriesByName(label)[0];
          this.debug(`⏱️ PERFORMANCE: ${label} took ${measure.duration.toFixed(2)}ms`);
        }
      }
    };
  }
}

export const logger = new Logger();
export default logger;
