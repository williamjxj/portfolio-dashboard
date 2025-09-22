import { AssetMetadata } from '../../src/models/AssetMetadata';

describe('AssetMetadata Model', () => {
  const mockAssetMetadata: AssetMetadata = {
    websiteId: 'test-website',
    assetType: 'screenshot',
    filePath: '/assets/test-website-screenshot.png',
    fileSize: 1024000,
    dimensions: { width: 1200, height: 800 },
    format: 'png',
    generatedAt: '2025-01-27T10:00:00.000Z',
    optimized: true
  };

  describe('AssetMetadata Interface', () => {
    it('should have all required properties', () => {
      expect(mockAssetMetadata.websiteId).toBeDefined();
      expect(mockAssetMetadata.assetType).toBeDefined();
      expect(mockAssetMetadata.filePath).toBeDefined();
      expect(mockAssetMetadata.fileSize).toBeDefined();
      expect(mockAssetMetadata.format).toBeDefined();
      expect(mockAssetMetadata.generatedAt).toBeDefined();
      expect(mockAssetMetadata.optimized).toBeDefined();
    });

    it('should have correct types for all properties', () => {
      expect(typeof mockAssetMetadata.websiteId).toBe('string');
      expect(typeof mockAssetMetadata.assetType).toBe('string');
      expect(typeof mockAssetMetadata.filePath).toBe('string');
      expect(typeof mockAssetMetadata.fileSize).toBe('number');
      expect(typeof mockAssetMetadata.format).toBe('string');
      expect(typeof mockAssetMetadata.generatedAt).toBe('string');
      expect(typeof mockAssetMetadata.optimized).toBe('boolean');
    });

    it('should have valid asset type', () => {
      const validTypes = ['screenshot', 'logo', 'favicon'];
      expect(validTypes).toContain(mockAssetMetadata.assetType);
    });
  });

  describe('Screenshot Asset', () => {
    it('should handle screenshot metadata', () => {
      const screenshotAsset: AssetMetadata = {
        websiteId: 'test-website',
        assetType: 'screenshot',
        filePath: '/assets/test-website-screenshot.png',
        fileSize: 2048000,
        dimensions: { width: 1920, height: 1080 },
        format: 'png',
        generatedAt: '2025-01-27T10:00:00.000Z',
        optimized: true
      };

      expect(screenshotAsset.assetType).toBe('screenshot');
      expect(screenshotAsset.dimensions?.width).toBe(1920);
      expect(screenshotAsset.dimensions?.height).toBe(1080);
      expect(screenshotAsset.format).toBe('png');
    });

    it('should handle screenshot without dimensions', () => {
      const screenshotAsset: AssetMetadata = {
        websiteId: 'test-website',
        assetType: 'screenshot',
        filePath: '/assets/test-website-screenshot.png',
        fileSize: 1024000,
        format: 'png',
        generatedAt: '2025-01-27T10:00:00.000Z',
        optimized: true
      };

      expect(screenshotAsset.dimensions).toBeUndefined();
    });
  });

  describe('Logo Asset', () => {
    it('should handle logo metadata', () => {
      const logoAsset: AssetMetadata = {
        websiteId: 'test-website',
        assetType: 'logo',
        filePath: '/assets/test-website-logo.svg',
        fileSize: 51200,
        dimensions: { width: 100, height: 100 },
        format: 'svg',
        generatedAt: '2025-01-27T10:00:00.000Z',
        optimized: true
      };

      expect(logoAsset.assetType).toBe('logo');
      expect(logoAsset.dimensions?.width).toBe(100);
      expect(logoAsset.dimensions?.height).toBe(100);
      expect(logoAsset.format).toBe('svg');
    });

    it('should handle logo in different formats', () => {
      const logoFormats = ['svg', 'png', 'webp', 'jpg'];
      
      logoFormats.forEach(format => {
        const logoAsset: AssetMetadata = {
          websiteId: 'test-website',
          assetType: 'logo',
          filePath: `/assets/test-website-logo.${format}`,
          fileSize: 25600,
          format,
          generatedAt: '2025-01-27T10:00:00.000Z',
          optimized: true
        };

        expect(logoAsset.format).toBe(format);
        expect(logoAsset.filePath).toMatch(new RegExp(`\\.${format}$`));
      });
    });
  });

  describe('Favicon Asset', () => {
    it('should handle favicon metadata', () => {
      const faviconAsset: AssetMetadata = {
        websiteId: 'test-website',
        assetType: 'favicon',
        filePath: '/assets/test-website-favicon.ico',
        fileSize: 4096,
        format: 'ico',
        generatedAt: '2025-01-27T10:00:00.000Z',
        optimized: true
      };

      expect(faviconAsset.assetType).toBe('favicon');
      expect(faviconAsset.format).toBe('ico');
      expect(faviconAsset.fileSize).toBe(4096);
    });

    it('should handle favicon in different formats', () => {
      const faviconFormats = ['ico', 'png', 'webp'];
      
      faviconFormats.forEach(format => {
        const faviconAsset: AssetMetadata = {
          websiteId: 'test-website',
          assetType: 'favicon',
          filePath: `/assets/test-website-favicon.${format}`,
          fileSize: 2048,
          format,
          generatedAt: '2025-01-27T10:00:00.000Z',
          optimized: true
        };

        expect(faviconAsset.format).toBe(format);
        expect(faviconAsset.filePath).toMatch(new RegExp(`\\.${format}$`));
      });
    });
  });

  describe('File Path Validation', () => {
    it('should validate screenshot file paths', () => {
      const screenshotAsset: AssetMetadata = {
        ...mockAssetMetadata,
        assetType: 'screenshot',
        filePath: '/assets/test-website-screenshot.png'
      };

      expect(screenshotAsset.filePath).toMatch(/\.(png|jpg|jpeg|webp)$/);
    });

    it('should validate logo file paths', () => {
      const logoAsset: AssetMetadata = {
        ...mockAssetMetadata,
        assetType: 'logo',
        filePath: '/assets/test-website-logo.svg'
      };

      expect(logoAsset.filePath).toMatch(/\.(svg|png|jpg|jpeg|webp)$/);
    });

    it('should validate favicon file paths', () => {
      const faviconAsset: AssetMetadata = {
        ...mockAssetMetadata,
        assetType: 'favicon',
        filePath: '/assets/test-website-favicon.ico'
      };

      expect(faviconAsset.filePath).toMatch(/\.(ico|png|jpg|jpeg|webp)$/);
    });
  });

  describe('File Size Validation', () => {
    it('should handle reasonable file sizes', () => {
      const reasonableSizes = [1024, 10240, 102400, 1024000, 10240000];
      
      reasonableSizes.forEach(size => {
        const asset: AssetMetadata = {
          ...mockAssetMetadata,
          fileSize: size
        };

        expect(asset.fileSize).toBe(size);
        expect(asset.fileSize).toBeGreaterThan(0);
      });
    });

    it('should handle large file sizes', () => {
      const largeAsset: AssetMetadata = {
        ...mockAssetMetadata,
        fileSize: 50 * 1024 * 1024 // 50MB
      };

      expect(largeAsset.fileSize).toBe(50 * 1024 * 1024);
    });

    it('should handle small file sizes', () => {
      const smallAsset: AssetMetadata = {
        ...mockAssetMetadata,
        fileSize: 100 // 100 bytes
      };

      expect(smallAsset.fileSize).toBe(100);
    });
  });

  describe('Dimensions Validation', () => {
    it('should handle valid dimensions', () => {
      const validDimensions = [
        { width: 100, height: 100 },
        { width: 800, height: 600 },
        { width: 1920, height: 1080 },
        { width: 2560, height: 1440 }
      ];

      validDimensions.forEach(dimensions => {
        const asset: AssetMetadata = {
          ...mockAssetMetadata,
          dimensions
        };

        expect(asset.dimensions?.width).toBe(dimensions.width);
        expect(asset.dimensions?.height).toBe(dimensions.height);
        expect(asset.dimensions?.width).toBeGreaterThan(0);
        expect(asset.dimensions?.height).toBeGreaterThan(0);
      });
    });

    it('should handle square dimensions', () => {
      const squareAsset: AssetMetadata = {
        ...mockAssetMetadata,
        dimensions: { width: 100, height: 100 }
      };

      expect(squareAsset.dimensions?.width).toBe(squareAsset.dimensions?.height);
    });

    it('should handle landscape dimensions', () => {
      const landscapeAsset: AssetMetadata = {
        ...mockAssetMetadata,
        dimensions: { width: 1920, height: 1080 }
      };

      expect(landscapeAsset.dimensions?.width).toBeGreaterThan(landscapeAsset.dimensions?.height || 0);
    });

    it('should handle portrait dimensions', () => {
      const portraitAsset: AssetMetadata = {
        ...mockAssetMetadata,
        dimensions: { width: 800, height: 1200 }
      };

      expect(portraitAsset.dimensions?.height).toBeGreaterThan(portraitAsset.dimensions?.width || 0);
    });
  });

  describe('Format Validation', () => {
    it('should handle image formats', () => {
      const imageFormats = ['png', 'jpg', 'jpeg', 'webp', 'svg', 'ico'];
      
      imageFormats.forEach(format => {
        const asset: AssetMetadata = {
          ...mockAssetMetadata,
          format
        };

        expect(asset.format).toBe(format);
      });
    });

    it('should validate format against file path', () => {
      const asset: AssetMetadata = {
        ...mockAssetMetadata,
        filePath: '/assets/test-website-logo.svg',
        format: 'svg'
      };

      expect(asset.filePath).toMatch(new RegExp(`\\.${asset.format}$`));
    });
  });

  describe('Optimization Status', () => {
    it('should handle optimized assets', () => {
      const optimizedAsset: AssetMetadata = {
        ...mockAssetMetadata,
        optimized: true
      };

      expect(optimizedAsset.optimized).toBe(true);
    });

    it('should handle non-optimized assets', () => {
      const nonOptimizedAsset: AssetMetadata = {
        ...mockAssetMetadata,
        optimized: false
      };

      expect(nonOptimizedAsset.optimized).toBe(false);
    });
  });

  describe('Timestamp Validation', () => {
    it('should have valid ISO date string for generatedAt', () => {
      expect(() => new Date(mockAssetMetadata.generatedAt)).not.toThrow();
      expect(new Date(mockAssetMetadata.generatedAt).toISOString()).toBe(mockAssetMetadata.generatedAt);
    });

    it('should handle recent timestamps', () => {
      const recentAsset: AssetMetadata = {
        ...mockAssetMetadata,
        generatedAt: new Date().toISOString()
      };

      const generatedDate = new Date(recentAsset.generatedAt);
      const now = new Date();
      const diffInMinutes = (now.getTime() - generatedDate.getTime()) / (1000 * 60);

      expect(diffInMinutes).toBeLessThan(1); // Should be within 1 minute
    });
  });

  describe('Serialization', () => {
    it('should serialize to JSON correctly', () => {
      const json = JSON.stringify(mockAssetMetadata);
      const parsed = JSON.parse(json);
      
      expect(parsed.websiteId).toBe(mockAssetMetadata.websiteId);
      expect(parsed.assetType).toBe(mockAssetMetadata.assetType);
      expect(parsed.filePath).toBe(mockAssetMetadata.filePath);
      expect(parsed.fileSize).toBe(mockAssetMetadata.fileSize);
    });

    it('should deserialize from JSON correctly', () => {
      const json = JSON.stringify(mockAssetMetadata);
      const parsed = JSON.parse(json) as AssetMetadata;
      
      expect(parsed).toEqual(mockAssetMetadata);
    });

    it('should handle dimensions serialization', () => {
      const assetWithDimensions: AssetMetadata = {
        ...mockAssetMetadata,
        dimensions: { width: 1920, height: 1080 }
      };

      const json = JSON.stringify(assetWithDimensions);
      const parsed = JSON.parse(json) as AssetMetadata;
      
      expect(parsed.dimensions).toEqual({ width: 1920, height: 1080 });
    });
  });

  describe('Comparison', () => {
    it('should compare assets by website ID and type', () => {
      const asset1: AssetMetadata = {
        ...mockAssetMetadata,
        websiteId: 'website-1',
        assetType: 'screenshot'
      };

      const asset2: AssetMetadata = {
        ...mockAssetMetadata,
        websiteId: 'website-2',
        assetType: 'screenshot'
      };

      expect(asset1.websiteId).not.toBe(asset2.websiteId);
      expect(asset1.assetType).toBe(asset2.assetType);
    });

    it('should compare assets by file path', () => {
      const asset1: AssetMetadata = {
        ...mockAssetMetadata,
        filePath: '/assets/website-1-screenshot.png'
      };

      const asset2: AssetMetadata = {
        ...mockAssetMetadata,
        filePath: '/assets/website-2-screenshot.png'
      };

      expect(asset1.filePath).not.toBe(asset2.filePath);
    });
  });
});
