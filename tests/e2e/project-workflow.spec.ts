// E2E tests for complete project workflow
import { test, expect } from '@playwright/test'

test.describe('Project Management Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to projects page
    await page.goto('/projects')
  })

  test('should create a new project and add BOM items', async ({ page }) => {
    // Create new project
    await page.click('[data-testid="create-project-button"]')
    
    await page.fill('[data-testid="project-name-input"]', 'E2E Test Project')
    await page.selectOption('[data-testid="client-select"]', '1')
    await page.fill('[data-testid="budget-input"]', '100000')
    await page.fill('[data-testid="start-date-input"]', '2024-01-01')
    await page.fill('[data-testid="end-date-input"]', '2024-03-01')
    
    await page.click('[data-testid="create-project-submit"]')
    
    // Wait for project to be created and redirect
    await expect(page).toHaveURL(/\/projects\/\d+/)
    
    // Verify project header
    await expect(page.locator('h1')).toContainText('E2E Test Project')
    
    // Navigate to Materials tab
    await page.click('[data-testid="materials-tab"]')
    
    // Add BOM item
    await page.click('[data-testid="add-bom-item-button"]')
    
    await page.selectOption('[data-testid="material-select"]', '1')
    await page.fill('[data-testid="quantity-input"]', '5')
    await page.fill('[data-testid="unit-cost-input"]', '250')
    
    await page.click('[data-testid="add-bom-item-submit"]')
    
    // Verify BOM item was added
    await expect(page.locator('[data-testid="bom-table"]')).toContainText('Test Material')
    await expect(page.locator('[data-testid="total-cost"]')).toContainText('1 250,00 zł')
  })

  test('should add messages to project', async ({ page }) => {
    // Navigate to existing project
    await page.click('[data-testid="project-item-1"]')
    
    // Add message
    await page.fill('[data-testid="message-composer"]', 'This is a test message from E2E test')
    await page.click('[data-testid="send-message-button"]')
    
    // Verify message appears
    await expect(page.locator('[data-testid="messages-list"]')).toContainText('This is a test message from E2E test')
  })

  test('should update project status', async ({ page }) => {
    // Navigate to project
    await page.click('[data-testid="project-item-1"]')
    
    // Edit project
    await page.click('[data-testid="edit-project-button"]')
    
    await page.selectOption('[data-testid="status-select"]', 'completed')
    await page.click('[data-testid="save-project-button"]')
    
    // Verify status change
    await expect(page.locator('[data-testid="project-status"]')).toContainText('Completed')
  })

  test('should delete BOM item', async ({ page }) => {
    // Navigate to project with BOM items
    await page.click('[data-testid="project-item-1"]')
    await page.click('[data-testid="materials-tab"]')
    
    // Delete first BOM item
    await page.click('[data-testid="delete-bom-item-1"]')
    await page.click('[data-testid="confirm-delete"]')
    
    // Verify item was removed
    await expect(page.locator('[data-testid="bom-item-1"]')).not.toBeVisible()
  })

  test('should filter and search projects', async ({ page }) => {
    // Search for specific project
    await page.fill('[data-testid="project-search"]', 'Test Project')
    
    // Verify filtered results
    await expect(page.locator('[data-testid="project-item-1"]')).toBeVisible()
    
    // Clear search
    await page.fill('[data-testid="project-search"]', '')
    
    // Filter by status
    await page.selectOption('[data-testid="status-filter"]', 'active')
    
    // Verify filtered results
    const projectItems = page.locator('[data-testid^="project-item-"]')
    await expect(projectItems).toHaveCount(1)
  })

  test('should handle project creation validation', async ({ page }) => {
    // Try to create project without required fields
    await page.click('[data-testid="create-project-button"]')
    await page.click('[data-testid="create-project-submit"]')
    
    // Verify validation errors
    await expect(page.locator('[data-testid="project-name-error"]')).toContainText('Project name is required')
  })

  test('should display project statistics correctly', async ({ page }) => {
    // Navigate to project
    await page.click('[data-testid="project-item-1"]')
    
    // Check project stats
    await expect(page.locator('[data-testid="project-budget"]')).toContainText('50 000,00 zł')
    await expect(page.locator('[data-testid="project-progress"]')).toBeVisible()
    await expect(page.locator('[data-testid="bom-item-count"]')).toBeVisible()
  })
})
