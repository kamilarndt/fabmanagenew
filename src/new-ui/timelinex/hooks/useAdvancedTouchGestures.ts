/**
 * Advanced Touch Gestures Hook for TimelineX
 * Provides comprehensive touch gesture support including pinch, swipe, long press, and multi-touch
 */

import { useCallback, useEffect, useRef, useState } from 'react';

export interface TouchGestureState {
  isTouching: boolean;
  touchCount: number;
  startPosition: { x: number; y: number } | null;
  currentPosition: { x: number; y: number } | null;
  lastPosition: { x: number; y: number } | null;
  velocity: { x: number; y: number };
  scale: number;
  rotation: number;
  isPinching: boolean;
  isSwiping: boolean;
  isLongPressing: boolean;
  swipeDirection: 'left' | 'right' | 'up' | 'down' | null;
  gestureType: 'tap' | 'double-tap' | 'long-press' | 'swipe' | 'pinch' | 'rotate' | 'pan' | null;
}

export interface TouchGestureOptions {
  enablePinch: boolean;
  enableSwipe: boolean;
  enableLongPress: boolean;
  enableDoubleTap: boolean;
  enableRotation: boolean;
  enablePan: boolean;
  longPressDelay: number; // ms
  doubleTapDelay: number; // ms
  swipeThreshold: number; // pixels
  pinchThreshold: number; // scale factor
  rotationThreshold: number; // degrees
  velocityThreshold: number; // pixels/ms
  preventDefault: boolean;
  passive: boolean;
}

export interface TouchGestureCallbacks {
  onTap?: (position: { x: number; y: number }, event: TouchEvent) => void;
  onDoubleTap?: (position: { x: number; y: number }, event: TouchEvent) => void;
  onLongPress?: (position: { x: number; y: number }, event: TouchEvent) => void;
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down', velocity: { x: number; y: number }, event: TouchEvent) => void;
  onPinch?: (scale: number, center: { x: number; y: number }, event: TouchEvent) => void;
  onRotate?: (rotation: number, center: { x: number; y: number }, event: TouchEvent) => void;
  onPan?: (delta: { x: number; y: number }, velocity: { x: number; y: number }, event: TouchEvent) => void;
  onTouchStart?: (touches: TouchList, event: TouchEvent) => void;
  onTouchMove?: (touches: TouchList, event: TouchEvent) => void;
  onTouchEnd?: (touches: TouchList, event: TouchEvent) => void;
  onGestureStart?: (gestureType: string, event: TouchEvent) => void;
  onGestureEnd?: (gestureType: string, event: TouchEvent) => void;
}

export interface UseAdvancedTouchGesturesReturn {
  state: TouchGestureState;
  bind: {
    onTouchStart: (event: React.TouchEvent) => void;
    onTouchMove: (event: React.TouchEvent) => void;
    onTouchEnd: (event: React.TouchEvent) => void;
    onTouchCancel: (event: React.TouchEvent) => void;
  };
  isGestureActive: (gestureType: string) => boolean;
  getGestureData: () => {
    startPosition: { x: number; y: number } | null;
    currentPosition: { x: number; y: number } | null;
    delta: { x: number; y: number };
    velocity: { x: number; y: number };
    scale: number;
    rotation: number;
  };
}

export function useAdvancedTouchGestures(
  callbacks: TouchGestureCallbacks = {},
  options: Partial<TouchGestureOptions> = {}
): UseAdvancedTouchGesturesReturn {
  const {
    enablePinch = true,
    enableSwipe = true,
    enableLongPress = true,
    enableDoubleTap = true,
    enableRotation = true,
    enablePan = true,
    longPressDelay = 500,
    doubleTapDelay = 300,
    swipeThreshold = 50,
    pinchThreshold = 0.1,
    rotationThreshold = 5,
    velocityThreshold = 0.5,
    preventDefault = true,
    passive = false,
  } = options;

  // State
  const [state, setState] = useState<TouchGestureState>({
    isTouching: false,
    touchCount: 0,
    startPosition: null,
    currentPosition: null,
    lastPosition: null,
    velocity: { x: 0, y: 0 },
    scale: 1,
    rotation: 0,
    isPinching: false,
    isSwiping: false,
    isLongPressing: false,
    swipeDirection: null,
    gestureType: null,
  });

  // Refs
  const touchStartTime = useRef<number>(0);
  const lastTapTime = useRef<number>(0);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const lastTouchPositions = useRef<{ x: number; y: number }[]>([]);
  const initialDistance = useRef<number>(0);
  const initialAngle = useRef<number>(0);
  const lastScale = useRef<number>(1);
  const lastRotation = useRef<number>(0);

  // Utility functions
  const getDistance = (touch1: Touch, touch2: Touch): number => {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getAngle = (touch1: Touch, touch2: Touch): number => {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  };

  const getCenter = (touches: TouchList): { x: number; y: number } => {
    let x = 0;
    let y = 0;
    for (let i = 0; i < touches.length; i++) {
      x += touches[i].clientX;
      y += touches[i].clientY;
    }
    return {
      x: x / touches.length,
      y: y / touches.length,
    };
  };

  const getVelocity = (startPos: { x: number; y: number }, endPos: { x: number; y: number }, time: number): { x: number; y: number } => {
    const deltaTime = time || 1;
    return {
      x: (endPos.x - startPos.x) / deltaTime,
      y: (endPos.y - startPos.y) / deltaTime,
    };
  };

  const getSwipeDirection = (deltaX: number, deltaY: number): 'left' | 'right' | 'up' | 'down' | null => {
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    
    if (absX < swipeThreshold && absY < swipeThreshold) return null;
    
    if (absX > absY) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  };

  // Touch start handler
  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    if (preventDefault) event.preventDefault();
    
    const touches = event.nativeEvent.touches;
    const touchCount = touches.length;
    const now = Date.now();
    const center = getCenter(touches);
    
    setState(prev => ({
      ...prev,
      isTouching: true,
      touchCount,
      startPosition: center,
      currentPosition: center,
      lastPosition: center,
      velocity: { x: 0, y: 0 },
      isPinching: false,
      isSwiping: false,
      isLongPressing: false,
      swipeDirection: null,
      gestureType: null,
    }));

    touchStartTime.current = now;
    lastTouchPositions.current = Array.from(touches).map(touch => ({
      x: touch.clientX,
      y: touch.clientY,
    }));

    // Initialize multi-touch gestures
    if (touchCount === 2) {
      const distance = getDistance(touches[0], touches[1]);
      const angle = getAngle(touches[0], touches[1]);
      initialDistance.current = distance;
      initialAngle.current = angle;
      lastScale.current = 1;
      lastRotation.current = 0;
    }

    // Start long press timer
    if (enableLongPress && touchCount === 1) {
      longPressTimer.current = setTimeout(() => {
        setState(prev => ({
          ...prev,
          isLongPressing: true,
          gestureType: 'long-press',
        }));
        callbacks.onLongPress?.(center, event.nativeEvent);
        callbacks.onGestureStart?.('long-press', event.nativeEvent);
      }, longPressDelay);
    }

    callbacks.onTouchStart?.(touches, event.nativeEvent);
  }, [preventDefault, enableLongPress, longPressDelay, callbacks]);

  // Touch move handler
  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    if (preventDefault) event.preventDefault();
    
    const touches = event.nativeEvent.touches;
    const touchCount = touches.length;
    const now = Date.now();
    const center = getCenter(touches);
    const deltaTime = now - touchStartTime.current;

    setState(prev => {
      const delta = prev.startPosition ? {
        x: center.x - prev.startPosition.x,
        y: center.y - prev.startPosition.y,
      } : { x: 0, y: 0 };

      const velocity = prev.startPosition ? getVelocity(prev.startPosition, center, deltaTime) : { x: 0, y: 0 };

      let newState = {
        ...prev,
        currentPosition: center,
        lastPosition: prev.currentPosition,
        velocity,
        isPinching: false,
        isSwiping: false,
        gestureType: prev.gestureType,
      };

      // Single touch gestures
      if (touchCount === 1) {
        // Pan gesture
        if (enablePan && (Math.abs(delta.x) > 5 || Math.abs(delta.y) > 5)) {
          newState.gestureType = 'pan';
          callbacks.onPan?.(delta, velocity, event.nativeEvent);
        }

        // Swipe gesture
        if (enableSwipe && Math.abs(velocity.x) > velocityThreshold || Math.abs(velocity.y) > velocityThreshold) {
          const swipeDirection = getSwipeDirection(delta.x, delta.y);
          if (swipeDirection) {
            newState.isSwiping = true;
            newState.swipeDirection = swipeDirection;
            newState.gestureType = 'swipe';
            callbacks.onSwipe?.(swipeDirection, velocity, event.nativeEvent);
          }
        }
      }

      // Multi-touch gestures
      if (touchCount === 2) {
        const distance = getDistance(touches[0], touches[1]);
        const angle = getAngle(touches[0], touches[1]);
        
        // Pinch gesture
        if (enablePinch) {
          const scale = distance / initialDistance.current;
          const scaleDelta = scale - lastScale.current;
          
          if (Math.abs(scaleDelta) > pinchThreshold) {
            newState.isPinching = true;
            newState.scale = scale;
            newState.gestureType = 'pinch';
            callbacks.onPinch?.(scale, center, event.nativeEvent);
            lastScale.current = scale;
          }
        }

        // Rotation gesture
        if (enableRotation) {
          const rotation = angle - initialAngle.current;
          const rotationDelta = rotation - lastRotation.current;
          
          if (Math.abs(rotationDelta) > rotationThreshold) {
            newState.rotation = rotation;
            newState.gestureType = 'rotate';
            callbacks.onRotate?.(rotation, center, event.nativeEvent);
            lastRotation.current = rotation;
          }
        }
      }

      return newState;
    });

    callbacks.onTouchMove?.(touches, event.nativeEvent);
  }, [preventDefault, enablePan, enableSwipe, enablePinch, enableRotation, velocityThreshold, pinchThreshold, rotationThreshold, callbacks]);

  // Touch end handler
  const handleTouchEnd = useCallback((event: React.TouchEvent) => {
    if (preventDefault) event.preventDefault();
    
    const touches = event.nativeEvent.touches;
    const now = Date.now();
    const deltaTime = now - touchStartTime.current;

    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    setState(prev => {
      const newState = {
        ...prev,
        isTouching: false,
        touchCount: touches.length,
        isPinching: false,
        isSwiping: false,
        isLongPressing: false,
        gestureType: null,
      };

      // Handle tap gestures
      if (prev.touchCount === 1 && deltaTime < 300 && !prev.isSwiping && !prev.isLongPressing) {
        const timeSinceLastTap = now - lastTapTime.current;
        
        if (timeSinceLastTap < doubleTapDelay && enableDoubleTap) {
          // Double tap
          newState.gestureType = 'double-tap';
          callbacks.onDoubleTap?.(prev.startPosition!, event.nativeEvent);
          callbacks.onGestureStart?.('double-tap', event.nativeEvent);
        } else {
          // Single tap
          newState.gestureType = 'tap';
          callbacks.onTap?.(prev.startPosition!, event.nativeEvent);
          callbacks.onGestureStart?.('tap', event.nativeEvent);
        }
        
        lastTapTime.current = now;
      }

      // Reset multi-touch state
      if (prev.touchCount === 2) {
        initialDistance.current = 0;
        initialAngle.current = 0;
        lastScale.current = 1;
        lastRotation.current = 0;
      }

      return newState;
    });

    callbacks.onTouchEnd?.(touches, event.nativeEvent);
  }, [preventDefault, enableDoubleTap, doubleTapDelay, callbacks]);

  // Touch cancel handler
  const handleTouchCancel = useCallback((event: React.TouchEvent) => {
    if (preventDefault) event.preventDefault();
    
    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    setState(prev => ({
      ...prev,
      isTouching: false,
      touchCount: 0,
      isPinching: false,
      isSwiping: false,
      isLongPressing: false,
      gestureType: null,
    }));

    callbacks.onTouchEnd?.(event.nativeEvent.touches, event.nativeEvent);
  }, [preventDefault, callbacks]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  // Utility functions
  const isGestureActive = useCallback((gestureType: string) => {
    return state.gestureType === gestureType;
  }, [state.gestureType]);

  const getGestureData = useCallback(() => {
    const delta = state.startPosition && state.currentPosition ? {
      x: state.currentPosition.x - state.startPosition.x,
      y: state.currentPosition.y - state.startPosition.y,
    } : { x: 0, y: 0 };

    return {
      startPosition: state.startPosition,
      currentPosition: state.currentPosition,
      delta,
      velocity: state.velocity,
      scale: state.scale,
      rotation: state.rotation,
    };
  }, [state]);

  return {
    state,
    bind: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchCancel,
    },
    isGestureActive,
    getGestureData,
  };
}
