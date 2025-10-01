'use client';

import React from 'react';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AboutPage() {
  return (
    <Layout 
      title="About - Website Dashboard" 
      description="Learn about the Website Dashboard project and its features"
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About Website Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A modern, comprehensive dashboard for managing and exploring a curated collection of websites with detailed insights and analytics.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-semibold mb-2">Website Collection</h3>
              <p className="text-gray-600">
                Curated collection of 8 diverse websites showcasing modern web development, AI applications, and business solutions.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Analytics & Insights</h3>
              <p className="text-gray-600">
                Comprehensive analytics including completion status, authentication requirements, and detailed website metadata.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2">Modern Design</h3>
              <p className="text-gray-600">
                Beautiful, responsive design built with Next.js, Tailwind CSS, and modern UI components for optimal user experience.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Search & Filter</h3>
              <p className="text-gray-600">
                Powerful search functionality to quickly find websites by name, description, or other criteria.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">Responsive</h3>
              <p className="text-gray-600">
                Fully responsive design that works perfectly on desktop, tablet, and mobile devices.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Fast & Optimized</h3>
              <p className="text-gray-600">
                Optimized for performance with static asset generation, caching, and efficient data loading.
              </p>
            </div>
          </Card>
        </div>

        {/* Website Collection Details */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Website Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Featured Websites</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Face Fusion Agent</span>
                  <Badge variant="secondary">AI/ML</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">NextJS Supabase Kappa Nine</span>
                  <Badge variant="secondary">Full-Stack</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Manus AI Shop</span>
                  <Badge variant="secondary">E-commerce</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Bidmaster Hub</span>
                  <Badge variant="secondary">B2B Platform</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">NextJS MCP Template</span>
                  <Badge variant="secondary">Template</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Friendship Daycare</span>
                  <Badge variant="secondary">Management</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Best IT Consulting</span>
                  <Badge variant="secondary">Consulting</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Best IT Consultants</span>
                  <Badge variant="secondary">Consulting</Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Technology Stack</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Frontend Framework</span>
                  <Badge variant="outline">Next.js 15</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Styling</span>
                  <Badge variant="outline">Tailwind CSS</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">UI Components</span>
                  <Badge variant="outline">shadcn/ui</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Language</span>
                  <Badge variant="outline">TypeScript</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Asset Generation</span>
                  <Badge variant="outline">Playwright</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Deployment</span>
                  <Badge variant="outline">Vercel</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">8</div>
            <div className="text-gray-600">Total Websites</div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">8</div>
            <div className="text-gray-600">Completed</div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
            <div className="text-gray-600">Require Auth</div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">100%</div>
            <div className="text-gray-600">Success Rate</div>
          </Card>
        </div>

        {/* Project Information */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">Development</h3>
              <p className="text-gray-600 mb-4">
                This dashboard was built as a comprehensive showcase of modern web development practices, 
                featuring a curated collection of diverse websites with detailed analytics and insights.
              </p>
              <p className="text-gray-600">
                The project demonstrates full-stack development capabilities, asset optimization, 
                and modern UI/UX design principles.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Features</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Real-time website monitoring</li>
                <li>• Automated screenshot generation</li>
                <li>• Logo and favicon extraction</li>
                <li>• Responsive design system</li>
                <li>• Search and filtering capabilities</li>
                <li>• Performance optimization</li>
                <li>• Modern UI components</li>
                <li>• TypeScript integration</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

