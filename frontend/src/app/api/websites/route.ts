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

export async function GET(request: NextRequest) {
  try {
    const websites = await websiteService.getAllWebsites();
    
    return NextResponse.json(websites, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error fetching websites:', error);
    
    return NextResponse.json(
      {
        message: 'Failed to fetch websites',
        code: 'FETCH_WEBSITES_ERROR',
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
