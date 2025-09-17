import React, { useEffect, useState } from "react";

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
  errorCount: number;
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
}

interface PerformanceData {
  metrics: PerformanceMetrics;
  timestamp: number;
  url: string;
  userAgent: string;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    errorCount: 0,
  });

  useEffect(() => {
    const startTime = performance.now();
    let renderTime = 0;

    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "largest-contentful-paint") {
          setMetrics((prev) => ({ ...prev, lcp: entry.startTime }));
          console.log("LCP:", entry.startTime);
        }
        if (entry.entryType === "first-input") {
          const fid = entry.processingStart - entry.startTime;
          setMetrics((prev) => ({ ...prev, fid }));
          console.log("FID:", fid);
        }
        if (entry.entryType === "layout-shift") {
          setMetrics((prev) => ({ ...prev, cls: (entry as any).value }));
          console.log("CLS:", (entry as any).value);
        }
        if (entry.entryType === "navigation") {
          const navEntry = entry as PerformanceNavigationTiming;
          setMetrics((prev) => ({
            ...prev,
            ttfb: navEntry.responseStart - navEntry.requestStart,
            loadTime: navEntry.loadEventEnd - navEntry.navigationStart,
          }));
        }
      }
    });

    // Monitor memory usage if available
    const checkMemoryUsage = () => {
      if ("memory" in performance) {
        const memoryInfo = (performance as any).memory;
        setMetrics((prev) => ({
          ...prev,
          memoryUsage: memoryInfo.usedJSHeapSize / 1024 / 1024, // Convert to MB
        }));
        console.log("Memory usage:", {
          used: memoryInfo.usedJSHeapSize,
          total: memoryInfo.totalJSHeapSize,
          limit: memoryInfo.jsHeapSizeLimit,
        });
      }
    };

    // Monitor long tasks
    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.warn("Long task detected:", entry.duration);
        // You could send this to a monitoring service
      }
    });

    // Monitor errors
    const errorObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "resource") {
          const resourceEntry = entry as PerformanceResourceTiming;
          if (
            resourceEntry.transferSize === 0 &&
            resourceEntry.decodedBodySize > 0
          ) {
            console.warn("Resource loaded from cache:", resourceEntry.name);
          }
        }
      }
    });

    // Start observing with fallback for unsupported entry types
    try {
      const supportedEntryTypes = [];

      // Check which entry types are supported
      if (
        PerformanceObserver.supportedEntryTypes?.includes(
          "largest-contentful-paint"
        )
      ) {
        supportedEntryTypes.push("largest-contentful-paint");
      }
      if (PerformanceObserver.supportedEntryTypes?.includes("first-input")) {
        supportedEntryTypes.push("first-input");
      }
      if (PerformanceObserver.supportedEntryTypes?.includes("layout-shift")) {
        supportedEntryTypes.push("layout-shift");
      }
      if (PerformanceObserver.supportedEntryTypes?.includes("navigation")) {
        supportedEntryTypes.push("navigation");
      }

      if (supportedEntryTypes.length > 0) {
        observer.observe({ entryTypes: supportedEntryTypes });
      }

      // Long task observer
      if (PerformanceObserver.supportedEntryTypes?.includes("longtask")) {
        longTaskObserver.observe({ entryTypes: ["longtask"] });
      }

      // Resource observer
      if (PerformanceObserver.supportedEntryTypes?.includes("resource")) {
        errorObserver.observe({ entryTypes: ["resource"] });
      }
    } catch (error) {
      console.warn("Performance Observer not supported:", error);
    }

    // Check memory usage periodically
    const memoryInterval = setInterval(checkMemoryUsage, 30000); // Every 30 seconds

    // Calculate render time
    const calculateRenderTime = () => {
      renderTime = performance.now() - startTime;
      setMetrics((prev) => ({ ...prev, renderTime }));
    };

    // Calculate render time after component mount
    const timeoutId = setTimeout(calculateRenderTime, 100);

    // Monitor page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkMemoryUsage();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Monitor unhandled errors
    const handleError = (event: ErrorEvent) => {
      setMetrics((prev) => ({ ...prev, errorCount: prev.errorCount + 1 }));
      console.error("Unhandled error:", event.error);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      setMetrics((prev) => ({ ...prev, errorCount: prev.errorCount + 1 }));
      console.error("Unhandled promise rejection:", event.reason);
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    // Store performance data in localStorage for debugging
    const storePerformanceData = () => {
      const performanceData: PerformanceData = {
        metrics,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      };

      try {
        const existingData = JSON.parse(
          localStorage.getItem("performance_data") || "[]"
        );
        existingData.push(performanceData);
        // Keep only last 50 entries
        const recentData = existingData.slice(-50);
        localStorage.setItem("performance_data", JSON.stringify(recentData));
      } catch (error) {
        console.error("Failed to store performance data:", error);
      }
    };

    // Store data every 5 minutes
    const storeInterval = setInterval(storePerformanceData, 300000);

    return () => {
      observer.disconnect();
      longTaskObserver.disconnect();
      errorObserver.disconnect();
      clearInterval(memoryInterval);
      clearTimeout(timeoutId);
      clearInterval(storeInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("error", handleError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
    };
  }, []);

  // Log performance metrics in development
  useEffect(() => {
    if (process.env.NODE_ENV === "development" && metrics.loadTime > 0) {
      console.group("🚀 Performance Metrics");
      console.log("Load Time:", metrics.loadTime.toFixed(2), "ms");
      console.log("Render Time:", metrics.renderTime.toFixed(2), "ms");
      if (metrics.lcp) console.log("LCP:", metrics.lcp.toFixed(2), "ms");
      if (metrics.fid) console.log("FID:", metrics.fid.toFixed(2), "ms");
      if (metrics.cls) console.log("CLS:", metrics.cls.toFixed(4));
      if (metrics.ttfb) console.log("TTFB:", metrics.ttfb.toFixed(2), "ms");
      if (metrics.memoryUsage)
        console.log("Memory Usage:", metrics.memoryUsage.toFixed(2), "MB");
      console.log("Error Count:", metrics.errorCount);
      console.groupEnd();
    }
  }, [metrics]);

  // This component doesn't render anything visible
  return null;
};

export { PerformanceMonitor };
