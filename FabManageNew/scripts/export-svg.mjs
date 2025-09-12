import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:3002'
const OUT_DIR = path.resolve('./svgs')

const ROUTES = [
  { path: '/', name: 'dashboard' },
  { path: '/projekty', name: 'projects' },
  { path: '/klienci', name: 'clients' },
  { path: '/projektowanie', name: 'design' },
  { path: '/cnc', name: 'cnc' },
  { path: '/magazyn', name: 'magazyn' },
  { path: '/produkcja', name: 'produkcja' },
]

async function ensureOutDir() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })
}

async function exportRouteToSVG(page, routePath, name) {
  await page.goto(`${BASE}${routePath}`, { waitUntil: 'networkidle0' })
  // Inject html-to-image library minimal bundle via CDN
  await page.addScriptTag({ url: 'https://unpkg.com/html-to-image@1.11.11/dist/html-to-image.min.js' })

  // Choose the main content node for export
  const svgDataUrl = await page.evaluate(async () => {
    const main = document.querySelector('#main-content') || document.body
    // Use html-to-image to convert DOM to SVG data URL
    // window.htmlToImage is exposed by the injected script
    const dataUrl = await window.htmlToImage.toSvg(main, { skipFonts: true })
    return dataUrl
  })

  const svg = svgDataUrl.replace(/^data:image\/svg\+xml;charset=utf-8,/, '')
  const filePath = path.join(OUT_DIR, `${name}.svg`)
  fs.writeFileSync(filePath, decodeURIComponent(svg), 'utf8')
  console.log(`[ok] Saved ${name}.svg`)
}

;(async () => {
  await ensureOutDir()
  const browser = await puppeteer.launch({ headless: 'new' })
  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 900 })
    for (const r of ROUTES) {
      await exportRouteToSVG(page, r.path, r.name)
    }
  } finally {
    await browser.close()
  }
})()


