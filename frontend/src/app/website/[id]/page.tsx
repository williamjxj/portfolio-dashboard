'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Website } from '@/models/Website';
import { WebsiteDetail } from '@/components/WebsiteDetail';
import { Layout } from '@/components/Layout';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function WebsiteDetailPage() {
  const params = useParams();
  const [website, setWebsite] = useState<Website | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWebsite = async () => {
      if (!params.id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/websites/${params.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Website not found');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setWebsite(data);
      } catch (err) {
        console.error('Error fetching website:', err);
        setError(err instanceof Error ? err.message : 'Failed to load website');
      } finally {
        setLoading(false);
      }
    };

    fetchWebsite();
  }, [params.id]);

  if (loading) {
    return (
      <Layout title="Loading..." description="Loading website details">
        <div className="flex items-center justify-center min-h-64">
          <LoadingSpinner size="lg" text="Loading website details..." />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Error" description="Error loading website">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.history.back()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Go Back
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!website) {
    return (
      <Layout title="Not Found" description="Website not found">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Website Not Found</h1>
            <p className="text-gray-600 mb-6">The website you're looking for doesn't exist.</p>
            <button 
              onClick={() => window.history.back()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Go Back
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title={`${website.name} - Website Dashboard`}
      description={website.description}
    >
      <WebsiteDetail website={website} />
    </Layout>
  );
}
