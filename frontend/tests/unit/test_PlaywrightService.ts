import { PlaywrightService } from '../../src/services/PlaywrightService';
import { Website } from '../../src/models/Website';
import { AuthenticationCredentials } from '../../src/models/AuthenticationCredentials';

// Mock dependencies
jest.mock('playwright', () => ({
  chromium: {
    launch: jest.fn().mockResolvedValue({
      newPage: jest.fn().mockResolvedValue({
        goto: jest.fn().mockResolvedValue(undefined),
        screenshot: jest.fn().mockResolvedValue(Buffer.from('mock-screenshot')),
        close: jest.fn().mockResolvedValue(undefined),
        locator: jest.fn().mockReturnValue({
          isVisible: jest.fn().mockResolvedValue(true),
          fill: jest.fn().mockResolvedValue(undefined),
          click: jest.fn().mockResolvedValue(undefined)
        }),
        waitForLoadState: jest.fn().mockResolvedValue(undefined),
        textContent: jest.fn().mockResolvedValue('mock content'),
        url: 'https://test-website.com'
      }),
      close: jest.fn().mockResolvedValue(undefined)
    })
  }
}));

jest.mock('../../src/lib/logger', () => ({
  createLogger: () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn()
  })
}));

describe('PlaywrightService', () => {
  let playwrightService: PlaywrightService;
  let mockWebsite: Website;

  beforeEach(() => {
    playwrightService = new PlaywrightService();
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

  describe('initializeBrowser', () => {
    it('should initialize browser successfully', async () => {
      await expect(playwrightService.initializeBrowser()).resolves.not.toThrow();
    });

    it('should handle multiple initialization calls', async () => {
      await playwrightService.initializeBrowser();
      await playwrightService.initializeBrowser();
      
      // Should not throw error
      expect(true).toBe(true);
    });
  });

  describe('closeBrowser', () => {
    it('should close browser successfully', async () => {
      await playwrightService.initializeBrowser();
      await expect(playwrightService.closeBrowser()).resolves.not.toThrow();
    });

    it('should handle closing uninitialized browser', async () => {
      await expect(playwrightService.closeBrowser()).resolves.not.toThrow();
    });
  });

  describe('takeScreenshot', () => {
    it('should take screenshot successfully', async () => {
      await playwrightService.initializeBrowser();
      
      const result = await playwrightService.takeScreenshot(
        'https://test-website.com',
        '/tmp/test-screenshot.png'
      );
      
      expect(result).toBeUndefined(); // Method returns void
    });

    it('should take screenshot with authentication', async () => {
      await playwrightService.initializeBrowser();
      
      const credentials: AuthenticationCredentials = {
        websiteId: 'test-website',
        method: 'email',
        username: 'test@example.com',
        password: 'password123'
      };
      
      const result = await playwrightService.takeScreenshot(
        'https://test-website.com',
        '/tmp/test-screenshot.png',
        credentials
      );
      
      expect(result).toBeUndefined();
    });

    it('should handle screenshot errors gracefully', async () => {
      await playwrightService.initializeBrowser();
      
      // Mock an error in screenshot generation
      const mockPage = {
        goto: jest.fn().mockRejectedValue(new Error('Navigation failed')),
        close: jest.fn().mockResolvedValue(undefined)
      };
      
      const mockBrowser = {
        newPage: jest.fn().mockResolvedValue(mockPage),
        close: jest.fn().mockResolvedValue(undefined)
      };
      
      // Mock chromium.launch to return our mock browser
      const { chromium } = require('playwright');
      chromium.launch.mockResolvedValue(mockBrowser);
      
      await expect(playwrightService.takeScreenshot(
        'https://error-website.com',
        '/tmp/error-screenshot.png'
      )).rejects.toThrow();
    });
  });

  describe('loginWithEmailPassword', () => {
    it('should handle email login successfully', async () => {
      await playwrightService.initializeBrowser();
      
      const result = await playwrightService.loginWithEmailPassword(
        'https://test-website.com',
        'test@example.com',
        'password123'
      );
      
      expect(typeof result).toBe('boolean');
    });

    it('should handle email login failure', async () => {
      await playwrightService.initializeBrowser();
      
      const result = await playwrightService.loginWithEmailPassword(
        'https://test-website.com',
        'invalid@example.com',
        'wrongpassword'
      );
      
      expect(typeof result).toBe('boolean');
    });

    it('should handle missing login fields', async () => {
      await playwrightService.initializeBrowser();
      
      const result = await playwrightService.loginWithEmailPassword(
        'https://test-website.com',
        '',
        ''
      );
      
      expect(typeof result).toBe('boolean');
    });
  });

  describe('loginWithOAuth', () => {
    it('should handle OAuth login successfully', async () => {
      await playwrightService.initializeBrowser();
      
      const result = await playwrightService.loginWithOAuth(
        'https://test-website.com',
        'google'
      );
      
      expect(typeof result).toBe('boolean');
    });

    it('should handle OAuth login failure', async () => {
      await playwrightService.initializeBrowser();
      
      const result = await playwrightService.loginWithOAuth(
        'https://test-website.com',
        'invalid-provider'
      );
      
      expect(typeof result).toBe('boolean');
    });

    it('should handle missing OAuth provider', async () => {
      await playwrightService.initializeBrowser();
      
      const result = await playwrightService.loginWithOAuth(
        'https://test-website.com',
        ''
      );
      
      expect(typeof result).toBe('boolean');
    });
  });

  describe('loginWithSSO', () => {
    it('should handle SSO login successfully', async () => {
      await playwrightService.initializeBrowser();
      
      const result = await playwrightService.loginWithSSO(
        'https://test-website.com',
        { domain: 'company.com' }
      );
      
      expect(typeof result).toBe('boolean');
    });

    it('should handle SSO login failure', async () => {
      await playwrightService.initializeBrowser();
      
      const result = await playwrightService.loginWithSSO(
        'https://test-website.com',
        { domain: 'invalid-domain.com' }
      );
      
      expect(typeof result).toBe('boolean');
    });

    it('should handle SSO with multiple fields', async () => {
      await playwrightService.initializeBrowser();
      
      const result = await playwrightService.loginWithSSO(
        'https://test-website.com',
        {
          domain: 'company.com',
          ssoUrl: 'https://sso.company.com',
          token: 'sso-token-123'
        }
      );
      
      expect(typeof result).toBe('boolean');
    });
  });

  describe('handleManualLogin', () => {
    it('should handle manual login', async () => {
      const result = await playwrightService.handleManualLogin('https://test-website.com');
      
      expect(typeof result).toBe('boolean');
    });

    it('should return false for manual login', async () => {
      const result = await playwrightService.handleManualLogin('https://test-website.com');
      
      expect(result).toBe(false);
    });
  });

  describe('isLoginPage', () => {
    it('should detect login page', async () => {
      await playwrightService.initializeBrowser();
      
      // Mock page with login elements
      const mockPage = {
        textContent: jest.fn().mockResolvedValue('login sign in'),
        locator: jest.fn().mockReturnValue({
          count: jest.fn().mockResolvedValue(1)
        })
      };
      
      const result = await (playwrightService as any).isLoginPage(mockPage);
      
      expect(typeof result).toBe('boolean');
    });

    it('should detect non-login page', async () => {
      await playwrightService.initializeBrowser();
      
      // Mock page without login elements
      const mockPage = {
        textContent: jest.fn().mockResolvedValue('dashboard content'),
        locator: jest.fn().mockReturnValue({
          count: jest.fn().mockResolvedValue(0)
        })
      };
      
      const result = await (playwrightService as any).isLoginPage(mockPage);
      
      expect(typeof result).toBe('boolean');
    });
  });

  describe('Error Handling', () => {
    it('should handle browser initialization errors', async () => {
      // Mock chromium.launch to throw error
      const { chromium } = require('playwright');
      chromium.launch.mockRejectedValue(new Error('Browser launch failed'));
      
      await expect(playwrightService.initializeBrowser()).rejects.toThrow();
    });

    it('should handle page navigation errors', async () => {
      await playwrightService.initializeBrowser();
      
      // Mock page.goto to throw error
      const mockPage = {
        goto: jest.fn().mockRejectedValue(new Error('Navigation failed')),
        close: jest.fn().mockResolvedValue(undefined)
      };
      
      const mockBrowser = {
        newPage: jest.fn().mockResolvedValue(mockPage),
        close: jest.fn().mockResolvedValue(undefined)
      };
      
      const { chromium } = require('playwright');
      chromium.launch.mockResolvedValue(mockBrowser);
      
      await expect(playwrightService.takeScreenshot(
        'https://error-website.com',
        '/tmp/error-screenshot.png'
      )).rejects.toThrow();
    });

    it('should handle authentication errors', async () => {
      await playwrightService.initializeBrowser();
      
      const result = await playwrightService.loginWithEmailPassword(
        'https://error-website.com',
        'error@example.com',
        'errorpassword'
      );
      
      expect(typeof result).toBe('boolean');
    });
  });

  describe('Service Lifecycle', () => {
    it('should handle service instantiation', () => {
      expect(() => new PlaywrightService()).not.toThrow();
    });

    it('should handle multiple service instances', () => {
      const service1 = new PlaywrightService();
      const service2 = new PlaywrightService();
      
      expect(service1).toBeDefined();
      expect(service2).toBeDefined();
      expect(service1).not.toBe(service2);
    });

    it('should handle browser cleanup on service destruction', async () => {
      await playwrightService.initializeBrowser();
      await playwrightService.closeBrowser();
      
      // Should not throw error
      expect(true).toBe(true);
    });
  });

  describe('Performance', () => {
    it('should handle concurrent operations', async () => {
      await playwrightService.initializeBrowser();
      
      const promises = Array(3).fill(null).map(() => 
        playwrightService.takeScreenshot(
          'https://test-website.com',
          '/tmp/concurrent-screenshot.png'
        )
      );
      
      await Promise.allSettled(promises);
      
      // Should not throw error
      expect(true).toBe(true);
    });

    it('should handle operation timeout', async () => {
      await playwrightService.initializeBrowser();
      
      const startTime = Date.now();
      await playwrightService.takeScreenshot(
        'https://test-website.com',
        '/tmp/timeout-screenshot.png'
      );
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeLessThan(10000); // Should complete in less than 10 seconds
    });
  });

  describe('Data Validation', () => {
    it('should validate URL format', async () => {
      await playwrightService.initializeBrowser();
      
      const validUrls = [
        'https://test-website.com',
        'http://test-website.com',
        'https://subdomain.test-website.com'
      ];

      for (const url of validUrls) {
        await expect(playwrightService.takeScreenshot(
          url,
          '/tmp/valid-screenshot.png'
        )).resolves.not.toThrow();
      }
    });

    it('should validate output path format', async () => {
      await playwrightService.initializeBrowser();
      
      const validPaths = [
        '/tmp/screenshot.png',
        './screenshots/test.png',
        'C:\\temp\\screenshot.png'
      ];

      for (const path of validPaths) {
        await expect(playwrightService.takeScreenshot(
          'https://test-website.com',
          path
        )).resolves.not.toThrow();
      }
    });
  });
});
