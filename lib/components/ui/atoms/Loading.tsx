import React from 'react';

export interface LoadingProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  layout?: 'inline' | 'centered' | 'overlay' | 'fullscreen';
  text?: string;
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  className?: string;
  'data-testid'?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  variant = 'spinner',
  layout = 'centered',
  text,
  color = 'primary',
  className = '',
  'data-testid': testId,
}) => {
  const sizeClasses = {
    xs: { spinner: 'h-3 w-3', text: 'text-xs' },
    sm: { spinner: 'h-4 w-4', text: 'text-sm' },
    md: { spinner: 'h-6 w-6', text: 'text-base' },
    lg: { spinner: 'h-8 w-8', text: 'text-lg' },
    xl: { spinner: 'h-12 w-12', text: 'text-xl' }
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white',
    gray: 'text-gray-400'
  };

  const layoutClasses = {
    inline: 'inline-flex items-center',
    centered: 'flex flex-col items-center justify-center',
    overlay: 'fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50',
    fullscreen: 'min-h-screen flex items-center justify-center'
  };

  const renderSpinner = () => (
    <div
      className={`animate-spin rounded-full border-2 border-current border-t-transparent ${sizeClasses[size].spinner} ${colorClasses[color]}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );

  const renderDots = () => (
    <div className={`flex space-x-1 ${colorClasses[color]}`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${sizeClasses[size].spinner.replace('h-', 'h-').replace('w-', 'w-')} bg-current rounded-full animate-bounce`}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div className={`${sizeClasses[size].spinner} bg-current rounded animate-pulse ${colorClasses[color]}`} />
  );

  const renderSkeleton = () => (
    <div className={`space-y-3 ${sizeClasses[size].text}`}>
      <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse`} />
      <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse`} />
      <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse`} />
    </div>
  );

  const renderVariant = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'skeleton':
        return renderSkeleton();
      default:
        return renderSpinner();
    }
  };

  const content = (
    <>
      {variant !== 'skeleton' && renderVariant()}
      {text && variant !== 'skeleton' && (
        <p className={`${sizeClasses[size].text} text-gray-600 dark:text-gray-400 font-medium ${layout === 'inline' ? 'ml-2' : 'mt-2'}`}>
          {text}
        </p>
      )}
      {variant === 'skeleton' && renderVariant()}
    </>
  );

  if (layout === 'overlay') {
    return (
      <div className={layoutClasses[layout]} data-testid={testId}>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
          <div className="flex flex-col items-center space-y-2">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`${layoutClasses[layout]} ${layout === 'inline' ? '' : 'space-y-2'} ${className}`}
      data-testid={testId}
    >
      {content}
    </div>
  );
};

export default Loading;