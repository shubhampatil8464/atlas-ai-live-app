const { test, expect } = require('@playwright/test');

test('loads storefront and renders food cards with image descriptions', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Cravora AI/);
  await expect(page.locator('#foodGrid .foodcard')).toHaveCount(20);
  await expect(page.locator('#foodGrid img').first()).toHaveAttribute('alt', /.+/);
  await expect(page.getByText('BUILT BY ATLAS.AI')).toBeVisible();
});

test('search and cuisine filters narrow the menu and recover', async ({ page }) => {
  await page.goto('/');
  await page.locator('#search').fill('Biryani');
  await expect(page.locator('#foodGrid .foodcard')).toHaveCount(1);
  await expect(page.locator('#foodGrid')).toContainText('Hyderabadi Chicken Biryani');
  await page.locator('#search').fill('');
  await page.locator('[data-cat="Italian"]').click();
  await expect(page.locator('#foodGrid .foodcard')).toHaveCount(2);
  await page.locator('[data-cat="All"]').click();
  await expect(page.locator('#foodGrid .foodcard')).toHaveCount(20);
});

test('cart quantity controls update item count and subtotal', async ({ page }) => {
  await page.goto('/');
  await page.locator('.foodcard').filter({ hasText: 'Hyderabadi Chicken Biryani' }).getByRole('button', { name: 'Add +' }).click();
  await expect(page.locator('#cartCount')).toHaveText('1');
  await page.locator('#cartBtn').click();
  await expect(page.locator('#cartOverlay')).toBeVisible();
  await expect(page.locator('#cartItems')).toContainText('Hyderabadi Chicken Biryani');
  await expect(page.locator('#subtotal')).toHaveText('₹289');
  await page.getByRole('button', { name: '+' }).click();
  await expect(page.locator('#cartCount')).toHaveText('2');
  await expect(page.locator('#subtotal')).toHaveText('₹578');
  await page.getByRole('button', { name: '−' }).click();
  await expect(page.locator('#subtotal')).toHaveText('₹289');
});

test('checkout blocks empty cart and clearly discloses demo mode', async ({ page }) => {
  await page.goto('/');
  await page.locator('#cartBtn').click();
  await page.getByRole('button', { name: /checkout/i }).click();
  await expect(page.locator('#payResult')).toContainText('cart is empty');
  await page.locator('#cartOverlay').getByRole('button', { name: /close/i }).click().catch(() => {});
  await page.locator('.foodcard').first().getByRole('button', { name: 'Add +' }).click();
  await page.locator('#cartBtn').click();
  await page.locator('#checkoutAddress').fill('Nagpur, Maharashtra');
  await page.getByRole('button', { name: /checkout/i }).click();
  await expect(page.locator('#payResult')).toContainText('Demo only');
  await expect(page.locator('#payResult')).toContainText('No charge has been made');
});

test('chatbot responds to dietary and payment questions', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /ask cravora ai/i }).click();
  await page.locator('#chatInput').fill('What vegetarian food do you have?');
  await page.locator('#chatForm button[type="submit"]').click();
  await expect(page.locator('#chatlog')).toContainText('Paneer Tikka');
  await page.locator('#chatInput').fill('Can I pay with UPI?');
  await page.locator('#chatForm button[type="submit"]').click();
  await expect(page.locator('#chatlog')).toContainText('demo mode');
});

test('theme toggle changes palette and can be toggled back', async ({ page }) => {
  await page.goto('/');
  await page.locator('#themeBtn').click();
  await expect(page.locator('html')).toHaveAttribute('data-light', '1');
  await page.locator('#themeBtn').click();
  await expect(page.locator('html')).not.toHaveAttribute('data-light');
});

test('admin settings save social links locally and render safe links', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /admin settings/i }).click();
  await page.locator('#merchantName').fill('Cravora Test Kitchen');
  await page.locator('#igUrl').fill('https://instagram.com/example');
  await page.locator('#adminForm button[type="submit"]').click();
  await expect(page.locator('#instagramLink')).toHaveAttribute('href', 'https://instagram.com/example');
  await expect(page.locator('#instagramLink')).toHaveAttribute('rel', /noopener/);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('cravora-settings')).merchant)).toBe('Cravora Test Kitchen');
});

test('location field accepts a manually entered address', async ({ page }) => {
  await page.goto('/');
  await page.locator('#locationInput').fill('Nagpur, Maharashtra, India');
  await page.locator('#saveLocation').click();
  await expect(page.locator('#toast')).toContainText('saved for this session');
});