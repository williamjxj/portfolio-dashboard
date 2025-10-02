# Data Model: Media Assets for Managed Sites

## Entities

### Site
- id: string (unique)
- name: string
- url: string (valid URL)
- requiresAuth: boolean

### SiteAssets
- siteId: string (FK → Site.id)
- logo: string (path to SVG; optional PNG fallback)
- faviconIco: string (path to 32x32 ICO)
- faviconPng: string (path to 32x32 or 48x48 PNG)
- previewImage: string (path to WebP 1200x675)
- updatedAt: ISO string
- sourcingStrategy: enum("hybrid")
- provenance: { logoSource: enum("manual","automated"), faviconSource: enum("manual","automated"), previewSource: enum("manual","automated") }
- format: { logo: { mimeType: "image/svg+xml"|"image/png", byteSize: number }, faviconIco: { mimeType: "image/x-icon", byteSize: number }, faviconPng: { mimeType: "image/png", byteSize: number }, previewImage: { mimeType: "image/webp", width: 1200, height: 675, byteSize: number } }
- license: { scope: "internal-only", notes?: string }
- versionsKept: number (default 3)

## Validation Rules
- Logo must be SVG or PNG ≤ 200 KB
- Favicon ICO/PNG ≤ 50 KB
- Preview WebP 1200x675 ≤ 400 KB
- Enforce provenance and license fields

## Relationships
- Site 1—1 SiteAssets

