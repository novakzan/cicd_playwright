import { test, expect } from '@playwright/test';

test('User can register successfully on Demo Web Shop', async ({ page }) => {
  // Test data
  const firstName = 'Mobik';
  const lastName = 'Demo';
  const password = 'qa2025!';
  const randomNumber = Math.floor(Math.random() * 40000);
  const email = `mobik+${randomNumber}@example.com`; // unique per run

  await test.step('Open home page', async () => {
    await page.goto('https://demowebshop.tricentis.com/');
    await expect(page).toHaveTitle(/Demo Web Shop/i);
    await expect(page.getByRole('link', { name: 'Register' })).toBeVisible();
  });

  await test.step('Navigate to Register page', async () => {
    await page.getByRole('link', { name: 'Register' }).click();
    await expect(page).toHaveURL(/\/register$/);
    await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();
  });

  await test.step('Fill registration form', async () => {
    const maleRadio = page.getByRole('radio', { name: 'Male', exact: true });
    await maleRadio.check();
    await expect(maleRadio).toBeChecked();

    await page.getByLabel('First name:').fill(firstName);
    await page.getByLabel('Last name:').fill(lastName);
    await page.getByLabel('Email:').fill(email);
    await page.getByRole('textbox', { name: 'Password:', exact: true }).click();
    await page.getByRole('textbox', { name: 'Password:', exact: true }).fill(password);
    await page.getByRole('textbox', { name: 'Confirm password:' }).click();
    await page.getByRole('textbox', { name: 'Confirm password:' }).fill(password);

    // Basic field value assertions
    await expect(page.getByLabel('First name:')).toHaveValue(firstName);
    await expect(page.getByLabel('Last name:')).toHaveValue(lastName);
    await expect(page.getByLabel('Email:')).toHaveValue(email);
  });

  await test.step('Submit registration and verify success', async () => {
    await page.getByRole('button', { name: 'Register' }).click();

    // Success message + URL often goes to /registerresult/1
    const successMsg = page.getByText('Your registration completed', { exact: false });
    await expect(successMsg).toBeVisible();
    await expect(page).toHaveURL(/registerresult/i);

    // Continue to account area (there is usually a "Continue" button)
    const continueBtn = page.getByRole('link', { name: 'Continue' }).or(page.getByRole('button', { name: 'Continue' }));
    if (await continueBtn.isVisible()) {
      await continueBtn.click();
    }

    // Header bar should show the signed-in email and Logout link, and hide Register/Login links
    await expect(page.getByRole('link', { name: email })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log out' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Register' })).toBeHidden();
    await expect(page.getByRole('link', { name: 'Log in' })).toBeHidden();
  });

  await test.step('Open account link and verify account page basics', async () => {
    await page.getByRole('link', { name: email }).click();
    await expect(page).toHaveURL(/\/customer\/info/i);
    await expect(page.getByText(email)).toBeVisible();

    // Confirm fields are prefilled correctly
    await expect(page.getByLabel('First name:')).toHaveValue(firstName);
    await expect(page.getByLabel('Last name:')).toHaveValue(lastName);
    await expect(page.getByLabel('Email:')).toHaveValue(email);
  });
});
