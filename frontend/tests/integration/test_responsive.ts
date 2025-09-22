import { test, expect } from '@playwright/test';

test.describe('Mobile Responsive Design', () => {
  test('should display correctly on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForSelector('[data-testid="website-card"]');
    
    // Check that website grid is responsive
    const websiteGrid = page.locator('[data-testid="website-grid"]');
    await expect(websiteGrid).toBeVisible();
    
    // Check that cards are stacked vertically on mobile
    const websiteCards = page.locator('[data-testid="website-card"]');
    await expect(websiteCards).toHaveCount(8);
    
    // Check that each card is properly sized for mobile
    for (let i = 0; i < 8; i++) {
      const card = websiteCards.nth(i);
      await expect(card).toBeVisible();
      
      // Check that card is full width on mobile
      const boundingBox = await card.boundingBox();
      expect(boundingBox?.width).toBeGreaterThan(300);
    }
  });

  test('should have touch-friendly interactions', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForSelector('[data-testid="website-card"]');
    
    // Check that clickable elements have minimum 44px touch targets
    const clickableElements = page.locator('[data-testid="website-link"]');
    await expect(clickableElements).toHaveCount(8);
    
    for (let i = 0; i < 8; i++) {
      const element = clickableElements.nth(i);
      const boundingBox = await element.boundingBox();
      
      // Check minimum touch target size (44px)
      expect(boundingBox?.width).toBeGreaterThanOrEqual(44);
      expect(boundingBox?.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('should display correctly on tablet devices', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForSelector('[data-testid="website-card"]');
    
    // Check that website grid adapts to tablet layout
    const websiteGrid = page.locator('[data-testid="website-grid"]');
    await expect(websiteGrid).toBeVisible();
    
    // Check that cards are arranged in a grid on tablet
    const websiteCards = page.locator('[data-testid="website-card"]');
    await expect(websiteCards).toHaveCount(8);
    
    // Check that cards are properly sized for tablet
    for (let i = 0; i < 8; i++) {
      const card = websiteCards.nth(i);
      await expect(card).toBeVisible();
      
      const boundingBox = await card.boundingBox();
      expect(boundingBox?.width).toBeGreaterThan(200);
    }
  });

  test('should display correctly on desktop devices', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForSelector('[data-testid="website-card"]');
    
    // Check that website grid uses full desktop layout
    const websiteGrid = page.locator('[data-testid="website-grid"]');
    await expect(websiteGrid).toBeVisible();
    
    // Check that cards are arranged in a proper grid on desktop
    const websiteCards = page.locator('[data-testid="website-card"]');
    await expect(websiteCards).toHaveCount(8);
    
    // Check that cards are properly sized for desktop
    for (let i = 0; i < 8; i++) {
      const card = websiteCards.nth(i);
      await expect(card).toBeVisible();
      
      const boundingBox = await card.boundingBox();
      expect(boundingBox?.width).toBeGreaterThan(250);
    }
  });
});
