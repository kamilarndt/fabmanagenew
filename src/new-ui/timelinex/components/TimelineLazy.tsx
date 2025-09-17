/**
 * Lazy Timeline Component
 * High-performance timeline with lazy loading for large datasets
 */

import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLazyLoading, type LazyLoadingDataSource, createMockDataSource } from '../hooks/useLazyLoading';
import type { TimelineItem, TimelineGroup, TimelineViewport, TimelineTheme, TimelineSettings } from '../types';

export interface TimelineLazyProps {
  dataSource?: LazyLoadingDataSource;
  viewport: TimelineViewport;
  theme: TimelineTheme;
  settings: TimelineSettings;
  width: number;
  height: number;
  mode?: 'horizontal' | 'vertical';
  onItemClick?: (item: TimelineItem, event: React.MouseEvent) => void;
  onItemDoubleClick?: (item: TimelineItem, event: React.MouseEvent) => void;
  onItemHover?: (item: TimelineItem | null, event: React.MouseEvent) => void;
  onViewportChange?: (viewport: TimelineViewport) => void;
  onZoom?: (zoom: number, center?: { x: number; y: number }) => void;
  onPan?: (pan: { x: number; y: number }) => void;
  lazyLoadingOptions?: {
    batchSize?: number;
    loadDelay?: number;
    preloadDistance?: number;
    enableTimeBasedLoading?: boolean;
    enableGroupBasedLoading?: boolean;
    maxConcurrentRequests?: number;
    cacheSize?: number;
  };
  renderItem?: (item: TimelineItem, index: number) => React.ReactNode;
  renderGroup?: (group: TimelineGroup, index: number) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TimelineLazy: React.FC<TimelineLazyProps> = memo(function TimelineLazy({
  dataSource,
  viewport,
  theme,
  settings,
  width,
  height,
  mode = 'horizontal',
  onItemClick,
  onItemDoubleClick,
  onItemHover,
  onViewportChange,
  onZoom,
  onPan,
  lazyLoadingOptions = {},
  renderItem,
  renderGroup,
  className,
  style,
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredItem, setHoveredItem] = useState<TimelineItem | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Create mock data source if none provided
  const mockDataSource = useMemo(() => 
    dataSource || createMockDataSource(10000, 100), 
    [dataSource]
  );

  // Lazy loading hook
  const {
    state: lazyState,
    actions: lazyActions,
  } = useLazyLoading(mockDataSource, viewport, {
    batchSize: 100,
    loadDelay: 100,
    preloadDistance: 200,
    enableTimeBasedLoading: true,
    enableGroupBasedLoading: true,
    maxConcurrentRequests: 3,
    cacheSize: 1000,
    ...lazyLoadingOptions,
  });

  // Handle load more when scrolling near bottom
  const handleScroll = useCallback(async (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = target;
    
    // Load more when 80% scrolled
    if (scrollTop + clientHeight >= scrollHeight * 0.8 && !isLoadingMore) {
      setIsLoadingMore(true);
      await lazyActions.loadMore();
      setIsLoadingMore(false);
    }
  }, [lazyActions, isLoadingMore]);

  // Handle item click
  const handleItemClick = useCallback((item: TimelineItem, event: React.MouseEvent) => {
    onItemClick?.(item, event);
  }, [onItemClick]);

  // Handle item double click
  const handleItemDoubleClick = useCallback((item: TimelineItem, event: React.MouseEvent) => {
    onItemDoubleClick?.(item, event);
  }, [onItemDoubleClick]);

  // Handle item hover
  const handleItemHover = useCallback((item: TimelineItem | null, event: React.MouseEvent) => {
    setHoveredItem(item);
    onItemHover?.(item, event);
  }, [onItemHover]);

  // Handle mouse wheel for zooming
  const handleWheel = useCallback((event: React.WheelEvent) => {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      const delta = event.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.1, Math.min(10, viewport.zoom * delta));
      onZoom?.(newZoom);
    }
  }, [viewport.zoom, onZoom]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    const panAmount = 50 / viewport.zoom;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        onPan?.({ x: -panAmount, y: 0 });
        break;
      case 'ArrowRight':
        event.preventDefault();
        onPan?.({ x: panAmount, y: 0 });
        break;
      case 'Home':
        event.preventDefault();
        containerRef.current?.scrollTo({ top: 0 });
        break;
      case 'End':
        event.preventDefault();
        containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight });
        break;
    }
  }, [viewport.zoom, onPan]);

  // Default item renderer
  const defaultRenderItem = useCallback((item: TimelineItem, index: number) => {
    const isHovered = hoveredItem?.id === item.id;
    const progress = item.progress || 0;
    const priority = item.priority || 0;

    return (
      <div
        key={item.id}
        className="timeline-lazy-item"
        style={{
          position: 'relative',
          backgroundColor: item.color || theme.colors.primary,
          borderRadius: '4px',
          padding: '8px 12px',
          margin: '2px 0',
          fontSize: '12px',
          color: theme.colors.background,
          cursor: 'pointer',
          userSelect: 'none',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          opacity: isHovered ? 0.8 : 1,
          transform: isHovered ? 'scale(1.02)' : 'scale(1)',
          transition: 'all 0.2s ease',
          boxShadow: priority > 0.5 ? '0 0 8px rgba(255, 0, 0, 0.5)' : 'none',
          border: isHovered ? `2px solid ${theme.colors.accent}` : 'none',
        }}
        onClick={(e) => handleItemClick(item, e)}
        onDoubleClick={(e) => handleItemDoubleClick(item, e)}
        onMouseEnter={(e) => handleItemHover(item, e)}
        onMouseLeave={(e) => handleItemHover(null, e)}
      >
        {/* Progress bar */}
        {progress > 0 && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: `${progress * 100}%`,
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '4px',
            }}
          />
        )}
        
        {/* Item content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {item.title || item.id}
        </div>

        {/* Priority indicator */}
        {priority > 0.5 && (
          <div
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '8px',
              height: '8px',
              backgroundColor: 'red',
              borderRadius: '50%',
              animation: 'pulse 1s infinite',
            }}
          />
        )}
      </div>
    );
  }, [hoveredItem, theme, handleItemClick, handleItemDoubleClick, handleItemHover]);

  // Default group renderer
  const defaultRenderGroup = useCallback((group: TimelineGroup, index: number) => {
    return (
      <div
        key={group.id}
        className="timeline-lazy-group"
        style={{
          backgroundColor: theme.colors.surface,
          borderBottom: `2px solid ${theme.colors.border}`,
          padding: '12px 16px',
          margin: '4px 0',
          fontSize: '14px',
          fontWeight: 'bold',
          color: theme.colors.text,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: '6px',
        }}
      >
        <span>{group.title || group.id}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: theme.colors.textSecondary }}>
            {group.items?.length || 0} items
          </span>
          <button
            style={{
              padding: '4px 8px',
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '4px',
              backgroundColor: theme.colors.background,
              color: theme.colors.text,
              cursor: 'pointer',
              fontSize: '12px',
            }}
            onClick={() => lazyActions.loadGroup(group.id)}
          >
            Load Items
          </button>
        </div>
      </div>
    );
  }, [theme, lazyActions]);

  // Loading indicator
  const LoadingIndicator = () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        color: theme.colors.textSecondary,
      }}
    >
      <div
        style={{
          width: '20px',
          height: '20px',
          border: `2px solid ${theme.colors.border}`,
          borderTop: `2px solid ${theme.colors.primary}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginRight: '8px',
        }}
      />
      Loading more items...
    </div>
  );

  // Error indicator
  if (lazyState.error) {
    return (
      <div
        className={`timeline-lazy-error ${className || ''}`}
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '6px',
          color: '#dc2626',
          ...style,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>
            Loading Error
          </div>
          <div style={{ fontSize: '12px', marginBottom: '16px' }}>
            {lazyState.error}
          </div>
          <button
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            onClick={() => lazyActions.refresh()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`timeline-lazy ${className || ''}`}
      style={{
        width,
        height,
        position: 'relative',
        backgroundColor: theme.colors.background,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '6px',
        overflow: 'auto',
        ...style,
      }}
      onScroll={handleScroll}
      onWheel={handleWheel}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Groups */}
      <div style={{ marginBottom: '16px' }}>
        {lazyState.loadedGroups.map((group, index) => (
          <div key={group.id}>
            {renderGroup ? renderGroup(group, index) : defaultRenderGroup(group, index)}
          </div>
        ))}
      </div>

      {/* Items */}
      <div style={{ marginBottom: '16px' }}>
        {lazyState.loadedItems.map((item, index) => (
          <div key={item.id}>
            {renderItem ? renderItem(item, index) : defaultRenderItem(item, index)}
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      {isLoadingMore && <LoadingIndicator />}

      {/* Load more button */}
      {!isLoadingMore && lazyState.currentBatch < lazyState.totalBatches && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <button
            style={{
              padding: '12px 24px',
              backgroundColor: theme.colors.primary,
              color: theme.colors.background,
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
            onClick={() => {
              setIsLoadingMore(true);
              lazyActions.loadMore().finally(() => setIsLoadingMore(false));
            }}
          >
            Load More Items ({lazyState.totalItems - lazyState.loadedItems.length} remaining)
          </button>
        </div>
      )}

      {/* Progress indicator */}
      <div
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'monospace',
        }}
      >
        Lazy: {lazyState.loadedItems.length}/{lazyState.totalItems} items
        <br />
        {lazyState.loadedPercentage.toFixed(1)}% loaded
        {lazyState.isLoading && ' (loading...)'}
      </div>

      {/* Cache indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'monospace',
        }}
      >
        Cache: {lazyState.cache.size} entries
      </div>

      {/* CSS animations */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
});

export default TimelineLazy;