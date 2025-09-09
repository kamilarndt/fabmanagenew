import { test, expect } from '@playwright/test'

test('Tiles page loads and has Add button', async ({ page }) => {
    await page.goto('/kafelki')
    await expect(page.getByRole('button', { name: 'Dodaj' })).toBeVisible()
})
