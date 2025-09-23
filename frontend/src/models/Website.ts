export interface Website {
  id: string;
  name: string;
  url: string;
  description: string;
  screenshot: string;
  logo: string;
  favicon: string;
  requiresAuth: boolean;
  authCredentials?: AuthenticationCredentials;
  lastUpdated: string;
  state?: WebsiteState;
  authError?: string;
  needsManualAuth?: boolean;
  assetError?: string;
}

export type WebsiteState = 'pending' | 'processing' | 'completed' | 'failed' | 'retry';

export interface AuthenticationCredentials {
  websiteId: string;
  method: 'email' | 'oauth' | 'sso';
  username?: string;
  password?: string;
  oauthProvider?: string;
  additionalFields?: Record<string, any>;
}

export interface AssetMetadata {
  websiteId: string;
  assetType: 'screenshot' | 'logo' | 'favicon';
  filePath: string;
  fileSize: number;
  dimensions: {
    width: number;
    height: number;
  };
  format: 'png' | 'jpg' | 'webp' | 'svg' | 'ico';
  generatedAt: string;
  optimized: boolean;
}

export class WebsiteModel {
  private websites: Website[] = [];

  constructor(websites: Website[] = []) {
    this.websites = websites;
  }

  /**
   * Load websites from data
   */
  async loadFromData(websites: Website[]): Promise<void> {
    this.websites = websites;
  }

  /**
   * Get all websites
   */
  getAll(): Website[] {
    return this.websites;
  }

  /**
   * Get website by ID
   */
  getById(id: string): Website | undefined {
    return this.websites.find(website => website.id === id);
  }

  /**
   * Add a new website
   */
  add(website: Website): void {
    this.websites.push(website);
  }

  /**
   * Update an existing website
   */
  update(id: string, updates: Partial<Website>): boolean {
    const index = this.websites.findIndex(website => website.id === id);
    if (index === -1) return false;
    
    this.websites[index] = { ...this.websites[index], ...updates };
    return true;
  }

  /**
   * Delete a website
   */
  delete(id: string): boolean {
    const index = this.websites.findIndex(website => website.id === id);
    if (index === -1) return false;
    
    this.websites.splice(index, 1);
    return true;
  }

  /**
   * Validate website data
   */
  validate(website: Website): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!website.id || typeof website.id !== 'string') {
      errors.push('ID is required and must be a string');
    }

    if (!website.name || typeof website.name !== 'string') {
      errors.push('Name is required and must be a string');
    }

    if (!website.url || typeof website.url !== 'string') {
      errors.push('URL is required and must be a string');
    } else if (!this.isValidUrl(website.url)) {
      errors.push('URL must be a valid HTTP/HTTPS URL');
    }

    if (!website.description || typeof website.description !== 'string') {
      errors.push('Description is required and must be a string');
    } else if (website.description.length < 50 || website.description.length > 200) {
      errors.push('Description must be between 50 and 200 characters');
    }

    if (!website.screenshot || typeof website.screenshot !== 'string') {
      errors.push('Screenshot path is required and must be a string');
    }

    if (!website.logo || typeof website.logo !== 'string') {
      errors.push('Logo path is required and must be a string');
    }

    if (!website.favicon || typeof website.favicon !== 'string') {
      errors.push('Favicon path is required and must be a string');
    }

    if (typeof website.requiresAuth !== 'boolean') {
      errors.push('requiresAuth must be a boolean');
    }

    if (!website.lastUpdated || typeof website.lastUpdated !== 'string') {
      errors.push('lastUpdated is required and must be a string');
    } else if (!this.isValidDate(website.lastUpdated)) {
      errors.push('lastUpdated must be a valid ISO date string');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate URL format
   */
  private isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * Validate date format
   */
  private isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && date.toISOString() === dateString;
  }
}
