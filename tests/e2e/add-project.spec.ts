import { expect, test } from "@playwright/test";

test.describe("Add Project Form", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the projects page
    await page.goto("/projekty");
    await page.waitForLoadState("networkidle");
  });

  test("should open Add Project drawer when clicking the button", async ({
    page,
  }) => {
    // Click the "Nowy Projekt" button
    await page.click('button:has-text("Nowy Projekt")');

    // Wait for the drawer to open
    await page.waitForSelector('[data-testid="project-form"]', {
      state: "visible",
    });

    // Verify the drawer is visible
    const drawer = page.locator('[data-testid="project-form"]');
    await expect(drawer).toBeVisible();
  });

  test("should show validation errors for required fields", async ({
    page,
  }) => {
    // Open the drawer
    await page.click('button:has-text("Nowy Projekt")');
    await page.waitForSelector('[data-testid="project-form"]');

    // Try to submit without filling required fields
    await page.click('button:has-text("Zapisz")');

    // Check for validation errors
    await expect(
      page.locator("text=Nazwa projektu jest wymagana")
    ).toBeVisible();
    await expect(
      page.locator("text=Nazwa klienta jest wymagana")
    ).toBeVisible();
    await expect(page.locator("text=Termin jest wymagany")).toBeVisible();
  });

  test("should successfully create a new project", async ({ page }) => {
    // Open the drawer
    await page.click('button:has-text("Nowy Projekt")');
    await page.waitForSelector('[data-testid="project-form"]');

    // Fill in the form
    await page.fill('input[name="name"]', "Test Project");
    await page.fill('input[name="client"]', "Test Client");
    await page.fill('input[name="deadline"]', "2024-12-31");
    await page.fill('input[name="typ"]', "Konstrukcja");
    await page.fill('input[name="lokalizacja"]', "Warsaw, Poland");
    await page.fill('textarea[name="description"]', "Test project description");
    await page.fill('input[name="budget"]', "100000");

    // Select modules
    await page.click('div[role="combobox"]:has-text("Wybierz moduły")');
    await page.click('div[role="option"]:has-text("Wycena")');
    await page.click('div[role="option"]:has-text("Koncepcja")');

    // Submit the form
    await page.click('button:has-text("Zapisz")');

    // Wait for success message
    await page.waitForSelector("text=Projekt utworzony", { timeout: 5000 });

    // Verify the drawer is closed
    await expect(
      page.locator('[data-testid="project-form"]')
    ).not.toBeVisible();
  });

  test("should close drawer when clicking cancel", async ({ page }) => {
    // Open the drawer
    await page.click('button:has-text("Nowy Projekt")');
    await page.waitForSelector('[data-testid="project-form"]');

    // Click cancel
    await page.click('button:has-text("Anuluj")');

    // Verify the drawer is closed
    await expect(
      page.locator('[data-testid="project-form"]')
    ).not.toBeVisible();
  });

  test("should validate budget as positive number", async ({ page }) => {
    // Open the drawer
    await page.click('button:has-text("Nowy Projekt")');
    await page.waitForSelector('[data-testid="project-form"]');

    // Fill in negative budget
    await page.fill('input[name="budget"]', "-1000");
    await page.fill('input[name="name"]', "Test Project");
    await page.fill('input[name="client"]', "Test Client");
    await page.fill('input[name="deadline"]', "2024-12-31");

    // Try to submit
    await page.click('button:has-text("Zapisz")');

    // Check for budget validation error
    await expect(page.locator("text=Budżet nie może być ujemny")).toBeVisible();
  });

  test("should validate URL format for 3D model link", async ({ page }) => {
    // Open the drawer
    await page.click('button:has-text("Nowy Projekt")');
    await page.waitForSelector('[data-testid="project-form"]');

    // Fill in invalid URL
    await page.fill('input[name="link_model_3d"]', "invalid-url");
    await page.fill('input[name="name"]', "Test Project");
    await page.fill('input[name="client"]', "Test Client");
    await page.fill('input[name="deadline"]', "2024-12-31");

    // Try to submit
    await page.click('button:has-text("Zapisz")');

    // Check for URL validation error
    await expect(page.locator("text=Nieprawidłowy format URL")).toBeVisible();
  });
});
