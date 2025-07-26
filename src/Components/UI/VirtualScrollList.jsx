

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Box } from '@mui/material';

const VirtualScrollList = React.memo(({
  items = [],
  itemHeight = 100,
  containerHeight = 400,
  renderItem,
  overscan = 5,
  className = '',
  onScroll = null,
  estimatedItemHeight = null
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerRect, setContainerRect] = useState({ height: containerHeight });
  const containerRef = useRef(null);
  const scrollElementRef = useRef(null);

  const itemHeights = useRef(new Map());
  const totalHeight = useRef(0);

  const visibleRange = useMemo(() => {
    if (!items.length) return { start: 0, end: 0 };

    const actualItemHeight = estimatedItemHeight || itemHeight;
    const containerHeight = containerRect.height;
    
    const start = Math.floor(scrollTop / actualItemHeight);
    const visibleCount = Math.ceil(containerHeight / actualItemHeight);
    const end = Math.min(start + visibleCount + overscan, items.length);

    return {
      start: Math.max(0, start - overscan),
      end
    };
  }, [scrollTop, containerRect.height, items.length, itemHeight, estimatedItemHeight, overscan]);

  const calculateTotalHeight = useCallback(() => {
    if (estimatedItemHeight) {
      let height = 0;
      for (let i = 0; i < items.length; i++) {
        const itemHeight = itemHeights.current.get(i) || estimatedItemHeight;
        height += itemHeight;
      }
      totalHeight.current = height;
    } else {
      totalHeight.current = items.length * itemHeight;
    }
  }, [items.length, itemHeight, estimatedItemHeight]);

  const getItemOffset = useCallback((index) => {
    if (estimatedItemHeight) {
      let offset = 0;
      for (let i = 0; i < index; i++) {
        const height = itemHeights.current.get(i) || estimatedItemHeight;
        offset += height;
      }
      return offset;
    }
    return index * itemHeight;
  }, [itemHeight, estimatedItemHeight]);

  // Handle scroll events
  const handleScroll = useCallback((e) => {
    const newScrollTop = e.target.scrollTop;
    setScrollTop(newScrollTop);
    onScroll?.(e);
  }, [onScroll]);

  // Update container dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerRect({ height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Recalculate when items change
  useEffect(() => {
    calculateTotalHeight();
  }, [calculateTotalHeight]);

  // Item height measurement for dynamic heights
  const measureItemHeight = useCallback((index, element) => {
    if (estimatedItemHeight && element) {
      const height = element.getBoundingClientRect().height;
      if (itemHeights.current.get(index) !== height) {
        itemHeights.current.set(index, height);
        calculateTotalHeight();
      }
    }
  }, [estimatedItemHeight, calculateTotalHeight]);

  // Render visible items
  const visibleItems = useMemo(() => {
    const items_to_render = [];
    
    for (let i = visibleRange.start; i < visibleRange.end; i++) {
      const item = items[i];
      if (!item) continue;

      const offset = getItemOffset(i);
      
      items_to_render.push(
        <div
          key={i}
          style={{
            position: 'absolute',
            top: offset,
            left: 0,
            right: 0,
            height: estimatedItemHeight ? 'auto' : itemHeight,
          }}
          ref={estimatedItemHeight ? (el) => measureItemHeight(i, el) : null}
        >
          {renderItem(item, i)}
        </div>
      );
    }
    
    return items_to_render;
  }, [items, visibleRange, getItemOffset, renderItem, itemHeight, estimatedItemHeight, measureItemHeight]);

  return (
    <Box
      ref={containerRef}
      className={`virtual-scroll-container ${className}`}
      sx={{
        height: containerHeight,
        overflow: 'auto',
        position: 'relative'
      }}
      onScroll={handleScroll}
    >
      <div
        ref={scrollElementRef}
        style={{
          height: totalHeight.current,
          position: 'relative'
        }}
      >
        {visibleItems}
      </div>
    </Box>
  );
});

VirtualScrollList.displayName = 'VirtualScrollList';

export default VirtualScrollList;
