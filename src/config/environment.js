/**
 * Environment Configuration Utility
 * 
 * This module provides a centralized way to access environment variables
 * with proper validation, type conversion, and fallback values.
 */

class EnvironmentConfig {
  constructor() {
    this.validateEnvironment();
  }

  /**
   * Validates that required environment variables are present
   */
  validateEnvironment() {
    const required = [
      'REACT_APP_API_URL',
      'REACT_APP_CLOUDINARY_CLOUD_NAME',
      'REACT_APP_CLOUDINARY_UPLOAD_PRESET'
    ];

    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      console.warn('Missing environment variables:', missing);
    }
  }

  /**
   * Gets a string environment variable with optional fallback
   */
  getString(key, fallback = '') {
    return process.env[key] || fallback;
  }

  /**
   * Gets a number environment variable with optional fallback
   */
  getNumber(key, fallback = 0) {
    const value = process.env[key];
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? fallback : parsed;
  }

  /**
   * Gets a boolean environment variable with optional fallback
   */
  getBoolean(key, fallback = false) {
    const value = process.env[key];
    if (value === undefined) return fallback;
    return value.toLowerCase() === 'true';
  }

  /**
   * Gets an array environment variable with optional fallback
   */
  getArray(key, separator = ',', fallback = []) {
    const value = process.env[key];
    return value ? value.split(separator).map(item => item.trim()) : fallback;
  }

  // Application Configuration
  get app() {
    return {
      name: this.getString('REACT_APP_NAME', 'Social Media App'),
      version: this.getString('REACT_APP_VERSION', '1.0.0'),
      environment: this.getString('REACT_APP_ENVIRONMENT', 'development'),
      isDevelopment: this.getString('REACT_APP_ENVIRONMENT', 'development') === 'development',
      isProduction: this.getString('REACT_APP_ENVIRONMENT', 'development') === 'production',
    };
  }

  // API Configuration
  get api() {
    return {
      baseUrl: this.getString('REACT_APP_API_URL', 'https://thought-0hcs.onrender.com'),
      timeout: this.getNumber('REACT_APP_API_TIMEOUT', 30000),
      retryCount: this.getNumber('REACT_APP_API_RETRY_COUNT', 3),
      wsUrl: this.getString('REACT_APP_WS_URL', 'https://thought-0hcs.onrender.com/ws'),
    };
  }

  // Cloudinary Configuration
  get cloudinary() {
    return {
      cloudName: this.getString('REACT_APP_CLOUDINARY_CLOUD_NAME', 'dbnn4rikb'),
      uploadPreset: this.getString('REACT_APP_CLOUDINARY_UPLOAD_PRESET', 'ml_default'),
      apiUrl: this.getString('REACT_APP_CLOUDINARY_API_URL', 'https://api.cloudinary.com/v1_1'),
    };
  }

  // Authentication Configuration
  get auth() {
    return {
      storageKey: this.getString('REACT_APP_JWT_STORAGE_KEY', 'jwt'),
      sessionTimeout: this.getNumber('REACT_APP_SESSION_TIMEOUT', 3600000),
    };
  }

  // UI/UX Configuration
  get ui() {
    return {
      defaultTheme: this.getString('REACT_APP_DEFAULT_THEME', 'light'),
      maxFileSize: this.getNumber('REACT_APP_MAX_FILE_SIZE', 10),
      supportedImageFormats: this.getArray('REACT_APP_SUPPORTED_IMAGE_FORMATS', ',', ['jpeg', 'jpg', 'png', 'gif', 'webp']),
      imageQuality: this.getNumber('REACT_APP_IMAGE_QUALITY', 80),
      lazyLoadingThreshold: this.getNumber('REACT_APP_LAZY_LOADING_THRESHOLD', 100),
    };
  }

  // Feature Flags
  get features() {
    return {
      performanceMonitoring: this.getBoolean('REACT_APP_ENABLE_PERFORMANCE_MONITORING', true),
      errorLogging: this.getBoolean('REACT_APP_ENABLE_ERROR_LOGGING', true),
      analytics: this.getBoolean('REACT_APP_ENABLE_ANALYTICS', false),
      devTools: this.getBoolean('REACT_APP_ENABLE_DEV_TOOLS', true),
    };
  }

  // Social Features Configuration
  get social() {
    return {
      maxPostLength: this.getNumber('REACT_APP_MAX_POST_LENGTH', 500),
      maxStoryDuration: this.getNumber('REACT_APP_MAX_STORY_DURATION', 30),
      postsPerPage: this.getNumber('REACT_APP_POSTS_PER_PAGE', 10),
      realtimeInterval: this.getNumber('REACT_APP_REALTIME_INTERVAL', 5000),
    };
  }

  /**
   * Gets the complete configuration object
   */
  getConfig() {
    return {
      app: this.app,
      api: this.api,
      cloudinary: this.cloudinary,
      auth: this.auth,
      ui: this.ui,
      features: this.features,
      social: this.social,
    };
  }

  /**
   * Logs current configuration (development only)
   */
  logConfig() {
    if (this.app.isDevelopment) {
      console.group('🔧 Application Configuration');
      console.table(this.getConfig());
      console.groupEnd();
    }
  }
}

// Create and export singleton instance
const envConfig = new EnvironmentConfig();

// Log configuration in development
if (process.env.NODE_ENV === 'development') {
  envConfig.logConfig();
}

export default envConfig;
