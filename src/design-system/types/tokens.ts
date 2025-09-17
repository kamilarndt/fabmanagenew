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
  colors: {
    foreground: Record<string, string>;
    background: Record<string, string>;
    border: Record<string, string>;
    sidebar: Record<string, string>;
    chart: Record<string, any>;
    icon: Record<string, any>;
  };
  spacing: Record<string, string>;
  radius: Record<string, string>;
  semantic: Record<string, string>;
}

// Export types
export type ColorTokenKey = keyof DesignTokens["colors"]["foreground"];
export type BackgroundTokenKey = keyof DesignTokens["colors"]["background"];
export type SidebarTokenKey = keyof DesignTokens["colors"]["sidebar"];
export type SpacingTokenKey = keyof DesignTokens["spacing"];
export type RadiusTokenKey = keyof DesignTokens["radius"];
