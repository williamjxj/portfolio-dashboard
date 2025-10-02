const fs = require('fs');
const path = require('path');

// Create the public directory if it doesn't exist
const publicDir = './frontend/public';
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Dashboard SVG content (simplified and optimized)
const dashboardSVG = `<?xml version="1.0" encoding="utf-8"?>
<svg width="32" height="32" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M14.5 19.5V12.5M10.5 12.5V5.5M5.5 12.5H19.5M5.5 19.5H19.5V5.5H5.5V19.5Z" stroke="#3B82F6" stroke-width="1.2" fill="none"/>
  <circle cx="12.5" cy="12.5" r="2" fill="#3B82F6"/>
</svg>`;

// Logo SVG content (larger version for header)
const logoSVG = `<?xml version="1.0" encoding="utf-8"?>
<svg width="200" height="200" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1D4ED8;stop-opacity:1" />
    </linearGradient>
  </defs>
  <path d="M14.5 19.5V12.5M10.5 12.5V5.5M5.5 12.5H19.5M5.5 19.5H19.5V5.5H5.5V19.5Z" stroke="url(#gradient)" stroke-width="1.5" fill="none"/>
  <circle cx="12.5" cy="12.5" r="2.5" fill="url(#gradient)"/>
  <text x="12.5" y="22" text-anchor="middle" font-family="Arial, sans-serif" font-size="3" fill="#6B7280">AI</text>
</svg>`;

// Simple ICO content (16x16 and 32x32)
const icoContent = `<?xml version="1.0" encoding="utf-8"?>
<svg width="32" height="32" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="25" height="25" fill="#3B82F6"/>
  <path d="M14.5 19.5V12.5M10.5 12.5V5.5M5.5 12.5H19.5M5.5 19.5H19.5V5.5H5.5V19.5Z" stroke="white" stroke-width="1.2" fill="none"/>
  <circle cx="12.5" cy="12.5" r="2" fill="white"/>
</svg>`;

// Create favicon.ico (we'll create an SVG version for now, browsers will handle it)
const faviconPath = path.join(publicDir, 'favicon.ico');
fs.writeFileSync(faviconPath, icoContent);
console.log('✅ Created: favicon.ico');

// Create favicon.svg
const faviconSvgPath = path.join(publicDir, 'favicon.svg');
fs.writeFileSync(faviconSvgPath, dashboardSVG);
console.log('✅ Created: favicon.svg');

// Create logo.svg
const logoPath = path.join(publicDir, 'logo.svg');
fs.writeFileSync(logoPath, logoSVG);
console.log('✅ Created: logo.svg');

// Create apple-touch-icon.png (we'll create an SVG version)
const appleTouchIconPath = path.join(publicDir, 'apple-touch-icon.png');
const appleTouchIconSVG = `<?xml version="1.0" encoding="utf-8"?>
<svg width="180" height="180" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="25" height="25" rx="4" fill="#3B82F6"/>
  <path d="M14.5 19.5V12.5M10.5 12.5V5.5M5.5 12.5H19.5M5.5 19.5H19.5V5.5H5.5V19.5Z" stroke="white" stroke-width="1.5" fill="none"/>
  <circle cx="12.5" cy="12.5" r="2.5" fill="white"/>
</svg>`;
fs.writeFileSync(appleTouchIconPath, appleTouchIconSVG);
console.log('✅ Created: apple-touch-icon.png');

// Create manifest.json
const manifest = {
  "name": "William Jiang's AI Products Dashboard",
  "short_name": "AI Dashboard",
  "description": "A comprehensive dashboard showcasing AI-powered applications and products",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3B82F6",
  "icons": [
    {
      "src": "/favicon.ico",
      "sizes": "32x32",
      "type": "image/x-icon"
    },
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml"
    },
    {
      "src": "/apple-touch-icon.png",
      "sizes": "180x180",
      "type": "image/png"
    }
  ]
};

const manifestPath = path.join(publicDir, 'manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('✅ Created: manifest.json');

console.log('✨ Favicon and logo creation complete!');
console.log('📁 Files created in:', publicDir);
console.log('🔗 Files created:');
console.log('   - favicon.ico (32x32)');
console.log('   - favicon.svg (scalable)');
console.log('   - logo.svg (header logo)');
console.log('   - apple-touch-icon.png (180x180)');
console.log('   - manifest.json (PWA manifest)');

