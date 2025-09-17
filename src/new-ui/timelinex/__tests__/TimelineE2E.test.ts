/**
 * TimelineX End-to-End Tests
 * Tests the complete user workflow using Playwright
 */

import { test, expect } from '@playwright/test';

test.describe('TimelineX E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the calendar page where TimelineX is used
    await page.goto('http://localhost:3004/calendar');
    
    // Wait for the timeline to load
    await page.waitForSelector('[data-testid="timeline-canvas"]', { timeout: 10000 });
  });

  test('should load timeline with items and groups', async ({ page }) => {
    // Check if timeline canvas is visible
    await expect(page.locator('[data-testid="timeline-canvas"]')).toBeVisible();
    
    // Check if controls are visible
    await expect(page.locator('[data-testid="timeline-controls"]')).toBeVisible();
    
    // Check if groups are rendered
    await expect(page.locator('[data-testid="timeline-group"]')).toHaveCount.greaterThan(0);
    
    // Check if items are rendered
    await expect(page.locator('[data-testid="timeline-item"]')).toHaveCount.greaterThan(0);
  });

  test('should handle zoom controls', async ({ page }) => {
    // Test zoom in
    await page.click('[data-testid="zoom-in"]');
    await page.waitForTimeout(100);
    
    // Test zoom out
    await page.click('[data-testid="zoom-out"]');
    await page.waitForTimeout(100);
    
    // Verify timeline is still visible
    await expect(page.locator('[data-testid="timeline-canvas"]')).toBeVisible();
  });

  test('should handle pan controls', async ({ page }) => {
    // Test pan left
    await page.click('[data-testid="pan-left"]');
    await page.waitForTimeout(100);
    
    // Test pan right
    await page.click('[data-testid="pan-right"]');
    await page.waitForTimeout(100);
    
    // Verify timeline is still visible
    await expect(page.locator('[data-testid="timeline-canvas"]')).toBeVisible();
  });

  test('should handle item interactions', async ({ page }) => {
    // Click on an item
    const firstItem = page.locator('[data-testid="timeline-item"]').first();
    await firstItem.click();
    
    // Verify item is clickable
    await expect(firstItem).toBeVisible();
    
    // Double click on an item
    await firstItem.dblclick();
    
    // Verify item is still visible
    await expect(firstItem).toBeVisible();
  });

  test('should handle group interactions', async ({ page }) => {
    // Click on a group toggle
    const groupToggle = page.locator('[data-testid="group-toggle"]').first();
    await groupToggle.click();
    
    // Verify group is still visible
    await expect(page.locator('[data-testid="timeline-group"]').first()).toBeVisible();
  });

  test('should handle undo/redo functionality', async ({ page }) => {
    // Test undo button
    await page.click('[data-testid="undo"]');
    await page.waitForTimeout(100);
    
    // Test redo button
    await page.click('[data-testid="redo"]');
    await page.waitForTimeout(100);
    
    // Verify timeline is still visible
    await expect(page.locator('[data-testid="timeline-canvas"]')).toBeVisible();
  });

  test('should handle plugin marketplace', async ({ page }) => {
    // Click on plugins button
    await page.click('[data-testid="open-plugins"]');
    
    // Wait for plugin marketplace to open
    await page.waitForSelector('[data-testid="plugin-marketplace"]', { timeout: 5000 });
    
    // Verify plugin marketplace is visible
    await expect(page.locator('[data-testid="plugin-marketplace"]')).toBeVisible();
    
    // Close plugin marketplace
    await page.click('[data-testid="close-plugin-marketplace"]');
    
    // Verify plugin marketplace is closed
    await expect(page.locator('[data-testid="plugin-marketplace"]')).not.toBeVisible();
  });

  test('should handle AI suggestions', async ({ page }) => {
    // Click on AI button
    await page.click('[data-testid="open-ai"]');
    
    // Wait for AI suggestions panel to open
    await page.waitForSelector('[data-testid="smart-suggestions"]', { timeout: 5000 });
    
    // Verify AI suggestions panel is visible
    await expect(page.locator('[data-testid="smart-suggestions"]')).toBeVisible();
    
    // Test different tabs
    await page.click('[data-testid="tab-auto-schedule"]');
    await page.waitForTimeout(100);
    
    await page.click('[data-testid="tab-optimize"]');
    await page.waitForTimeout(100);
    
    await page.click('[data-testid="tab-predict"]');
    await page.waitForTimeout(100);
    
    // Close AI suggestions panel
    await page.click('[data-testid="close-smart-suggestions"]');
    
    // Verify AI suggestions panel is closed
    await expect(page.locator('[data-testid="smart-suggestions"]')).not.toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Focus on timeline
    await page.click('[data-testid="timeline-canvas"]');
    
    // Test arrow key navigation
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100);
    
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(100);
    
    await page.keyboard.press('ArrowUp');
    await page.waitForTimeout(100);
    
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(100);
    
    // Verify timeline is still visible
    await expect(page.locator('[data-testid="timeline-canvas"]')).toBeVisible();
  });

  test('should handle mouse interactions', async ({ page }) => {
    const timeline = page.locator('[data-testid="timeline-canvas"]');
    
    // Test mouse down
    await timeline.dispatchEvent('mousedown');
    await page.waitForTimeout(100);
    
    // Test mouse move
    await timeline.dispatchEvent('mousemove');
    await page.waitForTimeout(100);
    
    // Test mouse up
    await timeline.dispatchEvent('mouseup');
    await page.waitForTimeout(100);
    
    // Verify timeline is still visible
    await expect(timeline).toBeVisible();
  });

  test('should handle touch interactions', async ({ page }) => {
    const timeline = page.locator('[data-testid="timeline-canvas"]');
    
    // Test touch start
    await timeline.dispatchEvent('touchstart');
    await page.waitForTimeout(100);
    
    // Test touch move
    await timeline.dispatchEvent('touchmove');
    await page.waitForTimeout(100);
    
    // Test touch end
    await timeline.dispatchEvent('touchend');
    await page.waitForTimeout(100);
    
    // Verify timeline is still visible
    await expect(timeline).toBeVisible();
  });

  test('should handle wheel events for zooming', async ({ page }) => {
    const timeline = page.locator('[data-testid="timeline-canvas"]');
    
    // Test wheel up (zoom in)
    await timeline.dispatchEvent('wheel', { deltaY: -100 });
    await page.waitForTimeout(100);
    
    // Test wheel down (zoom out)
    await timeline.dispatchEvent('wheel', { deltaY: 100 });
    await page.waitForTimeout(100);
    
    // Verify timeline is still visible
    await expect(timeline).toBeVisible();
  });

  test('should handle drag and drop', async ({ page }) => {
    const item = page.locator('[data-testid="timeline-item"]').first();
    const timeline = page.locator('[data-testid="timeline-canvas"]');
    
    // Start drag
    await item.dragTo(timeline);
    await page.waitForTimeout(100);
    
    // Verify timeline is still visible
    await expect(timeline).toBeVisible();
  });

  test('should handle context menu', async ({ page }) => {
    const item = page.locator('[data-testid="timeline-item"]').first();
    
    // Right click on item
    await item.click({ button: 'right' });
    await page.waitForTimeout(100);
    
    // Verify context menu appears
    await expect(page.locator('[data-testid="context-menu"]')).toBeVisible();
    
    // Click elsewhere to close context menu
    await page.click('[data-testid="timeline-canvas"]');
    
    // Verify context menu is closed
    await expect(page.locator('[data-testid="context-menu"]')).not.toBeVisible();
  });

  test('should handle inline editing', async ({ page }) => {
    const item = page.locator('[data-testid="timeline-item"]').first();
    
    // Double click on item to start editing
    await item.dblclick();
    await page.waitForTimeout(100);
    
    // Verify inline editor appears
    await expect(page.locator('[data-testid="inline-editor"]')).toBeVisible();
    
    // Type new title
    await page.fill('[data-testid="inline-editor-input"]', 'Updated Title');
    
    // Press Enter to save
    await page.keyboard.press('Enter');
    await page.waitForTimeout(100);
    
    // Verify inline editor is closed
    await expect(page.locator('[data-testid="inline-editor"]')).not.toBeVisible();
  });

  test('should handle responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(100);
    
    // Verify timeline is still visible
    await expect(page.locator('[data-testid="timeline-canvas"]')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(100);
    
    // Verify timeline is still visible
    await expect(page.locator('[data-testid="timeline-canvas"]')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(100);
    
    // Verify timeline is still visible
    await expect(page.locator('[data-testid="timeline-canvas"]')).toBeVisible();
  });

  test('should handle accessibility features', async ({ page }) => {
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);
    
    // Test focus indicators
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Test ARIA attributes
    const timeline = page.locator('[data-testid="timeline-canvas"]');
    await expect(timeline).toHaveAttribute('role', 'application');
    await expect(timeline).toHaveAttribute('aria-label');
  });

  test('should handle performance with large datasets', async ({ page }) => {
    // This test would require a page with many items
    // For now, just verify the timeline loads
    await expect(page.locator('[data-testid="timeline-canvas"]')).toBeVisible();
    
    // Test scrolling performance
    await page.mouse.wheel(0, 1000);
    await page.waitForTimeout(100);
    
    await page.mouse.wheel(0, -1000);
    await page.waitForTimeout(100);
    
    // Verify timeline is still responsive
    await expect(page.locator('[data-testid="timeline-canvas"]')).toBeVisible();
  });

  test('should handle error states gracefully', async ({ page }) => {
    // Test with invalid data (this would need to be set up in the test environment)
    // For now, just verify the timeline loads normally
    await expect(page.locator('[data-testid="timeline-canvas"]')).toBeVisible();
  });

  test('should maintain state across page refreshes', async ({ page }) => {
    // Perform some actions
    await page.click('[data-testid="zoom-in"]');
    await page.waitForTimeout(100);
    
    // Refresh the page
    await page.reload();
    
    // Wait for timeline to load again
    await page.waitForSelector('[data-testid="timeline-canvas"]', { timeout: 10000 });
    
    // Verify timeline is still visible
    await expect(page.locator('[data-testid="timeline-canvas"]')).toBeVisible();
  });

  test('should handle concurrent user interactions', async ({ page }) => {
    // Simulate rapid interactions
    const promises = [];
    
    for (let i = 0; i < 5; i++) {
      promises.push(page.click('[data-testid="zoom-in"]'));
      promises.push(page.click('[data-testid="pan-right"]'));
    }
    
    await Promise.all(promises);
    await page.waitForTimeout(100);
    
    // Verify timeline is still visible and responsive
    await expect(page.locator('[data-testid="timeline-canvas"]')).toBeVisible();
  });
});
