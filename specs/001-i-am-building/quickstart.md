# Quick Start Guide

## Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

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
│   └── services/            # Business logic
├── public/                  # Static assets
├── data/                    # JSON data files
└── package.json
```

## Key Features

### 1. Website Management
- View all websites in grid layout
- Add/edit/delete websites
- Search and filter functionality
- Website detail pages

### 2. Technology Stack
- Visual tech stack display
- Technology categorization
- Stack comparison
- Technology filtering

### 3. Asset Management
- Screenshot generation
- Logo and favicon creation
- Image optimization
- Asset metadata tracking

### 4. Deployment Integration
- Deployment status tracking
- Platform integration
- Health monitoring
- Deployment history

## API Endpoints

### Websites
- `GET /api/websites` - Get all websites
- `GET /api/websites/[id]` - Get website by ID
- `POST /api/websites` - Create website
- `PUT /api/websites/[id]` - Update website
- `DELETE /api/websites/[id]` - Delete website

### Assets
- `GET /api/assets/[websiteId]` - Get website assets
- `GET /api/assets/[websiteId]/[assetId]` - Get specific asset
- `POST /api/assets/[websiteId]` - Create asset
- `PUT /api/assets/[websiteId]/[assetId]` - Update asset
- `DELETE /api/assets/[websiteId]/[assetId]` - Delete asset

### Tech Stack
- `GET /api/tech-stack` - Get tech stack data
- `GET /api/tech-stack/categories` - Get tech stack categories

## Data Files

### websites.json
Contains array of website objects with all project information.

### assets.json
Contains array of asset metadata for screenshots, logos, and favicons.

### auth-credentials.json
Contains authentication credentials for websites that require login.

## Development

### Adding New Website
1. Add website data to `data/websites.json`
2. Generate assets (screenshots, logos, favicons)
3. Update tech stack information
4. Test website functionality

### Adding New Component
1. Create component in `src/components/`
2. Add TypeScript interfaces
3. Implement responsive design
4. Add to storybook (if applicable)

### Adding New API Route
1. Create route file in `src/app/api/`
2. Implement CRUD operations
3. Add error handling
4. Add validation
5. Update API documentation

## Deployment

### Vercel Deployment
1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push
4. Monitor deployment status

### Environment Variables
- `NEXT_PUBLIC_APP_URL` - Application URL
- `DATABASE_URL` - Database connection string
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key

## Troubleshooting

### Common Issues

#### Build Errors
- Check TypeScript errors
- Verify all imports are correct
- Ensure all dependencies are installed

#### Runtime Errors
- Check browser console for errors
- Verify API endpoints are working
- Check data file format

#### Performance Issues
- Optimize images
- Check bundle size
- Monitor Lighthouse scores

### Getting Help
- Check documentation
- Review error logs
- Test in different browsers
- Verify environment setup

## Contributing

### Code Style
- Use TypeScript for all new code
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages

### Testing
- Write unit tests for utilities
- Write integration tests for API routes
- Test responsive design
- Verify accessibility

### Pull Requests
- Create feature branches
- Write descriptive PR descriptions
- Include tests for new features
- Update documentation as needed
