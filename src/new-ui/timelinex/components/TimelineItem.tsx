// TimelineX Item Component
// Individual timeline item component with interactions

import React, { memo, useCallback, useState, useRef, useEffect } from 'react';
import { TimelineItem as TimelineItemType, TimelineMode, TimelineTheme, TimelineSettings } from '../types';
import { timelineStyles } from '../styles/timeline-styles';

export interface TimelineItemProps {
  item: TimelineItemType;
  mode: TimelineMode;
  theme: TimelineTheme;
  settings: TimelineSettings;
  isSelected?: boolean;
  isHovered?: boolean;
  isFocused?: boolean;
  readonly?: boolean;
  selectable?: boolean;
  editable?: boolean;
  draggable?: boolean;
  resizable?: boolean;
  onClick?: (item: TimelineItemType, event: React.MouseEvent) => void;
  onDoubleClick?: (item: TimelineItemType, event: React.MouseEvent) => void;
  onHover?: (item: TimelineItemType | null, event: React.MouseEvent) => void;
  onUpdate?: (item: TimelineItemType) => void;
  onDelete?: (itemId: string) => void;
  renderItem?: (item: TimelineItemType) => React.ReactNode;
  renderTooltip?: (item: TimelineItemType) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TimelineItem = memo(function TimelineItem({
  item,
  mode,
  theme,
  settings,
  isSelected = false,
  isHovered = false,
  isFocused = false,
  readonly = false,
  selectable = true,
  editable = true,
  draggable = true,
  resizable = true,
  onClick,
  onDoubleClick,
  onHover,
  onUpdate,
  onDelete,
  renderItem,
  renderTooltip,
  className,
  style,
}: TimelineItemProps) {
  // Refs
  const itemRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  
  // State
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(item.title);
  
  // Calculate item bounds based on mode
  const getItemBounds = useCallback(() => {
    const container = itemRef.current?.parentElement;
    if (!container) return { x: 0, y: 0, width: 100, height: 32 };
    
    const rect = container.getBoundingClientRect();
    const containerWidth = rect.width;
    const containerHeight = rect.height;
    
    // This is a simplified calculation - in a real implementation,
    // this would be calculated based on the actual timeline viewport
    const itemStart = item.start.getTime();
    const itemEnd = (item.end || item.start).getTime();
    const duration = itemEnd - itemStart;
    
    let x = 0;
    let y = 0;
    let width = 100;
    let height = 32;
    
    switch (mode) {
      case 'horizontal':
        width = Math.max(50, duration / (24 * 60 * 60 * 1000) * 100); // 1 day = 100px
        height = 32;
        break;
      case 'vertical':
        height = Math.max(50, duration / (24 * 60 * 60 * 1000) * 100);
        width = containerWidth;
        break;
      case 'alternating':
        width = containerWidth / 2;
        height = Math.max(50, duration / (24 * 60 * 60 * 1000) * 100);
        break;
      case 'spiral':
      case 'circular':
        width = 32;
        height = 32;
        break;
      case 'gantt':
        width = Math.max(50, duration / (24 * 60 * 60 * 1000) * 100);
        height = 24;
        break;
      case 'calendar':
        width = Math.max(50, duration / (24 * 60 * 60 * 1000) * 100);
        height = 20;
        break;
      case 'masonry':
        width = containerWidth;
        height = Math.max(50, duration / (24 * 60 * 60 * 1000) * 100);
        break;
    }
    
    return { x, y, width, height };
  }, [item, mode]);
  
  // Handle click
  const handleClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    onClick?.(item, event);
  }, [item, onClick]);
  
  // Handle double click
  const handleDoubleClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    if (editable && !readonly) {
      setIsEditing(true);
    }
    onDoubleClick?.(item, event);
  }, [item, editable, readonly, onDoubleClick]);
  
  // Handle hover
  const handleMouseEnter = useCallback((event: React.MouseEvent) => {
    onHover?.(item, event);
  }, [item, onHover]);
  
  const handleMouseLeave = useCallback((event: React.MouseEvent) => {
    onHover?.(null, event);
  }, [onHover]);
  
  // Handle drag start
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (!draggable || readonly) return;
    
    event.preventDefault();
    setIsDragging(true);
    setDragStart({ x: event.clientX, y: event.clientY });
  }, [draggable, readonly]);
  
  // Handle drag
  useEffect(() => {
    if (!isDragging) return;
    
    const handleMouseMove = (event: MouseEvent) => {
      const dx = event.clientX - dragStart.x;
      const dy = event.clientY - dragStart.y;
      
      // Update item position
      const newStart = new Date(item.start.getTime() + dx * 1000);
      const newEnd = item.end ? new Date(item.end.getTime() + dx * 1000) : undefined;
      
      onUpdate?.({
        ...item,
        start: newStart,
        end: newEnd,
      });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, item, onUpdate]);
  
  // Handle resize start
  const handleResizeStart = useCallback((event: React.MouseEvent) => {
    if (!resizable || readonly) return;
    
    event.preventDefault();
    event.stopPropagation();
    setIsResizing(true);
    setResizeStart({ x: event.clientX, y: event.clientY, width: getItemBounds().width });
  }, [resizable, readonly, getItemBounds]);
  
  // Handle resize
  useEffect(() => {
    if (!isResizing) return;
    
    const handleMouseMove = (event: MouseEvent) => {
      const dx = event.clientX - resizeStart.x;
      const newWidth = Math.max(20, resizeStart.width + dx);
      
      // Update item duration
      const duration = item.end ? item.end.getTime() - item.start.getTime() : 0;
      const newDuration = (newWidth / resizeStart.width) * duration;
      const newEnd = new Date(item.start.getTime() + newDuration);
      
      onUpdate?.({
        ...item,
        end: newEnd,
      });
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeStart, item, onUpdate]);
  
  // Handle edit
  const handleEditSubmit = useCallback(() => {
    if (editValue.trim()) {
      onUpdate?.({
        ...item,
        title: editValue.trim(),
      });
    }
    setIsEditing(false);
  }, [editValue, item, onUpdate]);
  
  const handleEditCancel = useCallback(() => {
    setEditValue(item.title);
    setIsEditing(false);
  }, [item.title]);
  
  const handleEditKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleEditSubmit();
    } else if (event.key === 'Escape') {
      handleEditCancel();
    }
  }, [handleEditSubmit, handleEditCancel]);
  
  // Handle delete
  const handleDelete = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this item?')) {
      onDelete?.(item.id);
    }
  }, [item.id, onDelete]);
  
  // Get item bounds
  const bounds = getItemBounds();
  
  // Generate CSS classes
  const classes = timelineStyles.getTimelineClasses();
  const itemTypeClass = timelineStyles.getItemTypeClasses(item.type || 'event');
  const priorityClass = timelineStyles.getPriorityClasses(item.priority || 'medium');
  const statusClass = timelineStyles.getStatusClasses(item.status || 'pending');
  const stateClasses = timelineStyles.getStateClasses({
    selected: isSelected,
    hovered: isHovered,
    focused: isFocused,
    disabled: readonly,
    draggable: draggable && !readonly,
    resizable: resizable && !readonly,
    editable: editable && !readonly,
    clickable: selectable,
  });
  
  // Generate item styles
  const itemStyles = timelineStyles.getItemStyles(item);
  
  // Custom render
  if (renderItem) {
    return (
      <div
        ref={itemRef}
        className={`${classes.item} ${itemTypeClass} ${priorityClass} ${statusClass} ${stateClasses} ${className || ''}`}
        style={{
          ...itemStyles,
          ...style,
        }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
      >
        {renderItem(item)}
      </div>
    );
  }
  
  return (
    <div
      ref={itemRef}
      className={`${classes.item} ${itemTypeClass} ${priorityClass} ${statusClass} ${stateClasses} ${className || ''}`}
      style={{
        ...itemStyles,
        ...style,
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
    >
      {/* Item content */}
      <div className={classes.itemContent}>
        {isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleEditSubmit}
            onKeyDown={handleEditKeyDown}
            className="timeline-item-edit-input"
            autoFocus
          />
        ) : (
          <>
            <h3 className={classes.itemTitle}>{item.title}</h3>
            {item.description && (
              <p className={classes.itemDescription}>{item.description}</p>
            )}
          </>
        )}
      </div>
      
      {/* Item media */}
      {item.media && (
        <div className={classes.itemMedia}>
          {item.media.type === 'image' && (
            <img
              src={item.media.url}
              alt={item.media.alt || item.title}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '100px',
                objectFit: 'cover',
              }}
            />
          )}
          {item.media.type === 'video' && (
            <video
              src={item.media.url}
              controls={item.media.controls}
              autoPlay={item.media.autoplay}
              loop={item.media.loop}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '100px',
              }}
            />
          )}
        </div>
      )}
      
      {/* Progress bar */}
      {item.progress !== undefined && (
        <div className={classes.itemProgress} style={{ width: `${item.progress}%` }} />
      )}
      
      {/* Priority badge */}
      {item.priority === 'high' || item.priority === 'critical' && (
        <div className={classes.itemBadge}>
          {item.priority === 'critical' ? '!' : '!'}
        </div>
      )}
      
      {/* Resize handle */}
      {resizable && !readonly && (
        <div
          ref={resizeHandleRef}
          className="timeline-item-resize-handle"
          onMouseDown={handleResizeStart}
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: '8px',
            height: '100%',
            cursor: 'ew-resize',
            backgroundColor: 'transparent',
          }}
        />
      )}
      
      {/* Delete button */}
      {editable && !readonly && (
        <button
          onClick={handleDelete}
          className="timeline-item-delete-button"
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: theme.colors.error,
            color: 'white',
            fontSize: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Delete item"
        >
          ×
        </button>
      )}
      
      {/* Tooltip */}
      {settings.showTooltips && isHovered && renderTooltip && (
        <div className="timeline-item-tooltip">
          {renderTooltip(item)}
        </div>
      )}
    </div>
  );
});

// Export default
export default TimelineItem;
