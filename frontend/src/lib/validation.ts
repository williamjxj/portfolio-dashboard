/**
 * Validation utilities for tech stack data
 * Provides validation functions for TechStackInfo fields with proper constraints
 */

import { TechStackInfo } from '@/models/TechStack';

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate tech stack information
 */
export function validateTechStackInfo(techStack: TechStackInfo): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!techStack) {
    errors.push('Tech stack information is required');
    return { isValid: false, errors, warnings };
  }

  // Validate required arrays
  const requiredArrays = [
    { field: 'frontend', label: 'Frontend' },
    { field: 'backend', label: 'Backend' },
    { field: 'database', label: 'Database' },
    { field: 'deployment', label: 'Deployment' }
  ];

  for (const { field, label } of requiredArrays) {
    const value = techStack[field as keyof TechStackInfo];
    if (!Array.isArray(value)) {
      errors.push(`${label} must be an array`);
    } else if (value.length === 0) {
      errors.push(`${label} cannot be empty`);
    } else {
      // Validate array items
      value.forEach((item, index) => {
        if (typeof item !== 'string' || item.trim().length === 0) {
          errors.push(`${label}[${index}] must be a non-empty string`);
        }
      });
    }
  }

  // Validate optional arrays
  const optionalArrays = [
    { field: 'aiTools', label: 'AI Tools' },
    { field: 'other', label: 'Other' }
  ];

  for (const { field, label } of optionalArrays) {
    const value = techStack[field as keyof TechStackInfo];
    if (value !== undefined && !Array.isArray(value)) {
      errors.push(`${label} must be an array`);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item !== 'string' || item.trim().length === 0) {
          errors.push(`${label}[${index}] must be a non-empty string`);
        }
      });
    }
  }

  // Validate source field
  if (!techStack.source || typeof techStack.source !== 'string') {
    errors.push('Source is required and must be a string');
  } else if (!isValidISODate(techStack.source)) {
    warnings.push('Source should be a valid ISO date string');
  }

  // Validate version field if provided
  if (techStack.version !== undefined) {
    if (typeof techStack.version !== 'string') {
      errors.push('Version must be a string');
    } else if (!isValidSemanticVersion(techStack.version)) {
      warnings.push('Version should follow semantic versioning (e.g., 1.0.0)');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate individual tech stack category
 */
export function validateTechStackCategory(
  category: string,
  technologies: string[]
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!Array.isArray(technologies)) {
    errors.push(`${category} must be an array`);
    return { isValid: false, errors, warnings };
  }

  if (technologies.length === 0) {
    warnings.push(`${category} is empty`);
  }

  technologies.forEach((tech, index) => {
    if (typeof tech !== 'string') {
      errors.push(`${category}[${index}] must be a string`);
    } else if (tech.trim().length === 0) {
      errors.push(`${category}[${index}] cannot be empty`);
    } else if (tech.length > 100) {
      warnings.push(`${category}[${index}] is very long (${tech.length} characters)`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate tech stack completeness
 */
export function validateTechStackCompleteness(techStack: TechStackInfo): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const requiredCategories = ['frontend', 'backend', 'database', 'deployment'];
  const missingCategories = requiredCategories.filter(
    category => !techStack[category as keyof TechStackInfo] || 
    (Array.isArray(techStack[category as keyof TechStackInfo]) && 
     (techStack[category as keyof TechStackInfo] as string[]).length === 0)
  );

  if (missingCategories.length > 0) {
    errors.push(`Missing required categories: ${missingCategories.join(', ')}`);
  }

  // Check for minimum technology count
  const totalTechnologies = Object.values(techStack)
    .filter(Array.isArray)
    .reduce((total, arr) => total + arr.length, 0);

  if (totalTechnologies === 0) {
    errors.push('No technologies specified');
  } else if (totalTechnologies < 3) {
    warnings.push('Very few technologies specified (less than 3)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Sanitize tech stack data
 */
export function sanitizeTechStackInfo(techStack: TechStackInfo): TechStackInfo {
  const sanitized = { ...techStack };

  // Sanitize string arrays
  const arrayFields = ['frontend', 'backend', 'database', 'deployment', 'aiTools', 'other'];
  arrayFields.forEach(field => {
    const value = sanitized[field as keyof TechStackInfo];
    if (Array.isArray(value)) {
      sanitized[field as keyof TechStackInfo] = value
        .filter(item => typeof item === 'string' && item.trim().length > 0)
        .map(item => item.trim())
        .filter((item, index, arr) => arr.indexOf(item) === index); // Remove duplicates
    }
  });

  // Sanitize source
  if (sanitized.source && typeof sanitized.source === 'string') {
    sanitized.source = sanitized.source.trim();
  }

  // Sanitize version
  if (sanitized.version && typeof sanitized.version === 'string') {
    sanitized.version = sanitized.version.trim();
  }

  return sanitized;
}

/**
 * Check if string is a valid ISO date
 */
function isValidISODate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date.toISOString() === dateString;
}

/**
 * Check if string is a valid semantic version
 */
function isValidSemanticVersion(version: string): boolean {
  const semverRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
  return semverRegex.test(version);
}

/**
 * Validate tech stack data from JSON
 */
export function validateTechStackFromJSON(data: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!data || typeof data !== 'object') {
    errors.push('Tech stack data must be an object');
    return { isValid: false, errors, warnings };
  }

  // Check for required fields
  const requiredFields = ['frontend', 'backend', 'database', 'deployment', 'source'];
  const missingFields = requiredFields.filter(field => !(field in data));
  
  if (missingFields.length > 0) {
    errors.push(`Missing required fields: ${missingFields.join(', ')}`);
  }

  // Validate each field
  Object.entries(data).forEach(([key, value]) => {
    if (['frontend', 'backend', 'database', 'deployment', 'aiTools', 'other'].includes(key)) {
      if (!Array.isArray(value)) {
        errors.push(`${key} must be an array`);
      }
    } else if (key === 'source') {
      if (typeof value !== 'string') {
        errors.push('source must be a string');
      }
    } else if (key === 'version') {
      if (typeof value !== 'string') {
        errors.push('version must be a string');
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}