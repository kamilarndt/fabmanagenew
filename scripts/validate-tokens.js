#!/usr/bin/env node

/**
 * Validate design tokens
 * This script validates the design tokens for consistency and correctness
 */

const fs = require("fs");
const path = require("path");

const TOKENS_FILE = path.join(
  __dirname,
  "..",
  "assets",
  "design-tokens.tokens.json"
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
 * Validate color format (hex, rgb, rgba, hsl, etc.)
 */
function validateColorFormat(color) {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  const rgbRegex = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/;
  const rgbaRegex = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/;
  const hslRegex = /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/;
  const hslaRegex = /^hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[\d.]+\s*\)$/;

  return (
    hexRegex.test(color) ||
    rgbRegex.test(color) ||
    rgbaRegex.test(color) ||
    hslRegex.test(color) ||
    hslaRegex.test(color)
  );
}

/**
 * Validate spacing format (rem, px, em, etc.)
 */
function validateSpacingFormat(spacing) {
  const spacingRegex = /^\d+(\.\d+)?(rem|px|em|vh|vw|%)$/;
  return spacingRegex.test(spacing);
}

/**
 * Validate radius format (rem, px, em, etc.)
 */
function validateRadiusFormat(radius) {
  const radiusRegex = /^\d+(\.\d+)?(rem|px|em|vh|vw|%|px)$/;
  return radiusRegex.test(radius);
}

/**
 * Validate a single token
 */
function validateToken(token, tokenName, category) {
  const errors = [];

  // Check if token has required structure
  if (!token || typeof token !== "object") {
    errors.push(`Token ${tokenName} is not an object`);
    return errors;
  }

  // Check if token has default value
  if (!token.default) {
    errors.push(`Token ${tokenName} missing default value`);
    return errors;
  }

  // Check if default value has required structure
  if (!token.default.value || typeof token.default.value !== "string") {
    errors.push(`Token ${tokenName} default value is not a string`);
    return errors;
  }

  // Validate based on category
  switch (category) {
    case "foreground":
    case "background":
    case "border":
    case "sidebar":
      if (!validateColorFormat(token.default.value)) {
        errors.push(
          `Token ${tokenName} has invalid color format: ${token.default.value}`
        );
      }
      break;

    case "spacing":
      if (!validateSpacingFormat(token.default.value)) {
        errors.push(
          `Token ${tokenName} has invalid spacing format: ${token.default.value}`
        );
      }
      break;

    case "radius":
      if (!validateRadiusFormat(token.default.value)) {
        errors.push(
          `Token ${tokenName} has invalid radius format: ${token.default.value}`
        );
      }
      break;
  }

  return errors;
}

/**
 * Validate all tokens
 */
function validateTokens(tokens) {
  console.log("🔍 Validating design tokens...");

  const errors = [];
  const warnings = [];

  // Check metadata
  if (!tokens.$metadata) {
    errors.push("Missing metadata section");
  } else {
    const metadata = tokens.$metadata;
    if (!metadata.version) warnings.push("Missing version in metadata");
    if (!metadata.source) warnings.push("Missing source in metadata");
    if (!metadata.lastUpdated) warnings.push("Missing lastUpdated in metadata");
  }

  // Check tokens structure
  if (!tokens.tokens) {
    errors.push("Missing tokens section");
    return { errors, warnings };
  }

  // Validate each category
  Object.entries(tokens.tokens).forEach(([category, categoryTokens]) => {
    console.log(`  📁 Validating ${category} tokens...`);

    if (!categoryTokens || typeof categoryTokens !== "object") {
      errors.push(`Category ${category} is not an object`);
      return;
    }

    Object.entries(categoryTokens).forEach(([tokenName, token]) => {
      const tokenErrors = validateToken(token, tokenName, category);
      errors.push(...tokenErrors);
    });
  });

  return { errors, warnings };
}

/**
 * Check for token naming consistency
 */
function checkNamingConsistency(tokens) {
  console.log("📝 Checking naming consistency...");

  const warnings = [];

  Object.entries(tokens.tokens).forEach(([category, categoryTokens]) => {
    Object.keys(categoryTokens).forEach((tokenName) => {
      // Check for camelCase vs kebab-case
      if (tokenName.includes("-") && tokenName !== tokenName.toLowerCase()) {
        warnings.push(
          `Token ${category}.${tokenName} mixes kebab-case and camelCase`
        );
      }

      // Check for consistent naming patterns
      if (
        category === "foreground" &&
        !tokenName.includes("foreground") &&
        !tokenName.includes("text")
      ) {
        warnings.push(
          `Foreground token ${tokenName} doesn't follow naming convention`
        );
      }

      if (
        category === "background" &&
        !tokenName.includes("background") &&
        !tokenName.includes("bg")
      ) {
        warnings.push(
          `Background token ${tokenName} doesn't follow naming convention`
        );
      }
    });
  });

  return warnings;
}

/**
 * Check for duplicate values
 */
function checkDuplicateValues(tokens) {
  console.log("🔍 Checking for duplicate values...");

  const warnings = [];
  const valueMap = new Map();

  Object.entries(tokens.tokens).forEach(([category, categoryTokens]) => {
    Object.entries(categoryTokens).forEach(([tokenName, token]) => {
      if (token.default && token.default.value) {
        const value = token.default.value;
        const key = `${category}.${tokenName}`;

        if (valueMap.has(value)) {
          const existingKey = valueMap.get(value);
          warnings.push(
            `Duplicate value: ${key} and ${existingKey} both use "${value}"`
          );
        } else {
          valueMap.set(value, key);
        }
      }
    });
  });

  return warnings;
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log("🚀 Starting design tokens validation...");
    console.log(`📁 Tokens file: ${TOKENS_FILE}`);

    // Read design tokens
    const tokens = readDesignTokens();
    console.log(
      `📄 Loaded tokens from: ${tokens.$metadata?.source || "unknown source"}`
    );

    // Validate tokens
    const { errors, warnings } = validateTokens(tokens);

    // Check naming consistency
    const namingWarnings = checkNamingConsistency(tokens);
    warnings.push(...namingWarnings);

    // Check for duplicate values
    const duplicateWarnings = checkDuplicateValues(tokens);
    warnings.push(...duplicateWarnings);

    // Report results
    console.log("\n📊 Validation Results:");

    if (errors.length > 0) {
      console.log(`❌ Errors (${errors.length}):`);
      errors.forEach((error) => console.log(`  • ${error}`));
    }

    if (warnings.length > 0) {
      console.log(`⚠️  Warnings (${warnings.length}):`);
      warnings.forEach((warning) => console.log(`  • ${warning}`));
    }

    if (errors.length === 0 && warnings.length === 0) {
      console.log("✅ All tokens are valid!");
    }

    // Exit with error code if there are errors
    if (errors.length > 0) {
      console.log("\n❌ Validation failed due to errors");
      process.exit(1);
    }

    console.log("\n✅ Design tokens validation completed successfully!");
  } catch (error) {
    console.error("❌ Design tokens validation failed:", error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  validateTokens,
  validateColorFormat,
  validateSpacingFormat,
  validateRadiusFormat,
};
