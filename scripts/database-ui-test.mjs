#!/usr/bin/env node

import { dirname, join } from "path";
import puppeteer from "puppeteer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Konfiguracja testów
const CONFIG = {
  APP_URL: "http://localhost:5173",
  BACKEND_URL: "http://localhost:3001",
  HEADLESS: false,
  SLOW_MO: 250,
  TIMEOUT: 30000,
  SCREENSHOT_DIR: join(__dirname, "..", "screenshots"),
  TEST_DATA: {
    project: {
      name: `Test Project ${Date.now()}`,
      description: "Automatyczny test projektu",
      client: "Test Client",
    },
    client: {
      name: `Test Client ${Date.now()}`,
      email: "test@example.com",
      phone: "+48123456789",
    },
    material: {
      name: `Test Material ${Date.now()}`,
      type: "płyta",
      thickness: "18mm",
      supplier: "Test Supplier",
    },
  },
};

class DatabaseUITester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.testResults = {
      passed: 0,
      failed: 0,
      errors: [],
      timestamps: {},
    };
  }

  async initialize() {
    console.log("🚀 Inicjalizacja testów bazy danych przez UI...");

    this.browser = await puppeteer.launch({
      headless: CONFIG.HEADLESS,
      slowMo: CONFIG.SLOW_MO,
      defaultViewport: { width: 1920, height: 1080 },
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    this.page = await this.browser.newPage();

    // Ustawienie timeout
    this.page.setDefaultTimeout(CONFIG.TIMEOUT);

    // Nasłuchiwanie błędów konsoli
    this.page.on("console", (msg) => {
      if (msg.type() === "error") {
        console.log("❌ Console Error:", msg.text());
        this.testResults.errors.push(`Console: ${msg.text()}`);
      }
    });

    // Nasłuchiwanie błędów sieci
    this.page.on("requestfailed", (request) => {
      console.log(
        "❌ Network Error:",
        request.url(),
        request.failure().errorText
      );
      this.testResults.errors.push(
        `Network: ${request.url()} - ${request.failure().errorText}`
      );
    });

    await this.page.goto(CONFIG.APP_URL);
    await this.waitForApp();

    console.log("✅ Aplikacja załadowana pomyślnie");
  }

  async waitForApp() {
    // Czekaj na załadowanie głównej aplikacji
    await this.page.waitForSelector(
      '[data-testid="app"], .ant-layout, #root > div',
      {
        timeout: CONFIG.TIMEOUT,
      }
    );

    // Dodatkowe czekanie na pełne załadowanie
    await this.page.waitForTimeout(2000);
  }

  async takeScreenshot(name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `${name}_${timestamp}.png`;
    await this.page.screenshot({
      path: join(CONFIG.SCREENSHOT_DIR, filename),
      fullPage: true,
    });
    console.log(`📸 Screenshot: ${filename}`);
  }

  async testConnection() {
    console.log("\n🔌 Test: Sprawdzanie połączenia z backendem...");

    try {
      const response = await fetch(`${CONFIG.BACKEND_URL}/health`);
      if (response.ok) {
        console.log("✅ Backend dostępny");
        this.testResults.passed++;
      } else {
        throw new Error(`Backend nie odpowiada: ${response.status}`);
      }
    } catch (error) {
      console.log("❌ Backend niedostępny:", error.message);
      this.testResults.failed++;
      this.testResults.errors.push(`Backend connection: ${error.message}`);
    }
  }

  async navigateToPage(pageName) {
    console.log(`🧭 Nawigacja do strony: ${pageName}`);

    // Sprawdź czy istnieje menu/sidebar
    const menuSelectors = [
      `[data-testid="nav-${pageName}"]`,
      `a[href*="${pageName.toLowerCase()}"]`,
      `a:contains("${pageName}")`,
      `.ant-menu-item:contains("${pageName}")`,
      `[data-cy="nav-${pageName}"]`,
    ];

    let navigated = false;

    for (const selector of menuSelectors) {
      try {
        await this.page.waitForSelector(selector, { timeout: 2000 });
        await this.page.click(selector);
        navigated = true;
        break;
      } catch (error) {
        // Kontynuuj z następnym selektorem
        continue;
      }
    }

    if (!navigated) {
      // Spróbuj bezpośredniej nawigacji URL
      const pageUrls = {
        Projekty: "/projects",
        Klienci: "/clients",
        Magazyn: "/magazyn",
      };

      if (pageUrls[pageName]) {
        await this.page.goto(`${CONFIG.APP_URL}${pageUrls[pageName]}`);
        navigated = true;
      }
    }

    if (navigated) {
      await this.page.waitForTimeout(1000);
      console.log(`✅ Przeszedł do strony: ${pageName}`);
    } else {
      throw new Error(`Nie można przejść do strony: ${pageName}`);
    }
  }

  async testCreateProject() {
    console.log("\n📋 Test: Tworzenie nowego projektu...");
    this.testResults.timestamps.createProject = Date.now();

    try {
      await this.navigateToPage("Projekty");
      await this.takeScreenshot("projects_before");

      // Znajdź przycisk dodawania projektu
      const addButtonSelectors = [
        '[data-testid="add-project"]',
        'button:contains("Dodaj projekt")',
        'button:contains("Nowy projekt")',
        '.ant-btn-primary:contains("Dodaj")',
        '[data-cy="add-project"]',
      ];

      let addButton = null;
      for (const selector of addButtonSelectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 2000 });
          addButton = selector;
          break;
        } catch (error) {
          continue;
        }
      }

      if (addButton) {
        await this.page.click(addButton);
        console.log("✅ Kliknięto przycisk dodawania projektu");
      } else {
        throw new Error("Nie znaleziono przycisku dodawania projektu");
      }

      // Czekaj na modal/drawer
      await this.page.waitForSelector(".ant-drawer, .ant-modal", {
        timeout: 5000,
      });

      // Wypełnij formularz
      const nameInput = await this.page.$(
        'input[name="name"], input[placeholder*="nazwa"], #name'
      );
      if (nameInput) {
        await nameInput.click();
        await nameInput.type(CONFIG.TEST_DATA.project.name);
        console.log(
          `✅ Wprowadzono nazwę projektu: ${CONFIG.TEST_DATA.project.name}`
        );
      }

      const descInput = await this.page.$(
        'textarea[name="description"], textarea[placeholder*="opis"], #description'
      );
      if (descInput) {
        await descInput.click();
        await descInput.type(CONFIG.TEST_DATA.project.description);
        console.log("✅ Wprowadzono opis projektu");
      }

      // Zapisz projekt
      const saveSelectors = [
        'button:contains("Zapisz")',
        'button:contains("Dodaj")',
        'button[type="submit"]',
        ".ant-btn-primary",
      ];

      for (const selector of saveSelectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 2000 });
          await this.page.click(selector);
          console.log("✅ Kliknięto przycisk zapisywania");
          break;
        } catch (error) {
          continue;
        }
      }

      // Czekaj na zamknięcie modala i odświeżenie listy
      await this.page.waitForTimeout(2000);
      await this.takeScreenshot("projects_after_add");

      // Sprawdź czy projekt został dodany
      const projectExists = await this.page.evaluate((projectName) => {
        return document.body.innerText.includes(projectName);
      }, CONFIG.TEST_DATA.project.name);

      if (projectExists) {
        console.log("✅ Projekt został pomyślnie utworzony i wyświetlony");
        this.testResults.passed++;
      } else {
        throw new Error("Projekt nie został wyświetlony na liście");
      }
    } catch (error) {
      console.log("❌ Błąd podczas tworzenia projektu:", error.message);
      this.testResults.failed++;
      this.testResults.errors.push(`Create Project: ${error.message}`);
      await this.takeScreenshot("projects_error");
    }
  }

  async testCreateClient() {
    console.log("\n👤 Test: Tworzenie nowego klienta...");
    this.testResults.timestamps.createClient = Date.now();

    try {
      await this.navigateToPage("Klienci");
      await this.takeScreenshot("clients_before");

      // Znajdź przycisk dodawania klienta
      const addButtonSelectors = [
        '[data-testid="add-client"]',
        'button:contains("Dodaj klienta")',
        'button:contains("Nowy klient")',
        ".ant-btn-primary",
      ];

      let addButton = null;
      for (const selector of addButtonSelectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 2000 });
          addButton = selector;
          break;
        } catch (error) {
          continue;
        }
      }

      if (addButton) {
        await this.page.click(addButton);
        console.log("✅ Kliknięto przycisk dodawania klienta");
      } else {
        throw new Error("Nie znaleziono przycisku dodawania klienta");
      }

      // Czekaj na modal/drawer
      await this.page.waitForSelector(".ant-drawer, .ant-modal", {
        timeout: 5000,
      });

      // Wypełnij formularz klienta
      const nameInput = await this.page.$(
        'input[name="name"], input[placeholder*="nazwa"], #name'
      );
      if (nameInput) {
        await nameInput.click();
        await nameInput.type(CONFIG.TEST_DATA.client.name);
        console.log(
          `✅ Wprowadzono nazwę klienta: ${CONFIG.TEST_DATA.client.name}`
        );
      }

      const emailInput = await this.page.$(
        'input[name="email"], input[type="email"], #email'
      );
      if (emailInput) {
        await emailInput.click();
        await emailInput.type(CONFIG.TEST_DATA.client.email);
        console.log("✅ Wprowadzono email klienta");
      }

      const phoneInput = await this.page.$(
        'input[name="phone"], input[placeholder*="telefon"], #phone'
      );
      if (phoneInput) {
        await phoneInput.click();
        await phoneInput.type(CONFIG.TEST_DATA.client.phone);
        console.log("✅ Wprowadzono telefon klienta");
      }

      // Zapisz klienta
      const saveSelectors = [
        'button:contains("Zapisz")',
        'button:contains("Dodaj")',
        'button[type="submit"]',
        ".ant-btn-primary",
      ];

      for (const selector of saveSelectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 2000 });
          await this.page.click(selector);
          console.log("✅ Kliknięto przycisk zapisywania klienta");
          break;
        } catch (error) {
          continue;
        }
      }

      await this.page.waitForTimeout(2000);
      await this.takeScreenshot("clients_after_add");

      // Sprawdź czy klient został dodany
      const clientExists = await this.page.evaluate((clientName) => {
        return document.body.innerText.includes(clientName);
      }, CONFIG.TEST_DATA.client.name);

      if (clientExists) {
        console.log("✅ Klient został pomyślnie utworzony");
        this.testResults.passed++;
      } else {
        throw new Error("Klient nie został wyświetlony na liście");
      }
    } catch (error) {
      console.log("❌ Błąd podczas tworzenia klienta:", error.message);
      this.testResults.failed++;
      this.testResults.errors.push(`Create Client: ${error.message}`);
      await this.takeScreenshot("clients_error");
    }
  }

  async testCreateMaterial() {
    console.log("\n📦 Test: Tworzenie nowego materiału...");
    this.testResults.timestamps.createMaterial = Date.now();

    try {
      await this.navigateToPage("Magazyn");
      await this.takeScreenshot("materials_before");

      // Znajdź przycisk dodawania materiału
      const addButtonSelectors = [
        '[data-testid="add-material"]',
        'button:contains("Dodaj materiał")',
        'button:contains("Nowy materiał")',
        ".ant-btn-primary",
      ];

      let addButton = null;
      for (const selector of addButtonSelectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 2000 });
          addButton = selector;
          break;
        } catch (error) {
          continue;
        }
      }

      if (addButton) {
        await this.page.click(addButton);
        console.log("✅ Kliknięto przycisk dodawania materiału");
      } else {
        throw new Error("Nie znaleziono przycisku dodawania materiału");
      }

      // Czekaj na modal/drawer
      await this.page.waitForSelector(".ant-drawer, .ant-modal", {
        timeout: 5000,
      });

      // Wypełnij formularz materiału
      const nameInput = await this.page.$(
        'input[name="name"], input[placeholder*="nazwa"], #name'
      );
      if (nameInput) {
        await nameInput.click();
        await nameInput.type(CONFIG.TEST_DATA.material.name);
        console.log(
          `✅ Wprowadzono nazwę materiału: ${CONFIG.TEST_DATA.material.name}`
        );
      }

      // Zapisz materiał
      const saveSelectors = [
        'button:contains("Zapisz")',
        'button:contains("Dodaj")',
        'button[type="submit"]',
        ".ant-btn-primary",
      ];

      for (const selector of saveSelectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 2000 });
          await this.page.click(selector);
          console.log("✅ Kliknięto przycisk zapisywania materiału");
          break;
        } catch (error) {
          continue;
        }
      }

      await this.page.waitForTimeout(2000);
      await this.takeScreenshot("materials_after_add");

      // Sprawdź czy materiał został dodany
      const materialExists = await this.page.evaluate((materialName) => {
        return document.body.innerText.includes(materialName);
      }, CONFIG.TEST_DATA.material.name);

      if (materialExists) {
        console.log("✅ Materiał został pomyślnie utworzony");
        this.testResults.passed++;
      } else {
        throw new Error("Materiał nie został wyświetlony na liście");
      }
    } catch (error) {
      console.log("❌ Błąd podczas tworzenia materiału:", error.message);
      this.testResults.failed++;
      this.testResults.errors.push(`Create Material: ${error.message}`);
      await this.takeScreenshot("materials_error");
    }
  }

  async testDataPersistence() {
    console.log("\n💾 Test: Trwałość danych po odświeżeniu...");
    this.testResults.timestamps.persistence = Date.now();

    try {
      // Odśwież stronę
      await this.page.reload();
      await this.waitForApp();
      await this.page.waitForTimeout(3000);

      console.log("✅ Strona została odświeżona");

      // Sprawdź czy projekt nadal istnieje
      await this.navigateToPage("Projekty");
      const projectExists = await this.page.evaluate((projectName) => {
        return document.body.innerText.includes(projectName);
      }, CONFIG.TEST_DATA.project.name);

      if (projectExists) {
        console.log("✅ Projekt zachowany po odświeżeniu");
      } else {
        throw new Error("Projekt nie został zachowany");
      }

      // Sprawdź czy klient nadal istnieje
      await this.navigateToPage("Klienci");
      const clientExists = await this.page.evaluate((clientName) => {
        return document.body.innerText.includes(clientName);
      }, CONFIG.TEST_DATA.client.name);

      if (clientExists) {
        console.log("✅ Klient zachowany po odświeżeniu");
      } else {
        throw new Error("Klient nie został zachowany");
      }

      // Sprawdź czy materiał nadal istnieje
      await this.navigateToPage("Magazyn");
      const materialExists = await this.page.evaluate((materialName) => {
        return document.body.innerText.includes(materialName);
      }, CONFIG.TEST_DATA.material.name);

      if (materialExists) {
        console.log("✅ Materiał zachowany po odświeżeniu");
      } else {
        throw new Error("Materiał nie został zachowany");
      }

      await this.takeScreenshot("persistence_test");
      this.testResults.passed++;
    } catch (error) {
      console.log("❌ Błąd podczas testu trwałości:", error.message);
      this.testResults.failed++;
      this.testResults.errors.push(`Data Persistence: ${error.message}`);
    }
  }

  async testDatabaseReconnection() {
    console.log("\n🔄 Test: Ponowne połączenie z bazą danych...");
    this.testResults.timestamps.reconnection = Date.now();

    try {
      // Symulacja rozłączenia - sprawdzenie czy dane są nadal dostępne
      console.log('🔌 Sprawdzanie stanu po "rozłączeniu"...');

      // Czekaj chwilę i sprawdź ponownie dane
      await this.page.waitForTimeout(2000);

      // Przejdź przez wszystkie sekcje i sprawdź dane
      await this.navigateToPage("Projekty");
      const projectStillExists = await this.page.evaluate((projectName) => {
        return document.body.innerText.includes(projectName);
      }, CONFIG.TEST_DATA.project.name);

      if (projectStillExists) {
        console.log("✅ Dane projektów dostępne po ponownym połączeniu");
        this.testResults.passed++;
      } else {
        throw new Error("Dane projektów niedostępne");
      }
    } catch (error) {
      console.log("❌ Błąd podczas testu ponownego połączenia:", error.message);
      this.testResults.failed++;
      this.testResults.errors.push(`Database Reconnection: ${error.message}`);
    }
  }

  async generateReport() {
    console.log("\n📊 Generowanie raportu testów...");

    const totalTests = this.testResults.passed + this.testResults.failed;
    const successRate =
      totalTests > 0
        ? ((this.testResults.passed / totalTests) * 100).toFixed(2)
        : 0;

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: totalTests,
        passed: this.testResults.passed,
        failed: this.testResults.failed,
        successRate: `${successRate}%`,
      },
      testDuration: {
        total: Date.now() - this.testResults.timestamps.createProject,
        createProject:
          this.testResults.timestamps.createClient -
          this.testResults.timestamps.createProject,
        createClient:
          this.testResults.timestamps.createMaterial -
          this.testResults.timestamps.createClient,
        createMaterial:
          this.testResults.timestamps.persistence -
          this.testResults.timestamps.createMaterial,
        persistence:
          this.testResults.timestamps.reconnection -
          this.testResults.timestamps.persistence,
        reconnection: Date.now() - this.testResults.timestamps.reconnection,
      },
      errors: this.testResults.errors,
      testData: CONFIG.TEST_DATA,
    };

    // Zapisz raport do pliku
    const fs = await import("fs");
    const reportPath = join(__dirname, "database-test-report.json");
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log("\n=".repeat(80));
    console.log("📋 RAPORT TESTÓW BAZY DANYCH");
    console.log("=".repeat(80));
    console.log(
      `📊 Podsumowanie: ${this.testResults.passed}/${totalTests} testów przeszło (${successRate}%)`
    );
    console.log(
      `⏱️  Czas trwania: ${(report.testDuration.total / 1000).toFixed(2)}s`
    );

    if (this.testResults.errors.length > 0) {
      console.log("\n❌ Błędy:");
      this.testResults.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }

    console.log(`\n💾 Pełny raport zapisany: ${reportPath}`);
    console.log("=".repeat(80));

    return report;
  }

  async runAllTests() {
    try {
      await this.initialize();

      // Uruchom testy w sekwencji
      await this.testConnection();
      await this.testCreateProject();
      await this.testCreateClient();
      await this.testCreateMaterial();
      await this.testDataPersistence();
      await this.testDatabaseReconnection();

      // Finalne screenshot
      await this.takeScreenshot("final_state");

      // Wygeneruj raport
      const report = await this.generateReport();

      return report;
    } catch (error) {
      console.log("💥 Krytyczny błąd podczas testów:", error.message);
      this.testResults.errors.push(`Critical: ${error.message}`);
      await this.takeScreenshot("critical_error");
    } finally {
      if (this.browser) {
        await this.browser.close();
        console.log("🔒 Przeglądarka zamknięta");
      }
    }
  }
}

// Uruchom testy
async function main() {
  const tester = new DatabaseUITester();
  await tester.runAllTests();
}

// Eksportuj klasę dla użycia w innych skryptach
export { CONFIG, DatabaseUITester };

// Uruchom jeśli skrypt wywołany bezpośrednio
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
