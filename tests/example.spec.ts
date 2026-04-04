import { test, expect } from '@playwright/test';

test('página principal carrega e tem título correto', async ({ page }) => {
  await page.goto('https://devnux.com.br/');
  await expect(page).toHaveTitle(/Marcelo Trindade/);
});

test('seções visíveis quando rolam', async ({ page }) => {
  await page.goto('https://devnux.com.br/');
  const sobre = page.locator('#sobre');
  await sobre.scrollIntoViewIfNeeded();
  await expect(sobre).toBeVisible();
});
