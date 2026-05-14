const { test, expect } = require("@playwright/test");
const { credentials, hasCredentials } = require("./support/env");
const { login } = require("./support/auth");

test.describe("Admin settings", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasCredentials("E2E_ADMIN"), "Set E2E_ADMIN_USERNAME and E2E_ADMIN_PASSWORD");
    await login(page, credentials("E2E_ADMIN"));
    await page.goto("/admin/settings");
  });

  test("admin can access organization and policy tabs", async ({ page }) => {
    await expect(page.getByRole("tab", { name: /branches/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /departments/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /designations/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /shift policies/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /holidays/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /leave categories/i })).toBeVisible();
  });

  test("admin can review department and shift configuration tables", async ({ page }) => {
    await page.getByRole("tab", { name: /departments/i }).click();
    await expect(page.getByText(/departments/i)).toBeVisible();
    await expect(page.getByText(/department name/i)).toBeVisible();

    await page.getByRole("tab", { name: /shift policies/i }).click();
    await expect(page.getByText(/shift policies/i)).toBeVisible();
    await expect(page.getByText(/shift name/i)).toBeVisible();
    await expect(page.getByText(/grace/i)).toBeVisible();
  });
});
