'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Website } from '@/models/Website';
import { ProjectCardState } from '@/models/ProjectCardState';
import { ImageCarousel } from './ImageCarousel';
import { 
  ExternalLink, 
  Play, 
  Image as ImageIcon, 
  Code, 
  Globe, 
  Clock,
  CheckCircle,
  AlertCircle,
  Lock,
  ChevronRight,
  Star
} from 'lucide-react';

interface ProjectCardProps {
  website: Website;
  index: number;
  onVideoClick?: (videoUrl: string, title: string) => void;
  onGalleryClick?: (images: string[], title: string) => void;
  onWebsiteClick?: (url: string) => void;
}

export function ProjectCard({ 
  website, 
  index, 
  onVideoClick, 
  onGalleryClick, 
  onWebsiteClick 
}: ProjectCardProps) {
  const [cardState, setCardState] = useState<ProjectCardState>({
    id: `card-${website.id}`,
    websiteId: website.id,
    isExpanded: false,
    isHovered: false,
    isSelected: false,
    currentImageIndex: 0,
    isVideoPlaying: false,
    isGalleryOpen: false,
    animationPhase: 'entering',
    staggerDelay: index * 0.1,
  });

  const handleHover = (isHovered: boolean) => {
    setCardState(prev => ({ ...prev, isHovered }));
  };

  const handleVideoClick = () => {
    if (website.demoVideo && onVideoClick) {
      onVideoClick(website.demoVideo, website.name);
    }
  };

  const handleGalleryClick = () => {
    if (website.assets?.screenshots && onGalleryClick) {
      onGalleryClick(website.assets.screenshots, website.name);
    }
  };

  const handleWebsiteClick = () => {
    if (onWebsiteClick) {
      onWebsiteClick(website.url);
    }
  };

  // Helper function to get correct image paths
  const getImagePaths = (website: Website): string[] => {
    // Map website IDs to actual folder names and their specific images
    const imageMap: { [key: string]: string[] } = {
      'face-fusion-agent-1': [
        '/sites/face-fusion-agent/1.jpg',
        '/sites/face-fusion-agent/2.jpg',
        '/sites/face-fusion-agent/3.jpg',
        '/sites/face-fusion-agent/4.jpg',
        '/sites/face-fusion-agent/5.jpg',
        '/sites/face-fusion-agent/6.jpg',
        '/sites/face-fusion-agent/f1.png',
        '/sites/face-fusion-agent/f2.png',
        '/sites/face-fusion-agent/f3.png',
        '/sites/face-fusion-agent/f4.png',
        '/sites/face-fusion-agent/f5.png',
        '/sites/face-fusion-agent/f6.png'
      ],
      'nextjs-supabase-kappa-nine-2': [
        '/sites/nextjs-supabase-kappa-nine/1.jpg',
        '/sites/nextjs-supabase-kappa-nine/2.jpg',
        '/sites/nextjs-supabase-kappa-nine/3.jpg',
        '/sites/nextjs-supabase-kappa-nine/4.png',
        '/sites/nextjs-supabase-kappa-nine/n1.png',
        '/sites/nextjs-supabase-kappa-nine/n2.png',
        '/sites/nextjs-supabase-kappa-nine/n3.png',
        '/sites/nextjs-supabase-kappa-nine/n4.png',
        '/sites/nextjs-supabase-kappa-nine/n5.png',
        '/sites/nextjs-supabase-kappa-nine/n6.png',
        '/sites/nextjs-supabase-kappa-nine/n7.png',
        '/sites/nextjs-supabase-kappa-nine/n8.png'
      ],
      'manus-ai-shop-3': [
        '/sites/manus-ai-shop/1.png',
        '/sites/manus-ai-shop/m1.png',
        '/sites/manus-ai-shop/m2.png',
        '/sites/manus-ai-shop/m3.png',
        '/sites/manus-ai-shop/m4.png',
        '/sites/manus-ai-shop/m5.png',
        '/sites/manus-ai-shop/m6.png',
        '/sites/manus-ai-shop/m7.png'
      ],
      'bidmaster-hub-4': [
        '/sites/bidmaster-hub/b1.png',
        '/sites/bidmaster-hub/b2.png'
      ],
      'nextjs-mcp-template-5': [
        '/sites/nextjs-mcp-template/1.png',
        '/sites/nextjs-mcp-template/signin.png'
      ],
      'friendshipdaycare-6': [
        '/sites/friendshipdaycare/f1.png',
        '/sites/friendshipdaycare/f10.png'
      ],
      'bestitconsulting-7': [
        '/sites/bestitconsulting/1.png'
      ],
      'bestitconsultants-8': [
        '/sites/bestitconsultants/2.png'
      ]
    };

    return imageMap[website.id] || [];
  };

  const getLogoPath = (website: Website): string => {
    // Map website IDs to actual folder names
    const folderMap: { [key: string]: string } = {
      'face-fusion-agent-1': 'face-fusion-agent',
      'nextjs-supabase-kappa-nine-2': 'nextjs-supabase-kappa-nine',
      'manus-ai-shop-3': 'manus-ai-shop',
      'bidmaster-hub-4': 'bidmaster-hub',
      'nextjs-mcp-template-5': 'nextjs-mcp-template',
      'friendshipdaycare-6': 'friendshipdaycare',
      'bestitconsulting-7': 'bestitconsulting',
      'bestitconsultants-8': 'bestitconsultants'
    };
    
    const folderName = folderMap[website.id] || website.id;
    return `/sites/${folderName}/logo.png`;
  };

  const getStatusIcon = () => {
    if (website.requiresAuth) {
      return <Lock className="w-4 h-4 text-amber-500" />;
    }
    if (website.status === 'ok') {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    return <AlertCircle className="w-4 h-4 text-red-500" />;
  };

  const getStatusText = () => {
    if (website.requiresAuth) return 'Requires Auth';
    if (website.status === 'ok') return 'Active';
    return 'Unavailable';
  };

  const getStatusColor = () => {
    if (website.requiresAuth) return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400';
    if (website.status === 'ok') return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: cardState.staggerDelay,
        ease: "easeOut"
      }}
      whileHover={{ y: -8 }}
      onHoverStart={() => handleHover(true)}
      onHoverEnd={() => handleHover(false)}
      className="group"
    >
      <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        {/* Header with logo and status */}
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                <Image
                  src={getLogoPath(website)}
                  alt={`${website.name} logo`}
                  fill
                  className="object-cover"
                  sizes="48px"
                  onError={(e) => {
                    // Fallback to gradient if logo fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                          </svg>
                        </div>
                      `;
                    }
                  }}
                />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {website.name}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon()}
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor()}`}>
                    {getStatusText()}
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleWebsiteClick}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
          
          <CardDescription className="text-gray-600 dark:text-gray-300 line-clamp-2">
            {website.description}
          </CardDescription>
        </CardHeader>

        {/* Main content */}
        <CardContent className="pt-0">
          {/* Image Carousel */}
          <div className="mb-4">
            <ImageCarousel 
              images={getImagePaths(website)}
              title={website.name}
              className="w-full"
            />
          </div>

          {/* Tech stack badges */}
          {website.techStack && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {website.techStack.frontend?.slice(0, 3).map((tech, techIndex) => (
                  <Badge
                    key={techIndex}
                    variant="secondary"
                    className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                  >
                    {tech}
                  </Badge>
                ))}
                {website.techStack.backend?.slice(0, 2).map((tech, techIndex) => (
                  <Badge
                    key={`backend-${techIndex}`}
                    variant="secondary"
                    className="text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  >
                    {tech}
                  </Badge>
                ))}
                {website.techStack.deployment?.slice(0, 1).map((tech, techIndex) => (
                  <Badge
                    key={`deployment-${techIndex}`}
                    variant="secondary"
                    className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Performance metrics */}
          {website.performance && (
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
              {website.performance.loadTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{website.performance.loadTime}ms</span>
                </div>
              )}
              {website.performance.imageCount > 0 && (
                <div className="flex items-center gap-1">
                  <ImageIcon className="w-4 h-4" />
                  <span>{website.performance.imageCount} images</span>
                </div>
              )}
            </div>
          )}

          {/* Footer with actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {website.deploymentInfo?.status || 'Unknown'}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleWebsiteClick}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Visit Site
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}