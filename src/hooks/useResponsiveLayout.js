import { useState, useEffect } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';

export const useResponsiveLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  
  // Viewport dimensions
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Layout configurations
  const getLayoutConfig = () => {
    if (isMobile) {
      return {
        sidebar: { show: false, width: 0 },
        main: { 
          show: true, 
          width: 12, // Full width on mobile
          padding: '0 16px',
          maxWidth: '100%'
        },
        rightPanel: { show: false, width: 0 },
        bottomNav: { show: true, height: 65 },
        appBar: { show: false }, // Hide top app bar on mobile
        containerSpacing: 1
      };
    }
    
    if (isTablet) {
      return {
        sidebar: { show: true, width: 3 },
        main: { 
          show: true, 
          width: 9,
          padding: '0 24px',
          maxWidth: '100%'
        },
        rightPanel: { show: false, width: 0 },
        bottomNav: { show: false, height: 0 },
        appBar: { show: true },
        containerSpacing: 2
      };
    }
    
    // Desktop
    return {
      sidebar: { show: true, width: 3 },
      main: { 
        show: true, 
        width: 6,
        padding: '0 32px',
        maxWidth: '600px'
      },
      rightPanel: { show: true, width: 3 },
      bottomNav: { show: false, height: 0 },
      appBar: { show: true },
      containerSpacing: 3
    };
  };

  const layout = getLayoutConfig();

  // Safe area calculations for mobile devices
  const getSafeAreaInsets = () => {
    if (typeof CSS !== 'undefined' && CSS.supports && CSS.supports('padding-bottom', 'env(safe-area-inset-bottom)')) {
      return {
        top: 'env(safe-area-inset-top)',
        bottom: 'env(safe-area-inset-bottom)',
        left: 'env(safe-area-inset-left)',
        right: 'env(safe-area-inset-right)'
      };
    }
    return {
      top: '0px',
      bottom: '0px',
      left: '0px',
      right: '0px'
    };
  };

  const safeArea = getSafeAreaInsets();

  // Calculate content height considering mobile bottom nav and safe areas
  const getContentHeight = () => {
    const bottomNavHeight = layout.bottomNav.show ? layout.bottomNav.height : 0;
    const safeAreaBottom = isMobile ? 20 : 0; // Approximate safe area
    return `calc(100vh - ${bottomNavHeight + safeAreaBottom}px)`;
  };

  // Optimized scroll behavior for mobile
  const getScrollConfig = () => ({
    hideScrollbar: isMobile,
    smoothScroll: true,
    snapToElement: isMobile,
    overscrollBehavior: isMobile ? 'contain' : 'auto'
  });

  return {
    isMobile,
    isTablet,
    isDesktop,
    viewport,
    layout,
    safeArea,
    contentHeight: getContentHeight(),
    scrollConfig: getScrollConfig(),
    
    // Utility functions
    showComponent: (component) => layout[component]?.show || false,
    getComponentWidth: (component) => layout[component]?.width || 0,
    
    // Responsive styles
    getResponsiveStyle: (styles) => ({
      mobile: isMobile ? styles.mobile || {} : {},
      tablet: isTablet ? styles.tablet || {} : {},
      desktop: isDesktop ? styles.desktop || {} : {}
    })
  };
};

// Hook for responsive text sizes
export const useResponsiveText = () => {
  const { isMobile, isTablet } = useResponsiveLayout();
  
  return {
    h1: isMobile ? '1.5rem' : isTablet ? '2rem' : '2.5rem',
    h2: isMobile ? '1.25rem' : isTablet ? '1.5rem' : '2rem',
    h3: isMobile ? '1.125rem' : isTablet ? '1.25rem' : '1.5rem',
    body1: isMobile ? '0.875rem' : '1rem',
    body2: isMobile ? '0.75rem' : '0.875rem',
    caption: isMobile ? '0.625rem' : '0.75rem'
  };
};

// Hook for responsive spacing
export const useResponsiveSpacing = () => {
  const { isMobile, isTablet } = useResponsiveLayout();
  
  const getSpacing = (mobile, tablet, desktop) => {
    if (isMobile) return mobile;
    if (isTablet) return tablet;
    return desktop;
  };
  
  return {
    xs: getSpacing('4px', '6px', '8px'),
    sm: getSpacing('8px', '12px', '16px'),
    md: getSpacing('12px', '16px', '24px'),
    lg: getSpacing('16px', '24px', '32px'),
    xl: getSpacing('24px', '32px', '48px'),
    getSpacing
  };
};
