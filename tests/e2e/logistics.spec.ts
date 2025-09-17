import { test, expect } from '@playwright/test';

test.describe('Logistics Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/logistics');
  });

  test('should display logistics management page', async ({ page }) => {
    await expect(page.getByText('Logistics Management')).toBeVisible();
  });

  test('should switch between tabs', async ({ page }) => {
    await page.click('text=Routes');
    await expect(page.getByText('Routes')).toBeVisible();
    
    await page.click('text=Vehicles');
    await expect(page.getByText('Vehicles')).toBeVisible();
    
    await page.click('text=Drivers');
    await expect(page.getByText('Drivers')).toBeVisible();
    
    await page.click('text=Jobs');
    await expect(page.getByText('Jobs')).toBeVisible();
  });

  test('should add new route', async ({ page }) => {
    await page.click('text=Add Route');
    await expect(page.getByText('Add Route')).toBeVisible();
  });

  test('should add new vehicle', async ({ page }) => {
    await page.click('text=Vehicles');
    await page.click('text=Add Vehicle');
    await expect(page.getByText('Add Vehicle')).toBeVisible();
  });

  test('should add new driver', async ({ page }) => {
    await page.click('text=Drivers');
    await page.click('text=Add Driver');
    await expect(page.getByText('Add Driver')).toBeVisible();
  });

  test('should add new job', async ({ page }) => {
    await page.click('text=Jobs');
    await page.click('text=Add Job');
    await expect(page.getByText('Add Job')).toBeVisible();
  });

  test('should search logistics data', async ({ page }) => {
    await page.fill('input[placeholder="Search routes..."]', 'Warsaw');
    await expect(page.getByText('Warsaw to Krakow')).toBeVisible();
  });
});
