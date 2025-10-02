# Data Model Specification

## Overview
This document defines the data models for the website dashboard application.

## Core Entities

### Website
The main entity representing a website project.

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
}
```

### TechStackInfo
Technology stack information for a website.

```typescript
interface TechStackInfo {
  frontend: string[];            // Frontend technologies
  backend: string[];           // Backend technologies
  database: string[];          // Database technologies
  deployment: string[];        // Deployment platforms
  aiTools: string[];           // AI/ML tools
  other: string[];             // Other technologies
  source: string;               // Source timestamp
}
```

### DeploymentInfo
Deployment and hosting information.

```typescript
interface DeploymentInfo {
  platform: string;             // Deployment platform
  url: string;                   // Live URL
  status: 'live' | 'staging' | 'development' | 'offline';
  lastDeployed: string;          // ISO timestamp
  githubRepo?: string;          // GitHub repository
  supabaseProject?: string;     // Supabase project
  supabaseUrl?: string;         // Supabase URL
}
```

### AssetMetadata
Metadata for website assets (screenshots, logos, favicons).

```typescript
interface AssetMetadata {
  id: string;                   // Unique asset ID
  websiteId: string;            // Associated website ID
  type: 'screenshot' | 'logo' | 'favicon' | 'video';
  url: string;                  // Asset URL
  filename: string;             // Original filename
  size: number;                 // File size in bytes
  format: string;               // File format
  optimized: boolean;           // Whether optimized
  isFallback: boolean;          // Whether fallback asset
  lastAccessed: string;         // ISO timestamp
}
```

### AuthenticationCredentials
Authentication information for websites.

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
}
```

## Data Storage

### JSON Files
- `websites.json` - Array of Website objects
- `assets.json` - Array of AssetMetadata objects
- `auth-credentials.json` - Array of AuthenticationCredentials objects

### File Structure
```
data/
├── websites.json
├── assets.json
└── auth-credentials.json
```

## Relationships

### Website ↔ Assets
- One-to-many relationship
- Website can have multiple assets (screenshot, logo, favicon, video)
- Assets reference website via `websiteId`

### Website ↔ Authentication
- One-to-one relationship
- Each website can have authentication credentials
- Referenced via `websiteId`

## Data Flow

1. **Website Creation**: New website added to `websites.json`
2. **Asset Generation**: Assets created and metadata stored in `assets.json`
3. **Authentication Setup**: Credentials stored in `auth-credentials.json`
4. **Updates**: All entities updated via API endpoints

## Validation Rules

### Website
- `id` must be unique
- `name` and `url` are required
- `url` must be valid URI
- `state` must be one of defined values

### TechStack
- Arrays should contain valid technology names
- `source` should be ISO timestamp

### Assets
- `websiteId` must reference existing website
- `type` must be one of defined values
- `url` must be valid URI

### Authentication
- `websiteId` must reference existing website
- `type` must be one of defined values
- Credentials should be encrypted for sensitive data
