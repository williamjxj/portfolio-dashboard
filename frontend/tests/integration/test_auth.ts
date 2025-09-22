import { test, expect } from '@playwright/test';

test.describe('Authentication Handling', () => {
  test('should handle websites requiring authentication', async ({ page }) => {
    // Mock a website that requires authentication
    await page.route('/api/websites', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'protected-site',
            name: 'Protected Site',
            url: 'https://protected-site.com',
            description: 'A website that requires authentication to access.',
            screenshot: '/assets/screenshots/protected-site.png',
            logo: '/assets/logos/protected-site.svg',
            favicon: '/assets/favicons/protected-site.ico',
            requiresAuth: true,
            authCredentials: {
              method: 'email',
              username: 'test@example.com',
              password: 'password123'
            },
            lastUpdated: new Date().toISOString()
          }
        ])
      });
    });
    
    await page.goto('/');
    
    // Check that the protected website is displayed
    const websiteCard = page.locator('[data-testid="website-card"]').first();
    await expect(websiteCard).toBeVisible();
    
    // Check for authentication indicator
    const authIndicator = websiteCard.locator('[data-testid="auth-indicator"]');
    await expect(authIndicator).toBeVisible();
    await expect(authIndicator).toContainText('Authentication Required');
  });

  test('should handle authentication failures gracefully', async ({ page }) => {
    // Mock authentication failure
    await page.route('/api/websites', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'auth-failed-site',
            name: 'Auth Failed Site',
            url: 'https://auth-failed-site.com',
            description: 'A website where authentication failed.',
            screenshot: '/assets/screenshots/auth-failed-site.png',
            logo: '/assets/logos/auth-failed-site.svg',
            favicon: '/assets/favicons/auth-failed-site.ico',
            requiresAuth: true,
            authCredentials: null,
            lastUpdated: new Date().toISOString(),
            authError: 'Authentication failed: Invalid credentials'
          }
        ])
      });
    });
    
    await page.goto('/');
    
    // Check for authentication error indicator
    const websiteCard = page.locator('[data-testid="website-card"]').first();
    const authError = websiteCard.locator('[data-testid="auth-error"]');
    await expect(authError).toBeVisible();
    await expect(authError).toContainText('Authentication failed');
  });

  test('should prompt user for credentials when needed', async ({ page }) => {
    // Mock a website that needs manual credential input
    await page.route('/api/websites', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'manual-auth-site',
            name: 'Manual Auth Site',
            url: 'https://manual-auth-site.com',
            description: 'A website that requires manual credential input.',
            screenshot: '/assets/screenshots/manual-auth-site.png',
            logo: '/assets/logos/manual-auth-site.svg',
            favicon: '/assets/favicons/manual-auth-site.ico',
            requiresAuth: true,
            authCredentials: null,
            lastUpdated: new Date().toISOString(),
            needsManualAuth: true
          }
        ])
      });
    });
    
    await page.goto('/');
    
    // Check for manual authentication prompt
    const websiteCard = page.locator('[data-testid="website-card"]').first();
    const manualAuthPrompt = websiteCard.locator('[data-testid="manual-auth-prompt"]');
    await expect(manualAuthPrompt).toBeVisible();
    await expect(manualAuthPrompt).toContainText('Please provide credentials');
  });
});
