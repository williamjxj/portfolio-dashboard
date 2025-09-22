import { AssetMetadata } from '@/models/AssetMetadata';
import { createLogger } from '@/lib/logger';

const logger = createLogger('asset-optimization');

export interface OptimizationConfig {
  quality: number;
  maxWidth: number;
  maxHeight: number;
  formats: string[];
  compressionLevel: number;
}

export interface OptimizationResult {
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  format: string;
  dimensions: {
    width: number;
    height: number;
  };
}

export class AssetOptimizationService {
  private config: OptimizationConfig;

  constructor(config: OptimizationConfig) {
    this.config = config;
  }

  /**
   * Optimize image asset
   */
  async optimizeImage(asset: AssetMetadata, buffer: Buffer): Promise<{
    optimizedBuffer: Buffer;
    result: OptimizationResult;
  }> {
    try {
      logger.info('Starting image optimization', { 
        websiteId: asset.websiteId, 
        assetType: asset.assetType,
        originalSize: buffer.length,
        format: asset.format
      });

      // Calculate optimization parameters
      const { width, height } = this.calculateOptimalDimensions(asset.dimensions);
      const quality = this.calculateOptimalQuality(asset);
      const format = this.selectOptimalFormat(asset);

      // Simulate optimization (in real implementation, use sharp or similar)
      const optimizedBuffer = await this.simulateOptimization(buffer, {
        width,
        height,
        quality,
        format
      });

      const result: OptimizationResult = {
        originalSize: buffer.length,
        optimizedSize: optimizedBuffer.length,
        compressionRatio: (buffer.length - optimizedBuffer.length) / buffer.length,
        format,
        dimensions: { width, height }
      };

      logger.info('Image optimization completed', {
        websiteId: asset.websiteId,
        assetType: asset.assetType,
        originalSize: result.originalSize,
        optimizedSize: result.optimizedSize,
        compressionRatio: result.compressionRatio
      });

      return { optimizedBuffer, result };
    } catch (error) {
      logger.error('Image optimization failed', {
        websiteId: asset.websiteId,
        assetType: asset.assetType,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  /**
   * Calculate optimal dimensions
   */
  private calculateOptimalDimensions(originalDimensions: { width: number; height: number }): { width: number; height: number } {
    const { width, height } = originalDimensions;
    const aspectRatio = width / height;

    let newWidth = width;
    let newHeight = height;

    // Resize if too large
    if (width > this.config.maxWidth) {
      newWidth = this.config.maxWidth;
      newHeight = Math.round(newWidth / aspectRatio);
    }

    if (newHeight > this.config.maxHeight) {
      newHeight = this.config.maxHeight;
      newWidth = Math.round(newHeight * aspectRatio);
    }

    return { width: newWidth, height: newHeight };
  }

  /**
   * Calculate optimal quality
   */
  private calculateOptimalQuality(asset: AssetMetadata): number {
    let quality = this.config.quality;

    // Adjust quality based on asset type
    switch (asset.assetType) {
      case 'screenshot':
        quality = Math.min(quality, 90); // High quality for screenshots
        break;
      case 'logo':
        quality = Math.min(quality, 95); // Very high quality for logos
        break;
      case 'favicon':
        quality = Math.min(quality, 80); // Lower quality for favicons
        break;
    }

    // Adjust quality based on file size
    if (asset.fileSize > 1000000) { // 1MB
      quality = Math.max(quality - 10, 60);
    }

    return quality;
  }

  /**
   * Select optimal format
   */
  private selectOptimalFormat(asset: AssetMetadata): string {
    // Prefer WebP for modern browsers
    if (this.config.formats.includes('webp')) {
      return 'webp';
    }

    // Fallback to original format
    return asset.format;
  }

  /**
   * Simulate optimization (placeholder for real implementation)
   */
  private async simulateOptimization(
    buffer: Buffer, 
    options: { width: number; height: number; quality: number; format: string }
  ): Promise<Buffer> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 100));

    // Simulate size reduction based on quality and dimensions
    const sizeReduction = (100 - options.quality) / 100;
    const dimensionReduction = (options.width * options.height) / (1200 * 800);
    const totalReduction = sizeReduction * dimensionReduction;

    const optimizedSize = Math.round(buffer.length * (1 - totalReduction));
    return Buffer.alloc(optimizedSize);
  }

  /**
   * Generate multiple format versions
   */
  async generateMultipleFormats(asset: AssetMetadata, buffer: Buffer): Promise<{
    [format: string]: Buffer;
  }> {
    try {
      logger.info('Generating multiple formats', { 
        websiteId: asset.websiteId, 
        assetType: asset.assetType,
        formats: this.config.formats
      });

      const results: { [format: string]: Buffer } = {};

      for (const format of this.config.formats) {
        const optimized = await this.simulateOptimization(buffer, {
          width: asset.dimensions.width,
          height: asset.dimensions.height,
          quality: this.calculateOptimalQuality(asset),
          format
        });

        results[format] = optimized;
      }

      logger.info('Multiple formats generated', { 
        websiteId: asset.websiteId, 
        assetType: asset.assetType,
        formatCount: Object.keys(results).length
      });

      return results;
    } catch (error) {
      logger.error('Failed to generate multiple formats', {
        websiteId: asset.websiteId,
        assetType: asset.assetType,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  /**
   * Create responsive image sizes
   */
  generateResponsiveSizes(asset: AssetMetadata): Array<{
    width: number;
    height: number;
    suffix: string;
  }> {
    const sizes = [
      { width: 320, height: 240 },
      { width: 640, height: 480 },
      { width: 1024, height: 768 },
      { width: 1280, height: 960 },
      { width: 1920, height: 1440 }
    ];

    return sizes.map(size => ({
      ...size,
      suffix: `-${size.width}x${size.height}`
    }));
  }

  /**
   * Get optimization recommendations
   */
  getOptimizationRecommendations(asset: AssetMetadata): string[] {
    const recommendations: string[] = [];

    // Check dimensions
    if (asset.dimensions.width > this.config.maxWidth || asset.dimensions.height > this.config.maxHeight) {
      recommendations.push('Consider resizing image to reduce file size');
    }

    // Check format
    if (!this.config.formats.includes(asset.format)) {
      recommendations.push(`Consider converting to ${this.config.formats.join(' or ')} for better performance`);
    }

    // Check file size
    if (asset.fileSize > 500000) { // 500KB
      recommendations.push('Consider reducing quality to decrease file size');
    }

    // Check aspect ratio
    const aspectRatio = asset.dimensions.width / asset.dimensions.height;
    if (aspectRatio > 3 || aspectRatio < 0.33) {
      recommendations.push('Consider cropping image to standard aspect ratio');
    }

    return recommendations;
  }

  /**
   * Batch optimize multiple assets
   */
  async batchOptimize(assets: AssetMetadata[], buffers: Buffer[]): Promise<{
    optimizedAssets: Buffer[];
    results: OptimizationResult[];
  }> {
    try {
      logger.info('Starting batch optimization', { assetCount: assets.length });

      const optimizedAssets: Buffer[] = [];
      const results: OptimizationResult[] = [];

      for (let i = 0; i < assets.length; i++) {
        const asset = assets[i];
        const buffer = buffers[i];

        const { optimizedBuffer, result } = await this.optimizeImage(asset, buffer);
        
        optimizedAssets.push(optimizedBuffer);
        results.push(result);
      }

      logger.info('Batch optimization completed', { 
        assetCount: assets.length,
        totalOriginalSize: results.reduce((sum, r) => sum + r.originalSize, 0),
        totalOptimizedSize: results.reduce((sum, r) => sum + r.optimizedSize, 0)
      });

      return { optimizedAssets, results };
    } catch (error) {
      logger.error('Batch optimization failed', {
        assetCount: assets.length,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }
}

/**
 * Create asset optimization service with default config
 */
export function createAssetOptimizationService(config: Partial<OptimizationConfig> = {}): AssetOptimizationService {
  const defaultConfig: OptimizationConfig = {
    quality: 85,
    maxWidth: 1920,
    maxHeight: 1080,
    formats: ['webp', 'avif', 'png', 'jpg'],
    compressionLevel: 6
  };

  return new AssetOptimizationService({ ...defaultConfig, ...config });
}
