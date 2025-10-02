# UI/UX Quick Start Guide

## Prerequisites
- Node.js 18+ 
- npm or yarn
- Git
- VS Code (recommended)
- Figma (for design)

## Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd website-dashboard
```

### 2. Install Dependencies
```bash
cd frontend
npm install
```

### 3. Environment Setup
Create `.env.local` file:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_THEME=light
NEXT_PUBLIC_ANIMATIONS=enabled
```

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Design System

### Theme Configuration
The application supports multiple themes with customizable colors, typography, and spacing.

#### Available Themes
- **Light Theme**: Default light theme
- **Dark Theme**: Dark mode theme
- **Auto Theme**: System preference based
- **Custom Themes**: User-defined themes

#### Theme Structure
```typescript
interface ThemeConfig {
  id: string;
  name: string;
  type: 'light' | 'dark' | 'auto';
  colors: ColorPalette;
  typography: TypographyConfig;
  spacing: SpacingConfig;
  breakpoints: BreakpointConfig;
  animations: AnimationConfig;
}
```

### Color System
The design system uses a comprehensive color palette with semantic colors.

#### Color Categories
- **Primary**: Main brand colors
- **Secondary**: Supporting colors
- **Accent**: Highlight colors
- **Neutral**: Grayscale colors
- **Semantic**: Success, warning, error colors

#### Usage Example
```typescript
// Using theme colors
const theme = useTheme();
const primaryColor = theme.colors.primary.base;
const backgroundColor = theme.colors.background.primary;
```

### Typography System
Consistent typography across the application with responsive scaling.

#### Font Families
- **Primary**: Inter (sans-serif)
- **Secondary**: Geist (sans-serif)
- **Mono**: JetBrains Mono (monospace)

#### Typography Scale
- **Display**: 48px, 40px, 32px
- **Heading**: 24px, 20px, 18px
- **Body**: 16px, 14px, 12px
- **Caption**: 12px, 10px

#### Usage Example
```typescript
// Using typography classes
<h1 className="text-display-lg font-bold">
  Main Heading
</h1>
<p className="text-body-md text-neutral-600">
  Body text
</p>
```

## Component Library

### Core Components
The design system includes a comprehensive set of components.

#### Button Component
```typescript
<Button 
  variant="primary" 
  size="md" 
  disabled={false}
  onClick={handleClick}
>
  Click me
</Button>
```

#### Card Component
```typescript
<Card className="p-6">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    Card content
  </CardContent>
</Card>
```

#### Input Component
```typescript
<Input
  type="text"
  placeholder="Enter text"
  value={value}
  onChange={handleChange}
  error={error}
  disabled={disabled}
/>
```

### Advanced Components

#### Data Table
```typescript
<DataTable
  columns={columns}
  data={data}
  pagination={true}
  sorting={true}
  filtering={true}
  selection={true}
/>
```

#### Modal
```typescript
<Modal
  open={isOpen}
  onClose={handleClose}
  title="Modal Title"
  size="md"
>
  Modal content
</Modal>
```

#### Navigation
```typescript
<Navigation
  items={navigationItems}
  orientation="horizontal"
  variant="default"
  responsive={true}
/>
```

## Layout System

### Grid System
The application uses a flexible grid system for responsive layouts.

#### Grid Classes
```css
/* Grid container */
.grid-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
}

/* Grid items */
.col-1 { grid-column: span 1; }
.col-2 { grid-column: span 2; }
.col-3 { grid-column: span 3; }
.col-4 { grid-column: span 4; }
.col-6 { grid-column: span 6; }
.col-12 { grid-column: span 12; }
```

#### Responsive Grid
```css
/* Mobile first approach */
.col-mobile-12 { grid-column: span 12; }

/* Tablet */
@media (min-width: 768px) {
  .col-tablet-6 { grid-column: span 6; }
}

/* Desktop */
@media (min-width: 1024px) {
  .col-desktop-4 { grid-column: span 4; }
}
```

### Flexbox System
Alternative layout system using flexbox.

#### Flex Classes
```css
/* Flex container */
.flex-container {
  display: flex;
  gap: 1rem;
}

/* Flex items */
.flex-1 { flex: 1; }
.flex-2 { flex: 2; }
.flex-none { flex: none; }
```

### Spacing System
Consistent spacing using design tokens.

#### Spacing Scale
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **xxl**: 48px

#### Usage Example
```css
/* Padding */
.p-xs { padding: 4px; }
.p-sm { padding: 8px; }
.p-md { padding: 16px; }

/* Margin */
.m-xs { margin: 4px; }
.m-sm { margin: 8px; }
.m-md { margin: 16px; }
```

## Animation System

### Animation Configuration
The design system includes a comprehensive animation system.

#### Animation Types
- **Fade**: Opacity transitions
- **Slide**: Transform transitions
- **Scale**: Size transitions
- **Rotate**: Rotation transitions
- **Bounce**: Elastic transitions

#### Animation Properties
```typescript
interface AnimationConfig {
  duration: {
    fast: '150ms';
    normal: '300ms';
    slow: '500ms';
  };
  easing: {
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)';
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)';
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)';
  };
  delay: {
    none: '0ms';
    short: '100ms';
    medium: '200ms';
    long: '300ms';
  };
}
```

#### Usage Example
```typescript
// Using Framer Motion
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
>
  Animated content
</motion.div>
```

### Micro-interactions
Small, meaningful animations that enhance user experience.

#### Hover Effects
```css
/* Button hover */
.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
}
```

#### Focus Effects
```css
/* Input focus */
.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  transition: all 0.2s ease;
}
```

## Accessibility

### Accessibility Features
The design system includes comprehensive accessibility features.

#### ARIA Support
- ARIA labels and descriptions
- ARIA expanded and hidden
- ARIA roles and properties
- ARIA live regions

#### Keyboard Navigation
- Tab order management
- Keyboard shortcuts
- Focus management
- Escape key handling

#### Screen Reader Support
- Semantic HTML
- Alt text for images
- Descriptive link text
- Form labels

#### Color Contrast
- WCAG AA compliance
- High contrast mode
- Color blind support
- Focus indicators

### Usage Example
```typescript
// Accessible button
<Button
  aria-label="Close dialog"
  aria-describedby="dialog-description"
  onClick={handleClose}
>
  <Icon name="close" aria-hidden="true" />
</Button>
```

## Responsive Design

### Breakpoints
The design system uses a mobile-first approach with defined breakpoints.

#### Breakpoint System
- **xs**: 0px - 575px (Mobile)
- **sm**: 576px - 767px (Large Mobile)
- **md**: 768px - 991px (Tablet)
- **lg**: 992px - 1199px (Desktop)
- **xl**: 1200px - 1399px (Large Desktop)
- **xxl**: 1400px+ (Extra Large Desktop)

#### Usage Example
```css
/* Mobile first */
.component {
  padding: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .component {
    padding: 2rem;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .component {
    padding: 3rem;
  }
}
```

### Responsive Components
Components that adapt to different screen sizes.

#### Responsive Grid
```typescript
<Grid
  columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
  gap={{ xs: 'sm', md: 'md', lg: 'lg' }}
>
  {items.map(item => (
    <GridItem key={item.id}>
      <Card>{item.content}</Card>
    </GridItem>
  ))}
</Grid>
```

#### Responsive Typography
```typescript
<Text
  size={{ xs: 'sm', md: 'md', lg: 'lg' }}
  weight={{ xs: 'normal', md: 'semibold' }}
>
  Responsive text
</Text>
```

## Development

### Adding New Components
1. Create component in `src/components/`
2. Add TypeScript interfaces
3. Implement responsive design
4. Add accessibility features
5. Add tests
6. Add to storybook

### Customizing Themes
1. Create theme configuration
2. Define color palette
3. Set typography settings
4. Configure spacing
5. Add animations
6. Test across components

### Adding Animations
1. Define animation configuration
2. Implement with Framer Motion
3. Add reduced motion support
4. Test performance
5. Test accessibility

## Testing

### Visual Testing
```bash
# Run visual tests
npm run test:visual

# Update visual snapshots
npm run test:visual:update
```

### Accessibility Testing
```bash
# Run accessibility tests
npm run test:a11y

# Run axe-core tests
npm run test:axe
```

### Performance Testing
```bash
# Run performance tests
npm run test:performance

# Run Lighthouse tests
npm run test:lighthouse
```

## Deployment

### Build Process
```bash
# Build for production
npm run build

# Analyze bundle
npm run analyze

# Test production build
npm run start
```

### Environment Variables
- `NEXT_PUBLIC_THEME` - Default theme
- `NEXT_PUBLIC_ANIMATIONS` - Animation settings
- `NEXT_PUBLIC_ACCESSIBILITY` - Accessibility features

## Troubleshooting

### Common Issues

#### Theme Not Loading
- Check theme configuration
- Verify CSS variables
- Check browser support
- Clear browser cache

#### Animations Not Working
- Check Framer Motion setup
- Verify animation configuration
- Check reduced motion settings
- Test performance impact

#### Responsive Issues
- Check breakpoint configuration
- Verify CSS media queries
- Test on different devices
- Check viewport settings

### Getting Help
- Check design system documentation
- Review component examples
- Test in different browsers
- Check accessibility guidelines
