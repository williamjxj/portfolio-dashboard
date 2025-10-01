<!--
Sync Impact Report:
Version change: 1.0.0 → 2.0.0
Modified principles: Static-First Architecture → Static-First with Serverless APIs
Added sections: Security & Compliance
Removed sections: None
Templates requiring updates: ✅ .specify/templates/plan-template.md, ✅ .specify/templates/spec-template.md, ✅ .specify/templates/tasks-template.md
Follow-up TODOs: None
-->

# Static Web App Constitution

## Core Principles

### I. Static-First with Serverless APIs
Pages and assets MUST be pre-generated at build time and served statically. Server-side
rendering for pages is NOT permitted. Serverless or edge functions MAY be used for
API endpoints that serve precomputed or repository-backed data, with no long-lived
servers. Runtime data mutation MUST occur via offline scripts or scheduled jobs,
not user-triggered writes.

Rationale: The repository implements Next.js with static pages and lightweight API
routes for asset and metadata delivery. Allowing serverless aligns with current
implementation while preserving deterministic builds and reliability.

### II. Progressive Enhancement
Core functionality MUST work without JavaScript. Enhancement layers: HTML → CSS →
JavaScript. Provide graceful degradation for assistive technologies and older
browsers.

### III. Performance-First (NON-NEGOTIABLE)
Page load times MUST be under 2 seconds on 3G networks. Core Web Vitals:
LCP < 2.5s, FID (or INP) < 100ms, CLS < 0.1. All assets MUST be optimized and
compressed. Enforce performance budgets in CI and block regressions.

### IV. Mobile-First Design
Interfaces MUST be responsive and mobile-optimized with minimum 44px touch targets.
Adopt PWA capabilities where applicable.

### V. Accessibility Standards
WCAG 2.1 AA compliance is MANDATORY: semantic HTML, keyboard navigation, screen
reader compatibility, and color contrast ratios ≥ 4.5:1.

### VI. Security & Compliance
Enforce HTTPS, HSTS, CORS, and security headers. Validate inputs on API boundaries.
Avoid secrets in client bundles. Use dependency scanning and keep third-party
libraries updated. Log errors without sensitive data and honor least privilege.

## Static Web App Standards

### Build Requirements
- Next.js (or similar) with static generation preferred for all pages
- Asset optimization and compression
- Image optimization (WebP/AVIF) with responsive sizes
- CSS/JS minification and bundling; critical CSS inlining

### Performance Standards
- Lighthouse scores ≥ 90 across all categories
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
- Serverless execution targets p95 < 200ms, no stateful services

## Development Workflow

### Quality Gates
- Automated testing for responsive design
- Lighthouse CI integration in the build pipeline
- Accessibility testing with axe-core
- Cross-browser testing on major browsers
- Performance budget enforcement and regression checks

### Review Process
- All changes MUST pass performance regression tests
- Accessibility review required for UI changes
- Mobile responsiveness verification
- SEO impact assessment for content changes

## Governance

All development MUST follow these principles. This Constitution supersedes other
practices. Performance regressions are grounds for immediate rollback.

Amendment Procedure:
- Propose a change via PR updating this file with a Sync Impact Report
- Include migration/mitigation steps for any policy change
- Require approval from maintainers and performance/accessibility owners

Versioning Policy (SemVer for governance):
- MAJOR: Backward-incompatible policy changes (e.g., allowing/disallowing SSR)
- MINOR: New principle/section or materially expanded guidance
- PATCH: Clarifications or non-semantic wording fixes

Compliance Reviews:
- Enforced on every PR via quality gates and CI checks
- Periodic review at least quarterly to validate ongoing compliance

**Version**: 2.0.0 | **Ratified**: 2025-01-22 | **Last Amended**: 2025-10-01