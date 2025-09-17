#!/usr/bin/env node

/**
 * Generate TypeScript types from design tokens
 * This script reads design tokens and generates TypeScript interfaces
 */

const fs = require("fs");
const path = require("path");

const TOKENS_FILE = path.join(
  __dirname,
  "..",
  "assets",
  "design-tokens.tokens.json"
);
const OUTPUT_FILE = path.join(
  __dirname,
  "..",
  "src",
  "design-system",
  "types",
  "tokens.ts"
);

/**
 * Read design tokens from file
 */
function readDesignTokens() {
  if (!fs.existsSync(TOKENS_FILE)) {
    throw new Error(`Design tokens file not found: ${TOKENS_FILE}`);
  }

  const content = fs.readFileSync(TOKENS_FILE, "utf8");
  return JSON.parse(content);
}

/**
 * Convert kebab-case to PascalCase
 */
function toPascalCase(str) {
  return str.replace(/(^|-)([a-z])/g, (_, __, letter) => letter.toUpperCase());
}

/**
 * Generate TypeScript types from tokens
 */
function generateTypeScriptTypes(tokens) {
  console.log("🔧 Generating TypeScript types from design tokens...");

  let ts = `// Design Tokens TypeScript Types
// Generated automatically from Figma design tokens
// Last updated: ${new Date().toISOString()}

// Base token interfaces
export interface ColorToken {
  value: string;
  type: 'color';
  description?: string;
}

export interface SpacingToken {
  value: string;
  type: 'spacing';
  description?: string;
}

export interface RadiusToken {
  value: string;
  type: 'borderRadius';
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
  type: 'typography';
  description?: string;
}

// Token categories
export interface ForegroundTokens {
`;

  // Generate foreground tokens
  if (tokens.tokens.foreground) {
    Object.keys(tokens.tokens.foreground).forEach((tokenName) => {
      const typeName = toPascalCase(tokenName);
      ts += `  ${tokenName}: ColorToken;\n`;
    });
  }

  ts += `}

export interface BackgroundTokens {
`;

  // Generate background tokens
  if (tokens.tokens.background) {
    Object.keys(tokens.tokens.background).forEach((tokenName) => {
      const typeName = toPascalCase(tokenName);
      ts += `  ${tokenName}: ColorToken;\n`;
    });
  }

  ts += `}

export interface BorderTokens {
`;

  // Generate border tokens
  if (tokens.tokens.border) {
    Object.keys(tokens.tokens.border).forEach((tokenName) => {
      const typeName = toPascalCase(tokenName);
      ts += `  ${tokenName}: ColorToken;\n`;
    });
  }

  ts += `}

export interface SidebarTokens {
`;

  // Generate sidebar tokens
  if (tokens.tokens.sidebar) {
    Object.keys(tokens.tokens.sidebar).forEach((tokenName) => {
      const typeName = toPascalCase(tokenName);
      ts += `  ${tokenName}: ColorToken;\n`;
    });
  }

  ts += `}

export interface SpacingTokens {
`;

  // Generate spacing tokens
  if (tokens.tokens.spacing) {
    Object.keys(tokens.tokens.spacing).forEach((tokenName) => {
      const typeName = toPascalCase(tokenName);
      ts += `  ${tokenName}: SpacingToken;\n`;
    });
  }

  ts += `}

export interface RadiusTokens {
`;

  // Generate radius tokens
  if (tokens.tokens.radius) {
    Object.keys(tokens.tokens.radius).forEach((tokenName) => {
      const typeName = toPascalCase(tokenName);
      ts += `  ${tokenName}: RadiusToken;\n`;
    });
  }

  ts += `}

// Main design tokens interface
export interface DesignTokens {
  colors: {
    foreground: ForegroundTokens;
    background: BackgroundTokens;
    border: BorderTokens;
    sidebar: SidebarTokens;
    chart: Record<string, any>;
    icon: Record<string, any>;
  };
  spacing: SpacingTokens;
  radius: RadiusTokens;
  semantic: Record<string, string>;
}

// Token key types for type safety
export type ForegroundTokenKey = keyof ForegroundTokens;
export type BackgroundTokenKey = keyof BackgroundTokens;
export type BorderTokenKey = keyof BorderTokens;
export type SidebarTokenKey = keyof SidebarTokens;
export type SpacingTokenKey = keyof SpacingTokens;
export type RadiusTokenKey = keyof RadiusTokens;

// CSS variable names type
export type CSSVariableName = 
  | \`--color-foreground-\${string}\`
  | \`--color-background-\${string}\`
  | \`--color-border-\${string}\`
  | \`--color-sidebar-\${string}\`
  | \`--spacing-\${string}\`
  | \`--radius-\${string}\`;

// Token path type for helper functions
export type TokenPath = 
  | ['colors', 'foreground', ForegroundTokenKey]
  | ['colors', 'background', BackgroundTokenKey]
  | ['colors', 'border', BorderTokenKey]
  | ['colors', 'sidebar', SidebarTokenKey]
  | ['spacing', SpacingTokenKey]
  | ['radius', RadiusTokenKey];

// Utility types
export type TokenCategory = 'colors' | 'spacing' | 'radius';
export type TokenSubCategory = 'foreground' | 'background' | 'border' | 'sidebar';

// Design system metadata
export interface DesignSystemMetadata {
  version: string;
  source: string;
  fileKey: string;
  lastUpdated: string;
  fileVersion: string;
}

// Complete design tokens with metadata
export interface DesignTokensWithMetadata {
  $metadata: DesignSystemMetadata;
  tokens: DesignTokens;
}
`;

  return ts;
}

/**
 * Save TypeScript types to file
 */
async function saveTypeScript(ts) {
  console.log("💾 Saving TypeScript types to file...");

  try {
    // Ensure directory exists
    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write TypeScript to file
    fs.writeFileSync(OUTPUT_FILE, ts);
    console.log(`✅ TypeScript types saved to: ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("❌ Failed to save TypeScript:", error.message);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log("🚀 Starting TypeScript types generation...");
    console.log(`📁 Tokens file: ${TOKENS_FILE}`);
    console.log(`📁 Output file: ${OUTPUT_FILE}`);

    // Read design tokens
    const tokens = readDesignTokens();
    console.log(
      `📄 Loaded tokens from: ${tokens.$metadata?.source || "unknown source"}`
    );

    // Generate TypeScript types
    const ts = generateTypeScriptTypes(tokens);

    // Save TypeScript
    await saveTypeScript(ts);

    console.log("✅ TypeScript types generation completed successfully!");
  } catch (error) {
    console.error("❌ TypeScript types generation failed:", error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateTypeScriptTypes };
