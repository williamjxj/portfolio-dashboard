'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HeroSection } from '@/components/tech-stack/HeroSection';
import { ProjectCard } from '@/components/tech-stack/ProjectCard';
import { VideoPlayer } from '@/components/tech-stack/VideoPlayer';
import { ImageGallery } from '@/components/tech-stack/ImageGallery';
import { LoadingSkeleton, HeroSkeleton } from '@/components/tech-stack/LoadingSkeleton';
import { Website } from '@/models/Website';
import { TechStackSummary } from '@/models/TechStack';
import { Search, Filter, Grid, List, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TechStackPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [summary, setSummary] = useState<TechStackSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Enhanced state for new features
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string } | null>(null);
  const [selectedGallery, setSelectedGallery] = useState<{ images: string[]; title: string } | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'status'>('name');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch websites with tech stack data
        const websitesResponse = await fetch('/api/websites');
        if (!websitesResponse.ok) {
          throw new Error(`Failed to fetch websites: ${websitesResponse.status}`);
        }
        const websitesData = await websitesResponse.json();
        // Handle the API response structure
        if (websitesData.websites && Array.isArray(websitesData.websites)) {
          setWebsites(websitesData.websites);
        } else if (Array.isArray(websitesData)) {
          setWebsites(websitesData);
        } else {
          console.error('Invalid websites data structure received:', websitesData);
          setError('Invalid data format received from server');
        }

        // Fetch tech stack summary (optional - don't fail if this fails)
        try {
          const summaryResponse = await fetch('/api/tech-stack');
          if (summaryResponse.ok) {
            const summaryData = await summaryResponse.json();
            setSummary(summaryData);
          } else {
            console.warn('Tech stack summary API failed, continuing without summary');
            setSummary(null);
          }
        } catch (summaryError) {
          console.warn('Tech stack summary API error, continuing without summary:', summaryError);
          setSummary(null);
        }

      } catch (err) {
        console.error('Error fetching tech stack data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load tech stack data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort websites
  const filteredWebsites = (Array.isArray(websites) ? websites : [])
    .filter(website => {
      const matchesSearch = website.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           website.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (website.techStack?.frontend?.some(tech => 
                             tech.toLowerCase().includes(searchTerm.toLowerCase())
                           )) ||
                           (website.techStack?.backend?.some(tech => 
                             tech.toLowerCase().includes(searchTerm.toLowerCase())
                           ));
      
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'active' && (website.status === 'ok')) ||
                           (filterStatus === 'completed' && website.state === 'completed') ||
                           (filterStatus === 'auth' && website.requiresAuth);
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        case 'status':
          const statusOrder = { 'ok': 0, 'unavailable': 1, 'missing-assets': 2 };
          return (statusOrder[a.status as keyof typeof statusOrder] || 3) - 
                 (statusOrder[b.status as keyof typeof statusOrder] || 3);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <HeroSkeleton />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSkeleton count={6} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-red-600 dark:text-red-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Error Loading Tech Stack
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Enhanced Hero Section */}
      {summary && (
        <HeroSection 
          totalProjects={summary.totalWebsites}
          totalTechnologies={summary.totalTechnologies}
          totalCategories={summary.categories?.length || 0}
          activeProjects={summary.statistics?.activeProjects || 0}
          completedProjects={summary.statistics?.completedProjects || 0}
          averageLoadTime={summary.statistics?.averageLoadTime || 0}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Search and Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search projects, technologies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              {/* Advanced Filters Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
                {showFilters && <X className="w-4 h-4" />}
              </Button>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-sm"
                >
                  <option value="all">All Projects</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="auth">Requires Auth</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'status')}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-sm"
                >
                  <option value="name">Sort by Name</option>
                  <option value="date">Sort by Date</option>
                  <option value="status">Sort by Status</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredWebsites.length} of {websites.length} projects
            {searchTerm && ` for "${searchTerm}"`}
          </div>
        </motion.div>

        {/* Enhanced Project Grid */}
        {filteredWebsites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No projects found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Try adjusting your search criteria or filters.
            </p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 lg:grid-cols-2' 
                : 'grid-cols-1'
            }`}
          >
            {filteredWebsites.map((website, index) => (
              <ProjectCard 
                key={website.id} 
                website={website} 
                index={index}
                onVideoClick={(videoUrl, title) => setSelectedVideo({ url: videoUrl, title })}
                onGalleryClick={(images, title) => setSelectedGallery({ images, title })}
                onWebsiteClick={(url) => window.open(url, '_blank')}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayer
          videoUrl={selectedVideo.url}
          title={selectedVideo.title}
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          autoplay={true}
        />
      )}

      {/* Image Gallery Modal */}
      {selectedGallery && (
        <ImageGallery
          images={selectedGallery.images}
          projectName={selectedGallery.title}
          isOpen={!!selectedGallery}
          onClose={() => setSelectedGallery(null)}
        />
      )}
    </div>
  );
}

