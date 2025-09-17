import { test, expect } from '@playwright/test';

test.describe('Integration Tests', () => {
  test('should navigate between all pages', async ({ page }) => {
    // Navigate to Materials page
    await page.goto('/materials');
    await expect(page.getByText('Materials Management')).toBeVisible();
    
    // Navigate to Tiles page
    await page.goto('/tiles');
    await expect(page.getByText('Project Tiles')).toBeVisible();
    
    // Navigate to Pricing page
    await page.goto('/pricing');
    await expect(page.getByText('Pricing Management')).toBeVisible();
    
    // Navigate to Logistics page
    await page.goto('/logistics');
    await expect(page.getByText('Logistics Management')).toBeVisible();
    
    // Navigate to Accommodation page
    await page.goto('/accommodation');
    await expect(page.getByText('Accommodation Management')).toBeVisible();
    
    // Navigate to Files page
    await page.goto('/files');
    await expect(page.getByText('File Management')).toBeVisible();
    
    // Navigate to Concepts page
    await page.goto('/concepts');
    await expect(page.getByText('Concept Management')).toBeVisible();
    
    // Navigate to Documents page
    await page.goto('/documents');
    await expect(page.getByText('Document Management')).toBeVisible();
    
    // Navigate to Messaging page
    await page.goto('/messaging');
    await expect(page.getByText('Messages')).toBeVisible();
  });

  test('should maintain state between page navigations', async ({ page }) => {
    // Set some state on Materials page
    await page.goto('/materials');
    await page.fill('input[placeholder="Search materials..."]', 'Steel');
    
    // Navigate to another page and back
    await page.goto('/tiles');
    await page.goto('/materials');
    
    // Check that state is maintained
    await expect(page.getByDisplayValue('Steel')).toBeVisible();
  });

  test('should handle concurrent user actions', async ({ page }) => {
    await page.goto('/materials');
    
    // Simulate concurrent actions
    await Promise.all([
      page.click('text=Add Material'),
      page.fill('input[placeholder="Search materials..."]', 'Test'),
      page.click('button[title="Edit"]'),
    ]);
    
    // Check that the page is still responsive
    await expect(page.getByText('Materials Management')).toBeVisible();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate network error
    await page.route('**/api/materials', route => route.abort());
    
    await page.goto('/materials');
    
    // Check that error is handled gracefully
    await expect(page.getByText('Error loading materials')).toBeVisible();
    await expect(page.getByText('Try Again')).toBeVisible();
  });

  test('should handle slow network conditions', async ({ page }) => {
    // Simulate slow network
    await page.route('**/api/materials', route => {
      setTimeout(() => route.continue(), 2000);
    });
    
    await page.goto('/materials');
    
    // Check that loading state is shown
    await expect(page.getByText('Loading materials...')).toBeVisible();
    
    // Wait for content to load
    await page.waitForSelector('text=Materials Management', { timeout: 5000 });
  });

  test('should work offline', async ({ page }) => {
    await page.goto('/materials');
    
    // Go offline
    await page.context().setOffline(true);
    
    // Try to perform an action
    await page.click('text=Add Material');
    
    // Check that offline state is handled
    await expect(page.getByText('You are offline')).toBeVisible();
  });

  test('should handle large datasets', async ({ page }) => {
    // Mock large dataset
    await page.route('**/api/materials', route => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `Material ${i}`,
        code: `MAT-${i}`,
        category: 'steel',
        unit_price: 100 + i,
      }));
      
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(largeDataset),
      });
    });
    
    await page.goto('/materials');
    
    // Check that large dataset is handled
    await expect(page.getByText('Materials Management')).toBeVisible();
    
    // Check that pagination is working
    await expect(page.getByText('1 / 50')).toBeVisible();
  });

  test('should handle form validation errors', async ({ page }) => {
    await page.goto('/materials');
    
    // Try to submit invalid form
    await page.click('text=Add Material');
    await page.click('text=Save');
    
    // Check that validation errors are shown
    await expect(page.getByText('Please enter material name')).toBeVisible();
    await expect(page.getByText('Please enter material code')).toBeVisible();
  });

  test('should handle API rate limiting', async ({ page }) => {
    // Mock rate limiting response
    await page.route('**/api/materials', route => {
      route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Rate limit exceeded' }),
      });
    });
    
    await page.goto('/materials');
    
    // Check that rate limiting is handled
    await expect(page.getByText('Rate limit exceeded')).toBeVisible();
  });
});