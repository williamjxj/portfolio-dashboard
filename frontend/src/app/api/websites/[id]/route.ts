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

    const website = await websiteService.getWebsiteById(id);
    
    if (!website) {
      return NextResponse.json(
        {
          message: 'Website not found',
          code: 'WEBSITE_NOT_FOUND'
        },
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    return NextResponse.json(website, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error fetching website:', error);
    
    return NextResponse.json(
      {
        message: 'Failed to fetch website',
        code: 'FETCH_WEBSITE_ERROR',
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
