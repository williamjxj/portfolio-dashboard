#!/usr/bin/env node

import { Website } from '../src/models/Website';
import { createLogger } from '../src/lib/logger';
import fs from 'fs/promises';
import path from 'path';

const logger = createLogger('website-parser');

interface WebsiteParserConfig {
  inputFile: string;
  outputFile: string;
  baseUrl?: string;
}

class WebsiteParser {
  private config: WebsiteParserConfig;

  constructor(config: WebsiteParserConfig) {
    this.config = config;
  }

  /**
   * Parse websites from README.md
   */
  async parseWebsites(): Promise<Website[]> {
    try {
      logger.info('Parsing websites from README.md', { 
        inputFile: this.config.inputFile 
      });

      const content = await fs.readFile(this.config.inputFile, 'utf-8');
      const websites = this.extractWebsites(content);

      logger.info('Websites parsed successfully', { 
        count: websites.length 
      });

      return websites;

    } catch (error) {
      logger.error('Failed to parse websites', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  /**
   * Extract websites from README content
   */
  private extractWebsites(content: string): Website[] {
    const websites: Website[] = [];
    
    // Extract URLs using regex
    const urlRegex = /https?:\/\/[^\s]+/g;
    const urls = content.match(urlRegex) || [];

    // Extract descriptions (look for text after URLs)
    const lines = content.split('\n');
    const descriptions: string[] = [];

    for (const line of lines) {
      if (line.includes('http')) {
        // Extract description from the same line or next line
        const description = this.extractDescription(line, lines, lines.indexOf(line));
        descriptions.push(description);
      }
    }

    // Create website objects
    urls.forEach((url, index) => {
      const website: Website = {
        id: this.generateWebsiteId(url, index),
        name: this.extractWebsiteName(url),
        url: this.normalizeUrl(url),
        description: descriptions[index] || this.generateDefaultDescription(url),
        screenshot: '',
        logo: '',
        favicon: '',
        requiresAuth: this.detectAuthRequirement(url, descriptions[index]),
        lastUpdated: new Date().toISOString(),
        state: 'pending' as const
      };

      websites.push(website);
    });

    return websites;
  }

  /**
   * Extract description from line or nearby lines
   */
  private extractDescription(line: string, lines: string[], lineIndex: number): string {
    // Try to extract description from the same line
    const urlMatch = line.match(/https?:\/\/[^\s]+/);
    if (urlMatch) {
      const urlStart = line.indexOf(urlMatch[0]);
      const afterUrl = line.substring(urlStart + urlMatch[0].length).trim();
      if (afterUrl.length > 10) {
        return afterUrl;
      }
    }

    // Try to extract from next line
    if (lineIndex + 1 < lines.length) {
      const nextLine = lines[lineIndex + 1].trim();
      if (nextLine.length > 10 && !nextLine.startsWith('http')) {
        return nextLine;
      }
    }

    // Try to extract from previous line
    if (lineIndex > 0) {
      const prevLine = lines[lineIndex - 1].trim();
      if (prevLine.length > 10 && !prevLine.startsWith('http')) {
        return prevLine;
      }
    }

    return '';
  }

  /**
   * Generate website ID
   */
  private generateWebsiteId(url: string, index: number): string {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.replace(/^www\./, '');
      const domain = hostname.split('.')[0];
      return `${domain}-${index + 1}`;
    } catch {
      return `website-${index + 1}`;
    }
  }

  /**
   * Extract website name from URL
   */
  private extractWebsiteName(url: string): string {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.replace(/^www\./, '');
      const domain = hostname.split('.')[0];
      return this.capitalizeFirstLetter(domain);
    } catch {
      return 'Unknown Website';
    }
  }

  /**
   * Normalize URL
   */
  private normalizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.toString();
    } catch {
      return url;
    }
  }

  /**
   * Generate default description
   */
  private generateDefaultDescription(url: string): string {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.replace(/^www\./, '');
      const domain = hostname.split('.')[0];
      return `A website hosted at ${hostname}. Target audience: general users. Features: web-based interface, responsive design.`;
    } catch {
      return 'A website with various features and functionality. Target audience: general users. Features: web-based interface.';
    }
  }

  /**
   * Detect if website requires authentication
   */
  private detectAuthRequirement(url: string, description: string): boolean {
    const authKeywords = [
      'login', 'signin', 'sign-in', 'auth', 'authentication',
      'dashboard', 'admin', 'portal', 'account', 'user'
    ];

    const urlLower = url.toLowerCase();
    const descLower = description.toLowerCase();

    return authKeywords.some(keyword => 
      urlLower.includes(keyword) || descLower.includes(keyword)
    );
  }

  /**
   * Capitalize first letter
   */
  private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Save websites to JSON file
   */
  async saveWebsites(websites: Website[]): Promise<void> {
    try {
      logger.info('Saving websites to JSON file', { 
        outputFile: this.config.outputFile,
        count: websites.length 
      });

      const jsonContent = JSON.stringify(websites, null, 2);
      await fs.writeFile(this.config.outputFile, jsonContent);

      logger.info('Websites saved successfully', { 
        outputFile: this.config.outputFile 
      });

    } catch (error) {
      logger.error('Failed to save websites', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  /**
   * Validate websites
   */
  validateWebsites(websites: Website[]): { valid: Website[]; invalid: Website[] } {
    const valid: Website[] = [];
    const invalid: Website[] = [];

    websites.forEach(website => {
      if (this.isValidWebsite(website)) {
        valid.push(website);
      } else {
        invalid.push(website);
      }
    });

    return { valid, invalid };
  }

  /**
   * Check if website is valid
   */
  private isValidWebsite(website: Website): boolean {
    // Check required fields
    if (!website.id || !website.name || !website.url) {
      return false;
    }

    // Check URL format
    try {
      new URL(website.url);
    } catch {
      return false;
    }

    // Check description length
    if (website.description.length < 10) {
      return false;
    }

    return true;
  }

  /**
   * Generate statistics
   */
  generateStatistics(websites: Website[]): {
    total: number;
    withAuth: number;
    withoutAuth: number;
    byDomain: { [domain: string]: number };
  } {
    const stats = {
      total: websites.length,
      withAuth: websites.filter(w => w.requiresAuth).length,
      withoutAuth: websites.filter(w => !w.requiresAuth).length,
      byDomain: {} as { [domain: string]: number }
    };

    websites.forEach(website => {
      try {
        const urlObj = new URL(website.url);
        const domain = urlObj.hostname;
        stats.byDomain[domain] = (stats.byDomain[domain] || 0) + 1;
      } catch {
        // Ignore invalid URLs
      }
    });

    return stats;
  }
}

/**
 * Main function
 */
async function main() {
  try {
    const config: WebsiteParserConfig = {
      inputFile: '../README.md',
      outputFile: './data/websites.json'
    };

    const parser = new WebsiteParser(config);

    // Parse websites
    const websites = await parser.parseWebsites();

    // Validate websites
    const { valid, invalid } = parser.validateWebsites(websites);

    logger.info('Website validation completed', {
      total: websites.length,
      valid: valid.length,
      invalid: invalid.length
    });

    // Log invalid websites
    if (invalid.length > 0) {
      logger.warn('Invalid websites found', {
        invalid: invalid.map(w => ({ id: w.id, name: w.name, url: w.url }))
      });
    }

    // Save valid websites
    await parser.saveWebsites(valid);

    // Generate statistics
    const stats = parser.generateStatistics(valid);
    logger.info('Website statistics', stats);

    logger.info('Website parsing completed successfully');

  } catch (error) {
    logger.error('Website parsing failed', { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { WebsiteParser };
