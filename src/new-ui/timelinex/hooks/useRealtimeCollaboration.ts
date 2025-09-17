/**
 * Real-time Collaboration Hook for TimelineX
 * Provides WebSocket-based real-time collaboration features
 */

import { useCallback, useEffect, useRef, useState } from 'react';

export interface CollaborationUser {
  id: string;
  name: string;
  color: string;
  avatar?: string;
  cursor?: { x: number; y: number };
  selection?: string[];
  isActive: boolean;
  lastSeen: Date;
}

export interface CollaborationEvent {
  type: 'item_create' | 'item_update' | 'item_delete' | 'item_move' | 'item_resize' | 'item_select' | 'viewport_change' | 'cursor_move' | 'user_join' | 'user_leave' | 'user_typing' | 'conflict_resolve';
  userId: string;
  timestamp: Date;
  data: any;
  id: string;
}

export interface CollaborationOptions {
  enableRealtimeSync: boolean;
  enableUserPresence: boolean;
  enableCursorSharing: boolean;
  enableSelectionSharing: boolean;
  enableConflictResolution: boolean;
  enableOfflineMode: boolean;
  enableOptimisticUpdates: boolean;
  enableEventBatching: boolean;
  enableCompression: boolean;
  enableEncryption: boolean;
  maxRetries: number;
  retryDelay: number;
  heartbeatInterval: number;
  eventBatchSize: number;
  eventBatchDelay: number;
}

export interface CollaborationState {
  isConnected: boolean;
  isConnecting: boolean;
  isReconnecting: boolean;
  users: CollaborationUser[];
  currentUser: CollaborationUser | null;
  events: CollaborationEvent[];
  conflicts: CollaborationEvent[];
  isOffline: boolean;
  lastSyncTime: Date | null;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error';
  error: string | null;
}

export interface CollaborationActions {
  connect: (url: string, userId: string, userName: string) => Promise<void>;
  disconnect: () => void;
  sendEvent: (event: Omit<CollaborationEvent, 'userId' | 'timestamp' | 'id'>) => void;
  resolveConflict: (conflictId: string, resolution: 'accept' | 'reject' | 'merge') => void;
  updateCursor: (x: number, y: number) => void;
  updateSelection: (selection: string[]) => void;
  startTyping: () => void;
  stopTyping: () => void;
  syncData: () => Promise<void>;
  retryConnection: () => void;
  clearEvents: () => void;
  exportEvents: () => CollaborationEvent[];
  importEvents: (events: CollaborationEvent[]) => void;
}

export interface UseRealtimeCollaborationReturn {
  state: CollaborationState;
  actions: CollaborationActions;
  isCollaborating: boolean;
  getCollaborationData: () => any;
}

export function useRealtimeCollaboration(
  options: Partial<CollaborationOptions> = {}
): UseRealtimeCollaborationReturn {
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
  } = options;

  // State
  const [state, setState] = useState<CollaborationState>({
    isConnected: false,
    isConnecting: false,
    isReconnecting: false,
    users: [],
    currentUser: null,
    events: [],
    conflicts: [],
    isOffline: false,
    lastSyncTime: null,
    connectionStatus: 'disconnected',
    error: null,
  });

  // Refs
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const heartbeatTimeoutRef = useRef<NodeJS.Timeout>();
  const eventBatchRef = useRef<CollaborationEvent[]>([]);
  const batchTimeoutRef = useRef<NodeJS.Timeout>();
  const retryCountRef = useRef(0);
  const isTypingRef = useRef(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Generate unique event ID
  const generateEventId = useCallback(() => {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Connect to WebSocket
  const connect = useCallback(async (url: string, userId: string, userName: string) => {
    if (state.isConnected || state.isConnecting) return;

    setState(prev => ({
      ...prev,
      isConnecting: true,
      connectionStatus: 'connecting',
      error: null,
    }));

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setState(prev => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          isReconnecting: false,
          connectionStatus: 'connected',
          currentUser: {
            id: userId,
            name: userName,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`,
            isActive: true,
            lastSeen: new Date(),
          },
          error: null,
        }));

        // Send user join event
        sendEvent({
          type: 'user_join',
          data: { userId, userName },
        });

        // Start heartbeat
        startHeartbeat();
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleIncomingEvent(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        setState(prev => ({
          ...prev,
          isConnected: false,
          isConnecting: false,
          connectionStatus: 'disconnected',
        }));

        // Attempt reconnection
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current++;
          setState(prev => ({
            ...prev,
            isReconnecting: true,
            connectionStatus: 'reconnecting',
          }));

          reconnectTimeoutRef.current = setTimeout(() => {
            connect(url, userId, userName);
          }, retryDelay * retryCountRef.current);
        }
      };

      ws.onerror = (error) => {
        setState(prev => ({
          ...prev,
          error: 'WebSocket connection error',
          connectionStatus: 'error',
        }));
      };

    } catch (error) {
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: 'Failed to connect to WebSocket',
        connectionStatus: 'error',
      }));
    }
  }, [state.isConnected, state.isConnecting, maxRetries, retryDelay]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
    }

    if (batchTimeoutRef.current) {
      clearTimeout(batchTimeoutRef.current);
    }

    setState(prev => ({
      ...prev,
      isConnected: false,
      isConnecting: false,
      isReconnecting: false,
      connectionStatus: 'disconnected',
      currentUser: null,
    }));

    retryCountRef.current = 0;
  }, []);

  // Send event
  const sendEvent = useCallback((event: Omit<CollaborationEvent, 'userId' | 'timestamp' | 'id'>) => {
    if (!state.isConnected || !wsRef.current) return;

    const fullEvent: CollaborationEvent = {
      ...event,
      userId: state.currentUser?.id || 'unknown',
      timestamp: new Date(),
      id: generateEventId(),
    };

    if (enableEventBatching) {
      eventBatchRef.current.push(fullEvent);

      if (eventBatchRef.current.length >= eventBatchSize) {
        flushEventBatch();
      } else {
        batchTimeoutRef.current = setTimeout(() => {
          flushEventBatch();
        }, eventBatchDelay);
      }
    } else {
      wsRef.current.send(JSON.stringify(fullEvent));
    }
  }, [state.isConnected, state.currentUser, enableEventBatching, eventBatchSize, eventBatchDelay, generateEventId]);

  // Flush event batch
  const flushEventBatch = useCallback(() => {
    if (eventBatchRef.current.length === 0 || !wsRef.current) return;

    const events = [...eventBatchRef.current];
    eventBatchRef.current = [];

    if (enableCompression) {
      // Compress events (simplified)
      wsRef.current.send(JSON.stringify({ type: 'batch', events }));
    } else {
      events.forEach(event => {
        wsRef.current!.send(JSON.stringify(event));
      });
    }
  }, [enableCompression]);

  // Handle incoming event
  const handleIncomingEvent = useCallback((event: CollaborationEvent) => {
    if (event.userId === state.currentUser?.id) return;

    setState(prev => ({
      ...prev,
      events: [...prev.events, event],
      lastSyncTime: new Date(),
    }));

    // Handle specific event types
    switch (event.type) {
      case 'user_join':
        setState(prev => ({
          ...prev,
          users: [...prev.users, event.data],
        }));
        break;
      case 'user_leave':
        setState(prev => ({
          ...prev,
          users: prev.users.filter(user => user.id !== event.data.userId),
        }));
        break;
      case 'cursor_move':
        setState(prev => ({
          ...prev,
          users: prev.users.map(user => 
            user.id === event.userId 
              ? { ...user, cursor: event.data }
              : user
          ),
        }));
        break;
      case 'item_select':
        setState(prev => ({
          ...prev,
          users: prev.users.map(user => 
            user.id === event.userId 
              ? { ...user, selection: event.data }
              : user
          ),
        }));
        break;
      case 'conflict_resolve':
        setState(prev => ({
          ...prev,
          conflicts: prev.conflicts.filter(conflict => conflict.id !== event.data.conflictId),
        }));
        break;
    }
  }, [state.currentUser]);

  // Start heartbeat
  const startHeartbeat = useCallback(() => {
    if (!state.isConnected) return;

    heartbeatTimeoutRef.current = setTimeout(() => {
      if (wsRef.current && state.isConnected) {
        wsRef.current.send(JSON.stringify({ type: 'heartbeat' }));
        startHeartbeat();
      }
    }, heartbeatInterval);
  }, [state.isConnected, heartbeatInterval]);

  // Resolve conflict
  const resolveConflict = useCallback((conflictId: string, resolution: 'accept' | 'reject' | 'merge') => {
    sendEvent({
      type: 'conflict_resolve',
      data: { conflictId, resolution },
    });
  }, [sendEvent]);

  // Update cursor
  const updateCursor = useCallback((x: number, y: number) => {
    if (!enableCursorSharing) return;

    sendEvent({
      type: 'cursor_move',
      data: { x, y },
    });
  }, [enableCursorSharing, sendEvent]);

  // Update selection
  const updateSelection = useCallback((selection: string[]) => {
    if (!enableSelectionSharing) return;

    sendEvent({
      type: 'item_select',
      data: selection,
    });
  }, [enableSelectionSharing, sendEvent]);

  // Start typing
  const startTyping = useCallback(() => {
    if (isTypingRef.current) return;

    isTypingRef.current = true;
    sendEvent({
      type: 'user_typing',
      data: { isTyping: true },
    });

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  }, [sendEvent]);

  // Stop typing
  const stopTyping = useCallback(() => {
    if (!isTypingRef.current) return;

    isTypingRef.current = false;
    sendEvent({
      type: 'user_typing',
      data: { isTyping: false },
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }, [sendEvent]);

  // Sync data
  const syncData = useCallback(async () => {
    if (!state.isConnected) return;

    sendEvent({
      type: 'sync_request',
      data: { timestamp: state.lastSyncTime },
    });
  }, [state.isConnected, state.lastSyncTime, sendEvent]);

  // Retry connection
  const retryConnection = useCallback(() => {
    if (state.currentUser) {
      connect('ws://localhost:8080', state.currentUser.id, state.currentUser.name);
    }
  }, [state.currentUser, connect]);

  // Clear events
  const clearEvents = useCallback(() => {
    setState(prev => ({
      ...prev,
      events: [],
      conflicts: [],
    }));
  }, []);

  // Export events
  const exportEvents = useCallback(() => {
    return state.events;
  }, [state.events]);

  // Import events
  const importEvents = useCallback((events: CollaborationEvent[]) => {
    setState(prev => ({
      ...prev,
      events: [...prev.events, ...events],
    }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  // Actions object
  const actions: CollaborationActions = {
    connect,
    disconnect,
    sendEvent,
    resolveConflict,
    updateCursor,
    updateSelection,
    startTyping,
    stopTyping,
    syncData,
    retryConnection,
    clearEvents,
    exportEvents,
    importEvents,
  };

  // Check if collaborating
  const isCollaborating = state.isConnected && state.users.length > 1;

  // Get collaboration data
  const getCollaborationData = useCallback(() => {
    return {
      users: state.users,
      events: state.events,
      conflicts: state.conflicts,
      isConnected: state.isConnected,
      lastSyncTime: state.lastSyncTime,
    };
  }, [state]);

  return {
    state,
    actions,
    isCollaborating,
    getCollaborationData,
  };
}
