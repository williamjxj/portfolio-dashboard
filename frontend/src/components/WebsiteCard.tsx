'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Website } from '@/models/Website';

interface WebsiteCardProps {
  website: Website;
  className?: string;
}

export const WebsiteCard: React.FC<WebsiteCardProps> = ({ website, className = '' }) => {
  return (
    <article 
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden ${className}`}
      data-testid="website-card"
      role="article"
      aria-labelledby={`website-title-${website.id}`}
    >
      {/* Screenshot */}
      <div className="relative h-48 bg-gray-100">
        <Image
          src={website.screenshot}
          alt={`${website.name} screenshot`}
          fill
          className="object-cover"
          data-testid="website-screenshot"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
        {/* Favicon overlay */}
        <div className="absolute top-2 left-2">
          <Image
            src={website.favicon}
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
            <span 
              className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full"
              data-testid="auth-indicator"
              aria-label="Authentication required"
            >
              🔒 Auth Required
            </span>
          </div>
        )}

        {/* Error indicators */}
        {website.authError && (
          <div className="absolute bottom-2 right-2">
            <span 
              className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full"
              data-testid="auth-error"
              aria-label="Authentication failed"
            >
              ❌ Auth Failed
            </span>
          </div>
        )}

        {website.assetError && (
          <div className="absolute bottom-2 left-2">
            <span 
              className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full"
              data-testid="asset-error"
              aria-label="Asset generation failed"
            >
              ❌ Asset Error
            </span>
          </div>
        )}

        {website.needsManualAuth && (
          <div className="absolute bottom-2 left-2">
            <span 
              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              data-testid="manual-auth-prompt"
              aria-label="Manual authentication required"
            >
              🔑 Manual Auth
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Logo and Title */}
        <div className="flex items-center gap-3 mb-3">
          <Image
            src={website.logo}
            alt={`${website.name} logo`}
            width={32}
            height={32}
            className="rounded"
            data-testid="website-logo"
          />
          <h3 
            id={`website-title-${website.id}`}
            className="text-lg font-semibold text-gray-900 truncate"
          >
            {website.name}
          </h3>
        </div>

        {/* Description */}
        <p 
          className="text-gray-600 text-sm mb-4 line-clamp-3"
          data-testid="website-description"
        >
          {website.description}
        </p>

        {/* Website Link */}
        <Link
          href={website.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200"
          data-testid="website-link"
          aria-label={`Visit ${website.name} (opens in new tab)`}
        >
          <span>Visit Website</span>
          <svg 
            className="w-4 h-4" 
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

        {/* Last Updated */}
        <div className="mt-3 text-xs text-gray-500">
          Last updated: {new Date(website.lastUpdated).toLocaleDateString()}
        </div>
      </div>
    </article>
  );
};

export default WebsiteCard;
