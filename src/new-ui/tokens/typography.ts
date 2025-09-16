/**
 * FabManage Design Tokens - Typography
 *
 * Synchronized with Figma Variables
 * Collection: "Tokens"
 *
 * Auto-generated from Figma design tokens
 */

// Font Family
export const fontFamily = {
  sans: "var(--font-sans)",
  mono: "var(--font-mono)",
} as const;

// Font Sizes
export const fontSize = {
  xs: "var(--font-size-xs)",
  sm: "var(--font-size-sm)",
  base: "var(--font-size-base)",
  lg: "var(--font-size-lg)",
  xl: "var(--font-size-xl)",
  "2xl": "var(--font-size-2xl)",
  "3xl": "var(--font-size-3xl)",
  "4xl": "var(--font-size-4xl)",
  "5xl": "var(--font-size-5xl)",
  "6xl": "var(--font-size-6xl)",
} as const;

// Font Weights
export const fontWeight = {
  thin: "var(--font-weight-thin)",
  light: "var(--font-weight-light)",
  normal: "var(--font-weight-normal)",
  medium: "var(--font-weight-medium)",
  semibold: "var(--font-weight-semibold)",
  bold: "var(--font-weight-bold)",
  extrabold: "var(--font-weight-extrabold)",
  black: "var(--font-weight-black)",
} as const;

// Line Heights
export const lineHeight = {
  none: "var(--line-height-none)",
  tight: "var(--line-height-tight)",
  snug: "var(--line-height-snug)",
  normal: "var(--line-height-normal)",
  relaxed: "var(--line-height-relaxed)",
  loose: "var(--line-height-loose)",
} as const;

// Letter Spacing
export const letterSpacing = {
  tighter: "var(--letter-spacing-tighter)",
  tight: "var(--letter-spacing-tight)",
  normal: "var(--letter-spacing-normal)",
  wide: "var(--letter-spacing-wide)",
  wider: "var(--letter-spacing-wider)",
  widest: "var(--letter-spacing-widest)",
} as const;

// Type definitions
export type FontFamily = keyof typeof fontFamily;
export type FontSize = keyof typeof fontSize;
export type FontWeight = keyof typeof fontWeight;
export type LineHeight = keyof typeof lineHeight;
export type LetterSpacing = keyof typeof letterSpacing;
