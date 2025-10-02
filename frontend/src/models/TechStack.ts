/**
 * TechStackInfo model for technical information about websites
 * Represents the technical stack used in a website project
 */

export interface TechStackInfo {
  /** Frontend frameworks and libraries */
  frontend: string[];
  
  /** Backend technologies and frameworks */
  backend: string[];
  
  /** Database systems and tools */
  database: string[];
  
  /** Deployment platforms and services */
  deployment: string[];
  
  /** AI/ML tools and frameworks */
  aiTools: string[];
  
  /** Other technologies and tools */
  other: string[];
  
  /** Version information (optional) */
  version?: string;
  
  /** Data source or last updated timestamp */
  source: string;
}

/**
 * Validation function for TechStackInfo
 * Ensures all required fields are present and valid
 */
export function validateTechStackInfo(techStack: TechStackInfo): boolean {
  if (!techStack) return false;
  
  // Check required arrays are present and non-empty
  const requiredArrays = ['frontend', 'backend', 'database', 'deployment'];
  for (const field of requiredArrays) {
    const value = techStack[field as keyof TechStackInfo];
    if (!Array.isArray(value) || value.length === 0) {
      return false;
    }
  }
  
  // Check source is present and non-empty
  if (!techStack.source || typeof techStack.source !== 'string') {
    return false;
  }
  
  // Check version if provided
  if (techStack.version && typeof techStack.version !== 'string') {
    return false;
  }
  
  return true;
}

/**
 * Create a default TechStackInfo object
 */
export function createDefaultTechStackInfo(): TechStackInfo {
  return {
    frontend: [],
    backend: [],
    database: [],
    deployment: [],
    aiTools: [],
    other: [],
    source: new Date().toISOString()
  };
}

/**
 * Tech stack categories for organization
 */
export const TECH_STACK_CATEGORIES = {
  FRONTEND: 'frontend',
  BACKEND: 'backend', 
  DATABASE: 'database',
  DEPLOYMENT: 'deployment',
  AI_TOOLS: 'aiTools',
  OTHER: 'other'
} as const;

export type TechStackCategory = typeof TECH_STACK_CATEGORIES[keyof typeof TECH_STACK_CATEGORIES];

/**
 * Tech stack summary interface for overview statistics
 */
export interface TechStackSummary {
  totalWebsites: number;
  totalTechnologies: number;
  categories: string[];
  
  // Enhanced statistics
  statistics: {
    activeProjects: number;
    completedProjects: number;
    projectsWithVideos: number;
    projectsWithScreenshots: number;
    averageLoadTime: number;
  };
  
  // Technology breakdown
  technologyBreakdown: {
    frontend: string[];
    backend: string[];
    database: string[];
    deployment: string[];
    tools: string[];
  };
}
