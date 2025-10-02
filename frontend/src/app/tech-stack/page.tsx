'use client';

import React, { useState, useEffect } from 'react';
import { TechStackTab } from '@/components/TechStackTab';
import { Website } from '@/models/Website';
import { TechStackSummary } from '@/models/TechStack';

export default function TechStackPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [summary, setSummary] = useState<TechStackSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setWebsites(websitesData);

        // Fetch tech stack summary
        const summaryResponse = await fetch('/api/tech-stack');
        if (!summaryResponse.ok) {
          throw new Error(`Failed to fetch tech stack summary: ${summaryResponse.status}`);
        }
        const summaryData = await summaryResponse.json();
        setSummary(summaryData);

      } catch (err) {
        console.error('Error fetching tech stack data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load tech stack data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Tech Stack Overview
          </h1>
          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {summary.totalWebsites}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Websites</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {summary.totalTechnologies}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Technologies</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {summary.categories.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
              </div>
            </div>
          )}
        </div>

        {/* Tech Stack Content */}
        <TechStackTab websites={websites} />
      </div>
    </div>
  );
}

