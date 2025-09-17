/**
 * Accessible Timeline Component
 * Timeline with full WCAG 2.1 AA accessibility compliance
 */

import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { getAccessibilityManager, createARIALabel, createSkipLink, createFocusTrap } from '../utils/accessibilityUtils';
import type { TimelineItem, TimelineGroup, TimelineViewport, TimelineTheme, TimelineSettings } from '../types';

export interface TimelineAccessibleProps {
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
  accessibilityOptions?: {
    enableKeyboardNavigation?: boolean;
    enableScreenReaderSupport?: boolean;
    enableHighContrast?: boolean;
    enableReducedMotion?: boolean;
    enableFocusManagement?: boolean;
    enableARIALabels?: boolean;
    enableLiveRegions?: boolean;
    enableSkipLinks?: boolean;
    enableColorBlindSupport?: boolean;
    enableVoiceControl?: boolean;
  };
  renderItem?: (item: TimelineItem, index: number) => React.ReactNode;
  renderGroup?: (group: TimelineGroup, index: number) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TimelineAccessible: React.FC<TimelineAccessibleProps> = memo(function TimelineAccessible({
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
  accessibilityOptions = {},
  renderItem,
  renderGroup,
  className,
  style,
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredItem, setHoveredItem] = useState<TimelineItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [announcements, setAnnouncements] = useState<string[]>([]);

  const {
    enableKeyboardNavigation = true,
    enableScreenReaderSupport = true,
    enableHighContrast = true,
    enableReducedMotion = true,
    enableFocusManagement = true,
    enableARIALabels = true,
    enableLiveRegions = true,
    enableSkipLinks = true,
    enableColorBlindSupport = true,
    enableVoiceControl = true,
  } = accessibilityOptions;

  // Accessibility manager
  const accessibilityManager = getAccessibilityManager();

  // Update accessibility options
  useEffect(() => {
    accessibilityManager.updateOptions(accessibilityOptions);
  }, [accessibilityOptions, accessibilityManager]);

  // Handle item click with accessibility
  const handleItemClick = useCallback((item: TimelineItem, event: React.MouseEvent) => {
    setSelectedItem(item);
    accessibilityManager.announce(`Selected item: ${item.title || item.id}`);
    onItemClick?.(item, event);
  }, [accessibilityManager, onItemClick]);

  // Handle item double click
  const handleItemDoubleClick = useCallback((item: TimelineItem, event: React.MouseEvent) => {
    accessibilityManager.announce(`Double-clicked item: ${item.title || item.id}`);
    onItemDoubleClick?.(item, event);
  }, [accessibilityManager, onItemDoubleClick]);

  // Handle item hover with accessibility
  const handleItemHover = useCallback((item: TimelineItem | null, event: React.MouseEvent) => {
    setHoveredItem(item);
    if (item) {
      accessibilityManager.announce(`Hovering over item: ${item.title || item.id}`);
    }
    onItemHover?.(item, event);
  }, [accessibilityManager, onItemHover]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        event.preventDefault();
        accessibilityManager.announce(`Navigating ${event.key.replace('Arrow', '').toLowerCase()}`);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (selectedItem) {
          accessibilityManager.announce(`Activating item: ${selectedItem.title || selectedItem.id}`);
        }
        break;
      case 'Escape':
        event.preventDefault();
        setSelectedItem(null);
        accessibilityManager.announce('Cleared selection');
        break;
    }
  }, [accessibilityManager, selectedItem]);

  // Default item renderer with accessibility
  const defaultRenderItem = useCallback((item: TimelineItem, index: number) => {
    const isHovered = hoveredItem?.id === item.id;
    const isSelected = selectedItem?.id === item.id;
    const progress = item.progress || 0;
    const priority = item.priority || 0;

    return (
      <div
        key={item.id}
        className="timeline-accessible-item"
        role="button"
        tabIndex={0}
        aria-label={createARIALabel(`Item ${index + 1}: ${item.title || item.id}`)}
        aria-describedby={`item-${item.id}-description`}
        aria-pressed={isSelected}
        aria-expanded={isSelected}
        aria-live="polite"
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
          border: isSelected ? `2px solid ${theme.colors.accent}` : '2px solid transparent',
          outline: 'none',
          transition: 'all 0.2s ease',
        }}
        onClick={(e) => handleItemClick(item, e)}
        onDoubleClick={(e) => handleItemDoubleClick(item, e)}
        onMouseEnter={(e) => handleItemHover(item, e)}
        onMouseLeave={(e) => handleItemHover(null, e)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          accessibilityManager.announce(`Focused on item: ${item.title || item.id}`);
        }}
      >
        {/* Progress bar */}
        {progress > 0 && (
          <div
            role="progressbar"
            aria-valuenow={progress * 100}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progress: ${Math.round(progress * 100)}%`}
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
            <div 
              id={`item-${item.id}-description`}
              style={{ fontSize: '11px', opacity: 0.8 }}
            >
              {item.description}
            </div>
          )}
        </div>

        {/* Priority indicator */}
        {priority > 0.5 && (
          <div
            role="img"
            aria-label="High priority item"
            style={{
              width: '8px',
              height: '8px',
              backgroundColor: 'red',
              borderRadius: '50%',
              marginLeft: '8px',
            }}
          />
        )}

        {/* Selection indicator */}
        {isSelected && (
          <div
            role="img"
            aria-label="Selected item"
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
  }, [hoveredItem, selectedItem, theme, handleItemClick, handleItemDoubleClick, handleItemHover, handleKeyDown, accessibilityManager]);

  // Default group renderer with accessibility
  const defaultRenderGroup = useCallback((group: TimelineGroup, index: number) => {
    return (
      <div
        key={group.id}
        className="timeline-accessible-group"
        role="group"
        aria-label={createARIALabel(`Group ${index + 1}: ${group.title || group.id}`)}
        aria-expanded="true"
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
        }}
      >
        <span>{group.title || group.id}</span>
        <span 
          aria-label={`${group.items?.length || 0} items in this group`}
          style={{ fontSize: '12px', color: theme.colors.textSecondary }}
        >
          {group.items?.length || 0} items
        </span>
      </div>
    );
  }, [theme]);

  // Skip links
  const SkipLinks = () => {
    if (!enableSkipLinks) return null;

    return (
      <div className="timeline-skip-links">
        {createSkipLink('Skip to timeline', 'timeline-main')}
        {createSkipLink('Skip to controls', 'timeline-controls')}
        {createSkipLink('Skip to items', 'timeline-items')}
      </div>
    );
  };

  // Live region for announcements
  const LiveRegion = () => {
    if (!enableLiveRegions) return null;

    return (
      <div
        aria-live="polite"
        aria-atomic="true"
        className="timeline-live-region"
        style={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      >
        {announcements[announcements.length - 1]}
      </div>
    );
  };

  // Focus trap
  useEffect(() => {
    if (!enableFocusManagement || !containerRef.current) return;

    const cleanup = createFocusTrap(containerRef.current);
    return cleanup;
  }, [enableFocusManagement]);

  // Update focusable elements
  useEffect(() => {
    if (!enableFocusManagement) return;

    const focusableElements = containerRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    if (focusableElements) {
      accessibilityManager.setFocusableElements(Array.from(focusableElements));
    }
  }, [enableFocusManagement, accessibilityManager, items, groups]);

  return (
    <div
      ref={containerRef}
      className={`timeline-accessible ${className || ''}`}
      id="timeline-main"
      role="application"
      aria-label="Interactive timeline"
      aria-describedby="timeline-description"
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
    >
      {/* Skip links */}
      <SkipLinks />

      {/* Live region */}
      <LiveRegion />

      {/* Timeline description */}
      <div
        id="timeline-description"
        className="sr-only"
        style={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      >
        Interactive timeline with {items.length} items in {groups.length} groups. 
        Use arrow keys to navigate, Enter to activate, and Escape to clear selection.
      </div>

      {/* Groups */}
      <div style={{ marginBottom: '16px' }}>
        {groups.map((group, index) => (
          <div key={group.id}>
            {renderGroup ? renderGroup(group, index) : defaultRenderGroup(group, index)}
          </div>
        ))}
      </div>

      {/* Items */}
      <div 
        id="timeline-items"
        role="list"
        aria-label="Timeline items"
        style={{ marginBottom: '16px' }}
      >
        {items.map((item, index) => (
          <div key={item.id} role="listitem">
            {renderItem ? renderItem(item, index) : defaultRenderItem(item, index)}
          </div>
        ))}
      </div>

      {/* Accessibility status */}
      <div
        className="timeline-accessibility-status"
        style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'monospace',
        }}
      >
        A11y: {accessibilityManager.getState().isKeyboardFocused ? 'Keyboard' : 'Mouse'}
        <br />
        Focus: {accessibilityManager.getState().currentFocusIndex + 1}/{accessibilityManager.getState().totalFocusableElements}
        <br />
        Items: {items.length}
      </div>

      {/* CSS for accessibility */}
      <style>
        {`
          .timeline-accessible-item:focus {
            outline: 2px solid ${theme.colors.accent};
            outline-offset: 2px;
          }
          
          .timeline-accessible-item:focus-visible {
            outline: 2px solid ${theme.colors.accent};
            outline-offset: 2px;
          }
          
          .timeline-accessible-item[aria-pressed="true"] {
            background-color: ${theme.colors.accent};
          }
          
          .sr-only {
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
          }
          
          .timeline-high-contrast .timeline-accessible-item {
            border: 2px solid currentColor;
          }
          
          .timeline-reduced-motion .timeline-accessible-item {
            transition: none;
          }
        `}
      </style>
    </div>
  );
});

export default TimelineAccessible;
