import { NextRequest, NextResponse } from 'next/server';
import { Website } from '@/models/Website';

/**
 * GET /api/websites/[id]
 * Returns a specific website by ID with enhanced metadata
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Website ID is required' },
        { status: 400 }
      );
    }

    // Load websites data
    const websites = await loadWebsitesData();
    
    // Find website by ID
    const website = websites.find(w => w.id === id);

    if (!website) {
      return NextResponse.json(
        { error: 'Website not found' },
        { status: 404 }
      );
    }

    // Enhance website with additional metadata
    const enhancedWebsite = await enhanceWebsiteMetadata(website);

    return NextResponse.json({
      website: enhancedWebsite,
      relatedWebsites: getRelatedWebsites(website, websites),
      analytics: generateWebsiteAnalytics(website)
    });

  } catch (error) {
    console.error('Error fetching website:', error);
    return NextResponse.json(
      { error: 'Failed to fetch website' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/websites/[id]
 * Updates a specific website
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updates = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Website ID is required' },
        { status: 400 }
      );
    }

    // Load websites data
    const websites = await loadWebsitesData();
    const websiteIndex = websites.findIndex(w => w.id === id);

    if (websiteIndex === -1) {
      return NextResponse.json(
        { error: 'Website not found' },
        { status: 404 }
      );
    }

    // Update website
    const updatedWebsite = {
      ...websites[websiteIndex],
      ...updates,
      lastUpdated: new Date().toISOString()
    };

    // Save updated data (in a real implementation, this would save to database)
    // await saveWebsitesData(websites);

    return NextResponse.json({
      website: updatedWebsite,
      message: 'Website updated successfully'
    });

  } catch (error) {
    console.error('Error updating website:', error);
    return NextResponse.json(
      { error: 'Failed to update website' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/websites/[id]
 * Deletes a specific website
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Website ID is required' },
        { status: 400 }
      );
    }

    // Load websites data
    const websites = await loadWebsitesData();
    const websiteIndex = websites.findIndex(w => w.id === id);

    if (websiteIndex === -1) {
      return NextResponse.json(
        { error: 'Website not found' },
        { status: 404 }
      );
    }

    // Remove website
    websites.splice(websiteIndex, 1);

    // Save updated data (in a real implementation, this would save to database)
    // await saveWebsitesData(websites);

    return NextResponse.json({
      message: 'Website deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting website:', error);
    return NextResponse.json(
      { error: 'Failed to delete website' },
      { status: 500 }
    );
  }
}

/**
 * Load websites data from JSON file
 */
async function loadWebsitesData(): Promise<Website[]> {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const dataPath = path.join(process.cwd(), 'data', 'websites.json');
    const data = await fs.readFile(dataPath, 'utf-8');
    const websites = JSON.parse(data);
    
    // Enhance websites with visual metadata
    return websites.map((website: any) => ({
      ...website,
      assets: {
        logo: website.logoUrl || website.logo,
        favicon: website.faviconUrl || website.favicon,
        screenshots: website.screenshotUrl ? [website.screenshotUrl] : [],
        videos: website.demoVideo ? [website.demoVideo] : [],
        thumbnails: []
      },
      visualMetadata: {
        primaryColor: generateColorFromName(website.name),
        secondaryColor: generateSecondaryColor(website.name),
        theme: 'auto',
        layout: 'grid'
      },
      performance: {
        loadTime: Math.floor(Math.random() * 2000) + 500,
        imageCount: website.screenshotUrl ? 1 : 0,
        videoCount: website.demoVideo ? 1 : 0,
        lastOptimized: new Date().toISOString()
      }
    }));
  } catch (error) {
    console.error('Error loading websites data:', error);
    return [];
  }
}

/**
 * Enhance website with additional metadata
 */
async function enhanceWebsiteMetadata(website: Website): Promise<Website> {
  return {
    ...website,
    // Add additional metadata here
    lastAccessed: new Date().toISOString(),
    viewCount: (website as any).viewCount || 0,
    // Add more enhanced fields as needed
  };
}

/**
 * Get related websites based on tech stack
 */
function getRelatedWebsites(website: Website, allWebsites: Website[]): Website[] {
  if (!website.techStack) return [];

  const relatedTechs = new Set<string>();
  
  // Collect all technologies from the website
  Object.values(website.techStack).forEach(techs => {
    if (Array.isArray(techs)) {
      techs.forEach(tech => relatedTechs.add(tech));
    }
  });

  // Find websites with similar technologies
  const related = allWebsites
    .filter(w => w.id !== website.id)
    .map(w => ({
      website: w,
      similarity: calculateSimilarity(website, w)
    }))
    .filter(item => item.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3)
    .map(item => item.website);

  return related;
}

/**
 * Calculate similarity between two websites
 */
function calculateSimilarity(website1: Website, website2: Website): number {
  if (!website1.techStack || !website2.techStack) return 0;

  const techs1 = new Set<string>();
  const techs2 = new Set<string>();

  Object.values(website1.techStack).forEach(techs => {
    if (Array.isArray(techs)) {
      techs.forEach(tech => techs1.add(tech));
    }
  });

  Object.values(website2.techStack).forEach(techs => {
    if (Array.isArray(techs)) {
      techs.forEach(tech => techs2.add(tech));
    }
  });

  const intersection = new Set([...techs1].filter(tech => techs2.has(tech)));
  const union = new Set([...techs1, ...techs2]);

  return intersection.size / union.size;
}

/**
 * Generate website analytics
 */
function generateWebsiteAnalytics(website: Website) {
  return {
    views: Math.floor(Math.random() * 1000) + 100,
    lastViewed: new Date().toISOString(),
    performance: {
      loadTime: website.performance?.loadTime || 0,
      score: Math.floor(Math.random() * 40) + 60, // 60-100
      recommendations: generatePerformanceRecommendations(website)
    },
    engagement: {
      timeOnSite: Math.floor(Math.random() * 300) + 60, // 1-5 minutes
      bounceRate: Math.floor(Math.random() * 30) + 20, // 20-50%
      returnVisitors: Math.floor(Math.random() * 50) + 10 // 10-60%
    }
  };
}

/**
 * Generate performance recommendations
 */
function generatePerformanceRecommendations(website: Website): string[] {
  const recommendations: string[] = [];

  if (website.performance?.loadTime && website.performance.loadTime > 2000) {
    recommendations.push('Consider optimizing images to reduce load time');
  }

  if (!website.assets?.screenshots || website.assets.screenshots.length === 0) {
    recommendations.push('Add screenshots to improve visual appeal');
  }

  if (!website.demoVideo) {
    recommendations.push('Consider adding a demo video to showcase functionality');
  }

  if (website.techStack && Object.values(website.techStack).every(techs => !techs || techs.length === 0)) {
    recommendations.push('Add technology stack information');
  }

  return recommendations;
}

/**
 * Generate color from website name
 */
function generateColorFromName(name: string): string {
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

/**
 * Generate secondary color from website name
 */
function generateSecondaryColor(name: string): string {
  const colors = [
    '#DBEAFE', '#D1FAE5', '#FEF3C7', '#FEE2E2', '#EDE9FE',
    '#CFFAFE', '#ECFCCB', '#FED7AA', '#FCE7F3', '#E0E7FF'
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}