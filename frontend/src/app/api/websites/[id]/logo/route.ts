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

    const logo = await websiteService.getWebsiteLogo(id);
    
    if (!logo) {
      return NextResponse.json(
        {
          message: 'Logo not found',
          code: 'LOGO_NOT_FOUND'
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
    const imageBuffer = Buffer.from('placeholder-logo-data');
    
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400',
        'Content-Length': imageBuffer.length.toString()
      }
    });
  } catch (error) {
    console.error('Error fetching logo:', error);
    
    return NextResponse.json(
      {
        message: 'Failed to fetch logo',
        code: 'FETCH_LOGO_ERROR',
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
