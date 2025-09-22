#!/usr/bin/env node

import { createLogger } from '../src/lib/logger';
import fs from 'fs/promises';
import path from 'path';

const logger = createLogger('code-optimization');

interface OptimizationConfig {
  srcDir: string;
  outputDir: string;
  removeDuplicates: boolean;
  optimizeImports: boolean;
  minifyCode: boolean;
  removeUnused: boolean;
}

class CodeOptimizer {
  private config: OptimizationConfig;
  private duplicates: Map<string, string[]> = new Map();
  private unusedImports: Set<string> = new Set();

  constructor(config: OptimizationConfig) {
    this.config = config;
  }

  /**
   * Optimize all code files
   */
  async optimizeAllCode(): Promise<void> {
    try {
      logger.info('Starting code optimization', { 
        srcDir: this.config.srcDir,
        outputDir: this.config.outputDir 
      });

      // Find all TypeScript/JavaScript files
      const files = await this.findCodeFiles();
      logger.info('Found code files', { count: files.length });

      // Analyze code
      await this.analyzeCode(files);

      // Optimize code
      await this.optimizeCode(files);

      // Generate report
      await this.generateReport();

      logger.info('Code optimization completed successfully');

    } catch (error) {
      logger.error('Code optimization failed', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  /**
   * Find all code files
   */
  private async findCodeFiles(): Promise<string[]> {
    const files: string[] = [];
    const extensions = ['.ts', '.tsx', '.js', '.jsx'];

    const scanDirectory = async (dir: string): Promise<void> => {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          
          if (entry.isDirectory() && !this.shouldSkipDirectory(entry.name)) {
            await scanDirectory(fullPath);
          } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        logger.warn('Failed to scan directory', { dir, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    };

    await scanDirectory(this.config.srcDir);
    return files;
  }

  /**
   * Check if directory should be skipped
   */
  private shouldSkipDirectory(dirName: string): boolean {
    const skipDirs = ['node_modules', '.git', '.next', 'dist', 'build'];
    return skipDirs.includes(dirName);
  }

  /**
   * Analyze code for optimization opportunities
   */
  private async analyzeCode(files: string[]): Promise<void> {
    logger.info('Analyzing code for optimization opportunities');

    for (const file of files) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        
        if (this.config.removeDuplicates) {
          await this.analyzeDuplicates(file, content);
        }
        
        if (this.config.optimizeImports) {
          await this.analyzeImports(file, content);
        }
        
        if (this.config.removeUnused) {
          await this.analyzeUnusedCode(file, content);
        }
      } catch (error) {
        logger.warn('Failed to analyze file', { 
          file, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }
  }

  /**
   * Analyze for duplicate code
   */
  private async analyzeDuplicates(file: string, content: string): Promise<void> {
    const lines = content.split('\n');
    const codeBlocks: string[] = [];
    
    // Extract code blocks (functions, classes, etc.)
    let currentBlock = '';
    let inBlock = false;
    
    for (const line of lines) {
      if (line.trim().startsWith('function ') || line.trim().startsWith('class ') || line.trim().startsWith('const ') || line.trim().startsWith('export ')) {
        if (inBlock && currentBlock.trim()) {
          codeBlocks.push(currentBlock.trim());
        }
        currentBlock = line;
        inBlock = true;
      } else if (inBlock) {
        currentBlock += '\n' + line;
        
        if (line.trim() === '}' || line.trim() === '});') {
          codeBlocks.push(currentBlock.trim());
          currentBlock = '';
          inBlock = false;
        }
      }
    }
    
    // Check for duplicates
    const blockMap = new Map<string, string[]>();
    codeBlocks.forEach(block => {
      const normalized = this.normalizeCode(block);
      if (!blockMap.has(normalized)) {
        blockMap.set(normalized, []);
      }
      blockMap.get(normalized)!.push(file);
    });
    
    // Store duplicates
    blockMap.forEach((files, block) => {
      if (files.length > 1) {
        this.duplicates.set(block, files);
      }
    });
  }

  /**
   * Analyze imports
   */
  private async analyzeImports(file: string, content: string): Promise<void> {
    const lines = content.split('\n');
    const imports: string[] = [];
    
    for (const line of lines) {
      if (line.trim().startsWith('import ') || line.trim().startsWith('from ')) {
        imports.push(line.trim());
      }
    }
    
    // Check for unused imports
    for (const importLine of imports) {
      const importName = this.extractImportName(importLine);
      if (importName && !this.isImportUsed(content, importName)) {
        this.unusedImports.add(`${file}:${importLine}`);
      }
    }
  }

  /**
   * Analyze for unused code
   */
  private async analyzeUnusedCode(file: string, content: string): Promise<void> {
    // This is a simplified analysis
    // In a real implementation, you would use a proper AST parser
    const lines = content.split('\n');
    
    for (const line of lines) {
      if (line.trim().startsWith('const ') || line.trim().startsWith('let ') || line.trim().startsWith('var ')) {
        const variableName = this.extractVariableName(line);
        if (variableName && !this.isVariableUsed(content, variableName)) {
          logger.debug('Unused variable found', { file, variable: variableName });
        }
      }
    }
  }

  /**
   * Optimize code files
   */
  private async optimizeCode(files: string[]): Promise<void> {
    logger.info('Optimizing code files', { count: files.length });

    for (const file of files) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        let optimizedContent = content;

        // Remove unused imports
        if (this.config.optimizeImports) {
          optimizedContent = this.removeUnusedImports(optimizedContent);
        }

        // Remove duplicate code
        if (this.config.removeDuplicates) {
          optimizedContent = this.removeDuplicateCode(optimizedContent);
        }

        // Minify code
        if (this.config.minifyCode) {
          optimizedContent = this.minifyCode(optimizedContent);
        }

        // Write optimized content
        const outputPath = this.getOutputPath(file);
        await fs.mkdir(path.dirname(outputPath), { recursive: true });
        await fs.writeFile(outputPath, optimizedContent);

        logger.info('Code optimized', { file, outputPath });

      } catch (error) {
        logger.error('Failed to optimize file', { 
          file, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }
  }

  /**
   * Remove unused imports
   */
  private removeUnusedImports(content: string): string {
    const lines = content.split('\n');
    const optimizedLines: string[] = [];
    
    for (const line of lines) {
      if (line.trim().startsWith('import ')) {
        const importName = this.extractImportName(line);
        if (importName && this.isImportUsed(content, importName)) {
          optimizedLines.push(line);
        }
      } else {
        optimizedLines.push(line);
      }
    }
    
    return optimizedLines.join('\n');
  }

  /**
   * Remove duplicate code
   */
  private removeDuplicateCode(content: string): string {
    // This is a simplified implementation
    // In a real scenario, you would use a proper AST parser
    return content;
  }

  /**
   * Minify code
   */
  private minifyCode(content: string): string {
    return content
      .replace(/\s+/g, ' ')
      .replace(/\s*{\s*/g, '{')
      .replace(/\s*}\s*/g, '}')
      .replace(/\s*;\s*/g, ';')
      .trim();
  }

  /**
   * Extract import name from import statement
   */
  private extractImportName(importLine: string): string | null {
    const match = importLine.match(/import\s+{([^}]+)}/);
    if (match) {
      return match[1].split(',')[0].trim();
    }
    
    const defaultMatch = importLine.match(/import\s+(\w+)/);
    if (defaultMatch) {
      return defaultMatch[1];
    }
    
    return null;
  }

  /**
   * Check if import is used in content
   */
  private isImportUsed(content: string, importName: string): boolean {
    const lines = content.split('\n');
    for (const line of lines) {
      if (line.includes(importName) && !line.trim().startsWith('import ')) {
        return true;
      }
    }
    }
    return false;
  }

  /**
   * Extract variable name from declaration
   */
  private extractVariableName(line: string): string | null {
    const match = line.match(/(?:const|let|var)\s+(\w+)/);
    return match ? match[1] : null;
  }

  /**
   * Check if variable is used in content
   */
  private isVariableUsed(content: string, variableName: string): boolean {
    const lines = content.split('\n');
    let usageCount = 0;
    
    for (const line of lines) {
      if (line.includes(variableName) && !line.trim().startsWith('const ') && !line.trim().startsWith('let ') && !line.trim().startsWith('var ')) {
        usageCount++;
      }
    }
    
    return usageCount > 0;
  }

  /**
   * Normalize code for comparison
   */
  private normalizeCode(code: string): string {
    return code
      .replace(/\s+/g, ' ')
      .replace(/\s*{\s*/g, '{')
      .replace(/\s*}\s*/g, '}')
      .trim();
  }

  /**
   * Get output path for file
   */
  private getOutputPath(file: string): string {
    const relativePath = path.relative(this.config.srcDir, file);
    return path.join(this.config.outputDir, relativePath);
  }

  /**
   * Generate optimization report
   */
  private async generateReport(): Promise<void> {
    try {
      const report = {
        timestamp: new Date().toISOString(),
        duplicates: Array.from(this.duplicates.entries()).map(([code, files]) => ({
          code: code.substring(0, 100) + '...',
          files: files.length,
          locations: files
        })),
        unusedImports: Array.from(this.unusedImports),
        statistics: {
          totalDuplicates: this.duplicates.size,
          totalUnusedImports: this.unusedImports.size
        }
      };

      const reportPath = path.join(this.config.outputDir, 'optimization-report.json');
      await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

      logger.info('Optimization report generated', { reportPath });

    } catch (error) {
      logger.error('Failed to generate report', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

/**
 * Main function
 */
async function main() {
  try {
    const config: OptimizationConfig = {
      srcDir: './src',
      outputDir: './optimized',
      removeDuplicates: true,
      optimizeImports: true,
      minifyCode: false, // Keep readable for development
      removeUnused: true
    };

    const optimizer = new CodeOptimizer(config);

    // Optimize all code
    await optimizer.optimizeAllCode();

    logger.info('Code optimization completed successfully');

  } catch (error) {
    logger.error('Code optimization failed', { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { CodeOptimizer };
