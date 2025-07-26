/**
 * Security Utilities for the Social Media App
 * Provides input sanitization, XSS protection, and security validations
 */

/**
 * Input sanitization utilities
 */
export class SecurityUtils {
  // XSS Protection
  static sanitizeHtml(input) {
    if (typeof input !== 'string') return input;
    
    const entityMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;'
    };
    
    return input.replace(/[&<>"'`=\/]/g, (s) => entityMap[s]);
  }

  // SQL Injection Protection
  static sanitizeForDatabase(input) {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/'/g, "''")
      .replace(/;/g, '')
      .replace(/--/g, '')
      .replace(/\/\*/g, '')
      .replace(/\*\//g, '');
  }

  // URL validation
  static isValidUrl(string) {
    try {
      const url = new URL(string);
      return ['http:', 'https:'].includes(url.protocol);
    } catch (_) {
      return false;
    }
  }

  // Email validation
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Strong password validation
  static validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const isValid = 
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar;
    
    return {
      isValid,
      errors: {
        minLength: password.length < minLength,
        upperCase: !hasUpperCase,
        lowerCase: !hasLowerCase,
        numbers: !hasNumbers,
        specialChar: !hasSpecialChar
      }
    };
  }

  // Content filtering for inappropriate content
  static filterProfanity(text) {
    // Basic profanity filter - in production, use a proper service
    const profanityList = ['spam', 'scam', 'fake', 'fraud'];
    let filteredText = text;
    
    profanityList.forEach(word => {
      const regex = new RegExp(word, 'gi');
      filteredText = filteredText.replace(regex, '*'.repeat(word.length));
    });
    
    return filteredText;
  }

  // Rate limiting helper
  static createRateLimiter(maxRequests, timeWindow) {
    const requests = new Map();
    
    return (identifier) => {
      const now = Date.now();
      const userRequests = requests.get(identifier) || [];
      
      // Remove requests outside the time window
      const validRequests = userRequests.filter(
        timestamp => now - timestamp < timeWindow
      );
      
      if (validRequests.length >= maxRequests) {
        return false; // Rate limit exceeded
      }
      
      validRequests.push(now);
      requests.set(identifier, validRequests);
      
      return true; // Request allowed
    };
  }

  // JWT validation
  static isValidJWT(token) {
    if (!token) return false;
    
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    try {
      // Validate base64 encoding
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      
      // Check expiration
      if (payload.exp && payload.exp < Date.now() / 1000) {
        return false;
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }

  // File upload security
  static validateFileUpload(file, options = {}) {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'],
      allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.mp4']
    } = options;

    const errors = [];

    // Size check
    if (file.size > maxSize) {
      errors.push(`File size must be less than ${maxSize / 1024 / 1024}MB`);
    }

    // Type check
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} is not allowed`);
    }

    // Extension check
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      errors.push(`File extension ${fileExtension} is not allowed`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Generate secure random string
  static generateSecureToken(length = 32) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    if (window.crypto && window.crypto.getRandomValues) {
      const values = new Uint8Array(length);
      window.crypto.getRandomValues(values);
      
      for (let i = 0; i < length; i++) {
        result += charset[values[i] % charset.length];
      }
    } else {
      // Fallback for older browsers
      for (let i = 0; i < length; i++) {
        result += charset.charAt(Math.floor(Math.random() * charset.length));
      }
    }
    
    return result;
  }

  // Check if running in secure context
  static isSecureContext() {
    return window.isSecureContext || window.location.protocol === 'https:';
  }

  // Content Security Policy helper
  static getCSPViolations() {
    return new Promise((resolve) => {
      const violations = [];
      
      document.addEventListener('securitypolicyviolation', (e) => {
        violations.push({
          blockedURI: e.blockedURI,
          violatedDirective: e.violatedDirective,
          originalPolicy: e.originalPolicy,
          timestamp: Date.now()
        });
      });
      
      // Return violations after a short delay
      setTimeout(() => resolve(violations), 1000);
    });
  }
}

/**
 * Privacy utilities
 */
export class PrivacyUtils {
  // Mask sensitive data
  static maskEmail(email) {
    const [username, domain] = email.split('@');
    const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
    return `${maskedUsername}@${domain}`;
  }

  static maskPhoneNumber(phone) {
    return phone.replace(/(\d{3})\d{3}(\d{4})/, '$1***$2');
  }

  // Data anonymization
  static anonymizeUserData(userData) {
    return {
      ...userData,
      id: SecurityUtils.generateSecureToken(8),
      email: this.maskEmail(userData.email),
      phone: userData.phone ? this.maskPhoneNumber(userData.phone) : undefined,
      ip: undefined,
      lastLogin: undefined
    };
  }

  // Local storage encryption (basic)
  static encryptLocalStorage(key, data) {
    try {
      const encrypted = btoa(JSON.stringify(data));
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Failed to encrypt and store data:', error);
    }
  }

  static decryptLocalStorage(key) {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      
      return JSON.parse(atob(encrypted));
    } catch (error) {
      console.error('Failed to decrypt stored data:', error);
      return null;
    }
  }
}

export default { SecurityUtils, PrivacyUtils };
