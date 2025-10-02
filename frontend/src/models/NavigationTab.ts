/**
 * NavigationTab model for navigation state management
 * Represents the three main navigation tabs in the dashboard
 */

export interface NavigationTab {
  /** Unique identifier for the tab */
  id: string;
  
  /** Display name for the tab */
  label: string;
  
  /** Route path for the tab */
  path: string;
  
  /** Whether the tab is currently active */
  active: boolean;
  
  /** Display order for the tab */
  order: number;
  
  /** Optional icon for the tab */
  icon?: string;
}

/**
 * Navigation tab IDs for type safety
 */
export const NAVIGATION_TAB_IDS = {
  DASHBOARD: 'dashboard',
  TECH_STACK: 'tech-stack',
  ABOUT: 'about'
} as const;

export type NavigationTabId = typeof NAVIGATION_TAB_IDS[keyof typeof NAVIGATION_TAB_IDS];

/**
 * Default navigation tabs configuration
 */
export const DEFAULT_NAVIGATION_TABS: NavigationTab[] = [
  {
    id: NAVIGATION_TAB_IDS.DASHBOARD,
    label: 'Dashboard',
    path: '/',
    active: true,
    order: 1,
    icon: 'LayoutDashboard'
  },
  {
    id: NAVIGATION_TAB_IDS.TECH_STACK,
    label: 'Tech Stack',
    path: '/tech-stack',
    active: false,
    order: 2,
    icon: 'Code'
  },
  {
    id: NAVIGATION_TAB_IDS.ABOUT,
    label: 'About',
    path: '/about',
    active: false,
    order: 3,
    icon: 'Info'
  }
];

/**
 * Navigation state management class
 */
export class NavigationState {
  private tabs: NavigationTab[] = DEFAULT_NAVIGATION_TABS;

  /**
   * Get all navigation tabs
   */
  getAllTabs(): NavigationTab[] {
    return this.tabs;
  }

  /**
   * Get tab by ID
   */
  getTabById(id: string): NavigationTab | undefined {
    return this.tabs.find(tab => tab.id === id);
  }

  /**
   * Get active tab
   */
  getActiveTab(): NavigationTab | undefined {
    return this.tabs.find(tab => tab.active);
  }

  /**
   * Set active tab by ID
   */
  setActiveTab(id: string): boolean {
    const tabIndex = this.tabs.findIndex(tab => tab.id === id);
    if (tabIndex === -1) return false;

    // Deactivate all tabs
    this.tabs.forEach(tab => tab.active = false);
    
    // Activate the selected tab
    this.tabs[tabIndex].active = true;
    
    return true;
  }

  /**
   * Update tab configuration
   */
  updateTab(id: string, updates: Partial<NavigationTab>): boolean {
    const tabIndex = this.tabs.findIndex(tab => tab.id === id);
    if (tabIndex === -1) return false;

    this.tabs[tabIndex] = { ...this.tabs[tabIndex], ...updates };
    return true;
  }

  /**
   * Validate navigation tab
   */
  validateTab(tab: NavigationTab): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!tab.id || typeof tab.id !== 'string') {
      errors.push('ID is required and must be a string');
    }

    if (!tab.label || typeof tab.label !== 'string') {
      errors.push('Label is required and must be a string');
    }

    if (!tab.path || typeof tab.path !== 'string') {
      errors.push('Path is required and must be a string');
    }

    if (typeof tab.active !== 'boolean') {
      errors.push('Active must be a boolean');
    }

    if (typeof tab.order !== 'number' || tab.order < 1) {
      errors.push('Order must be a positive number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * Navigation state singleton instance
 */
export const navigationState = new NavigationState();





