#!/usr/bin/env node

import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * Uruchamia ts-prune i zwraca listę nieużywanych plików
 * @returns {Promise<string[]>} Lista ścieżek do nieużywanych plików
 */
async function runPrune() {
  try {
    console.log("🔍 Analyzing project for unused exports...");

    const { stdout, stderr } = await execAsync("npm run check:unused");

    if (stderr && !stderr.includes("ts-prune")) {
      console.warn("⚠️  Warnings from ts-prune:", stderr);
    }

    if (!stdout.trim()) {
      return [];
    }

    // Parsuj wynik ts-prune - każda linia to path/to/file.tsx:ExportName
    const lines = stdout.trim().split("\n");
    const filePaths = new Set();

    for (const line of lines) {
      if (line.includes(":")) {
        let filePath = line.split(":")[0].trim();

        // Normalizuj ścieżkę Windows - zamień backslash na forward slash
        filePath = filePath.replace(/\\/g, "/");

        // Tylko pliki .tsx i .ts (bez .d.ts)
        if (
          (filePath.endsWith(".tsx") || filePath.endsWith(".ts")) &&
          !filePath.endsWith(".d.ts") &&
          !filePath.includes("test") &&
          !filePath.includes("spec") &&
          !filePath.includes("stories")
        ) {
          filePaths.add(filePath);
        }
      }
    }

    return Array.from(filePaths);
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(
        "❌ ts-prune not found. Please install it first: npm install --save-dev ts-prune"
      );
    }
    throw new Error(`❌ Error running ts-prune: ${error.message}`);
  }
}

/**
 * Sprawdza czy plik rzeczywiście nie jest używany przez dodatkowe sprawdzenia
 * @param {string} filePath Ścieżka do pliku
 * @returns {Promise<boolean>} True jeśli plik można bezpiecznie usunąć
 */
async function isSafeToDelete(filePath) {
  try {
    // Sprawdź czy plik nie jest importowany w innych miejscach
    const fileName = path.basename(filePath, path.extname(filePath));

    // Rekursywnie przeszukaj wszystkie pliki .ts i .tsx w src/
    const srcDir = "src";
    const searchPattern = new RegExp(
      `import.*${fileName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
      "i"
    );

    const found = await searchForImports(srcDir, searchPattern, filePath);

    if (found) {
      console.log(
        `⚠️  File ${filePath} appears to be imported elsewhere, skipping`
      );
      return false;
    }

    return true;
  } catch (error) {
    // W przypadku błędu, bądź ostrożny i nie usuwaj
    console.log(`⚠️  Could not verify safety of ${filePath}, skipping`);
    return false;
  }
}

/**
 * Rekursywnie przeszukuje pliki w poszukiwaniu importów
 * @param {string} dir Katalog do przeszukania
 * @param {RegExp} pattern Wzorzec do wyszukania
 * @param {string} excludeFile Plik do wykluczenia z przeszukiwania
 * @returns {Promise<boolean>} True jeśli znaleziono import
 */
async function searchForImports(dir, pattern, excludeFile) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Rekursywnie przeszukaj podkatalogi
        const found = await searchForImports(fullPath, pattern, excludeFile);
        if (found) return true;
      } else if (
        entry.isFile() &&
        (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) &&
        fullPath.replace(/\\/g, "/") !== excludeFile
      ) {
        // Przeszukaj plik
        try {
          const content = fs.readFileSync(fullPath, "utf8");
          if (pattern.test(content)) {
            return true;
          }
        } catch (readError) {
          // Ignoruj błędy odczytu plików
        }
      }
    }

    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Usuwa listę plików z bezpiecznymi sprawdzeniami
 * @param {string[]} filePaths Lista ścieżek plików do usunięcia
 */
async function deleteFiles(filePaths) {
  if (filePaths.length === 0) {
    console.log("✅ No unused files found. Project is clean!");
    return;
  }

  console.log(`🧹 Found ${filePaths.length} potentially unused files:`);

  let deletedCount = 0;
  let skippedCount = 0;

  for (let filePath of filePaths) {
    try {
      // Usuń początkowy slash jeśli istnieje (na Windows ts-prune może zwracać /src/...)
      if (filePath.startsWith("/")) {
        filePath = filePath.substring(1);
      }

      // Sprawdź czy plik istnieje
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File ${filePath} does not exist, skipping`);
        skippedCount++;
        continue;
      }

      // Dodatkowe sprawdzenie bezpieczeństwa
      const isSafe = await isSafeToDelete(filePath);
      if (!isSafe) {
        skippedCount++;
        continue;
      }

      console.log(`🗑️  DELETING: ${filePath}`);
      fs.unlinkSync(filePath);
      deletedCount++;

      // Sprawdź czy katalog jest pusty i usuń go
      const dir = path.dirname(filePath);
      try {
        const files = fs.readdirSync(dir);
        if (files.length === 0 && dir !== "src") {
          console.log(`📁 Removing empty directory: ${dir}`);
          fs.rmdirSync(dir);
        }
      } catch (e) {
        // Katalog nie jest pusty lub nie można go usunąć - kontynuuj
      }
    } catch (error) {
      console.error(`❌ Error deleting ${filePath}:`, error.message);
      skippedCount++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Deleted: ${deletedCount} files`);
  console.log(`   ⚠️  Skipped: ${skippedCount} files`);

  if (deletedCount > 0) {
    console.log(`\n🔧 Next steps:`);
    console.log(`   1. Run: npm run build`);
    console.log(`   2. Run: npm run test`);
    console.log(`   3. Verify application works correctly`);
  }
}

/**
 * Główna funkcja programu
 */
async function main() {
  try {
    console.log("🚀 Starting unused files cleanup...\n");

    // Sprawdź czy jesteśmy w głównym katalogu projektu
    if (!fs.existsSync("package.json")) {
      throw new Error(
        "❌ This script must be run from the project root directory"
      );
    }

    // Sprawdź czy mamy plik tsconfig.app.json
    if (!fs.existsSync("tsconfig.app.json")) {
      throw new Error(
        "❌ tsconfig.app.json not found. Make sure you are in the correct project directory"
      );
    }

    const filesToDelete = await runPrune();
    await deleteFiles(filesToDelete);
  } catch (error) {
    console.error("💥 Error:", error.message);
    process.exit(1);
  }
}

// Uruchom główną funkcję
main();
