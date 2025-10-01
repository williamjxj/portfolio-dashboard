'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Website } from '@/models/Website';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface WebsiteCardProps {
  website: Website;
  className?: string;
}

export const WebsiteCard: React.FC<WebsiteCardProps> = ({ website, className = '' }) => {
  const screenshotUrl = website.screenshotUrl || website.screenshot;
  const logoUrl = website.logoUrl || website.logo;
  const faviconUrl = website.faviconUrl || website.favicon;
  
  return (
    <Card 
      className={`hover:shadow-lg transition-shadow duration-300 ${className}`}
      data-testid="website-card"
    >
      {/* Screenshot */}
      <div className="relative h-48 bg-muted">
        <Image
          src={screenshotUrl || '/placeholder-screenshot.png'}
          alt={`${website.name} screenshot`}
          fill
          className="object-cover"
          data-testid="website-screenshot"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
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
          className="text-muted-foreground text-sm mb-4 line-clamp-3"
          data-testid="website-description"
        >
          {website.description}
        </p>

        {/* Website Link */}
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link
            href={website.url}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="website-link"
            aria-label={`Visit ${website.name} (opens in new tab)`}
          >
            <span>Visit Website</span>
            <svg 
              className="w-4 h-4 ml-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
              />
            </svg>
          </Link>
        </Button>

        {/* Last Updated */}
        <div className="mt-3 text-xs text-muted-foreground">
          Last updated: {new Date(website.lastUpdated).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default WebsiteCard;
