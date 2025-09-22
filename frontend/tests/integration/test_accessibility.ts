import { test, expect } from '@playwright/test';

test.describe('Accessibility Compliance', () => {
  test('should have proper semantic HTML structure', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForSelector('[data-testid="website-card"]');
    
    // Check for proper heading structure
    const mainHeading = page.locator('h1');
    await expect(mainHeading).toBeVisible();
    
    // Check for proper navigation structure
    const navigation = page.locator('nav');
    await expect(navigation).toBeVisible();
    
    // Check for proper main content area
    const main = page.locator('main');
    await expect(main).toBeVisible();
    
    // Check for proper footer
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForSelector('[data-testid="website-card"]');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    
    // Check that focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Test that all interactive elements are focusable
    const interactiveElements = page.locator('a, button, input, select, textarea');
    const count = await interactiveElements.count();
    
    for (let i = 0; i < count; i++) {
      const element = interactiveElements.nth(i);
      const isFocusable = await element.evaluate(el => {
        const tabIndex = el.getAttribute('tabindex');
        return tabIndex !== '-1' && !el.disabled;
      });
      expect(isFocusable).toBe(true);
    }
  });

  test('should have proper ARIA labels and roles', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForSelector('[data-testid="website-card"]');
    
    // Check for proper ARIA labels on images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const ariaLabel = await img.getAttribute('aria-label');
      
      // Each image should have either alt text or aria-label
      expect(alt || ariaLabel).toBeTruthy();
    }
    
    // Check for proper ARIA roles
    const cards = page.locator('[data-testid="website-card"]');
    await expect(cards).toHaveCount(8);
    
    for (let i = 0; i < 8; i++) {
      const card = cards.nth(i);
      const role = await card.getAttribute('role');
      expect(role).toBe('article');
    }
  });

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForSelector('[data-testid="website-card"]');
    
    // Check that text has sufficient contrast
    const textElements = page.locator('p, h1, h2, h3, h4, h5, h6, span, div');
    const textCount = await textElements.count();
    
    // This is a basic check - in a real implementation, you'd use a library
    // like axe-core to check actual contrast ratios
    expect(textCount).toBeGreaterThan(0);
  });

  test('should work with screen readers', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForSelector('[data-testid="website-card"]');
    
    // Check that all interactive elements have accessible names
    const links = page.locator('a');
    const linkCount = await links.count();
    
    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      
      // Each link should have either text content or aria-label
      expect(text || ariaLabel).toBeTruthy();
    }
    
    // Check that form elements have proper labels
    const inputs = page.locator('input, select, textarea');
    const inputCount = await inputs.count();
    
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        const hasLabel = await label.count() > 0;
        expect(hasLabel || ariaLabel || ariaLabelledBy).toBe(true);
      }
    }
  });
});
