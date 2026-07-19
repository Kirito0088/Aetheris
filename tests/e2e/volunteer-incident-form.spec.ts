import { expect, test, type Page } from "@playwright/test";

const volunteer = {
  email: process.env.E2E_VOLUNTEER_EMAIL ?? "vol@aetheris.ai",
  password: process.env.E2E_VOLUNTEER_PASSWORD ?? "testing123",
};

async function login(page: Page) {
  await page.goto("/volunteer/login");
  await page.getByPlaceholder("Email address").fill(volunteer.email);
  await page.getByPlaceholder("Password").fill(volunteer.password);
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page).toHaveURL(/\/volunteer(?:$|\?)/);
}

test.describe("Volunteer Incident Form", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("shows validation error for too-short description", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Report New Incident" })).toBeVisible();
    const descriptionField = page.getByLabel("Description");
    await descriptionField.fill("too short");
    await page.getByRole("button", { name: "Submit Incident" }).click();
    await expect(page.getByRole("alert")).toContainText("between 10 and 1,000 characters");
  });

  test("description field enforces maxlength attribute", async ({ page }) => {
    const descriptionField = page.getByLabel("Description");
    await expect(descriptionField).toHaveAttribute("maxlength", "1000");
  });

  test("successful submission shows confirmation", async ({ page }) => {
    const description = `E2E test incident ${Date.now()}: automated form validation test.`;
    await page.getByLabel("Location / Zone").selectOption({ index: 1 });
    await page.getByLabel("Description").fill(description);
    await page.getByRole("button", { name: "Submit Incident" }).click();
    await expect(page.getByRole("status")).toContainText("Incident reported successfully");
  });
});
