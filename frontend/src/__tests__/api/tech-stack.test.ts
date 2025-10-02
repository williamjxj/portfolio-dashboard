/**
 * Integration tests for tech stack API endpoints
 * Tests the functionality of tech stack API endpoints to ensure proper data handling
 */

import { NextRequest } from 'next/server';

// Mock the data loader
jest.mock('@/lib/data-loader', () => ({
  DataLoader: jest.fn().mockImplementation(() => ({
    loadWebsites: jest.fn().mockResolvedValue([
      {
        id: 'test-website',
        name: 'Test Website',
        url: 'https://test.com',
        description: 'Test description',
        techStack: {
          frontend: ['React', 'Next.js'],
          backend: ['Node.js'],
          database: ['PostgreSQL'],
          deployment: ['Vercel'],
          aiTools: ['OpenAI'],
          other: ['GitHub Actions'],
          source: '2025-01-27T10:00:00Z'
        }
      }
    ])
  }))
}));

describe('Tech Stack API Endpoints', () => {
  describe('GET /api/tech-stack', () => {
    it('should return tech stack summary', async () => {
      const { GET } = await import('@/app/api/tech-stack/route');
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('totalWebsites');
      expect(data).toHaveProperty('totalTechnologies');
      expect(data).toHaveProperty('categories');
      expect(Array.isArray(data.categories)).toBe(true);
    });

    it('should handle errors gracefully', async () => {
      // Mock error scenario
      const mockDataLoader = require('@/lib/data-loader').DataLoader;
      mockDataLoader.mockImplementation(() => ({
        loadWebsites: jest.fn().mockRejectedValue(new Error('Database error'))
      }));

      const { GET } = await import('@/app/api/tech-stack/route');
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toHaveProperty('error');
      expect(data).toHaveProperty('message');
    });
  });

  describe('GET /api/tech-stack/categories', () => {
    it('should return tech categories', async () => {
      const { GET } = await import('@/app/api/tech-stack/categories/route');
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      
      if (data.length > 0) {
        expect(data[0]).toHaveProperty('name');
        expect(data[0]).toHaveProperty('count');
        expect(data[0]).toHaveProperty('technologies');
      }
    });

    it('should sort categories by count', async () => {
      const { GET } = await import('@/app/api/tech-stack/categories/route');
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      
      if (data.length > 1) {
        for (let i = 1; i < data.length; i++) {
          expect(data[i-1].count).toBeGreaterThanOrEqual(data[i].count);
        }
      }
    });
  });
});

describe('Website API with Tech Stack', () => {
  describe('GET /api/websites', () => {
    it('should include tech stack data in response', async () => {
      const { GET } = await import('@/app/api/websites/route');
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      
      if (data.length > 0) {
        expect(data[0]).toHaveProperty('techStack');
        expect(data[0].techStack).toHaveProperty('frontend');
        expect(data[0].techStack).toHaveProperty('backend');
        expect(data[0].techStack).toHaveProperty('database');
        expect(data[0].techStack).toHaveProperty('deployment');
      }
    });
  });

  describe('GET /api/websites/[id]', () => {
    it('should return website with tech stack by ID', async () => {
      const { GET } = await import('@/app/api/websites/[id]/route');
      const request = new NextRequest('http://localhost:3000/api/websites/test-website');
      const response = await GET(request, { params: { id: 'test-website' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('id', 'test-website');
      expect(data).toHaveProperty('techStack');
    });

    it('should return 404 for non-existent website', async () => {
      const { GET } = await import('@/app/api/websites/[id]/route');
      const request = new NextRequest('http://localhost:3000/api/websites/non-existent');
      const response = await GET(request, { params: { id: 'non-existent' } });

      expect(response.status).toBe(404);
    });
  });
});





