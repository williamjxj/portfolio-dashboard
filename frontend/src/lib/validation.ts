import { Website } from '@/models/Website';
import { AuthenticationCredentials } from '@/models/AuthenticationCredentials';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate website data
 */
export function validateWebsite(website: Partial<Website>): ValidationResult {
  const errors: string[] = [];

  if (!website.id || typeof website.id !== 'string') {
    errors.push('ID is required and must be a string');
  }

  if (!website.name || typeof website.name !== 'string') {
    errors.push('Name is required and must be a string');
  }

  if (!website.url || typeof website.url !== 'string') {
    errors.push('URL is required and must be a string');
  } else if (!isValidUrl(website.url)) {
    errors.push('URL must be a valid HTTP/HTTPS URL');
  }

  if (!website.description || typeof website.description !== 'string') {
    errors.push('Description is required and must be a string');
  } else if (website.description.length < 50 || website.description.length > 200) {
    errors.push('Description must be between 50 and 200 characters');
  }

  if (typeof website.requiresAuth !== 'boolean') {
    errors.push('requiresAuth must be a boolean');
  }

  if (!website.lastUpdated || typeof website.lastUpdated !== 'string') {
    errors.push('lastUpdated is required and must be a string');
  } else if (!isValidDate(website.lastUpdated)) {
    errors.push('lastUpdated must be a valid ISO date string');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate authentication credentials
 */
export function validateAuthCredentials(credentials: Partial<AuthenticationCredentials>): ValidationResult {
  const errors: string[] = [];

  if (!credentials.websiteId || typeof credentials.websiteId !== 'string') {
    errors.push('websiteId is required and must be a string');
  }

  if (!credentials.method || !['email', 'oauth', 'sso'].includes(credentials.method)) {
    errors.push('method must be one of: email, oauth, sso');
  }

  if (credentials.method === 'email') {
    if (!credentials.username || typeof credentials.username !== 'string') {
      errors.push('username is required for email authentication');
    }
    if (!credentials.password || typeof credentials.password !== 'string') {
      errors.push('password is required for email authentication');
    }
  }

  if (credentials.method === 'oauth') {
    if (!credentials.oauthProvider || typeof credentials.oauthProvider !== 'string') {
      errors.push('oauthProvider is required for OAuth authentication');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validate date format
 */
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date.toISOString() === dateString;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): boolean {
  // At least 8 characters, contains letter and number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
}

/**
 * Sanitize input string
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

/**
 * Validate and sanitize website ID
 */
export function validateWebsiteId(id: string): ValidationResult {
  const errors: string[] = [];

  if (!id || typeof id !== 'string') {
    errors.push('Website ID is required and must be a string');
  } else if (id.length < 3 || id.length > 50) {
    errors.push('Website ID must be between 3 and 50 characters');
  } else if (!/^[a-zA-Z0-9-_]+$/.test(id)) {
    errors.push('Website ID can only contain letters, numbers, hyphens, and underscores');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate pagination parameters
 */
export function validatePagination(page?: string, limit?: string): ValidationResult {
  const errors: string[] = [];

  if (page !== undefined) {
    const pageNum = parseInt(page, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      errors.push('Page must be a positive integer');
    }
  }

  if (limit !== undefined) {
    const limitNum = parseInt(limit, 10);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      errors.push('Limit must be a positive integer between 1 and 100');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
