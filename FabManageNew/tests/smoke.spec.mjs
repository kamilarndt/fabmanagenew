import puppeteer from 'puppeteer'

const BASE = process.env.BASE_URL || 'http://[::1]:5173'

async function visit(page, path, selector, label) {
    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle0' })
    await page.waitForSelector(selector, { timeout: 5000 })
    console.log(`[ok] ${label}`)
}

; (async () => {
    const browser = await puppeteer.launch({ headless: 'new' })
    const page = await browser.newPage()

    await visit(page, '/', '.nav.flex-column', 'Sidebar navigation renders')
    await visit(page, '/projekty', 'table', 'Projects table renders')
    await visit(page, '/klienci', '.card', 'Clients CRM renders')
    await visit(page, '/projektowanie', '.card', 'Design Kanban renders')
    await visit(page, '/cnc', '.card', 'CNC board renders')
    await visit(page, '/magazyn', 'table', 'Magazyn table renders')
    await visit(page, '/produkcja', '.progress', 'Produkcja progress renders')

    await browser.close()
})()


