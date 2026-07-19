import { expect, test, type Page } from "@playwright/test";

const volunteer = {
  email: process.env.E2E_VOLUNTEER_EMAIL ?? "vol@aetheris.ai",
  password: process.env.E2E_VOLUNTEER_PASSWORD ?? "testing123",
};

const operator = {
  email: process.env.E2E_OPERATOR_EMAIL ?? "admin@aetheris.ai",
  password: process.env.E2E_OPERATOR_PASSWORD ?? "testing123",
};

async function login(
  page: Page,
  portal: "/volunteer" | "/venue-operations",
  credentials: { email: string; password: string },
) {
  await page.goto(`${portal}/login`);
  await page.getByPlaceholder("Email address").fill(credentials.email);
  await page.getByPlaceholder("Password").fill(credentials.password);
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page).toHaveURL(new RegExp(`${portal.replace("/", "\\/")}(?:$|\\?)`));
}

test.describe("Middleware RBAC", () => {
  test("unauthenticated user is redirected to login for protected routes", async ({ page }) => {
    // Visit /fan directly without auth — should redirect to /fan/login
    await page.goto("/fan");
    await expect(page).toHaveURL(/\/fan\/login/);

    await page.goto("/volunteer");
    await expect(page).toHaveURL(/\/volunteer\/login/);

    await page.goto("/venue-operations");
    await expect(page).toHaveURL(/\/venue-operations\/login/);
  });

  test("volunteer cannot access venue-operations portal", async ({ page }) => {
    await login(page, "/volunteer", volunteer);
    // Now try accessing a different portal
    await page.goto("/venue-operations");
    // Should be redirected — not allowed to stay
    await expect(page).not.toHaveURL(/\/venue-operations$/);
  });

  test("operator cannot access volunteer portal", async ({ page }) => {
    await login(page, "/venue-operations", operator);
    await page.goto("/volunteer");
    await expect(page).not.toHaveURL(/\/volunteer$/);
  });

  test("public routes load without auth", async ({ page }) => {
    // Marketing page and experience selector are public
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);

    const expResponse = await page.goto("/experience");
    expect(expResponse?.status()).toBe(200);
  });
});
