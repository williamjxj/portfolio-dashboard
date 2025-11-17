# Portfolio Dashboard

A comprehensive, modern dashboard for showcasing and managing a collection of AI-powered web applications. Built with Next.js and shadcn/ui, this dashboard provides an elegant way to present technical projects with detailed information, visual assets, and technology stack insights.

## 🎯 Business Purpose

### For Stakeholders

This dashboard serves as a **centralized portfolio showcase** that:

- **Demonstrates Technical Expertise**: Showcases a curated collection of AI-powered applications, highlighting technical capabilities and innovation
- **Streamlines Portfolio Management**: Provides a single interface to manage, update, and present multiple web projects with consistent branding and documentation
- **Enhances Professional Presentation**: Offers an elegant, modern interface for presenting work to clients, investors, or potential collaborators
- **Automates Asset Management**: Automatically generates and manages screenshots, logos, and favicons for each project, reducing manual maintenance overhead
- **Provides Technical Insights**: Delivers comprehensive technology stack analysis, helping stakeholders understand the breadth and depth of technical capabilities

### Value Proposition

- **Time Savings**: Automated asset generation eliminates manual screenshot and logo creation
- **Consistency**: Unified presentation format ensures all projects are showcased with the same level of detail and professionalism
- **Scalability**: Easy to add new projects without requiring design or development expertise
- **Accessibility**: Modern, responsive design ensures the portfolio looks great on all devices
- **Maintainability**: Centralized data management makes updates quick and straightforward

## 🚀 Features

### User-Facing Features

- **Modern UI/UX**: Beautiful, responsive interface built with shadcn/ui components
- **Three-Tab Navigation**: Dashboard, Tech Stack, and About pages for organized content
- **Interactive Website Cards**: Click-through cards with previews, descriptions, and status indicators
- **Real-Time Search**: Instant search across website names, descriptions, and technology stacks
- **Dark Mode Support**: Toggle between light and dark themes with system preference detection
- **Detailed Project Views**: Comprehensive project pages with screenshots, tech stack details, and deployment information
- **Tech Stack Visualization**: Organized display of frontend, backend, database, and deployment technologies
- **Status Indicators**: Visual badges showing authentication requirements, deployment status, and error states

### Developer Features

- **Automated Asset Generation**: Playwright-based screenshot, logo, and favicon capture
- **RESTful API**: Clean API routes for website and asset management
- **Type-Safe Models**: Full TypeScript support with comprehensive data models
- **Performance Monitoring**: Built-in performance tracking and optimization
- **Error Handling**: Robust error boundaries and validation
- **Modular Architecture**: Clean separation of concerns with reusable components

## 🛠️ Tech Stack

### Core Technologies

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Theme Management**: [next-themes](https://github.com/pacocoursey/next-themes)

### Supporting Tools

- **Asset Generation**: [Playwright](https://playwright.dev/) for automated browser automation
- **Image Processing**: [Sharp](https://sharp.pixelplumbing.com/) for image optimization
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React hooks and context API
- **Data Storage**: JSON-based file system storage (easily extensible to databases)

### Development Tools

- **Linting**: ESLint with Next.js configuration
- **Type Checking**: TypeScript strict mode
- **Build Tool**: Next.js built-in bundler
- **Package Manager**: npm

## 📐 Architecture

### High-Level Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Pages      │  │  Components  │  │  API Routes  │     │
│  │  (App Router)│  │  (React 19)  │  │  (Server)    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Models     │  │   Services   │  │   Storage    │     │
│  │  (TypeScript)│  │  (Business)  │  │  (JSON/FS)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Asset Generation (Playwright)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Screenshots │  │    Logos     │  │   Favicons   │     │
│  │  (Automated) │  │  (Automated) │  │  (Automated) │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### How It Works

The dashboard follows a simple, efficient architecture:

1. **Data Loading**: Website information is stored in JSON files and loaded through API routes
2. **Processing**: Data is filtered, enhanced, and formatted for display
3. **Rendering**: Modern React components present the information with beautiful UI
4. **Interactions**: Users can search, filter, and explore projects seamlessly

The application uses modern web development practices with a focus on performance, accessibility, and maintainability.

## 🚀 Quick Start

### Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Version 9 or higher (or yarn/pnpm)
- **Git**: For cloning the repository

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd portfolio-dashboard
   ```

2. **Navigate to frontend directory:**

   ```bash
   cd frontend
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Initialize shadcn/ui** (if not already configured):

   ```bash
   npx shadcn@latest init
   # Select: TypeScript, Tailwind CSS, src/, app/, Neutral, CSS variables
   ```

5. **Add required shadcn components:**

   ```bash
   npx shadcn@latest add button card input badge avatar dialog tabs navigation-menu
   ```

### Development

1. **Start the development server:**

   ```bash
   npm run dev
   ```

2. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

3. **View the dashboard:**
   - **Dashboard Tab**: Browse all websites in a responsive grid
   - **Tech Stack Tab**: View technology stack analysis and statistics
   - **About Tab**: Learn more about the portfolio

### Building for Production

```bash
npm run build    # Build the application
npm run start    # Start production server
```

## 📝 Adding New Websites

### Step-by-Step Process

1. **Add website data** to `frontend/data/websites.json`:

   ```json
   {
     "id": "unique-id",
     "name": "Website Name",
     "url": "https://example.com",
     "description": "Detailed description of the website...",
     "requiresAuth": false,
     "techStack": {
       "frontend": ["React", "Next.js"],
       "backend": ["Node.js"],
       "database": ["PostgreSQL"],
       "deployment": ["Vercel"]
     }
   }
   ```

2. **Generate assets** (optional, if using Playwright):

   ```bash
   npm run generate-assets
   ```

3. **Verify the website** appears in the dashboard at `http://localhost:3000`

## 🔌 API Reference

### Website Endpoints

- **GET** `/api/websites` - Get all websites
  - Query parameters: `search`, `status`, `tech`, `limit`, `offset`
  - Returns: `{ websites, summary, pagination, filters }`

- **GET** `/api/websites/[id]` - Get specific website
  - Returns: Website object with full details

### Asset Endpoints

- **GET** `/api/assets/[websiteId]` - Get assets for a website
- **PUT** `/api/assets/[websiteId]` - Refresh/regenerate assets
- **POST** `/api/assets/[websiteId]/upload` - Upload custom assets

### Tech Stack Endpoints

- **GET** `/api/tech-stack` - Get technology stack summary
- **GET** `/api/tech-stack/[technology]` - Get websites using a specific technology

## 🎨 Customization

### Styling

- **Colors**: Edit `tailwind.config.ts` to customize the color palette
- **Components**: Modify files in `src/components/ui/` for component customization
- **Themes**: Update `src/app/globals.css` for theme token customization

### Adding Components

To add more shadcn/ui components:

```bash
npx shadcn@latest add [component-name]
```

Available components: `table`, `select`, `textarea`, `switch`, `slider`, `progress`, `alert`, `toast`, and many more.

## 📊 Website Collection

The dashboard showcases a diverse collection of AI-powered web applications and professional platforms. Each project demonstrates different aspects of modern web development, from AI/ML integration to e-commerce and business solutions.

### Featured Applications

#### 🤖 **Face Fusion Agent**

**Live Site**: [face-fusion-agent.vercel.app](https://face-fusion-agent.vercel.app/face-fusion)  
**Description**: Advanced AI-powered face fusion application featuring real-time image processing and facial recognition capabilities. Built with cutting-edge machine learning models for seamless face blending and manipulation.

**Key Features**:

- Real-time face fusion with advanced ML models
- AI-powered image processing
- Interactive UI with Canvas API
- Computer vision and face recognition

**Technologies**: React, Next.js, Python, FastAPI, TensorFlow, PyTorch, Supabase

---

#### 🛒 **Manus AI Shop**

**Live Site**: [manus-ai-shop.vercel.app](https://manus-ai-shop.vercel.app/)  
**Description**: Intelligent e-commerce platform powered by AI, featuring personalized product recommendations and automated customer service. Includes full payment processing and inventory management.

**Key Features**:

- AI-powered product recommendations
- Automated customer service chatbot
- Stripe payment integration
- Real-time inventory management

**Technologies**: Next.js, React, Supabase, Stripe, OpenAI

---

#### 🏗️ **Bidmaster Hub**

**Live Site**: [bidmaster-hub.vercel.app](https://bidmaster-hub.vercel.app/)  
**Description**: Professional bidding platform designed for contractors and service providers. Streamlines project bidding, client communication, and project management workflows.

**Key Features**:

- Project bidding system
- Client communication tools
- Project management dashboard
- Contractor collaboration features

**Technologies**: Next.js, React, Supabase, PostgreSQL

---

#### 🧠 **NextJS Supabase Kappa Nine**

**Live Site**: [nextjs-supabase-kappa-nine.vercel.app](https://nextjs-supabase-kappa-nine.vercel.app/)  
**Description**: Modern full-stack application template demonstrating real-time data synchronization and authentication. Perfect starting point for building scalable web applications.

**Key Features**:

- Real-time data synchronization
- Complete authentication system
- Database management
- API integration examples

**Technologies**: Next.js, React, Supabase, PostgreSQL

---

#### 🔧 **NextJS MCP Template**

**Live Site**: [nextjs-mcp-template.vercel.app](https://nextjs-mcp-template.vercel.app/)  
**Description**: Template application demonstrating Model Context Protocol (MCP) integration with Next.js. Showcases how to build AI-powered applications with context-aware model interactions.

**Key Features**:

- Model Context Protocol integration
- AI template system
- Multi-model support (OpenAI, Claude)
- Template generation capabilities

**Technologies**: Next.js, React, MCP Protocol, OpenAI, Anthropic

---

#### 👶 **Friendship Daycare**

**Live Site**: [friendshipdaycare.vercel.app](https://friendshipdaycare.vercel.app/)  
**Description**: Comprehensive childcare management system featuring parent communication, scheduling, and educational activity tracking. Designed to streamline daycare operations and enhance parent engagement.

**Key Features**:

- Parent communication portal
- Scheduling and booking system
- Educational activity tracking
- Childcare management tools

**Technologies**: Next.js, React, Supabase, PostgreSQL

---

#### 💼 **Best IT Consulting**

**Live Site**: [bestitconsulting.ca](https://bestitconsulting.ca/)  
**Description**: Professional IT consulting services website showcasing technology solutions, consulting expertise, and client success stories. Features content management and lead generation capabilities.

**Key Features**:

- IT consulting services showcase
- Technology solutions portfolio
- Client success stories
- Professional expertise presentation

**Technologies**: Next.js, React, Contentful CMS, SEO optimization

---

#### 🚀 **Best IT Consultants**

**Live Site**: [bestitconsultants.ca](https://bestitconsultants.ca/)  
**Description**: Comprehensive IT consulting platform offering strategic technology guidance, digital transformation services, and enterprise solutions. Built for businesses seeking technology expertise.

**Key Features**:

- Strategic technology guidance
- Digital transformation services
- Enterprise solutions
- IT consulting platform

**Technologies**: Next.js, React, Contentful CMS, Supabase

---

### Collection Statistics

- **Total Applications**: 8
- **AI-Powered Projects**: 5
- **E-commerce Platforms**: 1
- **Business Solutions**: 2
- **All Projects**: Live and actively maintained

## 🧪 Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run compress:sites` - Compress site assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [shadcn/ui](https://ui.shadcn.com/) for beautiful, accessible components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Playwright](https://playwright.dev/) for browser automation
- [Radix UI](https://www.radix-ui.com/) for accessible component primitives

---

## Built With

This project is built with Next.js, React, and TypeScript.
