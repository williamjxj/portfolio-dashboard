import { NextResponse } from 'next/server';
import { DataLoader } from '@/lib/data-loader';
import { Website } from '@/models/Website';
import { TechStackInfo, TechStackSummary } from '@/models/TechStack';
import path from 'path';

// Initialize data loader
const dataLoader = new DataLoader(path.join(process.cwd(), 'data'));

export async function GET() {
  try {
    // Load websites data
    const websitesData = await dataLoader.loadWebsites();
    const websites: Website[] = websitesData;

    // Calculate tech stack summary
    const summary = calculateTechStackSummary(websites);

    return NextResponse.json(summary, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error fetching tech stack summary:', error);
    
    return NextResponse.json(
      {
        error: 'TechStackSummaryError',
        message: 'Failed to fetch tech stack summary',
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

/**
 * Calculate tech stack summary from websites data
 */
function calculateTechStackSummary(websites: Website[]): TechStackSummary {
  const techMap = new Map<string, Set<string>>();
  let totalTechnologies = 0;

  // Process each website's tech stack
  websites.forEach(website => {
    if (website.techStack) {
      const techStack = website.techStack;
      
      // Process each category
      Object.entries(techStack).forEach(([category, technologies]) => {
        if (Array.isArray(technologies)) {
          if (!techMap.has(category)) {
            techMap.set(category, new Set());
          }
          
          technologies.forEach(tech => {
            if (tech && typeof tech === 'string') {
              techMap.get(category)!.add(tech);
              totalTechnologies++;
            }
          });
        }
      });
    }
  });

  // Convert to categories array
  const categories = Array.from(techMap.entries()).map(([name, technologies]) => ({
    name: formatCategoryName(name),
    count: technologies.size,
    technologies: Array.from(technologies).sort()
  }));

  return {
    totalWebsites: websites.length,
    totalTechnologies,
    categories
  };
}

/**
 * Format category name for display
 */
function formatCategoryName(category: string): string {
  const nameMap: Record<string, string> = {
    'frontend': 'Frontend',
    'backend': 'Backend',
    'database': 'Database',
    'deployment': 'Deployment',
    'aiTools': 'AI/ML Tools',
    'other': 'Other'
  };
  
  return nameMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
}
