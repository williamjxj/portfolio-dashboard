import { NextRequest, NextResponse } from 'next/server';
import { TechStackSummary } from '@/models/TechStack';
import { Website } from '@/models/Website';

/**
 * GET /api/tech-stack
 * Returns comprehensive tech stack summary and statistics
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const technology = searchParams.get('technology');
    const includeStats = searchParams.get('includeStats') === 'true';

    // Load websites data
    const websites = await loadWebsitesData();

    // Generate tech stack summary
    const summary = generateTechStackSummary(websites);

    // Get technology breakdown
    const technologyBreakdown = getTechnologyBreakdown(websites);

    // Get category breakdown
    const categoryBreakdown = getCategoryBreakdown(websites);

    // Get trending technologies
    const trendingTechnologies = getTrendingTechnologies(websites);

    // Get technology usage statistics
    const usageStats = getTechnologyUsageStats(websites);

    const response: any = {
      summary,
      technologyBreakdown,
      categoryBreakdown,
      trendingTechnologies,
      usageStats
    };

    // Add detailed statistics if requested
    if (includeStats) {
      response.detailedStats = {
        performanceMetrics: getPerformanceMetrics(websites),
        deploymentStats: getDeploymentStats(websites),
        technologyAdoption: getTechnologyAdoption(websites),
        projectHealth: getProjectHealth(websites)
      };
    }

    // Filter by category if specified
    if (category) {
      response.filteredBreakdown = technologyBreakdown[category as keyof typeof technologyBreakdown] || [];
    }

    // Filter by technology if specified
    if (technology) {
      response.technologyDetails = getTechnologyDetails(technology, websites);
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching tech stack data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tech stack data' },
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
 * Generate comprehensive tech stack summary
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
 * Get detailed technology breakdown
 */
function getTechnologyBreakdown(websites: Website[]) {
  const breakdown: any = {
    frontend: {},
    backend: {},
    database: {},
    deployment: {},
    tools: {}
  };

  websites.forEach(website => {
    if (!website.techStack) return;

    Object.entries(website.techStack).forEach(([category, techs]) => {
      // Only process known categories
      if (!breakdown[category]) return;
      
      if (Array.isArray(techs)) {
        techs.forEach(tech => {
          if (!breakdown[category][tech]) {
            breakdown[category][tech] = {
              count: 0,
              websites: [],
              percentage: 0
            };
          }
          breakdown[category][tech].count++;
          breakdown[category][tech].websites.push(website.id);
        });
      }
    });
  });

  // Calculate percentages
  Object.keys(breakdown).forEach(category => {
    const total = Object.values(breakdown[category]).reduce((sum: number, tech: any) => sum + tech.count, 0);
    Object.keys(breakdown[category]).forEach(tech => {
      breakdown[category][tech].percentage = total > 0 ? Math.round((breakdown[category][tech].count / total) * 100) : 0;
    });
  });

  return breakdown;
}

/**
 * Get category breakdown
 */
function getCategoryBreakdown(websites: Website[]) {
  const categories = {
    frontend: 0,
    backend: 0,
    database: 0,
    deployment: 0,
    tools: 0
  };

  websites.forEach(website => {
    if (!website.techStack) return;

    Object.entries(website.techStack).forEach(([category, techs]) => {
      if (Array.isArray(techs) && techs.length > 0) {
        categories[category as keyof typeof categories]++;
      }
    });
  });

  return categories;
}

/**
 * Get trending technologies
 */
function getTrendingTechnologies(websites: Website[]) {
  const techUsage: { [key: string]: number } = {};

  websites.forEach(website => {
    if (!website.techStack) return;

    Object.values(website.techStack).forEach(techs => {
      if (Array.isArray(techs)) {
        techs.forEach(tech => {
          techUsage[tech] = (techUsage[tech] || 0) + 1;
        });
      }
    });
  });

  return Object.entries(techUsage)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([tech, count]) => ({ technology: tech, count, percentage: Math.round((count / websites.length) * 100) }));
}

/**
 * Get technology usage statistics
 */
function getTechnologyUsageStats(websites: Website[]) {
  const stats = {
    mostUsed: '',
    leastUsed: '',
    averagePerProject: 0,
    totalUnique: 0
  };

  const techUsage: { [key: string]: number } = {};
  let totalTechnologies = 0;

  websites.forEach(website => {
    if (!website.techStack) return;

    Object.values(website.techStack).forEach(techs => {
      if (Array.isArray(techs)) {
        totalTechnologies += techs.length;
        techs.forEach(tech => {
          techUsage[tech] = (techUsage[tech] || 0) + 1;
        });
      }
    });
  });

  const sortedTechs = Object.entries(techUsage).sort(([, a], [, b]) => b - a);
  
  if (sortedTechs.length > 0) {
    stats.mostUsed = sortedTechs[0][0];
    stats.leastUsed = sortedTechs[sortedTechs.length - 1][0];
  }
  
  stats.averagePerProject = websites.length > 0 ? Math.round(totalTechnologies / websites.length) : 0;
  stats.totalUnique = Object.keys(techUsage).length;

  return stats;
}

/**
 * Get performance metrics
 */
function getPerformanceMetrics(websites: Website[]) {
  const loadTimes = websites
    .map(w => w.performance?.loadTime)
    .filter(time => time !== undefined) as number[];

  return {
    averageLoadTime: loadTimes.length > 0 ? Math.round(loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length) : 0,
    fastestLoadTime: loadTimes.length > 0 ? Math.min(...loadTimes) : 0,
    slowestLoadTime: loadTimes.length > 0 ? Math.max(...loadTimes) : 0,
    performanceScore: calculatePerformanceScore(loadTimes)
  };
}

/**
 * Get deployment statistics
 */
function getDeploymentStats(websites: Website[]) {
  const deployments: { [key: string]: number } = {};

  websites.forEach(website => {
    if (website.deploymentInfo?.platform) {
      deployments[website.deploymentInfo.platform] = (deployments[website.deploymentInfo.platform] || 0) + 1;
    }
  });

  return deployments;
}

/**
 * Get technology adoption rates
 */
function getTechnologyAdoption(websites: Website[]) {
  const adoption: { [key: string]: { adopted: number; total: number; rate: number } } = {};

  websites.forEach(website => {
    if (!website.techStack) return;

    Object.values(website.techStack).forEach(techs => {
      if (Array.isArray(techs)) {
        techs.forEach(tech => {
          if (!adoption[tech]) {
            adoption[tech] = { adopted: 0, total: 0, rate: 0 };
          }
          adoption[tech].adopted++;
        });
      }
    });
  });

  // Calculate adoption rates
  Object.keys(adoption).forEach(tech => {
    adoption[tech].total = websites.length;
    adoption[tech].rate = Math.round((adoption[tech].adopted / websites.length) * 100);
  });

  return adoption;
}

/**
 * Get project health metrics
 */
function getProjectHealth(websites: Website[]) {
  const health = {
    healthy: 0,
    needsAttention: 0,
    critical: 0,
    total: websites.length
  };

  websites.forEach(website => {
    if (website.status === 'ok') {
      health.healthy++;
    } else if (website.status === 'unavailable') {
      health.critical++;
    } else {
      health.needsAttention++;
    }
  });

  return health;
}

/**
 * Get technology details
 */
function getTechnologyDetails(technology: string, websites: Website[]) {
  const details = {
    technology,
    usageCount: 0,
    websites: [] as string[],
    categories: [] as string[],
    averageLoadTime: 0,
    performanceScore: 0
  };

  let totalLoadTime = 0;
  let loadTimeCount = 0;

  websites.forEach(website => {
    if (!website.techStack) return;

    let found = false;
    Object.entries(website.techStack).forEach(([category, techs]) => {
      if (Array.isArray(techs) && techs.includes(technology)) {
        found = true;
        if (!details.categories.includes(category)) {
          details.categories.push(category);
        }
      }
    });

    if (found) {
      details.usageCount++;
      details.websites.push(website.id);
      
      if (website.performance?.loadTime) {
        totalLoadTime += website.performance.loadTime;
        loadTimeCount++;
      }
    }
  });

  details.averageLoadTime = loadTimeCount > 0 ? Math.round(totalLoadTime / loadTimeCount) : 0;
  details.performanceScore = calculatePerformanceScore([totalLoadTime]);

  return details;
}

/**
 * Calculate performance score
 */
function calculatePerformanceScore(loadTimes: number[]): number {
  if (loadTimes.length === 0) return 0;
  
  const average = loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length;
  
  if (average < 1000) return 100;
  if (average < 2000) return 80;
  if (average < 3000) return 60;
  if (average < 5000) return 40;
  return 20;
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