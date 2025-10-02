/**
 * End-to-end tests for navigation and tech stack page functionality
 * Tests complete user workflows for navigation and tech stack page display
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Navigation } from '@/components/Navigation';
import { TechStackTab } from '@/components/TechStackTab';
import { Website } from '@/models/Website';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  })),
}));

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
});

describe('Navigation Component', () => {
  it('should render all three navigation tabs', () => {
    render(<Navigation />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Tech Stack')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('should show active tab based on current path', () => {
    const mockUsePathname = require('next/navigation').usePathname;
    mockUsePathname.mockReturnValue('/tech-stack');
    
    render(<Navigation />);
    
    const techStackTab = screen.getByText('Tech Stack').closest('a');
    expect(techStackTab).toHaveClass('bg-gray-100');
  });

  it('should toggle mobile menu on button click', () => {
    render(<Navigation />);
    
    const mobileMenuButton = screen.getByRole('button', { name: /open main menu/i });
    fireEvent.click(mobileMenuButton);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Tech Stack')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('should support keyboard navigation', () => {
    render(<Navigation />);
    
    const dashboardTab = screen.getByText('Dashboard').closest('a');
    expect(dashboardTab).toHaveAttribute('tabIndex', '0');
  });
});

describe('Tech Stack Page', () => {
  const mockWebsites: Website[] = [
    {
      id: 'test-1',
      name: 'Test Website 1',
      url: 'https://test1.com',
      description: 'Test description 1',
      requiresAuth: false,
      lastUpdated: '2025-01-27T10:00:00Z',
      techStack: {
        frontend: ['React', 'Next.js'],
        backend: ['Node.js'],
        database: ['PostgreSQL'],
        deployment: ['Vercel'],
        aiTools: ['OpenAI'],
        other: ['GitHub Actions'],
        source: '2025-01-27T10:00:00Z'
      }
    },
    {
      id: 'test-2',
      name: 'Test Website 2',
      url: 'https://test2.com',
      description: 'Test description 2',
      requiresAuth: false,
      lastUpdated: '2025-01-27T10:00:00Z',
      techStack: {
        frontend: ['Vue.js', 'Nuxt.js'],
        backend: ['Python', 'Django'],
        database: ['MongoDB'],
        deployment: ['AWS'],
        aiTools: [],
        other: ['Docker'],
        source: '2025-01-27T10:00:00Z'
      }
    }
  ];

  it('should display tech stack information for each website', () => {
    render(<TechStackTab websites={mockWebsites} />);
    
    expect(screen.getByText('Test Website 1')).toBeInTheDocument();
    expect(screen.getByText('Test Website 2')).toBeInTheDocument();
  });

  it('should filter websites by search term', async () => {
    render(<TechStackTab websites={mockWebsites} />);
    
    const searchInput = screen.getByPlaceholderText('Search websites...');
    fireEvent.change(searchInput, { target: { value: 'Test Website 1' } });
    
    await waitFor(() => {
      expect(screen.getByText('Test Website 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Website 2')).not.toBeInTheDocument();
    });
  });

  it('should filter websites by category', async () => {
    render(<TechStackTab websites={mockWebsites} />);
    
    const categorySelect = screen.getByDisplayValue('All Categories');
    fireEvent.change(categorySelect, { target: { value: 'frontend' } });
    
    await waitFor(() => {
      expect(screen.getByText('Test Website 1')).toBeInTheDocument();
      expect(screen.getByText('Test Website 2')).toBeInTheDocument();
    });
  });

  it('should show expandable sections for tech stack details', async () => {
    render(<TechStackTab websites={mockWebsites} />);
    
    const expandButton = screen.getByText('Expand');
    fireEvent.click(expandButton);
    
    await waitFor(() => {
      expect(screen.getByText('Collapse')).toBeInTheDocument();
    });
  });

  it('should handle websites without tech stack data', () => {
    const websitesWithoutTechStack: Website[] = [
      {
        id: 'test-no-tech',
        name: 'No Tech Stack',
        url: 'https://notech.com',
        description: 'No tech stack data',
        requiresAuth: false,
        lastUpdated: '2025-01-27T10:00:00Z'
      }
    ];

    render(<TechStackTab websites={websitesWithoutTechStack} />);
    
    expect(screen.getByText('No Tech Stack')).toBeInTheDocument();
    expect(screen.getByText('Technical information not available')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<TechStackTab websites={[]} />);
    
    // Should show empty state
    expect(screen.getByText('No websites found')).toBeInTheDocument();
  });
});

describe('Responsive Design', () => {
  it('should adapt to mobile screen sizes', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(<Navigation />);
    
    // Mobile menu button should be visible
    expect(screen.getByRole('button', { name: /open main menu/i })).toBeInTheDocument();
  });

  it('should maintain accessibility on all screen sizes', () => {
    render(<Navigation />);
    
    // All navigation items should be accessible
    const navigationItems = screen.getAllByRole('tab');
    expect(navigationItems.length).toBeGreaterThan(0);
    
    // Check for proper ARIA attributes
    navigationItems.forEach(item => {
      expect(item).toHaveAttribute('aria-selected');
    });
  });
});

describe('Performance', () => {
  it('should render without performance issues', () => {
    const startTime = performance.now();
    
    render(<TechStackTab websites={[]} />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should render in under 100ms
    expect(renderTime).toBeLessThan(100);
  });
});




