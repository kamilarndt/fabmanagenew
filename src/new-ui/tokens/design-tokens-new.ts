// Design tokens from Figma Tokens.json
// Supports both Light and Dark modes

export type ThemeMode = "light" | "dark";

export interface DesignTokens {
  colors: {
    foreground: {
      primary: string;
      secondary: string;
      accent: string;
      destructive: string;
      default: string;
      disabled: string;
      success: string;
      muted: string;
      warning: string;
    };
    background: {
      primary: string;
      secondary: string;
      muted: string;
      accent: string;
      destructive: string;
      success: string;
      disabled: string;
      default: string;
      card: string;
      popover: string;
      input: string;
      warning: string;
    };
    border: {
      primary: string;
      destructive: string;
      success: string;
      default: string;
      warning: string;
    };
    icon: {
      primary: string;
      secondary: string;
      destructive: string;
      success: string;
      warning: string;
      disabled: string;
      default: string;
      muted: string;
      accent: string;
    };
    sidebar: {
      DEFAULT: string;
      foreground: string;
      primary: string;
      "primary-foreground": string;
      accent: string;
      "accent-foreground": string;
      border: string;
      ring: string;
    };
    charts: {
      chart1: string;
      chart2: string;
      chart3: string;
      chart4: string;
      chart5: string;
    };
  };
  spacing: {
    none: string;
    xxs: string;
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
    "3xl": string;
    "4xl": string;
  };
  radius: {
    none: string;
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
    full: string;
  };
}

// Light mode tokens
const lightTokens: DesignTokens = {
  colors: {
    foreground: {
      primary: "#fafafa", // Primary/50
      secondary: "#262626", // Zinc/700
      accent: "#262626", // Zinc/900
      destructive: "#dc2626", // Red/500
      default: "#262626", // Zinc/950
      disabled: "#a1a1aa", // Zinc/400
      success: "#059669", // Emerald/700
      muted: "#71717a", // Zinc/500
      warning: "#a16207", // Yellow/700
    },
    background: {
      primary: "#262626", // Primary/900
      secondary: "#f4f4f5", // Zinc/100
      muted: "#f4f4f5", // Zinc/100
      accent: "#f4f4f5", // Zinc/100
      destructive: "#dc2626", // Red/600
      success: "#059669", // Emerald/600
      disabled: "#a3a3a3", // Neutral/400
      default: "#ffffff", // White
      card: "#ffffff", // White
      popover: "#ffffff", // White
      input: "#e4e4e7", // Zinc/200
      warning: "#ea580c", // Yellow/500
    },
    border: {
      primary: "#a1a1aa", // Zinc/400
      destructive: "#dc2626", // Red/500
      success: "#059669", // Emerald/700
      default: "#e4e4e7", // Zinc/200
      warning: "#a16207", // Yellow/700
    },
    icon: {
      primary: "#fafafa", // Primary/50
      secondary: "#262626", // Zinc/700
      destructive: "#dc2626", // Red/500
      success: "#059669", // Emerald/700
      warning: "#a16207", // Yellow/700
      disabled: "#a1a1aa", // Zinc/400
      default: "#262626", // Zinc/950
      muted: "#71717a", // Zinc/500
      accent: "#fafafa", // Zinc/50
    },
    sidebar: {
      DEFAULT: "#262626", // Primary/900
      foreground: "#fafafa", // Primary/50
      primary: "#fafafa", // Primary/50
      "primary-foreground": "#262626", // Primary/900
      accent: "#f4f4f5", // Zinc/100
      "accent-foreground": "#262626", // Zinc/900
      border: "#a1a1aa", // Zinc/400
      ring: "#fafafa", // Primary/50
    },
    charts: {
      chart1: "#2a9d8f", // Teal-600
      chart2: "#e76f51", // Orange-500
      chart3: "#264653", // Slate-700
      chart4: "#e9c46a", // Yellow-500
      chart5: "#f4a261", // Orange-400
    },
  },
  spacing: {
    none: "0px",
    xxs: "2px",
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    xxl: "32px",
    "3xl": "40px",
    "4xl": "64px",
  },
  radius: {
    none: "0px",
    xs: "2px",
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    xxl: "24px",
    full: "400px",
  },
};

// Dark mode tokens
const darkTokens: DesignTokens = {
  colors: {
    foreground: {
      primary: "#262626", // Primary/900
      secondary: "#f4f4f5", // Zinc/100
      accent: "#fafafa", // Zinc/50
      destructive: "#7f1d1d", // Red/900
      default: "#fafafa", // Zinc/50
      disabled: "#525252", // Zinc/600
      success: "#059669", // Emerald/600
      muted: "#a1a1aa", // Zinc/400
      warning: "#ca8a04", // Yellow/600
    },
    background: {
      primary: "#fafafa", // Primary/50
      secondary: "#262626", // Zinc/800
      muted: "#262626", // Zinc/800
      accent: "#262626", // Zinc/800
      destructive: "#991b1b", // Red/800
      success: "#065f46", // Emerald/800
      disabled: "#a3a3a3", // Neutral/400
      default: "#262626", // Zinc/950
      card: "#262626", // Zinc/950
      popover: "#262626", // Zinc/950
      input: "#262626", // Zinc/700
      warning: "#ea580c", // Yellow/500
    },
    border: {
      primary: "#a1a1aa", // Zinc/300
      destructive: "#7f1d1d", // Red/900
      success: "#059669", // Emerald/600
      default: "#262626", // Zinc/700
      warning: "#ca8a04", // Yellow/600
    },
    icon: {
      primary: "#262626", // Primary/900
      secondary: "#f4f4f5", // Zinc/100
      destructive: "#7f1d1d", // Red/900
      success: "#059669", // Emerald/600
      warning: "#ca8a04", // Yellow/600
      disabled: "#525252", // Zinc/600
      default: "#fafafa", // Zinc/50
      muted: "#a1a1aa", // Zinc/400
      accent: "#fafafa", // Zinc/50
    },
    sidebar: {
      DEFAULT: "#fafafa", // Primary/50
      foreground: "#262626", // Primary/900
      primary: "#262626", // Primary/900
      "primary-foreground": "#fafafa", // Primary/50
      accent: "#262626", // Zinc/950
      "accent-foreground": "#fafafa", // Zinc/50
      border: "#a1a1aa", // Zinc/300
      ring: "#262626", // Primary/900
    },
    charts: {
      chart1: "#2563eb", // Blue-600
      chart2: "#e11d48", // Rose-600
      chart3: "#ea580c", // Orange-600
      chart4: "#a855f7", // Purple-500
      chart5: "#2dd4bf", // Teal-400
    },
  },
  spacing: {
    none: "0px",
    xxs: "2px",
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    xxl: "32px",
    "3xl": "40px",
    "4xl": "40px",
  },
  radius: {
    none: "0px",
    xs: "2px",
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    xxl: "24px",
    full: "400px",
  },
};

// Theme provider hook
export function useDesignTokens(mode: ThemeMode): DesignTokens {
  return mode === "dark" ? darkTokens : lightTokens;
}

// CSS custom properties generator
export function generateCSSVariables(
  tokens: DesignTokens
): Record<string, string> {
  const cssVars: Record<string, string> = {};

  // Foreground colors
  Object.entries(tokens.colors.foreground).forEach(([key, value]) => {
    cssVars[`--color-foreground-${key}`] = value;
  });

  // Background colors
  Object.entries(tokens.colors.background).forEach(([key, value]) => {
    cssVars[`--color-background-${key}`] = value;
  });

  // Border colors
  Object.entries(tokens.colors.border).forEach(([key, value]) => {
    cssVars[`--color-border-${key}`] = value;
  });

  // Icon colors
  Object.entries(tokens.colors.icon).forEach(([key, value]) => {
    cssVars[`--color-icon-${key}`] = value;
  });

  // Sidebar colors
  Object.entries(tokens.colors.sidebar).forEach(([key, value]) => {
    cssVars[`--color-sidebar-${key}`] = value;
  });

  // Chart colors
  Object.entries(tokens.colors.charts).forEach(([key, value]) => {
    cssVars[`--color-chart-${key}`] = value;
  });

  // Spacing
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    cssVars[`--spacing-${key}`] = value;
  });

  // Radius
  Object.entries(tokens.radius).forEach(([key, value]) => {
    cssVars[`--radius-${key}`] = value;
  });

  return cssVars;
}

// Default export for backward compatibility
export const designTokens = lightTokens;
