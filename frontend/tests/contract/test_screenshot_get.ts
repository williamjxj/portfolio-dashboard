import { test, expect } from '@playwright/test';

test.describe('GET /api/websites/{id}/screenshot', () => {
  test('should return screenshot image for specific website', async ({ request }) => {
    const websiteId = 'face-fusion-agent';
    const response = await request.get(`/api/websites/${websiteId}/screenshot`);
    
    expect(response.status()).toBe(200);
    
    const contentType = response.headers()['content-type'];
    expect(contentType).toMatch(/image\/(png|jpeg|webp)/);
    
    const buffer = await response.body();
    expect(buffer.length).toBeGreaterThan(0);
  });

  test('should return 404 for non-existent screenshot', async ({ request }) => {
    const response = await request.get('/api/websites/non-existent-id/screenshot');
    
    expect(response.status()).toBe(404);
    
    const data = await response.json();
    expect(data).toHaveProperty('message');
    expect(data).toHaveProperty('code');
  });

  test('should handle server errors gracefully', async ({ request }) => {
    const response = await request.get('/api/websites/invalid-id/screenshot');
    
    // Should return 500 for now (endpoint not implemented)
    expect(response.status()).toBe(500);
  });
});
