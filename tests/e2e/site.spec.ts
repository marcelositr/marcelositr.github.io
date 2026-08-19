import { test, expect } from '@playwright/test';

test('raiz seleciona idioma do navegador', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'es-ES' });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page).toHaveURL(/\/es\/$/);
  await context.close();
});

test('homes localizadas assumem a arquitetura de arquivo vivo', async ({ page }) => {
  await page.goto('/pt/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page.getByRole('heading', { name: 'Curiosidade aplicada ao mundo real.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'O que está ocupando a bancada.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Assuntos como caminhos, não departamentos.' })).toBeVisible();
  await expect(page.getByText('Ituverava · SP · Brasil', { exact: true })).toBeVisible();
  const structured = await page.locator('script[type="application/ld+json"]').textContent();
  expect(structured).toContain('PU2OMT');
  expect(structured).toContain('GG69CP');

  await page.goto('/en/');
  await expect(page.getByRole('heading', { name: 'What is on the bench.' })).toBeVisible();
  await page.goto('/es/');
  await expect(page.getByRole('heading', { name: 'Lo que está sobre la mesa.' })).toBeVisible();
});

test('identidade mantém idade calculada sem expor dia', async ({ page }) => {
  await page.goto('/pt/identidade/');
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

test('troca de idioma preserva páginas equivalentes', async ({ page }) => {
  await page.goto('/pt/meio-ambiente/');
  await page.locator('.language-nav a[data-language="en"]').click();
  await expect(page).toHaveURL(/\/en\/environment\/$/);
  await page.locator('.language-nav a[data-language="es"]').click();
  await expect(page).toHaveURL(/\/es\/medio-ambiente\/$/);

  await page.goto('/pt/agora/');
  await page.locator('.language-nav a[data-language="en"]').click();
  await expect(page).toHaveURL(/\/en\/now\/$/);
  await page.locator('.language-nav a[data-language="es"]').click();
  await expect(page).toHaveURL(/\/es\/ahora\/$/);
});

test('menu global reflete a nova arquitetura', async ({ page }) => {
  const expectedPt = ['Início', 'Agora', 'Trilhas', 'Experimentos', 'Caderno', 'Arquivo', 'Identidade'];
  for (const path of ['/pt/', '/pt/radio/', '/pt/experimentos/', '/caderno/', '/caderno/2026/por-que-este-caderno-existe/']) {
    await page.goto(path);
    await expect(page.locator('.primary-nav > a:not(.mobile-restricted-link)')).toHaveText(expectedPt);
  }

  await page.goto('/en/');
  await expect(page.locator('.primary-nav > a:not(.mobile-restricted-link)')).toHaveText([
    'Home', 'Now', 'Trails', 'Experiments', 'Caderno · PT-BR', 'Archive', 'Identity'
  ]);

  await page.goto('/es/');
  await expect(page.locator('.primary-nav > a:not(.mobile-restricted-link)')).toHaveText([
    'Inicio', 'Ahora', 'Rutas', 'Experimentos', 'Caderno · PT-BR', 'Archivo', 'Identidad'
  ]);
});

test('caderno permanece explicitamente PT-BR', async ({ page }) => {
  await page.goto('/caderno/');
  await expect(page.locator('.language-nav')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Caderno', exact: true })).toHaveAttribute('aria-current', 'page');
});

test('títulos seguem a hierarquia de identidade do DevNux', async ({ page }) => {
  await page.goto('/pt/');
  await expect(page).toHaveTitle('DEVNUX | Marcelo Trindade');
  await page.goto('/pt/agora/');
  await expect(page).toHaveTitle('Agora | DEVNUX');
  await page.goto('/en/experiments/');
  await expect(page).toHaveTitle('Experiments | DEVNUX');
  await page.goto('/es/archivo/');
  await expect(page).toHaveTitle('Archivo | DEVNUX');
  await page.goto('/en/environment/');
  await expect(page).toHaveTitle('Environment | DEVNUX');
  await page.goto('/caderno/2026/por-que-este-caderno-existe/');
  await expect(page).toHaveTitle('Por que este caderno existe | Caderno · DEVNUX');
});

test('homes publicam metadados sociais e favicon versionado', async ({ page, request }) => {
  const brandTitle = 'DEVNUX | Marcelo Trindade';
  const previewUrl = 'https://devnux.com.br/assets/images/social-preview.png';
  const homes = [
    { path: '/pt/', url: 'https://devnux.com.br/pt/', locale: 'pt_BR', alternates: ['en_US', 'es_ES'] },
    { path: '/en/', url: 'https://devnux.com.br/en/', locale: 'en_US', alternates: ['pt_BR', 'es_ES'] },
    { path: '/es/', url: 'https://devnux.com.br/es/', locale: 'es_ES', alternates: ['pt_BR', 'en_US'] }
  ];

  for (const home of homes) {
    await page.goto(home.path);
    await expect(page).toHaveTitle(brandTitle);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', brandTitle);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', home.url);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', previewUrl);
    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1200');
    await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content', '630');
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', home.locale);
    expect(await page.locator('meta[property="og:locale:alternate"]').evaluateAll(nodes => nodes.map(node => node.getAttribute('content')))).toEqual(home.alternates);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    const favicon = page.locator('link[rel="icon"]');
    await expect(favicon).toHaveAttribute('type', 'image/png');
    await expect(favicon).toHaveAttribute('sizes', '256x256');
    await expect(favicon).toHaveAttribute('href', '/assets/images/favicon.png?v=2');
  }

  const faviconResponse = await request.get('/assets/images/favicon.png?v=2');
  expect(faviconResponse.ok()).toBeTruthy();
  expect((await faviconResponse.body()).byteLength).toBeLessThan(100_000);

  const imageResponse = await request.get('/assets/images/social-preview.png');
  expect(imageResponse.ok()).toBeTruthy();
  expect((await imageResponse.body()).byteLength).toBeLessThan(1_000_000);
});

test('novas páginas estruturais existem nos três idiomas', async ({ page }) => {
  const pages = [
    ['/pt/agora/', 'Agora'], ['/pt/experimentos/', 'Experimentos'], ['/pt/arquivo/', 'Arquivo'], ['/pt/identidade/', 'Identidade'],
    ['/en/now/', 'Now'], ['/en/experiments/', 'Experiments'], ['/en/archive/', 'Archive'], ['/en/identity/', 'Identity'],
    ['/es/ahora/', 'Ahora'], ['/es/experimentos/', 'Experimentos'], ['/es/archivo/', 'Archivo'], ['/es/identidad/', 'Identidad']
  ];
  for (const [path, heading] of pages) {
    await page.goto(path);
    await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
  }
});

test('footer pública usa 2025 como origem e mantém endpoints úteis', async ({ page }) => {
  const currentYear = new Date().getFullYear();
  const expectedCopyright = `© 2025–${currentYear} Marcelo Trindade · devnux.com.br`;
  for (const path of ['/pt/', '/en/environment/', '/es/archivo/', '/caderno/']) {
    await page.goto(path);
    const footer = page.locator('.site-footer');
    await expect(footer.locator('.footer-brand strong')).toHaveText('DEVNUX');
    await expect(footer.getByRole('link', { name: 'Mail', exact: true })).toHaveAttribute('href', 'mailto:marcelost@riseup.net');
    await expect(footer.getByRole('link', { name: 'RSS', exact: true })).toHaveAttribute('href', '/caderno/feed.xml');
    await expect(footer.getByRole('link', { name: 'humans.txt', exact: true })).toHaveAttribute('href', '/humans.txt');
    await expect(footer.getByRole('link', { name: 'vCard', exact: true })).toHaveAttribute('href', '/marcelo.vcf');
    await expect(footer.locator('.footer-meta')).toContainText(expectedCopyright);
  }
});

test('gateway permanece isolado', async ({ page }) => {
  await page.goto('/gateway/');
  await expect(page.locator('.site-footer')).toHaveCount(0);
  await expect(page.locator('.gateway-footer')).toContainText('AUTHORIZED ACCESS ONLY');
});

test('acesso restrito permanece disponível', async ({ page }) => {
  await page.goto('/pt/');
  await expect(page.getByRole('link', { name: 'Acesso restrito' })).toHaveAttribute('href', '/gateway/');
});

test('quatro trilhas editoriais preservam suas páginas', async ({ page }) => {
  await page.goto('/pt/meio-ambiente/');
  await expect(page.getByRole('heading', { name: 'Meio ambiente', exact: true })).toBeVisible();
  await page.goto('/pt/tecnologia/');
  await expect(page.getByRole('heading', { name: 'Tecnologia', exact: true })).toBeVisible();
  await page.goto('/pt/radio/');
  await expect(page.getByText('GG69CP', { exact: true })).toBeVisible();
  await page.goto('/pt/meliponicultura/');
  await expect(page.getByRole('heading', { name: 'Meliponicultura', exact: true })).toBeVisible();
});

test('caderno mantém nota inicial e RSS', async ({ page, request }) => {
  await page.goto('/caderno/');
  await expect(page.getByRole('heading', { name: 'Notas de percurso.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Por que este caderno existe' })).toBeVisible();
  const feed = await request.get('/caderno/feed.xml');
  expect(feed.ok()).toBeTruthy();
  expect(await feed.text()).toContain('Por que este caderno existe');
});

test('slots de imagem vazios não criam placeholders públicos', async ({ page, request }) => {
  const mediaResponse = await request.get('/assets/data/media.json');
  expect(mediaResponse.ok()).toBeTruthy();
  const media = await mediaResponse.json();
  expect(media.galleries.radio.every((item: { src: string }) => item.src === '')).toBeTruthy();
  await page.goto('/pt/radio/');
  await expect(page.locator('.media-section')).toHaveCount(0);
});

test('404 acompanha o idioma salvo', async ({ page }) => {
  await page.goto('/pt/');
  await page.evaluate(() => localStorage.setItem('devnux.language', 'en'));
  await page.goto('/404.html');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { name: 'Path not found.' })).toBeVisible();
});

test('hreflang permanece equivalente em trilhas e nova arquitetura', async ({ page }) => {
  await page.goto('/pt/meio-ambiente/');
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', 'https://devnux.com.br/en/environment/');
  await page.goto('/pt/agora/');
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', 'https://devnux.com.br/en/now/');
  await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute('href', 'https://devnux.com.br/es/ahora/');
});
