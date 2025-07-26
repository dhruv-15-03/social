

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import VirtualScrollList from './VirtualScrollList';

const InfiniteScrollList = React.memo(({
  items = [],
  renderItem,
  loadMore,
  hasNextPage = true,
  isLoading = false,
  itemHeight = 100,
  containerHeight = 400,
  threshold = 0.8,
  loadingComponent = null,
  errorComponent = null,
  emptyComponent = null,
  estimatedItemHeight = null,
  className = ''
}) => {
  const [error, setError] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const lastLoadTime = useRef(0);
  const loadingDebounceRef = useRef(null);

  const defaultLoadingComponent = (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      py={2}
    >
      <CircularProgress size={24} />
      <Typography variant="body2" sx={{ ml: 1 }}>
        Loading more...
      </Typography>
    </Box>
  );

  const defaultErrorComponent = (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      py={2}
    >
      <Typography variant="body2" color="error">
        Failed to load more items. Please try again.
      </Typography>
    </Box>
  );

  const defaultEmptyComponent = (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      <Typography variant="body1" color="text.secondary">
        No items to display
      </Typography>
    </Box>
  );

  const debouncedLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasNextPage || isLoading) return;

    const now = Date.now();
    if (now - lastLoadTime.current < 1000) return; 

    try {
      setIsLoadingMore(true);
      setError(null);
      lastLoadTime.current = now;
      
      await loadMore();
    } catch (err) {
      console.error('Error loading more items:', err);
      setError(err.message || 'Failed to load more items');
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasNextPage, isLoading, loadMore]);

  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    if (scrollPercentage >= threshold && hasNextPage && !isLoadingMore && !isLoading) {
      if (loadingDebounceRef.current) {
        clearTimeout(loadingDebounceRef.current);
      }

      loadingDebounceRef.current = setTimeout(() => {
        debouncedLoadMore();
      }, 200);
    }
  }, [threshold, hasNextPage, isLoadingMore, isLoading, debouncedLoadMore]);

  useEffect(() => {
    return () => {
      if (loadingDebounceRef.current) {
        clearTimeout(loadingDebounceRef.current);
      }
    };
  }, []);

  const enhancedRenderItem = useCallback((item, index) => {
    return (
      <Box
        key={`item-${index}`}
        sx={{
          opacity: isLoading && index >= items.length - 5 ? 0.7 : 1,
          transition: 'opacity 0.2s ease-in-out'
        }}
      >
        {renderItem(item, index)}
      </Box>
    );
  }, [renderItem, isLoading, items.length]);

  if (!items.length && !isLoading) {
    return emptyComponent || defaultEmptyComponent;
  }

  return (
    <Box className={`infinite-scroll-container ${className}`}>
      <VirtualScrollList
        items={items}
        renderItem={enhancedRenderItem}
        itemHeight={itemHeight}
        containerHeight={containerHeight}
        estimatedItemHeight={estimatedItemHeight}
        onScroll={handleScroll}
      />
      
      {/* Loading indicator */}
      {(isLoadingMore || isLoading) && (
        <Box sx={{ position: 'sticky', bottom: 0, zIndex: 1 }}>
          {loadingComponent || defaultLoadingComponent}
        </Box>
      )}
      
      {/* Error indicator */}
      {error && (
        <Box sx={{ position: 'sticky', bottom: 0, zIndex: 1 }}>
          {errorComponent || defaultErrorComponent}
        </Box>
      )}
      
      {/* End of list indicator */}
      {!hasNextPage && items.length > 0 && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          py={2}
        >
          <Typography variant="body2" color="text.secondary">
            No more items to load
          </Typography>
        </Box>
      )}
    </Box>
  );
});

InfiniteScrollList.displayName = 'InfiniteScrollList';

export default InfiniteScrollList;
