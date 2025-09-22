import { Website, WebsiteModel } from '@/models/Website';
import { AuthenticationCredentials, AuthenticationCredentialsModel } from '@/models/AuthenticationCredentials';
import { AssetMetadata, AssetMetadataModel } from '@/models/AssetMetadata';

export class WebsiteService {
  private websiteModel: WebsiteModel;
  private authModel: AuthenticationCredentialsModel;
  private assetModel: AssetMetadataModel;

  constructor(
    websiteModel: WebsiteModel,
    authModel: AuthenticationCredentialsModel,
    assetModel: AssetMetadataModel
  ) {
    this.websiteModel = websiteModel;
    this.authModel = authModel;
    this.assetModel = assetModel;
  }

  /**
   * Get all websites with their metadata
   */
  async getAllWebsites(): Promise<Website[]> {
    try {
      const websites = this.websiteModel.getAll();
      
      // Enrich with authentication and asset data
      return websites.map(website => ({
        ...website,
        authCredentials: this.authModel.getByWebsiteId(website.id),
        assets: this.assetModel.getByWebsiteId(website.id)
      }));
    } catch (error) {
      throw new Error(`Failed to get websites: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get website by ID
   */
  async getWebsiteById(id: string): Promise<Website | null> {
    try {
      const website = this.websiteModel.getById(id);
      if (!website) return null;

      return {
        ...website,
        authCredentials: this.authModel.getByWebsiteId(website.id),
        assets: this.assetModel.getByWebsiteId(website.id)
      };
    } catch (error) {
      throw new Error(`Failed to get website ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a new website
   */
  async createWebsite(websiteData: Omit<Website, 'id' | 'lastUpdated'>): Promise<Website> {
    try {
      const website: Website = {
        ...websiteData,
        id: this.generateId(),
        lastUpdated: new Date().toISOString()
      };

      const validation = this.websiteModel.validate(website);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      this.websiteModel.add(website);
      return website;
    } catch (error) {
      throw new Error(`Failed to create website: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update an existing website
   */
  async updateWebsite(id: string, updates: Partial<Website>): Promise<Website | null> {
    try {
      const existingWebsite = this.websiteModel.getById(id);
      if (!existingWebsite) return null;

      const updatedWebsite = { ...existingWebsite, ...updates, lastUpdated: new Date().toISOString() };
      
      const validation = this.websiteModel.validate(updatedWebsite);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      this.websiteModel.update(id, updatedWebsite);
      return updatedWebsite;
    } catch (error) {
      throw new Error(`Failed to update website ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete a website
   */
  async deleteWebsite(id: string): Promise<boolean> {
    try {
      // Delete associated assets
      this.assetModel.deleteByWebsiteId(id);
      
      // Delete associated credentials
      this.authModel.delete(id);
      
      // Delete website
      return this.websiteModel.delete(id);
    } catch (error) {
      throw new Error(`Failed to delete website ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get website screenshot
   */
  async getWebsiteScreenshot(id: string): Promise<AssetMetadata | null> {
    try {
      return this.assetModel.getByWebsiteIdAndType(id, 'screenshot') || null;
    } catch (error) {
      throw new Error(`Failed to get screenshot for website ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get website logo
   */
  async getWebsiteLogo(id: string): Promise<AssetMetadata | null> {
    try {
      return this.assetModel.getByWebsiteIdAndType(id, 'logo') || null;
    } catch (error) {
      throw new Error(`Failed to get logo for website ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get website favicon
   */
  async getWebsiteFavicon(id: string): Promise<AssetMetadata | null> {
    try {
      return this.assetModel.getByWebsiteIdAndType(id, 'favicon') || null;
    } catch (error) {
      throw new Error(`Failed to get favicon for website ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Set authentication credentials for a website
   */
  async setAuthCredentials(websiteId: string, credentials: AuthenticationCredentials): Promise<void> {
    try {
      const validation = this.authModel.validate(credentials);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      this.authModel.add(credentials);
    } catch (error) {
      throw new Error(`Failed to set auth credentials for website ${websiteId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get authentication credentials for a website
   */
  async getAuthCredentials(websiteId: string): Promise<AuthenticationCredentials | null> {
    try {
      return this.authModel.getByWebsiteId(websiteId) || null;
    } catch (error) {
      throw new Error(`Failed to get auth credentials for website ${websiteId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * Load websites from external source (e.g., README.md)
   */
  async loadWebsitesFromSource(sourceData: any[]): Promise<Website[]> {
    try {
      const websites: Website[] = [];
      
      for (const data of sourceData) {
        const website = await this.createWebsite({
          name: data.name || this.extractNameFromUrl(data.url),
          url: data.url,
          description: data.description || 'No description available',
          screenshot: data.screenshot || '/assets/screenshots/default.png',
          logo: data.logo || '/assets/logos/default.svg',
          favicon: data.favicon || '/assets/favicons/default.ico',
          requiresAuth: data.requiresAuth || false,
          state: 'pending'
        });
        websites.push(website);
      }
      
      return websites;
    } catch (error) {
      throw new Error(`Failed to load websites from source: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extract website name from URL
   */
  private extractNameFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      return hostname.replace(/^www\./, '').split('.')[0];
    } catch {
      return 'Unknown Website';
    }
  }
}
