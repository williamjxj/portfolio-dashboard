#!/usr/bin/env node

import { createPlaywrightIntegration } from '../src/lib/playwright-integration';
import { createStorage } from '../src/lib/storage';
import { Website } from '../src/models/Website';
import { createLogger } from '../src/lib/logger';
import fs from 'fs/promises';
import path from 'path';

const logger = createLogger('favicon-generation');

interface FaviconConfig {
  outputDir: string;
  sizes: number[];
  formats: string[];
  quality: number;
  timeout: number;
}

class FaviconGenerator {
  private config: FaviconConfig;
  private playwright: ReturnType<typeof createPlaywrightIntegration>;
  private storage: ReturnType<typeof createStorage>;

  constructor(config: FaviconConfig) {
    this.config = config;
    this.playwright = createPlaywrightIntegration({
      headless: true,
      timeout: config.timeout,
      viewport: { width: 1280, height: 720 }
    });
    this.storage = createStorage(config.outputDir, './public');
  }

  /**
   * Generate favicons for all websites
   */
  async generateAllFavicons(websites: Website[]): Promise<void> {
    try {
      logger.info('Starting favicon generation', { websiteCount: websites.length });
      
      await this.playwright.initialize();
      await this.storage.initialize();

      const results = await Promise.allSettled(
        websites.map(website => this.generateFavicon(website))
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      logger.info('Favicon generation completed', { 
        total: websites.length, 
        successful, 
        failed 
      });

      // Log failed websites
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          logger.error('Favicon generation failed', {
            websiteId: websites[index].id,
            error: result.reason instanceof Error ? result.reason.message : 'Unknown error'
          });
        }
      });

    } catch (error) {
      logger.error('Favicon generation failed', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    } finally {
      await this.playwright.close();
    }
  }

  /**
   * Generate favicon for a single website
   */
  private async generateFavicon(website: Website): Promise<void> {
    try {
      logger.info('Generating favicon', { 
        websiteId: website.id, 
        url: website.url 
      });

      // Generate favicon using Playwright
      const faviconBuffer = await this.playwright.generateFavicon(website);

      // Generate multiple sizes and formats
      const variants = await this.generateMultipleVariants(website, faviconBuffer);

      // Save all variants
      for (const [variant, buffer] of Object.entries(variants)) {
        const fileName = `${website.id}-favicon-${variant}`;
        const filePath = path.join(this.config.outputDir, 'favicons', fileName);
        
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, buffer);

        // Copy to public directory
        const publicPath = path.join('./public/assets/favicons', fileName);
        await fs.mkdir(path.dirname(publicPath), { recursive: true });
        await fs.writeFile(publicPath, buffer);

        logger.info('Favicon saved', { 
          websiteId: website.id, 
          variant,
          filePath,
          size: buffer.length 
        });
      }

    } catch (error) {
      logger.error('Failed to generate favicon', { 
        websiteId: website.id, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  /**
   * Generate multiple variants for a favicon
   */
  private async generateMultipleVariants(website: Website, faviconBuffer: Buffer): Promise<{ [variant: string]: Buffer }> {
    const variants: { [variant: string]: Buffer } = {};

    for (const size of this.config.sizes) {
      for (const format of this.config.formats) {
        try {
          const variant = `${size}x${size}.${format}`;
          const resizedBuffer = await this.resizeFavicon(faviconBuffer, size, format);
          variants[variant] = resizedBuffer;
        } catch (error) {
          logger.warn('Failed to generate favicon variant', {
            websiteId: website.id,
            size,
            format,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
    }

    return variants;
  }

  /**
   * Resize favicon to specific size and format
   */
  private async resizeFavicon(buffer: Buffer, size: number, format: string): Promise<Buffer> {
    // Simulate resizing (in real implementation, use sharp or similar)
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // In a real implementation, you would use sharp or similar library
    // For now, we'll return the original buffer
    return buffer;
  }

  /**
   * Generate favicon with retry logic
   */
  async generateWithRetry(website: Website, maxRetries: number = 3): Promise<void> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.generateFavicon(website);
        return; // Success
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        logger.warn('Favicon generation attempt failed', {
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
   * Generate favicons in batches
   */
  async generateInBatches(websites: Website[], batchSize: number = 3): Promise<void> {
    logger.info('Starting batch favicon generation', { 
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
        batch.map(website => this.generateWithRetry(website))
      );

      // Wait between batches
      if (i + batchSize < websites.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  /**
   * Generate fallback favicon
   */
  async generateFallbackFavicon(website: Website): Promise<void> {
    try {
      logger.info('Generating fallback favicon', { websiteId: website.id });

      // Create a simple ICO favicon as fallback
      const icoContent = this.createFallbackICO(website);
      const icoBuffer = Buffer.from(icoContent, 'binary');

      const fileName = `${website.id}-favicon-fallback.ico`;
      const filePath = path.join(this.config.outputDir, 'favicons', fileName);
      
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, icoBuffer);

      // Copy to public directory
      const publicPath = path.join('./public/assets/favicons', fileName);
      await fs.mkdir(path.dirname(publicPath), { recursive: true });
      await fs.writeFile(publicPath, icoBuffer);

      logger.info('Fallback favicon saved', { 
        websiteId: website.id, 
        filePath 
      });

    } catch (error) {
      logger.error('Failed to generate fallback favicon', { 
        websiteId: website.id, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  /**
   * Create fallback ICO favicon
   */
  private createFallbackICO(website: Website): Buffer {
    // Create a simple 16x16 ICO file
    // This is a minimal ICO structure
    const icoHeader = Buffer.from([
      0x00, 0x00, // Reserved
      0x01, 0x00, // Type (1 = ICO)
      0x01, 0x00, // Number of images
      0x00,       // Width (16)
      0x00,       // Height (16)
      0x00,       // Color palette
      0x00,       // Reserved
      0x01, 0x00, // Color planes
      0x20, 0x00, // Bits per pixel
      0x00, 0x00, 0x00, 0x00, // Image size
      0x16, 0x00, 0x00, 0x00  // Image offset
    ]);

    // Create a simple 16x16 bitmap
    const bitmap = Buffer.alloc(16 * 16 * 4); // 16x16 RGBA
    const color = this.getWebsiteColor(website);
    
    // Fill with website color
    for (let i = 0; i < bitmap.length; i += 4) {
      bitmap[i] = color.r;     // Red
      bitmap[i + 1] = color.g; // Green
      bitmap[i + 2] = color.b; // Blue
      bitmap[i + 3] = 255;     // Alpha
    }

    return Buffer.concat([icoHeader, bitmap]);
  }

  /**
   * Get website color based on URL
   */
  private getWebsiteColor(website: Website): { r: number; g: number; b: number } {
    const colors = [
      { r: 59, g: 130, b: 246 },   // Blue
      { r: 239, g: 68, b: 68 },    // Red
      { r: 16, g: 185, b: 129 },   // Green
      { r: 245, g: 158, b: 11 },   // Yellow
      { r: 139, g: 92, b: 246 },   // Purple
      { r: 236, g: 72, b: 153 },   // Pink
      { r: 6, g: 182, b: 212 },    // Cyan
      { r: 132, g: 204, b: 22 },   // Lime
      { r: 249, g: 115, b: 22 },   // Orange
      { r: 99, g: 102, b: 241 }    // Indigo
    ];
    
    const index = website.id.length % colors.length;
    return colors[index];
  }
}

/**
 * Main function
 */
async function main() {
  try {
    const config: FaviconConfig = {
      outputDir: './storage',
      sizes: [16, 32, 48, 64],
      formats: ['ico', 'png', 'webp'],
      quality: 90,
      timeout: 30000
    };

    const generator = new FaviconGenerator(config);

    // Load websites
    const websites = await loadWebsites();

    // Generate favicons
    await generator.generateAllFavicons(websites);

    logger.info('Favicon generation completed successfully');

  } catch (error) {
    logger.error('Favicon generation failed', { 
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

export { FaviconGenerator };
