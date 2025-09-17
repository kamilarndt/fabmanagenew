// Design tokens based on Tokens.json with theme support
export const designTokens = {
  colors: {
    light: {
      foreground: {
        primary: "#fafafa",
        secondary: "#3f3f46",
        accent: "#18181b",
        destructive: "#ef4444",
        default: "#09090b",
        disabled: "#a1a1aa",
        success: "#04d9a6",
        muted: "#71717a",
        warning: "#a16207",
      },
      background: {
        primary: "#18181b",
        secondary: "#f4f4f5",
        muted: "#f4f4f5",
        accent: "#f4f4f5",
        destructive: "#dc2626",
        success: "#059669",
        disabled: "#a3a3a3",
        default: "#ffffff",
        card: "#ffffff",
        popover: "#ffffff",
        input: "#e4e4e7",
      },
      border: {
        primary: "#a1a1aa",
        destructive: "#ef4444",
        success: "#04d9a6",
        default: "#e4e4e7",
        warning: "#ca8a04",
      },
      icon: {
        primary: "#fafafa",
        secondary: "#3f3f46",
        destructive: "#ef4444",
        success: "#04d9a6",
        warning: "#a16207",
        disabled: "#a1a1aa",
        default: "#09090b",
        muted: "#71717a",
        accent: "#18181b",
      },
    },
    dark: {
      foreground: {
        primary: "#18181b",
        secondary: "#f4f4f5",
        accent: "#fafafa",
        destructive: "#ef4444",
        default: "#fafafa",
        disabled: "#52525b",
        success: "#04d9a6",
        muted: "#a1a1aa",
        warning: "#fbbf24",
      },
      background: {
        primary: "#fafafa",
        secondary: "#27272a",
        muted: "#2a2a2a",
        accent: "#27272a",
        destructive: "#dc2626",
        success: "#059669",
        disabled: "#52525b",
        default: "#1a1a1a",
        card: "#1e1e1e",
        popover: "#2d2d2d",
        input: "#3f3f46",
      },
      border: {
        primary: "#52525b",
        destructive: "#ef4444",
        success: "#04d9a6",
        default: "#3f3f46",
        warning: "#fbbf24",
      },
      icon: {
        primary: "#18181b",
        secondary: "#f4f4f5",
        destructive: "#ef4444",
        success: "#04d9a6",
        warning: "#fbbf24",
        disabled: "#52525b",
        default: "#fafafa",
        muted: "#a1a1aa",
        accent: "#fafafa",
      },
    },
  },
  spacing: {
    none: 0,
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    "3xl": 40,
    "4xl": 64,
  },
  padding: {
    none: 0,
    xxs: 8,
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
    xxl: 40,
    "3xl": 48,
    "4xl": 64,
  },
  radius: {
    none: 0,
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    full: 400,
  },
  typography: {
    fontSize: {
      h1: 64,
      h2: 48,
      h3: 40,
      h4: 32,
      h5: 24,
      h6: 20,
      body: 16,
      bodySmall: 14,
      bodyTiny: 12,
    },
    lineHeight: {
      h1: 80,
      h2: 56,
      h3: 48,
      h4: 40,
      h5: 32,
      h6: 24,
      body: 24,
      bodySmall: 20,
      bodyTiny: 16,
    },
    fontWeight: {
      regular: "Regular",
      bold: "Bold",
      heading: "Semi Bold",
      action: "Semi Bold",
    },
    fontFamily: {
      default: "Inter",
    },
  },

  // Helper methods
  getTheme: () => {
    if (typeof window === "undefined") return "light";
    return (
      (document.documentElement.getAttribute("data-theme") as
        | "light"
        | "dark") || "light"
    );
  },
  resolveToken: (value: any, theme: "light" | "dark" = "light") => {
    if (typeof value === "number" || typeof value === "string") {
      return value;
    }
    return value;
  },
  getColors: (theme: "light" | "dark" = "light") => {
    return designTokens.colors[theme];
  },
};

export default designTokens;
