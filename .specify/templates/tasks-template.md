# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → API implementation task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Core components before dependent features
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have implementations?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 3.1: Setup
- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize Next.js 15 project with TypeScript and Tailwind CSS
- [ ] T003 [P] Configure shadcn/ui components and theme system
- [ ] T004 [P] Configure linting and formatting tools

## Phase 3.2: Core Implementation
- [ ] T005 [P] Website model in src/models/Website.ts
- [ ] T006 [P] WebsiteService CRUD in src/services/WebsiteService.ts
- [ ] T007 [P] PlaywrightService for asset generation in src/services/PlaywrightService.ts
- [ ] T008 POST /api/websites endpoint
- [ ] T009 GET /api/websites/{id} endpoint
- [ ] T010 Input validation and error handling
- [ ] T011 shadcn/ui component integration

## Phase 3.3: Integration
- [ ] T012 Connect WebsiteService to data storage
- [ ] T013 Authentication middleware for protected routes
- [ ] T014 Request/response logging and error handling
- [ ] T015 CORS and security headers
- [ ] T016 Theme system integration (dark/light mode)

## Phase 3.4: Polish
- [ ] T017 Performance optimization (Lighthouse CI, Core Web Vitals)
- [ ] T018 [P] Update docs and README
- [ ] T019 Accessibility validation and WCAG compliance
- [ ] T020 Asset optimization and compression
- [ ] T021 Manual validation and user acceptance

## Dependencies
- T005 blocks T006, T012
- T013 blocks T015
- Implementation before polish (T017-T021)

## Parallel Example
```
# Launch T005-T007 together:
Task: "Website model in src/models/Website.ts"
Task: "WebsiteService CRUD in src/services/WebsiteService.ts"
Task: "PlaywrightService for asset generation in src/services/PlaywrightService.ts"
```

## Notes
- [P] tasks = different files, no dependencies
- Commit after each task
- Avoid: vague tasks, same file conflicts

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - Each contract file → API implementation task [P]
   - Each endpoint → implementation task
   
2. **From Data Model**:
   - Each entity → model creation task [P]
   - Relationships → service layer tasks
   
3. **From User Stories**:
   - Each story → feature implementation [P]
   - Quickstart scenarios → validation tasks

4. **Ordering**:
   - Setup → Models → Services → Endpoints → Polish
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [ ] All contracts have corresponding implementations
- [ ] All entities have model tasks
- [ ] All core components come before dependent features
- [ ] Parallel tasks truly independent
- [ ] Each task specifies exact file path
- [ ] No task modifies same file as another [P] task