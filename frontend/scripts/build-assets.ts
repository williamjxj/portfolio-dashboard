#!/usr/bin/env node

import { Website } from '../src/models/Website';
import { AuthenticationCredentials } from '../src/models/AuthenticationCredentials';
import { createLogger } from '../src/lib/logger';
import fs from 'fs/promises';
import path from 'path';

// Import the generation scripts
import { ScreenshotGenerator } from './generate-screenshots';
import { LogoGenerator } from './generate-logos';
import { FaviconGenerator } from './generate-favicons';
import { AssetOptimizer } from './optimize-assets';
import { WebsiteParser } from './parse-websites';
import { AuthManager } from './auth-manager';

const logger = createLogger('build-assets');

interface BuildConfig {
  inputFile: string;
  outputDir: string;
  credentialsFile: string;
  batchSize: number;
  retryAttempts: number;
  parallel: boolean;
}

class AssetBuilder {
  private config: BuildConfig;
  private websites: Website[] = [];
  private credentials: Map<string, AuthenticationCredentials> = new Map();

  constructor(config: BuildConfig) {
    this.config = config;
  }

  /**
   * Build all assets
   */
  async buildAllAssets(): Promise<void> {
    try {
      logger.info('Starting asset build process', { 
        inputFile: this.config.inputFile,
        outputDir: this.config.outputDir 
      });

      // Step 1: Parse websites
      await this.parseWebsites();

      // Step 2: Load credentials
      await this.loadCredentials();

      // Step 3: Generate assets
      await this.generateAssets();

      // Step 4: Optimize assets
      await this.optimizeAssets();

      // Step 5: Generate final report
      await this.generateReport();

      logger.info('Asset build process completed successfully');

    } catch (error) {
      logger.error('Asset build process failed', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  /**
   * Parse websites from input file
   */
  private async parseWebsites(): Promise<void> {
    try {
      logger.info('Parsing websites', { inputFile: this.config.inputFile });

      const parser = new WebsiteParser({
        inputFile: this.config.inputFile,
        outputFile: path.join(this.config.outputDir, 'websites.json')
      });

      this.websites = await parser.parseWebsites();

      // Validate websites
      const { valid, invalid } = parser.validateWebsites(this.websites);
      
      if (invalid.length > 0) {
        logger.warn('Invalid websites found', { 
          invalid: invalid.map(w => ({ id: w.id, name: w.name })) 
        });
      }

      this.websites = valid;

      logger.info('Websites parsed successfully', { 
        total: this.websites.length,
        valid: valid.length,
        invalid: invalid.length
      });

    } catch (error) {
      logger.error('Failed to parse websites', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  /**
   * Load authentication credentials
   */
  private async loadCredentials(): Promise<void> {
    try {
      logger.info('Loading authentication credentials', { 
        credentialsFile: this.config.credentialsFile 
      });

      const authManager = new AuthManager({
        credentialsFile: this.config.credentialsFile,
        encrypted: false
      });

      await authManager.loadCredentials();

      // Convert to Map
      this.credentials = new Map();
      const credsList = authManager.listCredentials();
      credsList.forEach(cred => {
        const fullCreds = authManager.getCredentials(cred.websiteId);
        if (fullCreds) {
          this.credentials.set(cred.websiteId, fullCreds);
        }
      });

      logger.info('Credentials loaded successfully', { 
        count: this.credentials.size 
      });

    } catch (error) {
      logger.warn('Failed to load credentials, continuing without authentication', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  /**
   * Generate all assets
   */
  private async generateAssets(): Promise<void> {
    try {
      logger.info('Generating assets', { 
        websiteCount: this.websites.length,
        parallel: this.config.parallel 
      });

      if (this.config.parallel) {
        await this.generateAssetsParallel();
      } else {
        await this.generateAssetsSequential();
      }

      logger.info('Asset generation completed');

    } catch (error) {
      logger.error('Failed to generate assets', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  /**
   * Generate assets in parallel
   */
  private async generateAssetsParallel(): Promise<void> {
    const batchSize = this.config.batchSize;
    
    for (let i = 0; i < this.websites.length; i += batchSize) {
      const batch = this.websites.slice(i, i + batchSize);
      
      logger.info('Processing batch', { 
        batchNumber: Math.floor(i / batchSize) + 1,
        batchSize: batch.length 
      });

      await Promise.allSettled([
        this.generateScreenshots(batch),
        this.generateLogos(batch),
        this.generateFavicons(batch)
      ]);

      // Wait between batches
      if (i + batchSize < this.websites.length) {
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }

  /**
   * Generate assets sequentially
   */
  private async generateAssetsSequential(): Promise<void> {
    await this.generateScreenshots(this.websites);
    await this.generateLogos(this.websites);
    await this.generateFavicons(this.websites);
  }

  /**
   * Generate screenshots
   */
  private async generateScreenshots(websites: Website[]): Promise<void> {
    try {
      logger.info('Generating screenshots', { count: websites.length });

      const generator = new ScreenshotGenerator({
        outputDir: this.config.outputDir,
        width: 1200,
        height: 800,
        quality: 90,
        fullPage: true,
        timeout: 30000
      });

      await generator.generateAllScreenshots(websites, this.credentials);

      logger.info('Screenshots generated successfully');

    } catch (error) {
      logger.error('Failed to generate screenshots', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  /**
   * Generate logos
   */
  private async generateLogos(websites: Website[]): Promise<void> {
    try {
      logger.info('Generating logos', { count: websites.length });

      const generator = new LogoGenerator({
        outputDir: this.config.outputDir,
        size: 100,
        formats: ['svg', 'png', 'webp'],
        quality: 90,
        timeout: 30000
      });

      await generator.generateAllLogos(websites);

      logger.info('Logos generated successfully');

    } catch (error) {
      logger.error('Failed to generate logos', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  /**
   * Generate favicons
   */
  private async generateFavicons(websites: Website[]): Promise<void> {
    try {
      logger.info('Generating favicons', { count: websites.length });

      const generator = new FaviconGenerator({
        outputDir: this.config.outputDir,
        sizes: [16, 32, 48, 64],
        formats: ['ico', 'png', 'webp'],
        quality: 90,
        timeout: 30000
      });

      await generator.generateAllFavicons(websites);

      logger.info('Favicons generated successfully');

    } catch (error) {
      logger.error('Failed to generate favicons', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  /**
   * Optimize assets
   */
  private async optimizeAssets(): Promise<void> {
    try {
      logger.info('Optimizing assets');

      const optimizer = new AssetOptimizer({
        inputDir: this.config.outputDir,
        outputDir: path.join(this.config.outputDir, 'optimized'),
        quality: 85,
        maxWidth: 1920,
        maxHeight: 1080,
        formats: ['webp', 'avif', 'png', 'jpg'],
        compressionLevel: 6
      });

      await optimizer.optimizeAllAssets();

      logger.info('Asset optimization completed');

    } catch (error) {
      logger.error('Failed to optimize assets', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  /**
   * Generate final report
   */
  private async generateReport(): Promise<void> {
    try {
      logger.info('Generating build report');

      const report = {
        timestamp: new Date().toISOString(),
        websites: this.websites.length,
        credentials: this.credentials.size,
        config: this.config,
        stats: {
          totalWebsites: this.websites.length,
          withAuth: this.websites.filter(w => w.requiresAuth).length,
          withoutAuth: this.websites.filter(w => !w.requiresAuth).length
        }
      };

      const reportPath = path.join(this.config.outputDir, 'build-report.json');
      await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

      logger.info('Build report generated', { reportPath });

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
    const config: BuildConfig = {
      inputFile: './README.md',
      outputDir: './storage',
      credentialsFile: './data/auth-credentials.json',
      batchSize: 3,
      retryAttempts: 3,
      parallel: true
    };

    const builder = new AssetBuilder(config);

    // Build all assets
    await builder.buildAllAssets();

    logger.info('Asset build completed successfully');

  } catch (error) {
    logger.error('Asset build failed', { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { AssetBuilder };
