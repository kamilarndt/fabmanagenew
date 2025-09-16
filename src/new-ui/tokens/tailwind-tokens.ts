// Tailwind CSS configuration extension for redesigned OKLCH design tokens
// Modern color system with better perceptual uniformity

export const tailwindTokens = {
  colors: {
    foreground: "oklch(0.141 0.005 285.823)",
    background: "oklch(1 0 0)",
    card: "oklch(1 0 0)",
    "card-foreground": "oklch(0.141 0.005 285.823)",
    popover: "oklch(1 0 0)",
    "popover-foreground": "oklch(0.141 0.005 285.823)",
    primary: {
      DEFAULT: "oklch(0.723 0.219 149.579)",
      foreground: "oklch(0.982 0.018 155.826)",
    },
    secondary: {
      DEFAULT: "oklch(0.967 0.001 286.375)",
      foreground: "oklch(0.21 0.006 285.885)",
    },
    destructive: {
      DEFAULT: "oklch(0.577 0.245 27.325)",
      foreground: "oklch(0.982 0.018 155.826)",
    },
    success: {
      DEFAULT: "oklch(0.696 0.17 162.48)",
      foreground: "oklch(0.982 0.018 155.826)",
    },
    warning: {
      DEFAULT: "oklch(0.646 0.222 41.116)",
      foreground: "oklch(0.982 0.018 155.826)",
    },
    muted: {
      DEFAULT: "oklch(0.967 0.001 286.375)",
      foreground: "oklch(0.552 0.016 285.938)",
    },
    accent: {
      DEFAULT: "oklch(0.967 0.001 286.375)",
      foreground: "oklch(0.21 0.006 285.885)",
    },
    border: "oklch(0.92 0.004 286.32)",
    input: "oklch(0.92 0.004 286.32)",
    ring: "oklch(0.723 0.219 149.579)",
    chart: {
      "1": "oklch(0.646 0.222 41.116)",
      "2": "oklch(0.6 0.118 184.704)",
      "3": "oklch(0.398 0.07 227.392)",
      "4": "oklch(0.828 0.189 84.429)",
      "5": "oklch(0.769 0.188 70.08)",
    },
    sidebar: {
      DEFAULT: "oklch(0.985 0 0)",
      foreground: "oklch(0.141 0.005 285.823)",
      primary: "oklch(0.723 0.219 149.579)",
      "primary-foreground": "oklch(0.982 0.018 155.826)",
      accent: "oklch(0.967 0.001 286.375)",
      "accent-foreground": "oklch(0.21 0.006 285.885)",
      border: "oklch(0.92 0.004 286.32)",
      ring: "oklch(0.723 0.219 149.579)",
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
    "4xl": "48px",
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
    default: "0.65rem",
  },
};
