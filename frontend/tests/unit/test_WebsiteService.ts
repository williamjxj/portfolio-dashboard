import { WebsiteService } from '../../src/services/WebsiteService';
import { Website } from '../../src/models/Website';

// Mock the logger
jest.mock('../../src/lib/logger', () => ({
  createLogger: () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn()
  })
}));

describe('WebsiteService', () => {
  let websiteService: WebsiteService;

  beforeEach(() => {
    websiteService = new WebsiteService();
  });

  describe('getAllWebsites', () => {
    it('should return an array of websites', async () => {
      const websites = await websiteService.getAllWebsites();
      
      expect(Array.isArray(websites)).toBe(true);
      expect(websites.length).toBeGreaterThan(0);
    });

    it('should return websites with required properties', async () => {
      const websites = await websiteService.getAllWebsites();
      const firstWebsite = websites[0];
      
      expect(firstWebsite).toHaveProperty('id');
      expect(firstWebsite).toHaveProperty('name');
      expect(firstWebsite).toHaveProperty('url');
      expect(firstWebsite).toHaveProperty('description');
      expect(firstWebsite).toHaveProperty('screenshot');
      expect(firstWebsite).toHaveProperty('logo');
      expect(firstWebsite).toHaveProperty('favicon');
      expect(firstWebsite).toHaveProperty('requiresAuth');
      expect(firstWebsite).toHaveProperty('lastUpdated');
      expect(firstWebsite).toHaveProperty('state');
    });

    it('should return websites with correct types', async () => {
      const websites = await websiteService.getAllWebsites();
      const firstWebsite = websites[0];
      
      expect(typeof firstWebsite.id).toBe('string');
      expect(typeof firstWebsite.name).toBe('string');
      expect(typeof firstWebsite.url).toBe('string');
      expect(typeof firstWebsite.description).toBe('string');
      expect(typeof firstWebsite.screenshot).toBe('string');
      expect(typeof firstWebsite.logo).toBe('string');
      expect(typeof firstWebsite.favicon).toBe('string');
      expect(typeof firstWebsite.requiresAuth).toBe('boolean');
      expect(typeof firstWebsite.lastUpdated).toBe('string');
      expect(typeof firstWebsite.state).toBe('string');
    });

    it('should return websites with valid URLs', async () => {
      const websites = await websiteService.getAllWebsites();
      
      websites.forEach(website => {
        expect(() => new URL(website.url)).not.toThrow();
        expect(website.url).toMatch(/^https?:\/\//);
      });
    });

    it('should return websites with valid descriptions', async () => {
      const websites = await websiteService.getAllWebsites();
      
      websites.forEach(website => {
        expect(website.description.length).toBeGreaterThanOrEqual(50);
        expect(website.description.length).toBeLessThanOrEqual(200);
      });
    });

    it('should return websites with valid asset paths', async () => {
      const websites = await websiteService.getAllWebsites();
      
      websites.forEach(website => {
        expect(website.screenshot).toMatch(/^\/assets\/.*\.(png|jpg|jpeg|webp)$/);
        expect(website.logo).toMatch(/^\/assets\/.*\.(svg|png|jpg|jpeg|webp)$/);
        expect(website.favicon).toMatch(/^\/assets\/.*\.(ico|png|jpg|jpeg|webp)$/);
      });
    });

    it('should return websites with valid timestamps', async () => {
      const websites = await websiteService.getAllWebsites();
      
      websites.forEach(website => {
        expect(() => new Date(website.lastUpdated)).not.toThrow();
        expect(new Date(website.lastUpdated).toISOString()).toBe(website.lastUpdated);
      });
    });

    it('should return websites with valid states', async () => {
      const websites = await websiteService.getAllWebsites();
      const validStates = ['pending', 'processing', 'completed', 'failed', 'retry'];
      
      websites.forEach(website => {
        expect(validStates).toContain(website.state);
      });
    });
  });

  describe('getWebsiteById', () => {
    it('should return a website when given a valid ID', async () => {
      const websites = await websiteService.getAllWebsites();
      const firstWebsite = websites[0];
      
      const website = await websiteService.getWebsiteById(firstWebsite.id);
      
      expect(website).toBeDefined();
      expect(website?.id).toBe(firstWebsite.id);
      expect(website?.name).toBe(firstWebsite.name);
      expect(website?.url).toBe(firstWebsite.url);
    });

    it('should return undefined for non-existent ID', async () => {
      const website = await websiteService.getWebsiteById('non-existent-id');
      
      expect(website).toBeUndefined();
    });

    it('should return undefined for empty ID', async () => {
      const website = await websiteService.getWebsiteById('');
      
      expect(website).toBeUndefined();
    });

    it('should return undefined for null ID', async () => {
      const website = await websiteService.getWebsiteById(null as any);
      
      expect(website).toBeUndefined();
    });

    it('should return undefined for undefined ID', async () => {
      const website = await websiteService.getWebsiteById(undefined as any);
      
      expect(website).toBeUndefined();
    });

    it('should handle case-sensitive ID matching', async () => {
      const websites = await websiteService.getAllWebsites();
      const firstWebsite = websites[0];
      
      const website = await websiteService.getWebsiteById(firstWebsite.id.toUpperCase());
      
      expect(website).toBeUndefined();
    });
  });

  describe('Website Data Integrity', () => {
    it('should have unique IDs for all websites', async () => {
      const websites = await websiteService.getAllWebsites();
      const ids = websites.map(w => w.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have unique URLs for all websites', async () => {
      const websites = await websiteService.getAllWebsites();
      const urls = websites.map(w => w.url);
      const uniqueUrls = new Set(urls);
      
      expect(uniqueUrls.size).toBe(urls.length);
    });

    it('should have valid website names', async () => {
      const websites = await websiteService.getAllWebsites();
      
      websites.forEach(website => {
        expect(website.name.length).toBeGreaterThan(0);
        expect(website.name.trim()).toBe(website.name);
      });
    });

    it('should have consistent asset naming', async () => {
      const websites = await websiteService.getAllWebsites();
      
      websites.forEach(website => {
        expect(website.screenshot).toContain(website.id);
        expect(website.logo).toContain(website.id);
        expect(website.favicon).toContain(website.id);
      });
    });
  });

  describe('Authentication Requirements', () => {
    it('should have some websites requiring authentication', async () => {
      const websites = await websiteService.getAllWebsites();
      const authRequiredWebsites = websites.filter(w => w.requiresAuth);
      
      expect(authRequiredWebsites.length).toBeGreaterThan(0);
    });

    it('should have some websites not requiring authentication', async () => {
      const websites = await websiteService.getAllWebsites();
      const noAuthWebsites = websites.filter(w => !w.requiresAuth);
      
      expect(noAuthWebsites.length).toBeGreaterThan(0);
    });

    it('should have consistent authentication state', async () => {
      const websites = await websiteService.getAllWebsites();
      
      websites.forEach(website => {
        if (website.requiresAuth) {
          expect(website.authCredentials).toBeDefined();
        } else {
          expect(website.authCredentials).toBeUndefined();
        }
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle service instantiation', () => {
      expect(() => new WebsiteService()).not.toThrow();
    });

    it('should handle multiple service instances', () => {
      const service1 = new WebsiteService();
      const service2 = new WebsiteService();
      
      expect(service1).toBeDefined();
      expect(service2).toBeDefined();
      expect(service1).not.toBe(service2);
    });
  });

  describe('Performance', () => {
    it('should return results quickly', async () => {
      const startTime = Date.now();
      await websiteService.getAllWebsites();
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeLessThan(100); // Should complete in less than 100ms
    });

    it('should handle concurrent requests', async () => {
      const promises = Array(10).fill(null).map(() => websiteService.getAllWebsites());
      const results = await Promise.all(promises);
      
      expect(results.length).toBe(10);
      results.forEach(websites => {
        expect(Array.isArray(websites)).toBe(true);
        expect(websites.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Data Consistency', () => {
    it('should return consistent data across multiple calls', async () => {
      const websites1 = await websiteService.getAllWebsites();
      const websites2 = await websiteService.getAllWebsites();
      
      expect(websites1.length).toBe(websites2.length);
      expect(websites1).toEqual(websites2);
    });

    it('should maintain data integrity after multiple operations', async () => {
      const websites = await websiteService.getAllWebsites();
      const firstWebsite = websites[0];
      
      // Multiple get operations
      const website1 = await websiteService.getWebsiteById(firstWebsite.id);
      const website2 = await websiteService.getWebsiteById(firstWebsite.id);
      
      expect(website1).toEqual(website2);
      expect(website1).toEqual(firstWebsite);
    });
  });
});
