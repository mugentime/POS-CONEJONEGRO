const { test, expect } = require('@playwright/test');

const BASE_URL = '/';
const ADMIN_EMAIL = 'admin@conejonegro.com';
const ADMIN_PASSWORD = 'admin123';

// Test de login completo

test.use({ headless: true });
test('Login completo con usuario admin', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.waitForSelector('form#login-form', { timeout: 20000 });
  await expect(page.locator('form#login-form')).toBeVisible();

  // Rellenar el formulario de login
  await page.fill('input[name="email"]', ADMIN_EMAIL);
  await page.fill('input[name="password"]', ADMIN_PASSWORD);
  await page.click('form#login-form button[type="submit"]');

  // Esperar redirección o dashboard
  await page.waitForSelector('#dashboard, .dashboard, .main-content', { timeout: 20000 });
  // Validar que el usuario está logueado (puedes ajustar el selector según tu dashboard)
  await expect(page.locator('#dashboard, .dashboard, .main-content')).toBeVisible();
});
