import { useMemo } from 'react';
import { designTokens } from '../tokens/design-tokens';
import { getCSSVariable, getTokenValue, getColor, getBackground, getSpacing, getRadius } from '../utils/token-helpers';

/**
 * React hook for accessing design tokens
 * Provides convenient access to colors, spacing, radius, and other design tokens
 */
export function useDesignTokens() {
  return useMemo(() => ({
    // Raw tokens
    tokens: designTokens,
    
    // Helper functions
    getCSSVariable,
    getTokenValue,
    getColor,
    getBackground,
    getSpacing,
    getRadius,
    
    // Brand colors
    brandColors: {
      primary: getColor('brand.primary'),
      secondary: getColor('brand.secondary'),
      accent: getColor('brand.accent'),
    },
    
    // Common color combinations
    colors: {
      // Foreground colors
      text: {
        primary: getColor('foreground.default'),
        secondary: getColor('foreground.muted'),
        disabled: getColor('foreground.disabled'),
        success: getColor('foreground.success'),
        warning: getColor('foreground.warning'),
        error: getColor('foreground.destructive'),
      },
      
      // Background colors
      background: {
        default: getBackground('default'),
        card: getBackground('card'),
        input: getBackground('input'),
        popover: getBackground('popover'),
        success: getBackground('success'),
        warning: getBackground('warning'),
        error: getBackground('destructive'),
      },
      
      // Border colors
      border: {
        default: getColor('border.default'),
        primary: getColor('border.primary'),
        muted: getColor('border.muted'),
      },
      
      // Sidebar colors
      sidebar: {
        background: getColor('sidebar.DEFAULT'),
        foreground: getColor('sidebar.foreground'),
        accent: getColor('sidebar.accent'),
        accentForeground: getColor('sidebar.accent-foreground'),
        border: getColor('sidebar.border'),
        ring: getColor('sidebar.ring'),
      },
    },
    
    // Spacing scale
    spacing: {
      xs: getSpacing('xs'),
      sm: getSpacing('sm'),
      md: getSpacing('md'),
      lg: getSpacing('lg'),
      xl: getSpacing('xl'),
      '2xl': getSpacing('2xl'),
      '3xl': getSpacing('3xl'),
    },
    
    // Border radius scale
    radius: {
      none: getRadius('none'),
      sm: getRadius('sm'),
      md: getRadius('md'),
      lg: getRadius('lg'),
      xl: getRadius('xl'),
      full: getRadius('full'),
    },
    
    // Typography scale
    typography: {
      fontFamily: {
        sans: designTokens.typography.fontFamily.sans.value,
        mono: designTokens.typography.fontFamily.mono.value,
      },
      fontSize: {
        xs: designTokens.typography.fontSize.xs.value,
        sm: designTokens.typography.fontSize.sm.value,
        base: designTokens.typography.fontSize.base.value,
        lg: designTokens.typography.fontSize.lg.value,
        xl: designTokens.typography.fontSize.xl.value,
        '2xl': designTokens.typography.fontSize['2xl'].value,
        '3xl': designTokens.typography.fontSize['3xl'].value,
      },
      fontWeight: {
        normal: designTokens.typography.fontWeight.normal.value,
        medium: designTokens.typography.fontWeight.medium.value,
        semibold: designTokens.typography.fontWeight.semibold.value,
        bold: designTokens.typography.fontWeight.bold.value,
      },
      lineHeight: {
        tight: designTokens.typography.lineHeight.tight.value,
        normal: designTokens.typography.lineHeight.normal.value,
        relaxed: designTokens.typography.lineHeight.relaxed.value,
      },
    },
  }), []);
}

export default useDesignTokens;
