// Responsive design hook for TimelineX

import { useCallback, useEffect, useState } from "react";

export interface BreakpointConfig {
  xs: number; // 0px
  sm: number; // 640px
  md: number; // 768px
  lg: number; // 1024px
  xl: number; // 1280px
  "2xl": number; // 1536px
}

export interface ResponsiveSettings {
  enableResponsive: boolean;
  breakpoints: BreakpointConfig;
  mobileLayout: "horizontal" | "vertical" | "stacked";
  tabletLayout: "horizontal" | "vertical" | "stacked";
  desktopLayout: "horizontal" | "vertical" | "stacked";
  adaptiveControls: boolean;
  touchOptimized: boolean;
}

export interface UseTimelineResponsiveReturn {
  currentBreakpoint: keyof BreakpointConfig;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  recommendedLayout: "horizontal" | "vertical" | "stacked";
  shouldShowControls: boolean;
  shouldShowLabels: boolean;
  itemSize: "sm" | "md" | "lg";
  updateSettings: (settings: Partial<ResponsiveSettings>) => void;
}

const DEFAULT_BREAKPOINTS: BreakpointConfig = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

const DEFAULT_SETTINGS: ResponsiveSettings = {
  enableResponsive: true,
  breakpoints: DEFAULT_BREAKPOINTS,
  mobileLayout: "vertical",
  tabletLayout: "horizontal",
  desktopLayout: "horizontal",
  adaptiveControls: true,
  touchOptimized: true,
};

export function useTimelineResponsive(
  initialSettings: Partial<ResponsiveSettings> = {}
): UseTimelineResponsiveReturn {
  const [settings, setSettings] = useState<ResponsiveSettings>({
    ...DEFAULT_SETTINGS,
    ...initialSettings,
  });

  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
  });

  const [currentBreakpoint, setCurrentBreakpoint] =
    useState<keyof BreakpointConfig>("lg");

  // Update window size on resize
  useEffect(() => {
    if (!settings.enableResponsive) return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [settings.enableResponsive]);

  // Determine current breakpoint
  useEffect(() => {
    if (!settings.enableResponsive) return;

    const width = windowSize.width;
    const breakpoints = settings.breakpoints;

    if (width >= breakpoints["2xl"]) {
      setCurrentBreakpoint("2xl");
    } else if (width >= breakpoints.xl) {
      setCurrentBreakpoint("xl");
    } else if (width >= breakpoints.lg) {
      setCurrentBreakpoint("lg");
    } else if (width >= breakpoints.md) {
      setCurrentBreakpoint("md");
    } else if (width >= breakpoints.sm) {
      setCurrentBreakpoint("sm");
    } else {
      setCurrentBreakpoint("xs");
    }
  }, [windowSize.width, settings.breakpoints, settings.enableResponsive]);

  // Calculate responsive properties
  const isMobile = currentBreakpoint === "xs" || currentBreakpoint === "sm";
  const isTablet = currentBreakpoint === "md";
  const isDesktop =
    currentBreakpoint === "lg" ||
    currentBreakpoint === "xl" ||
    currentBreakpoint === "2xl";

  const recommendedLayout = useCallback(() => {
    if (!settings.enableResponsive) return "horizontal";

    if (isMobile) return settings.mobileLayout;
    if (isTablet) return settings.tabletLayout;
    return settings.desktopLayout;
  }, [isMobile, isTablet, isDesktop, settings]);

  const shouldShowControls = useCallback(() => {
    if (!settings.adaptiveControls) return true;

    // Hide some controls on mobile to save space
    if (isMobile) return false;
    return true;
  }, [isMobile, settings.adaptiveControls]);

  const shouldShowLabels = useCallback(() => {
    // Always show labels on desktop, conditionally on mobile
    if (isDesktop) return true;
    if (isMobile) return windowSize.width > 400; // Show labels on larger mobile screens
    return true;
  }, [isDesktop, isMobile, windowSize.width]);

  const itemSize = useCallback(() => {
    if (isMobile) return "sm" as const;
    if (isTablet) return "md" as const;
    return "lg" as const;
  }, [isMobile, isTablet]);

  const updateSettings = useCallback(
    (newSettings: Partial<ResponsiveSettings>) => {
      setSettings((prev) => ({ ...prev, ...newSettings }));
    },
    []
  );

  return {
    currentBreakpoint,
    isMobile,
    isTablet,
    isDesktop,
    recommendedLayout: recommendedLayout(),
    shouldShowControls: shouldShowControls(),
    shouldShowLabels: shouldShowLabels(),
    itemSize: itemSize(),
    updateSettings,
  };
}
