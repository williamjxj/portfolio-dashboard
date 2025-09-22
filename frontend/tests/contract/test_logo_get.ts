import { test, expect } from '@playwright/test';

test.describe('GET /api/websites/{id}/logo', () => {
  test('should return logo image for specific website', async ({ request }) => {
    const websiteId = 'face-fusion-agent';
    const response = await request.get(`/api/websites/${websiteId}/logo`);
    
    expect(response.status()).toBe(200);
    
    const contentType = response.headers()['content-type'];
    expect(contentType).toMatch(/image\/(svg\+xml|png|jpeg|webp)/);
    
    const buffer = await response.body();
    expect(buffer.length).toBeGreaterThan(0);
  });

  test('should return 404 for non-existent logo', async ({ request }) => {
    const response = await request.get('/api/websites/non-existent-id/logo');
    
    expect(response.status()).toBe(404);
    
    const data = await response.json();
    expect(data).toHaveProperty('message');
    expect(data).toHaveProperty('code');
  });

  test('should handle server errors gracefully', async ({ request }) => {
    const response = await request.get('/api/websites/invalid-id/logo');
    
    // Should return 500 for now (endpoint not implemented)
    expect(response.status()).toBe(500);
  });
});
