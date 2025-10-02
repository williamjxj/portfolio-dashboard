'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Website } from '@/models/Website';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface WebsiteDetailProps {
  website: Website;
  className?: string;
}

export const WebsiteDetail: React.FC<WebsiteDetailProps> = ({ website, className = '' }) => {
  const screenshotUrl = website.screenshotUrl || website.screenshot;
  const logoUrl = website.logoUrl || website.logo;
  const faviconUrl = website.faviconUrl || website.favicon;
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      {/* Hero Section */}
      <div className="relative h-64 bg-muted">
        <Image
          src={screenshotUrl || '/placeholder-screenshot.png'}
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
              src={logoUrl || '/placeholder-logo.png'}
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
      <CardContent className="p-6">
        {/* Description */}
        <div className="mb-6">
          <CardTitle className="text-xl mb-3">About</CardTitle>
          <p className="text-muted-foreground leading-relaxed">{website.description}</p>
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

        {/* Assets & Upload */}
        <div className="mb-6">
          <Tabs defaultValue="assets">
            <div className="flex items-center justify-between mb-3">
              <CardTitle className="text-lg">Assets</CardTitle>
              <TabsList>
                <TabsTrigger value="assets">View</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="assets">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground">
                  Internal use only. Logos, favicons, and previews are licensed for internal dashboard usage.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      await fetch(`/api/assets/${website.id}`, { method: 'PUT' });
                    } catch (e) {
                      console.error('Failed to refresh assets', e);
                    }
                  }}
                >
                  Refresh Assets
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Screenshot */}
            <Dialog>
              <DialogTrigger asChild>
                <div className="text-center cursor-pointer">
                  <div className="relative h-32 bg-muted rounded-lg overflow-hidden mb-2">
                    <Image
                      src={screenshotUrl || '/placeholder-screenshot.png'}
                      alt={`${website.name} screenshot`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Screenshot</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{website.name} Screenshot</DialogTitle>
                </DialogHeader>
                <Image
                  src={screenshotUrl || '/placeholder-screenshot.png'}
                  alt={`${website.name} screenshot`}
                  width={800}
                  height={600}
                  className="object-contain"
                />
              </DialogContent>
            </Dialog>

            {/* Logo */}
            <Dialog>
              <DialogTrigger asChild>
                <div className="text-center cursor-pointer">
                  <div className="relative h-32 bg-muted rounded-lg overflow-hidden mb-2 flex items-center justify-center">
                    <Image
                      src={logoUrl || '/placeholder-logo.png'}
                      alt={`${website.name} logo`}
                      width={64}
                      height={64}
                      className="object-contain"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Logo</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{website.name} Logo</DialogTitle>
                </DialogHeader>
                <Image
                  src={logoUrl || '/placeholder-logo.png'}
                  alt={`${website.name} logo`}
                  width={400}
                  height={400}
                  className="object-contain"
                />
              </DialogContent>
            </Dialog>

            {/* Favicon */}
            <Dialog>
              <DialogTrigger asChild>
                <div className="text-center cursor-pointer">
                  <div className="relative h-32 bg-muted rounded-lg overflow-hidden mb-2 flex items-center justify-center">
                    <Image
                      src={faviconUrl || '/placeholder-favicon.png'}
                      alt={`${website.name} favicon`}
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Favicon</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{website.name} Favicon</DialogTitle>
                </DialogHeader>
                <Image
                  src={faviconUrl || '/placeholder-favicon.png'}
                  alt={`${website.name} favicon`}
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </DialogContent>
            </Dialog>
              </div>
            </TabsContent>

          </Tabs>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="flex-1">
            <Link
              href={website.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Website
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="flex-1"
          >
            Go Back
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebsiteDetail;
