import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { createLogger } from '@/lib/logger';

const logger = createLogger('asset-middleware');

export interface AssetConfig {
  basePath: string;
  publicPath: string;
  maxAge: number;
  allowedFormats: string[];
  maxFileSize: number;
}

export class AssetMiddleware {
  private config: AssetConfig;

  constructor(config: AssetConfig) {
    this.config = config;
  }

  /**
   * Check if request is for an asset
   */
  private isAssetRequest(pathname: string): boolean {
    return pathname.startsWith('/assets/');
  }

  /**
   * Get asset file path
   */
  private getAssetPath(pathname: string): string {
    const relativePath = pathname.substring('/assets/'.length);
    return path.join(this.config.publicPath, 'assets', relativePath);
  }

  /**
   * Check if file format is allowed
   */
  private isAllowedFormat(filePath: string): boolean {
    const ext = path.extname(filePath).toLowerCase().substring(1);
    return this.config.allowedFormats.includes(ext);
  }

  /**
   * Get content type for file
   */
  private getContentType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    
    const contentTypes: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      '.gif': 'image/gif',
      '.bmp': 'image/bmp',
      '.tiff': 'image/tiff'
    };

    return contentTypes[ext] || 'application/octet-stream';
  }

  /**
   * Serve asset file
   */
  private async serveAsset(filePath: string): Promise<NextResponse> {
    try {
      // Check if file exists
      await fs.access(filePath);
      
      // Check file format
      if (!this.isAllowedFormat(filePath)) {
        return new NextResponse('File format not allowed', { status: 403 });
      }

      // Get file stats
      const stats = await fs.stat(filePath);
      
      // Check file size
      if (stats.size > this.config.maxFileSize) {
        return new NextResponse('File too large', { status: 413 });
      }

      // Read file
      const buffer = await fs.readFile(filePath);
      
      // Create response
      const response = new NextResponse(buffer);
      
      // Set headers
      response.headers.set('Content-Type', this.getContentType(filePath));
      response.headers.set('Content-Length', stats.size.toString());
      response.headers.set('Cache-Control', `public, max-age=${this.config.maxAge}`);
      response.headers.set('Last-Modified', stats.mtime.toUTCString());
      response.headers.set('ETag', `"${stats.mtime.getTime()}"`);
      
      return response;
    } catch (error) {
      if (error instanceof Error && error.code === 'ENOENT') {
        return new NextResponse('Asset not found', { status: 404 });
      }
      
      logger.error('Error serving asset', { filePath, error: error instanceof Error ? error.message : 'Unknown error' });
      return new NextResponse('Internal server error', { status: 500 });
    }
  }

  /**
   * Handle asset request
   */
  async handle(request: NextRequest): Promise<NextResponse | null> {
    const pathname = request.nextUrl.pathname;
    
    // Check if this is an asset request
    if (!this.isAssetRequest(pathname)) {
      return null;
    }

    try {
      const filePath = this.getAssetPath(pathname);
      return await this.serveAsset(filePath);
    } catch (error) {
      logger.error('Asset middleware error', { pathname, error: error instanceof Error ? error.message : 'Unknown error' });
      return new NextResponse('Internal server error', { status: 500 });
    }
  }
}

/**
 * Create asset middleware with default config
 */
export function createAssetMiddleware(config: Partial<AssetConfig> = {}): AssetMiddleware {
  const defaultConfig: AssetConfig = {
    basePath: './storage',
    publicPath: './public',
    maxAge: 86400, // 24 hours
    allowedFormats: ['png', 'jpg', 'jpeg', 'webp', 'svg', 'ico', 'gif', 'bmp', 'tiff'],
    maxFileSize: 10 * 1024 * 1024 // 10MB
  };

  return new AssetMiddleware({ ...defaultConfig, ...config });
}

/**
 * Middleware function for Next.js
 */
export function assetMiddleware(request: NextRequest): Promise<NextResponse | null> {
  const middleware = createAssetMiddleware();
  return middleware.handle(request);
}
