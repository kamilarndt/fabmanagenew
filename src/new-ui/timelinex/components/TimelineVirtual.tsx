/**
 * Virtual Timeline Component
 * High-performance timeline with virtual scrolling for large datasets (1M+ items)
 */

import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useVirtualScrolling, type VirtualScrollingOptions } from '../hooks/useVirtualScrolling';
import type { TimelineItem, TimelineGroup, TimelineViewport, TimelineTheme, TimelineSettings } from '../types';

export interface TimelineVirtualProps {
  items: TimelineItem[];
  groups: TimelineGroup[];
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
  virtualScrollingOptions?: Partial<VirtualScrollingOptions>;
  renderItem?: (item: TimelineItem, index: number) => React.ReactNode;
  renderGroup?: (group: TimelineGroup, index: number) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TimelineVirtual: React.FC<TimelineVirtualProps> = memo(function TimelineVirtual({
  items,
  groups,
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
  virtualScrollingOptions = {},
  renderItem,
  renderGroup,
  className,
  style,
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredItem, setHoveredItem] = React.useState<TimelineItem | null>(null);

  // Virtual scrolling configuration
  const virtualOptions: VirtualScrollingOptions = {
    itemHeight: 30,
    groupHeight: 40,
    overscan: 10, // Render more items outside visible area for smooth scrolling
    enableHorizontalVirtualization: mode === 'horizontal',
    enableVerticalVirtualization: true,
    containerWidth: width,
    containerHeight: height,
    ...virtualScrollingOptions,
  };

  // Virtual scrolling hook
  const {
    state: virtualState,
    actions: virtualActions,
    containerProps,
    itemProps,
    groupProps,
  } = useVirtualScrolling(items, groups, viewport, virtualOptions);

  // Handle viewport changes
  useEffect(() => {
    virtualActions.updateViewport(viewport);
  }, [viewport, virtualActions]);

  // Handle container resize
  useEffect(() => {
    virtualActions.resize(width, height);
  }, [width, height, virtualActions]);

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
      case 'ArrowUp':
        event.preventDefault();
        virtualActions.scrollTo(virtualState.scrollTop - 50);
        break;
      case 'ArrowDown':
        event.preventDefault();
        virtualActions.scrollTo(virtualState.scrollTop + 50);
        break;
      case 'Home':
        event.preventDefault();
        virtualActions.scrollTo(0);
        break;
      case 'End':
        event.preventDefault();
        virtualActions.scrollTo(virtualState.totalHeight);
        break;
    }
  }, [viewport.zoom, onPan, virtualActions, virtualState.scrollTop, virtualState.totalHeight]);

  // Calculate item positions and visibility
  const visibleItemsWithPositions = useMemo(() => {
    return virtualState.visibleItems.map((item, index) => {
      const props = itemProps(index);
      const startTime = item.start;
      const endTime = item.end || item.start;
      const duration = endTime - startTime;
      
      // Calculate horizontal position based on time
      const left = mode === 'horizontal' 
        ? ((startTime - viewport.start) / (viewport.end - viewport.start)) * width
        : 0;
      
      const itemWidth = mode === 'horizontal'
        ? (duration / (viewport.end - viewport.start)) * width
        : width;

      return {
        item,
        index: virtualState.startIndex + index,
        style: {
          ...props.style,
          left,
          width: itemWidth,
        },
        key: props.key,
      };
    });
  }, [virtualState.visibleItems, virtualState.startIndex, itemProps, viewport, width, mode]);

  // Calculate group positions
  const visibleGroupsWithPositions = useMemo(() => {
    return virtualState.visibleGroups.map((group, index) => {
      const props = groupProps(index);
      return {
        group,
        index: virtualState.startGroupIndex + index,
        style: props.style,
        key: props.key,
      };
    });
  }, [virtualState.visibleGroups, virtualState.startGroupIndex, groupProps]);

  // Default item renderer
  const defaultRenderItem = useCallback((item: TimelineItem, index: number) => {
    const isHovered = hoveredItem?.id === item.id;
    const progress = item.progress || 0;
    const priority = item.priority || 0;

    return (
      <div
        key={item.id}
        className="timeline-virtual-item"
        style={{
          position: 'absolute',
          backgroundColor: item.color || theme.colors.primary,
          borderRadius: '4px',
          padding: '4px 8px',
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
      </div>
    );
  }, [hoveredItem, theme, handleItemClick, handleItemDoubleClick, handleItemHover]);

  // Default group renderer
  const defaultRenderGroup = useCallback((group: TimelineGroup, index: number) => {
    return (
      <div
        key={group.id}
        className="timeline-virtual-group"
        style={{
          position: 'absolute',
          backgroundColor: theme.colors.surface,
          borderBottom: `1px solid ${theme.colors.border}`,
          padding: '8px 12px',
          fontSize: '14px',
          fontWeight: 'bold',
          color: theme.colors.text,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span>{group.title || group.id}</span>
        <span style={{ fontSize: '12px', color: theme.colors.textSecondary }}>
          {group.items?.length || 0} items
        </span>
      </div>
    );
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className={`timeline-virtual ${className || ''}`}
      style={{
        width,
        height,
        position: 'relative',
        backgroundColor: theme.colors.background,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '6px',
        overflow: 'hidden',
        ...style,
      }}
      onWheel={handleWheel}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Virtual scrolling container */}
      <div
        {...containerProps}
        style={{
          ...containerProps.style,
          width: '100%',
          height: '100%',
        }}
      >
        {/* Groups */}
        <div
          style={{
            position: 'relative',
            width: virtualState.totalWidth,
            height: virtualState.totalHeight,
          }}
        >
          {visibleGroupsWithPositions.map(({ group, style, key }) => (
            <div key={key} style={style}>
              {renderGroup ? renderGroup(group, 0) : defaultRenderGroup(group, 0)}
            </div>
          ))}

          {/* Items */}
          {visibleItemsWithPositions.map(({ item, style, key }) => (
            <div key={key} style={style}>
              {renderItem ? renderItem(item, 0) : defaultRenderItem(item, 0)}
            </div>
          ))}
        </div>
      </div>

      {/* Performance indicator */}
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
        Virtual: {virtualState.visibleItems.length}/{items.length} items
        {virtualState.isScrolling && ' (scrolling)'}
      </div>

      {/* Scroll position indicator */}
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
        {Math.round((virtualState.scrollTop / virtualState.totalHeight) * 100)}%
      </div>
    </div>
  );
});

export default TimelineVirtual;

