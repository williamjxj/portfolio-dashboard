# Tasks: Media Assets for Each Managed Site

Feature: 006-create-logo-favicon

## Conventions
- [P] indicates tasks that can run in parallel with others in the same group
- Mark completed tasks with [X]

## Phase: Setup
T001. Initialize Playwright tooling and env guards [X]
- Ensure `playwright` installed and chromium available
- Validate local storage paths under `frontend/public/assets/`

T002. Add validation constants for asset dimensions and sizes [X]
- File: `frontend/src/lib/utils.ts` or new `frontend/src/lib/validation.ts`
- Include: logo max 200KB; favicon max 50KB; preview 1200x675 WebP max 400KB

## Phase: Tests
T010. [P] Contract test for GET /assets/{siteId} [X]
- Based on `contracts/website-assets-api.yaml`

T011. [P] Contract test for PUT /assets/{siteId} (refresh) [X]

T012. [P] Contract test for POST /assets/{siteId}/upload [X]

T013. [P] Integration test: manual upload preferred over automated [X]
- Assert provenance flags and hybrid model behavior

## Phase: Core
T020. Create/extend `SiteAssets` model per data-model.md [X]
- File: `frontend/src/models/Website.ts` or new `frontend/src/models/Asset.ts`

T021. Implement validation helpers per research.md [X]
- File: `frontend/src/lib/validation.ts`

T022. Implement `AssetGenerationService` with Playwright fallback [X]
- File: `frontend/src/services/AssetGenerationService.ts`
- Generate preview 1200x675 WebP; extract logo/favicon; provenance + license

T023. Implement retention policy (keep last 3, delete older) [X]
- File: `frontend/src/services/AssetGenerationService.ts`

## Phase: Endpoints
T030. Implement GET /api/assets/[websiteId] [X]
- File: `frontend/src/app/api/assets/[websiteId]/route.ts`
- Returns `SiteAssets` JSON

T031. Implement PUT /api/assets/[websiteId] (refresh) [X]
- Manual trigger; returns 202

T032. Implement POST /api/assets/[websiteId]/upload [X]
- Multipart accept logo, faviconIco/png, previewImage; update provenance

## Phase: Integration
T040. Wire UI to show logo, favicon, preview consistently [X]
- Files: `frontend/src/components/WebsiteCard.tsx`, `WebsiteDetail.tsx`

T041. Add license display and internal-use notice in UI [X]

T042. Optional MCP-assisted generation hook [X]
- File: `frontend/src/lib/mcp-integration.ts`
- Use site description + metadata to assist logo/favicon proposal

## Phase: Polish
T050. [P] Performance budget checks for assets [X]

T051. [P] Update quickstart and README with new endpoints [X]

T052. [P] Logging and observability for asset generation [X]

## Parallel Groups
- Tests [T010-T013] can run together
- Polish [T050-T052] can run together

## Notes
- Licensing: internal-only; record license metadata for each asset
- Sourcing: manual preferred, automated fallback only if missing

