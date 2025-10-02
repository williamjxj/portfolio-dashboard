# Data Model Specification v2

## Overview
This document defines the enhanced data models for the website dashboard application with improved structure and additional features.

## Core Entities

### Website (Enhanced)
The main entity representing a website project with additional metadata.

```typescript
interface Website {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  url: string;                   // Website URL
  description?: string;          // Project description
  screenshot?: string;            // Screenshot URL
  logo?: string;                 // Logo URL
  favicon?: string;              // Favicon URL
  requiresAuth: boolean;         // Authentication required
  lastUpdated: string;           // ISO timestamp
  state: 'draft' | 'in-progress' | 'completed' | 'archived';
  techStack: TechStackInfo;      // Technology stack
  deploymentInfo: DeploymentInfo; // Deployment details
  features: string[];            // Key features
  demoVideo?: string;            // Demo video URL
  tags: string[];               // Categorization tags
  priority: number;              // Display priority
  isPublic: boolean;             // Public visibility
  createdAt: string;             // Creation timestamp
  updatedAt: string;             // Last update timestamp
}
```

### TechStackInfo (Enhanced)
Enhanced technology stack information with categorization.

```typescript
interface TechStackInfo {
  frontend: string[];            // Frontend technologies
  backend: string[];           // Backend technologies
  database: string[];          // Database technologies
  deployment: string[];        // Deployment platforms
  aiTools: string[];           // AI/ML tools
  other: string[];             // Other technologies
  source: string;               // Source timestamp
  version: string;              // Tech stack version
  lastUpdated: string;         // Last update timestamp
}
```

### DeploymentInfo (Enhanced)
Enhanced deployment and hosting information.

```typescript
interface DeploymentInfo {
  platform: string;             // Deployment platform
  url: string;                   // Live URL
  status: 'live' | 'staging' | 'development' | 'offline';
  lastDeployed: string;          // ISO timestamp
  githubRepo?: string;          // GitHub repository
  supabaseProject?: string;     // Supabase project
  supabaseUrl?: string;         // Supabase URL
  environment: string;          // Environment type
  region: string;              // Deployment region
  healthCheck: string;          // Health check URL
  monitoring: MonitoringInfo;    // Monitoring configuration
}
```

### MonitoringInfo (New)
Monitoring and observability information.

```typescript
interface MonitoringInfo {
  enabled: boolean;              // Monitoring enabled
  uptime: number;               // Uptime percentage
  responseTime: number;          // Average response time
  errorRate: number;             // Error rate percentage
  lastChecked: string;           // Last check timestamp
  alerts: Alert[];              // Active alerts
}
```

### Alert (New)
Alert information for monitoring.

```typescript
interface Alert {
  id: string;                   // Alert ID
  type: 'error' | 'warning' | 'info';
  message: string;               // Alert message
  timestamp: string;             // Alert timestamp
  resolved: boolean;             // Alert resolved
}
```

### AssetMetadata (Enhanced)
Enhanced metadata for website assets.

```typescript
interface AssetMetadata {
  id: string;                   // Unique asset ID
  websiteId: string;            // Associated website ID
  type: 'screenshot' | 'logo' | 'favicon' | 'video' | 'document';
  url: string;                  // Asset URL
  filename: string;             // Original filename
  size: number;                 // File size in bytes
  format: string;               // File format
  optimized: boolean;           // Whether optimized
  isFallback: boolean;          // Whether fallback asset
  lastAccessed: string;         // ISO timestamp
  metadata: Record<string, any>; // Additional metadata
  tags: string[];               // Asset tags
  version: string;              // Asset version
}
```

### AuthenticationCredentials (Enhanced)
Enhanced authentication information.

```typescript
interface AuthenticationCredentials {
  websiteId: string;            // Associated website ID
  type: 'email' | 'oauth' | 'sso' | 'none';
  username?: string;            // Username/email
  password?: string;            // Password (encrypted)
  oauthProvider?: string;       // OAuth provider
  ssoProvider?: string;         // SSO provider
  credentials: Record<string, any>; // Additional credentials
  lastUpdated: string;          // ISO timestamp
  isActive: boolean;            // Credentials active
  expiresAt?: string;           // Expiration timestamp
  permissions: string[];        // User permissions
}
```

## Data Storage

### Enhanced JSON Files
- `websites.json` - Array of Website objects
- `assets.json` - Array of AssetMetadata objects
- `auth-credentials.json` - Array of AuthenticationCredentials objects
- `monitoring.json` - Array of MonitoringInfo objects
- `tags.json` - Array of tag definitions

### File Structure
```
data/
├── websites.json
├── assets.json
├── auth-credentials.json
├── monitoring.json
└── tags.json
```

## Relationships

### Website ↔ Assets
- One-to-many relationship
- Website can have multiple assets
- Assets reference website via `websiteId`

### Website ↔ Authentication
- One-to-one relationship
- Each website can have authentication credentials
- Referenced via `websiteId`

### Website ↔ Monitoring
- One-to-one relationship
- Each website can have monitoring configuration
- Referenced via `websiteId`

### Website ↔ Tags
- Many-to-many relationship
- Websites can have multiple tags
- Tags can be shared across websites

## Data Flow

1. **Website Creation**: New website added to `websites.json`
2. **Asset Generation**: Assets created and metadata stored in `assets.json`
3. **Authentication Setup**: Credentials stored in `auth-credentials.json`
4. **Monitoring Setup**: Monitoring configuration stored in `monitoring.json`
5. **Tag Management**: Tags managed in `tags.json`
6. **Updates**: All entities updated via API endpoints

## Validation Rules

### Website
- `id` must be unique
- `name` and `url` are required
- `url` must be valid URI
- `state` must be one of defined values
- `priority` must be positive number
- `tags` must be valid tag references

### TechStack
- Arrays should contain valid technology names
- `source` should be ISO timestamp
- `version` should follow semantic versioning

### Assets
- `websiteId` must reference existing website
- `type` must be one of defined values
- `url` must be valid URI
- `size` must be positive number

### Authentication
- `websiteId` must reference existing website
- `type` must be one of defined values
- Credentials should be encrypted for sensitive data
- `expiresAt` should be future timestamp if provided

### Monitoring
- `uptime` should be between 0 and 100
- `responseTime` should be positive number
- `errorRate` should be between 0 and 100
- Alerts should have valid timestamps
