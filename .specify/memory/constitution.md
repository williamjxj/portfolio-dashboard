<!--
Sync Impact Report:
Version change: 4.0.0 → 5.0.0
Modified principles: Enhanced Website Dashboard Standards with new asset management and tech stack features
Added sections: Enhanced Website Model, Playwright Asset Generation, Tech Stack Integration
Removed sections: None
Templates requiring updates: ✅ .specify/templates/plan-template.md, ✅ .specify/templates/spec-template.md, ✅ .specify/templates/tasks-template.md
Follow-up TODOs: None
-->

# Website Dashboard Constitution

## Core Principles

### I. Modern Web Dashboard Architecture
The application MUST be built as a modern web dashboard using Next.js 15 with App Router, React 19, and TypeScript. The architecture MUST support both static generation and serverless API routes for asset management. Client-side interactivity is permitted for dashboard functionality, search, and theme management.

Rationale: The project implements a website dashboard with real-time search, theme switching, and interactive components. Next.js 15 with App Router provides optimal performance while supporting both static and dynamic content.

### II. Component Library Standards (NON-NEGOTIABLE)
All UI components MUST use shadcn/ui as the foundation with Tailwind CSS for styling. Components MUST be accessible (WCAG 2.1 AA), responsive, and support both light and dark themes. Custom components MUST extend shadcn/ui patterns, not replace them.

Rationale: shadcn/ui provides consistent, accessible components that work seamlessly with Next.js and Tailwind CSS. The current implementation uses Card, Button, Badge, Dialog, Input, and other shadcn/ui components for the dashboard interface.

### III. Asset Generation & Management (NON-NEGOTIABLE)
Website assets (screenshots, logos, favicons) MUST be generated at build time using Playwright automation with comprehensive fallback strategies. Assets MUST be optimized (WebP/AVIF) and stored in version control. The system MUST handle authentication-required websites and provide fallback assets when primary assets are unavailable. Runtime asset generation is NOT permitted for production builds.

Rationale: The project uses Playwright for automated screenshot capture and asset generation with robust retry logic, authentication handling, and fallback generation. This ensures consistent, high-quality assets while maintaining static site performance and resilience.

### IV. Performance-First (NON-NEGOTIABLE)
Page load times MUST be under 2 seconds on 3G networks. Core Web Vitals: LCP < 2.5s, FID (or INP) < 100ms, CLS < 0.1. All assets MUST be optimized and compressed. Enforce performance budgets in CI and block regressions.

### V. Mobile-First Design
Interfaces MUST be responsive and mobile-optimized with minimum 44px touch targets. Dashboard components MUST work seamlessly across all device sizes. Adopt PWA capabilities where applicable.

### VI. Accessibility Standards
WCAG 2.1 AA compliance is MANDATORY: semantic HTML, keyboard navigation, screen reader compatibility, and color contrast ratios ≥ 4.5:1. All interactive elements MUST be accessible.

### VII. Enhanced Website Model & Tech Stack Integration
The website model MUST support comprehensive metadata including tech stack information, deployment details, authentication requirements, and asset management. All website data MUST be validated with proper TypeScript interfaces. Tech stack information MUST be displayed in dedicated dashboard sections with detailed breakdowns.

Rationale: The current implementation includes enhanced Website model with TechStackInfo, DeploymentInfo, and comprehensive asset management. This enables rich dashboard experiences with detailed technical information and proper data validation.

### VIII. Authentication & Security
Authentication credentials MUST be stored securely (not in version control). API endpoints MUST validate inputs and implement proper CORS policies. Security headers MUST be enforced. Error handling MUST not expose sensitive information.

## Website Dashboard Standards

### Build Requirements
- Next.js 15 with App Router and static generation
- React 19 with TypeScript for type safety
- shadcn/ui components with Tailwind CSS v4
- Playwright for automated asset generation with fallback strategies
- next-themes for dark/light mode support
- Geist font family for typography
- Lucide React for consistent iconography

### Performance Standards
- Lighthouse scores ≥ 90 across all categories
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1
- Time to Interactive < 3.5s
- Bundle size optimization with tree shaking

### Asset Management
- Automated screenshot generation using Playwright with retry logic
- Logo and favicon extraction from target websites with fallback generation
- Authentication handling for protected websites
- Image optimization (WebP/AVIF) with responsive sizes
- Asset versioning and cache management in storage/optimized/
- Comprehensive fallback strategies for missing or inaccessible assets
- SVG-based fallback generation for logos and favicons
- Asset metadata tracking with dimensions and format information

### Component Standards
- Use shadcn/ui primitives (Card, Button, Badge, Dialog, etc.)
- Implement consistent spacing and typography
- Support both light and dark themes
- Ensure keyboard navigation and screen reader support
- Maintain responsive design across all breakpoints

### Enhanced Website Model
- Comprehensive Website interface with tech stack integration
- TechStackInfo for detailed technical breakdowns
- DeploymentInfo for platform and status tracking
- AuthenticationCredentials for protected website access
- AssetMetadata for comprehensive asset tracking
- WebsiteModel class for data validation and management
- Support for both legacy and new asset URL fields
- Comprehensive validation with error reporting

### Tech Stack Integration
- Dedicated tech stack dashboard section
- Detailed breakdown of frontend, backend, database, and deployment technologies
- AI tools and other technology categorization
- Visual representation of technology stacks
- Integration with website deployment information

## Development Workflow

### Quality Gates
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Automated asset generation in build pipeline
- Performance budget enforcement

### Review Process
- All changes MUST pass TypeScript compilation
- UI changes MUST maintain accessibility standards
- Performance regressions are grounds for immediate rollback
- Asset generation MUST be tested before deployment

## Governance

All development MUST follow these principles. This Constitution supersedes other practices. Performance regressions are grounds for immediate rollback.

Amendment Procedure:
- Propose a change via PR updating this file with a Sync Impact Report
- Include migration/mitigation steps for any policy change
- Require approval from maintainers and performance/accessibility owners

Versioning Policy (SemVer for governance):
- MAJOR: Backward-incompatible policy changes (e.g., changing component library)
- MINOR: New principle/section or materially expanded guidance
- PATCH: Clarifications or non-semantic wording fixes

Compliance Reviews:
- Enforced on every PR via quality gates and CI checks
- Periodic review at least quarterly to validate ongoing compliance

**Version**: 5.0.0 | **Ratified**: 2025-01-22 | **Last Amended**: 2025-01-22