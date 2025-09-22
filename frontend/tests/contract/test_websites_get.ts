import { test, expect } from '@playwright/test';

test.describe('GET /api/websites', () => {
  test('should return list of all websites with metadata', async ({ request }) => {
    const response = await request.get('/api/websites');
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(8);
    
    // Validate each website object structure
    data.forEach((website: any) => {
      expect(website).toHaveProperty('id');
      expect(website).toHaveProperty('name');
      expect(website).toHaveProperty('url');
      expect(website).toHaveProperty('description');
      expect(website).toHaveProperty('screenshot');
      expect(website).toHaveProperty('logo');
      expect(website).toHaveProperty('favicon');
      expect(website).toHaveProperty('requiresAuth');
      expect(website).toHaveProperty('lastUpdated');
      
      // Validate data types
      expect(typeof website.id).toBe('string');
      expect(typeof website.name).toBe('string');
      expect(typeof website.url).toBe('string');
      expect(typeof website.description).toBe('string');
      expect(typeof website.screenshot).toBe('string');
      expect(typeof website.logo).toBe('string');
      expect(typeof website.favicon).toBe('string');
      expect(typeof website.requiresAuth).toBe('boolean');
      expect(typeof website.lastUpdated).toBe('string');
      
      // Validate URL format
      expect(website.url).toMatch(/^https?:\/\/.+/);
      
      // Validate description length (2-3 sentences)
      expect(website.description.length).toBeGreaterThanOrEqual(50);
      expect(website.description.length).toBeLessThanOrEqual(200);
    });
  });

  test('should handle server errors gracefully', async ({ request }) => {
    // This test will fail initially as the endpoint doesn't exist
    const response = await request.get('/api/websites');
    
    // Should return 500 for now (endpoint not implemented)
    expect(response.status()).toBe(500);
  });
});
