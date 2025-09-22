import { AssetMetadata } from '@/models/AssetMetadata';

export interface ImageOptimizationConfig {
  quality: number;
  formats: string[];
  sizes: number[];
  placeholder: 'blur' | 'empty';
  priority: boolean;
}

export interface OptimizedImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  quality: number;
  placeholder?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

export class ImageOptimizationService {
  private config: ImageOptimizationConfig;

  constructor(config: ImageOptimizationConfig) {
    this.config = config;
  }

  /**
   * Generate optimized image props for Next.js Image component
   */
  generateImageProps(asset: AssetMetadata, alt: string, options: Partial<OptimizedImage> = {}): OptimizedImage {
    const {
      width = asset.dimensions.width,
      height = asset.dimensions.height,
      quality = this.config.quality,
      priority = this.config.priority,
      sizes = this.generateSizes(),
      className = ''
    } = options;

    return {
      src: asset.filePath,
      alt,
      width,
      height,
      quality,
      priority,
      sizes,
      className
    };
  }

  /**
   * Generate responsive sizes string
   */
  private generateSizes(): string {
    const breakpoints = [
      { size: 640, width: '100vw' },
      { size: 768, width: '50vw' },
      { size: 1024, width: '33vw' },
      { size: 1280, width: '25vw' }
    ];

    return breakpoints
      .map(bp => `(max-width: ${bp.size}px) ${bp.width}`)
      .join(', ') + ', 20vw';
  }

  /**
   * Generate multiple image sources for different formats
   */
  generateImageSources(asset: AssetMetadata): Array<{
    src: string;
    type: string;
    sizes: string;
  }> {
    return this.config.formats.map(format => ({
      src: this.convertImageFormat(asset.filePath, format),
      type: `image/${format}`,
      sizes: this.generateSizes()
    }));
  }

  /**
   * Convert image format
   */
  private convertImageFormat(filePath: string, format: string): string {
    const basePath = filePath.replace(/\.[^/.]+$/, '');
    return `${basePath}.${format}`;
  }

  /**
   * Generate blur placeholder
   */
  generateBlurPlaceholder(asset: AssetMetadata): string {
    if (this.config.placeholder === 'blur') {
      // In a real implementation, you would generate a base64 blur placeholder
      return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';
    }
    return '';
  }

  /**
   * Generate responsive image props
   */
  generateResponsiveImageProps(asset: AssetMetadata, alt: string): OptimizedImage {
    const baseProps = this.generateImageProps(asset, alt);
    
    return {
      ...baseProps,
      sizes: this.generateSizes(),
      className: 'responsive-image'
    };
  }

  /**
   * Generate thumbnail image props
   */
  generateThumbnailProps(asset: AssetMetadata, alt: string, maxSize: number = 200): OptimizedImage {
    const { width, height } = asset.dimensions;
    const aspectRatio = width / height;
    
    let thumbnailWidth = maxSize;
    let thumbnailHeight = maxSize;
    
    if (aspectRatio > 1) {
      thumbnailHeight = Math.round(maxSize / aspectRatio);
    } else {
      thumbnailWidth = Math.round(maxSize * aspectRatio);
    }

    return this.generateImageProps(asset, alt, {
      width: thumbnailWidth,
      height: thumbnailHeight,
      quality: 75,
      priority: false,
      className: 'thumbnail-image'
    });
  }

  /**
   * Generate hero image props
   */
  generateHeroImageProps(asset: AssetMetadata, alt: string): OptimizedImage {
    return this.generateImageProps(asset, alt, {
      priority: true,
      quality: 90,
      className: 'hero-image'
    });
  }

  /**
   * Check if image needs optimization
   */
  needsOptimization(asset: AssetMetadata): boolean {
    const { width, height, format } = asset;
    
    // Check if image is too large
    if (width > 2000 || height > 2000) {
      return true;
    }
    
    // Check if format needs conversion
    if (!this.config.formats.includes(format)) {
      return true;
    }
    
    return false;
  }

  /**
   * Get optimization recommendations
   */
  getOptimizationRecommendations(asset: AssetMetadata): string[] {
    const recommendations: string[] = [];
    
    if (asset.dimensions.width > 2000 || asset.dimensions.height > 2000) {
      recommendations.push('Consider resizing image to reduce file size');
    }
    
    if (!this.config.formats.includes(asset.format)) {
      recommendations.push(`Consider converting to ${this.config.formats.join(' or ')} for better performance`);
    }
    
    if (asset.fileSize > 500000) { // 500KB
      recommendations.push('Consider reducing quality to decrease file size');
    }
    
    return recommendations;
  }
}

/**
 * Create image optimization service with default config
 */
export function createImageOptimizationService(config: Partial<ImageOptimizationConfig> = {}): ImageOptimizationService {
  const defaultConfig: ImageOptimizationConfig = {
    quality: 85,
    formats: ['webp', 'avif', 'png', 'jpg'],
    sizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    placeholder: 'blur',
    priority: false
  };

  return new ImageOptimizationService({ ...defaultConfig, ...config });
}
