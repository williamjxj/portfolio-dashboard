# Data Model: Update UI/UX and Add Tech Stack Tab

**Feature**: 003-update-ui-ux  
**Date**: 2025-01-27  
**Status**: Complete

## Entity Definitions

### TechStackInfo
Represents the technical information for a website.

**Fields**:
- `frontend`: string[] - Frontend frameworks and libraries
- `backend`: string[] - Backend technologies and frameworks
- `database`: string[] - Database systems and tools
- `deployment`: string[] - Deployment platforms and services
- `aiTools`: string[] - AI/ML tools and frameworks
- `other`: string[] - Other technologies and tools
- `version`: string - Version information (optional)
- `source`: string - Data source or last updated timestamp

**Validation Rules**:
- All arrays must contain non-empty strings
- Version must be valid semantic version if provided
- Source must be non-empty string

**State Transitions**:
- `draft` → `published` (when data is complete)
- `published` → `updated` (when data is modified)

### NavigationTab
Represents the navigation state for the three main tabs.

**Fields**:
- `id`: string - Unique identifier (dashboard, tech-stack, about)
- `label`: string - Display name
- `path`: string - Route path
- `active`: boolean - Whether tab is currently active
- `order`: number - Display order

**Validation Rules**:
- ID must be unique across all tabs
- Label must be non-empty string
- Path must be valid route
- Order must be positive integer

**State Transitions**:
- `inactive` → `active` (when tab is selected)
- `active` → `inactive` (when different tab is selected)

### WebsiteTechDetails
Represents the relationship between websites and their technical specifications.

**Fields**:
- `websiteId`: string - Reference to website
- `techStack`: TechStackInfo - Technical information
- `lastUpdated`: string - ISO timestamp of last update
- `isComplete`: boolean - Whether all tech stack data is available

**Validation Rules**:
- WebsiteId must reference existing website
- TechStack must be valid TechStackInfo object
- LastUpdated must be valid ISO timestamp
- IsComplete must be boolean

**State Transitions**:
- `incomplete` → `complete` (when all required data is added)
- `complete` → `updated` (when data is modified)

## Data Relationships

### One-to-One Relationships
- `Website` ↔ `WebsiteTechDetails` (each website has one tech stack record)

### One-to-Many Relationships
- `NavigationTab` → `Website` (navigation can access multiple websites)

### Many-to-Many Relationships
- `TechStackInfo` ↔ `Technology` (tech stack can contain multiple technologies)

## Validation Rules

### TechStackInfo Validation
```typescript
interface TechStackInfo {
  frontend: string[];      // Required, non-empty
  backend: string[];       // Required, non-empty
  database: string[];      // Required, non-empty
  deployment: string[];    // Required, non-empty
  aiTools: string[];       // Optional, can be empty
  other: string[];         // Optional, can be empty
  version?: string;        // Optional, semantic version
  source: string;          // Required, non-empty
}
```

### NavigationTab Validation
```typescript
interface NavigationTab {
  id: string;             // Required, unique
  label: string;          // Required, non-empty
  path: string;           // Required, valid route
  active: boolean;       // Required, boolean
  order: number;         // Required, positive integer
}
```

### WebsiteTechDetails Validation
```typescript
interface WebsiteTechDetails {
  websiteId: string;      // Required, references existing website
  techStack: TechStackInfo; // Required, valid TechStackInfo
  lastUpdated: string;    // Required, ISO timestamp
  isComplete: boolean;    // Required, boolean
}
```

## State Transitions

### TechStackInfo States
1. **Draft**: Initial state when tech stack data is being collected
2. **Published**: Tech stack data is complete and available
3. **Updated**: Tech stack data has been modified

### NavigationTab States
1. **Inactive**: Tab is not currently selected
2. **Active**: Tab is currently selected and visible

### WebsiteTechDetails States
1. **Incomplete**: Missing required tech stack information
2. **Complete**: All required tech stack information is available
3. **Updated**: Tech stack information has been modified

## Data Flow

### Read Operations
1. **Get All Websites**: Fetch websites with tech stack data
2. **Get Tech Stack**: Fetch tech stack information for specific website
3. **Get Navigation**: Fetch available navigation tabs with active state

### Write Operations
1. **Update Tech Stack**: Modify tech stack information for website
2. **Set Active Tab**: Update navigation active state
3. **Add Tech Stack**: Create new tech stack record for website

## Data Sources

### Primary Sources
- `websites.json` - Website metadata and basic information
- `tech-stack.json` - Technical information for each website
- `assets.json` - Asset metadata and optimization data

### Secondary Sources
- Build-time generated data from Playwright
- User-provided technical information
- External API integrations (if needed)

## Migration Strategy

### Existing Data
- No migration required for existing websites
- Tech stack data will be added incrementally
- Existing functionality remains unchanged

### New Data Structure
- Add `techStack` field to existing website records
- Create new `tech-stack.json` file for detailed technical information
- Update navigation to include new "Tech Stack" tab

## Performance Considerations

### Data Loading
- Tech stack data loaded on-demand for tech stack page
- Main dashboard remains fast with minimal data
- Lazy loading for large tech stack datasets

### Caching Strategy
- Static generation for tech stack page
- Client-side caching for navigation state
- Build-time optimization for tech stack data

## Security Considerations

### Data Validation
- All input data validated against schemas
- No sensitive information in tech stack data
- Proper error handling for missing data

### Access Control
- No authentication required for tech stack viewing
- Public access to technical information
- No sensitive technical details exposed

## Error Handling

### Missing Data
- Show "Information not available" placeholder
- Graceful degradation for incomplete tech stack
- Option to add missing information

### Invalid Data
- Validate all tech stack data against schemas
- Fallback to default values for invalid data
- Log errors for debugging

## Testing Strategy

### Unit Tests
- Test all validation rules
- Test state transitions
- Test error handling

### Integration Tests
- Test data flow between components
- Test navigation state management
- Test tech stack data display

### End-to-End Tests
- Test complete user workflows
- Test responsive design
- Test accessibility compliance