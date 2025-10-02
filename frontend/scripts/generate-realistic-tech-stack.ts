#!/usr/bin/env node

import { Website } from '../src/models/Website';
import { TechStackInfo } from '../src/models/TechStack';
import { createLogger } from '../src/lib/logger';
import fs from 'fs/promises';
import path from 'path';

const logger = createLogger('tech-stack-generator');

interface TechStackGeneratorConfig {
  inputFile: string;
  outputFile: string;
}

class TechStackGenerator {
  private config: TechStackGeneratorConfig;

  constructor(config: TechStackGeneratorConfig) {
    this.config = config;
  }

  /**
   * Generate realistic tech stack data based on website purpose
   */
  async generateRealisticTechStack(): Promise<void> {
    try {
      logger.info('Generating realistic tech stack data', { 
        inputFile: this.config.inputFile 
      });

      // Load existing websites
      const websitesData = await fs.readFile(this.config.inputFile, 'utf-8');
      const websites: Website[] = JSON.parse(websitesData);

      // Generate realistic tech stack for each website
      const updatedWebsites = websites.map(website => ({
        ...website,
        techStack: this.generateTechStackForWebsite(website)
      }));

      // Save updated websites
      await fs.writeFile(this.config.outputFile, JSON.stringify(updatedWebsites, null, 2));

      logger.info('Realistic tech stack data generated successfully', { 
        count: updatedWebsites.length 
      });

    } catch (error) {
      logger.error('Failed to generate realistic tech stack data', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  /**
   * Generate tech stack based on website name and description
   */
  private generateTechStackForWebsite(website: Website): TechStackInfo {
    const name = website.name.toLowerCase();
    const description = website.description.toLowerCase();
    const url = website.url.toLowerCase();

    // AI/ML focused websites (but not e-commerce)
    if (name.includes('face fusion') || (name.includes('ai') && !name.includes('shop'))) {
      return {
        frontend: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
        backend: ['Python', 'FastAPI', 'OpenCV', 'TensorFlow'],
        database: ['PostgreSQL', 'Redis', 'Vector Database'],
        deployment: ['Vercel', 'Docker', 'AWS'],
        aiTools: ['OpenAI', 'TensorFlow', 'PyTorch', 'Computer Vision', 'Face Recognition'],
        other: ['WebRTC', 'Canvas API', 'Image Processing', 'Machine Learning'],
        source: new Date().toISOString()
      };
    }

    // E-commerce websites
    if (name.includes('shop') || name.includes('store') || name.includes('commerce')) {
      return {
        frontend: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Stripe'],
        backend: ['Node.js', 'Express', 'Supabase'],
        database: ['PostgreSQL', 'Supabase Auth', 'Stripe'],
        deployment: ['Vercel', 'Supabase'],
        aiTools: ['OpenAI', 'Product Recommendations'],
        other: ['Payment Processing', 'Inventory Management', 'E-commerce'],
        source: new Date().toISOString()
      };
    }

    // Business/Consulting websites
    if (name.includes('consulting') || name.includes('consultants') || name.includes('business')) {
      return {
        frontend: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
        backend: ['Node.js', 'Express', 'Contentful'],
        database: ['PostgreSQL', 'Contentful CMS'],
        deployment: ['Vercel', 'Netlify'],
        aiTools: ['OpenAI', 'ChatGPT Integration'],
        other: ['CMS', 'SEO Optimization', 'Analytics', 'Lead Generation'],
        source: new Date().toISOString()
      };
    }

    // Project management/Bidding platforms
    if (name.includes('bid') || name.includes('project') || name.includes('hub')) {
      return {
        frontend: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
        backend: ['Node.js', 'Express', 'Supabase'],
        database: ['PostgreSQL', 'Supabase Auth'],
        deployment: ['Vercel', 'Supabase'],
        aiTools: ['OpenAI', 'Natural Language Processing'],
        other: ['Project Management', 'Communication Tools', 'Bidding System'],
        source: new Date().toISOString()
      };
    }

    // Daycare/Service websites
    if (name.includes('daycare') || name.includes('service') || name.includes('care')) {
      return {
        frontend: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
        backend: ['Node.js', 'Express', 'Supabase'],
        database: ['PostgreSQL', 'Supabase Auth'],
        deployment: ['Vercel', 'Supabase'],
        aiTools: ['OpenAI', 'Customer Service Chat'],
        other: ['Booking System', 'Parent Portal', 'Communication Tools'],
        source: new Date().toISOString()
      };
    }

    // Template/Demo websites
    if (name.includes('template') || name.includes('demo') || name.includes('mcp')) {
      return {
        frontend: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
        backend: ['Node.js', 'MCP Protocol', 'OpenAI'],
        database: ['PostgreSQL', 'Supabase'],
        deployment: ['Vercel', 'Docker'],
        aiTools: ['Model Context Protocol', 'OpenAI', 'Claude', 'Anthropic'],
        other: ['Template System', 'AI Integration', 'Demo Features'],
        source: new Date().toISOString()
      };
    }

    // Default tech stack for unknown websites
    return {
      frontend: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
      backend: ['Node.js', 'Express'],
      database: ['PostgreSQL'],
      deployment: ['Vercel'],
      aiTools: [],
      other: ['Web Application'],
      source: new Date().toISOString()
    };
  }
}

/**
 * Main function
 */
async function main() {
  try {
    const config: TechStackGeneratorConfig = {
      inputFile: './data/websites.json',
      outputFile: './data/websites.json'
    };

    const generator = new TechStackGenerator(config);
    await generator.generateRealisticTechStack();

    logger.info('Tech stack generation completed successfully');

  } catch (error) {
    logger.error('Tech stack generation failed', { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { TechStackGenerator };
