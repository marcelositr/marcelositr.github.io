import { test, expect } from '@playwright/test';

test('gateway inicializa sessão e processa uma tentativa', async ({ page }) => {
  await page.goto('/gateway/');
  await expect(page).toHaveTitle(/DevNux Infrastructure Gateway/);
  await expect(page.locator('.gateway-brand__name')).toHaveText('DEVNUX');
  await expect(page.getByRole('heading', { name: 'Restricted systems gateway.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Authenticate' })).toBeVisible();
  await expect(page.locator('#sessionId')).not.toHaveText('initializing');

  await page.locator('#username').fill('operator');
  await page.locator('#password').fill('credential');
  await page.locator('#loginBtn').click();

  await expect(page.locator('#statusCode')).not.toHaveText('', { timeout: 12000 });
  await expect(page.locator('#attempts')).toHaveText('1');
});

test('endpoint legado encaminha para o gateway canônico', async ({ page }) => {
  await page.goto('/login.html');
  await page.waitForURL('**/gateway/');
  await expect(page).toHaveTitle(/DevNux Infrastructure Gateway/);
});
