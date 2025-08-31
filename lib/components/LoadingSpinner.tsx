'use client';

import { Loading } from './ui/atoms';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

// Legacy wrapper - use Loading component directly for new code
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...', 
  className = '' 
}) => {
  return (
    <Loading
      size={size}
      text={text}
      layout="centered"
      className={className}
    />
  );
};

export default LoadingSpinner;