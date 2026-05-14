const { test, expect } = require("@playwright/test");
const { credentials, hasCredentials } = require("./support/env");
const { login, openLogin } = require("./support/auth");

test.describe("Authentication", () => {
  test("login page is available and validates required fields", async ({ page }) => {
    await openLogin(page);

    await expect(page.getByLabel(/e mail|employee id/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();

    await page.getByRole("button", { name: /^login$/i }).click();
    await expect(page.getByText(/username and password are required/i)).toBeVisible();
  });

  test("invalid credentials keep the user on login", async ({ page }) => {
    await openLogin(page);
    await page.getByLabel(/e mail|employee id/i).fill("invalid.e2e@example.test");
    await page.getByLabel(/password/i).fill("wrong-password");
    await page.getByRole("button", { name: /^login$/i }).click();

    await expect(page.getByRole("heading", { name: /login/i })).toBeVisible();
    await expect(page).not.toHaveURL(/\/user|\/admin/);
  });

  test("employee can login and land on the dashboard", async ({ page }) => {
    test.skip(!hasCredentials("E2E_USER"), "Set E2E_USER_USERNAME and E2E_USER_PASSWORD");

    await login(page, credentials("E2E_USER"));
    await expect(page.getByText(/frequent research attendance portal/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /clock in/i })).toBeVisible();
  });
});
