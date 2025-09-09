import { test, expect } from '@playwright/test'

test.describe('Visual smoke', () => {
    const routes = [
        { path: '/', name: 'dashboard' },
        { path: '/projekty', name: 'projects' },
        { path: '/projekt/P-001', name: 'project-P-001' },
        { path: '/magazyn', name: 'magazyn' },
        { path: '/kalendarz', name: 'kalendarz' },
        { path: '/cnc', name: 'cnc' },
        { path: '/designer', name: 'designer' },
        { path: '/zapotrzebowania', name: 'zapotrzebowania' }
    ] as const

    const viewports = [
        { w: 1440, h: 900, tag: 'xl' },
        { w: 1280, h: 800, tag: 'lg' },
        { w: 1024, h: 768, tag: 'md' },
        { w: 768, h: 1024, tag: 'sm' },
        { w: 390, h: 844, tag: 'xs' }
    ] as const

    for (const vp of viewports) {
        for (const r of routes) {
            test(`${r.name} @${vp.tag}`, async ({ page }) => {
                await page.setViewportSize({ width: vp.w, height: vp.h })
                await page.goto(r.path)
                await page.waitForLoadState('networkidle')
                await expect(page).toHaveScreenshot(`${r.name}-${vp.tag}.png`, { fullPage: true })
            })
        }
    }
})


