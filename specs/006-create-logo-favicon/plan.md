
# Implementation Plan: Media Assets for Each Managed Site (Logos, Favicons, Images)

**Branch**: `006-create-logo-favicon` | **Date**: 2025-10-02 | **Spec**: `/Users/william.jiang/my-experiments/website-dashboard/specs/006-create-logo-favicon/spec.md`
**Input**: Feature specification from `/specs/006-create-logo-favicon/spec.md`

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
Provide a hybrid asset sourcing solution for each managed website: prefer manual uploads for logos/favicons/previews, with automated fallback capture from site metadata/content. Enforce formats: Logo (SVG), Favicon (ICO+PNG), Images (WebP), Video (MP4). Default to one preview image per site, manual refresh only, keep last 3 versions, internal-use-only licensing. Use MCP service if needed to assist logo/favicon generation based on site metadata and description, ensuring results remain internal-use only.

## Technical Context
**Language/Version**: TypeScript 5.x, Next.js 15 (App Router), React 19  
**Primary Dependencies**: shadcn/ui, Tailwind CSS, Playwright; optional MCP service for asset generation assistance  
**Storage**: JSON files under `frontend/data/` and static assets under `frontend/public/assets/`  
**Target Platform**: Web (Vercel dev), Node.js for tooling  
**Project Type**: Web application (`frontend` project)  
**Performance Goals**: LCP < 2.5s, INP < 100ms, CLS < 0.1, Lighthouse ≥ 90  
**Constraints**: WCAG 2.1 AA, mobile-first, internal-use-only licensing for generated/captured media  
**Scale/Scope**: 7–10 sites initially (`frontend/data/websites.json`), per-site single preview, 3-version retention

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Modern Web Dashboard Architecture: PASS (Next.js 15, React 19, TS)  
- Component Library Standards: PASS (shadcn/ui + Tailwind, accessibility targeted)  
- Asset Generation & Management: PASS (Playwright build-time with fallbacks; no runtime gen)  
- Performance-First: PASS (budgets set; enforce in quickstart)  
- Mobile-First & Accessibility: PASS (WCAG 2.1 AA commitment)

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
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->
```
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/


# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: Single web application. Relevant directories: `frontend/src/models`, `frontend/src/services`, `frontend/src/lib`, `frontend/public/assets/{logos,favicons,screenshots}`.

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate API documentation** from contracts:
   - One documentation file per endpoint
   - Document request/response schemas
   - Include usage examples

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh cursor`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, quickstart.md, agent-specific file

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
- [ ] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved (dimensions & max sizes defined in research.md)
- [ ] Complexity deviations documented

---
*Based on Constitution v3.0.0 - See `/memory/constitution.md`*
