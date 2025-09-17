import { test, expect } from '@playwright/test';

test.describe('Materials Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/materials');
  });

  test('should display materials management page', async ({ page }) => {
    await expect(page.getByText('Materials Management')).toBeVisible();
  });

  test('should open add material modal', async ({ page }) => {
    await page.click('text=Add Material');
    await expect(page.getByText('Add Material')).toBeVisible();
  });

  test('should search materials', async ({ page }) => {
    await page.fill('input[placeholder="Search materials..."]', 'Steel');
    await expect(page.getByText('Steel Beam')).toBeVisible();
  });

  test('should filter materials by category', async ({ page }) => {
    await page.selectOption('select', 'steel');
    await expect(page.getByText('Steel Beam')).toBeVisible();
  });

  test('should edit material', async ({ page }) => {
    await page.click('button[title="Edit"]');
    await expect(page.getByText('Edit Material')).toBeVisible();
  });

  test('should delete material', async ({ page }) => {
    await page.click('button[title="Delete"]');
    await expect(page.getByText('Are you sure you want to delete this material?')).toBeVisible();
  });
});