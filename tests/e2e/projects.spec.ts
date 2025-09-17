import { expect, test } from '@playwright/test'

test.describe('Projects Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'testpassword')
    await page.click('button:has-text("Zaloguj się")')
    await expect(page).toHaveURL('/dashboard')
  })

  test('should display projects list', async ({ page }) => {
    // Navigate to projects page
    await page.click('text=Projekty')
    await expect(page).toHaveURL('/projects')
    
    // Check if projects list is visible
    await expect(page.locator('[data-testid="projects-list"]')).toBeVisible()
    
    // Check if projects are loaded
    await expect(page.locator('[data-testid="project-card"]')).toHaveCount.greaterThan(0)
  })

  test('should create new project', async ({ page }) => {
    // Navigate to projects page
    await page.click('text=Projekty')
    await expect(page).toHaveURL('/projects')
    
    // Click create project button
    await page.click('button:has-text("Nowy projekt")')
    
    // Check if project form is visible
    await expect(page.locator('[data-testid="project-form"]')).toBeVisible()
    
    // Fill in project details
    await page.fill('input[name="name"]', 'Test Project')
    await page.fill('textarea[name="description"]', 'Test project description')
    await page.selectOption('select[name="client_id"]', 'test-client-id')
    await page.fill('input[name="budget"]', '100000')
    
    // Submit form
    await page.click('button:has-text("Utwórz projekt")')
    
    // Check if project was created
    await expect(page.locator('text=Test Project')).toBeVisible()
    
    // Check if redirected to project details
    await expect(page).toHaveURL(/\/projects\/[a-f0-9-]+/)
  })

  test('should edit existing project', async ({ page }) => {
    // Navigate to projects page
    await page.click('text=Projekty')
    await expect(page).toHaveURL('/projects')
    
    // Click on first project
    await page.click('[data-testid="project-card"]:first-child')
    
    // Wait for project details to load
    await expect(page.locator('[data-testid="project-header"]')).toBeVisible()
    
    // Click edit button
    await page.click('button:has-text("Edytuj")')
    
    // Check if edit form is visible
    await expect(page.locator('[data-testid="project-edit-form"]')).toBeVisible()
    
    // Update project name
    await page.fill('input[name="name"]', 'Updated Project Name')
    
    // Save changes
    await page.click('button:has-text("Zapisz")')
    
    // Check if project name was updated
    await expect(page.locator('text=Updated Project Name')).toBeVisible()
  })

  test('should delete project', async ({ page }) => {
    // Navigate to projects page
    await page.click('text=Projekty')
    await expect(page).toHaveURL('/projects')
    
    // Click on first project
    await page.click('[data-testid="project-card"]:first-child')
    
    // Wait for project details to load
    await expect(page.locator('[data-testid="project-header"]')).toBeVisible()
    
    // Click delete button
    await page.click('button:has-text("Usuń")')
    
    // Confirm deletion
    await page.click('button:has-text("Tak, usuń")')
    
    // Check if redirected to projects list
    await expect(page).toHaveURL('/projects')
    
    // Check if project was removed from list
    await expect(page.locator('[data-testid="project-card"]')).toHaveCount.greaterThan(0)
  })

  test('should filter projects by status', async ({ page }) => {
    // Navigate to projects page
    await page.click('text=Projekty')
    await expect(page).toHaveURL('/projects')
    
    // Check if filter is visible
    await expect(page.locator('[data-testid="status-filter"]')).toBeVisible()
    
    // Select active status filter
    await page.selectOption('[data-testid="status-filter"]', 'active')
    
    // Check if only active projects are shown
    await expect(page.locator('[data-testid="project-card"]')).toHaveCount.greaterThan(0)
    
    // Check if all visible projects have active status
    const projectCards = page.locator('[data-testid="project-card"]')
    const count = await projectCards.count()
    
    for (let i = 0; i < count; i++) {
      await expect(projectCards.nth(i).locator('[data-testid="project-status"]')).toHaveText('Aktywny')
    }
  })

  test('should search projects by name', async ({ page }) => {
    // Navigate to projects page
    await page.click('text=Projekty')
    await expect(page).toHaveURL('/projects')
    
    // Check if search input is visible
    await expect(page.locator('[data-testid="search-input"]')).toBeVisible()
    
    // Search for specific project
    await page.fill('[data-testid="search-input"]', 'Hamlet')
    
    // Check if only matching projects are shown
    await expect(page.locator('[data-testid="project-card"]')).toHaveCount.greaterThan(0)
    
    // Check if all visible projects contain search term
    const projectCards = page.locator('[data-testid="project-card"]')
    const count = await projectCards.count()
    
    for (let i = 0; i < count; i++) {
      await expect(projectCards.nth(i)).toContainText('Hamlet')
    }
  })

  test('should display project statistics', async ({ page }) => {
    // Navigate to projects page
    await page.click('text=Projekty')
    await expect(page).toHaveURL('/projects')
    
    // Check if statistics are visible
    await expect(page.locator('[data-testid="project-stats"]')).toBeVisible()
    
    // Check for specific statistics
    await expect(page.locator('[data-testid="total-projects"]')).toBeVisible()
    await expect(page.locator('[data-testid="active-projects"]')).toBeVisible()
    await expect(page.locator('[data-testid="completed-projects"]')).toBeVisible()
    await expect(page.locator('[data-testid="total-budget"]')).toBeVisible()
  })

  test('should navigate to project details', async ({ page }) => {
    // Navigate to projects page
    await page.click('text=Projekty')
    await expect(page).toHaveURL('/projects')
    
    // Click on first project
    await page.click('[data-testid="project-card"]:first-child')
    
    // Check if redirected to project details
    await expect(page).toHaveURL(/\/projects\/[a-f0-9-]+/)
    
    // Check if project details are visible
    await expect(page.locator('[data-testid="project-header"]')).toBeVisible()
    await expect(page.locator('[data-testid="project-tabs"]')).toBeVisible()
    
    // Check if project tabs are present
    await expect(page.locator('text=Ogólne')).toBeVisible()
    await expect(page.locator('text=Materiały')).toBeVisible()
    await expect(page.locator('text=Elementy')).toBeVisible()
    await expect(page.locator('text=Wycena')).toBeVisible()
  })

  test('should show project modules configuration', async ({ page }) => {
    // Navigate to projects page
    await page.click('text=Projekty')
    await expect(page).toHaveURL('/projects')
    
    // Click on first project
    await page.click('[data-testid="project-card"]:first-child')
    
    // Wait for project details to load
    await expect(page).toHaveURL(/\/projects\/[a-f0-9-]+/)
    
    // Click on General tab
    await page.click('text=Ogólne')
    
    // Check if modules configuration is visible
    await expect(page.locator('[data-testid="modules-config"]')).toBeVisible()
    
    // Check if module toggles are present
    await expect(page.locator('[data-testid="module-toggle-materials"]')).toBeVisible()
    await expect(page.locator('[data-testid="module-toggle-tiles"]')).toBeVisible()
    await expect(page.locator('[data-testid="module-toggle-pricing"]')).toBeVisible()
    await expect(page.locator('[data-testid="module-toggle-logistics"]')).toBeVisible()
  })
})
