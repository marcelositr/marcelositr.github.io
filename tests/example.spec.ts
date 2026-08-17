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

test('chave pública OpenPGP está disponível', async ({ request }) => {
  const response = await request.get('/gpg.asc');
  expect(response.ok()).toBeTruthy();
  expect(await response.text()).toContain('BEGIN PGP PUBLIC KEY BLOCK');
});

test('chave pública SSH está disponível', async ({ request }) => {
  const response = await request.get('/ssh.pub');
  expect(response.ok()).toBeTruthy();
  expect((await response.text()).trim()).toMatch(/^ssh-ed25519 /);
});

test('security.txt está publicado e tem validade', async ({ request }) => {
  const response = await request.get('/.well-known/security.txt');
  expect(response.ok()).toBeTruthy();
  const body = await response.text();
  expect(body).toContain('Contact:');
  expect(body).toContain('Expires:');
  expect(body).toContain('Encryption: https://devnux.com.br/gpg.asc');
});
