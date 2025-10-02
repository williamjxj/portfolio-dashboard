import { Website } from '@/models/Website';
import { AuthenticationCredentials } from '@/models/Website';
import { AssetMetadata } from '@/models/Website';
import { TechStackInfo } from '@/models/TechStack';
import fs from 'fs/promises';
import path from 'path';

export class DataLoader {
  private dataDir: string;
  private cache: Map<string, any> = new Map();
  private cacheTimeout: number = 5 * 60 * 1000; // 5 minutes

  constructor(dataDir: string = './data') {
    this.dataDir = dataDir;
  }

  /**
   * Load websites from JSON file with tech stack data and caching
   */
  async loadWebsites(): Promise<Website[]> {
    const cacheKey = 'websites';
    const cached = this.getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const websitesPath = path.join(this.dataDir, 'websites.json');
      const data = await fs.readFile(websitesPath, 'utf-8');
      const websites = JSON.parse(data);
      
      // Ensure all websites have tech stack data
      const processedWebsites = websites.map((website: Website) => ({
        ...website,
        techStack: website.techStack || this.getDefaultTechStack()
      }));

      // Cache the processed data
      this.setCachedData(cacheKey, processedWebsites);
      
      return processedWebsites;
    } catch {
      console.warn('No websites.json found, returning empty array');
      return [];
    }
  }

  /**
   * Get default tech stack for websites without tech stack data
   */
  private getDefaultTechStack(): TechStackInfo {
    return {
      frontend: [],
      backend: [],
      database: [],
      deployment: [],
      aiTools: [],
      other: [],
      source: new Date().toISOString()
    };
  }

  /**
   * Load authentication credentials from JSON file
   */
  async loadAuthCredentials(): Promise<AuthenticationCredentials[]> {
    try {
      const authPath = path.join(this.dataDir, 'auth-credentials.json');
      const data = await fs.readFile(authPath, 'utf-8');
      const authData = JSON.parse(data);
      
      // Convert object to array
      return Object.values(authData);
    } catch {
      console.warn('No auth-credentials.json found, returning empty array');
      return [];
    }
  }

  /**
   * Load asset metadata from storage
   */
  async loadAssetMetadata(): Promise<AssetMetadata[]> {
    try {
      const assetsPath = path.join(this.dataDir, 'assets.json');
      const data = await fs.readFile(assetsPath, 'utf-8');
      return JSON.parse(data);
    } catch {
      console.warn('No assets.json found, returning empty array');
      return [];
    }
  }

  /**
   * Save websites to JSON file
   */
  async saveWebsites(websites: Website[]): Promise<void> {
    const websitesPath = path.join(this.dataDir, 'websites.json');
    await fs.writeFile(websitesPath, JSON.stringify(websites, null, 2));
  }

  /**
   * Save authentication credentials to JSON file
   */
  async saveAuthCredentials(credentials: AuthenticationCredentials[]): Promise<void> {
    const authPath = path.join(this.dataDir, 'auth-credentials.json');
    const authData = credentials.reduce((acc, cred) => {
      acc[cred.websiteId] = cred;
      return acc;
    }, {} as Record<string, AuthenticationCredentials>);
    
    await fs.writeFile(authPath, JSON.stringify(authData, null, 2));
  }

  /**
   * Save asset metadata to JSON file
   */
  async saveAssetMetadata(assets: AssetMetadata[]): Promise<void> {
    const assetsPath = path.join(this.dataDir, 'assets.json');
    await fs.writeFile(assetsPath, JSON.stringify(assets, null, 2));
  }

  /**
   * Get cached data if it exists and is not expired
   */
  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  /**
   * Set cached data with timestamp
   */
  private setCachedData(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}
