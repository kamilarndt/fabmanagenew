/**
 * Mobile Optimization Hook for TimelineX
 * Provides mobile-specific optimizations and performance enhancements
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface MobileOptimizationOptions {
  enableTouchOptimization: boolean;
  enableGestureOptimization: boolean;
  enablePerformanceOptimization: boolean;
  enableBatteryOptimization: boolean;
  enableNetworkOptimization: boolean;
  enableMemoryOptimization: boolean;
  enableViewportOptimization: boolean;
  enableScrollOptimization: boolean;
  enableAnimationOptimization: boolean;
  enableRenderingOptimization: boolean;
}

export interface MobileOptimizationState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  devicePixelRatio: number;
  screenWidth: number;
  screenHeight: number;
  orientation: 'portrait' | 'landscape';
  connectionType: 'slow-2g' | '2g' | '3g' | '4g' | '5g' | 'wifi' | 'ethernet' | 'unknown';
  memoryInfo: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null;
  batteryLevel: number | null;
  isLowPowerMode: boolean;
  isOnline: boolean;
  isVisible: boolean;
  performanceLevel: 'low' | 'medium' | 'high';
  recommendedSettings: {
    maxItems: number;
    enableVirtualScrolling: boolean;
    enableLazyLoading: boolean;
    enableWebGL: boolean;
    enableAnimations: boolean;
    enableTouchGestures: boolean;
    enableHapticFeedback: boolean;
    enableOfflineMode: boolean;
  };
}

export interface MobileOptimizationActions {
  optimizeForDevice: () => void;
  optimizeForPerformance: () => void;
  optimizeForBattery: () => void;
  optimizeForNetwork: () => void;
  optimizeForMemory: () => void;
  enableLowPowerMode: () => void;
  disableLowPowerMode: () => void;
  requestIdleCallback: (callback: () => void, options?: { timeout?: number }) => void;
  requestAnimationFrame: (callback: () => void) => void;
  debounce: <T extends (...args: any[]) => any>(func: T, delay: number) => T;
  throttle: <T extends (...args: any[]) => any>(func: T, delay: number) => T;
}

export interface UseMobileOptimizationReturn {
  state: MobileOptimizationState;
  actions: MobileOptimizationActions;
  isOptimized: boolean;
  getOptimizedSettings: () => any;
}

export function useMobileOptimization(
  options: Partial<MobileOptimizationOptions> = {}
): UseMobileOptimizationReturn {
  const {
    enableTouchOptimization = true,
    enableGestureOptimization = true,
    enablePerformanceOptimization = true,
    enableBatteryOptimization = true,
    enableNetworkOptimization = true,
    enableMemoryOptimization = true,
    enableViewportOptimization = true,
    enableScrollOptimization = true,
    enableAnimationOptimization = true,
    enableRenderingOptimization = true,
  } = options;

  // State
  const [state, setState] = useState<MobileOptimizationState>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    devicePixelRatio: 1,
    screenWidth: 0,
    screenHeight: 0,
    orientation: 'portrait',
    connectionType: 'unknown',
    memoryInfo: null,
    batteryLevel: null,
    isLowPowerMode: false,
    isOnline: true,
    isVisible: true,
    performanceLevel: 'medium',
    recommendedSettings: {
      maxItems: 1000,
      enableVirtualScrolling: false,
      enableLazyLoading: false,
      enableWebGL: false,
      enableAnimations: true,
      enableTouchGestures: true,
      enableHapticFeedback: false,
      enableOfflineMode: false,
    },
  });

  // Refs
  const optimizationTimeoutRef = useRef<NodeJS.Timeout>();
  const performanceObserverRef = useRef<PerformanceObserver | null>(null);
  const memoryCheckIntervalRef = useRef<NodeJS.Timeout>();

  // Device detection
  const detectDevice = useCallback(() => {
    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Android/i.test(userAgent) && window.innerWidth >= 768;
    const isDesktop = !isMobile && !isTablet;

    return { isMobile, isTablet, isDesktop };
  }, []);

  // Performance level detection
  const detectPerformanceLevel = useCallback(() => {
    const { isMobile, isTablet } = detectDevice();
    const memoryInfo = (performance as any).memory;
    const connection = (navigator as any).connection;
    
    let performanceLevel: 'low' | 'medium' | 'high' = 'medium';

    // Check memory
    if (memoryInfo) {
      const memoryUsage = memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit;
      if (memoryUsage > 0.8) {
        performanceLevel = 'low';
      } else if (memoryUsage > 0.5) {
        performanceLevel = 'medium';
      } else {
        performanceLevel = 'high';
      }
    }

    // Check connection
    if (connection) {
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        performanceLevel = 'low';
      } else if (connection.effectiveType === '3g') {
        performanceLevel = 'medium';
      }
    }

    // Check device type
    if (isMobile && window.innerWidth < 768) {
      performanceLevel = 'low';
    } else if (isTablet) {
      performanceLevel = 'medium';
    }

    return performanceLevel;
  }, [detectDevice]);

  // Get recommended settings based on device and performance
  const getRecommendedSettings = useCallback((performanceLevel: string, isMobile: boolean, isTablet: boolean) => {
    const baseSettings = {
      maxItems: 1000,
      enableVirtualScrolling: false,
      enableLazyLoading: false,
      enableWebGL: false,
      enableAnimations: true,
      enableTouchGestures: true,
      enableHapticFeedback: false,
      enableOfflineMode: false,
    };

    switch (performanceLevel) {
      case 'low':
        return {
          ...baseSettings,
          maxItems: 100,
          enableVirtualScrolling: true,
          enableLazyLoading: true,
          enableWebGL: false,
          enableAnimations: false,
          enableTouchGestures: true,
          enableHapticFeedback: false,
          enableOfflineMode: true,
        };
      case 'medium':
        return {
          ...baseSettings,
          maxItems: 500,
          enableVirtualScrolling: true,
          enableLazyLoading: true,
          enableWebGL: false,
          enableAnimations: true,
          enableTouchGestures: true,
          enableHapticFeedback: isMobile,
          enableOfflineMode: false,
        };
      case 'high':
        return {
          ...baseSettings,
          maxItems: 1000,
          enableVirtualScrolling: false,
          enableLazyLoading: false,
          enableWebGL: true,
          enableAnimations: true,
          enableTouchGestures: true,
          enableHapticFeedback: isMobile,
          enableOfflineMode: false,
        };
      default:
        return baseSettings;
    }
  }, []);

  // Update state
  const updateState = useCallback(() => {
    const { isMobile, isTablet, isDesktop } = detectDevice();
    const performanceLevel = detectPerformanceLevel();
    const memoryInfo = (performance as any).memory;
    const connection = (navigator as any).connection;
    const battery = (navigator as any).getBattery?.();

    setState(prev => ({
      ...prev,
      isMobile,
      isTablet,
      isDesktop,
      devicePixelRatio: window.devicePixelRatio || 1,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
      connectionType: connection?.effectiveType || 'unknown',
      memoryInfo: memoryInfo ? {
        usedJSHeapSize: memoryInfo.usedJSHeapSize,
        totalJSHeapSize: memoryInfo.totalJSHeapSize,
        jsHeapSizeLimit: memoryInfo.jsHeapSizeLimit,
      } : null,
      batteryLevel: battery?.then ? null : battery?.level || null,
      isLowPowerMode: battery?.then ? false : battery?.level < 0.2 || false,
      isOnline: navigator.onLine,
      isVisible: !document.hidden,
      performanceLevel,
      recommendedSettings: getRecommendedSettings(performanceLevel, isMobile, isTablet),
    }));
  }, [detectDevice, detectPerformanceLevel, getRecommendedSettings]);

  // Performance monitoring
  useEffect(() => {
    if (!enablePerformanceOptimization) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'measure') {
          // Monitor custom performance measures
          console.log(`Performance measure: ${entry.name} - ${entry.duration}ms`);
        }
      });
    });

    observer.observe({ entryTypes: ['measure'] });
    performanceObserverRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [enablePerformanceOptimization]);

  // Memory monitoring
  useEffect(() => {
    if (!enableMemoryOptimization) return;

    const checkMemory = () => {
      const memoryInfo = (performance as any).memory;
      if (memoryInfo) {
        const memoryUsage = memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit;
        if (memoryUsage > 0.9) {
          // Trigger garbage collection if available
          if (window.gc) {
            window.gc();
          }
        }
      }
    };

    memoryCheckIntervalRef.current = setInterval(checkMemory, 5000);

    return () => {
      if (memoryCheckIntervalRef.current) {
        clearInterval(memoryCheckIntervalRef.current);
      }
    };
  }, [enableMemoryOptimization]);

  // Event listeners
  useEffect(() => {
    const handleResize = () => updateState();
    const handleOrientationChange = () => {
      setTimeout(updateState, 100); // Delay to get correct dimensions
    };
    const handleVisibilityChange = () => {
      setState(prev => ({ ...prev, isVisible: !document.hidden }));
    };
    const handleOnline = () => {
      setState(prev => ({ ...prev, isOnline: true }));
    };
    const handleOffline = () => {
      setState(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial update
    updateState();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [updateState]);

  // Actions
  const optimizeForDevice = useCallback(() => {
    const { isMobile, isTablet } = detectDevice();
    
    if (isMobile) {
      // Mobile optimizations
      document.body.style.touchAction = 'manipulation';
      document.body.style.webkitTouchCallout = 'none';
      document.body.style.webkitUserSelect = 'none';
    }
  }, [detectDevice]);

  const optimizeForPerformance = useCallback(() => {
    // Performance optimizations
    if (state.performanceLevel === 'low') {
      // Disable expensive features
      document.body.style.willChange = 'auto';
    } else {
      // Enable performance features
      document.body.style.willChange = 'transform, opacity';
    }
  }, [state.performanceLevel]);

  const optimizeForBattery = useCallback(() => {
    if (state.isLowPowerMode) {
      // Reduce animations and effects
      document.body.style.animationDuration = '0.1s';
      document.body.style.transitionDuration = '0.1s';
    }
  }, [state.isLowPowerMode]);

  const optimizeForNetwork = useCallback(() => {
    if (state.connectionType === 'slow-2g' || state.connectionType === '2g') {
      // Reduce data usage
      // This would typically involve reducing image quality, disabling features, etc.
    }
  }, [state.connectionType]);

  const optimizeForMemory = useCallback(() => {
    if (state.memoryInfo && state.memoryInfo.usedJSHeapSize / state.memoryInfo.jsHeapSizeLimit > 0.8) {
      // Trigger garbage collection
      if (window.gc) {
        window.gc();
      }
    }
  }, [state.memoryInfo]);

  const enableLowPowerMode = useCallback(() => {
    setState(prev => ({ ...prev, isLowPowerMode: true }));
  }, []);

  const disableLowPowerMode = useCallback(() => {
    setState(prev => ({ ...prev, isLowPowerMode: false }));
  }, []);

  const requestIdleCallback = useCallback((callback: () => void, options?: { timeout?: number }) => {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(callback, options);
    } else {
      setTimeout(callback, 1);
    }
  }, []);

  const requestAnimationFrame = useCallback((callback: () => void) => {
    window.requestAnimationFrame(callback);
  }, []);

  const debounce = useCallback(<T extends (...args: any[]) => any>(func: T, delay: number): T => {
    let timeoutId: NodeJS.Timeout;
    return ((...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    }) as T;
  }, []);

  const throttle = useCallback(<T extends (...args: any[]) => any>(func: T, delay: number): T => {
    let lastCall = 0;
    return ((...args: any[]) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func(...args);
      }
    }) as T;
  }, []);

  // Check if optimized
  const isOptimized = useMemo(() => {
    return state.isMobile ? 
      state.recommendedSettings.enableVirtualScrolling && 
      state.recommendedSettings.enableLazyLoading :
      true;
  }, [state.isMobile, state.recommendedSettings]);

  // Get optimized settings
  const getOptimizedSettings = useCallback(() => {
    return state.recommendedSettings;
  }, [state.recommendedSettings]);

  // Actions object
  const actions: MobileOptimizationActions = {
    optimizeForDevice,
    optimizeForPerformance,
    optimizeForBattery,
    optimizeForNetwork,
    optimizeForMemory,
    enableLowPowerMode,
    disableLowPowerMode,
    requestIdleCallback,
    requestAnimationFrame,
    debounce,
    throttle,
  };

  return {
    state,
    actions,
    isOptimized,
    getOptimizedSettings,
  };
}
