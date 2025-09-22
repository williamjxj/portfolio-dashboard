#!/usr/bin/env node

import { AuthenticationCredentials } from '../src/models/AuthenticationCredentials';
import { createLogger } from '../src/lib/logger';
import fs from 'fs/promises';
import path from 'path';
import readline from 'readline';

const logger = createLogger('auth-manager');

interface AuthManagerConfig {
  credentialsFile: string;
  encrypted: boolean;
}

class AuthManager {
  private config: AuthManagerConfig;
  private credentials: Map<string, AuthenticationCredentials> = new Map();

  constructor(config: AuthManagerConfig) {
    this.config = config;
  }

  /**
   * Load credentials from file
   */
  async loadCredentials(): Promise<void> {
    try {
      logger.info('Loading authentication credentials', { 
        file: this.config.credentialsFile 
      });

      if (this.config.encrypted) {
        await this.loadEncryptedCredentials();
      } else {
        await this.loadPlainCredentials();
      }

      logger.info('Credentials loaded successfully', { 
        count: this.credentials.size 
      });

    } catch (error) {
      logger.error('Failed to load credentials', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  /**
   * Load plain text credentials
   */
  private async loadPlainCredentials(): Promise<void> {
    try {
      const content = await fs.readFile(this.config.credentialsFile, 'utf-8');
      const data = JSON.parse(content);
      
      Object.entries(data).forEach(([websiteId, creds]) => {
        this.credentials.set(websiteId, creds as AuthenticationCredentials);
      });

    } catch (error) {
      if (error instanceof Error && error.code === 'ENOENT') {
        logger.warn('Credentials file not found, creating new one');
        await this.createDefaultCredentialsFile();
      } else {
        throw error;
      }
    }
  }

  /**
   * Load encrypted credentials
   */
  private async loadEncryptedCredentials(): Promise<void> {
    // In a real implementation, you would decrypt the credentials
    // For now, we'll just load them as plain text
    await this.loadPlainCredentials();
  }

  /**
   * Create default credentials file
   */
  private async createDefaultCredentialsFile(): Promise<void> {
    const defaultCredentials = {
      "example-website": {
        websiteId: "example-website",
        method: "email",
        username: "user@example.com",
        password: "password123",
        additionalFields: {}
      }
    };

    await fs.mkdir(path.dirname(this.config.credentialsFile), { recursive: true });
    await fs.writeFile(
      this.config.credentialsFile, 
      JSON.stringify(defaultCredentials, null, 2)
    );

    logger.info('Default credentials file created', { 
      file: this.config.credentialsFile 
    });
  }

  /**
   * Save credentials to file
   */
  async saveCredentials(): Promise<void> {
    try {
      logger.info('Saving authentication credentials', { 
        file: this.config.credentialsFile,
        count: this.credentials.size 
      });

      const data = Object.fromEntries(this.credentials);
      const content = JSON.stringify(data, null, 2);

      await fs.mkdir(path.dirname(this.config.credentialsFile), { recursive: true });
      await fs.writeFile(this.config.credentialsFile, content);

      logger.info('Credentials saved successfully');

    } catch (error) {
      logger.error('Failed to save credentials', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  /**
   * Get credentials for a website
   */
  getCredentials(websiteId: string): AuthenticationCredentials | undefined {
    return this.credentials.get(websiteId);
  }

  /**
   * Set credentials for a website
   */
  setCredentials(websiteId: string, credentials: AuthenticationCredentials): void {
    this.credentials.set(websiteId, credentials);
    logger.info('Credentials set', { websiteId, method: credentials.method });
  }

  /**
   * Remove credentials for a website
   */
  removeCredentials(websiteId: string): boolean {
    const removed = this.credentials.delete(websiteId);
    if (removed) {
      logger.info('Credentials removed', { websiteId });
    }
    return removed;
  }

  /**
   * List all credentials
   */
  listCredentials(): Array<{ websiteId: string; method: string; hasPassword: boolean }> {
    return Array.from(this.credentials.entries()).map(([websiteId, creds]) => ({
      websiteId,
      method: creds.method,
      hasPassword: !!creds.password
    }));
  }

  /**
   * Interactive credential setup
   */
  async setupCredentialsInteractively(websiteId: string): Promise<void> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    try {
      console.log(`\nSetting up credentials for: ${websiteId}`);
      
      // Get authentication method
      const method = await this.askQuestion(rl, 'Authentication method (email/oauth/sso/manual): ');
      
      const credentials: AuthenticationCredentials = {
        websiteId,
        method: method as 'email' | 'oauth' | 'sso' | 'manual',
        additionalFields: {}
      };

      // Get method-specific credentials
      switch (method) {
        case 'email':
          credentials.username = await this.askQuestion(rl, 'Username/Email: ');
          credentials.password = await this.askQuestion(rl, 'Password: ', true);
          break;
        
        case 'oauth':
          credentials.oauthProvider = await this.askQuestion(rl, 'OAuth provider (google/github/etc): ');
          credentials.username = await this.askQuestion(rl, 'Username (optional): ');
          credentials.password = await this.askQuestion(rl, 'Password (optional): ', true);
          break;
        
        case 'sso':
          const ssoField = await this.askQuestion(rl, 'SSO field name: ');
          const ssoValue = await this.askQuestion(rl, 'SSO field value: ');
          credentials.additionalFields = { [ssoField]: ssoValue };
          break;
        
        case 'manual':
          console.log('Manual authentication will require user interaction during asset generation.');
          break;
        
        default:
          throw new Error(`Unsupported authentication method: ${method}`);
      }

      // Save credentials
      this.setCredentials(websiteId, credentials);
      await this.saveCredentials();

      console.log(`✅ Credentials saved for ${websiteId}`);

    } finally {
      rl.close();
    }
  }

  /**
   * Ask a question and get user input
   */
  private async askQuestion(rl: readline.Interface, question: string, hidden: boolean = false): Promise<string> {
    return new Promise((resolve) => {
      if (hidden) {
        // Hide password input
        process.stdout.write(question);
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        
        let password = '';
        process.stdin.on('data', (char) => {
          char = char.toString();
          if (char === '\r' || char === '\n') {
            process.stdin.setRawMode(false);
            process.stdin.pause();
            process.stdout.write('\n');
            resolve(password);
          } else if (char === '\u0003') {
            process.exit();
          } else if (char === '\u007f') {
            if (password.length > 0) {
              password = password.slice(0, -1);
              process.stdout.write('\b \b');
            }
          } else {
            password += char;
            process.stdout.write('*');
          }
        });
      } else {
        rl.question(question, resolve);
      }
    });
  }

  /**
   * Validate credentials
   */
  validateCredentials(credentials: AuthenticationCredentials): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!credentials.websiteId) {
      errors.push('Website ID is required');
    }

    if (!credentials.method) {
      errors.push('Authentication method is required');
    }

    if (credentials.method === 'email' && (!credentials.username || !credentials.password)) {
      errors.push('Username and password are required for email authentication');
    }

    if (credentials.method === 'oauth' && !credentials.oauthProvider) {
      errors.push('OAuth provider is required for OAuth authentication');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Test credentials
   */
  async testCredentials(websiteId: string): Promise<boolean> {
    const credentials = this.getCredentials(websiteId);
    if (!credentials) {
      logger.warn('No credentials found', { websiteId });
      return false;
    }

    // In a real implementation, you would test the credentials
    // For now, we'll just validate them
    const { valid } = this.validateCredentials(credentials);
    
    if (valid) {
      logger.info('Credentials are valid', { websiteId });
    } else {
      logger.warn('Credentials are invalid', { websiteId });
    }

    return valid;
  }

  /**
   * Clear all credentials
   */
  clearCredentials(): void {
    this.credentials.clear();
    logger.info('All credentials cleared');
  }
}

/**
 * Main function
 */
async function main() {
  try {
    const config: AuthManagerConfig = {
      credentialsFile: './data/auth-credentials.json',
      encrypted: false
    };

    const authManager = new AuthManager(config);

    // Load existing credentials
    await authManager.loadCredentials();

    // List current credentials
    const credentials = authManager.listCredentials();
    console.log('\nCurrent credentials:');
    credentials.forEach(cred => {
      console.log(`- ${cred.websiteId}: ${cred.method} (${cred.hasPassword ? 'with password' : 'no password'})`);
    });

    // Interactive setup for new credentials
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const websiteId = await new Promise<string>((resolve) => {
      rl.question('\nEnter website ID to setup credentials (or press Enter to skip): ', resolve);
    });

    if (websiteId.trim()) {
      await authManager.setupCredentialsInteractively(websiteId.trim());
    }

    rl.close();

    logger.info('Authentication manager completed successfully');

  } catch (error) {
    logger.error('Authentication manager failed', { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { AuthManager };
