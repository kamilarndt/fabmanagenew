#!/usr/bin/env tsx
/**
 * Process Figma Design Tokens
 * Transforms the exported Figma tokens JSON into TypeScript design tokens
 * and CSS variables for the new UI system.
 */

import fs from "fs";
import path from "path";

// Types for Figma token structure
interface FigmaToken {
  type: string;
  value: string | number;
  description?: string;
  extensions?: {
    "org.lukasoppermann.figmaDesignTokens": {
      collection: string;
      scopes: string[];
      variableId: string;
      exportKey: string;
    };
  };
}

interface FigmaTokens {
  tokens: Record<string, any>;
}

// Load the Figma tokens
const figmaTokensPath = path.join(
  process.cwd(),
  "assets/design-tokens.tokens.json"
);
const figmaTokens: FigmaTokens = JSON.parse(
  fs.readFileSync(figmaTokensPath, "utf-8")
);

/**
 * Resolve token references like "{primitives.primary.900}"
 */
function resolveTokenValue(
  value: string | number,
  tokens: Record<string, any>
): string | number {
  if (
    typeof value !== "string" ||
    !value.startsWith("{") ||
    !value.endsWith("}")
  ) {
    return value;
  }

  const tokenPath = value.slice(1, -1); // Remove { }
  const pathParts = tokenPath.split(".");

  let current = tokens;
  for (const part of pathParts) {
    current = current?.[part];
    if (current === undefined) {
      console.warn(`Warning: Could not resolve token reference: ${value}`);
      return value;
    }
  }

  // If the resolved value is an object with a value property
  if (typeof current === "object" && current.value !== undefined) {
    return resolveTokenValue(current.value, tokens);
  }

  return current;
}

/**
 * Extract and transform color tokens
 */
function extractColors(tokens: Record<string, any>) {
  const colors: Record<string, any> = {};

  // Foreground colors
  if (tokens.foreground) {
    colors.foreground = {};
    Object.entries(tokens.foreground).forEach(([key, token]: [string, any]) => {
      if (token.default) {
        colors.foreground[key] = resolveTokenValue(token.default.value, tokens);
      } else if (token.value) {
        colors.foreground[key] = resolveTokenValue(token.value, tokens);
      }
    });
  }

  // Background colors
  if (tokens.background) {
    colors.background = {};
    Object.entries(tokens.background).forEach(([key, token]: [string, any]) => {
      if (token.default) {
        colors.background[key] = resolveTokenValue(token.default.value, tokens);
      } else if (token.value) {
        colors.background[key] = resolveTokenValue(token.value, tokens);
      }
    });
  }

  // Border colors
  if (tokens.border) {
    colors.border = {};
    Object.entries(tokens.border).forEach(([key, token]: [string, any]) => {
      if (token.default) {
        colors.border[key] = resolveTokenValue(token.default.value, tokens);
      } else if (token.value) {
        colors.border[key] = resolveTokenValue(token.value, tokens);
      }
    });
  }

  // Chart colors
  if (tokens.charts) {
    colors.chart = {};
    Object.entries(tokens.charts).forEach(
      ([chartKey, chartTokens]: [string, any]) => {
        colors.chart[chartKey] = {};
        Object.entries(chartTokens).forEach(
          ([opacityKey, token]: [string, any]) => {
            colors.chart[chartKey][opacityKey] = resolveTokenValue(
              token.value,
              tokens
            );
          }
        );
      }
    );
  }

  // Icon colors
  if (tokens.icon) {
    colors.icon = {};
    Object.entries(tokens.icon).forEach(([key, token]: [string, any]) => {
      if (token.default) {
        colors.icon[key] = resolveTokenValue(token.default.value, tokens);
      } else if (token.value) {
        colors.icon[key] = resolveTokenValue(token.value, tokens);
      }
    });
  }

  return colors;
}

/**
 * Extract spacing tokens
 */
function extractSpacing(tokens: Record<string, any>) {
  const spacing: Record<string, string> = {};

  if (tokens.spacing) {
    Object.entries(tokens.spacing).forEach(([key, token]: [string, any]) => {
      const value = resolveTokenValue(token.value, tokens);
      const spacingKey = key.replace("spacing-", "");
      spacing[spacingKey] =
        typeof value === "number" ? `${value}px` : (value as string);
    });
  }

  return spacing;
}

/**
 * Extract padding tokens
 */
function extractPadding(tokens: Record<string, any>) {
  const padding: Record<string, string> = {};

  if (tokens.padding) {
    Object.entries(tokens.padding).forEach(([key, token]: [string, any]) => {
      const value = resolveTokenValue(token.value, tokens);
      const paddingKey = key.replace("padding-", "");
      padding[paddingKey] =
        typeof value === "number" ? `${value}px` : (value as string);
    });
  }

  return padding;
}

/**
 * Extract radius tokens
 */
function extractRadius(tokens: Record<string, any>) {
  const radius: Record<string, string> = {};

  if (tokens.radius) {
    Object.entries(tokens.radius).forEach(([key, token]: [string, any]) => {
      const value = resolveTokenValue(token.value, tokens);
      const radiusKey = key.replace("radius-", "");
      radius[radiusKey] =
        typeof value === "number" ? `${value}px` : (value as string);
    });
  }

  return radius;
}

/**
 * Generate TypeScript design tokens file
 */
function generateDesignTokens() {
  const tokens = figmaTokens.tokens;

  const colors = extractColors(tokens);
  const spacing = extractSpacing(tokens);
  const padding = extractPadding(tokens);
  const radius = extractRadius(tokens);

  const designTokens = {
    colors,
    spacing,
    padding,
    radius,
    // Add semantic mappings for shadcn/ui compatibility
    semantic: {
      primary:
        colors.foreground?.primary || colors.background?.primary?.default,
      secondary:
        colors.foreground?.secondary || colors.background?.secondary?.default,
      destructive:
        colors.foreground?.destructive ||
        colors.background?.destructive?.default,
      success:
        colors.foreground?.success || colors.background?.success?.default,
      warning:
        colors.foreground?.warning || colors.background?.warning?.default,
      muted: colors.foreground?.muted || colors.background?.muted,
      accent: colors.foreground?.accent || colors.background?.accent,
      card: colors.background?.card,
      popover: colors.background?.popover,
      input: colors.background?.input,
      border: colors.border?.default || colors.border?.primary?.default,
    },
  };

  const output = `// Generated from Figma design tokens
// Do not edit this file directly - regenerate using npm run tokens:process

export const designTokens = ${JSON.stringify(designTokens, null, 2)} as const;

// Type exports
export type ColorToken = keyof typeof designTokens.colors;
export type SpacingToken = keyof typeof designTokens.spacing;
export type RadiusToken = keyof typeof designTokens.radius;

// Semantic color mappings for shadcn/ui
export const semanticColors = designTokens.semantic;
`;

  return output;
}

/**
 * Generate CSS variables
 */
function generateCSSVariables() {
  const tokens = figmaTokens.tokens;

  const colors = extractColors(tokens);
  const spacing = extractSpacing(tokens);
  const radius = extractRadius(tokens);

  let css = `/* Generated from Figma design tokens */\n/* Do not edit this file directly - regenerate using npm run tokens:process */\n\n:root {\n`;

  // Add color variables
  const addColorVariables = (colorObj: any, prefix: string) => {
    Object.entries(colorObj).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        addColorVariables(value, `${prefix}-${key}`);
      } else {
        css += `  --color${prefix}-${key}: ${value};\n`;
      }
    });
  };

  Object.entries(colors).forEach(([category, colorObj]) => {
    if (typeof colorObj === "object" && colorObj !== null) {
      addColorVariables(colorObj, `-${category}`);
    }
  });

  // Add spacing variables
  Object.entries(spacing).forEach(([key, value]) => {
    css += `  --spacing-${key}: ${value};\n`;
  });

  // Add radius variables
  Object.entries(radius).forEach(([key, value]) => {
    css += `  --radius-${key}: ${value};\n`;
  });

  css += `}\n\n/* Dark theme overrides would go here if needed */\n`;

  return css;
}

/**
 * Generate Tailwind config extension
 */
function generateTailwindConfig() {
  const tokens = figmaTokens.tokens;

  const colors = extractColors(tokens);
  const spacing = extractSpacing(tokens);
  const radius = extractRadius(tokens);

  const tailwindColors: Record<string, any> = {};

  // Map semantic colors for Tailwind
  if (colors.foreground) {
    tailwindColors.foreground =
      colors.foreground.default || colors.foreground.primary?.default;
  }
  if (colors.background) {
    tailwindColors.background = colors.background.default;
    tailwindColors.card = colors.background.card;
    tailwindColors.popover = colors.background.popover;
    tailwindColors.primary = {
      DEFAULT: colors.background.primary?.default,
      foreground: colors.foreground?.primary?.default,
    };
    tailwindColors.secondary = {
      DEFAULT: colors.background.secondary?.default,
      foreground: colors.foreground?.secondary?.default,
    };
    tailwindColors.destructive = {
      DEFAULT: colors.background.destructive?.default,
      foreground: colors.foreground?.destructive?.default,
    };
    tailwindColors.success = {
      DEFAULT: colors.background.success?.default,
      foreground: colors.foreground?.success?.default,
    };
    tailwindColors.warning = {
      DEFAULT: colors.background.warning?.default,
      foreground: colors.foreground?.warning?.default,
    };
    tailwindColors.muted = {
      DEFAULT: colors.background.muted,
      foreground: colors.foreground?.muted,
    };
    tailwindColors.accent = {
      DEFAULT: colors.background.accent,
      foreground: colors.foreground?.accent,
    };
  }
  if (colors.border) {
    tailwindColors.border =
      colors.border.default || colors.border.primary?.default;
    tailwindColors.input = colors.background?.input;
  }

  const config = `// Tailwind CSS configuration extension for Figma design tokens
// Add this to your tailwind.config.js extend section

export const tailwindTokens = {
  colors: ${JSON.stringify(tailwindColors, null, 4)},
  spacing: ${JSON.stringify(spacing, null, 4)},
  borderRadius: ${JSON.stringify(radius, null, 4)},
};
`;

  return config;
}

/**
 * Main processing function
 */
function processTokens() {
  console.log("🎨 Processing Figma design tokens...");

  try {
    // Create output directory
    const outputDir = path.join(process.cwd(), "src/new-ui/tokens");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate TypeScript design tokens
    const designTokensTs = generateDesignTokens();
    fs.writeFileSync(path.join(outputDir, "design-tokens.ts"), designTokensTs);
    console.log("✅ Generated src/new-ui/tokens/design-tokens.ts");

    // Generate CSS variables
    const cssVariables = generateCSSVariables();
    fs.writeFileSync(
      path.join(process.cwd(), "src/styles/design-tokens.css"),
      cssVariables
    );
    console.log("✅ Generated src/styles/design-tokens.css");

    // Generate Tailwind config
    const tailwindConfig = generateTailwindConfig();
    fs.writeFileSync(
      path.join(outputDir, "tailwind-tokens.ts"),
      tailwindConfig
    );
    console.log("✅ Generated src/new-ui/tokens/tailwind-tokens.ts");

    // Create index file
    const indexContent = `// Design tokens exports
export { designTokens, semanticColors } from './design-tokens';
export { tailwindTokens } from './tailwind-tokens';
export type { ColorToken, SpacingToken, RadiusToken } from './design-tokens';
`;
    fs.writeFileSync(path.join(outputDir, "index.ts"), indexContent);
    console.log("✅ Generated src/new-ui/tokens/index.ts");

    console.log("\n🎉 Design tokens processed successfully!");
    console.log("\nNext steps:");
    console.log("1. Import CSS variables in your main CSS file");
    console.log("2. Update tailwind.config.js with the generated tokens");
    console.log("3. Use the design tokens in your components");
  } catch (error) {
    console.error("❌ Error processing tokens:", error);
    process.exit(1);
  }
}

// Run the processing
if (require.main === module) {
  processTokens();
}

export { processTokens };
