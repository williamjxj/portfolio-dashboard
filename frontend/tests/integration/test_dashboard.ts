import { test, expect } from '@playwright/test';

test.describe('Website Dashboard Display', () => {
  test('should display all 8 websites with complete metadata', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check that all 8 websites are displayed
    const websiteCards = await page.locator('[data-testid="website-card"]');
    await expect(websiteCards).toHaveCount(8);
    
    // Check that each website card has required elements
    for (let i = 0; i < 8; i++) {
      const card = websiteCards.nth(i);
      
      // Check for screenshot
      const screenshot = card.locator('[data-testid="website-screenshot"]');
      await expect(screenshot).toBeVisible();
      
      // Check for logo
      const logo = card.locator('[data-testid="website-logo"]');
      await expect(logo).toBeVisible();
      
      // Check for favicon
      const favicon = card.locator('[data-testid="website-favicon"]');
      await expect(favicon).toBeVisible();
      
      // Check for description
      const description = card.locator('[data-testid="website-description"]');
      await expect(description).toBeVisible();
      await expect(description).toContainText(/^.{50,200}$/);
      
      // Check for website link
      const link = card.locator('[data-testid="website-link"]');
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', /^https?:\/\/.+/);
    }
  });

  test('should handle loading states gracefully', async ({ page }) => {
    await page.goto('/');
    
    // Check for loading spinner initially
    const loadingSpinner = page.locator('[data-testid="loading-spinner"]');
    await expect(loadingSpinner).toBeVisible();
    
    // Wait for content to load
    await page.waitForSelector('[data-testid="website-card"]', { timeout: 10000 });
    
    // Loading spinner should be hidden
    await expect(loadingSpinner).toBeHidden();
  });

  test('should handle errors gracefully', async ({ page }) => {
    // Mock API to return error
    await page.route('/api/websites', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Internal server error', code: 'SERVER_ERROR' })
      });
    });
    
    await page.goto('/');
    
    // Check for error message
    const errorMessage = page.locator('[data-testid="error-message"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Failed to load websites');
  });
});
