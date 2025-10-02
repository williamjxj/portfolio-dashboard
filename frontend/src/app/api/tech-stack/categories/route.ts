import { NextResponse } from 'next/server';
import { DataLoader } from '@/lib/data-loader';
import { Website } from '@/models/Website';

// Initialize data loader
const dataLoader = new DataLoader('./data');

interface TechCategory {
  name: string;
  count: number;
  technologies: string[];
}

export async function GET() {
  try {
    // Load websites data
    const websitesData = await dataLoader.loadWebsites();
    const websites: Website[] = websitesData;

    // Calculate tech categories
    const categories = calculateTechCategories(websites);

    return NextResponse.json(categories, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error fetching tech stack categories:', error);
    
    return NextResponse.json(
      {
        error: 'TechCategoriesError',
        message: 'Failed to fetch tech stack categories',
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
 * Calculate tech categories from websites data
 */
function calculateTechCategories(websites: Website[]): TechCategory[] {
  const techMap = new Map<string, Set<string>>();

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

  // Sort categories by count (descending)
  return categories.sort((a, b) => b.count - a.count);
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




