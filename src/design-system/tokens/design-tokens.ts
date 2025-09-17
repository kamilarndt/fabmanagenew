// Design tokens z Figmy - centralne źródło prawdy
import designTokensRaw from "../../../assets/design-tokens.tokens.json";

export const designTokens = {
  colors: {
    foreground: {
      primary: designTokensRaw.tokens.foreground.primary.default.value,
      secondary: designTokensRaw.tokens.foreground.secondary.default.value,
      accent: designTokensRaw.tokens.foreground.accent.value,
      destructive: designTokensRaw.tokens.foreground.destructive.default.value,
      default: designTokensRaw.tokens.foreground.default.value,
      disabled: designTokensRaw.tokens.foreground.disabled.default.value,
      success: designTokensRaw.tokens.foreground.success.default.value,
      muted: designTokensRaw.tokens.foreground.muted.value,
      warning: designTokensRaw.tokens.foreground.warning.default.value,
    },
    background: {
      primary: designTokensRaw.tokens.background.primary.default.value,
      secondary: designTokensRaw.tokens.background.secondary.default.value,
      muted: designTokensRaw.tokens.background.muted.default.value,
      accent: designTokensRaw.tokens.background.accent.default.value,
      destructive: designTokensRaw.tokens.background.destructive.default.value,
      success: designTokensRaw.tokens.background.success.default.value,
      disabled: designTokensRaw.tokens.background.disabled.default.value,
      default: designTokensRaw.tokens.background.default.default.value,
      card: designTokensRaw.tokens.background.card.default.value,
      popover: designTokensRaw.tokens.background.popover.default.value,
      input: designTokensRaw.tokens.background.input.value,
      warning: designTokensRaw.tokens.background.warning.default.value,
    },
    border: {
      primary: designTokensRaw.tokens.border.primary.default.value,
      destructive: designTokensRaw.tokens.border.destructive.default.value,
      success: designTokensRaw.tokens.border.success.default.value,
      default: designTokensRaw.tokens.border.default.value,
      warning: designTokensRaw.tokens.border.warning.default.value,
    },
    sidebar: {
      DEFAULT: designTokensRaw.tokens.sidebar.DEFAULT.default.value,
      foreground: designTokensRaw.tokens.sidebar.foreground.default.value,
      primary: designTokensRaw.tokens.sidebar.primary.default.value,
      "primary-foreground":
        designTokensRaw.tokens.sidebar["primary-foreground"].default.value,
      accent: designTokensRaw.tokens.sidebar.accent.default.value,
      "accent-foreground":
        designTokensRaw.tokens.sidebar["accent-foreground"].default.value,
      border: designTokensRaw.tokens.sidebar.border.default.value,
      ring: designTokensRaw.tokens.sidebar.ring.default.value,
    },
    chart: designTokensRaw.tokens.charts,
    icon: designTokensRaw.tokens.icon,
  },
  spacing: designTokensRaw.tokens.spacing,
  radius: designTokensRaw.tokens.radius,
} as const;
