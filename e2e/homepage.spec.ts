import { test, expect } from '@playwright/test';

test.describe('Homepage & Navigation E2E', () => {
  test('should load homepage, display brand name, and skip link', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/Pawan Putra Akhand Bharat/i);

    // Skip to main content accessibility link
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();

    // Verify verified contact details
    await expect(page.locator('text=+918796716111').first()).toBeVisible();
    await expect(page.locator('text=BCC Tower, Arjunganj, Lucknow').first()).toBeVisible();
  });

  test('should render solution division cards on homepage', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('text=Pawan Putra Secure').first()).toBeVisible();
    await expect(page.locator('text=Pawan Putra Solar').first()).toBeVisible();
    await expect(page.locator('text=Pawan Putra Connect').first()).toBeVisible();
    await expect(page.locator('text=Pawan Putra Digital').first()).toBeVisible();
    await expect(page.locator('text=Pawan Putra Space').first()).toBeVisible();
  });
});
