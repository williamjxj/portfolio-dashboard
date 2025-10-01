'use client';

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ErrorBoundary } from './ErrorBoundary';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'Website Dashboard',
  description = 'A modern dashboard for managing and viewing websites',
  className = ''
}) => {
  const pathname = usePathname();
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <ErrorBoundary>
        <div className={`min-h-screen bg-gray-50 ${className}`}>
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-3">
                  <Image
                    src="/logo.svg"
                    alt="Dashboard Logo"
                    width={32}
                    height={32}
                    className="animate-pulse"
                  />
                  <h1 className="text-xl font-semibold text-gray-900">
                    William Jiang's AI Products Dashboard
                  </h1>
                </div>
                
                <nav className="hidden md:flex space-x-8">
                  <Link 
                    href="/" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      pathname === '/' 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/about" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      pathname === '/about' 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    About
                  </Link>
                </nav>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-sm text-gray-500">
                  © 2025 William Jiang's AI Products Dashboard. All rights reserved.
                </div>
                
                <div className="flex space-x-6 mt-4 md:mt-0">
                  <a 
                    href="/privacy" 
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200"
                  >
                    Privacy Policy
                  </a>
                  <a 
                    href="/terms" 
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200"
                  >
                    Terms of Service
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </ErrorBoundary>
    </>
  );
};

export default Layout;
