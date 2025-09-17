import designTokensRaw from "../assets/design-tokens.tokens.json";

// TypeScript interfaces dla tokenów
export interface ColorToken {
  value: string;
  type: "color";
  description?: string;
}

export interface SpacingToken {
  value: string;
  type: "spacing";
  description?: string;
}

export interface RadiusToken {
  value: string;
  type: "borderRadius";
  description?: string;
}

export interface TypographyToken {
  value: {
    fontFamily?: string;
    fontWeight?: string | number;
    fontSize?: string;
    lineHeight?: string;
    letterSpacing?: string;
  };
  type: "typography";
  description?: string;
}

export interface DesignTokens {
  colors: Record<string, ColorToken>;
  backgrounds: Record<string, ColorToken>;
  spacing: Record<string, SpacingToken>;
  radius: Record<string, RadiusToken>;
  typography: Record<string, TypographyToken>;
  sidebar: Record<string, ColorToken>;
  border: Record<string, ColorToken>;
  icon: Record<string, ColorToken>;
  chart: Record<string, ColorToken>;
}

// Centralne tokeny z design systemu
export const tokens: DesignTokens = {
  colors: designTokensRaw.tokens.foreground,
  backgrounds: designTokensRaw.tokens.background,
  spacing: designTokensRaw.tokens.spacing,
  radius: designTokensRaw.tokens.radius,
  typography: designTokensRaw.tokens.typography,
  sidebar: designTokensRaw.tokens.sidebar,
  border: designTokensRaw.tokens.border,
  icon: designTokensRaw.tokens.icon,
  chart: designTokensRaw.tokens.chart,
};

// Helper functions do konwersji tokenów na CSS custom properties
export const getCSSVariable = (tokenPath: string[]): string => {
  return `var(--${tokenPath.join("-")})`;
};

export const getTokenValue = (
  tokenPath: string[],
  fallback?: string
): string => {
  const path = tokenPath.join(".");
  const value = path.split(".").reduce((obj, key) => obj?.[key], tokens as any);
  return value?.value || fallback || "";
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
  return getCSSVariable(tokenPaths.colors[path]);
};

export const getBackground = (
  path: keyof typeof tokenPaths.backgrounds
): string => {
  return getCSSVariable(tokenPaths.backgrounds[path]);
};

export const getSidebarColor = (
  path: keyof typeof tokenPaths.sidebar
): string => {
  return getCSSVariable(tokenPaths.sidebar[path]);
};

export const getSpacing = (path: keyof typeof tokenPaths.spacing): string => {
  return getCSSVariable(tokenPaths.spacing[path]);
};

export const getRadius = (path: keyof typeof tokenPaths.radius): string => {
  return getCSSVariable(tokenPaths.radius[path]);
};

// Brand colors (z css-variables.css)
export const brandColors = {
  primary: "var(--color-brand-primary)",
  primaryHover: "var(--color-brand-primary-hover)",
} as const;
