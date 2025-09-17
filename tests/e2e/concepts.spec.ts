import { test, expect } from '@playwright/test';

test.describe('Concepts Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/concepts');
  });

  test('should display concept management page', async ({ page }) => {
    await expect(page.getByText('Concept Management')).toBeVisible();
  });

  test('should add new concept', async ({ page }) => {
    await page.click('text=Add Concept');
    await expect(page.getByText('Add Concept')).toBeVisible();
  });

  test('should search concepts', async ({ page }) => {
    await page.fill('input[placeholder="Search concepts..."]', 'Design');
    await expect(page.getByText('Design Review')).toBeVisible();
  });

  test('should filter by status', async ({ page }) => {
    await page.selectOption('select', 'draft');
    await expect(page.getByText('Design Review')).toBeVisible();
  });

  test('should submit concept for approval', async ({ page }) => {
    await page.click('text=Submit');
    await expect(page.getByText('Concept submitted for approval')).toBeVisible();
  });

  test('should approve concept', async ({ page }) => {
    await page.click('text=Approve');
    await expect(page.getByText('Concept approved')).toBeVisible();
  });

  test('should reject concept', async ({ page }) => {
    await page.click('text=Reject');
    await expect(page.getByText('Concept rejected')).toBeVisible();
  });

  test('should view concept details', async ({ page }) => {
    await page.click('button[title="View"]');
    await expect(page.getByText('Concept Details')).toBeVisible();
  });
});
