import { test, expect } from '@playwright/test';

test.describe('Messaging Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/messaging');
  });

  test('should display messaging interface', async ({ page }) => {
    await expect(page.getByText('Messages')).toBeVisible();
  });

  test('should create new room', async ({ page }) => {
    await page.click('text=New Room');
    await expect(page.getByText('New Chat Room')).toBeVisible();
  });

  test('should search rooms', async ({ page }) => {
    await page.fill('input[placeholder="Search rooms..."]', 'Project');
    await expect(page.getByText('Project Chat')).toBeVisible();
  });

  test('should join room', async ({ page }) => {
    await page.click('text=Project Chat');
    await expect(page.getByText('Project Chat')).toBeVisible();
  });

  test('should send message', async ({ page }) => {
    await page.click('text=Project Chat');
    await page.fill('input[placeholder="Type a message..."]', 'Hello, world!');
    await page.click('text=Send');
    await expect(page.getByText('Hello, world!')).toBeVisible();
  });

  test('should add reaction to message', async ({ page }) => {
    await page.click('text=Project Chat');
    await page.click('button[title="Add reaction"]');
    await page.click('text=👍');
    await expect(page.getByText('👍 1')).toBeVisible();
  });

  test('should edit message', async ({ page }) => {
    await page.click('text=Project Chat');
    await page.click('button[title="Edit"]');
    await page.fill('input[placeholder="Edit message..."]', 'Updated message');
    await page.click('text=Save');
    await expect(page.getByText('Updated message')).toBeVisible();
  });

  test('should delete message', async ({ page }) => {
    await page.click('text=Project Chat');
    await page.click('button[title="Delete"]');
    await page.click('text=Confirm');
    await expect(page.getByText('Message deleted successfully')).toBeVisible();
  });
});
