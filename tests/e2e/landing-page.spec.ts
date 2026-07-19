import { expect, test } from '@playwright/test';

test.describe('Landing Page', () => {
  test('loads successfully with 200 status', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });

  test('has correct page title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/aetheris/i);
  });

  test('has a single h1 heading', async ({ page }) => {
    await page.goto('/');
    const h1Elements = page.locator('h1');
    // SEO best practice: exactly one h1 per page
    await expect(h1Elements).toHaveCount(1);
  });

  test('has semantic HTML structure', async ({ page }) => {
    await page.goto('/');
    // Should have a <main> element
    await expect(page.locator('main')).toBeVisible();
  });

  test('has navigation elements', async ({ page }) => {
    await page.goto('/');
    // Should have at least one navigation link or nav element
    const navElement = page.locator('nav').first();
    await expect(navElement).toBeVisible();
  });

  test('no console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    await page.goto('/');
    // Wait for page to settle
    await page.waitForLoadState('networkidle');
    // Filter out known benign errors (e.g., favicon, third-party scripts)
    const criticalErrors = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('404')
    );
    expect(criticalErrors).toHaveLength(0);
  });
});
