import puppeteer from "puppeteer";

const baseUrl = "http://localhost:5174";

async function testAllPages() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 },
  });

  const page = await browser.newPage();
  const results = [];

  const pages = [
    { name: "Modern Dashboard", url: "/modern" },
    { name: "Modern Projects", url: "/modern/projects" },
    { name: "Modern Materials", url: "/modern/materials" },
    { name: "Modern Settings", url: "/modern/settings" },
  ];

  for (const pageInfo of pages) {
    try {
      console.log(`🔍 Testing ${pageInfo.name}...`);
      await page.goto(`${baseUrl}${pageInfo.url}`, {
        waitUntil: "networkidle0",
        timeout: 10000,
      });

      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Sprawdź czy strona się załadowała
      const title = await page
        .$eval("h1", (el) => el.textContent)
        .catch(() => "No title found");
      const hasContent = await page
        .$eval("body", (el) => el.textContent.length > 1000)
        .catch(() => false);

      console.log(`✅ ${pageInfo.name}: ${title} (Content: ${hasContent})`);

      results.push({
        page: pageInfo.name,
        url: pageInfo.url,
        status: "success",
        title,
        hasContent,
      });

      // Screenshot
      await page.screenshot({
        path: `screenshots/test_${pageInfo.name
          .replace(/\s+/g, "_")
          .toLowerCase()}_${Date.now()}.png`,
        fullPage: true,
      });
    } catch (error) {
      console.log(`❌ ${pageInfo.name}: ${error.message}`);
      results.push({
        page: pageInfo.name,
        url: pageInfo.url,
        status: "error",
        error: error.message,
      });
    }
  }

  await browser.close();
  return results;
}

testAllPages()
  .then((results) => {
    console.log("\n📊 Test Results:");
    results.forEach((result) => {
      const status = result.status === "success" ? "✅" : "❌";
      console.log(`${status} ${result.page}: ${result.title || result.error}`);
    });

    const successCount = results.filter((r) => r.status === "success").length;
    console.log(`\n🎯 Success: ${successCount}/${results.length}`);

    if (successCount === results.length) {
      console.log("🎉 ALL PAGES WORKING!");
    }
  })
  .catch(console.error);
