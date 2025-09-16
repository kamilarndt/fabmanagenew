/**
 * Responsive utilities for the new UI system
 */

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

export const containerSizes = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1400px",
} as const;

/**
 * Responsive grid classes
 */
export const gridClasses = {
  // Auto-fit grids
  autoFit: {
    sm: "tw-grid-cols-[repeat(auto-fit,minmax(200px,1fr))]",
    md: "tw-grid-cols-[repeat(auto-fit,minmax(250px,1fr))]",
    lg: "tw-grid-cols-[repeat(auto-fit,minmax(300px,1fr))]",
  },

  // Fixed column grids
  fixed: {
    1: "tw-grid-cols-1",
    2: "tw-grid-cols-1 md:tw-grid-cols-2",
    3: "tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3",
    4: "tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 xl:tw-grid-cols-4",
    5: "tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 xl:tw-grid-cols-4 2xl:tw-grid-cols-5",
    6: "tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 xl:tw-grid-cols-4 2xl:tw-grid-cols-5 3xl:tw-grid-cols-6",
  },
} as const;

/**
 * Responsive spacing classes
 */
export const spacingClasses = {
  // Padding
  padding: {
    none: "tw-p-0",
    sm: "tw-p-2 md:tw-p-4 lg:tw-p-6",
    md: "tw-p-4 md:tw-p-6 lg:tw-p-8",
    lg: "tw-p-6 md:tw-p-8 lg:tw-p-12",
  },

  // Margin
  margin: {
    none: "tw-m-0",
    sm: "tw-m-2 md:tw-m-4 lg:tw-m-6",
    md: "tw-m-4 md:tw-m-6 lg:tw-m-8",
    lg: "tw-m-6 md:tw-m-8 lg:tw-m-12",
  },

  // Gap
  gap: {
    none: "tw-gap-0",
    sm: "tw-gap-2 md:tw-gap-4 lg:tw-gap-6",
    md: "tw-gap-4 md:tw-gap-6 lg:tw-gap-8",
    lg: "tw-gap-6 md:tw-gap-8 lg:tw-gap-12",
  },
} as const;

/**
 * Responsive text classes
 */
export const textClasses = {
  // Headings
  h1: "tw-text-2xl md:tw-text-3xl lg:tw-text-4xl tw-font-bold",
  h2: "tw-text-xl md:tw-text-2xl lg:tw-text-3xl tw-font-semibold",
  h3: "tw-text-lg md:tw-text-xl lg:tw-text-2xl tw-font-semibold",
  h4: "tw-text-base md:tw-text-lg lg:tw-text-xl tw-font-medium",

  // Body text
  body: "tw-text-sm md:tw-text-base",
  small: "tw-text-xs md:tw-text-sm",
  large: "tw-text-base md:tw-text-lg",
} as const;

/**
 * Responsive visibility classes
 */
export const visibilityClasses = {
  // Show on specific breakpoints
  showOnMobile: "tw-block md:tw-hidden",
  showOnTablet: "tw-hidden md:tw-block lg:tw-hidden",
  showOnDesktop: "tw-hidden lg:tw-block",

  // Hide on specific breakpoints
  hideOnMobile: "tw-hidden md:tw-block",
  hideOnTablet: "tw-block lg:tw-block md:tw-hidden",
  hideOnDesktop: "tw-block lg:tw-hidden",
} as const;

/**
 * Get responsive grid class for a given number of columns
 */
export function getResponsiveGrid(columns: 1 | 2 | 3 | 4 | 5 | 6): string {
  return gridClasses.fixed[columns];
}

/**
 * Get responsive spacing class
 */
export function getResponsiveSpacing(
  type: "padding" | "margin" | "gap",
  size: "none" | "sm" | "md" | "lg"
): string {
  return spacingClasses[type][size];
}

/**
 * Get responsive text class
 */
export function getResponsiveText(
  type: "h1" | "h2" | "h3" | "h4" | "body" | "small" | "large"
): string {
  return textClasses[type];
}
