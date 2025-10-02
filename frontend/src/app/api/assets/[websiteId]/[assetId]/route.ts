import { NextRequest, NextResponse } from 'next/server';
import { AssetMetadata } from '@/models/AssetMetadata';

/**
 * GET /api/assets/[websiteId]/[assetId]
 * Returns a specific asset for a website
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { websiteId: string; assetId: string } }
) {
  try {
    const { websiteId, assetId } = params;

    if (!websiteId || !assetId) {
      return NextResponse.json(
        { error: 'Website ID and Asset ID are required' },
        { status: 400 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const optimized = searchParams.get('optimized') === 'true';
    const format = searchParams.get('format');
    const width = searchParams.get('width');
    const height = searchParams.get('height');
    const quality = searchParams.get('quality');

    // Load website data
    const website = await loadWebsiteData(websiteId);

    if (!website) {
      return NextResponse.json(
        { error: 'Website not found' },
        { status: 404 }
      );
    }

    // Generate asset metadata
    const asset = await generateSpecificAssetMetadata(
      website, 
      assetId, 
      { optimized, format, width, height, quality }
    );

    if (!asset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      asset,
      website: {
        id: website.id,
        name: website.name,
        url: website.url
      },
      optimization: {
        applied: optimized,
        format: format || asset.format,
        dimensions: {
          width: width ? parseInt(width) : undefined,
          height: height ? parseInt(height) : undefined
        },
        quality: quality ? parseInt(quality) : undefined
      }
    });

  } catch (error) {
    console.error('Error fetching asset:', error);
    return NextResponse.json(
      { error: 'Failed to fetch asset' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/assets/[websiteId]/[assetId]
 * Updates a specific asset
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { websiteId: string; assetId: string } }
) {
  try {
    const { websiteId, assetId } = params;
    const updates = await request.json();

    if (!websiteId || !assetId) {
      return NextResponse.json(
        { error: 'Website ID and Asset ID are required' },
        { status: 400 }
      );
    }

    // In a real implementation, this would update the asset in the database
    // For now, we'll return a success response

    return NextResponse.json({
      message: 'Asset updated successfully',
      assetId,
      websiteId,
      updates
    });

  } catch (error) {
    console.error('Error updating asset:', error);
    return NextResponse.json(
      { error: 'Failed to update asset' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/assets/[websiteId]/[assetId]
 * Deletes a specific asset
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { websiteId: string; assetId: string } }
) {
  try {
    const { websiteId, assetId } = params;

    if (!websiteId || !assetId) {
      return NextResponse.json(
        { error: 'Website ID and Asset ID are required' },
        { status: 400 }
      );
    }

    // In a real implementation, this would delete the asset from the database
    // For now, we'll return a success response

    return NextResponse.json({
      message: 'Asset deleted successfully',
      assetId,
      websiteId
    });

  } catch (error) {
    console.error('Error deleting asset:', error);
    return NextResponse.json(
      { error: 'Failed to delete asset' },
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
 * Generate specific asset metadata
 */
async function generateSpecificAssetMetadata(
  website: any, 
  assetId: string,
  options: {
    optimized?: boolean;
    format?: string | null;
    width?: string | null;
    height?: string | null;
    quality?: string | null;
  }
): Promise<AssetMetadata | null> {
  const { optimized, format, width, height, quality } = options;

  // Determine asset type from assetId
  let assetType: string;
  let assetUrl: string;
  let filename: string;

  if (assetId.includes('logo')) {
    assetType = 'logo';
    assetUrl = website.logoUrl || website.logo;
    filename = 'logo.png';
  } else if (assetId.includes('favicon')) {
    assetType = 'favicon';
    assetUrl = website.faviconUrl || website.favicon;
    filename = 'favicon.ico';
  } else if (assetId.includes('screenshot')) {
    assetType = 'screenshot';
    assetUrl = website.screenshotUrl || website.screenshot;
    filename = 'screenshot.png';
  } else if (assetId.includes('video')) {
    assetType = 'video';
    assetUrl = website.demoVideo;
    filename = 'demo.mp4';
  } else {
    return null;
  }

  if (!assetUrl) {
    return null;
  }

  // Apply optimization parameters if requested
  let optimizedUrl = assetUrl;
  if (optimized || format || width || height || quality) {
    optimizedUrl = await applyOptimization(assetUrl, {
      format: format || 'webp',
      width: width ? parseInt(width) : undefined,
      height: height ? parseInt(height) : undefined,
      quality: quality ? parseInt(quality) : 80
    });
  }

  return {
    id: assetId,
    websiteId: website.id,
    type: assetType as any,
    url: optimizedUrl,
    filename,
    size: 0, // Would be calculated in real implementation
    format: format || getFormatFromUrl(assetUrl),
    dimensions: {
      width: width ? parseInt(width) : undefined,
      height: height ? parseInt(height) : undefined
    },
    optimized: optimized || false,
    webpUrl: format === 'webp' ? optimizedUrl : undefined,
    avifUrl: format === 'avif' ? optimizedUrl : undefined,
    isFallback: false,
    lastAccessed: new Date().toISOString()
  };
}

/**
 * Apply optimization to asset URL
 */
async function applyOptimization(
  url: string, 
  options: {
    format: string;
    width?: number;
    height?: number;
    quality: number;
  }
): Promise<string> {
  const { format, width, height, quality } = options;
  
  // In a real implementation, this would use an image optimization service
  // For now, we'll add query parameters to simulate optimization
  const params = new URLSearchParams();
  
  if (format !== 'original') {
    params.set('format', format);
  }
  if (width) {
    params.set('w', width.toString());
  }
  if (height) {
    params.set('h', height.toString());
  }
  if (quality !== 80) {
    params.set('q', quality.toString());
  }

  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${params.toString()}`;
}

/**
 * Get format from URL
 */
function getFormatFromUrl(url: string): string {
  const extension = url.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'jpg';
    case 'png':
      return 'png';
    case 'webp':
      return 'webp';
    case 'avif':
      return 'avif';
    case 'ico':
      return 'ico';
    case 'mp4':
      return 'mp4';
    default:
      return 'png';
  }
}
