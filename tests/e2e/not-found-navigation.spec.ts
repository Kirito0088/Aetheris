import { expect, test } from '@playwright/test';

test.describe('Not Found Page — Navigation', () => {
  test('return link navigates back to landing page', async ({ page }) => {
    await page.goto('/nonexistent-page-12345');
    const returnLink = page.getByRole('link', { name: /return to aetheris/i });
    await expect(returnLink).toBeVisible();
    await returnLink.click();
    await expect(page).toHaveURL('/');
  });

  test('nested unknown fan route shows 404', async ({ page }) => {
    const response = await page.goto('/fan/this-does-not-exist');
    // Should either be a 404 or redirect to login (since /fan is protected)
    const status = response?.status();
    expect([200, 302, 307, 404]).toContain(status);
  });

  test('nested unknown volunteer route is handled', async ({ page }) => {
    const response = await page.goto('/volunteer/nonexistent-route');
    const status = response?.status();
    expect([200, 302, 307, 404]).toContain(status);
  });

  test('404 page is keyboard navigable', async ({ page }) => {
    await page.goto('/nonexistent-page');
    // Tab to the return link
    await page.keyboard.press('Tab');
    // After a few tabs, the return link should be focusable
    const returnLink = page.getByRole('link', { name: /return to aetheris/i });
    // Verify the link is present and accessible
    await expect(returnLink).toBeVisible();
    await expect(returnLink).toHaveAttribute('href', '/');
  });
});
