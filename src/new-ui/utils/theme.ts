/**
 * Theme utilities for the new UI system
 */

export const theme = {
  // Color schemes
  colorSchemes: {
    light: "tw-light",
    dark: "tw-dark",
    system: "tw-auto",
  },

  // Theme variants
  variants: {
    default: "tw-bg-background tw-text-foreground",
    muted: "tw-bg-muted tw-text-muted-foreground",
    accent: "tw-bg-accent tw-text-accent-foreground",
    destructive: "tw-bg-destructive tw-text-destructive-foreground",
    primary: "tw-bg-primary tw-text-primary-foreground",
    secondary: "tw-bg-secondary tw-text-secondary-foreground",
  },

  // Border styles
  borders: {
    none: "tw-border-0",
    thin: "tw-border",
    thick: "tw-border-2",
    dashed: "tw-border-dashed",
    dotted: "tw-border-dotted",
  },

  // Shadow styles
  shadows: {
    none: "tw-shadow-none",
    sm: "tw-shadow-sm",
    md: "tw-shadow-md",
    lg: "tw-shadow-lg",
    xl: "tw-shadow-xl",
    "2xl": "tw-shadow-2xl",
  },

  // Radius styles
  radius: {
    none: "tw-rounded-none",
    sm: "tw-rounded-sm",
    md: "tw-rounded-md",
    lg: "tw-rounded-lg",
    xl: "tw-rounded-xl",
    "2xl": "tw-rounded-2xl",
    full: "tw-rounded-full",
  },
} as const;

export type ColorScheme = keyof typeof theme.colorSchemes;
export type ThemeVariant = keyof typeof theme.variants;
export type BorderStyle = keyof typeof theme.borders;
export type ShadowStyle = keyof typeof theme.shadows;
export type RadiusStyle = keyof typeof theme.radius;

/**
 * Apply theme classes to an element
 */
export function applyTheme(
  variant: ThemeVariant = "default",
  border: BorderStyle = "thin",
  shadow: ShadowStyle = "none",
  radius: RadiusStyle = "md"
): string {
  return [
    theme.variants[variant],
    theme.borders[border],
    theme.shadows[shadow],
    theme.radius[radius],
  ].join(" ");
}

/**
 * Get theme-aware color classes
 */
export function getThemeColors(
  background: ThemeVariant = "default",
  text: ThemeVariant = "default"
): string {
  return `${theme.variants[background]} ${theme.variants[text]}`;
}

/**
 * Common theme presets
 */
export const themePresets = {
  card: applyTheme("default", "thin", "sm", "lg"),
  button: applyTheme("primary", "thin", "none", "md"),
  input: applyTheme("default", "thin", "none", "md"),
  modal: applyTheme("default", "thin", "xl", "lg"),
  tooltip: applyTheme("default", "thin", "md", "md"),
  badge: applyTheme("secondary", "none", "none", "full"),
} as const;

/**
 * Dark mode utilities
 */
export const darkMode = {
  // Toggle dark mode
  toggle: () => {
    const html = document.documentElement;
    const isDark = html.classList.contains("dark");
    html.classList.toggle("dark", !isDark);
    localStorage.setItem("theme", !isDark ? "dark" : "light");
  },

  // Set dark mode
  set: (enabled: boolean) => {
    const html = document.documentElement;
    html.classList.toggle("dark", enabled);
    localStorage.setItem("theme", enabled ? "dark" : "light");
  },

  // Get current theme
  get: () => {
    return document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
  },

  // Initialize theme from localStorage
  init: () => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const shouldUseDark = saved === "dark" || (!saved && prefersDark);

    document.documentElement.classList.toggle("dark", shouldUseDark);
  },
} as const;
