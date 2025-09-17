// Undo/Redo system for TimelineX

import { useCallback, useRef } from "react";
import { TimelineGroup, TimelineItem } from "../types";

export interface TimelineState {
  items: TimelineItem[];
  groups: TimelineGroup[];
  viewport: {
    start: Date;
    end: Date;
    zoom: number;
    pan: { x: number; y: number };
  };
}

export interface UndoRedoAction {
  type: "add" | "update" | "delete" | "move" | "resize" | "group" | "viewport";
  itemId?: string;
  groupId?: string;
  before: any;
  after: any;
  timestamp: number;
}

export interface UseTimelineUndoRedoReturn {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  pushAction: (action: Omit<UndoRedoAction, "timestamp">) => void;
  clearHistory: () => void;
  getHistory: () => UndoRedoAction[];
}

export function useTimelineUndoRedo(
  currentState: TimelineState,
  onStateChange: (newState: Partial<TimelineState>) => void
): UseTimelineUndoRedoReturn {
  const historyRef = useRef<UndoRedoAction[]>([]);
  const currentIndexRef = useRef<number>(-1);
  const maxHistorySize = 50;

  const canUndo = currentIndexRef.current >= 0;
  const canRedo = currentIndexRef.current < historyRef.current.length - 1;

  const pushAction = useCallback(
    (action: Omit<UndoRedoAction, "timestamp">) => {
      const fullAction: UndoRedoAction = {
        ...action,
        timestamp: Date.now(),
      };

      // Remove any actions after current index (when branching)
      historyRef.current = historyRef.current.slice(
        0,
        currentIndexRef.current + 1
      );

      // Add new action
      historyRef.current.push(fullAction);
      currentIndexRef.current = historyRef.current.length - 1;

      // Limit history size
      if (historyRef.current.length > maxHistorySize) {
        historyRef.current = historyRef.current.slice(-maxHistorySize);
        currentIndexRef.current = historyRef.current.length - 1;
      }
    },
    []
  );

  const undo = useCallback(() => {
    if (!canUndo) return;

    const action = historyRef.current[currentIndexRef.current];
    currentIndexRef.current--;

    // Apply reverse action
    switch (action.type) {
      case "add":
        // Remove the item that was added
        onStateChange({
          items: currentState.items.filter((item) => item.id !== action.itemId),
        });
        break;

      case "update":
        // Restore previous state
        if (action.itemId) {
          onStateChange({
            items: currentState.items.map((item) =>
              item.id === action.itemId ? action.before : item
            ),
          });
        }
        break;

      case "delete":
        // Restore deleted item
        onStateChange({
          items: [...currentState.items, action.before],
        });
        break;

      case "move":
        // Restore previous position
        if (action.itemId) {
          onStateChange({
            items: currentState.items.map((item) =>
              item.id === action.itemId ? action.before : item
            ),
          });
        }
        break;

      case "resize":
        // Restore previous size
        if (action.itemId) {
          onStateChange({
            items: currentState.items.map((item) =>
              item.id === action.itemId ? action.before : item
            ),
          });
        }
        break;

      case "group":
        // Restore previous group state
        if (action.groupId) {
          onStateChange({
            groups: currentState.groups.map((group) =>
              group.id === action.groupId ? action.before : group
            ),
          });
        }
        break;

      case "viewport":
        // Restore previous viewport
        onStateChange({
          viewport: action.before,
        });
        break;
    }
  }, [canUndo, currentState, onStateChange]);

  const redo = useCallback(() => {
    if (!canRedo) return;

    currentIndexRef.current++;
    const action = historyRef.current[currentIndexRef.current];

    // Apply action
    switch (action.type) {
      case "add":
        // Add the item back
        onStateChange({
          items: [...currentState.items, action.after],
        });
        break;

      case "update":
        // Apply the update
        if (action.itemId) {
          onStateChange({
            items: currentState.items.map((item) =>
              item.id === action.itemId ? action.after : item
            ),
          });
        }
        break;

      case "delete":
        // Delete the item again
        onStateChange({
          items: currentState.items.filter((item) => item.id !== action.itemId),
        });
        break;

      case "move":
        // Apply the move
        if (action.itemId) {
          onStateChange({
            items: currentState.items.map((item) =>
              item.id === action.itemId ? action.after : item
            ),
          });
        }
        break;

      case "resize":
        // Apply the resize
        if (action.itemId) {
          onStateChange({
            items: currentState.items.map((item) =>
              item.id === action.itemId ? action.after : item
            ),
          });
        }
        break;

      case "group":
        // Apply group change
        if (action.groupId) {
          onStateChange({
            groups: currentState.groups.map((group) =>
              group.id === action.groupId ? action.after : group
            ),
          });
        }
        break;

      case "viewport":
        // Apply viewport change
        onStateChange({
          viewport: action.after,
        });
        break;
    }
  }, [canRedo, currentState, onStateChange]);

  const clearHistory = useCallback(() => {
    historyRef.current = [];
    currentIndexRef.current = -1;
  }, []);

  const getHistory = useCallback(() => {
    return [...historyRef.current];
  }, []);

  return {
    canUndo,
    canRedo,
    undo,
    redo,
    pushAction,
    clearHistory,
    getHistory,
  };
}
