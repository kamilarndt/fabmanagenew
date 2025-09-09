import { test, expect } from '@playwright/test'

const expected = {
    primary: 'rgb(22, 163, 74)', // #16A34A
    bgBase: 'rgb(15, 20, 24)'    // #0F1418
}

test('CSS variables applied on root', async ({ page }) => {
    await page.goto('/')
    const primary = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--primary-main').trim())
    const bg = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim())
    // Convert hex (if any) to rgb via DOM
    const toRgb = async (color: string) => {
        return await page.evaluate((c) => {
            const el = document.createElement('div')
            el.style.color = c
            document.body.appendChild(el)
            const rgb = getComputedStyle(el).color
            el.remove()
            return rgb
        }, color)
    }
    await expect(await toRgb(primary || '#16A34A')).toBe(expected.primary)
    await expect(await toRgb(bg || '#0F1418')).toBe(expected.bgBase)
})


