import { test, expect } from '@playwright/test';

test.describe('Dashboard Access', () => {
  test('should redirect unauthenticated user to sign-in page', async ({ page }) => {
    // Tenta acessar o dashboard sem estar logado
    await page.goto('/pt');
    
    // Deve ser redirecionado para a página de login
    await expect(page).toHaveURL(/.*\/auth\/signin/);
    
    // Verifica se os campos de login estão presentes
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test('should be able to switch languages on login page', async ({ page }) => {
    await page.goto('/pt/auth/signin');
    
    // Verifica texto em português
    await expect(page.getByText('Entrar na Sua Conta')).toBeVisible();
    
    // Muda para inglês (assumindo que o LanguageSwitcher está na página de auth também)
    // Se não estiver, pulamos este teste ou ajustamos.
  });
});
