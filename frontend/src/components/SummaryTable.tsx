'use client';

import React, { useState } from 'react';
import { Website, TechStack, DeploymentInfo } from '@/models/Website';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ExternalLink, 
  Github, 
  Database, 
  Server, 
  Zap, 
  Globe,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

interface SummaryTableProps {
  websites: Website[];
  className?: string;
}

export const SummaryTable: React.FC<SummaryTableProps> = ({ websites, className = '' }) => {
  const [selectedTab, setSelectedTab] = useState('overview');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'staging':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'development':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTechStackBadges = (techStack?: TechStack) => {
    if (!techStack) return [];
    
    const allTech = [
      ...techStack.frontend,
      ...techStack.backend,
      ...techStack.database,
      ...techStack.deployment,
      ...techStack.aiTools
    ];
    
    return allTech.slice(0, 5); // Show top 5 technologies
  };

  const getDeploymentInfo = (deploymentInfo?: DeploymentInfo) => {
    if (!deploymentInfo) return { platform: 'Unknown', status: 'Unknown' };
    return deploymentInfo;
  };

  const getSupabaseInfo = (deploymentInfo?: DeploymentInfo) => {
    if (!deploymentInfo?.supabaseUrl) return null;
    return {
      url: deploymentInfo.supabaseUrl,
      project: deploymentInfo.supabaseProject || 'Unknown'
    };
  };

  return (
    <div className={className}>
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tech">Tech Stack</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {websites.length}
                </div>
                <div className="text-gray-600">Total Applications</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {websites.filter(w => w.state === 'completed').length}
                </div>
                <div className="text-gray-600">Completed</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {websites.filter(w => w.techStack?.aiTools && w.techStack.aiTools.length > 0).length}
                </div>
                <div className="text-gray-600">AI-Powered</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Application Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Application</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Platform</th>
                      <th className="text-left p-2">Supabase</th>
                      <th className="text-left p-2">Auth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {websites.map((website) => {
                      const deployment = getDeploymentInfo(website.deploymentInfo);
                      const supabase = getSupabaseInfo(website.deploymentInfo);
                      
                      return (
                        <tr key={website.id} className="border-b hover:bg-gray-50">
                          <td className="p-2">
                            <div className="font-medium">{website.name}</div>
                            <div className="text-xs text-gray-500 truncate max-w-48">
                              {website.url}
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(deployment.status)}
                              <span className="capitalize">{deployment.status}</span>
                            </div>
                          </td>
                          <td className="p-2">
                            <Badge variant="outline" className="capitalize">
                              {deployment.platform}
                            </Badge>
                          </td>
                          <td className="p-2">
                            {supabase ? (
                              <div className="flex items-center gap-1">
                                <Database className="w-3 h-3 text-green-500" />
                                <span className="text-xs">Connected</span>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-xs">Not connected</span>
                            )}
                          </td>
                          <td className="p-2">
                            {website.requiresAuth ? (
                              <Badge variant="secondary" className="text-xs">
                                Required
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">
                                Public
                              </Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tech" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Technology Stack Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {websites.map((website) => {
                  const techBadges = getTechStackBadges(website.techStack);
                  
                  return (
                    <div key={website.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{website.name}</h3>
                        <Button variant="outline" size="sm" asChild>
                          <a href={website.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Visit
                          </a>
                        </Button>
                      </div>
                      
                      {techBadges.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {techBadges.map((tech, index) => (
                            <Badge key={index} variant="secondary">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm">No tech stack information available</div>
                      )}
                      
                      {website.features && website.features.length > 0 && (
                        <div className="mt-3">
                          <div className="text-sm font-medium text-gray-700 mb-2">Key Features:</div>
                          <div className="flex flex-wrap gap-1">
                            {website.features.slice(0, 3).map((feature, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                Deployment & Infrastructure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {websites.map((website) => {
                  const deployment = getDeploymentInfo(website.deploymentInfo);
                  const supabase = getSupabaseInfo(website.deploymentInfo);
                  
                  return (
                    <div key={website.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{website.name}</h3>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(deployment.status)}
                          <span className="text-sm capitalize">{deployment.status}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-2">Deployment</div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="capitalize">
                              {deployment.platform}
                            </Badge>
                            <Button variant="ghost" size="sm" asChild>
                              <a href={website.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </Button>
                          </div>
                          {deployment.lastDeployed && (
                            <div className="text-xs text-gray-500 mt-1">
                              Last deployed: {new Date(deployment.lastDeployed).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-2">Database</div>
                          {supabase ? (
                            <div className="flex items-center gap-2">
                              <Database className="w-4 h-4 text-green-500" />
                              <span className="text-sm">Supabase Connected</span>
                              <Button variant="ghost" size="sm" asChild>
                                <a href={supabase.url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </Button>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">No database connection</span>
                          )}
                        </div>
                      </div>
                      
                      {deployment.githubRepo && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex items-center gap-2">
                            <Github className="w-4 h-4" />
                            <span className="text-sm">Repository:</span>
                            <Button variant="ghost" size="sm" asChild>
                              <a href={deployment.githubRepo} target="_blank" rel="noopener noreferrer">
                                View Code
                                <ExternalLink className="w-4 h-4 ml-1" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SummaryTable;

