import { test, expect } from '@playwright/test';

test.describe('Lead Submission & Spam Defense E2E', () => {
  test('should validate and submit consultation form on /contact', async ({ page }) => {
    await page.goto('/contact');

    // Fill general inquiry form
    await page.fill('input#general-name', 'Playwright Automated Tester');
    await page.fill('input#general-phone', '9876543210');
    await page.fill('input#general-email', 'playwright.test@example.com');
    await page.fill('input#general-city', 'Lucknow');
    await page.fill('textarea#general-requirement', 'Requesting automated feasibility survey test.');

    // Wait slightly to pass fast bot check (> 800ms)
    await page.waitForTimeout(900);

    // Click submit
    await page.click('button[type="submit"]');

    // Expect success confirmation and reference ID
    await expect(page.locator('text=Requirement Submitted Successfully!')).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('text=PPAB-2026-')).toBeVisible();
  });
});
