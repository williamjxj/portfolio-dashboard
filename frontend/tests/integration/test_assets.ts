import { test, expect } from '@playwright/test';

test.describe('Asset Generation', () => {
  test('should generate and display screenshots for all websites', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForSelector('[data-testid="website-card"]');
    
    // Check that all screenshots are loaded
    const screenshots = page.locator('[data-testid="website-screenshot"]');
    await expect(screenshots).toHaveCount(8);
    
    // Check that each screenshot is visible and has proper dimensions
    for (let i = 0; i < 8; i++) {
      const screenshot = screenshots.nth(i);
      await expect(screenshot).toBeVisible();
      
      // Check image dimensions (should be high-resolution)
      const boundingBox = await screenshot.boundingBox();
      expect(boundingBox?.width).toBeGreaterThanOrEqual(300);
      expect(boundingBox?.height).toBeGreaterThanOrEqual(200);
    }
  });

  test('should generate and display logos for all websites', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForSelector('[data-testid="website-card"]');
    
    // Check that all logos are loaded
    const logos = page.locator('[data-testid="website-logo"]');
    await expect(logos).toHaveCount(8);
    
    // Check that each logo is visible
    for (let i = 0; i < 8; i++) {
      const logo = logos.nth(i);
      await expect(logo).toBeVisible();
      
      // Check that logo is properly sized
      const boundingBox = await logo.boundingBox();
      expect(boundingBox?.width).toBeGreaterThan(0);
      expect(boundingBox?.height).toBeGreaterThan(0);
    }
  });

  test('should generate and display favicons for all websites', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForSelector('[data-testid="website-card"]');
    
    // Check that all favicons are loaded
    const favicons = page.locator('[data-testid="website-favicon"]');
    await expect(favicons).toHaveCount(8);
    
    // Check that each favicon is visible and properly sized
    for (let i = 0; i < 8; i++) {
      const favicon = favicons.nth(i);
      await expect(favicon).toBeVisible();
      
      // Check favicon dimensions (should be small)
      const boundingBox = await favicon.boundingBox();
      expect(boundingBox?.width).toBeLessThanOrEqual(64);
      expect(boundingBox?.height).toBeLessThanOrEqual(64);
    }
  });

  test('should handle asset generation failures gracefully', async ({ page }) => {
    // Mock asset generation failure
    await page.route('/api/websites', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'asset-failed-site',
            name: 'Asset Failed Site',
            url: 'https://asset-failed-site.com',
            description: 'A website where asset generation failed.',
            screenshot: null,
            logo: null,
            favicon: null,
            requiresAuth: false,
            lastUpdated: new Date().toISOString(),
            assetError: 'Failed to generate assets'
          }
        ])
      });
    });
    
    await page.goto('/');
    
    // Check for asset error indicators
    const websiteCard = page.locator('[data-testid="website-card"]').first();
    const assetError = websiteCard.locator('[data-testid="asset-error"]');
    await expect(assetError).toBeVisible();
    await expect(assetError).toContainText('Failed to generate assets');
  });
});
