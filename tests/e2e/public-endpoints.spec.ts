import { test, expect } from '@playwright/test';

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

test('sitemap lista as páginas localizadas', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  expect(response.ok()).toBeTruthy();
  const body = await response.text();
  expect(body).toContain('https://devnux.com.br/pt/radio/');
  expect(body).toContain('https://devnux.com.br/en/meliponiculture/');
  expect(body).toContain('https://devnux.com.br/es/meliponicultura/');
});
