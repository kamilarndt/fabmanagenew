import React, { useCallback, useEffect, useRef, useState } from "react";

// Debounce hook for performance optimization
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Throttle hook for performance optimization
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastCall = useRef<number>(0);
  const lastCallTimer = useRef<NodeJS.Timeout>();

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        callback(...args);
      } else {
        if (lastCallTimer.current) {
          clearTimeout(lastCallTimer.current);
        }
        lastCallTimer.current = setTimeout(
          () => {
            lastCall.current = Date.now();
            callback(...args);
          },
          delay - (now - lastCall.current)
        );
      }
    }) as T,
    [callback, delay]
  );
};

// Virtual scrolling hook for large lists
export const useVirtualScroll = (
  items: any[],
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);

  useEffect(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(start + visibleCount + 1, items.length);

    setStartIndex(start);
    setEndIndex(end);
  }, [scrollTop, itemHeight, containerHeight, items.length]);

  const visibleItems = items.slice(startIndex, endIndex);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    onScroll: (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    },
  };
};

// Image lazy loading hook
export const useLazyImage = (
  src: string,
  options?: IntersectionObserverInit
) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setImageSrc(src);
        observer.disconnect();
      }
    }, options);

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src, options]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setIsError(true);
  };

  return {
    imgRef,
    imageSrc,
    isLoaded,
    isError,
    handleLoad,
    handleError,
  };
};

// Performance monitoring hook
export const usePerformanceMonitor = (componentName: string) => {
  const renderStart = useRef<number>(0);
  const renderCount = useRef<number>(0);

  useEffect(() => {
    renderStart.current = performance.now();
    renderCount.current += 1;

    return () => {
      const renderTime = performance.now() - renderStart.current;
      if (renderTime > 16) {
        // More than one frame
        console.warn(`${componentName} render took ${renderTime.toFixed(2)}ms`);
      }
    };
  });

  return {
    renderCount: renderCount.current,
  };
};

// Memory usage monitoring
export const useMemoryMonitor = () => {
  const [memoryInfo, setMemoryInfo] = useState<{
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null>(null);

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ("memory" in performance) {
        const memory = (performance as any).memory;
        setMemoryInfo({
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
        });
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000);

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
};

// Bundle size analyzer
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV === "development") {
    const modules = (window as any).__webpack_require__?.cache;
    if (modules) {
      const moduleSizes = Object.values(modules).map((module: any) => ({
        id: module.id,
        size: module.size || 0,
      }));

      const totalSize = moduleSizes.reduce(
        (sum, module) => sum + module.size,
        0
      );
      console.log("Bundle Analysis:", {
        totalSize,
        moduleCount: moduleSizes.length,
        largestModules: moduleSizes
          .sort((a, b) => b.size - a.size)
          .slice(0, 10),
      });
    }
  }
};

// Performance metrics collection
export const collectPerformanceMetrics = () => {
  const metrics = {
    // Core Web Vitals
    LCP: 0, // Largest Contentful Paint
    FID: 0, // First Input Delay
    CLS: 0, // Cumulative Layout Shift
    FCP: 0, // First Contentful Paint
    TTFB: 0, // Time to First Byte

    // Custom metrics
    renderTime: 0,
    memoryUsage: 0,
    bundleSize: 0,
  };

  // Collect Core Web Vitals
  // Web Vitals monitoring (commented out for build compatibility)
  // if ('web-vitals' in window) {
  //   import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
  //     getCLS((metric) => { metrics.CLS = metric.value; });
  //     getFID((metric) => { metrics.FID = metric.value; });
  //     getFCP((metric) => { metrics.FCP = metric.value; });
  //     getLCP((metric) => { metrics.LCP = metric.value; });
  //     getTTFB((metric) => { metrics.TTFB = metric.value; });
  //   });
  // }

  // Collect memory usage
  if ("memory" in performance) {
    const memory = (performance as any).memory;
    metrics.memoryUsage = memory.usedJSHeapSize;
  }

  return metrics;
};

// All exports are already done inline above
