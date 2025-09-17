import { test, expect } from '@playwright/test';

test.describe('Documents Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/documents');
  });

  test('should display document management page', async ({ page }) => {
    await expect(page.getByText('Document Management')).toBeVisible();
  });

  test('should switch between tabs', async ({ page }) => {
    await page.click('text=Documents');
    await expect(page.getByText('Documents')).toBeVisible();
    
    await page.click('text=Categories');
    await expect(page.getByText('Categories')).toBeVisible();
    
    await page.click('text=Templates');
    await expect(page.getByText('Templates')).toBeVisible();
  });

  test('should add new document', async ({ page }) => {
    await page.click('text=Add Document');
    await expect(page.getByText('Add Document')).toBeVisible();
  });

  test('should add new category', async ({ page }) => {
    await page.click('text=Categories');
    await page.click('text=Add Category');
    await expect(page.getByText('Add Category')).toBeVisible();
  });

  test('should add new template', async ({ page }) => {
    await page.click('text=Templates');
    await page.click('text=Add Template');
    await expect(page.getByText('Add Template')).toBeVisible();
  });

  test('should search documents', async ({ page }) => {
    await page.fill('input[placeholder="Search documents..."]', 'Project');
    await expect(page.getByText('Project Requirements')).toBeVisible();
  });

  test('should publish document', async ({ page }) => {
    await page.click('text=Publish');
    await expect(page.getByText('Document published successfully')).toBeVisible();
  });

  test('should archive document', async ({ page }) => {
    await page.click('text=Archive');
    await expect(page.getByText('Document archived successfully')).toBeVisible();
  });

  test('should duplicate document', async ({ page }) => {
    await page.click('button[title="Duplicate"]');
    await expect(page.getByText('Document duplicated successfully')).toBeVisible();
  });
});
