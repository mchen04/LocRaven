import React from 'react';
import { Card, Spinner } from '../atoms';

interface PageLoadingTemplateProps {
  title?: string;
  message?: string;
  showSkeleton?: boolean;
}

export const PageLoadingTemplate: React.FC<PageLoadingTemplateProps> = ({
  title = 'Loading...',
  message = 'Please wait while we load your content.',
  showSkeleton = false
}) => {
  if (showSkeleton) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header skeleton */}
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-6"></div>
        </div>
        
        {/* Content skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} padding="md" className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="text-center" padding="lg">
        <Spinner size="lg" className="mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {message}
        </p>
      </Card>
    </div>
  );
};

export default PageLoadingTemplate;