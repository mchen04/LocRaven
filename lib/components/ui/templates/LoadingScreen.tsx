import React from 'react';
import { Loading } from '../atoms';

interface LoadingScreenProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  variant?: 'default' | 'fullscreen' | 'overlay';
  className?: string;
}

// Simplified loading screen using unified Loading component
const LoadingScreen: React.FC<LoadingScreenProps> = ({
  size = 'lg',
  text = 'Loading...',
  variant = 'fullscreen',
  className = ''
}) => {
  const layoutMap = {
    default: 'centered',
    fullscreen: 'fullscreen',
    overlay: 'overlay'
  } as const;

  return (
    <Loading
      size={size}
      text={text}
      layout={layoutMap[variant]}
      className={className}
    />
  );
};

export default LoadingScreen;