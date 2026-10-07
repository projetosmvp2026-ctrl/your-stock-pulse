import { test, expect } from "@playwright/test";

for (const path of ["/", "/login", "/app/dashboard"]) {
  test(`opens the dashboard directly from ${path}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(path);
    await expect(page).toHaveURL(/\/app\/dashboard$/);
    await expect(page.getByRole("heading", { name: "Painel", exact: true })).toBeVisible();
    await expect(page.locator('input[type="password"]')).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Entrar", exact: true })).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}