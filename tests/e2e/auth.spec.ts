import { expect, test } from '@playwright/test'

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display login form', async ({ page }) => {
    // Check if login form is visible
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible()
    
    // Check for email input
    await expect(page.locator('input[type="email"]')).toBeVisible()
    
    // Check for password input
    await expect(page.locator('input[type="password"]')).toBeVisible()
    
    // Check for login button
    await expect(page.locator('button:has-text("Zaloguj się")')).toBeVisible()
  })

  test('should show validation errors for empty form', async ({ page }) => {
    // Click login button without filling form
    await page.click('button:has-text("Zaloguj się")')
    
    // Check for validation errors
    await expect(page.locator('text=Email jest wymagany')).toBeVisible()
    await expect(page.locator('text=Hasło jest wymagane')).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    // Fill in invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    
    // Click login button
    await page.click('button:has-text("Zaloguj się")')
    
    // Check for error message
    await expect(page.locator('text=Nieprawidłowe dane logowania')).toBeVisible()
  })

  test('should login successfully with valid credentials', async ({ page }) => {
    // Fill in valid credentials (using test user)
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'testpassword')
    
    // Click login button
    await page.click('button:has-text("Zaloguj się")')
    
    // Check if redirected to dashboard
    await expect(page).toHaveURL('/dashboard')
    
    // Check if user is logged in
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible()
  })

  test('should logout successfully', async ({ page }) => {
    // First login
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'testpassword')
    await page.click('button:has-text("Zaloguj się")')
    
    // Wait for dashboard to load
    await expect(page).toHaveURL('/dashboard')
    
    // Click user menu
    await page.click('[data-testid="user-menu"]')
    
    // Click logout
    await page.click('text=Wyloguj się')
    
    // Check if redirected to login page
    await expect(page).toHaveURL('/')
    
    // Check if login form is visible again
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible()
  })

  test('should remember user session', async ({ page }) => {
    // Login
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'testpassword')
    await page.click('button:has-text("Zaloguj się")')
    
    // Wait for dashboard
    await expect(page).toHaveURL('/dashboard')
    
    // Reload page
    await page.reload()
    
    // Check if still logged in
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible()
  })

  test('should redirect to login when accessing protected route', async ({ page }) => {
    // Try to access protected route without login
    await page.goto('/dashboard')
    
    // Should be redirected to login page
    await expect(page).toHaveURL('/')
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible()
  })

  test('should show loading state during login', async ({ page }) => {
    // Fill in credentials
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'testpassword')
    
    // Click login and check for loading state
    await page.click('button:has-text("Zaloguj się")')
    
    // Check if button shows loading state
    await expect(page.locator('button:has-text("Zaloguj się")')).toBeDisabled()
    
    // Wait for login to complete
    await expect(page).toHaveURL('/dashboard')
  })
})
