# Data Model: Website Iteration Dashboard

## Core Entities

### Website
**Purpose**: Represents each of the 8 websites to be displayed in the dashboard
**Attributes**:
- `id`: Unique identifier (string)
- `name`: Display name (string)
- `url`: Website URL (string)
- `description`: 2-3 sentence summary (string)
- `screenshot`: Path to screenshot image (string)
- `logo`: Path to logo image (string)
- `favicon`: Path to favicon image (string)
- `requiresAuth`: Boolean flag for authentication requirement
- `authCredentials`: Optional login credentials (object)
- `lastUpdated`: Timestamp of last update (Date)

**Validation Rules**:
- URL must be valid and accessible
- Description must be 2-3 sentences (50-200 characters)
- Screenshot, logo, and favicon paths must exist
- Auth credentials required if requiresAuth is true

**State Transitions**:
- `pending` → `processing` → `completed` (screenshot generation)
- `pending` → `failed` → `retry` (on authentication failure)

### AuthenticationCredentials
**Purpose**: Stores login information for websites requiring authentication
**Attributes**:
- `websiteId`: Reference to Website entity (string)
- `method`: Authentication method (enum: 'email', 'oauth', 'sso')
- `username`: Username or email (string, optional)
- `password`: Password (string, optional)
- `oauthProvider`: OAuth provider name (string, optional)
- `additionalFields`: Custom fields for complex auth (object, optional)

**Validation Rules**:
- Method must be one of the supported types
- Username required for email authentication
- OAuth provider required for OAuth authentication
- Password required for email authentication

### AssetMetadata
**Purpose**: Contains information about generated assets (screenshots, logos, favicons)
**Attributes**:
- `websiteId`: Reference to Website entity (string)
- `assetType`: Type of asset (enum: 'screenshot', 'logo', 'favicon')
- `filePath`: Local file path (string)
- `fileSize`: File size in bytes (number)
- `dimensions`: Image dimensions (object: {width, height})
- `format`: Image format (string: 'png', 'jpg', 'webp', 'svg')
- `generatedAt`: Timestamp of generation (Date)
- `optimized`: Whether asset is optimized (boolean)

**Validation Rules**:
- File path must exist and be accessible
- Dimensions required for image assets
- Format must be supported
- Generated timestamp must be valid

## Relationships

### Website ↔ AuthenticationCredentials
- **Type**: One-to-One (optional)
- **Constraint**: Website may have zero or one authentication credentials
- **Business Rule**: Only websites with requiresAuth=true can have credentials

### Website ↔ AssetMetadata
- **Type**: One-to-Many
- **Constraint**: Each website can have multiple assets (screenshot, logo, favicon)
- **Business Rule**: Each website must have exactly one of each asset type

## Data Flow

### 1. Website Discovery
```
Input: README.md URLs
Process: Parse and validate URLs
Output: Website entities (pending state)
```

### 2. Authentication Handling
```
Input: Website with requiresAuth=true
Process: Attempt login with provided credentials
Output: AuthenticationCredentials (success/failure)
```

### 3. Asset Generation
```
Input: Website entity
Process: Generate screenshot, logo, favicon
Output: AssetMetadata entities
```

### 4. Dashboard Display
```
Input: Website + AssetMetadata
Process: Render dashboard components
Output: Static HTML/CSS/JS
```

## State Management

### Website States
- `pending`: Initial state, waiting for processing
- `processing`: Currently generating assets
- `completed`: All assets generated successfully
- `failed`: Asset generation failed
- `retry`: Ready for retry after failure

### Asset States
- `generating`: Asset is being created
- `completed`: Asset generated successfully
- `failed`: Asset generation failed
- `optimized`: Asset has been optimized for web

## Validation Rules

### URL Validation
- Must be valid HTTP/HTTPS URL
- Must be accessible (not return 404/500)
- Must not be a login/signup page (unless authenticated)

### Asset Validation
- Screenshots: Must be high-resolution (min 1200px width)
- Logos: Must be vector format (SVG) or high-res raster
- Favicons: Must be 16x16 or 32x32 pixels
- All assets: Must be optimized for web delivery

### Authentication Validation
- Credentials must be provided for auth-required websites
- Authentication must succeed before screenshot capture
- Failed auth must trigger user intervention workflow
