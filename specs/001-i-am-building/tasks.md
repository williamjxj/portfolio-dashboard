# Tasks: Website Iteration Dashboard

**Input**: Design documents from `/specs/001-i-am-building/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have model tasks?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Web app**: `frontend/src/`, `frontend/tests/` (Next.js structure)
- Paths shown below assume Next.js web application structure

## Phase 3.1: Setup
- [ ] T001 Create Next.js project structure with TypeScript and Tailwind CSS
- [ ] T002 Initialize package.json with Next.js 14, Playwright, Jest, and Lighthouse CI dependencies
- [ ] T003 [P] Configure ESLint, Prettier, and TypeScript in frontend/
- [ ] T004 [P] Setup Playwright configuration for screenshot automation in frontend/
- [ ] T005 [P] Configure Tailwind CSS with mobile-first responsive design in frontend/

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T006 [P] Contract test GET /api/websites in frontend/tests/contract/test_websites_get.ts
- [ ] T007 [P] Contract test GET /api/websites/{id} in frontend/tests/contract/test_websites_get_by_id.ts
- [ ] T008 [P] Contract test GET /api/websites/{id}/screenshot in frontend/tests/contract/test_screenshot_get.ts
- [ ] T009 [P] Contract test GET /api/websites/{id}/logo in frontend/tests/contract/test_logo_get.ts
- [ ] T010 [P] Contract test GET /api/websites/{id}/favicon in frontend/tests/contract/test_favicon_get.ts
- [ ] T011 [P] Integration test website dashboard display in frontend/tests/integration/test_dashboard.ts
- [ ] T012 [P] Integration test authentication handling in frontend/tests/integration/test_auth.ts
- [ ] T013 [P] Integration test asset generation in frontend/tests/integration/test_assets.ts
- [ ] T014 [P] Integration test mobile responsiveness in frontend/tests/integration/test_responsive.ts
- [ ] T015 [P] Integration test accessibility compliance in frontend/tests/integration/test_accessibility.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T016 [P] Website model in frontend/src/models/Website.ts
- [ ] T017 [P] AuthenticationCredentials model in frontend/src/models/AuthenticationCredentials.ts
- [ ] T018 [P] AssetMetadata model in frontend/src/models/AssetMetadata.ts
- [ ] T019 [P] WebsiteService for CRUD operations in frontend/src/services/WebsiteService.ts
- [ ] T020 [P] AssetGenerationService for screenshots/logos/favicons in frontend/src/services/AssetGenerationService.ts
- [ ] T021 [P] AuthenticationService for login handling in frontend/src/services/AuthenticationService.ts
- [ ] T022 [P] Playwright automation service in frontend/src/services/PlaywrightService.ts
- [ ] T023 GET /api/websites endpoint implementation
- [ ] T024 GET /api/websites/{id} endpoint implementation
- [ ] T025 GET /api/websites/{id}/screenshot endpoint implementation
- [ ] T026 GET /api/websites/{id}/logo endpoint implementation
- [ ] T027 GET /api/websites/{id}/favicon endpoint implementation
- [ ] T028 Input validation for all endpoints
- [ ] T029 Error handling and logging for all services

## Phase 3.4: Integration
- [ ] T030 Connect WebsiteService to static file storage
- [ ] T031 Authentication middleware for protected endpoints
- [ ] T032 Request/response logging middleware
- [ ] T033 CORS and security headers configuration
- [ ] T034 Static asset serving configuration
- [ ] T035 Next.js Image optimization integration
- [ ] T036 Playwright browser automation integration
- [ ] T037 Asset optimization pipeline (WebP/AVIF conversion)

## Phase 3.5: UI Components
- [ ] T038 [P] WebsiteCard component in frontend/src/components/WebsiteCard.tsx
- [ ] T039 [P] WebsiteGrid component in frontend/src/components/WebsiteGrid.tsx
- [ ] T040 [P] WebsiteDetail component in frontend/src/components/WebsiteDetail.tsx
- [ ] T041 [P] LoadingSpinner component in frontend/src/components/LoadingSpinner.tsx
- [ ] T042 [P] ErrorBoundary component in frontend/src/components/ErrorBoundary.tsx
- [ ] T043 Dashboard page in frontend/src/pages/index.tsx
- [ ] T044 Website detail page in frontend/src/pages/website/[id].tsx
- [ ] T045 Layout component with responsive design in frontend/src/components/Layout.tsx

## Phase 3.6: Asset Generation
- [ ] T046 [P] Screenshot generation script in frontend/scripts/generate-screenshots.ts
- [ ] T047 [P] Logo generation script in frontend/scripts/generate-logos.ts
- [ ] T048 [P] Favicon generation script in frontend/scripts/generate-favicons.ts
- [ ] T049 [P] Asset optimization script in frontend/scripts/optimize-assets.ts
- [ ] T050 Website data parsing from README.md in frontend/scripts/parse-websites.ts
- [ ] T051 Authentication credential management in frontend/scripts/auth-manager.ts
- [ ] T052 Build-time asset generation pipeline in frontend/scripts/build-assets.ts

## Phase 3.7: Polish
- [ ] T053 [P] Unit tests for Website model in frontend/tests/unit/test_Website.ts
- [ ] T054 [P] Unit tests for AuthenticationCredentials model in frontend/tests/unit/test_AuthenticationCredentials.ts
- [ ] T055 [P] Unit tests for AssetMetadata model in frontend/tests/unit/test_AssetMetadata.ts
- [ ] T056 [P] Unit tests for WebsiteService in frontend/tests/unit/test_WebsiteService.ts
- [ ] T057 [P] Unit tests for AssetGenerationService in frontend/tests/unit/test_AssetGenerationService.ts
- [ ] T058 [P] Unit tests for AuthenticationService in frontend/tests/unit/test_AuthenticationService.ts
- [ ] T059 [P] Unit tests for PlaywrightService in frontend/tests/unit/test_PlaywrightService.ts
- [ ] T060 Performance tests (Lighthouse CI integration)
- [ ] T061 [P] Update documentation in frontend/docs/
- [ ] T062 Remove code duplication and optimize bundle size
- [ ] T063 Run quickstart.md validation scenarios

## Dependencies
- Tests (T006-T015) before implementation (T016-T052)
- T016-T018 (models) before T019-T021 (services)
- T019-T021 (services) before T023-T027 (endpoints)
- T022 (PlaywrightService) before T046-T048 (asset generation)
- T030-T037 (integration) before T038-T045 (UI components)
- T046-T052 (asset generation) before T053-T063 (polish)

## Parallel Examples
```
# Launch T006-T010 together (contract tests):
Task: "Contract test GET /api/websites in frontend/tests/contract/test_websites_get.ts"
Task: "Contract test GET /api/websites/{id} in frontend/tests/contract/test_websites_get_by_id.ts"
Task: "Contract test GET /api/websites/{id}/screenshot in frontend/tests/contract/test_screenshot_get.ts"
Task: "Contract test GET /api/websites/{id}/logo in frontend/tests/contract/test_logo_get.ts"
Task: "Contract test GET /api/websites/{id}/favicon in frontend/tests/contract/test_favicon_get.ts"

# Launch T016-T018 together (models):
Task: "Website model in frontend/src/models/Website.ts"
Task: "AuthenticationCredentials model in frontend/src/models/AuthenticationCredentials.ts"
Task: "AssetMetadata model in frontend/src/models/AssetMetadata.ts"

# Launch T019-T021 together (services):
Task: "WebsiteService for CRUD operations in frontend/src/services/WebsiteService.ts"
Task: "AssetGenerationService for screenshots/logos/favicons in frontend/src/services/AssetGenerationService.ts"
Task: "AuthenticationService for login handling in frontend/src/services/AuthenticationService.ts"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts
- Follow Next.js 14 static export configuration
- Ensure mobile-first responsive design
- Maintain WCAG 2.1 AA accessibility compliance
- Meet performance requirements (Lighthouse score ≥90)

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - Each contract file → contract test task [P]
   - Each endpoint → implementation task
   
2. **From Data Model**:
   - Each entity → model creation task [P]
   - Relationships → service layer tasks
   
3. **From User Stories**:
   - Each story → integration test [P]
   - Quickstart scenarios → validation tasks

4. **Ordering**:
   - Setup → Tests → Models → Services → Endpoints → UI → Assets → Polish
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [x] All contracts have corresponding tests
- [x] All entities have model tasks
- [x] All tests come before implementation
- [x] Parallel tasks truly independent
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
