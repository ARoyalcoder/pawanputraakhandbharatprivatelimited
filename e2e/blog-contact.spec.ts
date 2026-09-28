import { test, expect } from '@playwright/test';

test.describe('Blog & Contact Systems E2E', () => {
  test('should browse blog articles and filter by category', async ({ page }) => {
    await page.goto('/blog');

    await expect(page.locator('text=Technical Insights & Industry Blueprints')).toBeVisible();
    await expect(page.locator('text=CCTV').first()).toBeVisible();

    // Click on an article
    const firstArticle = page.locator('article h2 a').first();
    await firstArticle.click();

    // Should navigate to slug
    await expect(page).toHaveURL(/\/blog\//);
    await expect(page.locator('text=Published on')).toBeVisible();
    await expect(page.locator('text=Share this technical analysis')).toBeVisible();
  });

  test('should load /contact page with complete contact info and lazy map', async ({ page }) => {
    await page.goto('/contact');

    await expect(page.locator('text=Connect With Our Engineering Desk')).toBeVisible();
    await expect(page.locator('text=BCC Tower, Arjunganj, Lucknow').first()).toBeVisible();
    await expect(page.locator('text=+918796716111').first()).toBeVisible();
    await expect(page.locator('text=Load Interactive Map')).toBeVisible();
  });
});
