import { NextResponse } from 'next/server';
import { WebsiteService } from '@/services/WebsiteService';
import { WebsiteModel } from '@/models/Website';
import { AuthenticationCredentialsModel } from '@/models/AuthenticationCredentials';
import { AssetMetadataModel } from '@/models/AssetMetadata';
import { DataLoader } from '@/lib/data-loader';
import { TechStackInfo } from '@/models/TechStack';
import path from 'path';

// Initialize data loader
const dataLoader = new DataLoader(path.join(process.cwd(), 'data'));

export async function GET() {
  try {
    // Load data from files
    const websitesData = await dataLoader.loadWebsites();
    const authData = await dataLoader.loadAuthCredentials();
    const assetData = await dataLoader.loadAssetMetadata();

    // Initialize models with loaded data
    const websiteModel = new WebsiteModel();
    const authModel = new AuthenticationCredentialsModel();
    const assetModel = new AssetMetadataModel();

    // Load data into models
    await websiteModel.loadFromData(websitesData);
    await authModel.loadFromData(authData);
    await assetModel.loadFromData(assetData);

    // Initialize service
    const websiteService = new WebsiteService(websiteModel, authModel, assetModel);
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
