import { expect, test } from "@playwright/test";

test.describe("Add Client Form", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the clients page
    await page.goto("/klienci");
    await page.waitForLoadState("networkidle");
  });

  test("should open Add Client drawer when clicking the button", async ({
    page,
  }) => {
    // Click the "Dodaj klienta" button
    await page.click('button:has-text("Dodaj klienta")');

    // Wait for the drawer to open
    await page.waitForSelector('[data-testid="add-client-drawer"]', {
      state: "visible",
    });

    // Verify the drawer is visible
    const drawer = page.locator('[data-testid="add-client-drawer"]');
    await expect(drawer).toBeVisible();
  });

  test("should show validation errors for required fields", async ({
    page,
  }) => {
    // Open the drawer
    await page.click('button:has-text("Dodaj klienta")');
    await page.waitForSelector('[data-testid="add-client-drawer"]');

    // Try to submit without filling required fields
    await page.click('button:has-text("Zapisz")');

    // Check for validation errors
    await expect(
      page.locator("text=Nazwa klienta jest wymagana")
    ).toBeVisible();
    await expect(page.locator("text=Email jest wymagany")).toBeVisible();
  });

  test("should successfully create a new client", async ({ page }) => {
    // Open the drawer
    await page.click('button:has-text("Dodaj klienta")');
    await page.waitForSelector('[data-testid="add-client-drawer"]');

    // Fill in the form
    await page.fill('input[name="name"]', "Test Client Company");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="phone"]', "+48 123 456 789");
    await page.fill('input[name="companyName"]', "Test Company Ltd");
    await page.fill(
      'textarea[name="address"]',
      "Test Street 123, 00-000 Warsaw"
    );
    await page.fill('textarea[name="notes"]', "Test client notes");

    // Submit the form
    await page.click('button:has-text("Zapisz")');

    // Wait for success message
    await page.waitForSelector("text=Klient został pomyślnie utworzony", {
      timeout: 5000,
    });

    // Verify the drawer is closed
    await expect(
      page.locator('[data-testid="add-client-drawer"]')
    ).not.toBeVisible();
  });

  test("should close drawer when clicking cancel", async ({ page }) => {
    // Open the drawer
    await page.click('button:has-text("Dodaj klienta")');
    await page.waitForSelector('[data-testid="add-client-drawer"]');

    // Click cancel
    await page.click('button:has-text("Anuluj")');

    // Verify the drawer is closed
    await expect(
      page.locator('[data-testid="add-client-drawer"]')
    ).not.toBeVisible();
  });

  test("should validate email format", async ({ page }) => {
    // Open the drawer
    await page.click('button:has-text("Dodaj klienta")');
    await page.waitForSelector('[data-testid="add-client-drawer"]');

    // Fill in invalid email
    await page.fill('input[name="email"]', "invalid-email");
    await page.fill('input[name="name"]', "Test Client");

    // Try to submit
    await page.click('button:has-text("Zapisz")');

    // Check for email validation error
    await expect(page.locator("text=Nieprawidłowy format email")).toBeVisible();
  });
});
