import { test, expect } from '@playwright/test';

test('raiz seleciona idioma do navegador', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'es-ES' });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page).toHaveURL(/\/es\/$/);
  await context.close();
});

test('versões localizadas carregam identidade visual e conteúdo próprio', async ({ page }) => {
  await page.goto('/pt/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page.getByRole('heading', { name: 'Meio ambiente, tecnologia e sistemas abertos.' })).toBeVisible();
  await expect(page.locator('.brand__name')).toHaveText('DEVNUX');

  await page.goto('/en/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { name: 'Environment, technology and open systems.' })).toBeVisible();

  await page.goto('/es/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByRole('heading', { name: 'Medio ambiente, tecnología y sistemas abiertos.' })).toBeVisible();
});

test('idioma manual é persistido', async ({ page }) => {
  await page.goto('/pt/');
  await page.locator('.language-nav a[data-language="en"]').click();
  await expect(page).toHaveURL(/\/en\/$/);
  expect(await page.evaluate(() => localStorage.getItem('devnux.language'))).toBe('en');
});

test('acesso restrito permanece disponível', async ({ page }) => {
  await page.goto('/pt/');
  await expect(page.getByRole('link', { name: 'Acesso restrito' })).toHaveAttribute('href', '/gateway/');
});

test('radio e meliponicultura têm páginas dedicadas', async ({ page }) => {
  await page.goto('/pt/radio/');
  await expect(page.getByRole('heading', { name: 'Radioamadorismo', exact: true })).toBeVisible();
  await expect(page.getByText('PU2OMT', { exact: true }).first()).toBeVisible();

  await page.goto('/pt/meliponicultura/');
  await expect(page.getByRole('heading', { name: 'Meliponicultura', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Manejo responsável' })).toBeVisible();
});

test('páginas publicam alternates hreflang', async ({ page }) => {
  await page.goto('/pt/radio/');
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', 'https://devnux.com.br/en/radio/');
  await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute('href', 'https://devnux.com.br/es/radio/');
});
