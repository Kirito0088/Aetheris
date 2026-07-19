import { expect, test } from "@playwright/test";

test.describe("Error Boundaries & Not Found", () => {
  test("404 page renders for unknown routes", async ({ page }) => {
    const response = await page.goto("/this-route-does-not-exist-12345");
    // Next.js returns 404 for unknown routes
    expect(response?.status()).toBe(404);

    // Should show the custom 404 page content
    await expect(page.getByText("Page not found")).toBeVisible();
    await expect(page.getByText("404")).toBeVisible();
  });

  test("404 page has a return link", async ({ page }) => {
    await page.goto("/nonexistent-page");
    const returnLink = page.getByRole("link", { name: /return to aetheris/i });
    await expect(returnLink).toBeVisible();
    await expect(returnLink).toHaveAttribute("href", "/");
  });

  test("404 page uses semantic HTML", async ({ page }) => {
    await page.goto("/nonexistent-page");
    // Should have a <main> element
    await expect(page.locator("main")).toBeVisible();
    // Should have a heading
    await expect(page.getByRole("heading", { name: /page not found/i })).toBeVisible();
  });

  test("login pages have accessible form structure", async ({ page }) => {
    await page.goto("/volunteer/login");
    // Should have email and password fields with proper placeholders
    await expect(page.getByPlaceholder("Email address")).toBeVisible();
    await expect(page.getByPlaceholder("Password")).toBeVisible();
    // Submit button should be present
    await expect(page.getByRole("button", { name: "Continue" })).toBeVisible();
  });
});
