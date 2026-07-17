import { expect, test, type Browser, type BrowserContext, type Page } from "@playwright/test";

const volunteer = {
  email: process.env.E2E_VOLUNTEER_EMAIL ?? "vol@aetheris.ai",
  password: process.env.E2E_VOLUNTEER_PASSWORD ?? "testing123",
};

const operator = {
  email: process.env.E2E_OPERATOR_EMAIL ?? "admin@aetheris.ai",
  password: process.env.E2E_OPERATOR_PASSWORD ?? "testing123",
};

/**
 * Fan login is Google OAuth in production and cannot be automated safely with
 * credentials. Supply an authenticated Playwright storage state for the E2E
 * fan persona via E2E_FAN_STORAGE_STATE (for example, playwright/.auth/fan.json).
 */
const fanStorageState = process.env.E2E_FAN_STORAGE_STATE;

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

async function authenticatedContext(browser: Browser, storageState: string): Promise<BrowserContext> {
  return browser.newContext({ storageState });
}

test.describe.configure({ mode: "serial" });

test("volunteer report is received, resolved in operations, and fan i18n remains keyboard-accessible", async ({
  browser,
}) => {
  test.skip(!fanStorageState, "Set E2E_FAN_STORAGE_STATE to a signed-in fan storage-state file.");

  const volunteerContext = await browser.newContext();
  const operatorContext = await browser.newContext();
  const fanContext = await authenticatedContext(browser, fanStorageState!);
  const volunteerPage = await volunteerContext.newPage();
  const operatorPage = await operatorContext.newPage();
  const fanPage = await fanContext.newPage();
  const description = `E2E medical incident ${Date.now()}: attendee requires assistance.`;

  try {
    await login(volunteerPage, "/volunteer", volunteer);
    await login(operatorPage, "/venue-operations", operator);

    await expect(volunteerPage.getByRole("heading", { name: "Report New Incident" })).toBeVisible();
    const descriptionField = volunteerPage.getByLabel("Description");
    await descriptionField.fill("too short");
    await volunteerPage.getByRole("button", { name: "Submit Incident" }).click();
    await expect(volunteerPage.getByRole("alert")).toContainText("between 10 and 1,000 characters");
    await expect(descriptionField).toHaveAttribute("maxlength", "1000");

    await volunteerPage.getByLabel("Location / Zone").selectOption({ index: 1 });
    await descriptionField.fill(description);
    await volunteerPage.getByRole("button", { name: "Submit Incident" }).dblclick();
    await expect(volunteerPage.getByRole("status")).toContainText("Incident reported successfully");

    // The second page is already subscribed before submit. This assertion is
    // therefore a true realtime check, not a post-submit page reload.
    const incidentCard = operatorPage
      .getByTestId("active-incident-card")
      .filter({ hasText: description })
      .first();
    await expect(incidentCard).toBeVisible({ timeout: 15_000 });
    const resolveButton = incidentCard.getByRole("button", { name: "Dispatch & Resolve" });
    await resolveButton.click();
    await expect(incidentCard).toBeHidden();

    await fanPage.goto("/fan");
    const trigger = fanPage.getByTestId("language-switcher-trigger");
    for (let tabPresses = 0; tabPresses < 10; tabPresses += 1) {
      await fanPage.keyboard.press("Tab");
      if (await trigger.evaluate((element) => document.activeElement === element)) break;
    }
    await expect(trigger).toBeFocused();
    await fanPage.keyboard.press("Space");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await fanPage.keyboard.press("ArrowDown");
    await fanPage.keyboard.press("Enter");
    await expect(fanPage.getByRole("heading", { name: "Bienvenido al Azteca" })).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  } finally {
    await Promise.all([volunteerContext.close(), operatorContext.close(), fanContext.close()]);
  }
});
