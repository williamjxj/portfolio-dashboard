import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('request-logging');

export interface LoggingConfig {
  logRequests: boolean;
  logResponses: boolean;
  logErrors: boolean;
  logPerformance: boolean;
  excludeRoutes: string[];
  includeHeaders: string[];
}

export class LoggingMiddleware {
  private config: LoggingConfig;

  constructor(config: LoggingConfig) {
    this.config = config;
  }

  /**
   * Check if route should be excluded from logging
   */
  private shouldExcludeRoute(pathname: string): boolean {
    return this.config.excludeRoutes.some(route => pathname.startsWith(route));
  }

  /**
   * Extract relevant headers
   */
  private extractHeaders(request: NextRequest): Record<string, string> {
    const headers: Record<string, string> = {};
    
    for (const headerName of this.config.includeHeaders) {
      const value = request.headers.get(headerName);
      if (value) {
        headers[headerName] = value;
      }
    }
    
    return headers;
  }

  /**
   * Log request
   */
  private logRequest(request: NextRequest, startTime: number): void {
    if (!this.config.logRequests) return;

    const pathname = request.nextUrl.pathname;
    const method = request.method;
    const url = request.url;
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'Unknown';
    
    const headers = this.extractHeaders(request);
    
    logger.info('Request received', {
      method,
      pathname,
      url,
      userAgent,
      ip,
      headers,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Log response
   */
  private logResponse(
    request: NextRequest, 
    response: NextResponse, 
    startTime: number
  ): void {
    if (!this.config.logResponses) return;

    const pathname = request.nextUrl.pathname;
    const method = request.method;
    const statusCode = response.status;
    const duration = Date.now() - startTime;
    const contentLength = response.headers.get('content-length') || 'Unknown';
    
    logger.info('Response sent', {
      method,
      pathname,
      statusCode,
      duration: `${duration}ms`,
      contentLength,
      timestamp: new Date().toISOString()
    });

    // Log performance metrics if enabled
    if (this.config.logPerformance) {
      logger.logPerformance(`${method} ${pathname}`, duration, {
        statusCode,
        contentLength
      });
    }
  }

  /**
   * Log error
   */
  private logError(
    request: NextRequest, 
    error: Error, 
    startTime: number
  ): void {
    if (!this.config.logErrors) return;

    const pathname = request.nextUrl.pathname;
    const method = request.method;
    const duration = Date.now() - startTime;
    
    logger.error('Request error', {
      method,
      pathname,
      error: error.message,
      stack: error.stack,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Handle logging
   */
  async handle(
    request: NextRequest, 
    handler: (request: NextRequest) => Promise<NextResponse>
  ): Promise<NextResponse> {
    const startTime = Date.now();
    const pathname = request.nextUrl.pathname;

    // Skip logging for excluded routes
    if (this.shouldExcludeRoute(pathname)) {
      return handler(request);
    }

    try {
      // Log request
      this.logRequest(request, startTime);

      // Execute handler
      const response = await handler(request);

      // Log response
      this.logResponse(request, response, startTime);

      return response;
    } catch (error) {
      // Log error
      this.logError(request, error as Error, startTime);

      // Return error response
      return NextResponse.json(
        {
          message: 'Internal server error',
          code: 'INTERNAL_ERROR'
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
 * Create logging middleware with default config
 */
export function createLoggingMiddleware(config: Partial<LoggingConfig> = {}): LoggingMiddleware {
  const defaultConfig: LoggingConfig = {
    logRequests: true,
    logResponses: true,
    logErrors: true,
    logPerformance: true,
    excludeRoutes: ['/favicon.ico', '/_next/static'],
    includeHeaders: ['user-agent', 'x-forwarded-for', 'x-real-ip', 'authorization']
  };

  return new LoggingMiddleware({ ...defaultConfig, ...config });
}

/**
 * Middleware function for Next.js
 */
export function loggingMiddleware(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const middleware = createLoggingMiddleware();
  return middleware.handle(request, handler);
}
