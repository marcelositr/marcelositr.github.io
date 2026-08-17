import { test, expect } from '@playwright/test';

test('raiz seleciona idioma do navegador', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'es-ES' });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page).toHaveURL(/\/es\/$/);
  await context.close();
});

test('versões localizadas carregam a nova apresentação editorial', async ({ page }) => {
  await page.goto('/pt/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page.getByRole('heading', { name: 'Curiosidade aplicada ao mundo real.' })).toBeVisible();
  await expect(page.getByText('Ituverava · SP · Brasil', { exact: true })).toBeVisible();
  await expect(page.locator('.brand__name')).toHaveText('DEVNUX');

  await page.goto('/en/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { name: 'Curiosity applied to the real world.' })).toBeVisible();

  await page.goto('/es/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByRole('heading', { name: 'Curiosidad aplicada al mundo real.' })).toBeVisible();
});

test('idade é calculada a partir de mês e ano sem expor dia', async ({ page }) => {
  await page.goto('/pt/');
  const age = page.locator('[data-age]');
  await expect(age).toHaveAttribute('data-birth', '1985-12');
  await expect(age).toHaveText(/\d+ anos/);
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

test('quatro áreas editoriais têm páginas dedicadas', async ({ page }) => {
  await page.goto('/pt/meio-ambiente/');
  await expect(page.getByRole('heading', { name: 'Meio ambiente', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Sem água, nada vem depois.' })).toBeVisible();
  await page.goto('/pt/tecnologia/');
  await expect(page.getByRole('heading', { name: 'Tecnologia', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Resolver, entender, afinar.' })).toBeVisible();
  await page.goto('/pt/radio/');
  await expect(page.getByRole('heading', { name: 'Radioamadorismo', exact: true })).toBeVisible();
  await expect(page.getByText('GG69CP', { exact: true })).toBeVisible();
  await page.goto('/pt/meliponicultura/');
  await expect(page.getByRole('heading', { name: 'Meliponicultura', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Interferir só quando existe motivo.' })).toBeVisible();
});

test('páginas publicam alternates hreflang equivalentes', async ({ page }) => {
  await page.goto('/pt/meio-ambiente/');
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', 'https://devnux.com.br/en/environment/');
  await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute('href', 'https://devnux.com.br/es/medio-ambiente/');
});
