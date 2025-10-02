import { TechStackInfo } from './TechStack';

export interface Website {
  id: string;
  name: string;
  url: string;
  description: string;
  // legacy fields kept for backward compatibility in services/components
  screenshot?: string;
  logo?: string;
  favicon?: string;
  // new fields aligned with specs/contracts
  screenshotUrl?: string | null;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  tags?: string[];
  status?: 'ok' | 'unavailable' | 'missing-assets';
  requiresAuth: boolean;
  authCredentials?: any;
  lastUpdated: string;
  state?: WebsiteState;
  authError?: string;
  needsManualAuth?: boolean;
  assetError?: string;
  // Enhanced fields for comprehensive dashboard
  techStack?: TechStackInfo;
  deploymentInfo?: DeploymentInfo;
  features?: string[];
  demoVideo?: string;
  
  // Enhanced fields for visual improvements
  assets: {
    logo?: string;
    favicon?: string;
    screenshots: string[];
    videos?: string[];
    thumbnails?: string[];
  };
  
  // Visual metadata
  visualMetadata: {
    primaryColor?: string;
    secondaryColor?: string;
    theme?: 'light' | 'dark' | 'auto';
    layout?: 'grid' | 'list';
  };
  
  // Performance metadata
  performance: {
    loadTime?: number;
    imageCount: number;
    videoCount: number;
    lastOptimized: string;
  };
}

export interface TechStack {
  frontend: string[];
  backend: string[];
  database: string[];
  deployment: string[];
  aiTools: string[];
  other: string[];
}

export interface DeploymentInfo {
  platform: 'vercel' | 'netlify' | 'aws' | 'other';
  url: string;
  status: 'live' | 'staging' | 'development';
  lastDeployed?: string;
  supabaseProject?: string;
  supabaseUrl?: string;
  githubRepo?: string;
}

export type WebsiteState = 'pending' | 'processing' | 'completed' | 'failed' | 'retry';


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

    // allow either legacy asset fields or new *Url fields
    const hasScreenshot = typeof website.screenshot === 'string' || typeof website.screenshotUrl === 'string';
    const hasLogo = typeof website.logo === 'string' || typeof website.logoUrl === 'string';
    const hasFavicon = typeof website.favicon === 'string' || typeof website.faviconUrl === 'string';
    if (!hasScreenshot) {
      errors.push('Screenshot is required');
    }
    if (!hasLogo) {
      errors.push('Logo is required');
    }
    if (!hasFavicon) {
      errors.push('Favicon is required');
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
