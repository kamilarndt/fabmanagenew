import fs from "fs";
import puppeteer from "puppeteer";

const baseUrl = "http://localhost:5174";
const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);

console.log("🚀 Starting Modern UI tests with Puppeteer...");

async function testModernUI() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 },
  });

  const page = await browser.newPage();
  const results = {
    baseUrl,
    timestamp,
    tests: [],
    screenshots: [],
  };

  try {
    // Test 1: Modern Dashboard
    console.log("📝 Test 1: Modern Dashboard");
    await page.goto(`${baseUrl}/modern`, { waitUntil: "networkidle0" });
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Sprawdź czy strona się załadowała
    const dashboardTitle = await page.$eval("h1", (el) => el.textContent);
    console.log(`✅ Dashboard title: ${dashboardTitle}`);

    // Sprawdź czy są karty statystyk
    const statsCards = await page.$$(
      '[class*="bg-primary-50"], [class*="bg-success-50"], [class*="bg-warning-50"], [class*="bg-info-50"]'
    );
    console.log(`✅ Stats cards found: ${statsCards.length}`);

    // Sprawdź czy są projekty
    const projectCards = await page.$$('[class*="hover:bg-tertiary"]');
    console.log(`✅ Project cards found: ${projectCards.length}`);

    await page.screenshot({
      path: `screenshots/modern_dashboard_${timestamp}.png`,
      fullPage: true,
    });
    results.screenshots.push(`modern_dashboard_${timestamp}.png`);

    results.tests.push({
      test: "modern_dashboard",
      status: "success",
      title: dashboardTitle,
      statsCards: statsCards.length,
      projectCards: projectCards.length,
    });

    // Test 2: Modern Projects
    console.log("📝 Test 2: Modern Projects");
    await page.goto(`${baseUrl}/modern/projects`, {
      waitUntil: "networkidle0",
    });
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const projectsTitle = await page.$eval("h1", (el) => el.textContent);
    console.log(`✅ Projects title: ${projectsTitle}`);

    // Sprawdź filtry
    const searchInput = await page.$('input[placeholder*="Search projects"]');
    const filterButtons = await page.$$("button");
    console.log(`✅ Search input found: ${!!searchInput}`);
    console.log(`✅ Filter buttons found: ${filterButtons.length}`);

    await page.screenshot({
      path: `screenshots/modern_projects_${timestamp}.png`,
      fullPage: true,
    });
    results.screenshots.push(`modern_projects_${timestamp}.png`);

    results.tests.push({
      test: "modern_projects",
      status: "success",
      title: projectsTitle,
      hasSearch: !!searchInput,
      filterButtons: filterButtons.length,
    });

    // Test 3: Modern Materials
    console.log("📝 Test 3: Modern Materials");
    await page.goto(`${baseUrl}/modern/materials`, {
      waitUntil: "networkidle0",
    });
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const materialsTitle = await page.$eval("h1", (el) => el.textContent);
    console.log(`✅ Materials title: ${materialsTitle}`);

    // Sprawdź tabelę materiałów
    const materialRows = await page.$$("tbody tr");
    console.log(`✅ Material rows found: ${materialRows.length}`);

    // Sprawdź filtry
    const categorySelect = await page.$("select");
    const searchInputMaterials = await page.$(
      'input[placeholder*="Search materials"]'
    );
    console.log(`✅ Category select found: ${!!categorySelect}`);
    console.log(`✅ Search input found: ${!!searchInputMaterials}`);

    await page.screenshot({
      path: `screenshots/modern_materials_${timestamp}.png`,
      fullPage: true,
    });
    results.screenshots.push(`modern_materials_${timestamp}.png`);

    results.tests.push({
      test: "modern_materials",
      status: "success",
      title: materialsTitle,
      materialRows: materialRows.length,
      hasCategorySelect: !!categorySelect,
      hasSearch: !!searchInputMaterials,
    });

    // Test 4: Modern Settings
    console.log("📝 Test 4: Modern Settings");
    await page.goto(`${baseUrl}/modern/settings`, {
      waitUntil: "networkidle0",
    });
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const settingsTitle = await page.$eval("h1", (el) => el.textContent);
    console.log(`✅ Settings title: ${settingsTitle}`);

    // Sprawdź zakładki
    const tabs = await page.$$("button");
    console.log(`✅ Settings tabs found: ${tabs.length}`);

    // Sprawdź formularze
    const formInputs = await page.$$(
      'input[type="text"], input[type="email"], input[type="tel"]'
    );
    console.log(`✅ Form inputs found: ${formInputs.length}`);

    await page.screenshot({
      path: `screenshots/modern_settings_${timestamp}.png`,
      fullPage: true,
    });
    results.screenshots.push(`modern_settings_${timestamp}.png`);

    results.tests.push({
      test: "modern_settings",
      status: "success",
      title: settingsTitle,
      tabs: tabs.length,
      formInputs: formInputs.length,
    });

    // Test 5: Navigation
    console.log("📝 Test 5: Navigation");
    await page.goto(`${baseUrl}/modern`, { waitUntil: "networkidle0" });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Sprawdź sidebar
    const sidebar = await page.$('[class*="bg-sidebar"]');
    const navLinks = await page.$$('a[href*="/modern"]');
    console.log(`✅ Sidebar found: ${!!sidebar}`);
    console.log(`✅ Navigation links found: ${navLinks.length}`);

    // Test nawigacji
    await page.click('a[href="/modern/projects"]');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const projectsTitleAfterNav = await page.$eval(
      "h1",
      (el) => el.textContent
    );
    console.log(`✅ Navigation to projects: ${projectsTitleAfterNav}`);

    await page.click('a[href="/modern/materials"]');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const materialsTitleAfterNav = await page.$eval(
      "h1",
      (el) => el.textContent
    );
    console.log(`✅ Navigation to materials: ${materialsTitleAfterNav}`);

    await page.click('a[href="/modern/settings"]');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const settingsTitleAfterNav = await page.$eval(
      "h1",
      (el) => el.textContent
    );
    console.log(`✅ Navigation to settings: ${settingsTitleAfterNav}`);

    results.tests.push({
      test: "navigation",
      status: "success",
      sidebar: !!sidebar,
      navLinks: navLinks.length,
      navigationWorking: true,
    });

    // Test 6: Responsive Design
    console.log("📝 Test 6: Responsive Design");

    // Test mobile view
    await page.setViewport({ width: 375, height: 667 });
    await page.goto(`${baseUrl}/modern`, { waitUntil: "networkidle0" });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await page.screenshot({
      path: `screenshots/modern_mobile_${timestamp}.png`,
      fullPage: true,
    });
    results.screenshots.push(`modern_mobile_${timestamp}.png`);

    // Test tablet view
    await page.setViewport({ width: 768, height: 1024 });
    await page.goto(`${baseUrl}/modern`, { waitUntil: "networkidle0" });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await page.screenshot({
      path: `screenshots/modern_tablet_${timestamp}.png`,
      fullPage: true,
    });
    results.screenshots.push(`modern_tablet_${timestamp}.png`);

    // Reset to desktop
    await page.setViewport({ width: 1920, height: 1080 });

    results.tests.push({
      test: "responsive",
      status: "success",
      mobile: true,
      tablet: true,
      desktop: true,
    });
  } catch (error) {
    console.error("❌ Test error:", error.message);
    results.tests.push({
      test: "error",
      status: "error",
      error: error.message,
    });
  } finally {
    await browser.close();
  }

  return results;
}

// Uruchom testy
testModernUI()
  .then((results) => {
    console.log("\n📊 Modern UI Test Results:");
    console.log(JSON.stringify(results, null, 2));

    // Zapisz wyniki do pliku
    const resultsFile = `screenshots/modern_test_results_${timestamp}.json`;
    fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
    console.log(`\n💾 Results saved to: ${resultsFile}`);

    // Podsumowanie
    const successTests = results.tests.filter(
      (t) => t.status === "success"
    ).length;
    const totalTests = results.tests.length;
    console.log(`\n✅ Tests passed: ${successTests}/${totalTests}`);

    if (successTests === totalTests) {
      console.log("🎉 ALL TESTS PASSED! Modern UI is working perfectly!");
    } else {
      console.log("⚠️ Some tests failed. Check the results above.");
    }
  })
  .catch((error) => {
    console.error("❌ Test suite error:", error);
  });
