// E2E tests for Materials Management
import { expect, test } from "@playwright/test";

test.describe("Materials Management", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to materials page
    await page.goto("/magazyn");
    await page.waitForLoadState("networkidle");
  });

  test("should display materials page with tabs", async ({ page }) => {
    // Check page title
    await expect(page.locator("h1")).toContainText("Materials Management");

    // Check tabs are present
    await expect(
      page.locator('[role="tab"]').filter({ hasText: "Materials" })
    ).toBeVisible();
    await expect(
      page.locator('[role="tab"]').filter({ hasText: "Suppliers" })
    ).toBeVisible();

    // Check add buttons
    await expect(
      page.locator("button").filter({ hasText: "Add Supplier" })
    ).toBeVisible();
    await expect(
      page.locator("button").filter({ hasText: "Add Material" })
    ).toBeVisible();
  });

  test("should add a new supplier", async ({ page }) => {
    // Click Add Supplier button
    await page.click('button:has-text("Add Supplier")');

    // Check drawer is open
    await expect(
      page.locator('[data-testid="add-supplier-drawer"]')
    ).toBeVisible();

    // Fill supplier form
    await page.fill(
      'input[placeholder*="supplier name"]',
      "Test Supplier Ltd."
    );
    await page.fill(
      "textarea",
      JSON.stringify({
        email: "test@supplier.com",
        phone: "+48 123 456 789",
        address: "123 Test St, Warsaw, Poland",
      })
    );

    // Submit form
    await page.click('button:has-text("Add Supplier")');

    // Check success message
    await expect(page.locator(".ant-message-success")).toBeVisible();

    // Check drawer is closed
    await expect(
      page.locator('[data-testid="add-supplier-drawer"]')
    ).not.toBeVisible();
  });

  test("should add a new material", async ({ page }) => {
    // Click Add Material button
    await page.click('button:has-text("Add Material")');

    // Check drawer is open
    await expect(
      page.locator('[data-testid="add-material-drawer"]')
    ).toBeVisible();

    // Fill material form
    await page.fill('input[placeholder*="material code"]', "MAT-001");
    await page.fill('input[placeholder*="material name"]', "Test Steel Beam");

    // Select category
    await page.click(".ant-select-selector");
    await page.click('.ant-select-item:has-text("Materiały konstrukcyjne")');

    // Fill price and inventory
    await page.fill('input[placeholder="0.00"]', "125.50");
    await page.fill('input[placeholder="0"]', "45");

    // Submit form
    await page.click('button:has-text("Add Material")');

    // Check success message
    await expect(page.locator(".ant-message-success")).toBeVisible();

    // Check drawer is closed
    await expect(
      page.locator('[data-testid="add-material-drawer"]')
    ).not.toBeVisible();
  });

  test("should filter materials by category", async ({ page }) => {
    // Switch to Materials tab if not already
    await page.click('[role="tab"]:has-text("Materials")');

    // Select category filter
    await page.click(".ant-select-selector");
    await page.click('.ant-select-item:has-text("Materiały konstrukcyjne")');

    // Check that filtered results are shown
    await expect(page.locator(".ant-table-tbody tr")).toHaveCount(1); // Should show only filtered results
  });

  test("should search materials", async ({ page }) => {
    // Switch to Materials tab if not already
    await page.click('[role="tab"]:has-text("Materials")');

    // Search for a material
    await page.fill('input[placeholder*="Search materials"]', "Steel");

    // Check that search results are shown
    await expect(page.locator(".ant-table-tbody tr")).toBeVisible();
  });

  test("should edit a material", async ({ page }) => {
    // Switch to Materials tab if not already
    await page.click('[role="tab"]:has-text("Materials")');

    // Wait for materials to load
    await page.waitForSelector(".ant-table-tbody tr");

    // Click edit button on first material
    await page.click(
      '.ant-table-tbody tr:first-child .ant-btn[title="Edit material"]'
    );

    // Check edit drawer is open
    await expect(
      page.locator('[data-testid="add-material-drawer"]')
    ).toBeVisible();

    // Check form is populated
    await expect(
      page.locator('input[placeholder*="material name"]')
    ).toHaveValue(/.*/);

    // Update the name
    await page.fill(
      'input[placeholder*="material name"]',
      "Updated Material Name"
    );

    // Submit form
    await page.click('button:has-text("Update Material")');

    // Check success message
    await expect(page.locator(".ant-message-success")).toBeVisible();
  });

  test("should delete a material with confirmation", async ({ page }) => {
    // Switch to Materials tab if not already
    await page.click('[role="tab"]:has-text("Materials")');

    // Wait for materials to load
    await page.waitForSelector(".ant-table-tbody tr");

    // Click delete button on first material
    await page.click(
      '.ant-table-tbody tr:first-child .ant-btn[title="Delete material"]'
    );

    // Check confirmation modal is shown
    await expect(page.locator(".ant-modal-confirm")).toBeVisible();

    // Confirm deletion
    await page.click(".ant-modal-confirm .ant-btn-dangerous");

    // Check success message
    await expect(page.locator(".ant-message-success")).toBeVisible();
  });

  test("should switch between Materials and Suppliers tabs", async ({
    page,
  }) => {
    // Start on Materials tab
    await expect(
      page.locator('[role="tab"]:has-text("Materials")')
    ).toHaveClass(/ant-tabs-tab-active/);

    // Switch to Suppliers tab
    await page.click('[role="tab"]:has-text("Suppliers")');

    // Check Suppliers tab is active
    await expect(
      page.locator('[role="tab"]:has-text("Suppliers")')
    ).toHaveClass(/ant-tabs-tab-active/);

    // Check suppliers table is visible
    await expect(
      page.locator('.ant-table-thead th:has-text("Supplier")')
    ).toBeVisible();

    // Switch back to Materials tab
    await page.click('[role="tab"]:has-text("Materials")');

    // Check Materials tab is active
    await expect(
      page.locator('[role="tab"]:has-text("Materials")')
    ).toHaveClass(/ant-tabs-tab-active/);
  });

  test("should validate required fields in material form", async ({ page }) => {
    // Click Add Material button
    await page.click('button:has-text("Add Material")');

    // Try to submit empty form
    await page.click('button:has-text("Add Material")');

    // Check validation errors
    await expect(page.locator(".ant-form-item-explain-error")).toHaveCount(3); // code, name, category
  });

  test("should validate required fields in supplier form", async ({ page }) => {
    // Click Add Supplier button
    await page.click('button:has-text("Add Supplier")');

    // Try to submit empty form
    await page.click('button:has-text("Add Supplier")');

    // Check validation errors
    await expect(page.locator(".ant-form-item-explain-error")).toHaveCount(2); // name, contact_info
  });
});
