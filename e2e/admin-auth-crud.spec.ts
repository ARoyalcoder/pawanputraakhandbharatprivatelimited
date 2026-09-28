import { test, expect } from '@playwright/test';

test.describe('Admin Authentication & Lead CRUD E2E', () => {
  test('should login to admin console and view dashboard metrics', async ({ page }) => {
    await page.goto('/admin/login');

    // Click Sign In (prefilled credentials)
    await page.click('button[type="submit"]');

    // Should navigate to /admin dashboard
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.locator('text=Executive Operations Dashboard')).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('text=Total Inquiries')).toBeVisible();

    // Navigate to Leads Pipeline
    await page.click('a[href="/admin/leads"]');
    await expect(page).toHaveURL(/\/admin\/leads/);
    await expect(page.locator('text=Leads Pipeline & Engineering Inquiries')).toBeVisible();
  });
});
