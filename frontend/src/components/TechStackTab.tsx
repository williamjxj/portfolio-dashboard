'use client';

import React, { useState } from 'react';
import { Website } from '@/models/Website';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ExternalLink, 
  Code, 
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface TechStackTabProps {
  websites: Website[];
}

interface TechStackCardProps {
  website: Website;
  loading?: boolean;
}

/**
 * Tech stack card component for individual website with visual gallery
 */
function TechStackCard({ website, loading = false }: TechStackCardProps) {
  // Map website IDs to their corresponding site folder names
  const getSiteFolderName = (websiteId: string): string => {
    const siteMapping: { [key: string]: string } = {
      'face-fusion-agent-1': 'face-fusion-agent',
      'nextjs-supabase-kappa-nine-2': 'nextjs-supabase-kappa-nine',
      'manus-ai-shop-3': 'manus-ai-shop',
      'bidmaster-hub-4': 'bidmaster-hub',
      'nextjs-mcp-template-5': 'nextjs-mcp-template',
      'friendshipdaycare-6': 'friendshipdaycare',
      'bestitconsulting-7': 'bestitconsulting',
      'bestitconsultants-8': 'bestitconsultants'
    };
    return siteMapping[websiteId] || websiteId;
  };

  // Get available images for the website
  const getSiteImages = (websiteId: string): string[] => {
    const siteFolder = getSiteFolderName(websiteId);
    // This will be populated with actual image paths from the sites folder
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp'];
    const imageFiles: string[] = [];
    
    // Common image patterns in the sites folder
    const commonPatterns = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    const prefixPatterns = ['f', 'm', 'n', 'b'];
    
    // Generate potential image paths
    commonPatterns.forEach(num => {
      imageExtensions.forEach(ext => {
        imageFiles.push(`/sites/${siteFolder}/${num}${ext}`);
      });
    });
    
    prefixPatterns.forEach(prefix => {
      commonPatterns.forEach(num => {
        imageExtensions.forEach(ext => {
          imageFiles.push(`/sites/${siteFolder}/${prefix}${num}${ext}`);
        });
      });
    });
    
    return imageFiles;
  };

  if (loading) {
    return (
      <Card className="border-dashed border-gray-300 dark:border-gray-600">
        <CardHeader>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const siteImages = getSiteImages(website.id);

  return (
    <Card className="hover:shadow-lg transition-shadow overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {website.name}
              <a 
                href={website.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </CardTitle>
            <CardDescription className="mt-1">
              {website.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Visual Gallery */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Project Gallery
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {siteImages.slice(0, 6).map((imagePath, index) => (
                <div key={index} className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden group">
                  <Image
                    src={imagePath}
                    alt={`${website.name} screenshot ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      // Hide image if it doesn't exist
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
            
            {siteImages.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No images available</p>
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              {website.state || 'Active'}
            </Badge>
            {website.requiresAuth && (
              <Badge variant="secondary" className="text-xs">
                Requires Auth
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {new Date(website.lastUpdated).toLocaleDateString()}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Main tech stack tab component - Visual Project Gallery
 * 
 * Features:
 * - Visual gallery of project images from /sites/ folder
 * - Search functionality
 * - Simple project information display
 * - Responsive grid layout
 * 
 * @param websites - Array of website objects
 */
export function TechStackTab({ websites }: TechStackTabProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter websites based on search term
  const filteredWebsites = websites.filter(website => {
    const matchesSearch = website.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         website.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Calculate summary statistics
  const totalApplications = websites.length;
  const completedApplications = websites.filter(w => w.state === 'completed').length;
  const activeApplications = websites.filter(w => w.state === 'active' || !w.state).length;

  return (
    <div className="space-y-6">
      {/* Application Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {totalApplications}
            </div>
            <div className="text-gray-600">Total Projects</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {completedApplications}
            </div>
            <div className="text-gray-600">Completed</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {activeApplications}
            </div>
            <div className="text-gray-600">Active</div>
          </CardContent>
        </Card>
      </div>

      {/* Search Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredWebsites.length} of {websites.length} projects
      </div>

      {/* Project Gallery Cards */}
      {filteredWebsites.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No projects found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredWebsites.map((website) => (
            <TechStackCard key={website.id} website={website} />
          ))}
        </div>
      )}
    </div>
  );
}
