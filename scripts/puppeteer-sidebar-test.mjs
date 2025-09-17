import puppeteer from "puppeteer";

const baseUrl = "http://localhost:5174";

async function testSidebar() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 },
  });

  const page = await browser.newPage();

        try {
          console.log("🔍 Testing Sidebar...");
          await page.goto(`${baseUrl}/modern`, { waitUntil: "networkidle0" });
          await new Promise((resolve) => setTimeout(resolve, 3000));
          
          // Debug: sprawdź wszystkie elementy z data-testid
          const allTestIds = await page.evaluate(() => {
            const elements = document.querySelectorAll('[data-testid]');
            return Array.from(elements).map(el => ({
              testid: el.getAttribute('data-testid'),
              tagName: el.tagName,
              className: el.className,
              width: el.offsetWidth
            }));
          });
          console.log('All elements with data-testid:', allTestIds);

    // Sprawdź czy sidebar istnieje
    const sidebar = await page.$('[data-testid="sidebar"]');
    console.log(`✅ Sidebar found: ${!!sidebar}`);

    // Sprawdź logo
    const logo = await page.$('[style*="--sidebar-primary"]');
    console.log(`✅ Logo found: ${!!logo}`);

    // Sprawdź linki nawigacji
    const navLinks = await page.$$('a[href*="/modern"]');
    console.log(`✅ Navigation links found: ${navLinks.length}`);

    // Sprawdź tekst linków
    const linkTexts = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href*="/modern"]'));
      return links.map((link) => link.textContent?.trim()).filter(Boolean);
    });
    console.log(`✅ Link texts: ${JSON.stringify(linkTexts)}`);

    // Sprawdź czy sidebar jest widoczny
    const sidebarVisible = await page.evaluate(() => {
      const sidebar = document.querySelector('[data-testid="sidebar"]');
      if (!sidebar) return false;
      const style = window.getComputedStyle(sidebar);
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        style.opacity !== "0"
      );
    });
    console.log(`✅ Sidebar visible: ${sidebarVisible}`);

          // Sprawdź szerokość sidebar
          const sidebarWidth = await page.evaluate(() => {
            const sidebar = document.querySelector('[data-testid="sidebar"]');
            if (!sidebar) return 0;
            const computedStyle = window.getComputedStyle(sidebar);
            console.log('Sidebar classes:', sidebar.className);
            console.log('Sidebar computed width:', computedStyle.width);
            console.log('Sidebar offsetWidth:', sidebar.offsetWidth);
            return sidebar.offsetWidth;
          });
          console.log(`✅ Sidebar width: ${sidebarWidth}px`);

    // Test kliknięcia w linki
    console.log("🔍 Testing navigation clicks...");

    // Kliknij w Projects
    await page.click('a[href="/modern/projects"]');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const projectsTitle = await page.$eval("h1", (el) => el.textContent);
    console.log(`✅ Clicked Projects: ${projectsTitle}`);

    // Kliknij w Warehouse (Magazyn)
    await page.click('a[href="/modern/warehouse"]');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const warehouseTitle = await page.$eval("h1", (el) => el.textContent);
    console.log(`✅ Clicked Warehouse: ${warehouseTitle}`);

    // Kliknij w CNC
    await page.click('a[href="/modern/cnc"]');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const cncTitle = await page.$eval("h1", (el) => el.textContent);
    console.log(`✅ Clicked CNC: ${cncTitle}`);

    // Screenshot
    await page.screenshot({
      path: `screenshots/sidebar_test_${Date.now()}.png`,
      fullPage: true,
    });

    console.log("✅ Sidebar test completed!");
  } catch (error) {
    console.error("❌ Sidebar test error:", error.message);
  } finally {
    await browser.close();
  }
}

testSidebar();
