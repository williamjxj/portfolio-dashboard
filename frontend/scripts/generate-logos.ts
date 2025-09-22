#!/usr/bin/env node

import { createPlaywrightIntegration } from '../src/lib/playwright-integration';
import { createStorage } from '../src/lib/storage';
import { Website } from '../src/models/Website';
import { createLogger } from '../src/lib/logger';
import fs from 'fs/promises';
import path from 'path';

const logger = createLogger('logo-generation');

interface LogoConfig {
  outputDir: string;
  size: number;
  formats: string[];
  quality: number;
  timeout: number;
}

class LogoGenerator {
  private config: LogoConfig;
  private playwright: ReturnType<typeof createPlaywrightIntegration>;
  private storage: ReturnType<typeof createStorage>;

  constructor(config: LogoConfig) {
    this.config = config;
    this.playwright = createPlaywrightIntegration({
      headless: true,
      timeout: config.timeout,
      viewport: { width: 1280, height: 720 }
    });
    this.storage = createStorage(config.outputDir, './public');
  }

  /**
   * Generate logos for all websites
   */
  async generateAllLogos(websites: Website[]): Promise<void> {
    try {
      logger.info('Starting logo generation', { websiteCount: websites.length });
      
      await this.playwright.initialize();
      await this.storage.initialize();

      const results = await Promise.allSettled(
        websites.map(website => this.generateLogo(website))
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      logger.info('Logo generation completed', { 
        total: websites.length, 
        successful, 
        failed 
      });

      // Log failed websites
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          logger.error('Logo generation failed', {
            websiteId: websites[index].id,
            error: result.reason instanceof Error ? result.reason.message : 'Unknown error'
          });
        }
      });

    } catch (error) {
      logger.error('Logo generation failed', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    } finally {
      await this.playwright.close();
    }
  }

  /**
   * Generate logo for a single website
   */
  private async generateLogo(website: Website): Promise<void> {
    try {
      logger.info('Generating logo', { 
        websiteId: website.id, 
        url: website.url 
      });

      // Generate logo using Playwright
      const logoBuffer = await this.playwright.generateLogo(website);

      // Generate multiple formats
      const formats = await this.generateMultipleFormats(website, logoBuffer);

      // Save all formats
      for (const [format, buffer] of Object.entries(formats)) {
        const fileName = `${website.id}-logo-${Date.now()}.${format}`;
        const filePath = path.join(this.config.outputDir, 'logos', fileName);
        
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, buffer);

        // Copy to public directory
        const publicPath = path.join('./public/assets/logos', fileName);
        await fs.mkdir(path.dirname(publicPath), { recursive: true });
        await fs.writeFile(publicPath, buffer);

        logger.info('Logo saved', { 
          websiteId: website.id, 
          format,
          filePath,
          size: buffer.length 
        });
      }

    } catch (error) {
      logger.error('Failed to generate logo', { 
        websiteId: website.id, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  /**
   * Generate multiple formats for a logo
   */
  private async generateMultipleFormats(website: Website, logoBuffer: Buffer): Promise<{ [format: string]: Buffer }> {
    const formats: { [format: string]: Buffer } = {};

    for (const format of this.config.formats) {
      try {
        // Simulate format conversion (in real implementation, use sharp or similar)
        const convertedBuffer = await this.convertFormat(logoBuffer, format);
        formats[format] = convertedBuffer;
      } catch (error) {
        logger.warn('Failed to convert logo format', {
          websiteId: website.id,
          format,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return formats;
  }

  /**
   * Convert buffer to different format
   */
  private async convertFormat(buffer: Buffer, format: string): Promise<Buffer> {
    // Simulate format conversion
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // In a real implementation, you would use sharp or similar library
    // For now, we'll return the original buffer
    return buffer;
  }

  /**
   * Generate logo with retry logic
   */
  async generateWithRetry(website: Website, maxRetries: number = 3): Promise<void> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.generateLogo(website);
        return; // Success
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        logger.warn('Logo generation attempt failed', {
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
   * Generate logos in batches
   */
  async generateInBatches(websites: Website[], batchSize: number = 3): Promise<void> {
    logger.info('Starting batch logo generation', { 
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
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
  }

  /**
   * Generate fallback logo
   */
  async generateFallbackLogo(website: Website): Promise<void> {
    try {
      logger.info('Generating fallback logo', { websiteId: website.id });

      // Create a simple SVG logo as fallback
      const svgContent = this.createFallbackSVG(website);
      const svgBuffer = Buffer.from(svgContent, 'utf-8');

      const fileName = `${website.id}-logo-fallback.svg`;
      const filePath = path.join(this.config.outputDir, 'logos', fileName);
      
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, svgBuffer);

      // Copy to public directory
      const publicPath = path.join('./public/assets/logos', fileName);
      await fs.mkdir(path.dirname(publicPath), { recursive: true });
      await fs.writeFile(publicPath, svgBuffer);

      logger.info('Fallback logo saved', { 
        websiteId: website.id, 
        filePath 
      });

    } catch (error) {
      logger.error('Failed to generate fallback logo', { 
        websiteId: website.id, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  /**
   * Create fallback SVG logo
   */
  private createFallbackSVG(website: Website): string {
    const initials = website.name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const colors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
      '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
    ];
    
    const color = colors[website.id.length % colors.length];

    return `
      <svg width="${this.config.size}" height="${this.config.size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="${color}" rx="20"/>
        <text x="50" y="60" font-family="Arial, sans-serif" font-size="32" font-weight="bold" text-anchor="middle" fill="white">
          ${initials}
        </text>
      </svg>
    `.trim();
  }
}

/**
 * Main function
 */
async function main() {
  try {
    const config: LogoConfig = {
      outputDir: './storage',
      size: 100,
      formats: ['svg', 'png', 'webp'],
      quality: 90,
      timeout: 30000
    };

    const generator = new LogoGenerator(config);

    // Load websites
    const websites = await loadWebsites();

    // Generate logos
    await generator.generateAllLogos(websites);

    logger.info('Logo generation completed successfully');

  } catch (error) {
    logger.error('Logo generation failed', { 
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

export { LogoGenerator };
