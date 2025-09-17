import { test, expect } from '@playwright/test';

test.describe('Pricing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pricing');
  });

  test('should display pricing management page', async ({ page }) => {
    await expect(page.getByText('Pricing Management')).toBeVisible();
  });

  test('should show pricing statistics', async ({ page }) => {
    await expect(page.getByText('Total Projects')).toBeVisible();
    await expect(page.getByText('Approved Projects')).toBeVisible();
    await expect(page.getByText('Total Revenue')).toBeVisible();
    await expect(page.getByText('Average Profit Margin')).toBeVisible();
  });

  test('should search pricing calculations', async ({ page }) => {
    await page.fill('input[placeholder="Search projects..."]', 'Test');
    await expect(page.getByText('Test Project')).toBeVisible();
  });

  test('should filter by status', async ({ page }) => {
    await page.selectOption('select', 'approved');
    await expect(page.getByText('Test Project')).toBeVisible();
  });

  test('should calculate project pricing', async ({ page }) => {
    await page.click('button[title="Calculate"]');
    await expect(page.getByText('Pricing calculated successfully')).toBeVisible();
  });

  test('should export pricing', async ({ page }) => {
    await page.click('button[title="Export"]');
    await expect(page.getByText('Pricing exported successfully')).toBeVisible();
  });
});
