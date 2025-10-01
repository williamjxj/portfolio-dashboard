'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Users, 
  Zap, 
  Star, 
  ArrowUpRight,
  Activity,
  Globe,
  Code
} from 'lucide-react';

interface InteractiveFeaturesProps {
  websites: any[];
  className?: string;
}

export const InteractiveFeatures: React.FC<InteractiveFeaturesProps> = ({ 
  websites, 
  className = '' 
}) => {
  const [stats, setStats] = useState({
    totalViews: 0,
    activeUsers: 0,
    aiFeatures: 0,
    deployments: 0
  });

  useEffect(() => {
    // Simulate real-time stats updates
    const interval = setInterval(() => {
      setStats(prev => ({
        totalViews: prev.totalViews + Math.floor(Math.random() * 10),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3),
        aiFeatures: prev.aiFeatures + Math.floor(Math.random() * 2),
        deployments: prev.deployments + Math.floor(Math.random() * 1)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getRandomWebsite = () => {
    return websites[Math.floor(Math.random() * websites.length)];
  };

  const [featuredWebsite, setFeaturedWebsite] = useState(getRandomWebsite());

  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedWebsite(getRandomWebsite());
    }, 5000);

    return () => clearInterval(interval);
  }, [websites]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Live Stats */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Live Dashboard Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 animate-pulse">
                {stats.totalViews.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 animate-pulse">
                {stats.activeUsers.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 animate-pulse">
                {stats.aiFeatures.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">AI Features</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 animate-pulse">
                {stats.deployments.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Deployments</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Application */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Featured Application
          </CardTitle>
        </CardHeader>
        <CardContent>
          {featuredWebsite && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{featuredWebsite.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {featuredWebsite.description}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {featuredWebsite.techStack?.frontend.slice(0, 2).map((tech: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {featuredWebsite.techStack?.aiTools.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        <Zap className="w-3 h-3 mr-1" />
                        AI Powered
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button asChild variant="outline" size="sm">
                <a href={featuredWebsite.url} target="_blank" rel="noopener noreferrer">
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Visit
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tech Stack Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Technology Stack Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Vercel', 'OpenAI', 'Node.js'].map((tech, index) => (
              <div key={index} className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="text-sm font-medium">{tech}</div>
                <div className="text-xs text-gray-500">
                  {Math.floor(Math.random() * 5) + 1} projects
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <TrendingUp className="w-6 h-6" />
              <span className="text-sm">View Analytics</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Users className="w-6 h-6" />
              <span className="text-sm">User Management</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Globe className="w-6 h-6" />
              <span className="text-sm">Deploy New App</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveFeatures;

