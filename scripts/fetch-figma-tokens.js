#!/usr/bin/env node

/**
 * Fetch design tokens from Figma API
 * This script downloads the latest design tokens from Figma and saves them to the project
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

const FIGMA_API_TOKEN = process.env.FIGMA_API_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;

if (!FIGMA_API_TOKEN || !FIGMA_FILE_KEY) {
  console.error("❌ Missing required environment variables:");
  console.error("   FIGMA_API_TOKEN - Your Figma API token");
  console.error("   FIGMA_FILE_KEY - The file key from your Figma URL");
  process.exit(1);
}

const OUTPUT_FILE = path.join(
  __dirname,
  "..",
  "assets",
  "design-tokens.tokens.json"
);

/**
 * Make HTTP request to Figma API
 */
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      url,
      {
        headers: {
          "X-Figma-Token": FIGMA_API_TOKEN,
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            if (res.statusCode >= 400) {
              reject(new Error(`API Error: ${parsed.message || data}`));
            } else {
              resolve(parsed);
            }
          } catch (e) {
            reject(new Error(`Failed to parse response: ${e.message}`));
          }
        });
      }
    );

    req.on("error", reject);
    req.end();
  });
}

/**
 * Fetch file metadata from Figma
 */
async function fetchFileMetadata() {
  console.log("📡 Fetching file metadata from Figma...");

  try {
    const response = await makeRequest(
      `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}`
    );
    return response;
  } catch (error) {
    console.error("❌ Failed to fetch file metadata:", error.message);
    throw error;
  }
}

/**
 * Fetch design tokens from Figma
 */
async function fetchDesignTokens() {
  console.log("🎨 Fetching design tokens from Figma...");

  try {
    const response = await makeRequest(
      `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/styles`
    );
    return response;
  } catch (error) {
    console.error("❌ Failed to fetch design tokens:", error.message);
    throw error;
  }
}

/**
 * Transform Figma styles to design tokens format
 */
function transformToDesignTokens(figmaStyles, fileMetadata) {
  console.log("🔄 Transforming Figma styles to design tokens format...");

  const tokens = {
    $metadata: {
      version: "1.0.0",
      source: "Figma",
      fileKey: FIGMA_FILE_KEY,
      lastUpdated: new Date().toISOString(),
      fileVersion: fileMetadata.version || "unknown",
    },
    tokens: {
      foreground: {},
      background: {},
      border: {},
      sidebar: {},
      chart: {},
      icon: {},
      spacing: {},
      radius: {},
      semantic: {},
    },
  };

  // Process each style from Figma
  figmaStyles.meta.styles.forEach((style) => {
    const styleData = figmaStyles.styles[style.key];
    const styleName = style.name.toLowerCase().replace(/\s+/g, "-");

    // Categorize styles based on naming convention
    if (styleName.includes("foreground") || styleName.includes("text")) {
      tokens.tokens.foreground[styleName] = {
        default: {
          value: styleData.fills?.[0]?.color
            ? `#${Math.round(styleData.fills[0].color.r * 255)
                .toString(16)
                .padStart(2, "0")}${Math.round(styleData.fills[0].color.g * 255)
                .toString(16)
                .padStart(2, "0")}${Math.round(styleData.fills[0].color.b * 255)
                .toString(16)
                .padStart(2, "0")}`
            : "#000000",
          type: "color",
        },
      };
    } else if (styleName.includes("background")) {
      tokens.tokens.background[styleName] = {
        default: {
          value: styleData.fills?.[0]?.color
            ? `#${Math.round(styleData.fills[0].color.r * 255)
                .toString(16)
                .padStart(2, "0")}${Math.round(styleData.fills[0].color.g * 255)
                .toString(16)
                .padStart(2, "0")}${Math.round(styleData.fills[0].color.b * 255)
                .toString(16)
                .padStart(2, "0")}`
            : "#ffffff",
          type: "color",
        },
      };
    } else if (styleName.includes("border")) {
      tokens.tokens.border[styleName] = {
        default: {
          value: styleData.fills?.[0]?.color
            ? `#${Math.round(styleData.fills[0].color.r * 255)
                .toString(16)
                .padStart(2, "0")}${Math.round(styleData.fills[0].color.g * 255)
                .toString(16)
                .padStart(2, "0")}${Math.round(styleData.fills[0].color.b * 255)
                .toString(16)
                .padStart(2, "0")}`
            : "#cccccc",
          type: "color",
        },
      };
    } else if (styleName.includes("sidebar")) {
      tokens.tokens.sidebar[styleName] = {
        default: {
          value: styleData.fills?.[0]?.color
            ? `#${Math.round(styleData.fills[0].color.r * 255)
                .toString(16)
                .padStart(2, "0")}${Math.round(styleData.fills[0].color.g * 255)
                .toString(16)
                .padStart(2, "0")}${Math.round(styleData.fills[0].color.b * 255)
                .toString(16)
                .padStart(2, "0")}`
            : "#f5f5f5",
          type: "color",
        },
      };
    }
  });

  return tokens;
}

/**
 * Save tokens to file
 */
async function saveTokens(tokens) {
  console.log("💾 Saving design tokens to file...");

  try {
    // Ensure directory exists
    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write tokens to file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(tokens, null, 2));
    console.log(`✅ Design tokens saved to: ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("❌ Failed to save tokens:", error.message);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log("🚀 Starting design tokens sync from Figma...");
    console.log(`📁 Output file: ${OUTPUT_FILE}`);

    // Fetch file metadata
    const fileMetadata = await fetchFileMetadata();
    console.log(`📄 File: ${fileMetadata.name} (v${fileMetadata.version})`);

    // Fetch design tokens
    const figmaStyles = await fetchDesignTokens();
    console.log(`🎨 Found ${figmaStyles.meta.styles.length} styles`);

    // Transform to design tokens format
    const designTokens = transformToDesignTokens(figmaStyles, fileMetadata);

    // Save tokens
    await saveTokens(designTokens);

    console.log("✅ Design tokens sync completed successfully!");
  } catch (error) {
    console.error("❌ Design tokens sync failed:", error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { fetchDesignTokens, transformToDesignTokens };
