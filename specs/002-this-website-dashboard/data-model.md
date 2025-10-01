## Data Model — Website Dashboard

### Entity: Website
- id: string
- name: string
- url: string (valid HTTPS URL)
- description: string
- logoUrl: string | null
- faviconUrl: string | null
- screenshotUrl: string | null
- tags: string[]
- status: 'ok' | 'unavailable' | 'missing-assets'

Validation:
- url MUST be a valid URL (https).
- description truncated to ~200 chars for card view; full text on detail page.

### Entity: Asset
- id: string
- websiteId: string
- type: 'logo' | 'favicon' | 'screenshot'
- path: string
- status: 'ok' | 'missing' | 'stale'
- capturedAt: ISO datetime | null

Rules:
- When assets missing or stale, surface placeholder and capture action via scripts/Playwright MCP.


