import { Website } from '@/models/Website';
import { AuthenticationCredentials } from '@/models/Website';
import { AssetMetadata } from '@/models/Website';
import fs from 'fs/promises';
import path from 'path';

export class DataLoader {
  private dataDir: string;

  constructor(dataDir: string = './data') {
    this.dataDir = dataDir;
  }

  /**
   * Load websites from JSON file
   */
  async loadWebsites(): Promise<Website[]> {
    try {
      const websitesPath = path.join(this.dataDir, 'websites.json');
      const data = await fs.readFile(websitesPath, 'utf-8');
      return JSON.parse(data);
    } catch {
      console.warn('No websites.json found, returning empty array');
      return [];
    }
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
}
