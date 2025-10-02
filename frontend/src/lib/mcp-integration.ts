/**
 * Optional MCP-assisted generation stub.
 * Returns a simple SVG proposal based on site name/description.
 * Internal-use only per licensing constraint.
 */
export async function proposeLogoSvg(siteName: string, description?: string): Promise<string> {
  const letter = siteName.charAt(0).toUpperCase();
  const subtitle = (description || '').slice(0, 24);
  return `
<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#4F46E5"/>
      <stop offset="100%" stop-color="#06B6D4"/>
    </linearGradient>
  </defs>
  <rect width="256" height="256" rx="24" fill="url(#g)"/>
  <text x="128" y="140" font-family="Inter, Arial, sans-serif" font-size="120" font-weight="800" fill="#fff" text-anchor="middle">${letter}</text>
  <text x="128" y="200" font-family="Inter, Arial, sans-serif" font-size="16" fill="#E0E7FF" text-anchor="middle">${subtitle}</text>
</svg>`;
}


