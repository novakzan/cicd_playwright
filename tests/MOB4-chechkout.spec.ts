import { test, expect } from '@playwright/test';

test('Login, add laptop to cart, checkout and verify order', async ({ page }) => {
  const email = 'mobik@demo.com';
  const password = 'qa2025!';
  const productName = '14.1-inch Laptop';
  const expectedPrice = '1590.00';

  // --- Login ---
  await page.goto('https://demowebshop.tricentis.com/');
  await expect(page).toHaveTitle(/Demo Web Shop/i);
  await page.getByRole('link', { name: /log in/i }).click();
  await page.getByLabel('Email:').fill(email);
  await page.getByLabel('Password:').fill(password);
  await page.getByRole('button', { name: /log in/i }).click();
  await expect(page.getByRole('link', { name: email })).toBeVisible();

  // --- Search + Add to Cart ---
  await page.locator('#small-searchterms').fill('laptop');
  await page.keyboard.press('Enter');
  await page.getByRole('link', { name: productName, exact: true }).click();
  await expect(page.getByRole('heading', { name: productName })).toBeVisible();
  await expect(page.locator('#product-details-form')).toContainText(expectedPrice);
  await page.getByRole('button', { name: /^Add to cart$/i }).first().click();
  await expect(page.getByText('The product has been added to your shopping cart')).toBeVisible();

  // Click the Shopping cart link via its <span>
await page.locator('span.cart-label', { hasText: 'Shopping cart' }).click();

  // Cart page assertions
await expect(page).toHaveURL(/\/cart$/);
await expect(page.getByRole('heading', { name: /shopping cart/i })).toBeVisible();

  // --- Checkout ---
  await page.locator('#termsofservice').check();
  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.getByRole('heading', { name: 'Checkout' }).click();

  // Billing
  await expect(page.getByRole('heading', { name: 'Billing address' })).toBeVisible();
  await page.getByLabel('Select a billing address from').click();
  await page.getByRole('button', { name: 'Continue' }).click();

  // Shipping address
  await expect(page.getByRole('heading', { name: 'Shipping address' })).toBeVisible();
  await page.getByLabel('Select a shipping address from').click();
  await page.getByRole('button', { name: 'Continue' }).click();

  // Shipping method
  await expect(page.getByRole('heading', { name: 'Shipping method' })).toBeVisible();
  await page.getByRole('radio', { name: 'Ground (0.00)' }).check();
  await page.getByRole('button', { name: 'Continue' }).click();

  // Payment method
  await expect(page.getByRole('heading', { name: 'Payment method' })).toBeVisible();
  await page.getByRole('radio', { name: /Cash On Delivery \(COD\) \(7.00/ }).check();
  await page.getByRole('button', { name: 'Continue' }).click();

  // Payment information
  await expect(page.getByRole('heading', { name: 'Payment information' })).toBeVisible();
  await expect(page.getByText('You will pay by COD')).toBeVisible();
  await page.getByRole('button', { name: 'Continue' }).click();

// Confirm order summary (scoped, strict-safe)
await expect(page.getByRole('heading', { name: 'Confirm order' })).toBeVisible();

// Check laptop
const productCell = page.locator('td.product', { hasText: '14.1-inch Laptop' });
await expect(productCell).toBeVisible();

// quantity, unit price, shipping, total
await expect(page.getByRole('cell', { name: '1', exact: true })).toBeVisible();
const subtotalCell = page.locator('span.product-subtotal', { hasText: expectedPrice });
await expect(subtotalCell).toBeVisible();
await expect(page.getByText('7.00', { exact: true })).toBeVisible();
const orderTotal = page.locator('span.product-price.order-total');
await expect(orderTotal).toHaveText('1597.00');

// Place order
await page.getByRole('button', { name: 'Confirm' }).click();

// Thank you page
await expect(page.getByRole('heading', { name: 'Thank you' })).toBeVisible();
await expect(page.getByText('Your order has been')).toBeVisible();
await page.getByRole('button', { name: 'Continue' }).click();

// --- Verify in My Orders ---
await page.getByRole('link', { name: email }).click();
await page.getByRole('link', { name: 'Orders' }).first().click();
await page.getByRole('button', { name: 'Details' }).first().click();

});
