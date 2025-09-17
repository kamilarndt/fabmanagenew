import { test, expect } from '@playwright/test';

test.describe('Files Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/files');
  });

  test('should display file management page', async ({ page }) => {
    await expect(page.getByText('File Management')).toBeVisible();
  });

  test('should switch between tabs', async ({ page }) => {
    await page.click('text=Files');
    await expect(page.getByText('Files')).toBeVisible();
    
    await page.click('text=Folders');
    await expect(page.getByText('Folders')).toBeVisible();
    
    await page.click('text=Versions');
    await expect(page.getByText('Versions')).toBeVisible();
    
    await page.click('text=Shares');
    await expect(page.getByText('Shares')).toBeVisible();
  });

  test('should upload file', async ({ page }) => {
    await page.click('text=Upload File');
    await page.setInputFiles('input[type="file"]', 'test-file.txt');
    await expect(page.getByText('File uploaded successfully')).toBeVisible();
  });

  test('should create new folder', async ({ page }) => {
    await page.click('text=New Folder');
    await expect(page.getByText('Add Folder')).toBeVisible();
  });

  test('should search files', async ({ page }) => {
    await page.fill('input[placeholder="Search files..."]', 'test');
    await expect(page.getByText('test-file.txt')).toBeVisible();
  });

  test('should preview file', async ({ page }) => {
    await page.click('button[title="Preview"]');
    await expect(page.getByText('File preview')).toBeVisible();
  });

  test('should download file', async ({ page }) => {
    await page.click('button[title="Download"]');
    await expect(page.getByText('File downloaded successfully')).toBeVisible();
  });

  test('should share file', async ({ page }) => {
    await page.click('button[title="Share"]');
    await expect(page.getByText('File shared successfully')).toBeVisible();
  });
});
