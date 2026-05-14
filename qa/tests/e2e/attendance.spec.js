const { test, expect } = require("@playwright/test");
const { allowMutation, credentials, hasCredentials } = require("./support/env");
const { login } = require("./support/auth");

test.describe("Attendance", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasCredentials("E2E_USER"), "Set E2E_USER_USERNAME and E2E_USER_PASSWORD");
    await login(page, credentials("E2E_USER"));
  });

  test("dashboard shows attendance actions and announcements", async ({ page }) => {
    await expect(page.getByRole("button", { name: /clock in/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /clock out/i })).toBeVisible();
    await expect(page.getByText(/announcements/i)).toBeVisible();
  });

  test("attendance history route is accessible", async ({ page }) => {
    await page.goto("/user/attendance");

    await expect(page.getByText(/my attendance records/i)).toBeVisible();
    await expect(page.getByText(/date/i)).toBeVisible();
    await expect(page.getByText(/attendance status/i)).toBeVisible();
  });

  test("clock-in submits GPS attendance when mutation tests are enabled", async ({ page, context }) => {
    test.skip(!allowMutation, "Set E2E_ALLOW_MUTATION=true to execute clock-in/out mutations");

    await context.grantPermissions(["geolocation"]);
    await context.setGeolocation({ latitude: 28.6139, longitude: 77.209, accuracy: 20 });

    const clockIn = page.getByRole("button", { name: /clock in/i });
    await expect(clockIn).toBeVisible();

    if (await clockIn.isDisabled()) {
      test.skip(true, "Clock In is disabled for current attendance state");
    }

    const responsePromise = page.waitForResponse((response) => {
      return response.url().includes("/api/v1/attendance") && response.request().method() !== "GET";
    });

    await clockIn.click();
    const response = await responsePromise;
    expect(response.ok()).toBeTruthy();
  });
});
