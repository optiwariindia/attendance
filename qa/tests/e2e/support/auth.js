const { expect } = require("@playwright/test");

async function openLogin(page) {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /login/i })).toBeVisible();
}

async function login(page, { username, password }) {
  await openLogin(page);
  await page.getByLabel(/e mail|employee id/i).fill(username);
  await page.getByLabel(/password/i).fill(password);
  await Promise.all([
    page.waitForLoadState("networkidle").catch(() => {}),
    page.getByRole("button", { name: /^login$/i }).click(),
  ]);
  await expect(page).toHaveURL(/\/user|\/admin/);
}

async function logout(page) {
  await page.getByRole("button").filter({ hasText: /./ }).last().click();
  await page.getByRole("menuitem", { name: /logout/i }).click();
  await expect(page.getByRole("heading", { name: /login/i })).toBeVisible();
}

module.exports = {
  login,
  logout,
  openLogin,
};
