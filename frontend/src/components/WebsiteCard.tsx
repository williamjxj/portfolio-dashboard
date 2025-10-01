'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Website } from '@/models/Website';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DemoVideo } from './DemoVideo';
import { ExternalLink, Github, Database, Zap, Star } from 'lucide-react';

interface WebsiteCardProps {
  website: Website;
  className?: string;
}

export const WebsiteCard: React.FC<WebsiteCardProps> = ({ website, className = '' }) => {
  const [showDemo, setShowDemo] = useState(false);
  const screenshotUrl = website.screenshotUrl || website.screenshot;
  const logoUrl = website.logoUrl || website.logo;
  const faviconUrl = website.faviconUrl || website.favicon;
  const demoVideo = website.demoVideo;
  
  return (
    <Card 
      className={`hover:shadow-lg hover:scale-105 transition-all duration-300 group ${className}`}
      data-testid="website-card"
    >
      {/* Screenshot or Demo Video */}
      <div className="relative h-48 bg-muted overflow-hidden">
        {showDemo && demoVideo ? (
          <DemoVideo
            src={demoVideo}
            poster={screenshotUrl}
            alt={`${website.name} demo`}
            className="w-full h-full"
          />
        ) : (
          <Image
            src={screenshotUrl || '/placeholder-screenshot.png'}
            alt={`${website.name} screenshot`}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            data-testid="website-screenshot"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
        
        {/* Favicon overlay */}
        <div className="absolute top-2 left-2">
          <Image
            src={faviconUrl || '/placeholder-favicon.png'}
            alt={`${website.name} favicon`}
            width={24}
            height={24}
            className="rounded"
            data-testid="website-favicon"
          />
        </div>

        {/* Demo Video Toggle */}
        {demoVideo && (
          <div className="absolute top-2 right-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowDemo(!showDemo)}
              className="bg-white bg-opacity-90 hover:bg-opacity-100"
            >
              {showDemo ? '📷' : '🎥'}
            </Button>
          </div>
        )}

        {/* Authentication indicator */}
        {website.requiresAuth && (
          <div className="absolute top-2 right-2">
            <Badge 
              variant="secondary"
              data-testid="auth-indicator"
            >
              🔒 Auth Required
            </Badge>
          </div>
        )}

        {/* Error indicators */}
        {website.authError && (
          <div className="absolute bottom-2 right-2">
            <Badge 
              variant="destructive"
              data-testid="auth-error"
            >
              ❌ Auth Failed
            </Badge>
          </div>
        )}

        {website.assetError && (
          <div className="absolute bottom-2 left-2">
            <Badge 
              variant="destructive"
              data-testid="asset-error"
            >
              ❌ Asset Error
            </Badge>
          </div>
        )}

        {website.needsManualAuth && (
          <div className="absolute bottom-2 left-2">
            <Badge 
              variant="outline"
              data-testid="manual-auth-prompt"
            >
              🔑 Manual Auth
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-4">
        {/* Logo and Title */}
        <div className="flex items-center gap-3 mb-3">
          <Image
            src={logoUrl || '/placeholder-logo.png'}
            alt={`${website.name} logo`}
            width={32}
            height={32}
            className="rounded"
            data-testid="website-logo"
          />
          <CardTitle className="text-lg truncate">
            {website.name}
          </CardTitle>
        </div>

        {/* Description */}
        <p 
          className="text-muted-foreground text-sm mb-3 line-clamp-3"
          data-testid="website-description"
        >
          {website.description}
        </p>

        {/* Tech Stack Badges */}
        {website.techStack && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {website.techStack.frontend.slice(0, 2).map((tech, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {website.techStack.aiTools.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  <Zap className="w-3 h-3 mr-1" />
                  AI
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button asChild variant="default" size="sm" className="flex-1">
            <Link
              href={website.url}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="website-link"
              aria-label={`Visit ${website.name} (opens in new tab)`}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Visit
            </Link>
          </Button>
          
          {website.deploymentInfo?.githubRepo && (
            <Button asChild variant="outline" size="sm">
              <Link
                href={website.deploymentInfo.githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${website.name} source code`}
              >
                <Github className="w-4 h-4" />
              </Link>
            </Button>
          )}
        </div>

        {/* Last Updated */}
        <div className="mt-3 text-xs text-muted-foreground">
          Last updated: {new Date(website.lastUpdated).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default WebsiteCard;
