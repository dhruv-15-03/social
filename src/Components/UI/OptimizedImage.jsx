

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Box, Skeleton, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, ZoomIn, ZoomOut, Fullscreen } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  fallbackSrc,
  quality = 80,
  sizes = '100vw',
  loading = 'lazy',
  enableFullscreen = false,
  enableZoom = false,
  showSkeleton = true,
  aspectRatio,
  objectFit = 'cover',
  objectPosition = 'center',
  onLoad,
  onError,
  ...props
}) => {
  const [imageState, setImageState] = useState({
    isLoading: true,
    hasError: false,
    isFullscreen: false,
    zoomLevel: 1,
  });
  
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!imgRef.current || loading !== 'lazy') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [loading]);

  const generateImageSources = useCallback((originalSrc) => {
    if (!originalSrc) return { webp: '', avif: '', fallback: originalSrc || fallbackSrc };

    if (originalSrc.includes('cloudinary.com')) {
      const baseUrl = originalSrc.split('/upload/')[0] + '/upload/';
      const imagePath = originalSrc.split('/upload/')[1];
      
      const optimizations = [
        'f_auto',       
        'q_auto',       
        `q_${quality}`, 
        'w_auto',       
        'dpr_auto',     
        'c_limit',      
      ].join(',');

      return {
        avif: `${baseUrl}${optimizations},f_avif/${imagePath}`,
        webp: `${baseUrl}${optimizations},f_webp/${imagePath}`,
        fallback: `${baseUrl}${optimizations}/${imagePath}`,
      };
    }

    return {
      webp: originalSrc,
      avif: originalSrc,
      fallback: originalSrc,
    };
  }, [quality, fallbackSrc]);

  const imageSources = generateImageSources(src);

  const handleImageLoad = useCallback((event) => {
    setImageState(prev => ({ ...prev, isLoading: false, hasError: false }));
    onLoad?.(event);
  }, [onLoad]);

  const handleImageError = useCallback((event) => {
    setImageState(prev => ({ ...prev, isLoading: false, hasError: true }));
    onError?.(event);
  }, [onError]);

  const handleFullscreen = useCallback(() => {
    setImageState(prev => ({ ...prev, isFullscreen: !prev.isFullscreen }));
  }, []);

  const handleZoom = useCallback((direction) => {
    setImageState(prev => ({
      ...prev,
      zoomLevel: direction === 'in' 
        ? Math.min(prev.zoomLevel * 1.5, 4) 
        : Math.max(prev.zoomLevel / 1.5, 0.5)
    }));
  }, []);

  const resetZoom = useCallback(() => {
    setImageState(prev => ({ ...prev, zoomLevel: 1 }));
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (imageState.isFullscreen) {
        switch (event.key) {
          case 'Escape':
            setImageState(prev => ({ ...prev, isFullscreen: false }));
            break;
          case '+':
          case '=':
            handleZoom('in');
            break;
          case '-':
            handleZoom('out');
            break;
          case '0':
            resetZoom();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [imageState.isFullscreen, handleZoom, resetZoom]);

  const containerStyles = {
    position: 'relative',
    width: width || '100%',
    height: height || (aspectRatio ? 'auto' : '100%'),
    aspectRatio: aspectRatio || 'auto',
    overflow: 'hidden',
  };

  const imageStyles = {
    width: '100%',
    height: '100%',
    objectFit,
    objectPosition,
    transition: 'transform 0.3s ease',
    transform: enableZoom ? `scale(${imageState.zoomLevel})` : 'none',
  };

  if (imageState.isFullscreen) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={handleFullscreen}
        >
          {/* Fullscreen Controls */}
          <Box
            position="absolute"
            top={16}
            right={16}
            display="flex"
            gap={1}
            zIndex={10000}
          >
            {enableZoom && (
              <>
                <IconButton
                  onClick={(e) => { e.stopPropagation(); handleZoom('in'); }}
                  sx={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                  <ZoomIn />
                </IconButton>
                <IconButton
                  onClick={(e) => { e.stopPropagation(); handleZoom('out'); }}
                  sx={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                  <ZoomOut />
                </IconButton>
                <IconButton
                  onClick={(e) => { e.stopPropagation(); resetZoom(); }}
                  sx={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                  0
                </IconButton>
              </>
            )}
            <IconButton
              onClick={(e) => { e.stopPropagation(); handleFullscreen(); }}
              sx={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.5)' }}
            >
              ✕
            </IconButton>
          </Box>

          <img
            src={imageSources.fallback}
            alt={alt}
            style={{
              maxWidth: '95vw',
              maxHeight: '95vh',
              objectFit: 'contain',
              transform: enableZoom ? `scale(${imageState.zoomLevel})` : 'none',
              transition: 'transform 0.3s ease',
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <Box
      ref={containerRef}
      className={className}
      sx={containerStyles}
      {...props}
    >
      {/* Loading Skeleton */}
      {imageState.isLoading && showSkeleton && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        />
      )}

      {/* Image Controls Overlay */}
      {(enableFullscreen || enableZoom) && !imageState.isLoading && !imageState.hasError && (
        <Box
          position="absolute"
          top={8}
          right={8}
          display="flex"
          gap={0.5}
          opacity={0}
          transition="opacity 0.3s ease"
          zIndex={2}
          sx={{
            '&:hover': { opacity: 1 },
            [`${containerRef.current}:hover &`]: { opacity: 1 },
          }}
        >
          {enableZoom && (
            <>
              <IconButton
                size="small"
                onClick={() => handleZoom('in')}
                sx={{ 
                  backgroundColor: 'rgba(0,0,0,0.6)', 
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' }
                }}
              >
                <ZoomIn fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleZoom('out')}
                sx={{ 
                  backgroundColor: 'rgba(0,0,0,0.6)', 
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' }
                }}
              >
                <ZoomOut fontSize="small" />
              </IconButton>
            </>
          )}
          {enableFullscreen && (
            <IconButton
              size="small"
              onClick={handleFullscreen}
              sx={{ 
                backgroundColor: 'rgba(0,0,0,0.6)', 
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' }
              }}
            >
              <Fullscreen fontSize="small" />
            </IconButton>
          )}
        </Box>
      )}

      {/* The actual image */}
      {isInView && !imageState.hasError && (
        <picture ref={imgRef}>
          {/* AVIF format for best compression */}
          <source srcSet={imageSources.avif} type="image/avif" />
          
          {/* WebP format for better compression */}
          <source srcSet={imageSources.webp} type="image/webp" />
          
          {/* Fallback image */}
          <img
            src={imageSources.fallback}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            style={imageStyles}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading={loading}
          />
        </picture>
      )}

      {/* Error Fallback */}
      {imageState.hasError && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
          bgcolor="grey.100"
          color="text.secondary"
          flexDirection="column"
          gap={1}
        >
          <VisibilityOff />
          <span style={{ fontSize: '0.875rem' }}>Image not available</span>
        </Box>
      )}
    </Box>
  );
};

export default OptimizedImage;
