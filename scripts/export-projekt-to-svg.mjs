import fs from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer";

async function ensureDir(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch {}
}

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    id: null,
    tab: "overview",
    out: null,
    url: null,
    mode: "raster",
  };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--id" && args[i + 1]) opts.id = args[++i];
    else if (a === "--tab" && args[i + 1]) opts.tab = args[++i];
    else if (a === "--out" && args[i + 1]) opts.out = args[++i];
    else if (a === "--url" && args[i + 1]) opts.url = args[++i];
    else if (a === "--mode" && args[i + 1]) opts.mode = args[++i];
  }
  return opts;
}

async function detectBaseUrl(page) {
  if (process.env.FAB_BASE_URL) return process.env.FAB_BASE_URL;
  const candidatePorts = [5175, 5174, 5173];
  for (const p of candidatePorts) {
    const url = `http://localhost:${p}`;
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 4000 });
      return url;
    } catch {}
  }
  throw new Error(
    "Dev server not detected on 5173-5175. Pass --url http://host:port"
  );
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isTransparent(c) {
  if (!c) return true;
  const v = String(c).toLowerCase();
  return (
    v === "transparent" || /rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\)/.test(v)
  );
}

function buildSvgFromDom({
  width,
  height,
  components,
  modules,
  pageBg,
  htmlFragment,
  rasterDataUrl,
}) {
  function sanitizeXhtml(html) {
    try {
      // Remove script/style with non-CSS, ensure void elements self-close
      let out = String(html)
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<link(\s[^>]*?)>/gi, "<link$1/>")
        .replace(/<img(\s[^>]*?)>/gi, "<img$1/>")
        .replace(/<br(\s[^>]*?)?>/gi, "<br$1/>")
        .replace(/<hr(\s[^>]*?)?>/gi, "<hr$1/>")
        .replace(/<input(\s[^>]*?)>/gi, "<input$1/>")
        .replace(/<meta(\s[^>]*?)>/gi, "<meta$1/>");
      return out;
    } catch {
      return html;
    }
  }
  const svgParts = [];
  svgParts.push(
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`
  );
  svgParts.push(`<defs/>`);
  // Page background
  const bg = pageBg && !isTransparent(pageBg) ? pageBg : "#1a1d21";
  svgParts.push(`<rect width="100%" height="100%" fill="${esc(bg)}" />`);
  // Raster background for maximum compatibility (optional)
  if (rasterDataUrl) {
    svgParts.push(
      `<image x="0" y="0" width="${width}" height="${height}" href="${rasterDataUrl}" />`
    );
  }
  // Full-fidelity DOM snapshot (omit when raster is present for compatibility)
  if (htmlFragment && !rasterDataUrl) {
    svgParts.push(
      `<foreignObject x="0" y="0" width="${width}" height="${height}">` +
        `<xhtml:div xmlns="http://www.w3.org/1999/xhtml" style="width:${width}px;height:${height}px;overflow:visible;">` +
        `${sanitizeXhtml(htmlFragment)}` +
        `</xhtml:div>` +
        `</foreignObject>`
    );
  }
  svgParts.push(`<g id="components">`);
  for (const c of components) {
    const rx = Number.isFinite(c.borderRadius)
      ? Math.max(0, c.borderRadius)
      : 0;
    const sw = Number.isFinite(c.borderWidth) ? Math.max(0, c.borderWidth) : 0;
    const stroke = !isTransparent(c.borderColor) ? c.borderColor : "none";
    const fill = !isTransparent(c.backgroundColor) ? c.backgroundColor : bg;
    svgParts.push(
      `<g id="${esc(c.id)}" data-component="${esc(c.name)}">` +
        `<rect x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" fill="${esc(
          fill
        )}" stroke="${esc(stroke)}" stroke-width="${sw}" rx="${rx}" />` +
        `<text x="${c.x + 8}" y="${c.y + 16}" font-size="12" fill="${
          c.color || "#d1d5db"
        }">${esc(c.name)}</text>` +
        `</g>`
    );
  }
  svgParts.push(`</g>`);
  svgParts.push(`<g id="modules">`);
  for (const m of modules) {
    const rx = Number.isFinite(m.borderRadius)
      ? Math.max(0, m.borderRadius)
      : 6;
    const sw = Number.isFinite(m.borderWidth) ? Math.max(0, m.borderWidth) : 1;
    const stroke = !isTransparent(m.borderColor) ? m.borderColor : "#52C41A";
    const fill = !isTransparent(m.backgroundColor) ? m.backgroundColor : "none";
    svgParts.push(
      `<g id="${esc(m.id)}" data-module="${esc(m.name)}">` +
        `<rect x="${m.x}" y="${m.y}" width="${m.w}" height="${m.h}" fill="${esc(
          fill
        )}" stroke="${esc(
          stroke
        )}" stroke-dasharray="4 2" stroke-width="${sw}" rx="${rx}" />` +
        `<text x="${m.x + 8}" y="${
          m.y + 16
        }" font-size="12" fill="#6ee7b7">${esc(m.name)}</text>` +
        `</g>`
    );
  }
  svgParts.push(`</g>`);
  svgParts.push(`</svg>`);
  return svgParts.join("");
}

async function main() {
  const { id, tab, out, url, mode } = parseArgs();
  let projectId = id;

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: { width: 1600, height: 1000, deviceScaleFactor: 1 },
  });
  const page = await browser.newPage();

  const baseUrl = url || (await detectBaseUrl(page));

  // Auto-create project if id not provided
  if (!projectId) {
    await page.goto(`${baseUrl}/projects`, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });
    // Let app init stores
    await page.waitForSelector("body", { timeout: 15000 });
    projectId = await page.evaluate(async () => {
      try {
        const mod = await import("/src/stores/projectsStore.ts");
        const { useProjectsStore } = mod;
        const before = useProjectsStore.getState().projects.length;
        const payload = {
          name: "Export Auto Project",
          clientId: "",
          deadline: "",
          modules: ["koncepcja", "wycena", "logistyka"],
        };
        await useProjectsStore.getState().add(payload);
        const afterState = useProjectsStore.getState();
        const last = afterState.projects[afterState.projects.length - 1];
        return last?.id || null;
      } catch (e) {
        console.error("Failed to create project in page context:", e);
        return null;
      }
    });
    if (!projectId)
      throw new Error("Failed to create a temporary project for export");
  }

  const targetUrl = `${baseUrl}/projekt/${projectId}?tab=${encodeURIComponent(
    tab
  )}`;

  await page.goto(targetUrl, { waitUntil: "networkidle2", timeout: 30000 });

  // Ensure content rendered
  await page.waitForSelector("body", { timeout: 15000 });

  // Markers: components = nodes having [data-component]; modules = tabs/modules present in state
  const data = await page.evaluate(async () => {
    function normColor(c) {
      if (!c) return null;
      c = String(c);
      if (
        c === "transparent" ||
        /rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\)/i.test(c)
      )
        return null;
      return c;
    }

    function rectFor(el) {
      const r = el.getBoundingClientRect();
      const cs = window.getComputedStyle(el);
      return {
        x: Math.round(r.x + window.scrollX),
        y: Math.round(r.y + window.scrollY),
        w: Math.round(r.width),
        h: Math.round(r.height),
        backgroundColor: normColor(cs.backgroundColor),
        borderColor: normColor(cs.borderColor),
        borderWidth: parseFloat(cs.borderWidth) || 0,
        borderRadius: parseFloat(cs.borderRadius) || 0,
        color: cs.color || "#d1d5db",
      };
    }

    const width = Math.max(
      document.documentElement.scrollWidth,
      document.body.scrollWidth,
      window.innerWidth
    );
    const height = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      window.innerHeight
    );

    const components = [];

    // Heuristic components detection for Projekt page
    // 1) Breadcrumb nav
    const breadcrumb = Array.from(document.querySelectorAll("nav")).find(
      (n) =>
        /Dashboard/i.test(n.textContent || "") &&
        /Project/i.test(n.textContent || "")
    );
    if (breadcrumb) {
      const r = rectFor(breadcrumb);
      components.push({
        id: "ProjectBreadcrumb",
        name: "ProjectBreadcrumb",
        ...r,
      });
    }

    // 2) Header card (first .ant-card after breadcrumb)
    const firstCard = document.querySelector(".ant-card");
    if (firstCard) {
      const r = rectFor(firstCard);
      components.push({ id: "ProjectHeader", name: "ProjectHeader", ...r });
    }

    // 3) Tabs container
    const tabs = document.querySelector(".ant-tabs");
    if (tabs) {
      const r = rectFor(tabs);
      components.push({ id: "ProjectTabs", name: "ProjectTabs", ...r });
    }

    // 4) Stage stepper card: a card containing common step labels
    const stepLabels = [
      "Przegląd",
      "Elementy",
      "Materiały",
      "Koncepcja",
      "Wycena",
      "Logistyka",
      "Zakwater.",
    ];
    const cards = Array.from(document.querySelectorAll(".ant-card"));
    const stepperCard = cards.find((c) =>
      stepLabels.some((lbl) => (c.textContent || "").includes(lbl))
    );
    if (stepperCard) {
      const r = rectFor(stepperCard);
      components.push({ id: "StageStepper", name: "StageStepper", ...r });
    }

    // 5) Overview content cards (if overview is active)
    const activeTab =
      new URLSearchParams(window.location.search).get("tab") || "overview";
    if (activeTab === "overview") {
      // pick the first row after the stepper card
      let contentContainer = null;
      if (stepperCard) {
        // find next .ant-row after stepper
        let n = stepperCard.nextElementSibling;
        while (n && !(n instanceof HTMLElement)) n = n.nextElementSibling;
        while (n && !n.classList.contains("ant-row")) n = n.nextElementSibling;
        if (n && n.classList.contains("ant-row")) contentContainer = n;
      }
      if (!contentContainer)
        contentContainer = document.querySelector(".ant-row");

      if (contentContainer) {
        const overviewCards = Array.from(
          contentContainer.querySelectorAll(":scope .ant-col .ant-card")
        );
        overviewCards.forEach((card, idx) => {
          const r = rectFor(card);
          // Try to extract a title from headings within the card
          const heading = card.querySelector(
            "h5, h4, h3, .ant-card-head-title"
          );
          const title =
            (heading?.textContent || "").trim() || `Card-${idx + 1}`;
          const safe = title
            .replace(/\s+/g, "_")
            .replace(/[^a-zA-Z0-9_-]/g, "_");
          components.push({ id: `Overview-${safe}`, name: title, ...r });
        });
      }
    }

    // 6) Comprehensive scan: AntD + custom containers
    const selectorList = [
      "[data-component]",
      ".ant-card",
      ".ant-table",
      ".ant-list",
      ".ant-descriptions",
      ".ant-steps",
      ".ant-statistic",
      ".ant-progress",
      ".ant-tabs",
      ".ant-segmented",
      ".ant-result",
      ".ant-alert",
      ".ant-form",
      ".ant-breadcrumb",
      ".ant-menu",
      ".ant-layout",
      ".ant-layout-content",
      ".ant-row",
      ".ant-col",
    ];
    const scanned = Array.from(
      document.querySelectorAll(selectorList.join(","))
    );
    scanned.forEach((el, idx) => {
      const r = rectFor(el);
      if (r.w <= 1 || r.h <= 1) return;
      const name =
        el.getAttribute("data-component") ||
        el.getAttribute("data-name") ||
        (typeof el.className === "string" &&
          (el.className.split(" ").find((c) => c.startsWith("ant-")) ||
            "ant-block")) ||
        el.tagName.toLowerCase();
      const safeId = `${name}-${idx}`.replace(/[^a-zA-Z0-9_-]/g, "_");
      components.push({ id: safeId, name, ...r });
    });

    // Deduplicate near-identical rectangles
    const seen = new Set();
    const uniqueComponents = [];
    for (const c of components) {
      const k = `${c.x}|${c.y}|${c.w}|${c.h}`;
      if (seen.has(k)) continue;
      seen.add(k);
      uniqueComponents.push(c);
    }

    // modules from tabs present
    const modules = [];
    // Only export the active tab as a module container to avoid noise
    let moduleContainer = null;
    if (activeTab === "overview") {
      // Use the main content row for overview
      moduleContainer = document.querySelector(".ant-row");
    } else {
      // Use the first large card/container below tabs for other tabs
      const probe = Array.from(
        document.body.querySelectorAll(
          ".ant-card, .ant-table, .ant-list, .ant-descriptions"
        )
      ).find((el) => (el.getBoundingClientRect().height || 0) > 100);
      moduleContainer = probe || document.querySelector(".ant-card");
    }
    if (moduleContainer) {
      const r = rectFor(moduleContainer);
      modules.push({ id: `module-${activeTab}`, name: activeTab, ...r });
    }
    // Additional module containers
    const layoutContent = document.querySelector(".ant-layout-content");
    if (layoutContent) {
      const r = rectFor(layoutContent);
      modules.push({
        id: "module-layout-content",
        name: "layout-content",
        ...r,
      });
    }
    const firstRow = document.querySelector(".ant-row");
    if (firstRow) {
      const r = rectFor(firstRow);
      modules.push({ id: "module-main-row", name: "main-row", ...r });
    }

    // Page background detection
    function getBg(el) {
      return normColor(getComputedStyle(el).backgroundColor);
    }
    const bodyBg = getBg(document.body);
    const root = document.querySelector("#root") || document.body;
    const rootBg = getBg(root);
    const content = document.querySelector(
      ".ant-layout-content, [class*='content'], main, .main-content"
    );
    const contentBg = content ? getBg(content) : null;
    const pageBg = contentBg || rootBg || bodyBg || "#1a1d21";

    // Build full DOM snapshot with styles
    async function collectStyles() {
      let css = "";
      document.querySelectorAll("style").forEach((s) => {
        css += s.textContent || "";
      });
      const links = Array.from(
        document.querySelectorAll('link[rel="stylesheet"]')
      );
      for (const link of links) {
        try {
          const resp = await fetch(link.href, { credentials: "include" });
          if (resp.ok) css += "\n" + (await resp.text());
        } catch {}
      }
      // Include CSS variables from :root
      try {
        const cs = getComputedStyle(document.documentElement);
        let vars = "";
        for (let i = 0; i < cs.length; i++) {
          const prop = cs[i];
          if (prop && prop.startsWith("--"))
            vars += prop + ":" + cs.getPropertyValue(prop) + ";";
        }
        if (vars) css += `\n:root{${vars}}`;
      } catch {}
      return `<style>${css}</style>`;
    }

    async function cloneWithAssets() {
      const clone = document.body.cloneNode(true);
      Array.from(
        clone.querySelectorAll(
          "#vite-plugin-checker-error, #vite-plugin-checker-overlay"
        )
      ).forEach((n) => n.remove());
      const canvases = Array.from(clone.querySelectorAll("canvas"));
      for (const c of canvases) {
        try {
          const dataURL = c.toDataURL();
          const img = document.createElement("img");
          img.src = dataURL;
          img.width = c.width;
          img.height = c.height;
          c.replaceWith(img);
        } catch {}
      }
      const imgs = Array.from(clone.querySelectorAll("img"));
      await Promise.all(
        imgs.map(async (img) => {
          try {
            const src = img.getAttribute("src") || "";
            const abs = new URL(src, location.href).href;
            const resp = await fetch(abs, { credentials: "include" });
            if (!resp.ok) return;
            const blob = await resp.blob();
            const reader = new FileReader();
            const dataURL = await new Promise((resolve, reject) => {
              reader.onload = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
            img.setAttribute("src", String(dataURL));
          } catch {}
        })
      );
      Array.from(clone.querySelectorAll("a[href]")).forEach((a) => {
        try {
          a.setAttribute(
            "href",
            new URL(a.getAttribute("href") || "", location.href).href
          );
        } catch {}
      });
      return clone.outerHTML;
    }

    const [styleTag, bodyHtml] = await Promise.all([
      collectStyles(),
      cloneWithAssets(),
    ]);
    const htmlFragment = `${styleTag}${bodyHtml}`;

    return {
      width,
      height,
      components: uniqueComponents,
      modules,
      pageBg,
      htmlFragment,
    };
  });

  // Optional raster background for maximum compatibility
  let rasterDataUrl = null;
  if (mode === "raster" || mode === "both") {
    const b64 = await page.screenshot({
      type: "png",
      fullPage: true,
      encoding: "base64",
    });
    rasterDataUrl = `data:image/png;base64,${b64}`;
  }

  const svg = buildSvgFromDom({ ...data, rasterDataUrl });

  const outDir = path.resolve("export-structured/svg/pages");
  await ensureDir(outDir);
  const outPath = path.resolve(
    out || path.join(outDir, `Projekt_${projectId}_${tab}.svg`)
  );
  await fs.writeFile(outPath, svg, "utf8");

  console.log(
    JSON.stringify({ ok: true, outPath, projectId, baseUrl }, null, 2)
  );
  await browser.close();
}

main().catch(async (err) => {
  console.error("Export failed:", err?.message || err);
  process.exit(1);
});
