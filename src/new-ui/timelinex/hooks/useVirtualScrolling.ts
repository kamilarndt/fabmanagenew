/**
 * Virtual Scrolling Hook for TimelineX
 * Provides efficient rendering of large datasets (1M+ items) by only rendering visible items
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { TimelineItem, TimelineGroup, TimelineViewport } from '../types';

export interface VirtualScrollingOptions {
  itemHeight: number;
  groupHeight: number;
  overscan: number; // Number of items to render outside visible area
  enableHorizontalVirtualization: boolean;
  enableVerticalVirtualization: boolean;
  containerWidth: number;
  containerHeight: number;
}

export interface VirtualScrollingState {
  visibleItems: TimelineItem[];
  visibleGroups: TimelineGroup[];
  totalHeight: number;
  totalWidth: number;
  scrollTop: number;
  scrollLeft: number;
  startIndex: number;
  endIndex: number;
  startGroupIndex: number;
  endGroupIndex: number;
  isScrolling: boolean;
}

export interface VirtualScrollingActions {
  scrollTo: (scrollTop: number, scrollLeft?: number) => void;
  scrollToItem: (itemId: string) => void;
  scrollToGroup: (groupId: string) => void;
  scrollToTime: (time: number) => void;
  updateViewport: (viewport: TimelineViewport) => void;
  resize: (width: number, height: number) => void;
}

export interface UseVirtualScrollingReturn {
  state: VirtualScrollingState;
  actions: VirtualScrollingActions;
  containerProps: {
    onScroll: (event: React.UIEvent<HTMLDivElement>) => void;
    style: React.CSSProperties;
  };
  itemProps: (index: number) => {
    style: React.CSSProperties;
    key: string;
  };
  groupProps: (index: number) => {
    style: React.CSSProperties;
    key: string;
  };
}

export function useVirtualScrolling(
  items: TimelineItem[],
  groups: TimelineGroup[],
  viewport: TimelineViewport,
  options: Partial<VirtualScrollingOptions> = {}
): UseVirtualScrollingReturn {
  const {
    itemHeight = 30,
    groupHeight = 40,
    overscan = 5,
    enableHorizontalVirtualization = true,
    enableVerticalVirtualization = true,
    containerWidth = 800,
    containerHeight = 600,
  } = options;

  // State
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // Calculate total dimensions
  const totalHeight = useMemo(() => {
    if (!enableVerticalVirtualization) return groups.length * groupHeight;
    return groups.length * groupHeight + items.length * itemHeight;
  }, [groups.length, items.length, groupHeight, itemHeight, enableVerticalVirtualization]);

  const totalWidth = useMemo(() => {
    if (!enableHorizontalVirtualization) return containerWidth;
    const duration = viewport.end - viewport.start;
    return Math.max(containerWidth, duration * viewport.zoom);
  }, [viewport, containerWidth, enableHorizontalVirtualization]);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    if (!enableVerticalVirtualization) {
      return {
        startIndex: 0,
        endIndex: items.length - 1,
        startGroupIndex: 0,
        endGroupIndex: groups.length - 1,
      };
    }

    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    const startGroupIndex = Math.max(0, Math.floor(scrollTop / groupHeight) - overscan);
    const endGroupIndex = Math.min(
      groups.length - 1,
      Math.ceil((scrollTop + containerHeight) / groupHeight) + overscan
    );

    return {
      startIndex,
      endIndex,
      startGroupIndex,
      endGroupIndex,
    };
  }, [scrollTop, containerHeight, itemHeight, groupHeight, overscan, items.length, groups.length, enableVerticalVirtualization]);

  // Get visible items
  const visibleItems = useMemo(() => {
    if (!enableVerticalVirtualization) return items;
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
  }, [items, visibleRange, enableVerticalVirtualization]);

  // Get visible groups
  const visibleGroups = useMemo(() => {
    if (!enableVerticalVirtualization) return groups;
    return groups.slice(visibleRange.startGroupIndex, visibleRange.endGroupIndex + 1);
  }, [groups, visibleRange, enableVerticalVirtualization]);

  // Actions
  const scrollTo = useCallback((newScrollTop: number, newScrollLeft?: number) => {
    setScrollTop(Math.max(0, Math.min(newScrollTop, totalHeight - containerHeight)));
    if (newScrollLeft !== undefined) {
      setScrollLeft(Math.max(0, Math.min(newScrollLeft, totalWidth - containerWidth)));
    }
  }, [totalHeight, totalWidth, containerHeight, containerWidth]);

  const scrollToItem = useCallback((itemId: string) => {
    const itemIndex = items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;

    const itemTop = itemIndex * itemHeight;
    const itemBottom = itemTop + itemHeight;
    const currentTop = scrollTop;
    const currentBottom = scrollTop + containerHeight;

    let newScrollTop = scrollTop;

    if (itemTop < currentTop) {
      // Item is above visible area
      newScrollTop = itemTop;
    } else if (itemBottom > currentBottom) {
      // Item is below visible area
      newScrollTop = itemBottom - containerHeight;
    }

    scrollTo(newScrollTop);
  }, [items, itemHeight, scrollTop, containerHeight, scrollTo]);

  const scrollToGroup = useCallback((groupId: string) => {
    const groupIndex = groups.findIndex(group => group.id === groupId);
    if (groupIndex === -1) return;

    const groupTop = groupIndex * groupHeight;
    scrollTo(groupTop);
  }, [groups, groupHeight, scrollTo]);

  const scrollToTime = useCallback((time: number) => {
    if (!enableHorizontalVirtualization) return;

    const timeOffset = (time - viewport.start) * viewport.zoom;
    const newScrollLeft = Math.max(0, timeOffset - containerWidth / 2);
    scrollTo(scrollTop, newScrollLeft);
  }, [viewport, enableHorizontalVirtualization, containerWidth, scrollTop, scrollTo]);

  const updateViewport = useCallback((newViewport: TimelineViewport) => {
    // Update horizontal scroll based on viewport changes
    if (enableHorizontalVirtualization) {
      const timeOffset = (newViewport.start - viewport.start) * newViewport.zoom;
      setScrollLeft(prev => prev + timeOffset);
    }
  }, [viewport, enableHorizontalVirtualization]);

  const resize = useCallback((width: number, height: number) => {
    // Handle container resize
    // This would typically be called from the parent component
  }, []);

  // Handle scroll events
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    setScrollTop(target.scrollTop);
    setScrollLeft(target.scrollLeft);

    // Set scrolling state
    setIsScrolling(true);
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Container props
  const containerProps = useMemo(() => ({
    onScroll: handleScroll,
    style: {
      width: containerWidth,
      height: containerHeight,
      overflow: 'auto',
      position: 'relative' as const,
    },
  }), [handleScroll, containerWidth, containerHeight]);

  // Item props generator
  const itemProps = useCallback((index: number) => {
    const actualIndex = enableVerticalVirtualization ? visibleRange.startIndex + index : index;
    const top = actualIndex * itemHeight;
    
    return {
      style: {
        position: 'absolute' as const,
        top,
        left: 0,
        width: '100%',
        height: itemHeight,
        transform: `translateY(${enableVerticalVirtualization ? 0 : scrollTop}px)`,
      },
      key: items[actualIndex]?.id || `item-${actualIndex}`,
    };
  }, [itemHeight, visibleRange.startIndex, enableVerticalVirtualization, scrollTop, items]);

  // Group props generator
  const groupProps = useCallback((index: number) => {
    const actualIndex = enableVerticalVirtualization ? visibleRange.startGroupIndex + index : index;
    const top = actualIndex * groupHeight;
    
    return {
      style: {
        position: 'absolute' as const,
        top,
        left: 0,
        width: '100%',
        height: groupHeight,
        transform: `translateY(${enableVerticalVirtualization ? 0 : scrollTop}px)`,
      },
      key: groups[actualIndex]?.id || `group-${actualIndex}`,
    };
  }, [groupHeight, visibleRange.startGroupIndex, enableVerticalVirtualization, scrollTop, groups]);

  // State object
  const state: VirtualScrollingState = {
    visibleItems,
    visibleGroups,
    totalHeight,
    totalWidth,
    scrollTop,
    scrollLeft,
    startIndex: visibleRange.startIndex,
    endIndex: visibleRange.endIndex,
    startGroupIndex: visibleRange.startGroupIndex,
    endGroupIndex: visibleRange.endGroupIndex,
    isScrolling,
  };

  // Actions object
  const actions: VirtualScrollingActions = {
    scrollTo,
    scrollToItem,
    scrollToGroup,
    scrollToTime,
    updateViewport,
    resize,
  };

  return {
    state,
    actions,
    containerProps,
    itemProps,
    groupProps,
  };
}

