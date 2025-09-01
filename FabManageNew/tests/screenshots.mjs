import puppeteer from 'puppeteer'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:3002'

async function shot(page, path, name, selector) {
    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle0' })
    if (selector) await page.waitForSelector(selector, { timeout: 5000 })
    await page.screenshot({ path: `./screens/${name}.png`, fullPage: true })
    console.log(`[ok] Saved ${name}.png`)
}

; (async () => {
    const browser = await puppeteer.launch({ headless: 'new' })
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 900 })
    await shot(page, '/', 'home', '.layout-navbar')
    await shot(page, '/projekty', 'projects', 'table')
    await shot(page, '/klienci', 'clients', '.card')
    await shot(page, '/projektowanie', 'design', '.card')
    await shot(page, '/cnc', 'cnc', '.card')
    await shot(page, '/magazyn', 'magazyn', '.card')
    await shot(page, '/produkcja', 'produkcja', '.progress')
    await browser.close()
})()


