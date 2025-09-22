import { NextRequest, NextResponse } from 'next/server';

export interface SecurityConfig {
  contentSecurityPolicy: string;
  xFrameOptions: string;
  xContentTypeOptions: string;
  xXssProtection: string;
  referrerPolicy: string;
  permissionsPolicy: string;
  strictTransportSecurity: string;
}

export class SecurityMiddleware {
  private config: SecurityConfig;

  constructor(config: SecurityConfig) {
    this.config = config;
  }

  /**
   * Add security headers to response
   */
  private addSecurityHeaders(response: NextResponse): NextResponse {
    // Content Security Policy
    response.headers.set('Content-Security-Policy', this.config.contentSecurityPolicy);
    
    // X-Frame-Options
    response.headers.set('X-Frame-Options', this.config.xFrameOptions);
    
    // X-Content-Type-Options
    response.headers.set('X-Content-Type-Options', this.config.xContentTypeOptions);
    
    // X-XSS-Protection
    response.headers.set('X-XSS-Protection', this.config.xXssProtection);
    
    // Referrer Policy
    response.headers.set('Referrer-Policy', this.config.referrerPolicy);
    
    // Permissions Policy
    response.headers.set('Permissions-Policy', this.config.permissionsPolicy);
    
    // Strict Transport Security
    response.headers.set('Strict-Transport-Security', this.config.strictTransportSecurity);

    return response;
  }

  /**
   * Handle security
   */
  handle(request: NextRequest, handler: (request: NextRequest) => Promise<NextResponse>): Promise<NextResponse> {
    return handler(request).then(response => {
      return this.addSecurityHeaders(response);
    });
  }
}

/**
 * Create security middleware with default config
 */
export function createSecurityMiddleware(config: Partial<SecurityConfig> = {}): SecurityMiddleware {
  const defaultConfig: SecurityConfig = {
    contentSecurityPolicy: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; '),
    xFrameOptions: 'DENY',
    xContentTypeOptions: 'nosniff',
    xXssProtection: '1; mode=block',
    referrerPolicy: 'strict-origin-when-cross-origin',
    permissionsPolicy: [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=()',
      'usb=()',
      'magnetometer=()',
      'gyroscope=()',
      'accelerometer=()'
    ].join(', '),
    strictTransportSecurity: 'max-age=31536000; includeSubDomains; preload'
  };

  return new SecurityMiddleware({ ...defaultConfig, ...config });
}

/**
 * Middleware function for Next.js
 */
export function securityMiddleware(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const middleware = createSecurityMiddleware();
  return middleware.handle(request, handler);
}
