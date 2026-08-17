import { test, expect } from '@playwright/test';

test('gateway inicializa sessão e processa uma tentativa sem desmontar a interface', async ({ page }) => {
  await page.goto('/gateway/');
  await expect(page).toHaveTitle(/DevNux Infrastructure Gateway/);
  await expect(page.locator('.gateway-context')).toBeVisible();
  await expect(page.locator('.login-container')).toBeVisible();
  await expect(page.locator('#sessionId')).not.toHaveText('initializing');

  const node = (await page.locator('#node').textContent())?.trim();
  expect(node).toBeTruthy();
  await expect(page.locator('#serviceNode')).toContainText(node!);

  await expect(page.locator('#loginBtnLabel')).toHaveText(/.+/);
  await expect(page.locator('#loginBtn .button-arrow')).toHaveText('→');

  await page.locator('#username').fill('operator');
  await page.locator('#password').fill('credential');
  await page.locator('#loginBtn').click();

  await expect(page.locator('#statusCode')).not.toHaveText('', { timeout: 12000 });
  await expect(page.locator('#attempts')).toHaveText('1');
  await expect(page.locator('#loginBtnLabel')).toHaveText(/.+/);
  await expect(page.locator('#loginBtn .button-arrow')).toHaveText('→');
  await expect(page.locator('#loginBtn span')).toHaveCount(2);
});

test('gateway permanece utilizável sem JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  await page.goto('/gateway/');
  await expect(page.locator('.gateway-context')).toBeVisible();
  await expect(page.locator('.login-container')).toBeVisible();
  await expect(page.locator('#loginForm')).toBeVisible();
  await expect(page.locator('#loginBtnLabel')).toHaveText('Authenticate');

  await context.close();
});

test('endpoint legado encaminha para o gateway canônico', async ({ page }) => {
  await page.goto('/login.html');
  await page.waitForURL('**/gateway/');
  await expect(page).toHaveTitle(/DevNux Infrastructure Gateway/);
});
