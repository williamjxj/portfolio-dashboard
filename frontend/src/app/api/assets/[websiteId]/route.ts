import { NextRequest, NextResponse } from 'next/server';
import { AssetMetadata } from '@/models/AssetMetadata';

/**
 * GET /api/assets/[websiteId]
 * Returns all assets for a specific website
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { websiteId: string } }
) {
  try {
    const { websiteId } = params;

    if (!websiteId) {
      return NextResponse.json(
        { error: 'Website ID is required' },
        { status: 400 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const optimized = searchParams.get('optimized') === 'true';

    // Load website data to get asset information
    const website = await loadWebsiteData(websiteId);

    if (!website) {
      return NextResponse.json(
        { error: 'Website not found' },
        { status: 404 }
      );
    }

    // Generate asset metadata
    const assets = await generateAssetMetadata(website, { type, optimized });

    return NextResponse.json({
      websiteId,
      assets,
      total: assets.length,
      types: getAssetTypes(assets),
      summary: generateAssetSummary(assets)
    });

  } catch (error) {
    console.error('Error fetching website assets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch website assets' },
      { status: 500 }
    );
  }
}

/**
 * Load website data
 */
async function loadWebsiteData(websiteId: string) {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const dataPath = path.join(process.cwd(), 'data', 'websites.json');
    const data = await fs.readFile(dataPath, 'utf-8');
    const websites = JSON.parse(data);
    
    return websites.find((w: any) => w.id === websiteId);
  } catch (error) {
    console.error('Error loading website data:', error);
    return null;
  }
}

/**
 * Generate asset metadata for a website
 */
async function generateAssetMetadata(website: any, options: { type?: string | null; optimized?: boolean }) {
  const assets: AssetMetadata[] = [];

  // Add logo asset
  if (website.logoUrl || website.logo) {
    const logoAsset: AssetMetadata = {
      id: `${website.id}-logo`,
      websiteId: website.id,
      type: 'logo',
      url: website.logoUrl || website.logo,
      filename: 'logo.png',
      size: 0,
      format: 'png',
      optimized: options.optimized || false,
      isFallback: false,
      lastAccessed: new Date().toISOString()
    };

    if (!options.type || options.type === 'logo') {
      assets.push(logoAsset);
    }
  }

  // Add favicon asset
  if (website.faviconUrl || website.favicon) {
    const faviconAsset: AssetMetadata = {
      id: `${website.id}-favicon`,
      websiteId: website.id,
      type: 'favicon',
      url: website.faviconUrl || website.favicon,
      filename: 'favicon.ico',
      size: 0,
      format: 'ico',
      optimized: options.optimized || false,
      isFallback: false,
      lastAccessed: new Date().toISOString()
    };

    if (!options.type || options.type === 'favicon') {
      assets.push(faviconAsset);
    }
  }

  // Add screenshot assets
  if (website.screenshotUrl || website.screenshot) {
    const screenshotAsset: AssetMetadata = {
      id: `${website.id}-screenshot`,
      websiteId: website.id,
      type: 'screenshot',
      url: website.screenshotUrl || website.screenshot,
      filename: 'screenshot.png',
      size: 0,
      format: 'png',
      optimized: options.optimized || false,
      isFallback: false,
      lastAccessed: new Date().toISOString()
    };

    if (!options.type || options.type === 'screenshot') {
      assets.push(screenshotAsset);
    }
  }

  // Add video assets
  if (website.demoVideo) {
    const videoAsset: AssetMetadata = {
      id: `${website.id}-video`,
      websiteId: website.id,
      type: 'video',
      url: website.demoVideo,
      filename: 'demo.mp4',
      size: 0,
      format: 'mp4',
      optimized: options.optimized || false,
      isFallback: false,
      lastAccessed: new Date().toISOString()
    };

    if (!options.type || options.type === 'video') {
      assets.push(videoAsset);
    }
  }

  return assets;
}

/**
 * Get asset types from assets array
 */
function getAssetTypes(assets: AssetMetadata[]): string[] {
  return [...new Set(assets.map(asset => asset.type))];
}

/**
 * Generate asset summary
 */
function generateAssetSummary(assets: AssetMetadata[]) {
  const summary = {
    total: assets.length,
    byType: {} as { [key: string]: number },
    totalSize: 0,
    optimized: 0,
    fallbacks: 0
  };

  assets.forEach(asset => {
    // Count by type
    summary.byType[asset.type] = (summary.byType[asset.type] || 0) + 1;
    
    // Add to total size
    summary.totalSize += asset.size;
    
    // Count optimized assets
    if (asset.optimized) {
      summary.optimized++;
    }
    
    // Count fallback assets
    if (asset.isFallback) {
      summary.fallbacks++;
    }
  });

  return summary;
}
