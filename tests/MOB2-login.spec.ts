import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/loginPage';

test('User can log in and see Account page on Demo Web Shop', async ({ page }) => {
  // Test data
  const email = 'mobik@demo.com';
  const password = 'qa2025!';

  await test.step('Open home page', async () => {
    await page.goto('https://demowebshop.tricentis.com/');
    await expect(page).toHaveTitle(/Demo Web Shop/i);
    await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();
  });

  await test.step('Navigate to Login page', async () => {
    await page.getByRole('link', { name: 'Log in' }).click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: /Welcome, Please Sign In!/i })).toBeVisible();
  });

  await test.step('Fill login form & submit', async () => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(email, password);
  });

  await test.step('Verify logged-in header state', async () => {
    await expect(page.getByRole('link', { name: email })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log out' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Register' })).toBeHidden();
    await expect(page.getByRole('link', { name: 'Log in' })).toBeHidden();
  });

  await test.step('Open Account page and verify basics', async () => {
    await page.getByRole('link', { name: email }).click();
    await expect(page).toHaveURL(/\/customer\/info/i);
    await expect(page.getByLabel('Email:')).toHaveValue(email);
  });
});
