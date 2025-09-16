#!/usr/bin/env node

import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

// Mapowanie komponentów Ant Design na nasze App komponenty
const componentMappings = {
  Button: "AppButton",
  Card: "AppCard",
  Col: "AppCol",
  Row: "AppRow",
  Space: "AppSpace",
  Tag: "AppTag",
  Input: "AppInput",
  Select: "AppSelect",
  Modal: "AppModal",
  Form: "AppForm",
  Table: "AppTable",
  Dropdown: "AppDropdown",
  Pagination: "AppPagination",
  Progress: "AppProgress",
  Empty: "AppEmpty",
  Segmented: "AppSegmented",
  Tabs: "AppTabs",
  Divider: "AppDivider",
};

// Pliki do przetworzenia (głównie strony i komponenty)
const filesToProcess = [
  "src/pages/Tiles.tsx",
  "src/pages/Projektowanie.tsx",
  "src/pages/MagazynUmms.tsx",
  "src/pages/Subcontractors.tsx",
  "src/components/Project/ProjectCard.tsx",
  "src/modules/tiles/components/TileCard.tsx",
  "src/modules/Materials/components/MaterialCard.tsx",
  "src/modules/groups/components/GroupCard.tsx",
  "src/modules/calendar/components/EventCard.tsx",
  "src/modules/cnc/components/CNCTaskCard.tsx",
];

function replaceComponentsInFile(filePath) {
  try {
    const fullPath = join(projectRoot, filePath);
    let content = readFileSync(fullPath, "utf8");

    console.log(`Processing ${filePath}...`);

    // Zastąp importy z antd
    const antdImportRegex = /import\s*\{([^}]+)\}\s*from\s*["']antd["'];?/g;
    let hasAntdImports = false;

    content = content.replace(antdImportRegex, (match, imports) => {
      hasAntdImports = true;
      const importList = imports.split(",").map((imp) => imp.trim());

      const appComponents = [];
      const remainingComponents = [];

      importList.forEach((comp) => {
        if (componentMappings[comp]) {
          appComponents.push(componentMappings[comp]);
        } else {
          remainingComponents.push(comp);
        }
      });

      let newImport = "";
      if (appComponents.length > 0) {
        newImport += `import {\n  ${appComponents.join(
          ",\n  "
        )}\n} from "../components/ui";\n`;
      }
      if (remainingComponents.length > 0) {
        newImport += `import { ${remainingComponents.join(
          ", "
        )} } from "antd";\n`;
      }

      return newImport;
    });

    // Zastąp użycia komponentów w JSX
    Object.entries(componentMappings).forEach(([antdComp, appComp]) => {
      // Zastąp <ComponentName i </ComponentName>
      const regex = new RegExp(`<${antdComp}\\b`, "g");
      content = content.replace(regex, `<${appComp}`);

      const closingRegex = new RegExp(`</${antdComp}>`, "g");
      content = content.replace(closingRegex, `</${appComp}>`);

      // Zastąp self-closing tagi
      const selfClosingRegex = new RegExp(`<${antdComp}\\b([^>]*)/>`, "g");
      content = content.replace(selfClosingRegex, `<${appComp}$1/>`);
    });

    if (hasAntdImports || content !== readFileSync(fullPath, "utf8")) {
      writeFileSync(fullPath, content, "utf8");
      console.log(`✅ Updated ${filePath}`);
    } else {
      console.log(`⏭️  No changes needed for ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Przetwórz wszystkie pliki
console.log("🔄 Starting component replacement...\n");

filesToProcess.forEach((file) => {
  replaceComponentsInFile(file);
});

console.log("\n✅ Component replacement completed!");
console.log("\n📋 Summary of changes:");
console.log("• Replaced Ant Design components with App components");
console.log("• Updated import statements");
console.log("• Maintained existing functionality");
console.log(
  "\n⚠️  Please check for any TypeScript errors and adjust props if needed"
);
