import { designTokens } from "../tokens/design-tokens";

// Helper functions do konwersji tokenów na CSS custom properties
export const getCSSVariable = (tokenPath: string[]): string => {
  return `var(--${tokenPath.join("-")})`;
};

export const getTokenValue = (
  tokenPath: string[],
  fallback?: string
): string => {
  const path = tokenPath.join(".");
  const value = path
    .split(".")
    .reduce((obj, key) => obj?.[key], designTokens as any);
  return value?.value || value || fallback || "";
};

// Predefiniowane ścieżki do często używanych tokenów
export const tokenPaths = {
  // Colors
  colors: {
    primary: ["color", "foreground", "primary"],
    secondary: ["color", "foreground", "secondary"],
    muted: ["color", "foreground", "muted"],
    accent: ["color", "foreground", "accent"],
    destructive: ["color", "foreground", "destructive"],
    success: ["color", "foreground", "success"],
    warning: ["color", "foreground", "warning"],
  },

  // Backgrounds
  backgrounds: {
    default: ["color", "background", "default"],
    card: ["color", "background", "card"],
    primary: ["color", "background", "primary"],
    secondary: ["color", "background", "secondary"],
    muted: ["color", "background", "muted"],
  },

  // Sidebar
  sidebar: {
    default: ["color", "sidebar", "DEFAULT"],
    foreground: ["color", "sidebar", "foreground"],
    primary: ["color", "sidebar", "primary"],
    primaryForeground: ["color", "sidebar", "primary-foreground"],
    accent: ["color", "sidebar", "accent"],
    accentForeground: ["color", "sidebar", "accent-foreground"],
    border: ["color", "sidebar", "border"],
    ring: ["color", "sidebar", "ring"],
  },

  // Spacing
  spacing: {
    none: ["spacing", "none"],
    xs: ["spacing", "xs"],
    sm: ["spacing", "sm"],
    md: ["spacing", "md"],
    lg: ["spacing", "lg"],
    xl: ["spacing", "xl"],
    xxl: ["spacing", "xxl"],
  },

  // Radius
  radius: {
    none: ["radius", "none"],
    sm: ["radius", "sm"],
    md: ["radius", "md"],
    lg: ["radius", "lg"],
    xl: ["radius", "xl"],
    full: ["radius", "full"],
  },
} as const;

// Utility functions dla komponentów
export const getColor = (path: keyof typeof tokenPaths.colors): string => {
  return getCSSVariable([...tokenPaths.colors[path]]);
};

export const getBackground = (
  path: keyof typeof tokenPaths.backgrounds
): string => {
  return getCSSVariable([...tokenPaths.backgrounds[path]]);
};

export const getSidebarColor = (
  path: keyof typeof tokenPaths.sidebar
): string => {
  return getCSSVariable([...tokenPaths.sidebar[path]]);
};

export const getSpacing = (path: keyof typeof tokenPaths.spacing): string => {
  return getCSSVariable([...tokenPaths.spacing[path]]);
};

export const getRadius = (path: keyof typeof tokenPaths.radius): string => {
  return getCSSVariable([...tokenPaths.radius[path]]);
};

// Brand colors (z css-variables.css)
export const brandColors = {
  primary: "var(--color-brand-primary)",
  primaryHover: "var(--color-brand-primary-hover)",
} as const;
