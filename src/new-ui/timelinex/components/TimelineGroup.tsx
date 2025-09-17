// TimelineX Group Component
// Group container for timeline items

import React, { memo, useCallback, useState } from 'react';
import { TimelineGroup as TimelineGroupType, TimelineMode, TimelineTheme, TimelineSettings } from '../types';
import { timelineStyles } from '../styles/timeline-styles';

export interface TimelineGroupProps {
  group: TimelineGroupType;
  mode: TimelineMode;
  theme: TimelineTheme;
  settings: TimelineSettings;
  onToggle?: (group: TimelineGroupType, collapsed: boolean) => void;
  renderGroup?: (group: TimelineGroupType) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const TimelineGroup = memo(function TimelineGroup({
  group,
  mode,
  theme,
  settings,
  onToggle,
  renderGroup,
  className,
  style,
  children,
}: TimelineGroupProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Handle toggle
  const handleToggle = useCallback(() => {
    onToggle?.(group, !group.collapsed);
  }, [group, onToggle]);
  
  // Handle hover
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);
  
  // Get CSS classes
  const classes = timelineStyles.getTimelineClasses();
  const stateClasses = timelineStyles.getStateClasses({
    hovered: isHovered,
  });
  
  // Generate group styles
  const groupStyles: React.CSSProperties = {
    ...style,
  };
  
  if (group.color) {
    groupStyles.borderLeftColor = group.color;
    groupStyles.borderLeftWidth = '4px';
  }
  
  // Custom render
  if (renderGroup) {
    return (
      <div
        className={`${classes.group} ${stateClasses} ${className || ''}`}
        style={groupStyles}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {renderGroup(group)}
      </div>
    );
  }
  
  return (
    <div
      className={`${classes.group} ${stateClasses} ${className || ''}`}
      style={groupStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Group header */}
      <div className={classes.groupHeader} onClick={handleToggle}>
        <div className={classes.groupTitle}>
          {group.title}
        </div>
        
        {/* Toggle button */}
        <button
          className={`${classes.groupToggle} ${group.collapsed ? 'collapsed' : ''}`}
          onClick={handleToggle}
          title={group.collapsed ? 'Expand group' : 'Collapse group'}
        >
          {group.collapsed ? '▶' : '▼'}
        </button>
      </div>
      
      {/* Group content */}
      {!group.collapsed && (
        <div className={classes.groupContent}>
          {children}
        </div>
      )}
    </div>
  );
});

// Export default
export default TimelineGroup;
