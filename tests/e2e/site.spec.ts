import { test, expect } from '@playwright/test';

test('raiz seleciona idioma do navegador', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'es-ES' });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page).toHaveURL(/\/es\/$/);
  await context.close();
});

test('versões localizadas carregam apresentação, método e identidade estruturada', async ({ page }) => {
  await page.goto('/pt/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page.getByRole('heading', { name: 'Curiosidade aplicada ao mundo real.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'O mesmo processo aparece em quase tudo.' })).toBeVisible();
  await expect(page.getByText('Ituverava · SP · Brasil', { exact: true })).toBeVisible();
  const structured = await page.locator('script[type="application/ld+json"]').textContent();
  expect(structured).toContain('PU2OMT');
  expect(structured).toContain('GG69CP');

  await page.goto('/en/');
  await expect(page.getByRole('heading', { name: 'The same process shows up in almost everything.' })).toBeVisible();
  await page.goto('/es/');
  await expect(page.getByRole('heading', { name: 'El mismo proceso aparece en casi todo.' })).toBeVisible();
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

test('troca de idioma preserva a página temática equivalente', async ({ page }) => {
  await page.goto('/pt/meio-ambiente/');
  await page.locator('.language-nav a[data-language="en"]').click();
  await expect(page).toHaveURL(/\/en\/environment\/$/);
  await page.locator('.language-nav a[data-language="es"]').click();
  await expect(page).toHaveURL(/\/es\/medio-ambiente\/$/);
});

test('menu global mantém a mesma arquitetura entre home, área e caderno', async ({ page }) => {
  const expectedPt = [
    'Início',
    'Sobre',
    'Meio ambiente',
    'Tecnologia',
    'Radioamadorismo',
    'Meliponicultura',
    'Caderno',
    'Identidade',
    'Contato'
  ];

  for (const path of ['/pt/', '/pt/radio/', '/caderno/', '/caderno/2026/por-que-este-caderno-existe/']) {
    await page.goto(path);
    await expect(page.locator('.primary-nav > a:not(.mobile-restricted-link)')).toHaveText(expectedPt);
  }
});

test('menus em inglês e espanhol usam nomes profissionais e Caderno como nome próprio', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.locator('.primary-nav > a:not(.mobile-restricted-link)')).toHaveText([
    'Home', 'About', 'Environment', 'Technology', 'Amateur radio', 'Meliponiculture', 'Caderno · PT-BR', 'Identity', 'Contact'
  ]);

  await page.goto('/es/');
  await expect(page.locator('.primary-nav > a:not(.mobile-restricted-link)')).toHaveText([
    'Inicio', 'Sobre mí', 'Medio ambiente', 'Tecnología', 'Radioafición', 'Meliponicultura', 'Caderno · PT-BR', 'Identidad', 'Contacto'
  ]);
});

test('caderno é explicitamente PT-BR e não oferece uma falsa tradução', async ({ page }) => {
  await page.goto('/caderno/');
  await expect(page.locator('.language-nav')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Caderno', exact: true })).toHaveAttribute('aria-current', 'page');
});

test('títulos seguem a hierarquia de identidade do DevNux', async ({ page }) => {
  await page.goto('/pt/');
  await expect(page).toHaveTitle('DEVNUX | Marcelo Trindade');

  await page.goto('/en/environment/');
  await expect(page).toHaveTitle('Environment | DEVNUX');

  await page.goto('/es/radio/');
  await expect(page).toHaveTitle('Radioafición | DEVNUX');

  await page.goto('/caderno/');
  await expect(page).toHaveTitle('Caderno | DEVNUX');

  await page.goto('/caderno/2026/por-que-este-caderno-existe/');
  await expect(page).toHaveTitle('Por que este caderno existe | Caderno · DEVNUX');
});

test('raiz e homes localizadas publicam metadados sociais completos e consistentes', async ({ page, request }) => {
  const brandTitle = 'DEVNUX | Marcelo Trindade';
  const previewUrl = 'https://devnux.com.br/assets/images/social-preview.png';

  const rootResponse = await request.get('/');
  expect(rootResponse.ok()).toBeTruthy();
  const rootHtml = await rootResponse.text();
  expect(rootHtml).toContain(`<title>${brandTitle}</title>`);
  expect(rootHtml).toContain(`<meta property="og:title" content="${brandTitle}">`);
  expect(rootHtml).toContain('<meta property="og:locale:alternate" content="en_US">');
  expect(rootHtml).toContain('<meta property="og:locale:alternate" content="es_ES">');
  expect(rootHtml).toContain(`<meta name="twitter:title" content="${brandTitle}">`);

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
    await expect(page.locator('meta[property="og:image:type"]')).toHaveAttribute('content', 'image/png');
    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1200');
    await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content', '630');
    await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute('content', /DevNux/);
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', home.locale);
    expect(await page.locator('meta[property="og:locale:alternate"]').evaluateAll(nodes => nodes.map(node => node.getAttribute('content')))).toEqual(home.alternates);
    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute('content', 'DevNux');
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', brandTitle);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', previewUrl);
    await expect(page.locator('meta[name="twitter:image:alt"]')).toHaveAttribute('content', /DevNux/);
  }

  const imageResponse = await request.get('/assets/images/social-preview.png');
  expect(imageResponse.ok()).toBeTruthy();
  expect((await imageResponse.body()).byteLength).toBeLessThan(1_000_000);

  const dimensions = await page.evaluate(() => new Promise<number[]>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve([image.naturalWidth, image.naturalHeight]);
    image.onerror = () => reject(new Error('social preview failed to load'));
    image.src = '/assets/images/social-preview.png';
  }));
  expect(dimensions).toEqual([1200, 630]);
});

test('footer pública é única, usa 2025 como origem e ano corrente dinâmico', async ({ page }) => {
  const currentYear = new Date().getFullYear();
  const expectedCopyright = `© 2025–${currentYear} Marcelo Trindade · devnux.com.br`;

  for (const path of ['/pt/', '/en/environment/', '/es/radio/', '/caderno/', '/caderno/2026/por-que-este-caderno-existe/']) {
    await page.goto(path);
    const footer = page.locator('.site-footer');
    await expect(footer.locator('.footer-brand strong')).toHaveText('DEVNUX');
    await expect(footer.locator('.footer-brand span')).toHaveText('Marcelo Trindade');
    await expect(footer.getByRole('link', { name: 'RSS', exact: true })).toHaveAttribute('href', '/caderno/feed.xml');
    await expect(footer.getByRole('link', { name: 'humans.txt', exact: true })).toHaveAttribute('href', '/humans.txt');
    await expect(footer.getByRole('link', { name: 'vCard', exact: true })).toHaveAttribute('href', '/marcelo.vcf');
    await expect(footer.getByRole('link', { name: 'Security', exact: true })).toHaveAttribute('href', '/.well-known/security.txt');
    await expect(footer.locator('.footer-meta')).toContainText(expectedCopyright);
  }
});

test('gateway preserva footer própria e isolada', async ({ page }) => {
  await page.goto('/gateway/');
  await expect(page.locator('.site-footer')).toHaveCount(0);
  await expect(page.locator('.gateway-footer')).toContainText('AUTHORIZED ACCESS ONLY');
});

test('acesso restrito permanece disponível', async ({ page }) => {
  await page.goto('/pt/');
  await expect(page.getByRole('link', { name: 'Acesso restrito' })).toHaveAttribute('href', '/gateway/');
});

test('quatro áreas editoriais têm páginas dedicadas', async ({ page }) => {
  await page.goto('/pt/meio-ambiente/');
  await expect(page.getByRole('heading', { name: 'Meio ambiente', exact: true })).toBeVisible();
  await page.goto('/pt/tecnologia/');
  await expect(page.getByRole('heading', { name: 'Tecnologia', exact: true })).toBeVisible();
  await page.goto('/pt/radio/');
  await expect(page.getByText('GG69CP', { exact: true })).toBeVisible();
  await page.goto('/pt/meliponicultura/');
  await expect(page.getByRole('heading', { name: 'Meliponicultura', exact: true })).toBeVisible();
});

test('caderno nasce com nota zero e RSS', async ({ page, request }) => {
  await page.goto('/caderno/');
  await expect(page.getByRole('heading', { name: 'Notas de percurso.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Por que este caderno existe' })).toBeVisible();
  await page.getByRole('link', { name: 'Por que este caderno existe' }).click();
  await expect(page.getByRole('heading', { name: 'Por que este caderno existe' })).toBeVisible();
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

test('páginas publicam alternates hreflang equivalentes', async ({ page }) => {
  await page.goto('/pt/meio-ambiente/');
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', 'https://devnux.com.br/en/environment/');
  await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute('href', 'https://devnux.com.br/es/medio-ambiente/');
});
