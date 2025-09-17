#!/usr/bin/env node
/**
 * Process Figma Design Tokens
 * Transforms the exported Figma tokens JSON into TypeScript design tokens
 * and CSS variables for the new UI system.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Resolve token references like "{primitives.primary.900}"
 */
function resolveTokenValue(value, allTokens) {
  if (
    typeof value !== "string" ||
    !value.startsWith("{") ||
    !value.endsWith("}")
  ) {
    return value;
  }

  const tokenPath = value.slice(1, -1); // Remove { }
  const pathParts = tokenPath.split(".");

  // Look in both tokens and primitives sections
  let current = allTokens;
  for (const part of pathParts) {
    current = current?.[part];
    if (current === undefined) {
      console.warn(`Warning: Could not resolve token reference: ${value}`);
      return value;
    }
  }

  // If the resolved value is an object with a value property
  if (
    typeof current === "object" &&
    current !== null &&
    current.value !== undefined
  ) {
    return resolveTokenValue(current.value, allTokens);
  }

  return current;
}

/**
 * Extract and transform color tokens
 */
function extractColors(tokens, allTokens) {
  const colors = {};

  // Foreground colors
  if (tokens.foreground) {
    colors.foreground = {};
    Object.entries(tokens.foreground).forEach(([key, token]) => {
      if (token.default) {
        colors.foreground[key] = resolveTokenValue(
          token.default.value,
          allTokens
        );
      } else if (token.value) {
        colors.foreground[key] = resolveTokenValue(token.value, allTokens);
      }
    });
  }

  // Background colors
  if (tokens.background) {
    colors.background = {};
    Object.entries(tokens.background).forEach(([key, token]) => {
      if (token.default) {
        colors.background[key] = resolveTokenValue(
          token.default.value,
          allTokens
        );
      } else if (token.value) {
        colors.background[key] = resolveTokenValue(token.value, allTokens);
      }
    });
  }

  // Border colors
  if (tokens.border) {
    colors.border = {};
    Object.entries(tokens.border).forEach(([key, token]) => {
      if (token.default) {
        colors.border[key] = resolveTokenValue(token.default.value, allTokens);
      } else if (token.value) {
        colors.border[key] = resolveTokenValue(token.value, allTokens);
      }
    });
  }

  // Chart colors
  if (tokens.charts) {
    colors.chart = {};
    Object.entries(tokens.charts).forEach(([chartKey, chartTokens]) => {
      colors.chart[chartKey] = {};
      Object.entries(chartTokens).forEach(([opacityKey, token]) => {
        colors.chart[chartKey][opacityKey] = resolveTokenValue(
          token.value,
          allTokens
        );
      });
    });
  }

  // Icon colors
  if (tokens.icon) {
    colors.icon = {};
    Object.entries(tokens.icon).forEach(([key, token]) => {
      if (token.default) {
        colors.icon[key] = resolveTokenValue(token.default.value, allTokens);
      } else if (token.value) {
        colors.icon[key] = resolveTokenValue(token.value, allTokens);
      }
    });
  }

  // Sidebar colors
  if (tokens.sidebar) {
    colors.sidebar = {};
    Object.entries(tokens.sidebar).forEach(([key, token]) => {
      if (token.default) {
        colors.sidebar[key] = resolveTokenValue(token.default.value, allTokens);
      } else if (token.value) {
        colors.sidebar[key] = resolveTokenValue(token.value, allTokens);
      }
    });
  }

  return colors;
}

/**
 * Extract spacing tokens
 */
function extractSpacing(tokens, allTokens) {
  const spacing = {};

  if (tokens.spacing) {
    Object.entries(tokens.spacing).forEach(([key, token]) => {
      const value = resolveTokenValue(token.value, allTokens);
      const spacingKey = key.replace("spacing-", "");
      spacing[spacingKey] = typeof value === "number" ? `${value}px` : value;
    });
  }

  return spacing;
}

/**
 * Extract padding tokens
 */
function extractPadding(tokens, allTokens) {
  const padding = {};

  if (tokens.padding) {
    Object.entries(tokens.padding).forEach(([key, token]) => {
      const value = resolveTokenValue(token.value, allTokens);
      const paddingKey = key.replace("padding-", "");
      padding[paddingKey] = typeof value === "number" ? `${value}px` : value;
    });
  }

  return padding;
}

/**
 * Extract radius tokens
 */
function extractRadius(tokens, allTokens) {
  const radius = {};

  if (tokens.radius) {
    Object.entries(tokens.radius).forEach(([key, token]) => {
      const value = resolveTokenValue(token.value, allTokens);
      const radiusKey = key.replace("radius-", "");
      radius[radiusKey] = typeof value === "number" ? `${value}px` : value;
    });
  }

  return radius;
}

/**
 * Generate TypeScript design tokens file
 */
function generateDesignTokens(figmaTokens) {
  const tokens = figmaTokens.tokens;

  const colors = extractColors(tokens, figmaTokens);
  const spacing = extractSpacing(tokens, figmaTokens);
  const padding = extractPadding(tokens, figmaTokens);
  const radius = extractRadius(tokens, figmaTokens);

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
function generateCSSVariables(figmaTokens) {
  const tokens = figmaTokens.tokens;

  const colors = extractColors(tokens, figmaTokens);
  const spacing = extractSpacing(tokens, figmaTokens);
  const radius = extractRadius(tokens, figmaTokens);

  let css = `/* Generated from Figma design tokens */\n/* Do not edit this file directly - regenerate using npm run tokens:process */\n\n:root {\n`;

  // Add color variables
  const addColorVariables = (colorObj, prefix) => {
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
function generateTailwindConfig(figmaTokens) {
  const tokens = figmaTokens.tokens;

  const colors = extractColors(tokens, figmaTokens);
  const spacing = extractSpacing(tokens, figmaTokens);
  const radius = extractRadius(tokens, figmaTokens);

  const tailwindColors = {};

  // Helper to prefer direct string value or nested .default
  const pick = (v) => (typeof v === "string" ? v : v?.default);

  // Map semantic colors for Tailwind
  if (colors.foreground) {
    tailwindColors.foreground =
      pick(colors.foreground.default) || pick(colors.foreground.primary);
  }
  if (colors.background) {
    tailwindColors.background = pick(colors.background.default);
    tailwindColors.card = pick(colors.background.card);
    tailwindColors.popover = pick(colors.background.popover);
    tailwindColors.primary = {
      DEFAULT: pick(colors.background.primary),
      foreground: pick(colors.foreground?.primary),
    };
    tailwindColors.secondary = {
      DEFAULT: pick(colors.background.secondary),
      foreground: pick(colors.foreground?.secondary),
    };
    tailwindColors.destructive = {
      DEFAULT: pick(colors.background.destructive),
      foreground: pick(colors.foreground?.destructive),
    };
    tailwindColors.success = {
      DEFAULT: pick(colors.background.success),
      foreground: pick(colors.foreground?.success),
    };
    tailwindColors.warning = {
      DEFAULT: pick(colors.background.warning),
      foreground: pick(colors.foreground?.warning),
    };
    tailwindColors.muted = {
      DEFAULT: pick(colors.background.muted),
      foreground: pick(colors.foreground?.muted),
    };
    tailwindColors.accent = {
      DEFAULT: pick(colors.background.accent),
      foreground: pick(colors.foreground?.accent),
    };
  }
  if (colors.border) {
    tailwindColors.border =
      pick(colors.border.default) || pick(colors.border.primary);
    tailwindColors.input = pick(colors.background?.input);
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
    // Load the Figma tokens
    const figmaTokensPath = path.join(
      process.cwd(),
      "assets/design-tokens.tokens.json"
    );
    const figmaTokens = JSON.parse(fs.readFileSync(figmaTokensPath, "utf-8"));

    // Create output directories
    const tokensOutputDir = path.join(process.cwd(), "src/new-ui/tokens");
    const stylesOutputDir = path.join(process.cwd(), "src/styles");

    if (!fs.existsSync(tokensOutputDir)) {
      fs.mkdirSync(tokensOutputDir, { recursive: true });
    }
    if (!fs.existsSync(stylesOutputDir)) {
      fs.mkdirSync(stylesOutputDir, { recursive: true });
    }

    // Generate TypeScript design tokens
    const designTokensTs = generateDesignTokens(figmaTokens);
    fs.writeFileSync(
      path.join(tokensOutputDir, "design-tokens.ts"),
      designTokensTs
    );
    console.log("✅ Generated src/new-ui/tokens/design-tokens.ts");

    // Generate CSS variables
    const cssVariables = generateCSSVariables(figmaTokens);
    fs.writeFileSync(
      path.join(stylesOutputDir, "design-tokens.css"),
      cssVariables
    );
    console.log("✅ Generated src/styles/design-tokens.css");

    // Generate Tailwind config
    const tailwindConfig = generateTailwindConfig(figmaTokens);
    fs.writeFileSync(
      path.join(tokensOutputDir, "tailwind-tokens.ts"),
      tailwindConfig
    );
    console.log("✅ Generated src/new-ui/tokens/tailwind-tokens.ts");

    // Create index file
    const indexContent = `// Design tokens exports
export { designTokens, semanticColors } from './design-tokens';
export { tailwindTokens } from './tailwind-tokens';
export type { ColorToken, SpacingToken, RadiusToken } from './design-tokens';
`;
    fs.writeFileSync(path.join(tokensOutputDir, "index.ts"), indexContent);
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
processTokens();

export { processTokens };
