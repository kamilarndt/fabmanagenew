// TimelineX Keyboard Navigation Hook
// Handles keyboard interactions for timeline

import { useCallback, useEffect } from 'react';

export interface UseTimelineKeyboardProps {
  onItemSelect?: (itemId: string) => void;
  onItemDeselect?: (itemId: string) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onPan?: (dx: number, dy: number) => void;
  onEscape?: () => void;
  onEnter?: () => void;
  onDelete?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  enabled?: boolean;
}

export function useTimelineKeyboard({
  onItemSelect,
  onItemDeselect,
  onZoomIn,
  onZoomOut,
  onPan,
  onEscape,
  onEnter,
  onDelete,
  onCopy,
  onPaste,
  onUndo,
  onRedo,
  enabled = true,
}: UseTimelineKeyboardProps) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Prevent default for handled keys
    const handledKeys = [
      'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
      'Escape', 'Enter', 'Delete', 'Backspace',
      'KeyC', 'KeyV', 'KeyZ', 'KeyY',
      'Equal', 'Minus', 'Digit0'
    ];

    if (handledKeys.includes(event.code)) {
      event.preventDefault();
    }

    // Handle key combinations
    const isCtrl = event.ctrlKey || event.metaKey;
    const isShift = event.shiftKey;
    const isAlt = event.altKey;

    switch (event.code) {
      case 'ArrowUp':
        if (isCtrl) {
          onZoomIn?.();
        } else {
          onPan?.(0, -10);
        }
        break;

      case 'ArrowDown':
        if (isCtrl) {
          onZoomOut?.();
        } else {
          onPan?.(0, 10);
        }
        break;

      case 'ArrowLeft':
        onPan?.(-10, 0);
        break;

      case 'ArrowRight':
        onPan?.(10, 0);
        break;

      case 'Escape':
        onEscape?.();
        break;

      case 'Enter':
        onEnter?.();
        break;

      case 'Delete':
      case 'Backspace':
        onDelete?.();
        break;

      case 'KeyC':
        if (isCtrl) {
          onCopy?.();
        }
        break;

      case 'KeyV':
        if (isCtrl) {
          onPaste?.();
        }
        break;

      case 'KeyZ':
        if (isCtrl) {
          if (isShift) {
            onRedo?.();
          } else {
            onUndo?.();
          }
        }
        break;

      case 'KeyY':
        if (isCtrl) {
          onRedo?.();
        }
        break;

      case 'Equal':
      case 'NumpadAdd':
        if (isCtrl) {
          onZoomIn?.();
        }
        break;

      case 'Minus':
      case 'NumpadSubtract':
        if (isCtrl) {
          onZoomOut?.();
        }
        break;

      case 'Digit0':
        if (isCtrl) {
          // Reset zoom
          onZoomOut?.();
          onZoomIn?.();
        }
        break;
    }
  }, [
    enabled,
    onItemSelect,
    onItemDeselect,
    onZoomIn,
    onZoomOut,
    onPan,
    onEscape,
    onEnter,
    onDelete,
    onCopy,
    onPaste,
    onUndo,
    onRedo,
  ]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);
}
