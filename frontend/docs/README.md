# Website Dashboard

A modern, responsive dashboard for managing and viewing websites with automated asset generation, authentication support, and performance optimization.

## Features

- **Website Management**: View and manage a collection of websites with detailed information
- **Asset Generation**: Automated screenshot, logo, and favicon generation using Playwright
- **Authentication Support**: Handle websites requiring login with multiple authentication methods
- **Performance Optimized**: Mobile-first responsive design with WCAG 2.1 AA compliance
- **Static Site Generation**: Next.js 14 with static export for optimal performance
- **Comprehensive Testing**: Jest, Playwright, and Lighthouse CI integration

## Technology Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Testing**: Jest, Playwright, Lighthouse CI
- **Asset Generation**: Playwright automation
- **Authentication**: Multiple methods (email, OAuth, SSO, manual)
- **Performance**: Image optimization, WebP/AVIF conversion
- **Security**: CORS, authentication middleware, security headers

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd website-dashboard
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Generate assets**
   ```bash
   npm run generate-assets
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run test:e2e` - Run Playwright tests
- `npm run test:lighthouse` - Run Lighthouse CI
- `npm run generate-assets` - Generate screenshots, logos, and favicons
- `npm run export` - Export static site

### Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/            # API routes
│   │   ├── page.tsx        # Home page
│   │   └── website/[id]/   # Website detail pages
│   ├── components/         # React components
│   ├── lib/               # Utility libraries
│   ├── middleware/        # Next.js middleware
│   ├── models/           # TypeScript interfaces
│   └── services/         # Business logic
├── scripts/              # Asset generation scripts
├── tests/               # Test files
│   ├── unit/           # Unit tests
│   ├── integration/    # Integration tests
│   └── performance/    # Performance tests
├── public/             # Static assets
└── docs/              # Documentation
```

## Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Website URLs (comma-separated)
WEBSITE_URLS=https://example1.com,https://example2.com

# Authentication credentials (JSON format)
AUTH_CREDENTIALS={}

# Asset generation settings
SCREENSHOT_WIDTH=1200
SCREENSHOT_HEIGHT=800
LOGO_SIZE=100
FAVICON_SIZE=32

# Performance settings
LIGHTHOUSE_THRESHOLD=90
```

### Website Configuration

Websites are configured in `README.md` with the following format:

```markdown
## Websites

- **Website Name**: https://website-url.com
  Description of the website. Target audience: specific users. Features: key functionality.
```

## Asset Generation

### Screenshots

Automated screenshot generation using Playwright:

```bash
npm run generate-assets
```

Features:
- High-resolution screenshots (1200x800)
- Authentication support
- Full-page capture
- Error handling and retry logic

### Logos

Automated logo generation:

- Multiple formats (SVG, PNG, WebP)
- Vector-based design
- Fallback generation
- Optimization

### Favicons

Multi-size favicon generation:

- Sizes: 16x16, 32x32, 48x48, 64x64
- Formats: ICO, PNG, WebP
- Optimization

## Authentication

### Supported Methods

1. **Email/Password**: Standard login forms
2. **OAuth**: Google, GitHub, etc.
3. **SSO**: Enterprise single sign-on
4. **Manual**: User-guided authentication

### Configuration

Set up authentication credentials:

```bash
npm run auth-manager
```

## Testing

### Unit Tests

```bash
npm run test
```

### Integration Tests

```bash
npm run test:e2e
```

### Performance Tests

```bash
npm run test:lighthouse
```

### Test Coverage

```bash
npm run test:coverage
```

## Performance

### Lighthouse Scores

- **Performance**: ≥90
- **Accessibility**: ≥90
- **Best Practices**: ≥90
- **SEO**: ≥90

### Core Web Vitals

- **LCP**: <2.5s
- **FID**: <100ms
- **CLS**: <0.1

### Optimization

- Image optimization (WebP/AVIF)
- Bundle size optimization
- Lazy loading
- CDN integration

## Deployment

### Static Export

```bash
npm run export
```

### Vercel

```bash
vercel deploy
```

### Netlify

```bash
netlify deploy
```

## API Reference

### Endpoints

- `GET /api/websites` - Get all websites
- `GET /api/websites/{id}` - Get website by ID
- `GET /api/websites/{id}/screenshot` - Get website screenshot
- `GET /api/websites/{id}/logo` - Get website logo
- `GET /api/websites/{id}/favicon` - Get website favicon

### Response Format

```json
{
  "id": "website-id",
  "name": "Website Name",
  "url": "https://website.com",
  "description": "Website description...",
  "screenshot": "/assets/website-screenshot.png",
  "logo": "/assets/website-logo.svg",
  "favicon": "/assets/website-favicon.ico",
  "requiresAuth": false,
  "lastUpdated": "2025-01-27T10:00:00.000Z",
  "state": "completed"
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run the test suite
6. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:

1. Check the documentation
2. Search existing issues
3. Create a new issue
4. Contact the maintainers

## Changelog

### v1.0.0
- Initial release
- Website dashboard
- Asset generation
- Authentication support
- Performance optimization
- Comprehensive testing
