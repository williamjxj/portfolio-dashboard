import { PlaywrightService } from '@/services/PlaywrightService';
import { Website } from '@/models/Website';
import { AuthenticationCredentials } from '@/models/AuthenticationCredentials';
import { AssetMetadata } from '@/models/AssetMetadata';
import { createLogger } from '@/lib/logger';

const logger = createLogger('playwright-integration');

export interface PlaywrightIntegrationConfig {
  headless: boolean;
  timeout: number;
  viewport: {
    width: number;
    height: number;
  };
  retries: number;
  delay: number;
}

export class PlaywrightIntegration {
  private playwrightService: PlaywrightService;
  private config: PlaywrightIntegrationConfig;

  constructor(config: PlaywrightIntegrationConfig) {
    this.config = config;
    this.playwrightService = new PlaywrightService({
      headless: config.headless,
      timeout: config.timeout,
      viewport: config.viewport
    });
  }

  /**
   * Initialize Playwright
   */
  async initialize(): Promise<void> {
    try {
      await this.playwrightService.initialize();
      logger.info('Playwright initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Playwright', { error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }

  /**
   * Generate screenshot for website
   */
  async generateScreenshot(website: Website, credentials?: AuthenticationCredentials): Promise<Buffer> {
    try {
      logger.info('Generating screenshot', { websiteId: website.id, url: website.url });

      // Authenticate if credentials provided
      if (credentials && website.requiresAuth) {
        const authSuccess = await this.playwrightService.authenticate(website, credentials);
        if (!authSuccess) {
          throw new Error('Authentication failed');
        }
        logger.info('Authentication successful', { websiteId: website.id });
      }

      // Take screenshot
      const screenshot = await this.playwrightService.takeScreenshot(website, {
        width: 1200,
        height: 800,
        fullPage: true,
        quality: 90
      });

      logger.info('Screenshot generated successfully', { 
        websiteId: website.id, 
        size: screenshot.length 
      });

      return screenshot;
    } catch (error) {
      logger.error('Failed to generate screenshot', { 
        websiteId: website.id, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  /**
   * Generate logo for website
   */
  async generateLogo(website: Website): Promise<Buffer> {
    try {
      logger.info('Generating logo', { websiteId: website.id, url: website.url });

      const logo = await this.playwrightService.generateLogo(website);

      logger.info('Logo generated successfully', { 
        websiteId: website.id, 
        size: logo.length 
      });

      return logo;
    } catch (error) {
      logger.error('Failed to generate logo', { 
        websiteId: website.id, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  /**
   * Generate favicon for website
   */
  async generateFavicon(website: Website): Promise<Buffer> {
    try {
      logger.info('Generating favicon', { websiteId: website.id, url: website.url });

      const favicon = await this.playwrightService.generateFavicon(website);

      logger.info('Favicon generated successfully', { 
        websiteId: website.id, 
        size: favicon.length 
      });

      return favicon;
    } catch (error) {
      logger.error('Failed to generate favicon', { 
        websiteId: website.id, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  /**
   * Generate all assets for website
   */
  async generateAllAssets(website: Website, credentials?: AuthenticationCredentials): Promise<{
    screenshot: Buffer;
    logo: Buffer;
    favicon: Buffer;
  }> {
    try {
      logger.info('Generating all assets', { websiteId: website.id, url: website.url });

      const [screenshot, logo, favicon] = await Promise.all([
        this.generateScreenshot(website, credentials),
        this.generateLogo(website),
        this.generateFavicon(website)
      ]);

      logger.info('All assets generated successfully', { 
        websiteId: website.id,
        screenshotSize: screenshot.length,
        logoSize: logo.length,
        faviconSize: favicon.length
      });

      return { screenshot, logo, favicon };
    } catch (error) {
      logger.error('Failed to generate all assets', { 
        websiteId: website.id, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  /**
   * Test website accessibility
   */
  async testAccessibility(website: Website): Promise<{
    score: number;
    issues: Array<{
      id: string;
      description: string;
      severity: 'error' | 'warning' | 'info';
    }>;
  }> {
    try {
      logger.info('Testing accessibility', { websiteId: website.id, url: website.url });

      // In a real implementation, you would use axe-core or similar
      // For now, we'll return a mock result
      const result = {
        score: 85,
        issues: [
          {
            id: 'color-contrast',
            description: 'Color contrast ratio is below WCAG AA standards',
            severity: 'warning' as const
          }
        ]
      };

      logger.info('Accessibility test completed', { 
        websiteId: website.id, 
        score: result.score,
        issuesCount: result.issues.length
      });

      return result;
    } catch (error) {
      logger.error('Failed to test accessibility', { 
        websiteId: website.id, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  /**
   * Test website performance
   */
  async testPerformance(website: Website): Promise<{
    loadTime: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    cumulativeLayoutShift: number;
  }> {
    try {
      logger.info('Testing performance', { websiteId: website.id, url: website.url });

      // In a real implementation, you would use Lighthouse or similar
      // For now, we'll return mock metrics
      const result = {
        loadTime: 1500,
        firstContentfulPaint: 800,
        largestContentfulPaint: 1200,
        cumulativeLayoutShift: 0.05
      };

      logger.info('Performance test completed', { 
        websiteId: website.id, 
        loadTime: result.loadTime,
        firstContentfulPaint: result.firstContentfulPaint
      });

      return result;
    } catch (error) {
      logger.error('Failed to test performance', { 
        websiteId: website.id, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  /**
   * Close Playwright
   */
  async close(): Promise<void> {
    try {
      await this.playwrightService.close();
      logger.info('Playwright closed successfully');
    } catch (error) {
      logger.error('Failed to close Playwright', { error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }

  /**
   * Check if Playwright is initialized
   */
  isInitialized(): boolean {
    return this.playwrightService.isInitialized();
  }
}

/**
 * Create Playwright integration with default config
 */
export function createPlaywrightIntegration(config: Partial<PlaywrightIntegrationConfig> = {}): PlaywrightIntegration {
  const defaultConfig: PlaywrightIntegrationConfig = {
    headless: true,
    timeout: 30000,
    viewport: { width: 1280, height: 720 },
    retries: 3,
    delay: 1000
  };

  return new PlaywrightIntegration({ ...defaultConfig, ...config });
}
