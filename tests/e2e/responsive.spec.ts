import { test, expect, Page } from '@playwright/test';

async function expectNoHorizontalOverflow(page: Page) {
  const diagnostics = await page.evaluate(() => {
    const limit = Math.max(document.documentElement.clientWidth, window.innerWidth) + 1;
    const offenders = Array.from(document.querySelectorAll('body *'))
      .map(element => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          className: element.className,
          text: (element.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 90),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
        };
      })
      .filter(item => item.right > limit || item.left < -1)
      .slice(0, 8);

    return {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      innerWidth: window.innerWidth,
      offenders,
    };
  });

  expect(
    diagnostics.scrollWidth,
    `Horizontal overflow at ${page.url()} (${diagnostics.innerWidth}px): ${JSON.stringify(diagnostics.offenders)}`,
  ).toBeLessThanOrEqual(Math.max(diagnostics.clientWidth, diagnostics.innerWidth) + 1);
}

test('shell responsivo troca navegação no ponto correto sem perder acessibilidade', async ({ page }) => {
  const viewports = [
    { width: 320, height: 568 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
    { width: 1366, height: 768 },
    { width: 1920, height: 1080 },
    { width: 2560, height: 1440 },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto('/pt/');
    await expectNoHorizontalOverflow(page);

    const toggle = page.locator('.nav-toggle');
    const nav = page.locator('.primary-nav');

    if (viewport.width <= 1024) {
      await expect(toggle).toBeVisible();
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(toggle).toHaveAttribute('aria-label', 'Abrir menu');
      await expect(nav).toBeHidden();

      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await expect(toggle).toHaveAttribute('aria-label', 'Fechar menu');
      await expect(nav).toBeVisible();
      await expect(nav.getByRole('link', { name: 'Acesso restrito', exact: true })).toBeVisible();
      await expectNoHorizontalOverflow(page);

      await page.keyboard.press('Escape');
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(nav).toBeHidden();
    } else {
      await expect(toggle).toBeHidden();
      await expect(nav).toBeVisible();
      await expect(page.locator('.restricted-link')).toBeVisible();
    }
  }
});

test('alvos de toque mantêm área confortável no smartphone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/pt/');

  const toggleBox = await page.locator('.nav-toggle').boundingBox();
  expect(toggleBox).not.toBeNull();
  expect(toggleBox!.width).toBeGreaterThanOrEqual(44);
  expect(toggleBox!.height).toBeGreaterThanOrEqual(44);

  for (const language of ['pt', 'en', 'es']) {
    const box = await page.locator(`.language-nav a[data-language="${language}"]`).boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
});

test('menu compacto respeita o idioma da página', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto('/en/');
  await expect(page.locator('.nav-toggle')).toHaveAttribute('aria-label', 'Open menu');
  await page.locator('.nav-toggle').click();
  await expect(page.locator('.primary-nav').getByRole('link', { name: 'Restricted access', exact: true })).toBeVisible();

  await page.goto('/es/');
  await expect(page.locator('.nav-toggle')).toHaveAttribute('aria-label', 'Abrir menú');
  await page.locator('.nav-toggle').click();
  await expect(page.locator('.primary-nav').getByRole('link', { name: 'Acceso restringido', exact: true })).toBeVisible();
});

test('páginas representativas não criam overflow em telefone, tablet ou desktop', async ({ page }) => {
  const viewports = [
    { width: 320, height: 568 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
  ];
  const paths = [
    '/pt/',
    '/pt/radio/',
    '/en/environment/',
    '/es/meliponicultura/',
    '/caderno/',
    '/caderno/2026/por-que-este-caderno-existe/',
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    for (const path of paths) {
      await page.goto(path);
      await expectNoHorizontalOverflow(page);
    }
  }
});

test('tablet usa composição intermediária para o perfil', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('/pt/');

  const layout = await page.locator('.profile-panel').evaluate(element => {
    const style = getComputedStyle(element);
    return {
      display: style.display,
      columns: style.gridTemplateColumns,
    };
  });

  expect(layout.display).toBe('grid');
  expect(layout.columns.split(' ').length).toBeGreaterThanOrEqual(2);
});
