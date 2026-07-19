import { expect, test, type Browser, type BrowserContext } from "@playwright/test";

const fanStorageState = process.env.E2E_FAN_STORAGE_STATE;

async function authenticatedContext(browser: Browser, storageState: string): Promise<BrowserContext> {
  return browser.newContext({ storageState });
}

test.describe("Fan Portal & Wayfinding", () => {
  test("fan portal redirects unauthenticated users to login", async ({ page }) => {
    await page.goto("/fan");
    await expect(page).toHaveURL(/\/fan\/login/);
  });

  test("fan login page renders correctly", async ({ page }) => {
    await page.goto("/fan/login");
    // Fan login uses Google OAuth, should show a Google sign-in button
    await expect(page.getByRole("button", { name: /google|sign in/i })).toBeVisible();
  });

  test("authenticated fan can access portal and see tickets", async ({ browser }) => {
    test.skip(!fanStorageState, "Set E2E_FAN_STORAGE_STATE to run authenticated fan tests.");

    const context = await authenticatedContext(browser, fanStorageState!);
    const page = await context.newPage();

    try {
      await page.goto("/fan");
      await expect(page).toHaveURL(/\/fan(?:$|\?)/);

      // Should show the fan portal with heading
      await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10_000 });
    } finally {
      await context.close();
    }
  });

  test("fan map page loads", async ({ browser }) => {
    test.skip(!fanStorageState, "Set E2E_FAN_STORAGE_STATE to run authenticated fan tests.");

    const context = await authenticatedContext(browser, fanStorageState!);
    const page = await context.newPage();

    try {
      await page.goto("/fan/map");
      await expect(page).toHaveURL(/\/fan\/map/);
      await page.waitForLoadState("networkidle");
    } finally {
      await context.close();
    }
  });
});
