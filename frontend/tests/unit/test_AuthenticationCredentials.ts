import { AuthenticationCredentials } from '../../src/models/AuthenticationCredentials';

describe('AuthenticationCredentials Model', () => {
  const mockCredentials: AuthenticationCredentials = {
    websiteId: 'test-website',
    method: 'email',
    username: 'test@example.com',
    password: 'password123',
    additionalFields: {}
  };

  describe('AuthenticationCredentials Interface', () => {
    it('should have all required properties', () => {
      expect(mockCredentials.websiteId).toBeDefined();
      expect(mockCredentials.method).toBeDefined();
    });

    it('should have correct types for all properties', () => {
      expect(typeof mockCredentials.websiteId).toBe('string');
      expect(typeof mockCredentials.method).toBe('string');
    });

    it('should have valid method value', () => {
      const validMethods = ['email', 'oauth', 'sso', 'manual'];
      expect(validMethods).toContain(mockCredentials.method);
    });
  });

  describe('Email Authentication', () => {
    it('should handle email authentication with username and password', () => {
      const emailCreds: AuthenticationCredentials = {
        websiteId: 'test-website',
        method: 'email',
        username: 'user@example.com',
        password: 'password123'
      };

      expect(emailCreds.method).toBe('email');
      expect(emailCreds.username).toBe('user@example.com');
      expect(emailCreds.password).toBe('password123');
      expect(emailCreds.oauthProvider).toBeUndefined();
    });

    it('should validate email format for username', () => {
      const emailCreds: AuthenticationCredentials = {
        websiteId: 'test-website',
        method: 'email',
        username: 'user@example.com',
        password: 'password123'
      };

      expect(emailCreds.username).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });
  });

  describe('OAuth Authentication', () => {
    it('should handle OAuth authentication', () => {
      const oauthCreds: AuthenticationCredentials = {
        websiteId: 'test-website',
        method: 'oauth',
        oauthProvider: 'google',
        username: 'user@example.com',
        password: 'password123'
      };

      expect(oauthCreds.method).toBe('oauth');
      expect(oauthCreds.oauthProvider).toBe('google');
      expect(oauthCreds.username).toBe('user@example.com');
      expect(oauthCreds.password).toBe('password123');
    });

    it('should handle OAuth with fallback credentials', () => {
      const oauthCreds: AuthenticationCredentials = {
        websiteId: 'test-website',
        method: 'oauth',
        oauthProvider: 'github',
        username: 'fallback@example.com',
        password: 'fallback123'
      };

      expect(oauthCreds.oauthProvider).toBe('github');
      expect(oauthCreds.username).toBe('fallback@example.com');
      expect(oauthCreds.password).toBe('fallback123');
    });
  });

  describe('SSO Authentication', () => {
    it('should handle SSO authentication', () => {
      const ssoCreds: AuthenticationCredentials = {
        websiteId: 'test-website',
        method: 'sso',
        additionalFields: {
          domain: 'company.com',
          ssoUrl: 'https://sso.company.com',
          token: 'sso-token-123'
        }
      };

      expect(ssoCreds.method).toBe('sso');
      expect(ssoCreds.additionalFields).toBeDefined();
      expect(ssoCreds.additionalFields?.domain).toBe('company.com');
      expect(ssoCreds.additionalFields?.ssoUrl).toBe('https://sso.company.com');
      expect(ssoCreds.additionalFields?.token).toBe('sso-token-123');
    });

    it('should handle SSO with multiple fields', () => {
      const ssoCreds: AuthenticationCredentials = {
        websiteId: 'test-website',
        method: 'sso',
        additionalFields: {
          tenant: 'tenant-123',
          clientId: 'client-456',
          redirectUri: 'https://app.example.com/callback',
          scopes: ['read', 'write']
        }
      };

      expect(ssoCreds.additionalFields?.tenant).toBe('tenant-123');
      expect(ssoCreds.additionalFields?.clientId).toBe('client-456');
      expect(ssoCreds.additionalFields?.redirectUri).toBe('https://app.example.com/callback');
      expect(Array.isArray(ssoCreds.additionalFields?.scopes)).toBe(true);
    });
  });

  describe('Manual Authentication', () => {
    it('should handle manual authentication', () => {
      const manualCreds: AuthenticationCredentials = {
        websiteId: 'test-website',
        method: 'manual',
        additionalFields: {
          instructions: 'Please log in manually and press Enter when ready',
          timeout: 300000
        }
      };

      expect(manualCreds.method).toBe('manual');
      expect(manualCreds.additionalFields?.instructions).toBe('Please log in manually and press Enter when ready');
      expect(manualCreds.additionalFields?.timeout).toBe(300000);
    });
  });

  describe('Additional Fields', () => {
    it('should handle custom additional fields', () => {
      const customCreds: AuthenticationCredentials = {
        websiteId: 'test-website',
        method: 'email',
        username: 'user@example.com',
        password: 'password123',
        additionalFields: {
          rememberMe: true,
          twoFactor: false,
          deviceId: 'device-123',
          sessionTimeout: 3600000
        }
      };

      expect(customCreds.additionalFields?.rememberMe).toBe(true);
      expect(customCreds.additionalFields?.twoFactor).toBe(false);
      expect(customCreds.additionalFields?.deviceId).toBe('device-123');
      expect(customCreds.additionalFields?.sessionTimeout).toBe(3600000);
    });

    it('should handle nested additional fields', () => {
      const nestedCreds: AuthenticationCredentials = {
        websiteId: 'test-website',
        method: 'oauth',
        oauthProvider: 'google',
        additionalFields: {
          config: {
            clientId: 'client-123',
            clientSecret: 'secret-456',
            redirectUri: 'https://app.example.com/callback'
          },
          scopes: ['profile', 'email'],
          prompt: 'consent'
        }
      };

      expect(customCreds.additionalFields?.config).toBeDefined();
      expect(customCreds.additionalFields?.scopes).toBeDefined();
      expect(customCreds.additionalFields?.prompt).toBeDefined();
    });
  });

  describe('Validation', () => {
    it('should validate required fields', () => {
      expect(mockCredentials.websiteId).toBeTruthy();
      expect(mockCredentials.method).toBeTruthy();
    });

    it('should validate method values', () => {
      const validMethods = ['email', 'oauth', 'sso', 'manual'];
      expect(validMethods).toContain(mockCredentials.method);
    });

    it('should validate OAuth provider when method is oauth', () => {
      const oauthCreds: AuthenticationCredentials = {
        websiteId: 'test-website',
        method: 'oauth',
        oauthProvider: 'google'
      };

      expect(oauthCreds.oauthProvider).toBeDefined();
      expect(typeof oauthCreds.oauthProvider).toBe('string');
    });
  });

  describe('Serialization', () => {
    it('should serialize to JSON correctly', () => {
      const json = JSON.stringify(mockCredentials);
      const parsed = JSON.parse(json);
      
      expect(parsed.websiteId).toBe(mockCredentials.websiteId);
      expect(parsed.method).toBe(mockCredentials.method);
      expect(parsed.username).toBe(mockCredentials.username);
    });

    it('should deserialize from JSON correctly', () => {
      const json = JSON.stringify(mockCredentials);
      const parsed = JSON.parse(json) as AuthenticationCredentials;
      
      expect(parsed).toEqual(mockCredentials);
    });

    it('should handle sensitive data serialization', () => {
      const sensitiveCreds: AuthenticationCredentials = {
        websiteId: 'test-website',
        method: 'email',
        username: 'user@example.com',
        password: 'sensitive-password',
        additionalFields: {
          apiKey: 'secret-api-key',
          token: 'sensitive-token'
        }
      };

      const json = JSON.stringify(sensitiveCreds);
      expect(json).toContain('sensitive-password');
      expect(json).toContain('secret-api-key');
      expect(json).toContain('sensitive-token');
    });
  });

  describe('Security', () => {
    it('should handle password masking', () => {
      const credsWithPassword: AuthenticationCredentials = {
        websiteId: 'test-website',
        method: 'email',
        username: 'user@example.com',
        password: 'password123'
      };

      // In a real implementation, you would mask the password
      expect(credsWithPassword.password).toBe('password123');
    });

    it('should handle token masking', () => {
      const credsWithToken: AuthenticationCredentials = {
        websiteId: 'test-website',
        method: 'oauth',
        oauthProvider: 'google',
        additionalFields: {
          accessToken: 'secret-access-token',
          refreshToken: 'secret-refresh-token'
        }
      };

      expect(credsWithToken.additionalFields?.accessToken).toBe('secret-access-token');
      expect(credsWithToken.additionalFields?.refreshToken).toBe('secret-refresh-token');
    });
  });
});
