# Quickstart: Media Assets Feature

## Prerequisites
- Node.js 20.x
- Playwright installed (`npx playwright install chromium`)

## Generate/Refresh Assets
1. Manual upload preferred via API `/assets/{siteId}/upload`.
2. If missing, run automated fallback:
   - Extract logo/favicon from site metadata
   - Capture 1200x675 screenshot → convert to WebP
3. Retain last 3 versions; older are removed.
4. License all assets as internal-only; record metadata.

## MCP-assisted Generation (optional)
- Use MCP service to create logo/favicon drafts from site description and metadata; ensure internal-only use and review before adoption.

## Performance Budgets
- Logo ≤ 200 KB; Favicon ≤ 50 KB; Preview ≤ 400 KB

## Accessibility
- Ensure alt text for logos and previews.

