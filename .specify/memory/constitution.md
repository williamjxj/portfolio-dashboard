<!--
Sync Impact Report:
Version change: 0.0.0 → 1.0.0
Added sections: Static Web App Principles, Performance Standards, Deployment Requirements
Templates requiring updates: ✅ plan-template.md, ✅ spec-template.md, ✅ tasks-template.md
Follow-up TODOs: None
-->

# Static Web App Constitution

## Core Principles

### I. Static-First Architecture
All content MUST be pre-generated and served as static files. No server-side rendering or dynamic content generation at runtime. Use build-time optimization for performance and SEO.

### II. Progressive Enhancement
Core functionality MUST work without JavaScript. Progressive enhancement layers: HTML → CSS → JavaScript. Graceful degradation for older browsers and accessibility tools.

### III. Performance-First (NON-NEGOTIABLE)
Page load times MUST be under 2 seconds on 3G networks. Core Web Vitals compliance required: LCP < 2.5s, FID < 100ms, CLS < 0.1. All assets MUST be optimized and compressed.

### IV. Mobile-First Design
All interfaces MUST be responsive and mobile-optimized. Touch-friendly interactions with minimum 44px touch targets. Progressive Web App capabilities where applicable.

### V. Accessibility Standards
WCAG 2.1 AA compliance MANDATORY. Semantic HTML structure, keyboard navigation, screen reader compatibility, and color contrast ratios ≥ 4.5:1.

## Static Web App Standards

### Build Requirements
- Static site generator (Next.js, Gatsby, or similar)
- Asset optimization and compression
- Image optimization with WebP/AVIF formats
- CSS/JS minification and bundling
- Critical CSS inlining

### Performance Standards
- Lighthouse score ≥ 90 across all categories
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1
- Time to Interactive < 3.5s

### Deployment Requirements
- CDN distribution for global performance
- HTTPS enforcement with HSTS headers
- Gzip/Brotli compression enabled
- Cache headers optimized for static assets
- Error pages (404, 500) as static fallbacks

## Development Workflow

### Quality Gates
- Automated testing for responsive design
- Lighthouse CI integration in build pipeline
- Accessibility testing with axe-core
- Cross-browser testing on major browsers
- Performance budget enforcement

### Review Process
- All changes MUST pass performance regression tests
- Accessibility review required for UI changes
- Mobile responsiveness verification
- SEO impact assessment for content changes

## Governance

All development MUST follow these principles. Constitution supersedes all other practices. Amendments require documentation, approval, and migration plan. Performance regressions are grounds for immediate rollback.

**Version**: 1.0.0 | **Ratified**: 2025-01-22 | **Last Amended**: 2025-01-22