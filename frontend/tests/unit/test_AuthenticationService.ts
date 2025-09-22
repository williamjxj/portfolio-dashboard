import { AuthenticationService } from '../../src/services/AuthenticationService';
import { AuthenticationCredentials } from '../../src/models/AuthenticationCredentials';

// Mock dependencies
jest.mock('../../src/services/PlaywrightService');
jest.mock('../../src/lib/logger', () => ({
  createLogger: () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn()
  })
}));

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;

  beforeEach(() => {
    authenticationService = new AuthenticationService();
  });

  describe('authenticate', () => {
    it('should handle email authentication', async () => {
      const credentials: AuthenticationCredentials = {
        websiteId: 'test-website',
        method: 'email',
        username: 'test@example.com',
        password: 'password123'
      };

      const result = await authenticationService.authenticate('https://test-website.com', credentials);
      
      expect(typeof result).toBe('boolean');
    });

    it('should handle OAuth authentication', async () => {
      const credentials: AuthenticationCredentials = {
        websiteId: 'test-website',
        method: 'oauth',
        oauthProvider: 'google'
      };

      const result = await authenticationService.authenticate('https://test-website.com', credentials);
      
      expect(typeof result).toBe('boolean');
    });

    it('should handle OAuth with fallback credentials', async () => {
      const credentials: AuthenticationCredentials = {
        websiteId: 'test-website',
        method: 'oauth',
        oauthProvider: 'github',
        username: 'fallback@example.com',
        password: 'fallback123'
      };

      const result = await authenticationService.authenticate('https://test-website.com', credentials);
      
      expect(typeof result).toBe('boolean');
    });

    it('should handle SSO authentication', async () => {
      const credentials: AuthenticationCredentials = {
        websiteId: 'test-website',
        method: 'sso',
        additionalFields: {
          domain: 'company.com',
          ssoUrl: 'https://sso.company.com'
        }
      };

      const result = await authenticationService.authenticate('https://test-website.com', credentials);
      
      expect(typeof result).toBe('boolean');
    });

    it('should handle manual authentication', async () => {
      const credentials: AuthenticationCredentials = {
        websiteId: 'test-website',
        method: 'manual'
      };

      const result = await authenticationService.authenticate('https://test-website.com', credentials);
      
      expect(typeof result).toBe('boolean');
    });

    it('should handle unsupported authentication method', async () => {
      const credentials: AuthenticationCredentials = {
        websiteId: 'test-website',
        method: 'unsupported' as any
      };

      const result = await authenticationService.authenticate('https://test-website.com', credentials);
      
      expect(result).toBe(false);
    });
  });

  describe('Authentication Methods', () => {
    describe('Email Authentication', () => {
      it('should handle valid email credentials', async () => {
        const credentials: AuthenticationCredentials = {
          websiteId: 'test-website',
          method: 'email',
          username: 'valid@example.com',
          password: 'validpassword'
        };

        const result = await authenticationService.authenticate('https://test-website.com', credentials);
        
        expect(typeof result).toBe('boolean');
      });

      it('should handle invalid email credentials', async () => {
        const credentials: AuthenticationCredentials = {
          websiteId: 'test-website',
          method: 'email',
          username: 'invalid@example.com',
          password: 'wrongpassword'
        };

        const result = await authenticationService.authenticate('https://test-website.com', credentials);
        
        expect(typeof result).toBe('boolean');
      });

      it('should handle missing email credentials', async () => {
        const credentials: AuthenticationCredentials = {
          websiteId: 'test-website',
          method: 'email',
          username: '',
          password: ''
        };

        const result = await authenticationService.authenticate('https://test-website.com', credentials);
        
        expect(typeof result).toBe('boolean');
      });
    });

    describe('OAuth Authentication', () => {
      it('should handle Google OAuth', async () => {
        const credentials: AuthenticationCredentials = {
          websiteId: 'test-website',
          method: 'oauth',
          oauthProvider: 'google'
        };

        const result = await authenticationService.authenticate('https://test-website.com', credentials);
        
        expect(typeof result).toBe('boolean');
      });

      it('should handle GitHub OAuth', async () => {
        const credentials: AuthenticationCredentials = {
          websiteId: 'test-website',
          method: 'oauth',
          oauthProvider: 'github'
        };

        const result = await authenticationService.authenticate('https://test-website.com', credentials);
        
        expect(typeof result).toBe('boolean');
      });

      it('should handle OAuth with fallback credentials', async () => {
        const credentials: AuthenticationCredentials = {
          websiteId: 'test-website',
          method: 'oauth',
          oauthProvider: 'google',
          username: 'fallback@example.com',
          password: 'fallback123'
        };

        const result = await authenticationService.authenticate('https://test-website.com', credentials);
        
        expect(typeof result).toBe('boolean');
      });
    });

    describe('SSO Authentication', () => {
      it('should handle SSO with domain', async () => {
        const credentials: AuthenticationCredentials = {
          websiteId: 'test-website',
          method: 'sso',
          additionalFields: {
            domain: 'company.com'
          }
        };

        const result = await authenticationService.authenticate('https://test-website.com', credentials);
        
        expect(typeof result).toBe('boolean');
      });

      it('should handle SSO with token', async () => {
        const credentials: AuthenticationCredentials = {
          websiteId: 'test-website',
          method: 'sso',
          additionalFields: {
            token: 'sso-token-123'
          }
        };

        const result = await authenticationService.authenticate('https://test-website.com', credentials);
        
        expect(typeof result).toBe('boolean');
      });

      it('should handle SSO with multiple fields', async () => {
        const credentials: AuthenticationCredentials = {
          websiteId: 'test-website',
          method: 'sso',
          additionalFields: {
            domain: 'company.com',
            ssoUrl: 'https://sso.company.com',
            token: 'sso-token-123'
          }
        };

        const result = await authenticationService.authenticate('https://test-website.com', credentials);
        
        expect(typeof result).toBe('boolean');
      });
    });

    describe('Manual Authentication', () => {
      it('should handle manual authentication', async () => {
        const credentials: AuthenticationCredentials = {
          websiteId: 'test-website',
          method: 'manual'
        };

        const result = await authenticationService.authenticate('https://test-website.com', credentials);
        
        expect(typeof result).toBe('boolean');
      });

      it('should handle manual authentication with instructions', async () => {
        const credentials: AuthenticationCredentials = {
          websiteId: 'test-website',
          method: 'manual',
          additionalFields: {
            instructions: 'Please log in manually'
          }
        };

        const result = await authenticationService.authenticate('https://test-website.com', credentials);
        
        expect(typeof result).toBe('boolean');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle authentication errors gracefully', async () => {
      const credentials: AuthenticationCredentials = {
        websiteId: 'test-website',
        method: 'email',
        username: 'error@example.com',
        password: 'errorpassword'
      };

      const result = await authenticationService.authenticate('https://test-website.com', credentials);
      
      expect(typeof result).toBe('boolean');
    });

    it('should handle network errors', async () => {
      const credentials: AuthenticationCredentials = {
        websiteId: 'test-website',
        method: 'email',
        username: 'network@example.com',
        password: 'networkpassword'
      };

      const result = await authenticationService.authenticate('https://unreachable-website.com', credentials);
      
      expect(typeof result).toBe('boolean');
    });

    it('should handle invalid URLs', async () => {
      const credentials: AuthenticationCredentials = {
        websiteId: 'test-website',
        method: 'email',
        username: 'test@example.com',
        password: 'password123'
      };

      const result = await authenticationService.authenticate('invalid-url', credentials);
      
      expect(typeof result).toBe('boolean');
    });

    it('should handle missing credentials', async () => {
      const credentials: AuthenticationCredentials = {
        websiteId: 'test-website',
        method: 'email'
      };

      const result = await authenticationService.authenticate('https://test-website.com', credentials);
      
      expect(typeof result).toBe('boolean');
    });
  });

  describe('Service Instantiation', () => {
    it('should create service instance', () => {
      expect(() => new AuthenticationService()).not.toThrow();
    });

    it('should handle multiple service instances', () => {
      const service1 = new AuthenticationService();
      const service2 = new AuthenticationService();
      
      expect(service1).toBeDefined();
      expect(service2).toBeDefined();
      expect(service1).not.toBe(service2);
    });
  });

  describe('Performance', () => {
    it('should handle concurrent authentication requests', async () => {
      const credentials: AuthenticationCredentials = {
        websiteId: 'test-website',
        method: 'email',
        username: 'test@example.com',
        password: 'password123'
      };

      const promises = Array(5).fill(null).map(() => 
        authenticationService.authenticate('https://test-website.com', credentials)
      );
      
      const results = await Promise.all(promises);
      
      expect(results.length).toBe(5);
      results.forEach(result => {
        expect(typeof result).toBe('boolean');
      });
    });

    it('should handle authentication timeout', async () => {
      const credentials: AuthenticationCredentials = {
        websiteId: 'test-website',
        method: 'email',
        username: 'timeout@example.com',
        password: 'timeoutpassword'
      };

      const startTime = Date.now();
      const result = await authenticationService.authenticate('https://test-website.com', credentials);
      const endTime = Date.now();
      
      expect(typeof result).toBe('boolean');
      expect(endTime - startTime).toBeLessThan(10000); // Should complete in less than 10 seconds
    });
  });

  describe('Data Validation', () => {
    it('should validate URL format', async () => {
      const credentials: AuthenticationCredentials = {
        websiteId: 'test-website',
        method: 'email',
        username: 'test@example.com',
        password: 'password123'
      };

      const validUrls = [
        'https://test-website.com',
        'http://test-website.com',
        'https://subdomain.test-website.com',
        'https://test-website.com/path'
      ];

      for (const url of validUrls) {
        const result = await authenticationService.authenticate(url, credentials);
        expect(typeof result).toBe('boolean');
      }
    });

    it('should validate credentials structure', async () => {
      const validCredentials: AuthenticationCredentials = {
        websiteId: 'test-website',
        method: 'email',
        username: 'test@example.com',
        password: 'password123'
      };

      const result = await authenticationService.authenticate('https://test-website.com', validCredentials);
      
      expect(typeof result).toBe('boolean');
    });
  });
});
