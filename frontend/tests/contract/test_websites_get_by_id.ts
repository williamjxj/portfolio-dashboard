import { test, expect } from '@playwright/test';

test.describe('GET /api/websites/{id}', () => {
  test('should return specific website by ID', async ({ request }) => {
    const websiteId = 'face-fusion-agent';
    const response = await request.get(`/api/websites/${websiteId}`);
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('id', websiteId);
    expect(data).toHaveProperty('name');
    expect(data).toHaveProperty('url');
    expect(data).toHaveProperty('description');
    expect(data).toHaveProperty('screenshot');
    expect(data).toHaveProperty('logo');
    expect(data).toHaveProperty('favicon');
    expect(data).toHaveProperty('requiresAuth');
    expect(data).toHaveProperty('lastUpdated');
  });

  test('should return 404 for non-existent website', async ({ request }) => {
    const response = await request.get('/api/websites/non-existent-id');
    
    expect(response.status()).toBe(404);
    
    const data = await response.json();
    expect(data).toHaveProperty('message');
    expect(data).toHaveProperty('code');
  });

  test('should handle server errors gracefully', async ({ request }) => {
    const response = await request.get('/api/websites/invalid-id');
    
    // Should return 500 for now (endpoint not implemented)
    expect(response.status()).toBe(500);
  });
});
