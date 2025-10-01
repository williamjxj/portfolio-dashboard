## Tech Implementation Summary

**Project:** `frontend` (Website Dashboard)

**Overview:**
- **Framework:** Next.js (app router) with React 19.
- **Language:** TypeScript.
- **Styling:** TailwindCSS + custom global CSS. UI enhanced with shadcn/ui; patterns inspired by Magic UI and Mobbin.
- **Browser automation:** Playwright via `PlaywrightService` for generating screenshots, logos and favicons. Testing toolchains have been removed for now.

**Key Directories / Files:**
- `src/app/` — Next.js app entry points (`layout.tsx`, `page.tsx`).
- `src/components/` — UI components such as `WebsiteGrid`, `WebsiteCard`, `Layout`. Prefer shadcn/ui primitives (e.g., Card, Badge, Dialog, Tabs).
- `src/models/` — Domain models and in-memory model implementations (`Website`, `WebsiteModel`, `AssetMetadata`, etc.).
- `src/services/` — Business logic and integrations: `WebsiteService`, `PlaywrightService`, `AssetGenerationService`, `AuthenticationService`.
- `src/lib/` — Helpers and integrations: `data-loader.ts`, `playwright-integration.ts`, `logger.ts`, `storage.ts`.
- `data/` and `storage/` — Seed data and generated assets persisted as JSON and static files.

Architecture & Data Flow
- The app uses a client-side React page (`src/app/page.tsx`) that calls an API route (`/api/websites`) to fetch website records.
- Data is persisted as JSON files under `data/` (e.g., `websites.json`, `auth-credentials.json`, `assets.json`) via `DataLoader` and manipulated in-memory with the `*Model` classes.
- Asset generation (screenshots, logos, favicons) is driven by the `PlaywrightService` and coordinated by `PlaywrightIntegration` and `AssetGenerationService`. Generated assets are written to `storage/optimized` and referenced by `AssetMetadata` entries.
- Authentication credentials are modeled and can be applied by Playwright flows (`authenticate`, `handleEmailAuthentication`, `handleOAuthAuthentication`, `handleSSOAuthentication`), though full end-to-end SSO/OAuth handling is best-effort and may need env or provider-specific configuration to work reliably.

Notable Implementation Details
- Playwright is loaded dynamically in `PlaywrightService.initialize()` using `import('playwright')` to avoid bundling issues and to keep it out of the browser bundle.
- The services use synchronous in-memory model classes (`WebsiteModel`, `AssetMetadataModel`) with basic validation helpers. Models perform validation for URLs and ISO date strings.
- The `PlaywrightService` contains robust retry/backoff behavior for navigation and asset capture, and includes fallbacks for missing logos/favicons by rendering SVGs to a headless page and screenshotting them.
- Logging is centralized via `src/lib/logger.ts` with a lightweight logger class that could be swapped to ship to an external logging service.
- Scripts in `package.json` include dev, build, asset generation, and static export. Test and Lighthouse CI scripts removed.

Security & Operational Notes
- The project stores authentication credentials in JSON under `data/` which is suitable for local experiments but not production — credentials should be stored securely (vault, encrypted DB, or secrets manager) and never committed.
- Playwright is launched with `--no-sandbox` and `--disable-setuid-sandbox` flags in the service. These flags are commonly used in CI or containerized setups but may have security implications if running on shared hosts.
- Long-running Playwright instances should be sandboxed and monitored; consider limiting concurrency and adding resource/cpu/memory guards.

Testing & CI
- Test tooling has been removed (Jest, Playwright runner, Lighthouse CI) to simplify the stack. Consider reintroducing lightweight checks later.

Strengths
- Clear separation of concerns: models, services, lib helpers, and UI components.
- Playwright-based asset generation with sensible fallbacks improves resilience when sites lack standard metadata.
- TypeScript domain models with validation help maintain data integrity in-memory.

Areas for Improvement
- Persistent Storage: Move from JSON files to a small DB (SQLite, NeDB, or Postgres) for reliability, concurrent access, and queryability.
- Authentication Handling: The Playwright auth flows are heuristic-based and will fail for complex OAuth/SSO flows; add provider-specific flows or token-based auth where possible.
- Secrets Management: Move credentials out of repo-managed JSON; integrate a secrets store or encrypted datastore.
- Error Handling & Observability: Add structured tracing, request IDs, and metrics; integrate a proper logging backend (e.g., Datadog, Logflare, or an ELK stack).
- Concurrency & Scaling: Asset generation via Playwright is CPU/memory heavy. Introduce a worker queue (BullMQ, RabbitMQ) and worker pool with rate limits.
- UI Design System: Expand shadcn/ui usage and selectively adopt Magic UI patterns with performance and contrast checks.

Suggested Next Steps for Production Hardening
1. Replace file-based data persistence with a transactional DB (start with SQLite for quick wins).  
2. Move secret storage to environment variables or a secrets manager; encrypt any persisted secrets.  
3. Introduce a job queue and background workers for Playwright-based asset generation; limit concurrency and add retries with exponential backoff.  
4. Add end-to-end CI integration for Playwright tests and Lighthouse runs (use containerized browsers or Playwright’s own runners).  
5. Harden Playwright invocations for third-party auth flows (use headful debugging, provider-specific mocks or token exchange flows).

Files Inspected
- `frontend/package.json`  
- `frontend/src/app/layout.tsx`  
- `frontend/src/app/page.tsx`  
- `frontend/src/lib/data-loader.ts`  
- `frontend/src/lib/playwright-integration.ts`  
- `frontend/src/lib/logger.ts`  
- `frontend/src/services/PlaywrightService.ts`  
- `frontend/src/services/WebsiteService.ts`  
- `frontend/src/services/AssetGenerationService.ts`  
- `frontend/src/models/Website.ts`

If you want, I can:
- Run the test suite (`npm test`) and report failures, or
- Implement one of the suggested hardening steps (e.g., simple SQLite persistence and migration), or
- Expand the summary into a short ADR or design doc for production deployment.
