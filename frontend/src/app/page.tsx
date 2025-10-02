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
      title="William Jiang's AI Products Dashboard" 
      description="A comprehensive dashboard showcasing AI-powered applications and products"
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            William Jiang's AI Products Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover and explore a curated collection of AI-powered applications with detailed information, 
            screenshots, and insights.
          </p>
        </div>

        {/* Website Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Applications</h2>
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