import { Website } from '../../src/models/Website';

describe('Website Model', () => {
  const mockWebsite: Website = {
    id: 'test-website',
    name: 'Test Website',
    url: 'https://test-website.com',
    description: 'A test website for unit testing purposes. Target audience: developers and testers. Features: testing, validation, quality assurance.',
    screenshot: '/assets/test-website-screenshot.png',
    logo: '/assets/test-website-logo.svg',
    favicon: '/assets/test-website-favicon.ico',
    requiresAuth: false,
    lastUpdated: '2025-01-27T10:00:00.000Z',
    state: 'completed'
  };

  describe('Website Interface', () => {
    it('should have all required properties', () => {
      expect(mockWebsite.id).toBeDefined();
      expect(mockWebsite.name).toBeDefined();
      expect(mockWebsite.url).toBeDefined();
      expect(mockWebsite.description).toBeDefined();
      expect(mockWebsite.screenshot).toBeDefined();
      expect(mockWebsite.logo).toBeDefined();
      expect(mockWebsite.favicon).toBeDefined();
      expect(mockWebsite.requiresAuth).toBeDefined();
      expect(mockWebsite.lastUpdated).toBeDefined();
      expect(mockWebsite.state).toBeDefined();
    });

    it('should have correct types for all properties', () => {
      expect(typeof mockWebsite.id).toBe('string');
      expect(typeof mockWebsite.name).toBe('string');
      expect(typeof mockWebsite.url).toBe('string');
      expect(typeof mockWebsite.description).toBe('string');
      expect(typeof mockWebsite.screenshot).toBe('string');
      expect(typeof mockWebsite.logo).toBe('string');
      expect(typeof mockWebsite.favicon).toBe('string');
      expect(typeof mockWebsite.requiresAuth).toBe('boolean');
      expect(typeof mockWebsite.lastUpdated).toBe('string');
      expect(typeof mockWebsite.state).toBe('string');
    });

    it('should have valid URL format', () => {
      expect(() => new URL(mockWebsite.url)).not.toThrow();
    });

    it('should have valid ISO date string for lastUpdated', () => {
      expect(() => new Date(mockWebsite.lastUpdated)).not.toThrow();
      expect(new Date(mockWebsite.lastUpdated).toISOString()).toBe(mockWebsite.lastUpdated);
    });

    it('should have valid state value', () => {
      const validStates = ['pending', 'processing', 'completed', 'failed', 'retry'];
      expect(validStates).toContain(mockWebsite.state);
    });
  });

  describe('Website Validation', () => {
    it('should validate required fields', () => {
      const requiredFields = ['id', 'name', 'url', 'description', 'screenshot', 'logo', 'favicon', 'requiresAuth', 'lastUpdated', 'state'];
      
      requiredFields.forEach(field => {
        expect(mockWebsite[field as keyof Website]).toBeDefined();
      });
    });

    it('should validate description length', () => {
      expect(mockWebsite.description.length).toBeGreaterThanOrEqual(50);
      expect(mockWebsite.description.length).toBeLessThanOrEqual(200);
    });

    it('should validate asset paths', () => {
      expect(mockWebsite.screenshot).toMatch(/\.(png|jpg|jpeg|webp)$/);
      expect(mockWebsite.logo).toMatch(/\.(svg|png|jpg|jpeg|webp)$/);
      expect(mockWebsite.favicon).toMatch(/\.(ico|png|jpg|jpeg|webp)$/);
    });

    it('should validate URL format', () => {
      expect(mockWebsite.url).toMatch(/^https?:\/\/.+/);
    });
  });

  describe('Website State Management', () => {
    it('should handle pending state', () => {
      const pendingWebsite = { ...mockWebsite, state: 'pending' as const };
      expect(pendingWebsite.state).toBe('pending');
    });

    it('should handle processing state', () => {
      const processingWebsite = { ...mockWebsite, state: 'processing' as const };
      expect(processingWebsite.state).toBe('processing');
    });

    it('should handle completed state', () => {
      const completedWebsite = { ...mockWebsite, state: 'completed' as const };
      expect(completedWebsite.state).toBe('completed');
    });

    it('should handle failed state', () => {
      const failedWebsite = { ...mockWebsite, state: 'failed' as const };
      expect(failedWebsite.state).toBe('failed');
    });

    it('should handle retry state', () => {
      const retryWebsite = { ...mockWebsite, state: 'retry' as const };
      expect(retryWebsite.state).toBe('retry');
    });
  });

  describe('Website Authentication', () => {
    it('should handle websites without authentication', () => {
      expect(mockWebsite.requiresAuth).toBe(false);
      expect(mockWebsite.authCredentials).toBeUndefined();
    });

    it('should handle websites with authentication', () => {
      const authWebsite: Website = {
        ...mockWebsite,
        requiresAuth: true,
        authCredentials: {
          websiteId: 'test-website',
          method: 'email',
          username: 'test@example.com',
          password: 'password123'
        }
      };

      expect(authWebsite.requiresAuth).toBe(true);
      expect(authWebsite.authCredentials).toBeDefined();
      expect(authWebsite.authCredentials?.method).toBe('email');
    });
  });

  describe('Website Error Handling', () => {
    it('should handle auth errors', () => {
      const errorWebsite: Website = {
        ...mockWebsite,
        authError: 'Authentication failed',
        authFailed: true
      };

      expect(errorWebsite.authError).toBe('Authentication failed');
      expect(errorWebsite.authFailed).toBe(true);
    });

    it('should handle asset errors', () => {
      const errorWebsite: Website = {
        ...mockWebsite,
        assetError: 'Screenshot generation failed',
        assetFailed: true
      };

      expect(errorWebsite.assetError).toBe('Screenshot generation failed');
      expect(errorWebsite.assetFailed).toBe(true);
    });

    it('should handle manual auth requirements', () => {
      const manualAuthWebsite: Website = {
        ...mockWebsite,
        needsManualAuth: true,
        manualAuthPrompt: 'Please provide credentials manually'
      };

      expect(manualAuthWebsite.needsManualAuth).toBe(true);
      expect(manualAuthWebsite.manualAuthPrompt).toBe('Please provide credentials manually');
    });
  });

  describe('Website Serialization', () => {
    it('should serialize to JSON correctly', () => {
      const json = JSON.stringify(mockWebsite);
      const parsed = JSON.parse(json);
      
      expect(parsed.id).toBe(mockWebsite.id);
      expect(parsed.name).toBe(mockWebsite.name);
      expect(parsed.url).toBe(mockWebsite.url);
    });

    it('should deserialize from JSON correctly', () => {
      const json = JSON.stringify(mockWebsite);
      const parsed = JSON.parse(json) as Website;
      
      expect(parsed).toEqual(mockWebsite);
    });
  });

  describe('Website Comparison', () => {
    it('should compare websites by ID', () => {
      const website1 = { ...mockWebsite, id: 'website-1' };
      const website2 = { ...mockWebsite, id: 'website-2' };
      
      expect(website1.id).not.toBe(website2.id);
    });

    it('should compare websites by URL', () => {
      const website1 = { ...mockWebsite, url: 'https://site1.com' };
      const website2 = { ...mockWebsite, url: 'https://site2.com' };
      
      expect(website1.url).not.toBe(website2.url);
    });
  });
});
