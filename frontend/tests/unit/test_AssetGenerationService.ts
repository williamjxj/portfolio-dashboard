import { AssetGenerationService } from '../../src/services/AssetGenerationService';
import { Website } from '../../src/models/Website';
import { AssetMetadata } from '../../src/models/AssetMetadata';

// Mock dependencies
jest.mock('../../src/services/PlaywrightService');
jest.mock('../../src/services/AuthenticationService');
jest.mock('../../src/lib/logger', () => ({
  createLogger: () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn()
  })
}));

// Mock fs/promises
jest.mock('fs/promises', () => ({
  mkdir: jest.fn().mockResolvedValue(undefined),
  writeFile: jest.fn().mockResolvedValue(undefined)
}));

describe('AssetGenerationService', () => {
  let assetGenerationService: AssetGenerationService;
  let mockWebsite: Website;

  beforeEach(() => {
    assetGenerationService = new AssetGenerationService();
    mockWebsite = {
      id: 'test-website',
      name: 'Test Website',
      url: 'https://test-website.com',
      description: 'A test website for unit testing purposes. Target audience: developers and testers. Features: testing, validation, quality assurance.',
      screenshot: '',
      logo: '',
      favicon: '',
      requiresAuth: false,
      lastUpdated: '2025-01-27T10:00:00.000Z',
      state: 'pending'
    };
  });

  describe('generateAllAssets', () => {
    it('should generate assets for all websites', async () => {
      const websites = [mockWebsite];
      const result = await assetGenerationService.generateAllAssets(websites);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(websites.length);
    });

    it('should handle websites without authentication', async () => {
      const websites = [{ ...mockWebsite, requiresAuth: false }];
      const result = await assetGenerationService.generateAllAssets(websites);
      
      expect(result.length).toBe(1);
      expect(result[0].id).toBe(mockWebsite.id);
    });

    it('should handle websites with authentication', async () => {
      const websites = [{
        ...mockWebsite,
        requiresAuth: true,
        authCredentials: {
          websiteId: 'test-website',
          method: 'email',
          username: 'test@example.com',
          password: 'password123'
        }
      }];
      
      const result = await assetGenerationService.generateAllAssets(websites);
      
      expect(result.length).toBe(1);
      expect(result[0].id).toBe(mockWebsite.id);
    });

    it('should handle authentication failures gracefully', async () => {
      const websites = [{
        ...mockWebsite,
        requiresAuth: true,
        authCredentials: {
          websiteId: 'test-website',
          method: 'email',
          username: 'invalid@example.com',
          password: 'wrongpassword'
        }
      }];
      
      const result = await assetGenerationService.generateAllAssets(websites);
      
      expect(result.length).toBe(1);
      expect(result[0].status).toBe('failed');
    });

    it('should handle multiple websites', async () => {
      const websites = [
        { ...mockWebsite, id: 'website-1' },
        { ...mockWebsite, id: 'website-2' },
        { ...mockWebsite, id: 'website-3' }
      ];
      
      const result = await assetGenerationService.generateAllAssets(websites);
      
      expect(result.length).toBe(3);
      expect(result[0].id).toBe('website-1');
      expect(result[1].id).toBe('website-2');
      expect(result[2].id).toBe('website-3');
    });

    it('should handle empty website list', async () => {
      const result = await assetGenerationService.generateAllAssets([]);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });

  describe('getAssetMetadata', () => {
    it('should return metadata for screenshot', async () => {
      const metadata = await assetGenerationService.getAssetMetadata('test-website', 'screenshot');
      
      expect(metadata).toBeDefined();
      expect(metadata?.websiteId).toBe('test-website');
      expect(metadata?.assetType).toBe('screenshot');
      expect(metadata?.filePath).toBeDefined();
      expect(metadata?.fileSize).toBeDefined();
      expect(metadata?.format).toBeDefined();
      expect(metadata?.generatedAt).toBeDefined();
      expect(metadata?.optimized).toBeDefined();
    });

    it('should return metadata for logo', async () => {
      const metadata = await assetGenerationService.getAssetMetadata('test-website', 'logo');
      
      expect(metadata).toBeDefined();
      expect(metadata?.websiteId).toBe('test-website');
      expect(metadata?.assetType).toBe('logo');
    });

    it('should return metadata for favicon', async () => {
      const metadata = await assetGenerationService.getAssetMetadata('test-website', 'favicon');
      
      expect(metadata).toBeDefined();
      expect(metadata?.websiteId).toBe('test-website');
      expect(metadata?.assetType).toBe('favicon');
    });

    it('should return undefined for non-existent website', async () => {
      const metadata = await assetGenerationService.getAssetMetadata('non-existent', 'screenshot');
      
      expect(metadata).toBeUndefined();
    });

    it('should return undefined for invalid asset type', async () => {
      const metadata = await assetGenerationService.getAssetMetadata('test-website', 'invalid' as any);
      
      expect(metadata).toBeUndefined();
    });
  });

  describe('Asset Generation Process', () => {
    it('should create storage directory', async () => {
      const websites = [mockWebsite];
      await assetGenerationService.generateAllAssets(websites);
      
      // Verify that mkdir was called
      const fs = require('fs/promises');
      expect(fs.mkdir).toHaveBeenCalled();
    });

    it('should handle generation errors gracefully', async () => {
      const websites = [mockWebsite];
      
      // Mock an error in the generation process
      jest.spyOn(assetGenerationService as any, 'generateScreenshot').mockRejectedValue(new Error('Generation failed'));
      
      const result = await assetGenerationService.generateAllAssets(websites);
      
      expect(result.length).toBe(1);
      expect(result[0].status).toBe('failed');
    });

    it('should update website status during processing', async () => {
      const websites = [mockWebsite];
      const result = await assetGenerationService.generateAllAssets(websites);
      
      expect(result[0].status).toBe('completed');
    });

    it('should update lastUpdated timestamp', async () => {
      const websites = [mockWebsite];
      const result = await assetGenerationService.generateAllAssets(websites);
      
      expect(result[0].lastUpdated).toBeDefined();
      expect(() => new Date(result[0].lastUpdated)).not.toThrow();
    });
  });

  describe('Asset Path Generation', () => {
    it('should generate correct screenshot path', async () => {
      const websites = [mockWebsite];
      const result = await assetGenerationService.generateAllAssets(websites);
      
      expect(result[0].screenshot).toMatch(/^\/assets\/.*-screenshot\.(png|jpg|jpeg|webp)$/);
    });

    it('should generate correct logo path', async () => {
      const websites = [mockWebsite];
      const result = await assetGenerationService.generateAllAssets(websites);
      
      expect(result[0].logo).toMatch(/^\/assets\/.*-logo\.(svg|png|jpg|jpeg|webp)$/);
    });

    it('should generate correct favicon path', async () => {
      const websites = [mockWebsite];
      const result = await assetGenerationService.generateAllAssets(websites);
      
      expect(result[0].favicon).toMatch(/^\/assets\/.*-favicon\.(ico|png|jpg|jpeg|webp)$/);
    });

    it('should include website ID in asset paths', async () => {
      const websites = [mockWebsite];
      const result = await assetGenerationService.generateAllAssets(websites);
      
      expect(result[0].screenshot).toContain(mockWebsite.id);
      expect(result[0].logo).toContain(mockWebsite.id);
      expect(result[0].favicon).toContain(mockWebsite.id);
    });
  });

  describe('Error Handling', () => {
    it('should handle service instantiation', () => {
      expect(() => new AssetGenerationService()).not.toThrow();
    });

    it('should handle invalid website data', async () => {
      const invalidWebsite = { ...mockWebsite, url: 'invalid-url' };
      const result = await assetGenerationService.generateAllAssets([invalidWebsite]);
      
      expect(result.length).toBe(1);
      expect(result[0].status).toBe('failed');
    });

    it('should handle network errors', async () => {
      const websites = [mockWebsite];
      
      // Mock network error
      jest.spyOn(assetGenerationService as any, 'generateScreenshot').mockRejectedValue(new Error('Network error'));
      
      const result = await assetGenerationService.generateAllAssets(websites);
      
      expect(result.length).toBe(1);
      expect(result[0].status).toBe('failed');
    });
  });

  describe('Performance', () => {
    it('should handle concurrent asset generation', async () => {
      const websites = [
        { ...mockWebsite, id: 'website-1' },
        { ...mockWebsite, id: 'website-2' },
        { ...mockWebsite, id: 'website-3' }
      ];
      
      const startTime = Date.now();
      const result = await assetGenerationService.generateAllAssets(websites);
      const endTime = Date.now();
      
      expect(result.length).toBe(3);
      expect(endTime - startTime).toBeLessThan(5000); // Should complete in less than 5 seconds
    });

    it('should handle large batches of websites', async () => {
      const websites = Array(10).fill(null).map((_, index) => ({
        ...mockWebsite,
        id: `website-${index + 1}`
      }));
      
      const result = await assetGenerationService.generateAllAssets(websites);
      
      expect(result.length).toBe(10);
    });
  });

  describe('Data Consistency', () => {
    it('should maintain website data integrity', async () => {
      const websites = [mockWebsite];
      const result = await assetGenerationService.generateAllAssets(websites);
      
      expect(result[0].id).toBe(mockWebsite.id);
      expect(result[0].name).toBe(mockWebsite.name);
      expect(result[0].url).toBe(mockWebsite.url);
      expect(result[0].description).toBe(mockWebsite.description);
    });

    it('should preserve authentication requirements', async () => {
      const authWebsite = { ...mockWebsite, requiresAuth: true };
      const result = await assetGenerationService.generateAllAssets([authWebsite]);
      
      expect(result[0].requiresAuth).toBe(true);
    });
  });
});
