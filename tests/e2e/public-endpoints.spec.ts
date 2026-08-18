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

test('endpoints humanos e de contato estão publicados', async ({ request }) => {
  const humans = await request.get('/humans.txt');
  expect(humans.ok()).toBeTruthy();
  expect(await humans.text()).toContain('PU2OMT / GG69CP');
  const vcard = await request.get('/marcelo.vcf');
  expect(vcard.ok()).toBeTruthy();
  const body = await vcard.text();
  expect(body).toContain('FN:Marcelo Trindade');
  expect(body).toContain('X-HAM-CALLSIGN:PU2OMT');
});

test('manifesto de mídia é JSON válido e começa sem fotos próprias obrigatórias', async ({ request }) => {
  const response = await request.get('/assets/data/media.json');
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  expect(data.profile.src).toBe('');
  expect(data.galleries.environment).toHaveLength(4);
});

test('sitemap lista áreas localizadas e o Caderno', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  expect(response.ok()).toBeTruthy();
  const body = await response.text();
  expect(body).toContain('https://devnux.com.br/pt/meio-ambiente/');
  expect(body).toContain('https://devnux.com.br/en/technology/');
  expect(body).toContain('https://devnux.com.br/es/medio-ambiente/');
  expect(body).toContain('https://devnux.com.br/pt/radio/');
  expect(body).toContain('https://devnux.com.br/en/meliponiculture/');
  expect(body).toContain('https://devnux.com.br/caderno/');
  expect(body).toContain('https://devnux.com.br/caderno/2026/por-que-este-caderno-existe/');
});
