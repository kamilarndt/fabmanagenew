/**
 * Animated Timeline Component
 * Timeline with GSAP-powered smooth animations and transitions
 */

import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useTimelineAnimation, ANIMATION_PRESETS } from '../utils/gsapAnimations';
import type { TimelineItem, TimelineGroup, TimelineViewport, TimelineTheme, TimelineSettings } from '../types';

export interface TimelineAnimatedProps {
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
  animationConfig?: {
    enableItemAnimations?: boolean;
    enableViewportAnimations?: boolean;
    enableStaggerAnimations?: boolean;
    animationDuration?: number;
    staggerDelay?: number;
  };
  renderItem?: (item: TimelineItem, index: number) => React.ReactNode;
  renderGroup?: (group: TimelineGroup, index: number) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TimelineAnimated: React.FC<TimelineAnimatedProps> = memo(function TimelineAnimated({
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
  animationConfig = {},
  renderItem,
  renderGroup,
  className,
  style,
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const groupsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const [hoveredItem, setHoveredItem] = useState<TimelineItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const {
    enableItemAnimations = true,
    enableViewportAnimations = true,
    enableStaggerAnimations = true,
    animationDuration = 0.3,
    staggerDelay = 0.1,
  } = animationConfig;

  // Animation hooks
  const {
    animateItemEnter,
    animateItemExit,
    animateItemHover,
    animateItemSelect,
    animateViewportZoom,
    animateViewportPan,
    animateTimelineLoad,
    staggerItems,
    isAvailable,
  } = useTimelineAnimation();

  // Handle item click with animation
  const handleItemClick = useCallback((item: TimelineItem, event: React.MouseEvent) => {
    if (enableItemAnimations && isAvailable()) {
      const element = itemsRef.current.get(item.id);
      if (element) {
        animateItemSelect(element, true);
        setSelectedItem(item);
      }
    }
    onItemClick?.(item, event);
  }, [enableItemAnimations, isAvailable, animateItemSelect, onItemClick]);

  // Handle item double click
  const handleItemDoubleClick = useCallback((item: TimelineItem, event: React.MouseEvent) => {
    onItemDoubleClick?.(item, event);
  }, [onItemDoubleClick]);

  // Handle item hover with animation
  const handleItemHover = useCallback((item: TimelineItem | null, event: React.MouseEvent) => {
    if (enableItemAnimations && isAvailable()) {
      // Animate previous hovered item out
      if (hoveredItem && hoveredItem.id !== item?.id) {
        const prevElement = itemsRef.current.get(hoveredItem.id);
        if (prevElement) {
          animateItemHover(prevElement, false);
        }
      }

      // Animate new hovered item in
      if (item) {
        const element = itemsRef.current.get(item.id);
        if (element) {
          animateItemHover(element, true);
        }
      }
    }

    setHoveredItem(item);
    onItemHover?.(item, event);
  }, [enableItemAnimations, isAvailable, animateItemHover, hoveredItem, onItemHover]);

  // Handle mouse wheel for zooming with animation
  const handleWheel = useCallback((event: React.WheelEvent) => {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      const delta = event.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.1, Math.min(10, viewport.zoom * delta));
      
      if (enableViewportAnimations && isAvailable()) {
        const center = { x: width / 2, y: height / 2 };
        animateViewportZoom(containerRef.current!, newZoom, center);
      }
      
      onZoom?.(newZoom, { x: width / 2, y: height / 2 });
    }
  }, [viewport.zoom, width, height, enableViewportAnimations, isAvailable, animateViewportZoom, onZoom]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    const panAmount = 50 / viewport.zoom;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        if (enableViewportAnimations && isAvailable()) {
          animateViewportPan(containerRef.current!, { x: panAmount, y: 0 });
        }
        onPan?.({ x: panAmount, y: 0 });
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (enableViewportAnimations && isAvailable()) {
          animateViewportPan(containerRef.current!, { x: -panAmount, y: 0 });
        }
        onPan?.({ x: -panAmount, y: 0 });
        break;
    }
  }, [viewport.zoom, enableViewportAnimations, isAvailable, animateViewportPan, onPan]);

  // Animate items on mount
  useEffect(() => {
    if (enableStaggerAnimations && isAvailable()) {
      const itemElements = Array.from(itemsRef.current.values());
      if (itemElements.length > 0) {
        staggerItems(itemElements, {
          ...ANIMATION_PRESETS.itemEnter,
          duration: animationDuration,
        }, staggerDelay);
      }
    }
  }, [enableStaggerAnimations, isAvailable, staggerItems, animationDuration, staggerDelay]);

  // Animate timeline load
  useEffect(() => {
    if (isAvailable() && containerRef.current) {
      animateTimelineLoad(containerRef.current, {
        duration: animationDuration,
      });
    }
  }, [isAvailable, animateTimelineLoad, animationDuration]);

  // Default item renderer with animation support
  const defaultRenderItem = useCallback((item: TimelineItem, index: number) => {
    const isHovered = hoveredItem?.id === item.id;
    const isSelected = selectedItem?.id === item.id;
    const progress = item.progress || 0;
    const priority = item.priority || 0;

    return (
      <div
        key={item.id}
        ref={(el) => {
          if (el) {
            itemsRef.current.set(item.id, el);
          } else {
            itemsRef.current.delete(item.id);
          }
        }}
        className="timeline-animated-item"
        style={{
          position: 'relative',
          backgroundColor: item.color || theme.colors.primary,
          borderRadius: '6px',
          padding: '8px 12px',
          margin: '4px 0',
          fontSize: '13px',
          color: theme.colors.background,
          cursor: 'pointer',
          userSelect: 'none',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          minHeight: '32px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          transition: 'none', // Disable CSS transitions when GSAP is handling animations
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
              borderRadius: '6px',
            }}
          />
        )}
        
        {/* Item content */}
        <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
          <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
            {item.title || item.id}
          </div>
          {item.description && (
            <div style={{ fontSize: '11px', opacity: 0.8 }}>
              {item.description}
            </div>
          )}
        </div>

        {/* Priority indicator */}
        {priority > 0.5 && (
          <div
            style={{
              width: '8px',
              height: '8px',
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
              width: '6px',
              height: '6px',
              backgroundColor: theme.colors.accent,
              borderRadius: '50%',
            }}
          />
        )}
      </div>
    );
  }, [hoveredItem, selectedItem, theme, handleItemClick, handleItemDoubleClick, handleItemHover]);

  // Default group renderer with animation support
  const defaultRenderGroup = useCallback((group: TimelineGroup, index: number) => {
    return (
      <div
        key={group.id}
        ref={(el) => {
          if (el) {
            groupsRef.current.set(group.id, el);
          } else {
            groupsRef.current.delete(group.id);
          }
        }}
        className="timeline-animated-group"
        style={{
          backgroundColor: theme.colors.surface,
          borderBottom: `2px solid ${theme.colors.border}`,
          padding: '12px 16px',
          margin: '6px 0',
          fontSize: '14px',
          fontWeight: 'bold',
          color: theme.colors.text,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: '6px',
          minHeight: '40px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          transition: 'none', // Disable CSS transitions when GSAP is handling animations
        }}
      >
        <span>{group.title || group.id}</span>
        <span style={{ fontSize: '12px', color: theme.colors.textSecondary }}>
          {group.items?.length || 0} items
        </span>
      </div>
    );
  }, [theme]);

  // Animation status indicator
  const AnimationStatus = () => {
    if (!isAvailable()) {
      return (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            backgroundColor: 'rgba(255, 193, 7, 0.9)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'monospace',
          }}
        >
          GSAP Not Available
        </div>
      );
    }

    return (
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
        Animated: {isAnimating ? 'Yes' : 'No'}
        <br />
        Items: {items.length}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`timeline-animated ${className || ''}`}
      style={{
        width,
        height,
        position: 'relative',
        backgroundColor: theme.colors.background,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '8px',
        overflow: 'auto',
        ...style,
      }}
      onWheel={handleWheel}
      onKeyDown={handleKeyDown}
      tabIndex={0}
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

      {/* Animation status */}
      <AnimationStatus />

      {/* CSS animations for fallback */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          
          .timeline-animated-item:active {
            transform: scale(0.95);
          }
          
          .timeline-animated-item:focus {
            outline: 2px solid ${theme.colors.accent};
            outline-offset: 2px;
          }
        `}
      </style>
    </div>
  );
});

export default TimelineAnimated;
