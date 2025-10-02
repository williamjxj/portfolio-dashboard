# Quick Start Guide v2

## Prerequisites
- Node.js 18+ 
- npm or yarn
- Git
- VS Code (recommended)

## Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd website-dashboard
```

### 2. Install Dependencies
```bash
cd frontend
npm install
```

### 3. Environment Setup
Create `.env.local` file:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=your-database-url
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-key
SENTRY_DSN=your-sentry-dsn
```

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js app router
│   ├── components/          # React components
│   ├── lib/                 # Utility functions
│   ├── models/              # TypeScript interfaces
│   ├── services/            # Business logic
│   └── hooks/               # Custom React hooks
├── public/                  # Static assets
├── data/                    # JSON data files
├── tests/                   # Test files
└── package.json
```

## Key Features

### 1. Enhanced Website Management
- View all websites in grid layout
- Add/edit/delete websites
- Advanced search and filtering
- Website detail pages
- Bulk operations
- Website templates

### 2. Advanced Technology Stack
- Visual tech stack display
- Technology categorization
- Stack comparison
- Technology filtering
- Technology recommendations
- Stack compatibility analysis

### 3. Advanced Asset Management
- Screenshot generation
- Logo and favicon creation
- Image optimization
- Asset metadata tracking
- Batch asset processing
- Asset versioning

### 4. Enhanced Deployment Integration
- Deployment status tracking
- Platform integration
- Health monitoring
- Deployment history
- Automated deployments
- Rollback functionality

### 5. Monitoring and Analytics
- Real-time monitoring
- Performance metrics
- Error tracking
- User analytics
- Health checks
- Alerting

## API Endpoints

### Websites
- `GET /api/websites` - Get all websites
- `GET /api/websites/[id]` - Get website by ID
- `POST /api/websites` - Create website
- `PUT /api/websites/[id]` - Update website
- `DELETE /api/websites/[id]` - Delete website
- `GET /api/websites/search` - Search websites
- `POST /api/websites/bulk` - Bulk operations

### Assets
- `GET /api/assets/[websiteId]` - Get website assets
- `GET /api/assets/[websiteId]/[assetId]` - Get specific asset
- `POST /api/assets/[websiteId]` - Create asset
- `PUT /api/assets/[websiteId]/[assetId]` - Update asset
- `DELETE /api/assets/[websiteId]/[assetId]` - Delete asset
- `POST /api/assets/batch` - Batch asset processing

### Tech Stack
- `GET /api/tech-stack` - Get tech stack data
- `GET /api/tech-stack/categories` - Get tech stack categories
- `GET /api/tech-stack/recommendations` - Get technology recommendations
- `GET /api/tech-stack/compatibility` - Check stack compatibility

### Monitoring
- `GET /api/monitoring/status` - Get monitoring status
- `GET /api/monitoring/metrics` - Get performance metrics
- `GET /api/monitoring/alerts` - Get active alerts
- `POST /api/monitoring/alerts` - Create alert

## Data Files

### Enhanced JSON Files
- `websites.json` - Array of website objects
- `assets.json` - Array of asset metadata
- `auth-credentials.json` - Authentication credentials
- `monitoring.json` - Monitoring configuration
- `tags.json` - Tag definitions

## Development

### Adding New Website
1. Add website data to `data/websites.json`
2. Generate assets (screenshots, logos, favicons)
3. Update tech stack information
4. Set up monitoring
5. Test website functionality

### Adding New Component
1. Create component in `src/components/`
2. Add TypeScript interfaces
3. Implement responsive design
4. Add tests
5. Add to storybook

### Adding New API Route
1. Create route file in `src/app/api/`
2. Implement CRUD operations
3. Add error handling
4. Add validation
5. Add monitoring
6. Update API documentation

### Adding New Hook
1. Create hook in `src/hooks/`
2. Add TypeScript interfaces
3. Implement functionality
4. Add tests
5. Add documentation

## Testing

### Running Tests
```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# All tests
npm run test:all
```

### Test Coverage
```bash
npm run test:coverage
```

## Deployment

### Vercel Deployment
1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Set up monitoring
4. Deploy automatically on push
5. Monitor deployment status

### Environment Variables
- `NEXT_PUBLIC_APP_URL` - Application URL
- `DATABASE_URL` - Database connection string
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `SENTRY_DSN` - Sentry error tracking
- `MONITORING_API_KEY` - Monitoring API key

## Monitoring

### Performance Monitoring
- Core Web Vitals tracking
- Real-time performance metrics
- Error tracking and alerting
- User experience monitoring

### Health Checks
- API endpoint health
- Database connectivity
- External service status
- System resource usage

## Troubleshooting

### Common Issues

#### Build Errors
- Check TypeScript errors
- Verify all imports are correct
- Ensure all dependencies are installed
- Check environment variables

#### Runtime Errors
- Check browser console for errors
- Verify API endpoints are working
- Check data file format
- Check monitoring logs

#### Performance Issues
- Optimize images
- Check bundle size
- Monitor Lighthouse scores
- Check database queries

### Getting Help
- Check documentation
- Review error logs
- Test in different browsers
- Verify environment setup
- Check monitoring dashboard

## Contributing

### Code Style
- Use TypeScript for all new code
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages
- Add tests for new features

### Testing
- Write unit tests for utilities
- Write integration tests for API routes
- Test responsive design
- Verify accessibility
- Test performance

### Pull Requests
- Create feature branches
- Write descriptive PR descriptions
- Include tests for new features
- Update documentation as needed
- Add monitoring if applicable
