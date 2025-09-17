/**
 * Mobile-optimized Timeline Component
 * Timeline specifically optimized for mobile devices with performance enhancements
 */

import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useMobileOptimization } from '../hooks/useMobileOptimization';
import type { TimelineItem, TimelineGroup, TimelineViewport, TimelineTheme, TimelineSettings } from '../types';

export interface TimelineMobileProps {
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
  mobileOptions?: {
    enableHapticFeedback?: boolean;
    enableSwipeNavigation?: boolean;
    enablePullToRefresh?: boolean;
    enableInfiniteScroll?: boolean;
    enableOfflineMode?: boolean;
    enableBatteryOptimization?: boolean;
    enableMemoryOptimization?: boolean;
    enableNetworkOptimization?: boolean;
  };
  renderItem?: (item: TimelineItem, index: number) => React.ReactNode;
  renderGroup?: (group: TimelineGroup, index: number) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TimelineMobile: React.FC<TimelineMobileProps> = memo(function TimelineMobile({
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
  mobileOptions = {},
  renderItem,
  renderGroup,
  className,
  style,
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredItem, setHoveredItem] = useState<TimelineItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    enableHapticFeedback = true,
    enableSwipeNavigation = true,
    enablePullToRefresh = true,
    enableInfiniteScroll = true,
    enableOfflineMode = false,
    enableBatteryOptimization = true,
    enableMemoryOptimization = true,
    enableNetworkOptimization = true,
  } = mobileOptions;

  // Mobile optimization hook
  const { state: mobileState, actions: mobileActions, isOptimized, getOptimizedSettings } = useMobileOptimization({
    enableTouchOptimization: true,
    enableGestureOptimization: true,
    enablePerformanceOptimization: true,
    enableBatteryOptimization,
    enableNetworkOptimization,
    enableMemoryOptimization,
    enableViewportOptimization: true,
    enableScrollOptimization: true,
    enableAnimationOptimization: true,
    enableRenderingOptimization: true,
  });

  // Haptic feedback
  const triggerHapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!enableHapticFeedback || !mobileState.isMobile) return;

    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [50],
      };
      navigator.vibrate(patterns[type]);
    }
  }, [enableHapticFeedback, mobileState.isMobile]);

  // Handle item click with haptic feedback
  const handleItemClick = useCallback((item: TimelineItem, event: React.MouseEvent) => {
    triggerHapticFeedback('light');
    setSelectedItem(item);
    onItemClick?.(item, event);
  }, [triggerHapticFeedback, onItemClick]);

  // Handle item double click
  const handleItemDoubleClick = useCallback((item: TimelineItem, event: React.MouseEvent) => {
    triggerHapticFeedback('medium');
    onItemDoubleClick?.(item, event);
  }, [triggerHapticFeedback, onItemDoubleClick]);

  // Handle item hover
  const handleItemHover = useCallback((item: TimelineItem | null, event: React.MouseEvent) => {
    setHoveredItem(item);
    onItemHover?.(item, event);
  }, [onItemHover]);

  // Handle touch events for swipe navigation
  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    if (!enableSwipeNavigation) return;
    
    const touch = event.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      
      // Horizontal swipe
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          // Swipe right - go back
          triggerHapticFeedback('light');
        } else {
          // Swipe left - go forward
          triggerHapticFeedback('light');
        }
      }
    };
    
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  }, [enableSwipeNavigation, triggerHapticFeedback]);

  // Handle pull to refresh
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    if (!enablePullToRefresh) return;
    
    const target = event.target as HTMLDivElement;
    const scrollTop = target.scrollTop;
    
    if (scrollTop < -50 && !isRefreshing) {
      setIsRefreshing(true);
      triggerHapticFeedback('medium');
      
      // Simulate refresh
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1000);
    }
  }, [enablePullToRefresh, isRefreshing, triggerHapticFeedback]);

  // Handle infinite scroll
  const handleScrollEnd = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    if (!enableInfiniteScroll) return;
    
    const target = event.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = target;
    
    if (scrollTop + clientHeight >= scrollHeight - 100 && !isLoading) {
      setIsLoading(true);
      triggerHapticFeedback('light');
      
      // Simulate loading more items
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [enableInfiniteScroll, isLoading, triggerHapticFeedback]);

  // Optimize for mobile on mount
  useEffect(() => {
    mobileActions.optimizeForDevice();
    mobileActions.optimizeForPerformance();
    mobileActions.optimizeForBattery();
    mobileActions.optimizeForNetwork();
    mobileActions.optimizeForMemory();
  }, [mobileActions]);

  // Apply mobile optimizations when state changes
  useEffect(() => {
    if (mobileState.isLowPowerMode) {
      mobileActions.enableLowPowerMode();
    } else {
      mobileActions.disableLowPowerMode();
    }
  }, [mobileState.isLowPowerMode, mobileActions]);

  // Default item renderer optimized for mobile
  const defaultRenderItem = useCallback((item: TimelineItem, index: number) => {
    const isHovered = hoveredItem?.id === item.id;
    const isSelected = selectedItem?.id === item.id;
    const progress = item.progress || 0;
    const priority = item.priority || 0;

    return (
      <div
        key={item.id}
        className="timeline-mobile-item"
        style={{
          position: 'relative',
          backgroundColor: item.color || theme.colors.primary,
          borderRadius: '8px',
          padding: '12px 16px',
          margin: '6px 0',
          fontSize: '14px',
          color: theme.colors.background,
          cursor: 'pointer',
          userSelect: 'none',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          minHeight: '48px', // Minimum touch target size
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          touchAction: 'manipulation', // Optimize touch interactions
          WebkitTapHighlightColor: 'transparent', // Remove tap highlight
          transition: mobileState.isLowPowerMode ? 'none' : 'all 0.2s ease',
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
              borderRadius: '8px',
            }}
          />
        )}
        
        {/* Item content */}
        <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
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
              animation: mobileState.isLowPowerMode ? 'none' : 'pulse 1s infinite',
            }}
          />
        )}

        {/* Selection indicator */}
        {isSelected && (
          <div
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '8px',
              height: '8px',
              backgroundColor: theme.colors.accent,
              borderRadius: '50%',
            }}
          />
        )}
      </div>
    );
  }, [hoveredItem, selectedItem, theme, mobileState.isLowPowerMode, handleItemClick, handleItemDoubleClick, handleItemHover]);

  // Default group renderer optimized for mobile
  const defaultRenderGroup = useCallback((group: TimelineGroup, index: number) => {
    return (
      <div
        key={group.id}
        className="timeline-mobile-group"
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
          minHeight: '56px', // Minimum touch target size
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          touchAction: 'manipulation',
        }}
      >
        <span>{group.title || group.id}</span>
        <span style={{ fontSize: '14px', color: theme.colors.textSecondary }}>
          {group.items?.length || 0} items
        </span>
      </div>
    );
  }, [theme]);

  // Mobile status indicator
  const MobileStatusIndicator = () => {
    return (
      <div
        style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'monospace',
        }}
      >
        Mobile: {mobileState.isMobile ? 'Yes' : 'No'}
        <br />
        Performance: {mobileState.performanceLevel}
        <br />
        Battery: {mobileState.batteryLevel ? `${Math.round(mobileState.batteryLevel * 100)}%` : 'Unknown'}
        <br />
        Memory: {mobileState.memoryInfo ? `${Math.round(mobileState.memoryInfo.usedJSHeapSize / 1024 / 1024)}MB` : 'Unknown'}
        <br />
        Network: {mobileState.connectionType}
        <br />
        Optimized: {isOptimized ? 'Yes' : 'No'}
      </div>
    );
  };

  // Pull to refresh indicator
  const PullToRefreshIndicator = () => {
    if (!isRefreshing) return null;

    return (
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          height: '60px',
          backgroundColor: theme.colors.primary,
          color: theme.colors.background,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 'bold',
          zIndex: 1000,
        }}
      >
        <div
          style={{
            width: '20px',
            height: '20px',
            border: `2px solid ${theme.colors.background}`,
            borderTop: `2px solid transparent`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginRight: '8px',
          }}
        />
        Refreshing...
      </div>
    );
  };

  // Loading indicator
  const LoadingIndicator = () => {
    if (!isLoading) return null;

    return (
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          height: '60px',
          backgroundColor: theme.colors.surface,
          color: theme.colors.text,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 'bold',
          zIndex: 1000,
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
  };

  return (
    <div
      ref={containerRef}
      className={`timeline-mobile ${className || ''}`}
      style={{
        width,
        height,
        position: 'relative',
        backgroundColor: theme.colors.background,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '8px',
        overflow: 'auto',
        touchAction: 'manipulation', // Optimize touch interactions
        WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
        ...style,
      }}
      onTouchStart={handleTouchStart}
      onScroll={mobileActions.debounce((e) => {
        handleScroll(e);
        handleScrollEnd(e);
      }, 100)}
    >
      {/* Pull to refresh indicator */}
      <PullToRefreshIndicator />

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

      {/* Loading indicator */}
      <LoadingIndicator />

      {/* Mobile status indicator */}
      <MobileStatusIndicator />

      {/* CSS animations for fallback */}
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
          
          .timeline-mobile-item:active {
            transform: scale(0.95);
            transition: transform 0.1s ease;
          }
          
          .timeline-mobile-item:focus {
            outline: 2px solid ${theme.colors.accent};
            outline-offset: 2px;
          }
        `}
      </style>
    </div>
  );
});

export default TimelineMobile;
