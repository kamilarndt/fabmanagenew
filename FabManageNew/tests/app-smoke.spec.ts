import { test, expect } from '@playwright/test'

test('home loads and shows title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/FabrykaManage|FabManage|Vite/i)
})

test('navigate to Projects page via router if link exists', async ({ page }) => {
    await page.goto('/')
    const projectsLink = page.getByRole('link', { name: /Projekty|Projects/i })
    if (await projectsLink.count()) {
        await projectsLink.first().click()
        await expect(page).toHaveURL(/projekty|projects/i)
    }
})
