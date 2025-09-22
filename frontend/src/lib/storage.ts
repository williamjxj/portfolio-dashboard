import { promises as fs } from 'fs';
import path from 'path';
import { AssetMetadata } from '@/models/AssetMetadata';

export interface StorageConfig {
  basePath: string;
  publicPath: string;
  maxFileSize: number;
  allowedFormats: string[];
}

export class StaticFileStorage {
  private config: StorageConfig;

  constructor(config: StorageConfig) {
    this.config = config;
  }

  /**
   * Initialize storage directories
   */
  async initialize(): Promise<void> {
    try {
      const directories = [
        path.join(this.config.basePath, 'screenshots'),
        path.join(this.config.basePath, 'logos'),
        path.join(this.config.basePath, 'favicons'),
        path.join(this.config.publicPath, 'assets', 'screenshots'),
        path.join(this.config.publicPath, 'assets', 'logos'),
        path.join(this.config.publicPath, 'assets', 'favicons')
      ];

      for (const dir of directories) {
        await fs.mkdir(dir, { recursive: true });
      }
    } catch (error) {
      throw new Error(`Failed to initialize storage: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Store an asset file
   */
  async storeAsset(asset: AssetMetadata, buffer: Buffer): Promise<string> {
    try {
      const fileName = this.generateFileName(asset);
      const filePath = path.join(this.config.basePath, asset.assetType, fileName);
      const publicPath = path.join(this.config.publicPath, 'assets', asset.assetType, fileName);

      // Validate file size
      if (buffer.length > this.config.maxFileSize) {
        throw new Error(`File size ${buffer.length} exceeds maximum allowed size ${this.config.maxFileSize}`);
      }

      // Validate file format
      if (!this.config.allowedFormats.includes(asset.format)) {
        throw new Error(`File format ${asset.format} is not allowed`);
      }

      // Write file to storage
      await fs.writeFile(filePath, buffer);
      
      // Copy to public directory for serving
      await fs.writeFile(publicPath, buffer);

      return `/assets/${asset.assetType}/${fileName}`;
    } catch (error) {
      throw new Error(`Failed to store asset: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Retrieve an asset file
   */
  async getAsset(asset: AssetMetadata): Promise<Buffer> {
    try {
      const fileName = this.generateFileName(asset);
      const filePath = path.join(this.config.basePath, asset.assetType, fileName);
      
      return await fs.readFile(filePath);
    } catch (error) {
      throw new Error(`Failed to retrieve asset: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete an asset file
   */
  async deleteAsset(asset: AssetMetadata): Promise<void> {
    try {
      const fileName = this.generateFileName(asset);
      const filePath = path.join(this.config.basePath, asset.assetType, fileName);
      const publicPath = path.join(this.config.publicPath, 'assets', asset.assetType, fileName);

      // Delete from both locations
      await Promise.all([
        fs.unlink(filePath).catch(() => {}), // Ignore if file doesn't exist
        fs.unlink(publicPath).catch(() => {}) // Ignore if file doesn't exist
      ]);
    } catch (error) {
      throw new Error(`Failed to delete asset: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if asset exists
   */
  async assetExists(asset: AssetMetadata): Promise<boolean> {
    try {
      const fileName = this.generateFileName(asset);
      const filePath = path.join(this.config.basePath, asset.assetType, fileName);
      
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get asset file size
   */
  async getAssetSize(asset: AssetMetadata): Promise<number> {
    try {
      const fileName = this.generateFileName(asset);
      const filePath = path.join(this.config.basePath, asset.assetType, fileName);
      
      const stats = await fs.stat(filePath);
      return stats.size;
    } catch (error) {
      throw new Error(`Failed to get asset size: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * List all assets for a website
   */
  async listWebsiteAssets(websiteId: string): Promise<string[]> {
    try {
      const assets: string[] = [];
      const assetTypes = ['screenshots', 'logos', 'favicons'];

      for (const assetType of assetTypes) {
        const dirPath = path.join(this.config.basePath, assetType);
        const files = await fs.readdir(dirPath);
        
        const websiteFiles = files.filter(file => file.startsWith(websiteId));
        assets.push(...websiteFiles.map(file => path.join(assetType, file)));
      }

      return assets;
    } catch (error) {
      throw new Error(`Failed to list website assets: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Clean up old assets
   */
  async cleanupOldAssets(maxAge: number): Promise<void> {
    try {
      const now = Date.now();
      const assetTypes = ['screenshots', 'logos', 'favicons'];

      for (const assetType of assetTypes) {
        const dirPath = path.join(this.config.basePath, assetType);
        const files = await fs.readdir(dirPath);

        for (const file of files) {
          const filePath = path.join(dirPath, file);
          const stats = await fs.stat(filePath);
          
          if (now - stats.mtime.getTime() > maxAge) {
            await fs.unlink(filePath);
          }
        }
      }
    } catch (error) {
      throw new Error(`Failed to cleanup old assets: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate file name for asset
   */
  private generateFileName(asset: AssetMetadata): string {
    const timestamp = new Date(asset.generatedAt).getTime();
    return `${asset.websiteId}-${asset.assetType}-${timestamp}.${asset.format}`;
  }

  /**
   * Get storage statistics
   */
  async getStorageStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    byType: Record<string, { count: number; size: number }>;
  }> {
    try {
      const stats = {
        totalFiles: 0,
        totalSize: 0,
        byType: {} as Record<string, { count: number; size: number }>
      };

      const assetTypes = ['screenshots', 'logos', 'favicons'];

      for (const assetType of assetTypes) {
        const dirPath = path.join(this.config.basePath, assetType);
        const files = await fs.readdir(dirPath);
        
        let typeSize = 0;
        for (const file of files) {
          const filePath = path.join(dirPath, file);
          const fileStats = await fs.stat(filePath);
          typeSize += fileStats.size;
        }

        stats.byType[assetType] = {
          count: files.length,
          size: typeSize
        };
        stats.totalFiles += files.length;
        stats.totalSize += typeSize;
      }

      return stats;
    } catch (error) {
      throw new Error(`Failed to get storage stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

/**
 * Create storage instance with default config
 */
export function createStorage(basePath: string = './storage', publicPath: string = './public'): StaticFileStorage {
  return new StaticFileStorage({
    basePath,
    publicPath,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFormats: ['png', 'jpg', 'jpeg', 'webp', 'svg', 'ico']
  });
}
