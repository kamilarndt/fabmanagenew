#!/usr/bin/env node

/**
 * Generate CSS variables from design tokens
 * This script reads design tokens and generates CSS custom properties
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
  "styles",
  "design-tokens.css"
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
 * Convert camelCase to kebab-case
 */
function toKebabCase(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

/**
 * Generate CSS variables from tokens
 */
function generateCSSVariables(tokens) {
  console.log("🎨 Generating CSS variables from design tokens...");

  let css = `/* Design Tokens CSS Variables */
/* Generated automatically from Figma design tokens */
/* Last updated: ${new Date().toISOString()} */

:root {
`;

  // Process each token category
  Object.entries(tokens.tokens).forEach(([category, categoryTokens]) => {
    console.log(`  📁 Processing ${category} tokens...`);

    Object.entries(categoryTokens).forEach(([tokenName, tokenValue]) => {
      if (typeof tokenValue === "object" && tokenValue.default) {
        const cssVarName = `--color-${category}-${toKebabCase(tokenName)}`;
        const cssValue = tokenValue.default.value;

        css += `  ${cssVarName}: ${cssValue};\n`;
      } else if (typeof tokenValue === "object") {
        // Handle nested tokens
        Object.entries(tokenValue).forEach(([subTokenName, subTokenValue]) => {
          if (subTokenValue.default) {
            const cssVarName = `--color-${category}-${toKebabCase(
              tokenName
            )}-${toKebabCase(subTokenName)}`;
            const cssValue = subTokenValue.default.value;

            css += `  ${cssVarName}: ${cssValue};\n`;
          }
        });
      }
    });
  });

  css += `}

/* Semantic color mappings */
:root {
  /* Foreground colors */
  --color-foreground-default: var(--color-foreground-primary);
  --color-foreground-muted: var(--color-foreground-secondary);
  --color-foreground-accent: var(--color-foreground-accent);
  --color-foreground-destructive: var(--color-foreground-destructive);
  --color-foreground-success: var(--color-foreground-success);
  --color-foreground-warning: var(--color-foreground-warning);
  
  /* Background colors */
  --color-background-default: var(--color-background-primary);
  --color-background-card: var(--color-background-secondary);
  --color-background-muted: var(--color-background-muted);
  --color-background-accent: var(--color-background-accent);
  --color-background-destructive: var(--color-background-destructive);
  --color-background-success: var(--color-background-success);
  --color-background-warning: var(--color-background-warning);
  --color-background-popover: var(--color-background-popover);
  --color-background-input: var(--color-background-input);
  
  /* Border colors */
  --color-border-default: var(--color-border-primary);
  --color-border-destructive: var(--color-border-destructive);
  --color-border-success: var(--color-border-success);
  --color-border-warning: var(--color-border-warning);
  
  /* Sidebar colors */
  --color-sidebar-DEFAULT: var(--color-sidebar-default);
  --color-sidebar-foreground: var(--color-sidebar-foreground);
  --color-sidebar-primary: var(--color-sidebar-primary);
  --color-sidebar-primary-foreground: var(--color-sidebar-primary-foreground);
  --color-sidebar-accent: var(--color-sidebar-accent);
  --color-sidebar-accent-foreground: var(--color-sidebar-accent-foreground);
  --color-sidebar-border: var(--color-sidebar-border);
  --color-sidebar-ring: var(--color-sidebar-ring);
  
  /* Spacing tokens */
  --spacing-none: 0;
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-xxl: 3rem;
  
  /* Radius tokens */
  --radius-none: 0;
  --radius-sm: 0.125rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-full: 9999px;
}

/* Dark mode overrides */
@media (prefers-color-scheme: dark) {
  :root {
    /* Override colors for dark mode if needed */
    --color-foreground-default: var(--color-foreground-primary);
    --color-background-default: var(--color-background-primary);
  }
}

/* Print styles */
@media print {
  :root {
    /* Ensure proper contrast for printing */
    --color-foreground-default: #000000;
    --color-background-default: #ffffff;
    --color-border-default: #000000;
  }
}
`;

  return css;
}

/**
 * Save CSS to file
 */
async function saveCSS(css) {
  console.log("💾 Saving CSS variables to file...");

  try {
    // Ensure directory exists
    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write CSS to file
    fs.writeFileSync(OUTPUT_FILE, css);
    console.log(`✅ CSS variables saved to: ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("❌ Failed to save CSS:", error.message);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log("🚀 Starting CSS variables generation...");
    console.log(`📁 Tokens file: ${TOKENS_FILE}`);
    console.log(`📁 Output file: ${OUTPUT_FILE}`);

    // Read design tokens
    const tokens = readDesignTokens();
    console.log(
      `📄 Loaded tokens from: ${tokens.$metadata?.source || "unknown source"}`
    );

    // Generate CSS variables
    const css = generateCSSVariables(tokens);

    // Save CSS
    await saveCSS(css);

    console.log("✅ CSS variables generation completed successfully!");
  } catch (error) {
    console.error("❌ CSS variables generation failed:", error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateCSSVariables };
