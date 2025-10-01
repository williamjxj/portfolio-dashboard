## Phase 0 Research — UI/UX Enhancements for Website Dashboard

### Decision: Adopt shadcn/ui as the component baseline
- Rationale: Works seamlessly with Next.js + Tailwind; copy-paste components allow full control without runtime dependency bloat; strong a11y patterns and dark mode primitives.
- Alternatives considered: Material UI (heavier, theme system overkill), Chakra (good DX but theming divergence from Tailwind), Headless UI (lower-level; more wiring).
- References: `https://ui.shadcn.com/docs/installation/next` (setup), shadcn component catalog via MCP.

### Decision: Leverage Magic UI patterns (compatible with shadcn)
- Rationale: Magic UI provides delightful micro-interactions, cards, nav, and animated patterns that pair well with shadcn tokens.
- Alternatives: Build effects in-house (time-intensive); Framer Motion custom (kept for select interactions).
- References: `https://github.com/magicuidesign/magicui` (docs/blog on shadcn compatibility).

### Decision: Use Mobbin for pattern inspiration (list → card grid → detail)
- Rationale: Mobbin showcases best-in-class dashboard list/detail patterns, filters, and empty states; informs IA and content density choices.
- Alternatives: Dribbble/Behance (less systematized), Ant Design specs (kept as secondary reference below).
- References: `https://mobbin.com` (browsed patterns: dashboards, cards, search/filter, empty state).

### UI Information Architecture
- Home: grid list of websites (cards) with logo, title, URL, short description, favicon indicator, and screenshot thumbnail.
- Detail: hero with logo + title + actions (Open site, View assets), larger screenshot, full description, metadata (favicon, logo, last captured), and related links.
- Filter/Search: global search over name/description; optional quick tag chips (future).
- Empty/Errors: graceful placeholders for missing screenshot/logo; retry action for unreachable URLs.

### Accessibility & Performance (Constitution Alignment)
- A11y: semantic headings, focus order, keyboard navigation, aria-labels on actionable icons, contrast ≥ 4.5:1.
- Performance: static-first with serverless APIs; images optimized to WebP with responsive sizes; no blocking animations.

### Playwright Integration (MCP + local service)
- Use Playwright MCP to on-demand screenshot pages when assets missing or stale.
- Keep local `PlaywrightService` to batch/capture assets via scripts, not at runtime.

### Design Tokens & Themes
- Tailwind + shadcn tokens: use neutral gray base with accent per-site; support dark mode toggle.

### Open Questions Resolved
- FR-011 (ref-mcp scope): track external references in docs and quickstart; no runtime UI link required.
- FR-012 (tagging): defer; not required for initial release.
- FR-013 (editing): read-only dashboard for now.
- FR-014 (conflicts between docs): prefer `website-analysis-report.md`; flag deviations in UI badge.

### Secondary References
- Ant Design specs on lists, visualization pages for density/layout guidance: `https://ant.design/docs/spec/data-list` and related pages.


