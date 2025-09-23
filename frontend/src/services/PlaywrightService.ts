import { Page, Browser, BrowserContext } from '@playwright/test';
import { Website } from '@/models/Website';
import { AuthenticationCredentials } from '@/models/AuthenticationCredentials';

export interface ScreenshotOptions {
  width?: number;
  height?: number;
  fullPage?: boolean;
  quality?: number;
  format?: 'png' | 'jpeg';
}

export interface PlaywrightServiceOptions {
  headless?: boolean;
  timeout?: number;
  viewport?: {
    width: number;
    height: number;
  };
}

export class PlaywrightService {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private options: PlaywrightServiceOptions;

  constructor(options: PlaywrightServiceOptions = {}) {
    this.options = {
      headless: true,
      timeout: 30000,
      viewport: { width: 1280, height: 720 },
      ...options
    };
  }

  /**
   * Initialize browser and context
   */
  async initialize(): Promise<void> {
    try {
      console.log('Initializing Playwright browser...');
      
      // Import playwright dynamically to avoid issues
      const { chromium } = await import('playwright');
      
      // Launch browser
      this.browser = await chromium.launch({
        headless: this.options.headless,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      // Create context
      this.context = await this.browser.newContext({
        viewport: this.options.viewport,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      });
      
      // Create page
      this.page = await this.context.newPage();
      
      console.log('Browser initialized successfully');
    } catch (error) {
      throw new Error(`Failed to initialize Playwright: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Take screenshot of a website
   */
  async takeScreenshot(website: Website, options: ScreenshotOptions = {}): Promise<Buffer> {
    try {
      if (!this.page) {
        throw new Error('Playwright not initialized. Call initialize() first.');
      }

      const screenshotOptions = {
        width: 1200,
        height: 800,
        fullPage: true,
        quality: 90,
        format: 'png' as const,
        ...options
      };

      // Retry logic for network issues
      let lastError: Error | null = null;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          // Navigate to the website
          await this.page.goto(website.url, { 
            waitUntil: 'networkidle',
            timeout: this.options.timeout 
          });

          // Handle age verification if present
          await this.handleAgeVerification();

          // Handle authentication if required
          if (website.requiresAuth) {
            await this.handleAuthentication(website);
          }

          // Take screenshot
          const screenshotOptions_final: any = {
            fullPage: screenshotOptions.fullPage,
            type: screenshotOptions.format
          };
          
          // Only add quality for JPEG format
          if (screenshotOptions.format === 'jpeg') {
            screenshotOptions_final.quality = screenshotOptions.quality;
          }
          
          const screenshot = await this.page.screenshot(screenshotOptions_final);
          return screenshot;
        } catch (error) {
          lastError = error instanceof Error ? error : new Error('Unknown error');
          console.log(`Screenshot attempt ${attempt} failed for ${website.url}: ${lastError.message}`);
          
          if (attempt < 3) {
            // Wait before retry with exponential backoff
            await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
          }
        }
      }

      throw lastError || new Error('All retry attempts failed');
    } catch (error) {
      throw new Error(`Failed to take screenshot of ${website.url}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Authenticate with a website
   */
  async authenticate(website: Website, credentials: AuthenticationCredentials): Promise<boolean> {
    try {
      if (!this.page) {
        throw new Error('Playwright not initialized. Call initialize() first.');
      }

      // Navigate to the website
      await this.page.goto(website.url, { 
        waitUntil: 'networkidle',
        timeout: this.options.timeout 
      });

      // Handle authentication based on method
      switch (credentials.method) {
        case 'email':
          return await this.handleEmailAuthentication(credentials);
        case 'oauth':
          return await this.handleOAuthAuthentication(credentials);
        case 'sso':
          return await this.handleSSOAuthentication(credentials);
        default:
          throw new Error(`Unsupported authentication method: ${credentials.method}`);
      }
    } catch (error) {
      throw new Error(`Authentication failed for ${website.url}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Handle email/password authentication
   */
  private async handleEmailAuthentication(credentials: AuthenticationCredentials): Promise<boolean> {
    try {
      if (!credentials.username || !credentials.password) {
        throw new Error('Username and password are required for email authentication');
      }

      // Look for common login form selectors
      const usernameSelectors = [
        'input[type="email"]',
        'input[name="email"]',
        'input[name="username"]',
        'input[name="user"]',
        '#email',
        '#username'
      ];

      const passwordSelectors = [
        'input[type="password"]',
        'input[name="password"]',
        '#password'
      ];

      const submitSelectors = [
        'button[type="submit"]',
        'input[type="submit"]',
        'button:has-text("Sign In")',
        'button:has-text("Login")',
        'button:has-text("Log In")'
      ];

      // Find and fill username field
      let usernameField = null;
      for (const selector of usernameSelectors) {
        usernameField = await this.page!.locator(selector).first();
        if (await usernameField.isVisible()) break;
      }

      if (!usernameField || !(await usernameField.isVisible())) {
        throw new Error('Could not find username/email input field');
      }

      await usernameField.fill(credentials.username);

      // Find and fill password field
      let passwordField = null;
      for (const selector of passwordSelectors) {
        passwordField = await this.page!.locator(selector).first();
        if (await passwordField.isVisible()) break;
      }

      if (!passwordField || !(await passwordField.isVisible())) {
        throw new Error('Could not find password input field');
      }

      await passwordField.fill(credentials.password);

      // Find and click submit button
      let submitButton = null;
      for (const selector of submitSelectors) {
        submitButton = await this.page!.locator(selector).first();
        if (await submitButton.isVisible()) break;
      }

      if (!submitButton || !(await submitButton.isVisible())) {
        throw new Error('Could not find submit button');
      }

      await submitButton.click();

      // Wait for navigation or error
      await this.page!.waitForLoadState('networkidle', { timeout: this.options.timeout });

      // Check if authentication was successful
      // This is a simple check - in practice, you'd look for success indicators
      const currentUrl = this.page!.url();
      return !currentUrl.includes('login') && !currentUrl.includes('signin');
    } catch (error) {
      throw new Error(`Email authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Handle OAuth authentication
   */
  private async handleOAuthAuthentication(credentials: AuthenticationCredentials): Promise<boolean> {
    try {
      if (!credentials.oauthProvider) {
        throw new Error('OAuth provider is required for OAuth authentication');
      }

      // Look for OAuth provider buttons
      const oauthSelectors = [
        `button:has-text("${credentials.oauthProvider}")`,
        `a:has-text("${credentials.oauthProvider}")`,
        `[data-provider="${credentials.oauthProvider}"]`,
        `[data-oauth="${credentials.oauthProvider}"]`
      ];

      let oauthButton = null;
      for (const selector of oauthSelectors) {
        oauthButton = await this.page!.locator(selector).first();
        if (await oauthButton.isVisible()) break;
      }

      if (!oauthButton || !(await oauthButton.isVisible())) {
        throw new Error(`Could not find ${credentials.oauthProvider} OAuth button`);
      }

      await oauthButton.click();

      // Wait for OAuth flow to complete
      await this.page!.waitForLoadState('networkidle', { timeout: this.options.timeout });

      // Check if authentication was successful
      const currentUrl = this.page!.url();
      return !currentUrl.includes('oauth') && !currentUrl.includes('auth');
    } catch (error) {
      throw new Error(`OAuth authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Handle SSO authentication
   */
  private async handleSSOAuthentication(credentials: AuthenticationCredentials): Promise<boolean> {
    try {
      // Look for SSO-related elements
      const ssoSelectors = [
        'button:has-text("SSO")',
        'a:has-text("SSO")',
        'button:has-text("Single Sign-On")',
        '[data-sso]'
      ];

      let ssoButton = null;
      for (const selector of ssoSelectors) {
        ssoButton = await this.page!.locator(selector).first();
        if (await ssoButton.isVisible()) break;
      }

      if (!ssoButton || !(await ssoButton.isVisible())) {
        throw new Error('Could not find SSO button');
      }

      await ssoButton.click();

      // Wait for SSO flow to complete
      await this.page!.waitForLoadState('networkidle', { timeout: this.options.timeout });

      // Check if authentication was successful
      const currentUrl = this.page!.url();
      return !currentUrl.includes('sso') && !currentUrl.includes('auth');
    } catch (error) {
      throw new Error(`SSO authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate logo for a website
   */
  async generateLogo(website: Website): Promise<Buffer> {
    try {
      if (!this.page) {
        throw new Error('Playwright not initialized. Call initialize() first.');
      }

      // Retry logic for network issues
      let lastError: Error | null = null;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          // Navigate to the website
          await this.page.goto(website.url, { 
            waitUntil: 'networkidle',
            timeout: this.options.timeout 
          });
          break; // Success, exit retry loop
        } catch (error) {
          lastError = error instanceof Error ? error : new Error('Unknown error');
          console.log(`Logo navigation attempt ${attempt} failed for ${website.url}: ${lastError.message}`);
          
          if (attempt < 3) {
            // Wait before retry with exponential backoff
            await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
          } else {
            throw lastError;
          }
        }
      }

      // Look for logo elements
      const logoSelectors = [
        'img[alt*="logo" i]',
        'img[class*="logo" i]',
        'img[id*="logo" i]',
        '.logo img',
        '#logo img',
        'header img',
        'nav img'
      ];

      let logoElement = null;
      for (const selector of logoSelectors) {
        logoElement = await this.page.locator(selector).first();
        if (await logoElement.isVisible()) break;
      }

      if (!logoElement || !(await logoElement.isVisible())) {
        // Create a fallback logo using the website's first letter
        return this.createFallbackLogo(website);
      }

      // Take screenshot of the logo
      const logo = await logoElement.screenshot({
        type: 'png'
      });

      return logo;
    } catch (error) {
      throw new Error(`Failed to generate logo for ${website.url}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate favicon for a website
   */
  async generateFavicon(website: Website): Promise<Buffer> {
    try {
      if (!this.page) {
        throw new Error('Playwright not initialized. Call initialize() first.');
      }

      // Retry logic for network issues
      let lastError: Error | null = null;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          // Navigate to the website
          await this.page.goto(website.url, { 
            waitUntil: 'networkidle',
            timeout: this.options.timeout 
          });
          break; // Success, exit retry loop
        } catch (error) {
          lastError = error instanceof Error ? error : new Error('Unknown error');
          console.log(`Favicon navigation attempt ${attempt} failed for ${website.url}: ${lastError.message}`);
          
          if (attempt < 3) {
            // Wait before retry with exponential backoff
            await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
          } else {
            throw lastError;
          }
        }
      }

      // Look for favicon
      const faviconSelectors = [
        'link[rel="icon"]',
        'link[rel="shortcut icon"]',
        'link[rel="apple-touch-icon"]'
      ];

      let faviconElement = null;
      for (const selector of faviconSelectors) {
        faviconElement = await this.page.locator(selector).first();
        if (await faviconElement.isVisible()) break;
      }

      if (!faviconElement || !(await faviconElement.isVisible())) {
        // Create a fallback favicon using the website's first letter
        return this.createFallbackFavicon(website);
      }

      // Get favicon URL and fetch it
      const faviconUrl = await faviconElement.getAttribute('href');
      if (!faviconUrl) {
        // Create a fallback favicon using the website's first letter
        return this.createFallbackFavicon(website);
      }

      try {
        // Navigate to favicon URL and take screenshot
        await this.page.goto(faviconUrl, { timeout: this.options.timeout });
        const favicon = await this.page.screenshot({
          type: 'png',
          clip: { x: 0, y: 0, width: 32, height: 32 }
        });
        return favicon;
      } catch (error) {
        // If favicon URL fails, create fallback
        return this.createFallbackFavicon(website);
      }
    } catch (error) {
      throw new Error(`Failed to generate favicon for ${website.url}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Close browser and cleanup
   */
  async close(): Promise<void> {
    try {
      if (this.page) {
        await this.page.close();
        this.page = null;
      }
      if (this.context) {
        await this.context.close();
        this.context = null;
      }
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
      }
    } catch (error) {
      throw new Error(`Failed to close Playwright: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if Playwright is initialized
   */
  isInitialized(): boolean {
    return this.browser !== null && this.context !== null && this.page !== null;
  }

  /**
   * Handle age verification gates
   */
  private async handleAgeVerification(): Promise<void> {
    try {
      // Check for common age verification elements
      const ageVerificationSelectors = [
        'text=I am 18 or older',
        'text=I am 18+',
        'text=Enter Site',
        'text=Continue',
        'button:has-text("I am 18 or older")',
        'button:has-text("Enter Site")',
        'button:has-text("Continue")',
        '[data-testid="age-verification"]',
        '.age-verification button'
      ];

      for (const selector of ageVerificationSelectors) {
        try {
          const element = await this.page!.locator(selector).first();
          if (await element.isVisible({ timeout: 2000 })) {
            await element.click();
            await this.page!.waitForLoadState('networkidle', { timeout: 5000 });
            break;
          }
        } catch {
          // Continue to next selector
        }
      }
    } catch (error) {
      // Age verification handling failed, continue anyway
      console.log('Age verification handling failed, continuing...');
    }
  }

  /**
   * Handle authentication for websites that require login
   */
  private async handleAuthentication(website: Website): Promise<void> {
    try {
      // Check if we're on a login page
      const isLoginPage = await this.isLoginPage();
      if (!isLoginPage) {
        return; // Not on a login page, continue
      }

      // For now, we'll just wait and continue without authentication
      // In a real implementation, you would use stored credentials
      console.log(`Authentication required for ${website.url}, but no credentials provided. Continuing without authentication...`);
      
      // Wait a bit for any redirects
      await this.page!.waitForTimeout(2000);
      
    } catch (error) {
      console.log('Authentication handling failed, continuing...');
    }
  }

  /**
   * Check if we're on a login page
   */
  private async isLoginPage(): Promise<boolean> {
    try {
      const loginIndicators = [
        'input[type="password"]',
        'input[name="password"]',
        'button:has-text("Sign In")',
        'button:has-text("Login")',
        'button:has-text("Log In")',
        'form[action*="login"]',
        'form[action*="signin"]',
        '.login-form',
        '.signin-form'
      ];

      for (const selector of loginIndicators) {
        try {
          const element = await this.page!.locator(selector).first();
          if (await element.isVisible({ timeout: 1000 })) {
            return true;
          }
        } catch {
          // Continue to next selector
        }
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Create a fallback favicon using the website's first letter
   */
  private async createFallbackFavicon(website: Website): Promise<Buffer> {
    try {
      // Get the first letter of the website name
      const firstLetter = website.name.charAt(0).toUpperCase();
      
      // Create a simple SVG favicon
      const svgContent = `
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" fill="#4F46E5"/>
          <text x="16" y="22" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="white" text-anchor="middle">${firstLetter}</text>
        </svg>
      `;
      
      // Convert SVG to PNG using Playwright
      await this.page!.setContent(svgContent);
      const favicon = await this.page!.screenshot({
        type: 'png',
        clip: { x: 0, y: 0, width: 32, height: 32 }
      });
      
      return favicon;
    } catch (error) {
      // If even the fallback fails, create a simple colored square
      const fallbackSvg = `
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" fill="#6B7280"/>
          <text x="16" y="22" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="white" text-anchor="middle">?</text>
        </svg>
      `;
      
      await this.page!.setContent(fallbackSvg);
      return await this.page!.screenshot({
        type: 'png',
        clip: { x: 0, y: 0, width: 32, height: 32 }
      });
    }
  }

  /**
   * Create a fallback logo using the website's first letter
   */
  private async createFallbackLogo(website: Website): Promise<Buffer> {
    try {
      // Get the first letter of the website name
      const firstLetter = website.name.charAt(0).toUpperCase();
      
      // Create a simple SVG logo
      const svgContent = `
        <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" fill="#4F46E5" rx="10"/>
          <text x="50" y="65" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle">${firstLetter}</text>
        </svg>
      `;
      
      // Convert SVG to PNG using Playwright
      await this.page!.setContent(svgContent);
      const logo = await this.page!.screenshot({
        type: 'png',
        clip: { x: 0, y: 0, width: 100, height: 100 }
      });
      
      return logo;
    } catch (error) {
      // If even the fallback fails, create a simple colored square
      const fallbackSvg = `
        <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" fill="#6B7280" rx="10"/>
          <text x="50" y="65" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle">?</text>
        </svg>
      `;
      
      await this.page!.setContent(fallbackSvg);
      return await this.page!.screenshot({
        type: 'png',
        clip: { x: 0, y: 0, width: 100, height: 100 }
      });
    }
  }

}
