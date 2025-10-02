# Technical Specification

## System Architecture

### Overview
The Website Dashboard is a Next.js application that provides a comprehensive interface for managing and showcasing multiple web projects with their technology stacks, assets, and deployment information.

### Architecture Diagram
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Data Layer    │
│   (Next.js)     │◄──►│   (API Routes)  │◄──►│   (JSON Files)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Components  │    │   Services      │    │   Asset Storage │
│   (React)        │    │   (Business)    │    │   (Public)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Component Architecture

### Frontend Components

#### Core Components
```typescript
// Layout Components
- RootLayout: Main application layout
- Navigation: Top navigation bar
- Layout: Page layout wrapper

// Website Components  
- WebsiteGrid: Grid display of websites
- WebsiteCard: Individual website card
- WebsiteDetail: Detailed website view
- TechStackTab: Technology stack display

// UI Components
- Button: Reusable button component
- Card: Content card wrapper
- Badge: Status/technology badges
- Input: Form input components
```

#### Component Hierarchy
```
RootLayout
├── Navigation
├── Layout
│   ├── WebsiteGrid
│   │   └── WebsiteCard
│   ├── WebsiteDetail
│   └── TechStackTab
└── UI Components
    ├── Button
    ├── Card
    ├── Badge
    └── Input
```

### Backend Architecture

#### API Routes Structure
```
/api/
├── websites/
│   ├── route.ts           # GET, POST /api/websites
│   └── [id]/
│       ├── route.ts       # GET, PUT, DELETE /api/websites/[id]
│       ├── screenshot/
│       │   └── route.ts    # GET /api/websites/[id]/screenshot
│       ├── logo/
│       │   └── route.ts    # GET /api/websites/[id]/logo
│       └── favicon/
│           └── route.ts   # GET /api/websites/[id]/favicon
├── assets/
│   └── [websiteId]/
│       ├── route.ts        # GET, POST /api/assets/[websiteId]
│       └── [assetId]/
│           └── route.ts    # GET, PUT, DELETE /api/assets/[websiteId]/[assetId]
└── tech-stack/
    ├── route.ts           # GET /api/tech-stack
    └── categories/
        └── route.ts       # GET /api/tech-stack/categories
```

#### Service Layer
```typescript
// Core Services
- WebsiteService: Website CRUD operations
- PlaywrightService: Screenshot generation
- AssetService: Asset management
- AuthenticationService: Auth handling

// Utility Services
- DataLoader: Data loading and caching
- Logger: Logging functionality
- Validation: Input validation
```

## Data Models

### Core Entities

#### Website Entity
```typescript
interface Website {
  id: string;
  name: string;
  url: string;
  description?: string;
  screenshot?: string;
  logo?: string;
  favicon?: string;
  requiresAuth: boolean;
  lastUpdated: string;
  state: 'draft' | 'in-progress' | 'completed' | 'archived';
  techStack: TechStackInfo;
  deploymentInfo: DeploymentInfo;
  features: string[];
  demoVideo?: string;
}
```

#### TechStackInfo Entity
```typescript
interface TechStackInfo {
  frontend: string[];
  backend: string[];
  database: string[];
  deployment: string[];
  aiTools: string[];
  other: string[];
  source: string;
}
```

#### DeploymentInfo Entity
```typescript
interface DeploymentInfo {
  platform: string;
  url: string;
  status: 'live' | 'staging' | 'development' | 'offline';
  lastDeployed: string;
  githubRepo?: string;
  supabaseProject?: string;
  supabaseUrl?: string;
}
```

### Data Storage

#### JSON File Structure
```
data/
├── websites.json          # Array of Website objects
├── assets.json           # Array of AssetMetadata objects
└── auth-credentials.json # Array of AuthenticationCredentials objects
```

#### Asset Storage
```
public/
├── assets/
│   ├── screenshots/       # Website screenshots
│   ├── logos/            # Website logos
│   └── favicons/         # Website favicons
└── sites/               # Project-specific images
    ├── project-1/
    ├── project-2/
    └── ...
```

## API Specifications

### RESTful API Design

#### Website Endpoints
```typescript
// Get all websites
GET /api/websites
Response: Website[]

// Get website by ID
GET /api/websites/[id]
Response: Website

// Create website
POST /api/websites
Body: Website
Response: Website

// Update website
PUT /api/websites/[id]
Body: Website
Response: Website

// Delete website
DELETE /api/websites/[id]
Response: 204 No Content
```

#### Asset Endpoints
```typescript
// Get website assets
GET /api/assets/[websiteId]
Response: AssetMetadata[]

// Get specific asset
GET /api/assets/[websiteId]/[assetId]
Response: AssetMetadata

// Create asset
POST /api/assets/[websiteId]
Body: AssetMetadata
Response: AssetMetadata

// Update asset
PUT /api/assets/[websiteId]/[assetId]
Body: AssetMetadata
Response: AssetMetadata

// Delete asset
DELETE /api/assets/[websiteId]/[assetId]
Response: 204 No Content
```

### Error Handling

#### HTTP Status Codes
- `200 OK`: Successful GET, PUT
- `201 Created`: Successful POST
- `204 No Content`: Successful DELETE
- `400 Bad Request`: Invalid request data
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

#### Error Response Format
```typescript
interface ErrorResponse {
  error: string;
  message?: string;
  details?: any;
}
```

## Security Specifications

### Authentication
- JWT token-based authentication
- OAuth integration (GitHub, Google)
- Session management
- Password hashing (bcrypt)

### Authorization
- Role-based access control
- Resource-level permissions
- API endpoint protection
- CSRF protection

### Data Security
- Input validation and sanitization
- XSS prevention
- SQL injection prevention
- Secure headers (CSP, HSTS)

## Performance Specifications

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Performance Targets
- **Page Load Time**: < 2s
- **Time to Interactive**: < 3s
- **Bundle Size**: < 500KB
- **Lighthouse Score**: > 90

### Optimization Strategies
- Code splitting and lazy loading
- Image optimization (WebP/AVIF)
- Static generation where possible
- CDN caching
- Bundle analysis and optimization

## Testing Specifications

### Testing Strategy
- **Unit Tests**: Component and utility functions
- **Integration Tests**: API routes and services
- **E2E Tests**: User workflows
- **Performance Tests**: Load and stress testing

### Testing Tools
- **Jest**: Unit testing framework
- **React Testing Library**: Component testing
- **Playwright**: E2E testing
- **Lighthouse**: Performance testing

### Test Coverage
- **Unit Tests**: > 80% coverage
- **Integration Tests**: All API endpoints
- **E2E Tests**: Critical user paths
- **Performance Tests**: Core web vitals

## Deployment Specifications

### Environment Configuration
```typescript
// Development
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

// Production
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
DATABASE_URL=your-database-url
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-key
```

### Deployment Pipeline
1. **Code Push**: GitHub repository
2. **Build Process**: Next.js build
3. **Testing**: Automated tests
4. **Deployment**: Vercel deployment
5. **Monitoring**: Performance monitoring

### Infrastructure Requirements
- **Hosting**: Vercel (recommended)
- **Database**: Supabase PostgreSQL
- **CDN**: Vercel Edge Network
- **Monitoring**: Vercel Analytics

## Monitoring and Observability

### Metrics Collection
- **Performance**: Core web vitals
- **Errors**: JavaScript errors
- **Usage**: User interactions
- **API**: Response times and errors

### Logging Strategy
- **Application Logs**: Structured logging
- **Error Logs**: Error tracking and alerting
- **Audit Logs**: User actions and changes
- **Performance Logs**: Performance metrics

### Alerting
- **Error Rate**: > 5% error rate
- **Response Time**: > 2s average
- **Availability**: < 99% uptime
- **Performance**: Lighthouse score < 90

## Scalability Considerations

### Horizontal Scaling
- Stateless application design
- Database connection pooling
- CDN for static assets
- Load balancing

### Vertical Scaling
- Memory optimization
- CPU optimization
- Database query optimization
- Caching strategies

### Future Scaling
- Microservices architecture
- Database sharding
- Event-driven architecture
- Real-time features
