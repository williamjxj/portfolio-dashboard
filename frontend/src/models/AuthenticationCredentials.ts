export interface AuthenticationCredentials {
  websiteId: string;
  method: 'email' | 'oauth' | 'sso';
  username?: string;
  password?: string;
  oauthProvider?: string;
  additionalFields?: Record<string, any>;
}

export class AuthenticationCredentialsModel {
  private credentials: AuthenticationCredentials[] = [];

  constructor(credentials: AuthenticationCredentials[] = []) {
    this.credentials = credentials;
  }

  /**
   * Get credentials for a website
   */
  getByWebsiteId(websiteId: string): AuthenticationCredentials | undefined {
    return this.credentials.find(cred => cred.websiteId === websiteId);
  }

  /**
   * Add credentials for a website
   */
  add(credentials: AuthenticationCredentials): void {
    const existingIndex = this.credentials.findIndex(cred => cred.websiteId === credentials.websiteId);
    if (existingIndex !== -1) {
      this.credentials[existingIndex] = credentials;
    } else {
      this.credentials.push(credentials);
    }
  }

  /**
   * Update credentials for a website
   */
  update(websiteId: string, updates: Partial<AuthenticationCredentials>): boolean {
    const index = this.credentials.findIndex(cred => cred.websiteId === websiteId);
    if (index === -1) return false;
    
    this.credentials[index] = { ...this.credentials[index], ...updates };
    return true;
  }

  /**
   * Delete credentials for a website
   */
  delete(websiteId: string): boolean {
    const index = this.credentials.findIndex(cred => cred.websiteId === websiteId);
    if (index === -1) return false;
    
    this.credentials.splice(index, 1);
    return true;
  }

  /**
   * Validate credentials data
   */
  validate(credentials: AuthenticationCredentials): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!credentials.websiteId || typeof credentials.websiteId !== 'string') {
      errors.push('websiteId is required and must be a string');
    }

    if (!credentials.method || !['email', 'oauth', 'sso'].includes(credentials.method)) {
      errors.push('method must be one of: email, oauth, sso');
    }

    // Validate based on method
    if (credentials.method === 'email') {
      if (!credentials.username || typeof credentials.username !== 'string') {
        errors.push('username is required for email authentication');
      }
      if (!credentials.password || typeof credentials.password !== 'string') {
        errors.push('password is required for email authentication');
      }
    }

    if (credentials.method === 'oauth') {
      if (!credentials.oauthProvider || typeof credentials.oauthProvider !== 'string') {
        errors.push('oauthProvider is required for OAuth authentication');
      }
    }

    if (credentials.additionalFields && typeof credentials.additionalFields !== 'object') {
      errors.push('additionalFields must be an object');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if credentials exist for a website
   */
  hasCredentials(websiteId: string): boolean {
    return this.credentials.some(cred => cred.websiteId === websiteId);
  }

  /**
   * Get all credentials
   */
  getAll(): AuthenticationCredentials[] {
    return this.credentials;
  }

  /**
   * Clear all credentials
   */
  clear(): void {
    this.credentials = [];
  }
}
