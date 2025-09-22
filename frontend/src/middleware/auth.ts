import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('auth-middleware');

export interface AuthConfig {
  protectedRoutes: string[];
  publicRoutes: string[];
  apiKey?: string;
  jwtSecret?: string;
}

export class AuthMiddleware {
  private config: AuthConfig;

  constructor(config: AuthConfig) {
    this.config = config;
  }

  /**
   * Check if route requires authentication
   */
  private isProtectedRoute(pathname: string): boolean {
    return this.config.protectedRoutes.some(route => pathname.startsWith(route));
  }

  /**
   * Check if route is public
   */
  private isPublicRoute(pathname: string): boolean {
    return this.config.publicRoutes.some(route => pathname.startsWith(route));
  }

  /**
   * Extract API key from request
   */
  private extractApiKey(request: NextRequest): string | null {
    // Check Authorization header
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Check X-API-Key header
    const apiKey = request.headers.get('x-api-key');
    if (apiKey) {
      return apiKey;
    }

    // Check query parameter
    const url = new URL(request.url);
    const queryApiKey = url.searchParams.get('api_key');
    if (queryApiKey) {
      return queryApiKey;
    }

    return null;
  }

  /**
   * Validate API key
   */
  private validateApiKey(apiKey: string): boolean {
    if (!this.config.apiKey) {
      return true; // No API key configured, allow all
    }
    return apiKey === this.config.apiKey;
  }

  /**
   * Extract JWT token from request
   */
  private extractJwtToken(request: NextRequest): string | null {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return null;
  }

  /**
   * Validate JWT token
   */
  private validateJwtToken(token: string): boolean {
    if (!this.config.jwtSecret) {
      return true; // No JWT secret configured, allow all
    }
    
    try {
      // In a real implementation, you would verify the JWT token
      // For now, we'll just check if it's a valid format
      const parts = token.split('.');
      return parts.length === 3;
    } catch {
      return false;
    }
  }

  /**
   * Handle authentication
   */
  async handle(request: NextRequest): Promise<NextResponse | null> {
    const pathname = request.nextUrl.pathname;
    
    // Skip authentication for public routes
    if (this.isPublicRoute(pathname)) {
      return null;
    }

    // Check if route is protected
    if (!this.isProtectedRoute(pathname)) {
      return null;
    }

    try {
      // Try API key authentication first
      const apiKey = this.extractApiKey(request);
      if (apiKey && this.validateApiKey(apiKey)) {
        logger.info('API key authentication successful', { pathname });
        return null;
      }

      // Try JWT authentication
      const jwtToken = this.extractJwtToken(request);
      if (jwtToken && this.validateJwtToken(jwtToken)) {
        logger.info('JWT authentication successful', { pathname });
        return null;
      }

      // Authentication failed
      logger.warn('Authentication failed', { pathname, hasApiKey: !!apiKey, hasJwt: !!jwtToken });
      
      return NextResponse.json(
        {
          message: 'Authentication required',
          code: 'AUTH_REQUIRED'
        },
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'WWW-Authenticate': 'Bearer'
          }
        }
      );
    } catch (error) {
      logger.error('Authentication error', { pathname, error: error instanceof Error ? error.message : 'Unknown error' });
      
      return NextResponse.json(
        {
          message: 'Authentication error',
          code: 'AUTH_ERROR'
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
}

/**
 * Create auth middleware with default config
 */
export function createAuthMiddleware(config: Partial<AuthConfig> = {}): AuthMiddleware {
  const defaultConfig: AuthConfig = {
    protectedRoutes: ['/api/websites'],
    publicRoutes: ['/api/websites'],
    ...config
  };

  return new AuthMiddleware(defaultConfig);
}

/**
 * Middleware function for Next.js
 */
export function authMiddleware(request: NextRequest): Promise<NextResponse | null> {
  const middleware = createAuthMiddleware();
  return middleware.handle(request);
}
