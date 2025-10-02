#!/usr/bin/env node

import { createLogger } from '../src/lib/logger';
import fs from 'fs/promises';
import path from 'path';

const logger = createLogger('public-cleanup');

interface CleanupConfig {
  publicDir: string;
  websitesDataFile: string;
}

class PublicFolderCleanup {
  private config: CleanupConfig;

  constructor(config: CleanupConfig) {
    this.config = config;
  }

  /**
   * Clean up public folder by removing unused files
   */
  async cleanupPublicFolder(): Promise<void> {
    try {
      logger.info('Starting public folder cleanup', { 
        publicDir: this.config.publicDir 
      });

      // Load websites data to get referenced assets
      const websitesData = await fs.readFile(this.config.websitesDataFile, 'utf-8');
      const websites = JSON.parse(websitesData);

      // Extract all referenced asset paths
      const referencedAssets = this.extractReferencedAssets(websites);
      logger.info('Found referenced assets', { count: referencedAssets.length });

      // Get all files in public directory
      const allFiles = await this.getAllFilesInPublic();
      logger.info('Found all files in public directory', { count: allFiles.length });

      // Identify unused files
      const unusedFiles = this.identifyUnusedFiles(allFiles, referencedAssets);
      logger.info('Found unused files', { count: unusedFiles.length });

      // Remove unused files
      await this.removeUnusedFiles(unusedFiles);

      // Keep essential files
      await this.keepEssentialFiles();

      logger.info('Public folder cleanup completed successfully');

    } catch (error) {
      logger.error('Failed to cleanup public folder', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  /**
   * Extract all referenced asset paths from websites data
   */
  private extractReferencedAssets(websites: any[]): string[] {
    const referencedAssets: string[] = [];

    websites.forEach(website => {
      // Add screenshot
      if (website.screenshot) {
        referencedAssets.push(website.screenshot);
      }
      
      // Add logo
      if (website.logo) {
        referencedAssets.push(website.logo);
      }
      
      // Add favicon
      if (website.favicon) {
        referencedAssets.push(website.favicon);
      }
    });

    return referencedAssets;
  }

  /**
   * Get all files in public directory recursively
   */
  private async getAllFilesInPublic(): Promise<string[]> {
    const files: string[] = [];
    
    const scanDirectory = async (dir: string, basePath: string = '') => {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.join(basePath, entry.name);
        
        if (entry.isDirectory()) {
          await scanDirectory(fullPath, relativePath);
        } else {
          files.push(relativePath);
        }
      }
    };

    await scanDirectory(this.config.publicDir);
    return files;
  }

  /**
   * Identify unused files
   */
  private identifyUnusedFiles(allFiles: string[], referencedAssets: string[]): string[] {
    const unusedFiles: string[] = [];
    
    // Convert referenced assets to relative paths (remove leading slash)
    const referencedPaths = referencedAssets.map(asset => 
      asset.startsWith('/') ? asset.substring(1) : asset
    );

    // Add essential files that should always be kept
    const essentialFiles = [
      'favicon.ico',
      'favicon.svg',
      'apple-touch-icon.png',
      'logo.svg',
      'manifest.json',
      'next.svg',
      'vercel.svg'
    ];

    for (const file of allFiles) {
      const isReferenced = referencedPaths.some(refPath => file === refPath);
      const isEssential = essentialFiles.some(essential => file === essential);
      
      if (!isReferenced && !isEssential) {
        unusedFiles.push(file);
      }
    }

    return unusedFiles;
  }

  /**
   * Remove unused files
   */
  private async removeUnusedFiles(unusedFiles: string[]): Promise<void> {
    for (const file of unusedFiles) {
      const fullPath = path.join(this.config.publicDir, file);
      try {
        await fs.unlink(fullPath);
        logger.info('Removed unused file', { file });
      } catch (error) {
        logger.warn('Failed to remove file', { file, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }
  }

  /**
   * Keep essential files and remove duplicates
   */
  private async keepEssentialFiles(): Promise<void> {
    // Remove duplicate favicon.ico from app directory if it exists
    const appFaviconPath = path.join(this.config.publicDir, '..', 'src', 'app', 'favicon.ico');
    try {
      await fs.access(appFaviconPath);
      await fs.unlink(appFaviconPath);
      logger.info('Removed duplicate favicon.ico from app directory');
    } catch {
      // File doesn't exist, that's fine
    }

    // Keep only the latest version of each asset (remove -optimized duplicates)
    await this.removeOptimizedDuplicates();
  }

  /**
   * Remove optimized duplicates (keep original, remove -optimized versions)
   */
  private async removeOptimizedDuplicates(): Promise<void> {
    const assetsDir = path.join(this.config.publicDir, 'assets');
    
    const removeOptimizedInDir = async (dir: string) => {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          
          if (entry.isDirectory()) {
            await removeOptimizedInDir(fullPath);
          } else if (entry.name.includes('-optimized.')) {
            await fs.unlink(fullPath);
            logger.info('Removed optimized duplicate', { file: entry.name });
          }
        }
      } catch (error) {
        // Directory might not exist, that's fine
      }
    };

    await removeOptimizedInDir(assetsDir);
  }
}

/**
 * Main function
 */
async function main() {
  try {
    const config: CleanupConfig = {
      publicDir: './public',
      websitesDataFile: './data/websites.json'
    };

    const cleanup = new PublicFolderCleanup(config);
    await cleanup.cleanupPublicFolder();

    logger.info('Public folder cleanup completed successfully');

  } catch (error) {
    logger.error('Public folder cleanup failed', { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { PublicFolderCleanup };

