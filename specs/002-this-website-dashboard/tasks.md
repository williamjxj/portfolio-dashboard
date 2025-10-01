# Tasks — 002-this-website-dashboard

All paths are absolute. Use [P] to indicate tasks that can run in parallel.

## Setup
T001 — Ensure shadcn/ui setup in frontend [P] [X]
- Path: `/Users/william.jiang/my-experiments/website-dashboard/frontend`
- Actions: `npx shadcn@latest init`; add base components `button card input badge avatar dialog tabs`.
- Depends on: None

T002 — Update Tailwind/shadcn styles and globals [P] [X]
- Path: `/Users/william.jiang/my-experiments/website-dashboard/frontend/src/app/globals.css`
- Actions: Wire shadcn tokens and variables; verify dark mode tokens.
- Depends on: T001

T003 — Confirm asset generation scripts post-cleanup [P] [X]
- Path: `/Users/william.jiang/my-experiments/website-dashboard/frontend/scripts/build-assets.ts`
- Actions: Run `npm run generate-assets` and confirm outputs under `storage/optimized`.
- Depends on: None

## Data & Models
T004 — Align in-repo Website/Asset models with `data-model.md` [X]
- Paths: `/Users/william.jiang/my-experiments/website-dashboard/frontend/src/models/Website.ts`, `/Users/william.jiang/my-experiments/website-dashboard/frontend/src/models/AssetMetadata.ts`
- Actions: Ensure fields: Website(id,name,url,description,logoUrl,faviconUrl,screenshotUrl,tags,status); Asset(id,websiteId,type,path,status,capturedAt).
- Depends on: T001

## Services & Integrations
T005 — Verify `WebsiteService` returns schema per OpenAPI [P] [X]
- Path: `/Users/william.jiang/my-experiments/website-dashboard/frontend/src/services/WebsiteService.ts`
- Actions: Ensure list and getById match `contracts/website-api.yaml` schemas; add missing fields/placeholders.
- Depends on: T004

T006 — Ensure `PlaywrightService` capture flow is callable via scripts [P] [X]
- Path: `/Users/william.jiang/my-experiments/website-dashboard/frontend/src/services/PlaywrightService.ts`
- Actions: Confirm dynamic import remains; ensure capture writes to `storage/optimized/*` and updates asset metadata.
- Depends on: T004

## API Routes
T007 — Confirm `/api/websites` list implements contract [X]
- Path: `/Users/william.jiang/my-experiments/website-dashboard/frontend/src/app/api/websites/route.ts`
- Actions: Validate response schema against `/specs/002-this-website-dashboard/contracts/website-api.yaml`.
- Depends on: T005

T008 — Confirm `/api/websites/[id]` implements contract [X]
- Path: `/Users/william.jiang/my-experiments/website-dashboard/frontend/src/app/api/websites/[id]/route.ts`
- Actions: Validate response schema; return 404 for missing.
- Depends on: T005

T009 — Confirm asset endpoints (logo, favicon, screenshot) [X]
- Paths: `/Users/william.jiang/my-experiments/website-dashboard/frontend/src/app/api/websites/[id]/logo/route.ts`, `/favicon/route.ts`, `/screenshot/route.ts`
- Actions: Ensure proper headers and placeholder behavior when missing.
- Depends on: T006

## UI — Grid & Detail
T010 — Refactor `WebsiteCard` to shadcn `Card` [X]
- Path: `/Users/william.jiang/my-experiments/website-dashboard/frontend/src/components/WebsiteCard.tsx`
- Actions: Use shadcn `Card`, `Badge`; include logo, title, URL, truncated description, screenshot thumbnail, and status indicators.
- Depends on: T001, T005

T011 — Update `WebsiteGrid` layout with responsive cards [X]
- Path: `/Users/william.jiang/my-experiments/website-dashboard/frontend/src/components/WebsiteGrid.tsx`
- Actions: Responsive grid, proper spacing, empty state per research.md.
- Depends on: T010

T012 — Enhance `WebsiteDetail` using shadcn components [X]
- Path: `/Users/william.jiang/my-experiments/website-dashboard/frontend/src/components/WebsiteDetail.tsx`
- Actions: Hero with logo, actions (open site, view assets), large screenshot, metadata; use `Dialog` for asset previews.
- Depends on: T010, T006

T013 — Add simple search/filter bar [P] [X]
- Path: `/Users/william.jiang/my-experiments/website-dashboard/frontend/src/components`
- Actions: Add input to filter by name/description locally; debounce; accessibility labels.
- Depends on: T010

## UX Polish
T014 — Add dark mode toggle using shadcn `theme-switcher` [P] [X]
- Path: `/Users/william.jiang/my-experiments/website-dashboard/frontend/src/components`
- Actions: Implement toggle; ensure contrast and token mapping per research.md.
- Depends on: T001, T002

T015 — Empty/error placeholders for assets [P] [X]
- Paths: card/detail components
- Actions: Display graceful placeholders and retry CTA for unreachable sites.
- Depends on: T010, T012

## Docs
T016 — Update `README.md` with UI/UX changes and shadcn steps [P] [X]
- Path: `/Users/william.jiang/my-experiments/website-dashboard/README.md`
- Actions: Document how to add shadcn components and where to adjust UI.
- Depends on: T001

## Parallel Execution Guidance
- [P] tasks that can run together now: T001, T003; T005, T006; T013, T014, T015, T016.
- Sequential clusters: T010 → T011 → T012; T004 → T005/T006 → T007/T008/T009.


