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
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: { width: 2560, height: 1440, deviceScaleFactor: 1 },
  });

  const page = await browser.newPage();

  let baseUrl = null;
  for (const url of baseUrls) {
    try {
      await page.goto(url + "/projects", {
        waitUntil: "domcontentloaded",
        timeout: 5000,
      });
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

  // Wait for app shell
  await page.waitForSelector("body", { timeout: 15000 });

  // Navigate explicitly to Projects
  await page.goto(baseUrl + "/projects", {
    waitUntil: "networkidle2",
    timeout: 20000,
  });

  // Helper to count project cards
  async function countProjectCards() {
    const count = await page.$$eval(
      '[data-component="ProjectCard"], .project-card',
      (nodes) => nodes.length
    );
    return count;
  }

  const ts = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .replace("T", "_")
    .replace("Z", "");

  const outDir = path.resolve("screenshots");
  await ensureDir(outDir);

  // Initial count + screenshot
  await new Promise((resolve) => setTimeout(resolve, 1000));
  let countBefore = await countProjectCards();
  const shot1 = path.join(outDir, `projects_before_${ts}.png`);
  await page.screenshot({ path: shot1, fullPage: true });

  // Try clicking Reload API if present
  try {
    const [btn] = await page.$x("//button[contains(., 'Reload API')]");
    if (btn) {
      await btn.click();
      await page
        .waitForNavigation({ waitUntil: "networkidle2", timeout: 15000 })
        .catch(() => {});
    }
  } catch {}

  // Re-count + screenshot
  await new Promise((resolve) => setTimeout(resolve, 800));
  const countAfter = await countProjectCards();
  const shot2 = path.join(outDir, `projects_after_${ts}.png`);
  await page.screenshot({ path: shot2, fullPage: true });

  // Try to extract project titles for debugging
  const titles = await page.$$eval(
    '[data-component="ProjectCard"] .project-title-section h4, .project-card .project-title-section h4',
    (els) => els.map((e) => e.textContent?.trim()).filter(Boolean)
  );

  console.log(
    JSON.stringify(
      {
        baseUrl,
        countBefore,
        countAfter,
        screenshots: { before: shot1, after: shot2 },
        titles,
      },
      null,
      2
    )
  );

  await browser.close();
}

run().catch(async (err) => {
  console.error("Puppeteer run failed:", err?.message || err);
  process.exit(1);
});
