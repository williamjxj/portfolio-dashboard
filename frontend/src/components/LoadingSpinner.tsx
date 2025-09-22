'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '',
  text 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`} data-testid="loading-spinner">
      <div className="flex flex-col items-center gap-3">
        <div 
          className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}
          role="status"
          aria-label="Loading"
        />
        {text && (
          <p className="text-gray-600 text-sm">{text}</p>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
