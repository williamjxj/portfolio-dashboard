import { NextRequest, NextResponse } from 'next/server';
import { WebsiteService } from '@/services/WebsiteService';
import { WebsiteModel } from '@/models/Website';
import { AuthenticationCredentialsModel } from '@/models/AuthenticationCredentials';
import { AssetMetadataModel } from '@/models/AssetMetadata';

// Initialize services
const websiteModel = new WebsiteModel();
const authModel = new AuthenticationCredentialsModel();
const assetModel = new AssetMetadataModel();
const websiteService = new WebsiteService(websiteModel, authModel, assetModel);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        {
          message: 'Website ID is required',
          code: 'MISSING_ID'
        },
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    const favicon = await websiteService.getWebsiteFavicon(id);
    
    if (!favicon) {
      return NextResponse.json(
        {
          message: 'Favicon not found',
          code: 'FAVICON_NOT_FOUND'
        },
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // In a real implementation, you would read the actual image file
    // For now, we'll return a placeholder response
    const imageBuffer = Buffer.from('placeholder-favicon-data');
    
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/x-icon',
        'Cache-Control': 'public, max-age=86400',
        'Content-Length': imageBuffer.length.toString()
      }
    });
  } catch (error) {
    console.error('Error fetching favicon:', error);
    
    return NextResponse.json(
      {
        message: 'Failed to fetch favicon',
        code: 'FETCH_FAVICON_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
