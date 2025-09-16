import fs from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer";

async function ensureDir(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch {}
}

async function run() {
  const candidatePorts = [5175, 5174, 5173];
  const baseUrls = candidatePorts.map((p) => `http://localhost:${p}`);

  const browser = await puppeteer.launch({
    headless: false, // Widoczne okno do debugowania
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: { width: 2560, height: 1440, deviceScaleFactor: 1 },
    slowMo: 100, // Spowolnienie dla lepszej widoczności
  });

  const page = await browser.newPage();

  let baseUrl = null;
  for (const url of baseUrls) {
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 5000 });
      baseUrl = url;
      break;
    } catch {}
  }

  if (!baseUrl) {
    console.error(
      "Puppeteer: Could not connect to any dev server at ports",
      candidatePorts.join(", ")
    );
    await browser.close();
    process.exit(2);
  }

  const ts = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .replace("T", "_")
    .replace("Z", "");

  const outDir = path.resolve("screenshots");
  await ensureDir(outDir);

  const results = {
    baseUrl,
    timestamp: ts,
    tests: [],
    screenshots: [],
  };

  try {
    console.log("🚀 Starting CRUD tests with Puppeteer...");

    // Test 1: Sprawdzenie strony klientów (brak przycisku dodawania w UI)
    console.log("📝 Test 1: Sprawdzenie strony klientów");
    await page.goto(baseUrl + "/klienci", { waitUntil: "networkidle2" });
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Zrzut ekranu strony klientów
    const clientsScreenshot = path.join(outDir, `clients_page_${ts}.png`);
    await page.screenshot({ path: clientsScreenshot, fullPage: true });
    results.screenshots.push(clientsScreenshot);

    // Policz klientów na stronie
    const clientCards = await page.$$eval(
      '.ant-card, [data-component="ClientCard"]',
      (nodes) => nodes.length
    );
    results.tests.push({
      test: "view_clients",
      status: "success",
      clientCount: clientCards,
    });

    // Test 2: Dodawanie nowego projektu
    console.log("📝 Test 2: Dodawanie nowego projektu");
    await page.goto(baseUrl + "/projects", { waitUntil: "networkidle2" });
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      // Szukaj przycisku "Nowy Projekt" - używamy rzeczywistego selektora
      const addProjectBtn = await page.$('button:contains("Nowy Projekt")');

      if (!addProjectBtn) {
        // Spróbuj znaleźć przycisk przez tekst
        const buttons = await page.$$("button");
        let foundBtn = null;
        for (const btn of buttons) {
          const text = await page.evaluate((el) => el.textContent, btn);
          if (text && text.includes("Nowy Projekt")) {
            foundBtn = btn;
            break;
          }
        }

        if (foundBtn) {
          await foundBtn.click();
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Wypełnij formularz w modalu
          await page.waitForSelector(".ant-modal-content, .modal-content", {
            timeout: 5000,
          });

          // Nazwa projektu
          const nameInput = await page.$(
            'input[placeholder*="nazwa"], .ant-input'
          );
          if (nameInput) {
            await nameInput.type("Puppeteer Test Project " + Date.now());
          }

          // Wybierz klienta - szukaj select lub dropdown
          const clientSelect = await page.$(".ant-select-selector");
          if (clientSelect) {
            await clientSelect.click();
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Wybierz pierwszą opcję z listy
            const firstOption = await page.$(".ant-select-item-option");
            if (firstOption) {
              await firstOption.click();
            }
          }

          // Deadline - szukaj input daty
          const dateInput = await page.$(
            'input[placeholder*="deadline"], .ant-picker-input input'
          );
          if (dateInput) {
            await dateInput.type("2025-12-31");
          }

          // Zapisz - szukaj przycisku OK lub Zapisz w modalu
          await new Promise((resolve) => setTimeout(resolve, 500));
          const saveBtn = await page.$(
            '.ant-modal-footer .ant-btn-primary, button[type="submit"]'
          );
          if (saveBtn) {
            await saveBtn.click();
            await new Promise((resolve) => setTimeout(resolve, 3000));
          }

          results.tests.push({ test: "add_project", status: "success" });
        } else {
          results.tests.push({
            test: "add_project",
            status: "button_not_found",
          });
        }
      }
    } catch (error) {
      results.tests.push({
        test: "add_project",
        status: "error",
        error: error.message,
      });
    }

    // Zrzut ekranu po dodaniu projektu
    const projectsAfterScreenshot = path.join(
      outDir,
      `projects_after_add_${ts}.png`
    );
    await page.screenshot({ path: projectsAfterScreenshot, fullPage: true });
    results.screenshots.push(projectsAfterScreenshot);

    // Test 3: Sprawdzenie czy projekty się zwiększyły
    const projectCards = await page.$$eval(
      '[data-component="ProjectCard"], .project-card',
      (nodes) => nodes.length
    );
    results.projectCount = projectCards;

    // Test 4: Dodawanie elementu/tile (jeśli jest dostępne)
    console.log("📝 Test 3: Próba dodania elementu/tile");
    try {
      // Przejdź do pierwszego projektu
      const firstProjectCard = await page.$(
        '[data-component="ProjectCard"], .project-card'
      );
      if (firstProjectCard) {
        await firstProjectCard.click();
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Szukaj zakładki "Elementy" - używamy rzeczywistych selektorów
        const tabs = await page.$$('.ant-tabs-tab, [role="tab"]');
        let elementsTab = null;

        for (const tab of tabs) {
          const text = await page.evaluate((el) => el.textContent, tab);
          if (
            text &&
            (text.includes("Elementy") || text.includes("elementy"))
          ) {
            elementsTab = tab;
            break;
          }
        }

        if (elementsTab) {
          await elementsTab.click();
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Szukaj przycisku dodawania elementu
          const buttons = await page.$$("button");
          let addElementBtn = null;

          for (const btn of buttons) {
            const text = await page.evaluate((el) => el.textContent, btn);
            if (
              text &&
              (text.includes("Nowy element") ||
                text.includes("Dodaj element") ||
                text.includes("element"))
            ) {
              addElementBtn = btn;
              break;
            }
          }

          if (addElementBtn) {
            await addElementBtn.click();
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Wypełnij formularz elementu w modalu/drawer
            const nameInput = await page.$(
              'input[placeholder*="nazwa"], .ant-input'
            );
            if (nameInput) {
              await nameInput.type("Puppeteer Test Element " + Date.now());
            }

            // Zapisz element
            const saveBtn = await page.$(
              '.ant-modal-footer .ant-btn-primary, .ant-drawer-footer .ant-btn-primary, button[type="submit"]'
            );
            if (saveBtn) {
              await saveBtn.click();
              await new Promise((resolve) => setTimeout(resolve, 2000));
            }

            results.tests.push({ test: "add_element", status: "success" });
          } else {
            results.tests.push({
              test: "add_element",
              status: "add_button_not_found",
            });
          }
        } else {
          results.tests.push({
            test: "add_element",
            status: "elements_tab_not_found",
          });
        }
      }
    } catch (error) {
      results.tests.push({
        test: "add_element",
        status: "error",
        error: error.message,
      });
    }

    // Finalne zrzuty ekranu
    const finalScreenshot = path.join(outDir, `final_state_${ts}.png`);
    await page.screenshot({ path: finalScreenshot, fullPage: true });
    results.screenshots.push(finalScreenshot);
  } catch (error) {
    results.error = error.message;
    console.error("Test failed:", error);
  }

  console.log("\n📊 CRUD Test Results:");
  console.log(JSON.stringify(results, null, 2));

  await browser.close();
}

run().catch(async (err) => {
  console.error("Puppeteer CRUD test failed:", err?.message || err);
  process.exit(1);
});
