// TimelineX Touch Gestures Hook
// Handles touch interactions for timeline

import { useCallback, useEffect, useRef } from 'react';

export interface UseTimelineTouchProps {
  onZoom?: (zoom: number, center?: { x: number; y: number }) => void;
  onPan?: (pan: { x: number; y: number }) => void;
  onTap?: (x: number, y: number) => void;
  onLongPress?: (x: number, y: number) => void;
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down', distance: number) => void;
  enabled?: boolean;
  minSwipeDistance?: number;
  longPressDelay?: number;
}

export function useTimelineTouch({
  onZoom,
  onPan,
  onTap,
  onLongPress,
  onSwipe,
  enabled = true,
  minSwipeDistance = 50,
  longPressDelay = 500,
}: UseTimelineTouchProps) {
  const touchStateRef = useRef({
    touches: [] as Touch[],
    startTouches: [] as Touch[],
    startTime: 0,
    lastPan: { x: 0, y: 0 },
    longPressTimer: null as NodeJS.Timeout | null,
    isLongPress: false,
  });

  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (!enabled) return;

    const touchState = touchStateRef.current;
    touchState.touches = Array.from(event.touches);
    touchState.startTouches = Array.from(event.touches);
    touchState.startTime = Date.now();
    touchState.isLongPress = false;

    // Clear any existing long press timer
    if (touchState.longPressTimer) {
      clearTimeout(touchState.longPressTimer);
    }

    // Set up long press timer for single touch
    if (event.touches.length === 1) {
      touchState.longPressTimer = setTimeout(() => {
        if (touchState.touches.length === 1) {
          touchState.isLongPress = true;
          const touch = touchState.touches[0];
          onLongPress?.(touch.clientX, touch.clientY);
        }
      }, longPressDelay);
    }
  }, [enabled, onLongPress, longPressDelay]);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (!enabled) return;

    const touchState = touchStateRef.current;
    touchState.touches = Array.from(event.touches);

    // Clear long press timer if user moves
    if (touchState.longPressTimer) {
      clearTimeout(touchState.longPressTimer);
      touchState.longPressTimer = null;
    }

    // Handle different touch scenarios
    if (event.touches.length === 1) {
      // Single touch - pan
      const touch = event.touches[0];
      const startTouch = touchState.startTouches[0];
      
      if (startTouch) {
        const deltaX = touch.clientX - startTouch.clientX;
        const deltaY = touch.clientY - startTouch.clientY;
        
        // Update pan
        const newPan = {
          x: touchState.lastPan.x + deltaX,
          y: touchState.lastPan.y + deltaY,
        };
        
        onPan?.(newPan);
      }
    } else if (event.touches.length === 2) {
      // Two touches - zoom
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const startTouch1 = touchState.startTouches[0];
      const startTouch2 = touchState.startTouches[1];
      
      if (startTouch1 && startTouch2) {
        // Calculate current distance
        const currentDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        
        // Calculate start distance
        const startDistance = Math.sqrt(
          Math.pow(startTouch2.clientX - startTouch1.clientX, 2) +
          Math.pow(startTouch2.clientY - startTouch1.clientY, 2)
        );
        
        if (startDistance > 0) {
          const scale = currentDistance / startDistance;
          const centerX = (touch1.clientX + touch2.clientX) / 2;
          const centerY = (touch1.clientY + touch2.clientY) / 2;
          
          onZoom?.(scale, { x: centerX, y: centerY });
        }
      }
    }
  }, [enabled, onPan, onZoom]);

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (!enabled) return;

    const touchState = touchStateRef.current;
    
    // Clear long press timer
    if (touchState.longPressTimer) {
      clearTimeout(touchState.longPressTimer);
      touchState.longPressTimer = null;
    }

    // Handle tap (single touch, short duration, minimal movement)
    if (event.changedTouches.length === 1 && !touchState.isLongPress) {
      const touch = event.changedTouches[0];
      const startTouch = touchState.startTouches[0];
      
      if (startTouch) {
        const deltaX = touch.clientX - startTouch.clientX;
        const deltaY = touch.clientY - startTouch.clientY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const duration = Date.now() - touchState.startTime;
        
        // Consider it a tap if movement is minimal and duration is short
        if (distance < 10 && duration < 300) {
          onTap?.(touch.clientX, touch.clientY);
        } else if (distance >= minSwipeDistance) {
          // Handle swipe
          let direction: 'left' | 'right' | 'up' | 'down';
          
          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            direction = deltaX > 0 ? 'right' : 'left';
          } else {
            direction = deltaY > 0 ? 'down' : 'up';
          }
          
          onSwipe?.(direction, distance);
        }
      }
    }

    // Update last pan position
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      const startTouch = touchState.startTouches[0];
      
      if (startTouch) {
        const deltaX = touch.clientX - startTouch.clientX;
        const deltaY = touch.clientY - startTouch.clientY;
        
        touchState.lastPan = {
          x: touchState.lastPan.x + deltaX,
          y: touchState.lastPan.y + deltaY,
        };
      }
    } else if (event.touches.length === 0) {
      // Reset when no touches
      touchState.lastPan = { x: 0, y: 0 };
    }

    // Update touch state
    touchState.touches = Array.from(event.touches);
  }, [enabled, onTap, onSwipe, minSwipeDistance]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, enabled]);
}
