'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NavigationTab, DEFAULT_NAVIGATION_TABS, navigationState } from '@/models/NavigationTab';
import { 
  LayoutDashboard, 
  Code, 
  Info,
  Menu,
  X
} from 'lucide-react';

interface NavigationProps {
  className?: string;
}

/**
 * Navigation component with three-tab structure
 * 
 * Features:
 * - Three-tab navigation: Dashboard, Tech Stack, About
 * - Active state management with URL-based routing
 * - Mobile-responsive with hamburger menu
 * - Keyboard navigation support
 * - Accessibility compliance (WCAG 2.1 AA)
 * 
 * @param className - Optional CSS classes for styling
 * 
 * @example
 * ```tsx
 * <Navigation className="border-b" />
 * ```
 */
export function Navigation({ className }: NavigationProps) {
  const pathname = usePathname();
  const [tabs, setTabs] = useState<NavigationTab[]>(DEFAULT_NAVIGATION_TABS);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Update active tab based on current pathname
  useEffect(() => {
    const updateActiveTab = () => {
      setTabs(prevTabs => prevTabs.map(tab => ({
        ...tab,
        active: pathname === tab.path
      })));
    };

    updateActiveTab();
  }, [pathname]);

  // Handle tab click
  const handleTabClick = (tabId: string) => {
    navigationState.setActiveTab(tabId);
    const updatedTabs = navigationState.getAllTabs();
    setTabs(updatedTabs);
    setIsMobileMenuOpen(false);
  };

  // Get icon component
  const getIcon = (iconName: string) => {
    const iconMap = {
      LayoutDashboard,
      Code,
      Info
    };
    return iconMap[iconName as keyof typeof iconMap] || LayoutDashboard;
  };

  return (
    <nav className={cn(
      "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700",
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <img 
                src="/logo.svg" 
                alt="AI Dashboard Logo" 
                className="h-8 w-8"
              />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                AI Dashboard
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {tabs.map((tab) => {
                const IconComponent = getIcon(tab.icon || 'LayoutDashboard');
                return (
                  <Link
                    key={tab.id}
                    href={tab.path}
                    onClick={() => handleTabClick(tab.id)}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      "hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                      tab.active
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    )}
                    role="tab"
                    aria-selected={tab.active}
                    tabIndex={tab.active ? 0 : -1}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {tab.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => {
              const IconComponent = getIcon(tab.icon || 'LayoutDashboard');
              return (
                <Link
                  key={tab.id}
                  href={tab.path}
                  onClick={() => handleTabClick(tab.id)}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors",
                    "hover:bg-gray-100 dark:hover:bg-gray-800",
                    tab.active
                      ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  <IconComponent className="w-5 h-5 mr-3" />
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}

/**
 * Navigation tabs component for use in other parts of the app
 */
export function NavigationTabs() {
  const pathname = usePathname();
  const [tabs, setTabs] = useState<NavigationTab[]>(DEFAULT_NAVIGATION_TABS);

  useEffect(() => {
    const updateActiveTab = () => {
      setTabs(prevTabs => prevTabs.map(tab => ({
        ...tab,
        active: pathname === tab.path
      })));
    };

    updateActiveTab();
  }, [pathname]);

  const handleTabClick = (tabId: string) => {
    navigationState.setActiveTab(tabId);
    const updatedTabs = navigationState.getAllTabs();
    setTabs(updatedTabs);
  };

  const getIcon = (iconName: string) => {
    const iconMap = {
      LayoutDashboard,
      Code,
      Info
    };
    return iconMap[iconName as keyof typeof iconMap] || LayoutDashboard;
  };

  return (
    <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
      {tabs.map((tab) => {
        const IconComponent = getIcon(tab.icon || 'LayoutDashboard');
        return (
          <Link
            key={tab.id}
            href={tab.path}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
              "hover:bg-white dark:hover:bg-gray-700",
              tab.active
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            )}
          >
            <IconComponent className="w-4 h-4 mr-2" />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
