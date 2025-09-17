/**
 * Touch-optimized Timeline Component
 * Enhanced timeline with comprehensive touch gesture support for mobile devices
 */

import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useAdvancedTouchGestures, type TouchGestureCallbacks, type TouchGestureOptions } from '../hooks/useAdvancedTouchGestures';
import type { TimelineItem, TimelineGroup, TimelineViewport, TimelineTheme, TimelineSettings } from '../types';

export interface TimelineTouchProps {
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
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down', velocity: { x: number; y: number }) => void;
  onLongPress?: (position: { x: number; y: number }, item?: TimelineItem) => void;
  touchOptions?: Partial<TouchGestureOptions>;
  renderItem?: (item: TimelineItem, index: number) => React.ReactNode;
  renderGroup?: (group: TimelineGroup, index: number) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TimelineTouch: React.FC<TimelineTouchProps> = memo(function TimelineTouch({
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
  onSwipe,
  onLongPress,
  touchOptions = {},
  renderItem,
  renderGroup,
  className,
  style,
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredItem, setHoveredItem] = useState<TimelineItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Touch gesture callbacks
  const touchCallbacks: TouchGestureCallbacks = {
    onTap: useCallback((position, event) => {
      const item = findItemAtPosition(position);
      if (item) {
        setSelectedItem(item);
        onItemClick?.(item, event as any);
      }
    }, [onItemClick]),

    onDoubleTap: useCallback((position, event) => {
      const item = findItemAtPosition(position);
      if (item) {
        onItemDoubleClick?.(item, event as any);
      }
    }, [onItemDoubleClick]),

    onLongPress: useCallback((position, event) => {
      const item = findItemAtPosition(position);
      onLongPress?.(position, item);
    }, [onLongPress]),

    onSwipe: useCallback((direction, velocity, event) => {
      onSwipe?.(direction, velocity);
      
      // Auto-pan on swipe
      const panAmount = 100;
      switch (direction) {
        case 'left':
          onPan?.({ x: panAmount, y: 0 });
          break;
        case 'right':
          onPan?.({ x: -panAmount, y: 0 });
          break;
        case 'up':
          onPan?.({ x: 0, y: panAmount });
          break;
        case 'down':
          onPan?.({ x: 0, y: -panAmount });
          break;
      }
    }, [onSwipe, onPan]),

    onPinch: useCallback((scale, center, event) => {
      const newZoom = Math.max(0.1, Math.min(10, viewport.zoom * scale));
      onZoom?.(newZoom, center);
    }, [viewport.zoom, onZoom]),

    onPan: useCallback((delta, velocity, event) => {
      onPan?.(delta);
    }, [onPan]),

    onGestureStart: useCallback((gestureType, event) => {
      setIsAnimating(true);
    }, []),

    onGestureEnd: useCallback((gestureType, event) => {
      setIsAnimating(false);
    }, []),
  };

  // Touch gesture hook
  const { state: touchState, bind: touchBind, isGestureActive, getGestureData } = useAdvancedTouchGestures(
    touchCallbacks,
    {
      enablePinch: true,
      enableSwipe: true,
      enableLongPress: true,
      enableDoubleTap: true,
      enableRotation: false,
      enablePan: true,
      longPressDelay: 500,
      doubleTapDelay: 300,
      swipeThreshold: 50,
      pinchThreshold: 0.1,
      velocityThreshold: 0.5,
      preventDefault: true,
      passive: false,
      ...touchOptions,
    }
  );

  // Find item at position
  const findItemAtPosition = useCallback((position: { x: number; y: number }): TimelineItem | null => {
    if (!containerRef.current) return null;

    const rect = containerRef.current.getBoundingClientRect();
    const x = position.x - rect.left;
    const y = position.y - rect.top;

    // Simple hit testing - in a real implementation, you'd use more sophisticated collision detection
    return items.find(item => {
      const itemStart = item.start;
      const itemEnd = item.end || item.start;
      const itemLane = item.lane || 0;
      
      const timelineX = (x / width) * (viewport.end - viewport.start) + viewport.start;
      const timelineY = (y / height) * groups.length * 30;
      
      return (
        timelineX >= itemStart &&
        timelineX <= itemEnd &&
        timelineY >= itemLane * 30 &&
        timelineY <= (itemLane + 1) * 30
      );
    }) || null;
  }, [items, groups, viewport, width, height]);

  // Handle mouse events for desktop compatibility
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    const item = findItemAtPosition({ x: event.clientX, y: event.clientY });
    if (item) {
      setSelectedItem(item);
      onItemClick?.(item, event);
    }
  }, [findItemAtPosition, onItemClick]);

  const handleMouseEnter = useCallback((event: React.MouseEvent) => {
    const item = findItemAtPosition({ x: event.clientX, y: event.clientY });
    setHoveredItem(item);
    onItemHover?.(item, event);
  }, [findItemAtPosition, onItemHover]);

  const handleMouseLeave = useCallback((event: React.MouseEvent) => {
    setHoveredItem(null);
    onItemHover?.(null, event);
  }, [onItemHover]);

  // Default item renderer with touch optimizations
  const defaultRenderItem = useCallback((item: TimelineItem, index: number) => {
    const isHovered = hoveredItem?.id === item.id;
    const isSelected = selectedItem?.id === item.id;
    const progress = item.progress || 0;
    const priority = item.priority || 0;

    return (
      <div
        key={item.id}
        className="timeline-touch-item"
        style={{
          position: 'relative',
          backgroundColor: item.color || theme.colors.primary,
          borderRadius: '8px',
          padding: '12px 16px',
          margin: '4px 0',
          fontSize: '14px',
          color: theme.colors.background,
          cursor: 'pointer',
          userSelect: 'none',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          minHeight: '44px', // Minimum touch target size
          display: 'flex',
          alignItems: 'center',
          opacity: isHovered ? 0.8 : 1,
          transform: isSelected ? 'scale(1.05)' : 'scale(1)',
          transition: 'all 0.2s ease',
          boxShadow: priority > 0.5 ? '0 0 12px rgba(255, 0, 0, 0.6)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
          border: isSelected ? `3px solid ${theme.colors.accent}` : 'none',
          touchAction: 'none', // Prevent default touch behaviors
        }}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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
              borderRadius: '8px',
            }}
          />
        )}
        
        {/* Item content */}
        <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
          <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
            {item.title || item.id}
          </div>
          {item.description && (
            <div style={{ fontSize: '12px', opacity: 0.8 }}>
              {item.description}
            </div>
          )}
        </div>

        {/* Priority indicator */}
        {priority > 0.5 && (
          <div
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: 'red',
              borderRadius: '50%',
              marginLeft: '8px',
              animation: 'pulse 1s infinite',
            }}
          />
        )}

        {/* Selection indicator */}
        {isSelected && (
          <div
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '8px',
              height: '8px',
              backgroundColor: theme.colors.accent,
              borderRadius: '50%',
            }}
          />
        )}
      </div>
    );
  }, [hoveredItem, selectedItem, theme, handleMouseDown, handleMouseEnter, handleMouseLeave]);

  // Default group renderer
  const defaultRenderGroup = useCallback((group: TimelineGroup, index: number) => {
    return (
      <div
        key={group.id}
        className="timeline-touch-group"
        style={{
          backgroundColor: theme.colors.surface,
          borderBottom: `3px solid ${theme.colors.border}`,
          padding: '16px 20px',
          margin: '8px 0',
          fontSize: '16px',
          fontWeight: 'bold',
          color: theme.colors.text,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: '8px',
          minHeight: '48px', // Minimum touch target size
        }}
      >
        <span>{group.title || group.id}</span>
        <span style={{ fontSize: '14px', color: theme.colors.textSecondary }}>
          {group.items?.length || 0} items
        </span>
      </div>
    );
  }, [theme]);

  // Gesture indicators
  const GestureIndicator = () => {
    if (!touchState.isTouching) return null;

    const gestureData = getGestureData();
    const { delta, velocity, scale } = gestureData;

    return (
      <div
        style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          fontFamily: 'monospace',
          zIndex: 1000,
        }}
      >
        <div>Gesture: {touchState.gestureType || 'none'}</div>
        <div>Delta: {delta.x.toFixed(1)}, {delta.y.toFixed(1)}</div>
        <div>Velocity: {velocity.x.toFixed(1)}, {velocity.y.toFixed(1)}</div>
        {touchState.isPinching && <div>Scale: {scale.toFixed(2)}</div>}
        {touchState.swipeDirection && <div>Swipe: {touchState.swipeDirection}</div>}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`timeline-touch ${className || ''}`}
      style={{
        width,
        height,
        position: 'relative',
        backgroundColor: theme.colors.background,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '8px',
        overflow: 'auto',
        touchAction: 'none', // Prevent default touch behaviors
        ...style,
      }}
      {...touchBind}
    >
      {/* Groups */}
      <div style={{ marginBottom: '16px' }}>
        {groups.map((group, index) => (
          <div key={group.id}>
            {renderGroup ? renderGroup(group, index) : defaultRenderGroup(group, index)}
          </div>
        ))}
      </div>

      {/* Items */}
      <div style={{ marginBottom: '16px' }}>
        {items.map((item, index) => (
          <div key={item.id}>
            {renderItem ? renderItem(item, index) : defaultRenderItem(item, index)}
          </div>
        ))}
      </div>

      {/* Gesture indicator */}
      <GestureIndicator />

      {/* Touch state indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'monospace',
        }}
      >
        Touch: {touchState.touchCount} fingers
        {isAnimating && ' (animating)'}
      </div>

      {/* CSS animations */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          
          .timeline-touch-item:active {
            transform: scale(0.95);
            transition: transform 0.1s ease;
          }
          
          .timeline-touch-item:focus {
            outline: 2px solid ${theme.colors.accent};
            outline-offset: 2px;
          }
        `}
      </style>
    </div>
  );
});

export default TimelineTouch;
