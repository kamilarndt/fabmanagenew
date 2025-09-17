import { test, expect } from '@playwright/test';

test.describe('Accommodation Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/accommodation');
  });

  test('should display accommodation management page', async ({ page }) => {
    await expect(page.getByText('Accommodation Management')).toBeVisible();
  });

  test('should switch between tabs', async ({ page }) => {
    await page.click('text=Hotels');
    await expect(page.getByText('Hotels')).toBeVisible();
    
    await page.click('text=Rooms');
    await expect(page.getByText('Rooms')).toBeVisible();
    
    await page.click('text=Bookings');
    await expect(page.getByText('Bookings')).toBeVisible();
    
    await page.click('text=Search');
    await expect(page.getByText('Search Hotels')).toBeVisible();
  });

  test('should add new hotel', async ({ page }) => {
    await page.click('text=Add Hotel');
    await expect(page.getByText('Add Hotel')).toBeVisible();
  });

  test('should add new room', async ({ page }) => {
    await page.click('text=Rooms');
    await page.click('text=Add Room');
    await expect(page.getByText('Add Room')).toBeVisible();
  });

  test('should add new booking', async ({ page }) => {
    await page.click('text=Bookings');
    await page.click('text=Add Booking');
    await expect(page.getByText('Add Booking')).toBeVisible();
  });

  test('should search hotels', async ({ page }) => {
    await page.click('text=Search');
    await page.fill('input[placeholder="Enter city"]', 'Warsaw');
    await page.fill('input[placeholder="Check-in"]', '2024-01-15');
    await page.fill('input[placeholder="Check-out"]', '2024-01-20');
    await page.click('text=Search Hotels');
    await expect(page.getByText('Search completed')).toBeVisible();
  });

  test('should book hotel', async ({ page }) => {
    await page.click('text=Search');
    await page.fill('input[placeholder="Enter city"]', 'Warsaw');
    await page.fill('input[placeholder="Check-in"]', '2024-01-15');
    await page.fill('input[placeholder="Check-out"]', '2024-01-20');
    await page.click('text=Search Hotels');
    await page.click('text=Book');
    await expect(page.getByText('Booking created successfully')).toBeVisible();
  });
});
