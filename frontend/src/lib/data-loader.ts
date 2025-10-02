import { Website } from '@/models/Website';
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
   * Save websites to JSON file
   */
  async saveWebsites(websites: Website[]): Promise<void> {
    const websitesPath = path.join(this.dataDir, 'websites.json');
    await fs.writeFile(websitesPath, JSON.stringify(websites, null, 2));
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
