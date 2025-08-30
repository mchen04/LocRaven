import React from 'react';
import LoadingSpinner from '../../LoadingSpinner';
import CenteredLayout from '../layouts/CenteredLayout';

interface LoadingScreenProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  variant?: 'default' | 'fullscreen' | 'overlay';
  className?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  size = 'lg',
  text = 'Loading...',
  variant = 'fullscreen',
  className = ''
}) => {
  if (variant === 'overlay') {
    return (
      <div className={`fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center pointer-events-none z-50 ${className}`}>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
          <LoadingSpinner size={size} text={text} />
        </div>
      </div>
    );
  }

  return (
    <CenteredLayout 
      variant={variant === 'fullscreen' ? 'fullscreen' : 'default'} 
      className={className}
    >
      <LoadingSpinner size={size} text={text} />
    </CenteredLayout>
  );
};

export default LoadingScreen;