

import { useState, useEffect, useCallback, useRef } from 'react';

export const useScreenReader = () => {
  const announceRef = useRef(null);

  useEffect(() => {
    if (!announceRef.current) {
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.style.position = 'absolute';
      liveRegion.style.left = '-10000px';
      liveRegion.style.width = '1px';
      liveRegion.style.height = '1px';
      liveRegion.style.overflow = 'hidden';
      
      document.body.appendChild(liveRegion);
      announceRef.current = liveRegion;
    }

    return () => {
      if (announceRef.current && announceRef.current.parentNode) {
        announceRef.current.parentNode.removeChild(announceRef.current);
      }
    };
  }, []);

  const announce = useCallback((message, priority = 'polite') => {
    if (announceRef.current) {
      announceRef.current.setAttribute('aria-live', priority);
      announceRef.current.textContent = message;
      setTimeout(() => {
        if (announceRef.current) {
          announceRef.current.textContent = '';
        }
      }, 1000);
    }
  }, []);

  return { announce };
};

// Keyboard navigation
export const useKeyboardNavigation = (options = {}) => {
  const {
    enableArrowKeys = true,
    enableHomeEnd = true,
    enableEscape = true,
    onEscape,
    wrapAround = true,
  } = options;

  const [focusIndex, setFocusIndex] = useState(0);
  const itemsRef = useRef([]);

  const setItemRef = useCallback((index) => (element) => {
    itemsRef.current[index] = element;
  }, []);

  const focusItem = useCallback((index) => {
    const items = itemsRef.current.filter(Boolean);
    if (items[index]) {
      items[index].focus();
      setFocusIndex(index);
    }
  }, []);

  const handleKeyDown = useCallback((event) => {
    const items = itemsRef.current.filter(Boolean);
    const currentIndex = focusIndex;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        if (enableArrowKeys) {
          event.preventDefault();
          const nextIndex = currentIndex + 1;
          const targetIndex = nextIndex >= items.length 
            ? (wrapAround ? 0 : items.length - 1)
            : nextIndex;
          focusItem(targetIndex);
        }
        break;

      case 'ArrowUp':
      case 'ArrowLeft':
        if (enableArrowKeys) {
          event.preventDefault();
          const prevIndex = currentIndex - 1;
          const targetIndex = prevIndex < 0 
            ? (wrapAround ? items.length - 1 : 0)
            : prevIndex;
          focusItem(targetIndex);
        }
        break;

      case 'Home':
        if (enableHomeEnd) {
          event.preventDefault();
          focusItem(0);
        }
        break;

      case 'End':
        if (enableHomeEnd) {
          event.preventDefault();
          focusItem(items.length - 1);
        }
        break;

      case 'Escape':
        if (enableEscape && onEscape) {
          event.preventDefault();
          onEscape();
        }
        break;
    }
  }, [focusIndex, enableArrowKeys, enableHomeEnd, enableEscape, wrapAround, onEscape, focusItem]);

  return {
    focusIndex,
    setItemRef,
    focusItem,
    handleKeyDown,
  };
};

// Focus management
export const useFocusManagement = () => {
  const previousFocusRef = useRef(null);

  const storeFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
      previousFocusRef.current.focus();
    }
  }, []);

  const trapFocus = useCallback((containerRef) => {
    if (!containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (event) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);

    // Focus first element
    if (firstElement) {
      firstElement.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, []);

  return {
    storeFocus,
    restoreFocus,
    trapFocus,
  };
};

// ARIA utilities
export const useARIA = () => {
  const generateId = useCallback((prefix = 'aria') => {
    return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const createARIAProps = useCallback((options = {}) => {
    const {
      label,
      labelledBy,
      describedBy,
      expanded,
      selected,
      disabled,
      required,
      invalid,
      haspopup,
      controls,
      owns,
      live = 'polite',
      atomic = true,
    } = options;

    const props = {};

    if (label) props['aria-label'] = label;
    if (labelledBy) props['aria-labelledby'] = labelledBy;
    if (describedBy) props['aria-describedby'] = describedBy;
    if (expanded !== undefined) props['aria-expanded'] = expanded;
    if (selected !== undefined) props['aria-selected'] = selected;
    if (disabled !== undefined) props['aria-disabled'] = disabled;
    if (required !== undefined) props['aria-required'] = required;
    if (invalid !== undefined) props['aria-invalid'] = invalid;
    if (haspopup) props['aria-haspopup'] = haspopup;
    if (controls) props['aria-controls'] = controls;
    if (owns) props['aria-owns'] = owns;
    if (live) props['aria-live'] = live;
    if (atomic !== undefined) props['aria-atomic'] = atomic;

    return props;
  }, []);

  return {
    generateId,
    createARIAProps,
  };
};

// Color contrast checker
export const useColorContrast = () => {
  const checkContrast = useCallback((foreground, background) => {
    // Convert hex to RGB
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };

    // Calculate relative luminance
    const getLuminance = (rgb) => {
      const { r, g, b } = rgb;
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const fgRgb = hexToRgb(foreground);
    const bgRgb = hexToRgb(background);

    if (!fgRgb || !bgRgb) return null;

    const fgLuminance = getLuminance(fgRgb);
    const bgLuminance = getLuminance(bgRgb);

    const contrast = (Math.max(fgLuminance, bgLuminance) + 0.05) / 
                    (Math.min(fgLuminance, bgLuminance) + 0.05);

    return {
      ratio: contrast,
      AA: contrast >= 4.5,
      AAA: contrast >= 7,
      level: contrast >= 7 ? 'AAA' : contrast >= 4.5 ? 'AA' : 'Fail'
    };
  }, []);

  return { checkContrast };
};

// Reduced motion detection
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// High contrast mode detection
export const useHighContrast = () => {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const checkHighContrast = () => {
      // Check for Windows high contrast mode
      if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(-ms-high-contrast: active)');
        setIsHighContrast(mediaQuery.matches);
      }
    };

    checkHighContrast();
    window.addEventListener('change', checkHighContrast);
    
    return () => window.removeEventListener('change', checkHighContrast);
  }, []);

  return isHighContrast;
};
