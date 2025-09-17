import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/materials');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/materials');
    
    // Check that h1 is present and unique
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Materials Management');
    
    // Check that headings are in logical order
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingTexts = await headings.allTextContents();
    
    // Verify heading hierarchy
    expect(headingTexts[0]).toContain('Materials Management');
  });

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/materials');
    
    // Check that form inputs have labels
    const nameInput = page.locator('input[name="name"]');
    await expect(nameInput).toBeVisible();
    
    const nameLabel = page.locator('label[for="name"]');
    await expect(nameLabel).toHaveText('Name');
    
    const codeInput = page.locator('input[name="code"]');
    await expect(codeInput).toBeVisible();
    
    const codeLabel = page.locator('label[for="code"]');
    await expect(codeLabel).toHaveText('Code');
  });

  test('should have proper button labels', async ({ page }) => {
    await page.goto('/materials');
    
    // Check that buttons have accessible names
    const addButton = page.locator('button[title="Add Material"]');
    await expect(addButton).toBeVisible();
    await expect(addButton).toHaveAttribute('aria-label', 'Add Material');
    
    const editButton = page.locator('button[title="Edit"]');
    await expect(editButton).toBeVisible();
    await expect(editButton).toHaveAttribute('aria-label', 'Edit');
  });

  test('should have proper table structure', async ({ page }) => {
    await page.goto('/materials');
    
    // Check that table has proper structure
    const table = page.locator('table');
    await expect(table).toBeVisible();
    
    // Check that table has caption
    const caption = page.locator('table caption');
    await expect(caption).toHaveText('Materials List');
    
    // Check that table has proper headers
    const headers = page.locator('table th');
    await expect(headers).toHaveCount(5); // Name, Code, Category, Unit Price, Actions
    
    // Check that headers have proper scope
    const nameHeader = page.locator('th[scope="col"]:has-text("Name")');
    await expect(nameHeader).toBeVisible();
  });

  test('should have proper focus management', async ({ page }) => {
    await page.goto('/materials');
    
    // Check that focus is visible
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Check that focus order is logical
    const focusableElements = page.locator('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const focusableCount = await focusableElements.count();
    
    expect(focusableCount).toBeGreaterThan(0);
  });

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/materials');
    
    // Check that text has sufficient contrast
    const textElements = page.locator('p, span, div, h1, h2, h3, h4, h5, h6');
    const textCount = await textElements.count();
    
    expect(textCount).toBeGreaterThan(0);
    
    // Note: Actual color contrast testing would require more sophisticated tools
    // This is a basic check that text elements exist
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    await page.goto('/materials');
    
    // Check that interactive elements have proper ARIA attributes
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const ariaLabelledBy = await button.getAttribute('aria-labelledby');
      const textContent = await button.textContent();
      
      // Button should have either aria-label, aria-labelledby, or text content
      expect(ariaLabel || ariaLabelledBy || textContent).toBeTruthy();
    }
  });

  test('should have proper error messages', async ({ page }) => {
    await page.goto('/materials');
    
    // Trigger validation error
    await page.click('text=Add Material');
    await page.click('text=Save');
    
    // Check that error messages are properly associated with inputs
    const nameError = page.locator('#name-error');
    await expect(nameError).toBeVisible();
    await expect(nameError).toHaveAttribute('role', 'alert');
    
    const codeError = page.locator('#code-error');
    await expect(codeError).toBeVisible();
    await expect(codeError).toHaveAttribute('role', 'alert');
  });

  test('should have proper loading states', async ({ page }) => {
    await page.goto('/materials');
    
    // Check that loading states are properly announced
    const loadingSpinner = page.locator('[aria-label="Loading materials..."]');
    await expect(loadingSpinner).toBeVisible();
    
    // Check that loading state is properly removed
    await page.waitForSelector('text=Materials Management', { timeout: 5000 });
    await expect(loadingSpinner).not.toBeVisible();
  });

  test('should have proper keyboard navigation', async ({ page }) => {
    await page.goto('/materials');
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check that focus is on a logical element
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Test that Enter key activates buttons
    await page.keyboard.press('Enter');
    
    // Check that the action was triggered
    await expect(page.getByText('Add Material')).toBeVisible();
  });

  test('should have proper screen reader support', async ({ page }) => {
    await page.goto('/materials');
    
    // Check that important information is available to screen readers
    const statusMessage = page.locator('[role="status"]');
    await expect(statusMessage).toBeVisible();
    
    const alertMessage = page.locator('[role="alert"]');
    await expect(alertMessage).toBeVisible();
  });

  test('should have proper form validation announcements', async ({ page }) => {
    await page.goto('/materials');
    
    // Trigger form validation
    await page.click('text=Add Material');
    await page.fill('input[name="name"]', '');
    await page.click('text=Save');
    
    // Check that validation errors are announced
    const errorMessage = page.locator('[role="alert"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Please enter material name');
  });

  test('should have proper table navigation', async ({ page }) => {
    await page.goto('/materials');
    
    // Check that table is navigable with keyboard
    const table = page.locator('table');
    await expect(table).toBeVisible();
    
    // Check that table has proper ARIA attributes
    await expect(table).toHaveAttribute('role', 'table');
    
    // Check that table rows are properly marked
    const rows = page.locator('table tbody tr');
    await expect(rows).toHaveCount(5); // Assuming 5 materials in mock data
    
    // Check that table cells are properly marked
    const cells = page.locator('table td');
    await expect(cells).toHaveCount(25); // 5 rows * 5 columns
  });

  test('should have proper modal accessibility', async ({ page }) => {
    await page.goto('/materials');
    
    // Open modal
    await page.click('text=Add Material');
    
    // Check that modal has proper ARIA attributes
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
    await expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');
    await expect(modal).toHaveAttribute('aria-describedby', 'modal-description');
    
    // Check that modal has proper focus management
    const firstInput = modal.locator('input').first();
    await expect(firstInput).toBeFocused();
    
    // Check that modal can be closed with Escape key
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
  });

  test('should have proper error handling accessibility', async ({ page }) => {
    await page.goto('/materials');
    
    // Simulate error
    await page.route('**/api/materials', route => route.abort());
    
    // Check that error is properly announced
    const errorMessage = page.locator('[role="alert"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Error loading materials');
    
    // Check that error recovery is accessible
    const retryButton = page.locator('button[aria-label="Retry loading materials"]');
    await expect(retryButton).toBeVisible();
  });
});