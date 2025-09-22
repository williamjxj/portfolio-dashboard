'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Website } from '@/models/Website';

interface WebsiteDetailProps {
  website: Website;
  className?: string;
}

export const WebsiteDetail: React.FC<WebsiteDetailProps> = ({ website, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Hero Section */}
      <div className="relative h-64 bg-gray-100">
        <Image
          src={website.screenshot}
          alt={`${website.name} screenshot`}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 60vw"
        />
        
        {/* Overlay with logo and title */}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white">
            <Image
              src={website.logo}
              alt={`${website.name} logo`}
              width={80}
              height={80}
              className="mx-auto mb-4 rounded-lg"
            />
            <h1 className="text-3xl font-bold mb-2">{website.name}</h1>
            <p className="text-lg opacity-90">{website.url}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Description */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">About</h2>
          <p className="text-gray-700 leading-relaxed">{website.description}</p>
        </div>

        {/* Website Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Website Information</h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">URL</dt>
                <dd className="text-sm text-gray-900 break-all">
                  <Link 
                    href={website.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {website.url}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(website.lastUpdated).toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    website.state === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : website.state === 'failed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {website.state || 'pending'}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          {/* Authentication Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Authentication</h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Required</dt>
                <dd className="text-sm text-gray-900">
                  {website.requiresAuth ? 'Yes' : 'No'}
                </dd>
              </div>
              {website.requiresAuth && website.authCredentials && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Method</dt>
                  <dd className="text-sm text-gray-900 capitalize">
                    {website.authCredentials.method}
                  </dd>
                </div>
              )}
              {website.authError && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Error</dt>
                  <dd className="text-sm text-red-600">{website.authError}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Assets */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Assets</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Screenshot */}
            <div className="text-center">
              <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden mb-2">
                <Image
                  src={website.screenshot}
                  alt={`${website.name} screenshot`}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-sm text-gray-600">Screenshot</p>
            </div>

            {/* Logo */}
            <div className="text-center">
              <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden mb-2 flex items-center justify-center">
                <Image
                  src={website.logo}
                  alt={`${website.name} logo`}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <p className="text-sm text-gray-600">Logo</p>
            </div>

            {/* Favicon */}
            <div className="text-center">
              <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden mb-2 flex items-center justify-center">
                <Image
                  src={website.favicon}
                  alt={`${website.name} favicon`}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <p className="text-sm text-gray-600">Favicon</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href={website.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-center font-medium"
          >
            Visit Website
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebsiteDetail;
