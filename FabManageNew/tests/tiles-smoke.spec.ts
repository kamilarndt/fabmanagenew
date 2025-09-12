import { test, expect } from '@playwright/test'

test('Tiles page loads and shows header and actions', async ({ page }) => {
    await page.goto('/kafelki', { waitUntil: 'networkidle' })
    await expect(page.locator('text=Elementy (Kafelki)')).toBeVisible()
    // Accept either primary Add button or Refresh fallback
    const addButton = page.getByRole('button', { name: /Dodaj Nowy Kafelek|Dodaj/i })
    const refreshButton = page.getByRole('button', { name: /Odśwież/i })
    await expect(addButton.or(refreshButton)).toBeVisible()
})
