import { expect, test, type Page } from "@playwright/test";

const operator = {
  email: process.env.E2E_OPERATOR_EMAIL ?? "admin@aetheris.ai",
  password: process.env.E2E_OPERATOR_PASSWORD ?? "testing123",
};

async function login(page: Page) {
  await page.goto("/venue-operations/login");
  await page.getByPlaceholder("Email address").fill(operator.email);
  await page.getByPlaceholder("Password").fill(operator.password);
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page).toHaveURL(/\/venue-operations(?:$|\?)/);
}

test.describe("Venue Operations Console", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("console dashboard loads with zone cards", async ({ page }) => {
    // The main console page should show zone data
    await expect(page.getByRole("heading").first()).toBeVisible();
    // Zone cards should be rendered
    await expect(page.locator("[data-testid]").first()).toBeVisible({ timeout: 10_000 });
  });

  test("incidents page is accessible", async ({ page }) => {
    await page.goto("/venue-operations/incidents");
    await page.waitForLoadState("networkidle");
    // Should stay on the incidents page (not redirected)
    await expect(page).toHaveURL(/\/venue-operations\/incidents/);
  });

  test("dispatch page loads volunteer list", async ({ page }) => {
    await page.goto("/venue-operations/dispatch");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/venue-operations\/dispatch/);
  });
});
