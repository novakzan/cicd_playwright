import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/loginPage';

test('Login, search laptop, add to cart, verify cart total', async ({ page }) => {
  const email = 'mobik@demo.com';
  const password = 'qa2025!';
  const productName = '14.1-inch Laptop';
  const priceRegex = /1590/i;

  // Homepage
  await page.goto('https://demowebshop.tricentis.com/');
  await expect(page).toHaveTitle(/Demo Web Shop/i);
  await page.getByRole('link', { name: /log in/i }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: /Welcome, Please Sign In!/i })).toBeVisible();

  // Login
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(email, password);
  
  // Verify logged-in header
  await expect(page.getByRole('link', { name: email })).toBeVisible();
  await expect(page.getByRole('link', { name: /log out/i })).toBeVisible();

  // Search for product
  await page.locator('#small-searchterms').fill('laptop');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/search/i);
  await expect(page.getByRole('heading', { name: /search/i })).toBeVisible();
  await expect(page.getByRole('link', { name: productName, exact: true })).toBeVisible();

  // Open product page & verify details
  await page.getByRole('link', { name: productName, exact: true }).click();
  await expect(page.getByRole('heading', { name: productName })).toBeVisible();
  await expect(page.locator('#product-details-form')).toContainText(priceRegex);

  // Add to cart & verify 
  await page.getByRole('button', { name: /^Add to cart$/i }).first().click();

  const addedBar = page.getByText('The product has been added to your shopping cart', { exact: false });
  await expect(addedBar).toBeVisible();

  // Click the Shopping cart link via its <span>
await page.locator('span.cart-label', { hasText: 'Shopping cart' }).click();

  // Cart page assertions
await expect(page).toHaveURL(/\/cart$/);
await expect(page.getByRole('heading', { name: /shopping cart/i })).toBeVisible();

  // Verify line item row has product name, qty 1, and unit price
  const productRow = page.locator('table').getByRole('row', { name: new RegExp(productName) });
  await expect(productRow).toBeVisible();
  await expect(productRow).toContainText(productName);
  await expect(productRow).toContainText('1590.00'); // unit price visible
  await expect(productRow.locator('input.qty-input')).toHaveValue('1');

  //delete shopping cart for testing purposes
  await page.locator('input[name="removefromcart"]').check();
  await page.getByRole('button', { name: 'Update shopping cart' }).click();
});
