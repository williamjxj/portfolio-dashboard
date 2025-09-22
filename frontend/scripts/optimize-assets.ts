#!/usr/bin/env node

import { createAssetOptimizationService } from '../src/lib/asset-optimization';
import { createStorage } from '../src/lib/storage';
import { AssetMetadata } from '../src/models/AssetMetadata';
import { createLogger } from '../src/lib/logger';
import fs from 'fs/promises';
import path from 'path';

const logger = createLogger('asset-optimization');

interface OptimizationConfig {
  inputDir: string;
  outputDir: string;
  quality: number;
  maxWidth: number;
  maxHeight: number;
  formats: string[];
  compressionLevel: number;
}

class AssetOptimizer {
  private config: OptimizationConfig;
  private optimizer: ReturnType<typeof createAssetOptimizationService>;
  private storage: ReturnType<typeof createStorage>;

  constructor(config: OptimizationConfig) {
    this.config = config;
    this.optimizer = createAssetOptimizationService({
      quality: config.quality,
      maxWidth: config.maxWidth,
      maxHeight: config.maxHeight,
      formats: config.formats,
      compressionLevel: config.compressionLevel
    });
    this.storage = createStorage(config.outputDir, './public');
  }

  /**
   * Optimize all assets in the input directory
   */
  async optimizeAllAssets(): Promise<void> {
    try {
      logger.info('Starting asset optimization', { 
        inputDir: this.config.inputDir,
        outputDir: this.config.outputDir 
      });
      
      await this.storage.initialize();

      // Find all asset files
      const assetFiles = await this.findAssetFiles();
      logger.info('Found asset files', { count: assetFiles.length });

      // Process each asset type
      const results = await Promise.allSettled([
        this.optimizeScreenshots(assetFiles.screenshots),
        this.optimizeLogos(assetFiles.logos),
        this.optimizeFavicons(assetFiles.favicons)
      ]);

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      logger.info('Asset optimization completed', { 
        total: results.length, 
        successful, 
        failed 
      });

      // Log failed optimizations
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          const assetTypes = ['screenshots', 'logos', 'favicons'];
          logger.error('Asset optimization failed', {
            assetType: assetTypes[index],
            error: result.reason instanceof Error ? result.reason.message : 'Unknown error'
          });
        }
      });

    } catch (error) {
      logger.error('Asset optimization failed', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  /**
   * Find all asset files
   */
  private async findAssetFiles(): Promise<{
    screenshots: string[];
    logos: string[];
    favicons: string[];
  }> {
    const assetTypes = ['screenshots', 'logos', 'favicons'];
    const files: { [key: string]: string[] } = {};

    for (const assetType of assetTypes) {
      const dirPath = path.join(this.config.inputDir, assetType);
      try {
        const entries = await fs.readdir(dirPath);
        files[assetType] = entries
          .filter(file => this.isAssetFile(file))
          .map(file => path.join(dirPath, file));
      } catch (error) {
        logger.warn('Directory not found', { dirPath });
        files[assetType] = [];
      }
    }

    return {
      screenshots: files.screenshots || [],
      logos: files.logos || [],
      favicons: files.favicons || []
    };
  }

  /**
   * Check if file is an asset file
   */
  private isAssetFile(filename: string): boolean {
    const assetExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico'];
    return assetExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  }

  /**
   * Optimize screenshots
   */
  private async optimizeScreenshots(screenshotFiles: string[]): Promise<void> {
    logger.info('Optimizing screenshots', { count: screenshotFiles.length });

    for (const filePath of screenshotFiles) {
      try {
        await this.optimizeAsset(filePath, 'screenshots');
      } catch (error) {
        logger.error('Failed to optimize screenshot', {
          filePath,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  }

  /**
   * Optimize logos
   */
  private async optimizeLogos(logoFiles: string[]): Promise<void> {
    logger.info('Optimizing logos', { count: logoFiles.length });

    for (const filePath of logoFiles) {
      try {
        await this.optimizeAsset(filePath, 'logos');
      } catch (error) {
        logger.error('Failed to optimize logo', {
          filePath,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  }

  /**
   * Optimize favicons
   */
  private async optimizeFavicons(faviconFiles: string[]): Promise<void> {
    logger.info('Optimizing favicons', { count: faviconFiles.length });

    for (const filePath of faviconFiles) {
      try {
        await this.optimizeAsset(filePath, 'favicons');
      } catch (error) {
        logger.error('Failed to optimize favicon', {
          filePath,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  }

  /**
   * Optimize a single asset
   */
  private async optimizeAsset(filePath: string, assetType: string): Promise<void> {
    try {
      // Read original file
      const originalBuffer = await fs.readFile(filePath);
      const stats = await fs.stat(filePath);

      // Create asset metadata
      const asset: AssetMetadata = {
        websiteId: this.extractWebsiteId(filePath),
        assetType: assetType as 'screenshot' | 'logo' | 'favicon',
        filePath,
        fileSize: stats.size,
        dimensions: await this.getImageDimensions(originalBuffer),
        format: this.getFileFormat(filePath),
        generatedAt: stats.mtime.toISOString(),
        optimized: false
      };

      // Optimize asset
      const { optimizedBuffer, result } = await this.optimizer.optimizeImage(asset, originalBuffer);

      // Save optimized asset
      const outputPath = this.getOutputPath(filePath, assetType);
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, optimizedBuffer);

      // Copy to public directory
      const publicPath = path.join('./public/assets', assetType, path.basename(outputPath));
      await fs.mkdir(path.dirname(publicPath), { recursive: true });
      await fs.writeFile(publicPath, optimizedBuffer);

      logger.info('Asset optimized', {
        filePath,
        outputPath,
        originalSize: result.originalSize,
        optimizedSize: result.optimizedSize,
        compressionRatio: result.compressionRatio
      });

    } catch (error) {
      logger.error('Failed to optimize asset', {
        filePath,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  /**
   * Extract website ID from file path
   */
  private extractWebsiteId(filePath: string): string {
    const filename = path.basename(filePath);
    const match = filename.match(/^([^-]+)-/);
    return match ? match[1] : 'unknown';
  }

  /**
   * Get image dimensions
   */
  private async getImageDimensions(buffer: Buffer): Promise<{ width: number; height: number }> {
    // In a real implementation, you would use sharp or similar
    // For now, return default dimensions
    return { width: 1200, height: 800 };
  }

  /**
   * Get file format
   */
  private getFileFormat(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase().substring(1);
    return ext || 'png';
  }

  /**
   * Get output path for optimized asset
   */
  private getOutputPath(filePath: string, assetType: string): string {
    const filename = path.basename(filePath);
    const nameWithoutExt = path.parse(filename).name;
    const ext = path.extname(filename);
    
    return path.join(
      this.config.outputDir,
      assetType,
      `${nameWithoutExt}-optimized${ext}`
    );
  }

  /**
   * Generate optimization report
   */
  async generateReport(): Promise<void> {
    try {
      const report = await this.storage.getStorageStats();
      
      logger.info('Optimization report', {
        totalFiles: report.totalFiles,
        totalSize: report.totalSize,
        byType: report.byType
      });

      // Save report to file
      const reportPath = path.join(this.config.outputDir, 'optimization-report.json');
      await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

      logger.info('Optimization report saved', { reportPath });

    } catch (error) {
      logger.error('Failed to generate report', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

/**
 * Main function
 */
async function main() {
  try {
    const config: OptimizationConfig = {
      inputDir: './storage',
      outputDir: './storage/optimized',
      quality: 85,
      maxWidth: 1920,
      maxHeight: 1080,
      formats: ['webp', 'avif', 'png', 'jpg'],
      compressionLevel: 6
    };

    const optimizer = new AssetOptimizer(config);

    // Optimize all assets
    await optimizer.optimizeAllAssets();

    // Generate report
    await optimizer.generateReport();

    logger.info('Asset optimization completed successfully');

  } catch (error) {
    logger.error('Asset optimization failed', { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { AssetOptimizer };
