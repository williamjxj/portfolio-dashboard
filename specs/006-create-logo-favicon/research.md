# Phase 0 Research: Media Assets (Logos, Favicons, Images)

## Unknowns Resolved
- Exact dimensions and max sizes per asset type

## Decisions
- Logo: SVG preferred; provide PNG fallback if needed. Max byte size 200 KB.
- Favicon: ICO (32x32) and PNG (32x32, 48x48). Max byte size 50 KB each.
- Preview image: WebP 1200x675 (16:9). Max byte size 400 KB.
- Version retention: Keep last 3 versions (from spec).
- Licensing: Internal use only; record license metadata (from spec).

## Rationale
- SVG logos scale cleanly and minimize artifacts; PNG fallback covers raster-only brands.
- Favicon sizes (32/48) cover common high-DPI displays with minimal storage.
- 1200x675 (16:9) is a standard social/share preview size balancing clarity and weight.
- Byte size limits fit performance budgets and typical dashboards.

## Alternatives Considered
- AVIF for previews: better compression but variable browser support; defer.
- Larger favicon set (16/32/48/64/128): unnecessary for dashboard internal use.
- Multiple previews per site: deferred by spec decision to 1 image.

## Implications for Design
- Validation rules for mime type, dimensions, and size will be enforced in services.
- Playwright screenshot generation should target 1200x675 output and WebP conversion.
- Provenance and license fields must be part of `SiteAssets` metadata.

