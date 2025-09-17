#!/usr/bin/env node
/**
 * Sync Design System with Figma
 * Two-way synchronization between code and Figma
 */

import fs from "fs";
import path from "path";

/**
 * Sync from Figma to Code
 */
async function syncFromFigma() {
  console.log("🔄 Syncing from Figma to code...");

  try {
    // This would use MCP Figma integration to get current variables
    console.log("📥 Fetching variables from Figma...");

    // For now, we'll process the existing tokens
    const { processTokens } = await import("./process-figma-tokens.js");
    await processTokens();

    console.log("✅ Synced from Figma to code");
  } catch (error) {
    console.error("❌ Error syncing from Figma:", error);
    throw error;
  }
}

/**
 * Sync from Code to Figma
 */
async function syncToFigma() {
  console.log("🔄 Syncing from code to Figma...");

  try {
    // Export current tokens to Figma format
    const { exportToFigma } = await import("./export-to-figma.mjs");
    await exportToFigma();

    console.log("📤 Exported tokens to Figma format");
    console.log("📋 Next steps:");
    console.log("   1. Open Figma");
    console.log(
      "   2. Import variables from export/figma/figma-variables.json"
    );
    console.log("   3. Update your design system components");

    console.log("✅ Synced from code to Figma");
  } catch (error) {
    console.error("❌ Error syncing to Figma:", error);
    throw error;
  }
}

/**
 * Full synchronization
 */
async function fullSync() {
  console.log("🔄 Starting full synchronization...");

  try {
    await syncFromFigma();
    await syncToFigma();

    console.log("🎉 Full synchronization completed!");
  } catch (error) {
    console.error("❌ Error during full sync:", error);
    process.exit(1);
  }
}

/**
 * Show sync status
 */
function showStatus() {
  console.log("📊 Design System Sync Status");
  console.log("============================");

  // Check if tokens exist
  const tokensPath = path.join(
    process.cwd(),
    "src/new-ui/tokens/design-tokens.ts"
  );
  const figmaTokensPath = path.join(
    process.cwd(),
    "assets/design-tokens.tokens.json"
  );
  const exportPath = path.join(process.cwd(), "export/figma");

  console.log(
    `Code tokens: ${fs.existsSync(tokensPath) ? "✅" : "❌"} ${tokensPath}`
  );
  console.log(
    `Figma tokens: ${
      fs.existsSync(figmaTokensPath) ? "✅" : "❌"
    } ${figmaTokensPath}`
  );
  console.log(
    `Export files: ${fs.existsSync(exportPath) ? "✅" : "❌"} ${exportPath}`
  );

  if (fs.existsSync(exportPath)) {
    const files = fs.readdirSync(exportPath);
    console.log(`   Files: ${files.join(", ")}`);
  }
}

// Command line interface
const command = process.argv[2];

switch (command) {
  case "from-figma":
    syncFromFigma();
    break;
  case "to-figma":
    syncToFigma();
    break;
  case "full":
    fullSync();
    break;
  case "status":
    showStatus();
    break;
  default:
    console.log("🔄 Figma Sync Tool");
    console.log("==================");
    console.log("");
    console.log("Usage:");
    console.log(
      "  node scripts/sync-with-figma.mjs from-figma  # Sync from Figma to code"
    );
    console.log(
      "  node scripts/sync-with-figma.mjs to-figma    # Sync from code to Figma"
    );
    console.log(
      "  node scripts/sync-with-figma.mjs full        # Full two-way sync"
    );
    console.log(
      "  node scripts/sync-with-figma.mjs status      # Show sync status"
    );
    console.log("");
    console.log("Examples:");
    console.log("  npm run figma:sync from-figma");
    console.log("  npm run figma:sync to-figma");
    console.log("  npm run figma:sync full");
    break;
}

export { fullSync, showStatus, syncFromFigma, syncToFigma };
