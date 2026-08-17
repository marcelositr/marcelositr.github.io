import { test, expect } from '@playwright/test';

test('página principal carrega e tem título correto', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Marcelo Trindade/);
});

test('conteúdo principal permanece visível', async ({ page }) => {
  await page.goto('/');
  const sobre = page.locator('#sobre');
  await sobre.scrollIntoViewIfNeeded();
  await expect(sobre).toBeVisible();
});

test('assets principais usam a estrutura publicada', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="stylesheet"]')).toHaveAttribute('href', '/assets/styles/site.css');
  await expect(page.locator('script[src="/assets/scripts/site.js"]')).toHaveCount(1);
});
