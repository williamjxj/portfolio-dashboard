'use client';

import React, { useState, useEffect } from 'react';
import { Website } from '@/models/Website';
import { WebsiteGrid } from '@/components/WebsiteGrid';
import { Layout } from '@/components/Layout';

export default function HomePage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/websites');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setWebsites(data);
      } catch (err) {
        console.error('Error fetching websites:', err);
        setError(err instanceof Error ? err.message : 'Failed to load websites');
      } finally {
        setLoading(false);
      }
    };

    fetchWebsites();
  }, []);

  return (
    <Layout 
      title="Website Dashboard" 
      description="A modern dashboard for managing and viewing websites"
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Website Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover and explore a curated collection of websites with detailed information, 
            screenshots, and insights.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {websites.length}
            </div>
            <div className="text-gray-600">Total Websites</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {websites.filter(w => w.state === 'completed').length}
            </div>
            <div className="text-gray-600">Completed</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {websites.filter(w => w.requiresAuth).length}
            </div>
            <div className="text-gray-600">Require Auth</div>
          </div>
        </div>

        {/* Website Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Websites</h2>
          <WebsiteGrid 
            websites={websites}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </Layout>
  );
}