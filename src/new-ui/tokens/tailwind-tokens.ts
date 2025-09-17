// Tailwind CSS configuration extension for Figma design tokens
// Add this to your tailwind.config.js extend section

export const tailwindTokens = {
  colors: {
    foreground: "#f2f2f2", // Dark mode foreground
    background: "#09090b", // Dark mode background
    card: "#141414", // Dark mode card
    popover: "#1f1f1f", // Dark mode popover
    primary: {
      DEFAULT: "#f2f2f2", // Dark mode primary
      foreground: "#18181b", // Dark mode primary foreground
    },
    secondary: {
      DEFAULT: "#1a1a1a", // Dark mode secondary
      foreground: "#262626", // Dark mode secondary foreground
    },
    destructive: {
      DEFAULT: "#991b1b", // Same for both modes
      foreground: "#7f1d1d", // Same for both modes
    },
    success: {
      DEFAULT: "#065f46", // Same for both modes
      foreground: "#059669", // Same for both modes
    },
    warning: {
      DEFAULT: "#ea580c", // Same for both modes
      foreground: "#ca8a04", // Same for both modes
    },
    muted: {
      DEFAULT: "#1a1a1a", // Dark mode muted
      foreground: "#666666", // Dark mode muted foreground
    },
    accent: {
      DEFAULT: "#27272a", // Dark mode accent
      foreground: "#fafafa", // Same for both modes
    },
    border: "#404040", // Dark mode border
    input: "#262626", // Dark mode input
    sidebar: {
      DEFAULT: "#141414",
      foreground: "#fafafa",
      primary: "#f2f2f2",
      "primary-foreground": "#18181b",
      accent: "#27272a",
      "accent-foreground": "#fafafa",
      border: "#3f3f46",
      ring: "#fafafa",
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
  borderRadius: {
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
