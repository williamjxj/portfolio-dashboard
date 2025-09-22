export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  service?: string;
  requestId?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export class Logger {
  private service: string;
  private requestId?: string;
  private userId?: string;

  constructor(service: string, requestId?: string, userId?: string) {
    this.service = service;
    this.requestId = requestId;
    this.userId = userId;
  }

  /**
   * Log error message
   */
  error(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, metadata);
  }

  /**
   * Log warning message
   */
  warn(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, metadata);
  }

  /**
   * Log info message
   */
  info(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, metadata);
  }

  /**
   * Log debug message
   */
  debug(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, metadata);
  }

  /**
   * Log API request
   */
  logRequest(method: string, url: string, statusCode: number, duration: number): void {
    this.info('API Request', {
      method,
      url,
      statusCode,
      duration: `${duration}ms`
    });
  }

  /**
   * Log API error
   */
  logError(error: Error, context?: Record<string, any>): void {
    this.error('API Error', {
      message: error.message,
      stack: error.stack,
      ...context
    });
  }

  /**
   * Log authentication event
   */
  logAuth(websiteId: string, method: string, success: boolean, error?: string): void {
    if (success) {
      this.info('Authentication Success', {
        websiteId,
        method
      });
    } else {
      this.error('Authentication Failed', {
        websiteId,
        method,
        error
      });
    }
  }

  /**
   * Log asset generation event
   */
  logAssetGeneration(websiteId: string, assetType: string, success: boolean, error?: string): void {
    if (success) {
      this.info('Asset Generated', {
        websiteId,
        assetType
      });
    } else {
      this.error('Asset Generation Failed', {
        websiteId,
        assetType,
        error
      });
    }
  }

  /**
   * Log performance metrics
   */
  logPerformance(operation: string, duration: number, metadata?: Record<string, any>): void {
    this.info('Performance Metric', {
      operation,
      duration: `${duration}ms`,
      ...metadata
    });
  }

  /**
   * Core logging method
   */
  private log(level: LogLevel, message: string, metadata?: Record<string, any>): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      service: this.service,
      requestId: this.requestId,
      userId: this.userId,
      metadata
    };

    // In production, this would send to a logging service
    // For now, we'll just log to console
    const logMessage = `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.service}] ${entry.message}`;
    
    switch (level) {
      case LogLevel.ERROR:
        console.error(logMessage, metadata);
        break;
      case LogLevel.WARN:
        console.warn(logMessage, metadata);
        break;
      case LogLevel.INFO:
        console.info(logMessage, metadata);
        break;
      case LogLevel.DEBUG:
        console.debug(logMessage, metadata);
        break;
    }
  }

  /**
   * Create a child logger with additional context
   */
  child(additionalContext: Record<string, any>): Logger {
    const childLogger = new Logger(this.service, this.requestId, this.userId);
    // In a real implementation, you'd merge the additional context
    return childLogger;
  }
}

/**
 * Create a logger instance
 */
export function createLogger(service: string, requestId?: string, userId?: string): Logger {
  return new Logger(service, requestId, userId);
}

/**
 * Global logger instance
 */
export const logger = createLogger('website-dashboard');
