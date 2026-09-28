import { test, expect } from '@playwright/test';

test.describe('Error Boundary & SEO Endpoints E2E', () => {
  test('should render 404 page gracefully for unknown routes', async ({ page }) => {
    const response = await page.goto('/unknown-nonexistent-route-404');
    expect(response?.status()).toBe(404);
  });

  test('should serve robots.txt with disallow directives', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);
    const body = await response?.text();
    expect(body).toContain('Disallow: /admin/');
    expect(body).toContain('Disallow: /api/');
    expect(body).toContain('sitemap.xml');
  });

  test('should serve sitemap.xml with canonical links', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);
    const body = await response?.text();
    expect(body).toContain('pawanputraakhandbharat.com');
    expect(body).toContain('/solutions/secure');
    expect(body).toContain('/contact');
  });
});
