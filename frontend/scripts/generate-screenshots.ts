#!/usr/bin/env node

import { createPlaywrightIntegration } from '../src/lib/playwright-integration';
import { createStorage } from '../src/lib/storage';
import { Website } from '../src/models/Website';
import { AuthenticationCredentials } from '../src/models/AuthenticationCredentials';
import { createLogger } from '../src/lib/logger';
import fs from 'fs/promises';
import path from 'path';

const logger = createLogger('screenshot-generation');

interface ScreenshotConfig {
  outputDir: string;
  width: number;
  height: number;
  quality: number;
  fullPage: boolean;
  timeout: number;
}

class ScreenshotGenerator {
  private config: ScreenshotConfig;
  private playwright: ReturnType<typeof createPlaywrightIntegration>;
  private storage: ReturnType<typeof createStorage>;

  constructor(config: ScreenshotConfig) {
    this.config = config;
    this.playwright = createPlaywrightIntegration({
      headless: true,
      timeout: config.timeout,
      viewport: { width: config.width, height: config.height }
    });
    this.storage = createStorage(config.outputDir, './public');
  }

  /**
   * Generate screenshots for all websites
   */
  async generateAllScreenshots(websites: Website[], credentials: Map<string, AuthenticationCredentials>): Promise<void> {
    try {
      logger.info('Starting screenshot generation', { websiteCount: websites.length });
      
      await this.playwright.initialize();
      await this.storage.initialize();

      const results = await Promise.allSettled(
        websites.map(website => this.generateScreenshot(website, credentials.get(website.id)))
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      logger.info('Screenshot generation completed', { 
        total: websites.length, 
        successful, 
        failed 
      });

      // Log failed websites
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          logger.error('Screenshot generation failed', {
            websiteId: websites[index].id,
            error: result.reason instanceof Error ? result.reason.message : 'Unknown error'
          });
        }
      });

    } catch (error) {
      logger.error('Screenshot generation failed', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    } finally {
      await this.playwright.close();
    }
  }

  /**
   * Generate screenshot for a single website
   */
  private async generateScreenshot(website: Website, credentials?: AuthenticationCredentials): Promise<void> {
    try {
      logger.info('Generating screenshot', { 
        websiteId: website.id, 
        url: website.url,
        requiresAuth: website.requiresAuth 
      });

      // Generate screenshot
      const screenshot = await this.playwright.generateScreenshot(website, credentials);

      // Save screenshot
      const fileName = `${website.id}-screenshot-${Date.now()}.png`;
      const filePath = path.join(this.config.outputDir, 'screenshots', fileName);
      
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, screenshot);

      // Copy to public directory
      const publicPath = path.join('./public/assets/screenshots', fileName);
      await fs.mkdir(path.dirname(publicPath), { recursive: true });
      await fs.writeFile(publicPath, screenshot);

      logger.info('Screenshot saved', { 
        websiteId: website.id, 
        filePath,
        size: screenshot.length 
      });

    } catch (error) {
      logger.error('Failed to generate screenshot', { 
        websiteId: website.id, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  /**
   * Generate screenshots with retry logic
   */
  async generateWithRetry(website: Website, credentials?: AuthenticationCredentials, maxRetries: number = 3): Promise<void> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.generateScreenshot(website, credentials);
        return; // Success
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        logger.warn('Screenshot generation attempt failed', {
          websiteId: website.id,
          attempt,
          maxRetries,
          error: lastError.message
        });

        if (attempt < maxRetries) {
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
        }
      }
    }

    throw lastError;
  }

  /**
   * Generate screenshots in batches
   */
  async generateInBatches(websites: Website[], credentials: Map<string, AuthenticationCredentials>, batchSize: number = 3): Promise<void> {
    logger.info('Starting batch screenshot generation', { 
      totalWebsites: websites.length, 
      batchSize 
    });

    for (let i = 0; i < websites.length; i += batchSize) {
      const batch = websites.slice(i, i + batchSize);
      
      logger.info('Processing batch', { 
        batchNumber: Math.floor(i / batchSize) + 1, 
        batchSize: batch.length 
      });

      await Promise.allSettled(
        batch.map(website => this.generateWithRetry(website, credentials.get(website.id)))
      );

      // Wait between batches to avoid overwhelming the system
      if (i + batchSize < websites.length) {
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }
}

/**
 * Main function
 */
async function main() {
  try {
    const config: ScreenshotConfig = {
      outputDir: './storage',
      width: 1200,
      height: 800,
      quality: 90,
      fullPage: true,
      timeout: 30000
    };

    const generator = new ScreenshotGenerator(config);

    // Load websites from README.md or API
    const websites = await loadWebsites();
    const credentials = await loadCredentials();

    // Generate screenshots
    await generator.generateAllScreenshots(websites, credentials);

    logger.info('Screenshot generation completed successfully');

  } catch (error) {
    logger.error('Screenshot generation failed', { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    process.exit(1);
  }
}

/**
 * Load websites from README.md
 */
async function loadWebsites(): Promise<Website[]> {
  try {
    const readmePath = path.join(process.cwd(), 'README.md');
    const content = await fs.readFile(readmePath, 'utf-8');
    
    // Extract URLs from README.md
    const urlRegex = /https?:\/\/[^\s]+/g;
    const urls = content.match(urlRegex) || [];
    
    return urls.map((url, index) => ({
      id: `website-${index + 1}`,
      name: extractWebsiteName(url),
      url,
      description: 'Website description will be generated',
      screenshot: '',
      logo: '',
      favicon: '',
      requiresAuth: false,
      lastUpdated: new Date().toISOString(),
      state: 'pending' as const
    }));
  } catch (error) {
    logger.error('Failed to load websites from README.md', { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    return [];
  }
}

/**
 * Load authentication credentials
 */
async function loadCredentials(): Promise<Map<string, AuthenticationCredentials>> {
  const credentials = new Map<string, AuthenticationCredentials>();
  
  // In a real implementation, you would load from a secure credential store
  // For now, we'll return an empty map
  return credentials;
}

/**
 * Extract website name from URL
 */
function extractWebsiteName(url: string): string {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace(/^www\./, '');
    return hostname.split('.')[0];
  } catch {
    return 'Unknown Website';
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { ScreenshotGenerator };
