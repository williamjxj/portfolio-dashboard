import { AssetMetadata, AssetMetadataModel } from '@/models/AssetMetadata';
import { Website } from '@/models/Website';

export interface AssetGenerationOptions {
  screenshotWidth?: number;
  screenshotHeight?: number;
  logoSize?: number;
  faviconSize?: number;
  quality?: number;
  format?: 'png' | 'jpg' | 'webp' | 'svg' | 'ico';
}

export class AssetGenerationService {
  private assetModel: AssetMetadataModel;
  private options: AssetGenerationOptions;

  constructor(assetModel: AssetMetadataModel, options: AssetGenerationOptions = {}) {
    this.assetModel = assetModel;
    this.options = {
      screenshotWidth: 1200,
      screenshotHeight: 800,
      logoSize: 100,
      faviconSize: 32,
      quality: 90,
      format: 'png',
      ...options
    };
  }

  /**
   * Generate screenshot for a website
   */
  async generateScreenshot(website: Website): Promise<AssetMetadata> {
    try {
      const screenshotPath = `/assets/screenshots/${website.id}.png`;
      
      const asset: AssetMetadata = {
        websiteId: website.id,
        assetType: 'screenshot',
        filePath: screenshotPath,
        fileSize: 0, // Will be updated after generation
        dimensions: {
          width: this.options.screenshotWidth!,
          height: this.options.screenshotHeight!
        },
        format: this.options.format!,
        generatedAt: new Date().toISOString(),
        optimized: false
      };

      // Validate asset
      const validation = this.assetModel.validate(asset);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Add to model
      this.assetModel.add(asset);
      
      return asset;
    } catch (error) {
      throw new Error(`Failed to generate screenshot for ${website.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate logo for a website
   */
  async generateLogo(website: Website): Promise<AssetMetadata> {
    try {
      const logoPath = `/assets/logos/${website.id}.svg`;
      
      const asset: AssetMetadata = {
        websiteId: website.id,
        assetType: 'logo',
        filePath: logoPath,
        fileSize: 0, // Will be updated after generation
        dimensions: {
          width: this.options.logoSize!,
          height: this.options.logoSize!
        },
        format: 'svg',
        generatedAt: new Date().toISOString(),
        optimized: false
      };

      // Validate asset
      const validation = this.assetModel.validate(asset);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Add to model
      this.assetModel.add(asset);
      
      return asset;
    } catch (error) {
      throw new Error(`Failed to generate logo for ${website.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate favicon for a website
   */
  async generateFavicon(website: Website): Promise<AssetMetadata> {
    try {
      const faviconPath = `/assets/favicons/${website.id}.ico`;
      
      const asset: AssetMetadata = {
        websiteId: website.id,
        assetType: 'favicon',
        filePath: faviconPath,
        fileSize: 0, // Will be updated after generation
        dimensions: {
          width: this.options.faviconSize!,
          height: this.options.faviconSize!
        },
        format: 'ico',
        generatedAt: new Date().toISOString(),
        optimized: false
      };

      // Validate asset
      const validation = this.assetModel.validate(asset);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Add to model
      this.assetModel.add(asset);
      
      return asset;
    } catch (error) {
      throw new Error(`Failed to generate favicon for ${website.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate all assets for a website
   */
  async generateAllAssets(website: Website): Promise<{
    screenshot: AssetMetadata;
    logo: AssetMetadata;
    favicon: AssetMetadata;
  }> {
    try {
      const [screenshot, logo, favicon] = await Promise.all([
        this.generateScreenshot(website),
        this.generateLogo(website),
        this.generateFavicon(website)
      ]);

      return { screenshot, logo, favicon };
    } catch (error) {
      throw new Error(`Failed to generate all assets for ${website.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Optimize an asset
   */
  async optimizeAsset(asset: AssetMetadata): Promise<AssetMetadata> {
    try {
      const optimizedAsset: AssetMetadata = {
        ...asset,
        optimized: true,
        fileSize: Math.floor(asset.fileSize * 0.8), // Simulate 20% size reduction
        generatedAt: new Date().toISOString()
      };

      this.assetModel.update(asset.websiteId, asset.assetType, optimizedAsset);
      
      return optimizedAsset;
    } catch (error) {
      throw new Error(`Failed to optimize asset ${asset.websiteId}/${asset.assetType}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get asset by website ID and type
   */
  async getAsset(websiteId: string, assetType: 'screenshot' | 'logo' | 'favicon'): Promise<AssetMetadata | null> {
    try {
      return this.assetModel.getByWebsiteIdAndType(websiteId, assetType) || null;
    } catch (error) {
      throw new Error(`Failed to get asset ${websiteId}/${assetType}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get all assets for a website
   */
  async getWebsiteAssets(websiteId: string): Promise<AssetMetadata[]> {
    try {
      return this.assetModel.getByWebsiteId(websiteId);
    } catch (error) {
      throw new Error(`Failed to get assets for website ${websiteId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete an asset
   */
  async deleteAsset(websiteId: string, assetType: 'screenshot' | 'logo' | 'favicon'): Promise<boolean> {
    try {
      return this.assetModel.delete(websiteId, assetType);
    } catch (error) {
      throw new Error(`Failed to delete asset ${websiteId}/${assetType}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete all assets for a website
   */
  async deleteWebsiteAssets(websiteId: string): Promise<boolean> {
    try {
      return this.assetModel.deleteByWebsiteId(websiteId);
    } catch (error) {
      throw new Error(`Failed to delete assets for website ${websiteId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get total file size for a website
   */
  async getWebsiteTotalSize(websiteId: string): Promise<number> {
    try {
      return this.assetModel.getTotalFileSize(websiteId);
    } catch (error) {
      throw new Error(`Failed to get total size for website ${websiteId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if asset exists
   */
  async assetExists(websiteId: string, assetType: 'screenshot' | 'logo' | 'favicon'): Promise<boolean> {
    try {
      return this.assetModel.exists(websiteId, assetType);
    } catch (error) {
      throw new Error(`Failed to check if asset exists ${websiteId}/${assetType}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
