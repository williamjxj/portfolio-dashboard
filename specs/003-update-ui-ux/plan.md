
# Implementation Plan: Update UI/UX and Add Tech Stack Tab

**Branch**: `003-update-ui-ux` | **Date**: 2025-01-27 | **Spec**: `/specs/003-update-ui-ux/spec.md`
**Input**: Feature specification from `/specs/003-update-ui-ux/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
   → Check compliance with Modern Web Dashboard Architecture principles
   → Verify shadcn/ui component usage and accessibility standards
   → Ensure Playwright asset generation aligns with build-time requirements
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Add a dedicated "Tech Stack" navigation tab to the website dashboard that displays technical information for each website (frontend frameworks, backend technologies, database systems, deployment platforms, AI/ML tools) in organized cards. This preserves the clean main dashboard while providing detailed technical insights in a separate, accessible interface.

## Technical Context
**Language/Version**: TypeScript 5.x, Next.js 15, React 19  
**Primary Dependencies**: shadcn/ui, Tailwind CSS, Playwright, next-themes  
**Storage**: JSON files (websites.json, assets.json)  
**Target Platform**: Web browsers, Vercel deployment  
**Project Type**: Web application (frontend + backend)  
**Performance Goals**: LCP < 2.5s, FID < 100ms, Lighthouse 90+  
**Constraints**: WCAG 2.1 AA, mobile-first, <2s load time  
**Scale/Scope**: 8 websites, 100+ assets, static data

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Modern Web Dashboard Architecture ✅
- Uses Next.js 15 with App Router and React 19 ✅
- Maintains static generation with serverless API routes ✅
- Client-side interactivity for navigation and theme management ✅

### II. Component Library Standards ✅
- Uses shadcn/ui as foundation with Tailwind CSS ✅
- Maintains WCAG 2.1 AA accessibility ✅
- Supports light and dark themes ✅
- Extends shadcn/ui patterns, doesn't replace them ✅

### III. Asset Generation & Management ✅
- Uses Playwright for automated asset generation ✅
- Maintains build-time asset optimization ✅
- No runtime asset generation ✅

### IV. Performance-First ✅
- Page load < 2 seconds on 3G networks ✅
- LCP < 2.5s, FID < 100ms, CLS < 0.1 ✅
- Asset optimization and compression ✅

### V. Mobile-First Design ✅
- Responsive design with 44px touch targets ✅
- Works across all device sizes ✅

### VI. Accessibility Standards ✅
- WCAG 2.1 AA compliance ✅
- Semantic HTML and keyboard navigation ✅
- Screen reader compatibility ✅

### VII. Authentication & Security ✅
- Secure credential storage ✅
- API input validation and CORS policies ✅
- Security headers and error handling ✅

**Result**: All constitutional principles satisfied. No violations detected.

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
frontend/
├── src/
│   ├── app/
│   │   ├── tech-stack/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── Navigation.tsx
│   │   ├── TechStackTab.tsx
│   │   ├── TechStackCard.tsx
│   │   └── ui/
│   │       ├── card.tsx
│   │       ├── badge.tsx
│   │       └── tabs.tsx
│   ├── models/
│   │   ├── TechStack.ts
│   │   └── NavigationTab.ts
│   ├── services/
│   │   └── TechStackService.ts
│   └── lib/
│       └── utils.ts
├── data/
│   ├── websites.json
│   ├── assets.json
│   └── tech-stack.json
└── public/
    └── assets/
        ├── screenshots/
        ├── logos/
        └── favicons/
```

**Structure Decision**: Web application with frontend directory containing Next.js App Router structure, shadcn/ui components, TypeScript models, and JSON data storage. The tech stack feature adds new components and data models while maintaining existing architecture.

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - All technical context is clear - no NEEDS CLARIFICATION markers
   - Dependencies are well-established (shadcn/ui, Tailwind CSS, Playwright)
   - Integration patterns follow existing Next.js App Router structure

2. **Research tasks completed**:
   - ✅ Component baseline: shadcn/ui with Tailwind CSS
   - ✅ UI patterns: Card-based layout for tech stack information
   - ✅ Navigation: Tab-based navigation with active states
   - ✅ Data structure: JSON-based static data with TypeScript models
   - ✅ Performance: <2s load time, Lighthouse 90+ scores
   - ✅ Accessibility: WCAG 2.1 AA compliance with semantic HTML

3. **Consolidate findings** in `research.md`:
   - Decision: Use shadcn/ui Card components for tech stack display
   - Rationale: Maintains consistency with existing dashboard design
   - Alternatives considered: Custom components (rejected for consistency)

**Output**: research.md with all technical decisions documented

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - TechStackInfo: frontend, backend, database, deployment, aiTools, other, version, source
   - NavigationTab: Dashboard, Tech Stack, About with active state
   - WebsiteTechDetails: relationship between websites and tech stack data

2. **Generate API contracts** from functional requirements:
   - GET /api/websites - return websites with tech stack data
   - GET /api/tech-stack - return tech stack summary
   - GET /api/tech-stack/categories - return tech categories
   - Output OpenAPI schema to `/contracts/tech-stack-api.yaml`

3. **Generate API documentation** from contracts:
   - Document request/response schemas for all endpoints
   - Include usage examples and error handling
   - Create quickstart.md with setup and demonstration steps

4. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh cursor`
   - Add new tech stack components and navigation patterns
   - Preserve existing dashboard functionality
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency

**Output**: data-model.md, /contracts/tech-stack-api.yaml, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each contract → API implementation task [P]
- Each entity → model creation task [P] 
- Each user story → feature implementation task
- Implementation tasks to fulfill requirements

**Ordering Strategy**:
- Implementation order: Models before services before UI
- Dependency order: Core components before dependent features
- Mark [P] for parallel execution (independent files)

**Estimated Output**: 25-30 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented

---
*Based on Constitution v4.0.0 - See `/memory/constitution.md`*
