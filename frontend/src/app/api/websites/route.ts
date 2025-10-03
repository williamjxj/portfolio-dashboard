import { NextRequest, NextResponse } from 'next/server';
import { Website } from '@/models/Website';
import { TechStackSummary } from '@/models/TechStack';

/**
 * GET /api/websites
 * Returns all websites with enhanced metadata
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const tech = searchParams.get('tech');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Load websites data
    const websites = await loadWebsitesData();

    // Apply filters
    let filteredWebsites = websites;

    if (search) {
      filteredWebsites = filteredWebsites.filter(website =>
        website.name.toLowerCase().includes(search.toLowerCase()) ||
        website.description.toLowerCase().includes(search.toLowerCase()) ||
        website.techStack?.frontend?.some(tech => tech.toLowerCase().includes(search.toLowerCase())) ||
        website.techStack?.backend?.some(tech => tech.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (status) {
      filteredWebsites = filteredWebsites.filter(website => website.status === status);
    }

    if (tech) {
      filteredWebsites = filteredWebsites.filter(website =>
        website.techStack?.frontend?.includes(tech) ||
        website.techStack?.backend?.includes(tech) ||
        website.techStack?.database?.includes(tech) ||
        website.techStack?.deployment?.includes(tech)
      );
    }

    // Apply pagination
    const paginatedWebsites = filteredWebsites.slice(offset, offset + limit);

    // Generate summary statistics
    const summary = generateTechStackSummary(websites);

    return NextResponse.json({
      websites: paginatedWebsites,
      summary,
      pagination: {
        total: filteredWebsites.length,
        limit,
        offset,
        hasMore: offset + limit < filteredWebsites.length
      },
      filters: {
        search,
        status,
        tech
      }
    });

  } catch (error) {
    console.error('Error fetching websites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch websites' },
      { status: 500 }
    );
  }
}

/**
 * Load websites data from JSON file
 */
async function loadWebsitesData(): Promise<Website[]> {
  try {
    // Use fetch to get the data from the public directory
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    
    // Try relative path first, then absolute
    let response;
    try {
      response = await fetch('/websites.json');
    } catch {
      response = await fetch(`${baseUrl}/websites.json`);
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }
    
    const websites = await response.json();
    
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
    // Return empty array if file loading fails
    return [];
  }
}

/**
 * Generate tech stack summary
 */
function generateTechStackSummary(websites: Website[]): TechStackSummary {
  const allTechnologies = new Set<string>();
  const categories = new Set<string>();
  let activeProjects = 0;
  let completedProjects = 0;
  let projectsWithVideos = 0;
  let projectsWithScreenshots = 0;
  let totalLoadTime = 0;

  websites.forEach(website => {
    // Count projects by status
    if (website.status === 'ok') activeProjects++;
    if (website.state === 'completed') completedProjects++;
    
    // Count media
    if (website.assets?.videos?.length > 0) projectsWithVideos++;
    if (website.assets?.screenshots?.length > 0) projectsWithScreenshots++;
    
    // Collect technologies
    if (website.techStack) {
      Object.values(website.techStack).forEach(techs => {
        if (Array.isArray(techs)) {
          techs.forEach(tech => allTechnologies.add(tech));
        }
      });
    }

    // Add performance data
    if (website.performance?.loadTime) {
      totalLoadTime += website.performance.loadTime;
    }
  });

  // Categorize technologies
  const technologyBreakdown = {
    frontend: [] as string[],
    backend: [] as string[],
    database: [] as string[],
    deployment: [] as string[],
    tools: [] as string[]
  };

  allTechnologies.forEach(tech => {
    if (isFrontendTech(tech)) technologyBreakdown.frontend.push(tech);
    else if (isBackendTech(tech)) technologyBreakdown.backend.push(tech);
    else if (isDatabaseTech(tech)) technologyBreakdown.database.push(tech);
    else if (isDeploymentTech(tech)) technologyBreakdown.deployment.push(tech);
    else technologyBreakdown.tools.push(tech);
  });

  return {
    totalWebsites: websites.length,
    totalTechnologies: allTechnologies.size,
    categories: Array.from(categories),
    statistics: {
      activeProjects,
      completedProjects,
      projectsWithVideos,
      projectsWithScreenshots,
      averageLoadTime: websites.length > 0 ? Math.round(totalLoadTime / websites.length) : 0
    },
    technologyBreakdown
  };
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

/**
 * Technology categorization helpers
 */
function isFrontendTech(tech: string): boolean {
  const frontendTechs = ['React', 'Vue', 'Angular', 'Next.js', 'Nuxt.js', 'Svelte', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind', 'Bootstrap'];
  return frontendTechs.some(ft => tech.toLowerCase().includes(ft.toLowerCase()));
}

function isBackendTech(tech: string): boolean {
  const backendTechs = ['Node.js', 'Express', 'Python', 'Django', 'Flask', 'Java', 'Spring', 'PHP', 'Laravel', 'Ruby', 'Rails', 'Go', 'Rust'];
  return backendTechs.some(bt => tech.toLowerCase().includes(bt.toLowerCase()));
}

function isDatabaseTech(tech: string): boolean {
  const databaseTechs = ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server', 'DynamoDB', 'Firebase'];
  return databaseTechs.some(dt => tech.toLowerCase().includes(dt.toLowerCase()));
}

function isDeploymentTech(tech: string): boolean {
  const deploymentTechs = ['Vercel', 'Netlify', 'AWS', 'Docker', 'Kubernetes', 'Heroku', 'DigitalOcean', 'Azure', 'GCP'];
  return deploymentTechs.some(dt => tech.toLowerCase().includes(dt.toLowerCase()));
}