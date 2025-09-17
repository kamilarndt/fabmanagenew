/**
 * Collaborative Timeline Component
 * Timeline with real-time collaboration features using WebSocket
 */

import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useRealtimeCollaboration } from '../hooks/useRealtimeCollaboration';
import type { TimelineItem, TimelineGroup, TimelineViewport, TimelineTheme, TimelineSettings } from '../types';

export interface TimelineCollaborativeProps {
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
  collaborationOptions?: {
    enableRealtimeSync?: boolean;
    enableUserPresence?: boolean;
    enableCursorSharing?: boolean;
    enableSelectionSharing?: boolean;
    enableConflictResolution?: boolean;
    enableOfflineMode?: boolean;
    enableOptimisticUpdates?: boolean;
    enableEventBatching?: boolean;
    enableCompression?: boolean;
    enableEncryption?: boolean;
    maxRetries?: number;
    retryDelay?: number;
    heartbeatInterval?: number;
    eventBatchSize?: number;
    eventBatchDelay?: number;
  };
  renderItem?: (item: TimelineItem, index: number) => React.ReactNode;
  renderGroup?: (group: TimelineGroup, index: number) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TimelineCollaborative: React.FC<TimelineCollaborativeProps> = memo(function TimelineCollaborative({
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
  collaborationOptions = {},
  renderItem,
  renderGroup,
  className,
  style,
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredItem, setHoveredItem] = useState<TimelineItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const {
    enableRealtimeSync = true,
    enableUserPresence = true,
    enableCursorSharing = true,
    enableSelectionSharing = true,
    enableConflictResolution = true,
    enableOfflineMode = true,
    enableOptimisticUpdates = true,
    enableEventBatching = true,
    enableCompression = true,
    enableEncryption = false,
    maxRetries = 3,
    retryDelay = 1000,
    heartbeatInterval = 30000,
    eventBatchSize = 10,
    eventBatchDelay = 100,
  } = collaborationOptions;

  // Collaboration hook
  const { state: collabState, actions: collabActions, isCollaborating, getCollaborationData } = useRealtimeCollaboration({
    enableRealtimeSync,
    enableUserPresence,
    enableCursorSharing,
    enableSelectionSharing,
    enableConflictResolution,
    enableOfflineMode,
    enableOptimisticUpdates,
    enableEventBatching,
    enableCompression,
    enableEncryption,
    maxRetries,
    retryDelay,
    heartbeatInterval,
    eventBatchSize,
    eventBatchDelay,
  });

  // Handle item click with collaboration
  const handleItemClick = useCallback((item: TimelineItem, event: React.MouseEvent) => {
    setSelectedItem(item);
    
    // Send selection event
    if (enableSelectionSharing) {
      collabActions.updateSelection([item.id]);
    }
    
    onItemClick?.(item, event);
  }, [enableSelectionSharing, collabActions, onItemClick]);

  // Handle item double click
  const handleItemDoubleClick = useCallback((item: TimelineItem, event: React.MouseEvent) => {
    onItemDoubleClick?.(item, event);
  }, [onItemDoubleClick]);

  // Handle item hover with collaboration
  const handleItemHover = useCallback((item: TimelineItem | null, event: React.MouseEvent) => {
    setHoveredItem(item);
    
    // Send cursor position
    if (enableCursorSharing && event.clientX && event.clientY) {
      collabActions.updateCursor(event.clientX, event.clientY);
    }
    
    onItemHover?.(item, event);
  }, [enableCursorSharing, collabActions, onItemHover]);

  // Handle mouse move for cursor sharing
  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (enableCursorSharing) {
      collabActions.updateCursor(event.clientX, event.clientY);
    }
  }, [enableCursorSharing, collabActions]);

  // Connect to collaboration server
  const connectToCollaboration = useCallback(async () => {
    if (collabState.isConnected || collabState.isConnecting) return;

    setIsConnecting(true);
    try {
      await collabActions.connect(
        'ws://localhost:8080',
        `user_${Date.now()}`,
        `User ${Math.floor(Math.random() * 1000)}`
      );
    } catch (error) {
      console.error('Failed to connect to collaboration server:', error);
    } finally {
      setIsConnecting(false);
    }
  }, [collabState.isConnected, collabState.isConnecting, collabActions]);

  // Disconnect from collaboration server
  const disconnectFromCollaboration = useCallback(() => {
    collabActions.disconnect();
  }, [collabActions]);

  // Default item renderer with collaboration features
  const defaultRenderItem = useCallback((item: TimelineItem, index: number) => {
    const isHovered = hoveredItem?.id === item.id;
    const isSelected = selectedItem?.id === item.id;
    const progress = item.progress || 0;
    const priority = item.priority || 0;

    // Check if item is being edited by another user
    const editingUser = collabState.users.find(user => 
      user.selection?.includes(item.id) && user.id !== collabState.currentUser?.id
    );

    return (
      <div
        key={item.id}
        className="timeline-collaborative-item"
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
          opacity: editingUser ? 0.7 : 1,
        }}
        onClick={(e) => handleItemClick(item, e)}
        onDoubleClick={(e) => handleItemDoubleClick(item, e)}
        onMouseEnter={(e) => handleItemHover(item, e)}
        onMouseLeave={(e) => handleItemHover(null, e)}
        onMouseMove={handleMouseMove}
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

        {/* Editing indicator */}
        {editingUser && (
          <div
            style={{
              position: 'absolute',
              top: '4px',
              left: '4px',
              width: '8px',
              height: '8px',
              backgroundColor: editingUser.color,
              borderRadius: '50%',
              border: '2px solid white',
            }}
            title={`Being edited by ${editingUser.name}`}
          />
        )}
      </div>
    );
  }, [hoveredItem, selectedItem, theme, collabState.users, collabState.currentUser, handleItemClick, handleItemDoubleClick, handleItemHover, handleMouseMove]);

  // Default group renderer
  const defaultRenderGroup = useCallback((group: TimelineGroup, index: number) => {
    return (
      <div
        key={group.id}
        className="timeline-collaborative-group"
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
        <span style={{ fontSize: '12px', color: theme.colors.textSecondary }}>
          {group.items?.length || 0} items
        </span>
      </div>
    );
  }, [theme]);

  // User presence indicators
  const UserPresenceIndicators = () => {
    if (!enableUserPresence || collabState.users.length === 0) return null;

    return (
      <div
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        {collabState.users.map((user) => (
          <div
            key={user.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                backgroundColor: user.color,
                borderRadius: '50%',
              }}
            />
            <span>{user.name}</span>
            {user.cursor && (
              <div
                style={{
                  position: 'absolute',
                  left: user.cursor.x,
                  top: user.cursor.y,
                  width: '2px',
                  height: '20px',
                  backgroundColor: user.color,
                  pointerEvents: 'none',
                  zIndex: 1000,
                }}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  // Collaboration status
  const CollaborationStatus = () => {
    return (
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'monospace',
        }}
      >
        Status: {collabState.connectionStatus}
        <br />
        Users: {collabState.users.length}
        <br />
        Events: {collabState.events.length}
        <br />
        Conflicts: {collabState.conflicts.length}
        {collabState.error && (
          <>
            <br />
            Error: {collabState.error}
          </>
        )}
      </div>
    );
  };

  // Connection controls
  const ConnectionControls = () => {
    return (
      <div
        style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          display: 'flex',
          gap: '8px',
        }}
      >
        {!collabState.isConnected ? (
          <button
            onClick={connectToCollaboration}
            disabled={isConnecting}
            style={{
              padding: '8px 16px',
              backgroundColor: theme.colors.primary,
              color: theme.colors.background,
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            {isConnecting ? 'Connecting...' : 'Connect'}
          </button>
        ) : (
          <button
            onClick={disconnectFromCollaboration}
            style={{
              padding: '8px 16px',
              backgroundColor: theme.colors.danger || '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Disconnect
          </button>
        )}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`timeline-collaborative ${className || ''}`}
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
      {/* Connection controls */}
      <ConnectionControls />

      {/* User presence indicators */}
      <UserPresenceIndicators />

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

      {/* Collaboration status */}
      <CollaborationStatus />

      {/* CSS for collaboration features */}
      <style>
        {`
          .timeline-collaborative-item:focus {
            outline: 2px solid ${theme.colors.accent};
            outline-offset: 2px;
          }
          
          .timeline-collaborative-item:focus-visible {
            outline: 2px solid ${theme.colors.accent};
            outline-offset: 2px;
          }
          
          .timeline-collaborative-item[aria-pressed="true"] {
            background-color: ${theme.colors.accent};
          }
        `}
      </style>
    </div>
  );
});

export default TimelineCollaborative;
