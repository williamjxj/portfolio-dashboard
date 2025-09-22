'use client';

import React from 'react';
import { Website } from '@/models/Website';
import { WebsiteCard } from './WebsiteCard';

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
          <div className="text-gray-400 text-6xl mb-4">🌐</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Websites Found</h3>
          <p className="text-gray-600">No websites are currently available.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
      data-testid="website-grid"
      role="grid"
      aria-label="Website dashboard"
    >
      {websites.map((website) => (
        <WebsiteCard 
          key={website.id} 
          website={website}
          className="h-full"
        />
      ))}
    </div>
  );
};

export default WebsiteGrid;
