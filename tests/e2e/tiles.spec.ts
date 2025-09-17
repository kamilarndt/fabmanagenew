import { test, expect } from '@playwright/test';

test.describe('Tiles Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tiles');
  });

  test('should display tiles management page', async ({ page }) => {
    await expect(page.getByText('Project Tiles')).toBeVisible();
  });

  test('should open add tile modal', async ({ page }) => {
    await page.click('text=Add Tile');
    await expect(page.getByText('Add Tile')).toBeVisible();
  });

  test('should search tiles', async ({ page }) => {
    await page.fill('input[placeholder="Search tiles..."]', 'Design');
    await expect(page.getByText('Design Review')).toBeVisible();
  });

  test('should filter tiles by status', async ({ page }) => {
    await page.selectOption('select', 'todo');
    await expect(page.getByText('Design Review')).toBeVisible();
  });

  test('should drag and drop tiles', async ({ page }) => {
    const source = page.locator('[data-testid="tile-1"]');
    const target = page.locator('[data-testid="column-in-progress"]');
    
    await source.dragTo(target);
    await expect(page.getByText('Design Review')).toBeVisible();
  });

  test('should edit tile', async ({ page }) => {
    await page.click('button[title="Edit"]');
    await expect(page.getByText('Edit Tile')).toBeVisible();
  });

  test('should delete tile', async ({ page }) => {
    await page.click('button[title="Delete"]');
    await expect(page.getByText('Are you sure you want to delete this tile?')).toBeVisible();
  });
});
