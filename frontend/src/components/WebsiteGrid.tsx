'use client';

import React, { useState, useMemo } from 'react';
import { Website } from '@/models/Website';
import { WebsiteCard } from './WebsiteCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface WebsiteGridProps {
  websites: Website[];
  className?: string;
  loading?: boolean;
  error?: string;
}

export const WebsiteGrid: React.FC<WebsiteGridProps> = ({ 
  websites, 
  className = '', 
  loading = false,
  error 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredWebsites = useMemo(() => {
    if (!searchTerm) return websites;
    return websites.filter(website => 
      website.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      website.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [websites, searchTerm]);
  if (error) {
    return (
      <div className={`flex items-center justify-center min-h-64 ${className}`}>
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Websites</h3>
          <p className="text-gray-600 mb-4" data-testid="error-message">
            {error}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-64 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" data-testid="loading-spinner"></div>
          <p className="text-gray-600">Loading websites...</p>
        </div>
      </div>
    );
  }

  if (websites.length === 0) {
    return (
      <div className={`flex items-center justify-center min-h-64 ${className}`}>
        <div className="text-center">
          <div className="text-muted-foreground text-6xl mb-4">🌐</div>
          <h3 className="text-lg font-semibold mb-2">No Websites Found</h3>
          <p className="text-muted-foreground">No websites are currently available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Search Bar */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search websites..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Results count */}
      {searchTerm && (
        <div className="mb-4 text-sm text-muted-foreground">
          {filteredWebsites.length} of {websites.length} websites
        </div>
      )}

      {/* Grid */}
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        data-testid="website-grid"
        role="grid"
        aria-label="Website dashboard"
      >
        {filteredWebsites.map((website) => (
          <WebsiteCard 
            key={website.id} 
            website={website}
            className="h-full"
          />
        ))}
      </div>

      {/* No search results */}
      {searchTerm && filteredWebsites.length === 0 && (
        <div className="flex items-center justify-center min-h-32">
          <div className="text-center">
            <div className="text-muted-foreground text-4xl mb-2">🔍</div>
            <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
            <p className="text-muted-foreground mb-4">Try a different search term.</p>
            <Button 
              variant="outline" 
              onClick={() => setSearchTerm('')}
            >
              Clear Search
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebsiteGrid;
