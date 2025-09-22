import { NextRequest, NextResponse } from 'next/server';

export interface CorsConfig {
  allowedOrigins: string[];
  allowedMethods: string[];
  allowedHeaders: string[];
  exposedHeaders: string[];
  maxAge: number;
  credentials: boolean;
}

export class CorsMiddleware {
  private config: CorsConfig;

  constructor(config: CorsConfig) {
    this.config = config;
  }

  /**
   * Check if origin is allowed
   */
  private isOriginAllowed(origin: string): boolean {
    if (this.config.allowedOrigins.includes('*')) {
      return true;
    }
    return this.config.allowedOrigins.includes(origin);
  }

  /**
   * Handle preflight request
   */
  private handlePreflight(request: NextRequest): NextResponse {
    const origin = request.headers.get('origin');
    
    if (!origin || !this.isOriginAllowed(origin)) {
      return new NextResponse(null, { status: 403 });
    }

    const response = new NextResponse(null, { status: 200 });
    
    // Set CORS headers
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', this.config.allowedMethods.join(', '));
    response.headers.set('Access-Control-Allow-Headers', this.config.allowedHeaders.join(', '));
    response.headers.set('Access-Control-Expose-Headers', this.config.exposedHeaders.join(', '));
    response.headers.set('Access-Control-Max-Age', this.config.maxAge.toString());
    
    if (this.config.credentials) {
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }

    return response;
  }

  /**
   * Add CORS headers to response
   */
  private addCorsHeaders(request: NextRequest, response: NextResponse): NextResponse {
    const origin = request.headers.get('origin');
    
    if (origin && this.isOriginAllowed(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', this.config.credentials.toString());
      response.headers.set('Access-Control-Expose-Headers', this.config.exposedHeaders.join(', '));
    }

    return response;
  }

  /**
   * Handle CORS
   */
  handle(request: NextRequest, handler: (request: NextRequest) => Promise<NextResponse>): Promise<NextResponse> {
    // Handle preflight request
    if (request.method === 'OPTIONS') {
      return Promise.resolve(this.handlePreflight(request));
    }

    // Handle actual request
    return handler(request).then(response => {
      return this.addCorsHeaders(request, response);
    });
  }
}

/**
 * Create CORS middleware with default config
 */
export function createCorsMiddleware(config: Partial<CorsConfig> = {}): CorsMiddleware {
  const defaultConfig: CorsConfig = {
    allowedOrigins: ['http://localhost:3000', 'https://localhost:3000'],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
    exposedHeaders: ['Content-Length', 'X-Total-Count'],
    maxAge: 86400, // 24 hours
    credentials: true
  };

  return new CorsMiddleware({ ...defaultConfig, ...config });
}

/**
 * Middleware function for Next.js
 */
export function corsMiddleware(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const middleware = createCorsMiddleware();
  return middleware.handle(request, handler);
}
