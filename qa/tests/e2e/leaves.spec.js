const { test, expect } = require("@playwright/test");
const { credentials, hasCredentials } = require("./support/env");
const { login } = require("./support/auth");

test.describe("Leaves", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasCredentials("E2E_USER"), "Set E2E_USER_USERNAME and E2E_USER_PASSWORD");
    await login(page, credentials("E2E_USER"));
    await page.goto("/user/leave");
  });

  test("employee can view leave list and application status", async ({ page }) => {
    await expect(page.getByText(/my leaves/i)).toBeVisible();
    await expect(page.getByText(/request date/i)).toBeVisible();
    await expect(page.getByText(/approval status/i)).toBeVisible();
  });

  test("employee can open and cancel leave application form", async ({ page }) => {
    await page.getByRole("button", { name: /apply/i }).click();

    await expect(page.getByText(/leave application form/i)).toBeVisible();
    await expect(page.getByText(/send application to/i)).toBeVisible();
    await expect(page.getByText(/leave type/i)).toBeVisible();
    await expect(page.getByPlaceholder(/give a short description/i)).toBeVisible();
    await expect(page.getByPlaceholder(/explain reason/i)).toBeVisible();

    await page.getByRole("button", { name: /cancel/i }).click();
    await expect(page.getByText(/my leaves/i)).toBeVisible();
  });
});
