# Website Dashboard

A modern, responsive dashboard for managing and viewing website collections with beautiful UI/UX powered by shadcn/ui.

## Features

- **Modern UI**: Built with shadcn/ui components for consistent, accessible design
- **Three-Tab Navigation**: Dashboard, Tech Stack, and About pages
- **Tech Stack Overview**: Detailed technical information for each website
- **Responsive Grid**: Beautiful card-based layout that adapts to all screen sizes
- **Search & Filter**: Real-time search across website names and descriptions
- **Dark Mode**: Toggle between light and dark themes
- **Asset Management**: Automated screenshot, logo, and favicon generation
- **Interactive Details**: Click-through to detailed website views with asset previews
- **Status Indicators**: Visual badges for authentication requirements and errors
- **Performance Monitoring**: Built-in performance tracking and optimization

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **UI Components**: shadcn/ui (Card, Button, Badge, Dialog, Input, etc.)
- **Asset Generation**: Playwright for automated screenshots and asset capture
- **Theme**: next-themes for dark/light mode support

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Initialize shadcn/ui:**
   ```bash
   npx shadcn@latest init
   # Select: TypeScript, Tailwind CSS, src/, app/, Neutral, CSS variables
   ```

3. **Add shadcn components:**
   ```bash
   npx shadcn@latest add button card input badge avatar dialog tabs
   ```

4. **Install theme support:**
   ```bash
   npm install next-themes
   ```

### Development

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Generate website assets:**
   ```bash
   npm run generate-assets
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## UI/UX Features

### shadcn/ui Integration

The dashboard uses shadcn/ui components for consistent, accessible design:

- **Cards**: Modern card layout for website listings
- **Buttons**: Consistent button styling with variants
- **Badges**: Status indicators for authentication and errors
- **Dialogs**: Modal previews for assets
- **Input**: Search functionality with proper styling
- **Theme**: Dark/light mode support

### Adding New Components

To add more shadcn/ui components:

```bash
npx shadcn@latest add [component-name]
```

Available components include: `table`, `select`, `textarea`, `switch`, `slider`, `progress`, `alert`, `toast`, and many more.

### Customization

- **Colors**: Edit `tailwind.config.ts` to customize the color palette
- **Components**: Modify files in `src/components/ui/` for component customization
- **Themes**: Update `src/app/globals.css` for theme token customization

## Website Collection

The dashboard currently manages these websites:

- https://face-fusion-agent.vercel.app/face-fusion
- https://nextjs-supabase-kappa-nine.vercel.app/
- https://manus-ai-shop.vercel.app/
- https://bidmaster-hub.vercel.app/
- https://nextjs-mcp-template.vercel.app/
- https://friendshipdaycare.vercel.app/
- https://bestitconsulting.ca/
- https://bestitconsultants.ca/

## API Routes

- Assets
  - GET `/api/assets/[websiteId]`
  - PUT `/api/assets/[websiteId]` (manual refresh)
  - POST `/api/assets/[websiteId]/upload` (multipart upload)

## Architecture

### Component Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── Navigation.tsx      # Three-tab navigation
│   ├── TechStackTab.tsx    # Tech stack display component
│   ├── WebsiteCard.tsx     # Individual website cards
│   ├── WebsiteGrid.tsx     # Grid layout with search
│   ├── WebsiteDetail.tsx   # Detailed website view
│   └── ThemeToggle.tsx    # Dark/light mode toggle
├── app/
│   ├── api/               # API routes
│   │   ├── websites/      # Website endpoints
│   │   └── tech-stack/    # Tech stack endpoints
│   ├── tech-stack/        # Tech stack page
│   └── website/[id]/      # Dynamic website pages
├── models/                # TypeScript models
│   ├── TechStack.ts       # Tech stack data model
│   └── NavigationTab.ts   # Navigation state model
└── lib/                   # Utilities and services
    ├── performance.ts     # Performance monitoring
    └── validation.ts      # Data validation
```

### Key Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Library**: shadcn/ui for consistent, accessible components
- **Asset Management**: Automated generation of screenshots, logos, and favicons
- **Search & Filter**: Real-time search across website collections
- **Theme Support**: Dark/light mode with system preference detection
- **Performance**: Optimized images and lazy loading

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run generate-assets` - Generate website assets
- `npm run optimize-assets` - Optimize generated assets

### Adding New Websites

1. Add website data to `data/websites.json`
2. Run `npm run generate-assets` to create assets
3. Assets will be automatically optimized and stored in `storage/optimized/`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
