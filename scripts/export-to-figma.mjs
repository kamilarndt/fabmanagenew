#!/usr/bin/env node
/**
 * Export Design Tokens to Figma
 * Generates Figma-compatible JSON files for variables and components
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read design tokens
const designTokensPath = path.join(__dirname, "../src/new-ui/tokens/design-tokens.ts");
const designTokensContent = fs.readFileSync(designTokensPath, "utf8");

// Extract design tokens (simple regex extraction)
const tokensMatch = designTokensContent.match(/export const designTokens = ({[\s\S]*?}) as const;/);
if (!tokensMatch) {
  console.error("Could not extract design tokens from design-tokens.ts");
  process.exit(1);
}

const designTokens = eval(`(${tokensMatch[1]})`);

/**
 * Convert hex color to RGBA
 */
function hexToRgba(hex) {
  hex = hex.replace("#", "");
  let r, g, b, a = 1;
  
  if (hex.length === 6) {
    r = parseInt(hex.substr(0, 2), 16) / 255;
    g = parseInt(hex.substr(2, 2), 16) / 255;
    b = parseInt(hex.substr(4, 2), 16) / 255;
  } else if (hex.length === 8) {
    r = parseInt(hex.substr(0, 2), 16) / 255;
    g = parseInt(hex.substr(2, 2), 16) / 255;
    b = parseInt(hex.substr(4, 2), 16) / 255;
    a = parseInt(hex.substr(6, 2), 16) / 255;
  } else {
    return { r: 0.5, g: 0.5, b: 0.5, a: 1 };
  }
  
  return { r, g, b, a };
}

/**
 * Generate Dark Mode color for sidebar
 */
function generateDarkModeColor(lightColor, category, key) {
  const lightRgba = hexToRgba(lightColor);

  // For sidebar colors, use the same values for both light and dark mode
  // since we're defining them specifically for dark mode
  return lightRgba;
}

/**
 * Generate Figma Variables JSON
 */
function generateFigmaVariables() {
  const colorCollectionId = `VariableCollectionId:${Date.now()}:1`;
  const lightModeId = "1:0";
  const darkModeId = "2:0";

  const variables = {
    id: colorCollectionId,
    name: "FabManage Design System",
    modes: {
      [lightModeId]: "Light Mode",
      [darkModeId]: "Dark Mode",
    },
    variableIds: [],
    variables: [],
  };

  let variableId = 1;

  // Helper function to add color variable
  const addColorVariable = (name, lightValue, darkValue) => {
    const id = `VariableID:${Date.now()}:${variableId++}`;
    variables.variableIds.push(id);
    variables.variables.push({
      id,
      name,
      description: `${name} color`,
      type: "COLOR",
      valuesByMode: {
        [lightModeId]: hexToRgba(lightValue),
        [darkModeId]: hexToRgba(darkValue),
      },
      resolvedValuesByMode: {
        [lightModeId]: {
          resolvedValue: hexToRgba(lightValue),
          alias: null,
        },
        [darkModeId]: {
          resolvedValue: hexToRgba(darkValue),
          alias: null,
        },
      },
      scopes: ["ALL_SCOPES"],
      hiddenFromPublishing: false,
      codeSyntax: {},
    });
  };

  // Add foreground colors
  Object.entries(designTokens.colors.foreground).forEach(([key, value]) => {
    const darkValue = generateDarkModeColor(value, "foreground", key);
    addColorVariable(`Foreground/${key}`, value, value);
  });

  // Add background colors
  Object.entries(designTokens.colors.background).forEach(([key, value]) => {
    const darkValue = generateDarkModeColor(value, "background", key);
    addColorVariable(`Background/${key}`, value, value);
  });

  // Add border colors
  Object.entries(designTokens.colors.border).forEach(([key, value]) => {
    const darkValue = generateDarkModeColor(value, "border", key);
    addColorVariable(`Border/${key}`, value, value);
  });

  // Add icon colors
  Object.entries(designTokens.colors.icon).forEach(([key, value]) => {
    const darkValue = generateDarkModeColor(value, "icon", key);
    addColorVariable(`Icon/${key}`, value, value);
  });

  // Add sidebar colors
  Object.entries(designTokens.colors.sidebar).forEach(([key, value]) => {
    const darkValue = generateDarkModeColor(value, "sidebar", key);
    addColorVariable(`Sidebar/${key}`, value, value);
  });

  // Add spacing variables
  Object.entries(designTokens.spacing).forEach(([key, value]) => {
    const id = `VariableID:${Date.now()}:${variableId++}`;
    const numValue = parseFloat(value.replace("px", ""));
    variables.variableIds.push(id);
    variables.variables.push({
      id,
      name: `Spacing/${key}`,
      description: `Spacing value for ${key}`,
      type: "FLOAT",
      valuesByMode: {
        [lightModeId]: numValue,
        [darkModeId]: numValue,
      },
      resolvedValuesByMode: {
        [lightModeId]: {
          resolvedValue: numValue,
          alias: null,
        },
        [darkModeId]: {
          resolvedValue: numValue,
          alias: null,
        },
      },
      scopes: ["ALL_SCOPES"],
      hiddenFromPublishing: false,
      codeSyntax: {},
    });
  });

  // Add radius variables
  Object.entries(designTokens.radius).forEach(([key, value]) => {
    const id = `VariableID:${Date.now()}:${variableId++}`;
    const numValue = parseFloat(value.replace("px", ""));
    variables.variableIds.push(id);
    variables.variables.push({
      id,
      name: `Radius/${key}`,
      description: `Border radius for ${key}`,
      type: "FLOAT",
      valuesByMode: {
        [lightModeId]: numValue,
        [darkModeId]: numValue,
      },
      resolvedValuesByMode: {
        [lightModeId]: {
          resolvedValue: numValue,
          alias: null,
        },
        [darkModeId]: {
          resolvedValue: numValue,
          alias: null,
        },
      },
      scopes: ["ALL_SCOPES"],
      hiddenFromPublishing: false,
      codeSyntax: {},
    });
  });

  return variables;
}

/**
 * Generate Figma Components JSON
 */
function generateFigmaComponents() {
  return {
    components: [
      {
        name: "Sidebar",
        description: "Main navigation sidebar component",
        properties: {
          variant: {
            type: "VARIANT",
            values: ["Light Mode", "Dark Mode", "Collapsed"],
          },
        },
      },
      {
        name: "Sidebar Item",
        description: "Individual sidebar navigation item",
        properties: {
          state: {
            type: "VARIANT",
            values: ["Default", "Active", "Hover"],
          },
          variant: {
            type: "VARIANT",
            values: ["Light Mode", "Dark Mode"],
          },
        },
      },
    ],
  };
}

/**
 * Main export function
 */
function exportToFigma() {
  console.log("🎨 Exporting design tokens to Figma...");

  // Create export directory
  const exportDir = path.join(__dirname, "../export/figma");
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  // Generate and save variables
  const variables = generateFigmaVariables();
  const variablesPath = path.join(exportDir, "figma-variables.json");
  fs.writeFileSync(variablesPath, JSON.stringify(variables, null, 2));
  console.log(`✅ Generated ${variablesPath}`);

  // Generate and save components
  const components = generateFigmaComponents();
  const componentsPath = path.join(exportDir, "figma-components.json");
  fs.writeFileSync(componentsPath, JSON.stringify(components, null, 2));
  console.log(`✅ Generated ${componentsPath}`);

  // Generate README
  const readmeContent = `# Figma Design Tokens Export

This directory contains exported design tokens from the FabManage Design System.

## Files

- \`figma-variables.json\` - Color, spacing, and radius variables for Figma
- \`figma-components.json\` - Component definitions for Figma

## Import Instructions

1. Open Figma
2. Go to the Variables panel
3. Click the "+" button and select "Import"
4. Select \`figma-variables.json\`
5. The variables will be imported with Light and Dark modes

## Usage

After importing, you can use these variables in your Figma designs:
- Colors: \`{Foreground/primary}\`, \`{Background/primary}\`, etc.
- Spacing: \`{Spacing/md}\`, \`{Spacing/lg}\`, etc.
- Radius: \`{Radius/md}\`, \`{Radius/lg}\`, etc.
- Sidebar: \`{Sidebar/DEFAULT}\`, \`{Sidebar/foreground}\`, etc.

## Regeneration

To regenerate these files, run:
\`\`\`bash
npm run figma:export
\`\`\`
`;

  const readmePath = path.join(exportDir, "README.md");
  fs.writeFileSync(readmePath, readmeContent);
  console.log(`✅ Generated ${readmePath}`);

  console.log("\n🎉 Export completed successfully!");
  console.log("\nNext steps:");
  console.log("1. Import figma-variables.json into Figma");
  console.log("2. Use the variables in your designs");
  console.log("3. Sync changes back using npm run figma:sync");
}

// Run export
exportToFigma();