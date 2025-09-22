# Quickstart: Website Iteration Dashboard

## Overview
This guide demonstrates how to use the Website Iteration Dashboard to manage and display 8 websites with their screenshots, descriptions, logos, and favicons.

## Prerequisites
- Node.js 18+ installed
- Git repository cloned
- 8 websites accessible (from README.md)

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

### 3. Generate Assets
```bash
npm run generate-assets
```
This command will:
- Parse websites from README.md
- Handle authentication where required
- Generate screenshots, logos, and favicons
- Optimize all assets for web delivery

### 4. Build Static Site
```bash
npm run build
```

### 5. Start Development Server
```bash
npm run dev
```

## User Scenarios

### Scenario 1: View Website Dashboard
**Given** the dashboard is loaded  
**When** I visit the homepage  
**Then** I see all 8 websites displayed with:
- High-resolution screenshots
- 2-3 sentence descriptions
- Custom logos
- Favicons
- Clickable links to original websites

### Scenario 2: Handle Authentication
**Given** a website requires login  
**When** the system attempts to generate a screenshot  
**Then** the system:
- Attempts automatic login with provided credentials
- Captures the authenticated dashboard/landing page
- Falls back to manual credential input if needed
- Asks user for guidance on authentication failures

### Scenario 3: Mobile Responsive Design
**Given** I access the dashboard on a mobile device  
**When** I view the website list  
**Then** I see:
- Responsive grid layout
- Touch-friendly interactions (44px minimum)
- Optimized images for mobile
- Fast loading times (<2s on 3G)

### Scenario 4: Accessibility Compliance
**Given** I use a screen reader  
**When** I navigate the dashboard  
**Then** I can:
- Navigate using keyboard only
- Hear descriptive text for all images
- Access all functionality without mouse
- Experience proper color contrast

## Testing Scenarios

### Manual Testing Checklist
- [ ] All 8 websites display correctly
- [ ] Screenshots are high-resolution and clear
- [ ] Descriptions are 2-3 sentences and informative
- [ ] Logos are distinctive and brand-appropriate
- [ ] Favicons are recognizable and properly sized
- [ ] Mobile responsive design works on all screen sizes
- [ ] Accessibility features function with screen readers
- [ ] Performance meets Lighthouse score ≥90
- [ ] All links open correct websites
- [ ] Authentication handling works for protected sites

### Performance Testing
- [ ] Page load time <2 seconds on 3G
- [ ] First Contentful Paint <1.5s
- [ ] Largest Contentful Paint <2.5s
- [ ] Cumulative Layout Shift <0.1
- [ ] Time to Interactive <3.5s

### Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Authentication Issues
If a website fails to authenticate:
1. Check credentials in configuration
2. Verify website is accessible
3. Try manual login process
4. Contact user for additional credentials

### Asset Generation Failures
If assets fail to generate:
1. Check website accessibility
2. Verify Playwright installation
3. Review error logs
4. Retry generation process

### Performance Issues
If performance is below standards:
1. Check image optimization
2. Verify asset compression
3. Review bundle size
4. Test on slower networks

## Success Criteria
- All 8 websites display with complete metadata
- Screenshots capture authenticated pages (not login screens)
- Mobile-first responsive design works perfectly
- Accessibility compliance (WCAG 2.1 AA)
- Performance meets all constitution requirements
- Assets are optimized for web delivery
