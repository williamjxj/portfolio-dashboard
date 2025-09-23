export interface AssetMetadata {
  websiteId: string;
  assetType: 'screenshot' | 'logo' | 'favicon';
  filePath: string;
  fileSize: number;
  dimensions: {
    width: number;
    height: number;
  };
  format: 'png' | 'jpg' | 'webp' | 'svg' | 'ico';
  generatedAt: string;
  optimized: boolean;
}

export type AssetState = 'generating' | 'completed' | 'failed' | 'optimized';

export class AssetMetadataModel {
  private assets: AssetMetadata[] = [];

  constructor(assets: AssetMetadata[] = []) {
    this.assets = assets;
  }

  /**
   * Load assets from data
   */
  async loadFromData(assets: AssetMetadata[]): Promise<void> {
    this.assets = assets;
  }

  /**
   * Get all assets for a website
   */
  getByWebsiteId(websiteId: string): AssetMetadata[] {
    return this.assets.filter(asset => asset.websiteId === websiteId);
  }

  /**
   * Get specific asset for a website
   */
  getByWebsiteIdAndType(websiteId: string, assetType: 'screenshot' | 'logo' | 'favicon'): AssetMetadata | undefined {
    return this.assets.find(asset => asset.websiteId === websiteId && asset.assetType === assetType);
  }

  /**
   * Add a new asset
   */
  add(asset: AssetMetadata): void {
    // Remove existing asset of same type for same website
    this.assets = this.assets.filter(
      existing => !(existing.websiteId === asset.websiteId && existing.assetType === asset.assetType)
    );
    this.assets.push(asset);
  }

  /**
   * Update an existing asset
   */
  update(websiteId: string, assetType: 'screenshot' | 'logo' | 'favicon', updates: Partial<AssetMetadata>): boolean {
    const index = this.assets.findIndex(
      asset => asset.websiteId === websiteId && asset.assetType === assetType
    );
    if (index === -1) return false;
    
    this.assets[index] = { ...this.assets[index], ...updates };
    return true;
  }

  /**
   * Delete an asset
   */
  delete(websiteId: string, assetType: 'screenshot' | 'logo' | 'favicon'): boolean {
    const index = this.assets.findIndex(
      asset => asset.websiteId === websiteId && asset.assetType === assetType
    );
    if (index === -1) return false;
    
    this.assets.splice(index, 1);
    return true;
  }

  /**
   * Delete all assets for a website
   */
  deleteByWebsiteId(websiteId: string): boolean {
    const initialLength = this.assets.length;
    this.assets = this.assets.filter(asset => asset.websiteId !== websiteId);
    return this.assets.length < initialLength;
  }

  /**
   * Validate asset metadata
   */
  validate(asset: AssetMetadata): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!asset.websiteId || typeof asset.websiteId !== 'string') {
      errors.push('websiteId is required and must be a string');
    }

    if (!asset.assetType || !['screenshot', 'logo', 'favicon'].includes(asset.assetType)) {
      errors.push('assetType must be one of: screenshot, logo, favicon');
    }

    if (!asset.filePath || typeof asset.filePath !== 'string') {
      errors.push('filePath is required and must be a string');
    }

    if (typeof asset.fileSize !== 'number' || asset.fileSize < 0) {
      errors.push('fileSize must be a non-negative number');
    }

    if (!asset.dimensions || typeof asset.dimensions !== 'object') {
      errors.push('dimensions is required and must be an object');
    } else {
      if (typeof asset.dimensions.width !== 'number' || asset.dimensions.width <= 0) {
        errors.push('dimensions.width must be a positive number');
      }
      if (typeof asset.dimensions.height !== 'number' || asset.dimensions.height <= 0) {
        errors.push('dimensions.height must be a positive number');
      }
    }

    if (!asset.format || !['png', 'jpg', 'webp', 'svg', 'ico'].includes(asset.format)) {
      errors.push('format must be one of: png, jpg, webp, svg, ico');
    }

    if (!asset.generatedAt || typeof asset.generatedAt !== 'string') {
      errors.push('generatedAt is required and must be a string');
    } else if (!this.isValidDate(asset.generatedAt)) {
      errors.push('generatedAt must be a valid ISO date string');
    }

    if (typeof asset.optimized !== 'boolean') {
      errors.push('optimized must be a boolean');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate date format
   */
  private isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && date.toISOString() === dateString;
  }

  /**
   * Get all assets
   */
  getAll(): AssetMetadata[] {
    return this.assets;
  }

  /**
   * Get assets by type
   */
  getByType(assetType: 'screenshot' | 'logo' | 'favicon'): AssetMetadata[] {
    return this.assets.filter(asset => asset.assetType === assetType);
  }

  /**
   * Check if asset exists
   */
  exists(websiteId: string, assetType: 'screenshot' | 'logo' | 'favicon'): boolean {
    return this.assets.some(asset => asset.websiteId === websiteId && asset.assetType === assetType);
  }

  /**
   * Get total file size for a website
   */
  getTotalFileSize(websiteId: string): number {
    return this.assets
      .filter(asset => asset.websiteId === websiteId)
      .reduce((total, asset) => total + asset.fileSize, 0);
  }
}
