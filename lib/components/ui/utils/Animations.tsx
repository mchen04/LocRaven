'use client';

import React, { useState, useEffect } from 'react';

// Animation utility components for common UI patterns

export interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: 'fast' | 'normal' | 'slow';
  className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({ 
  children, 
  delay = 0, 
  duration = 'normal',
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const durationClasses = {
    fast: 'duration-150',
    normal: 'duration-300',
    slow: 'duration-500'
  };

  return (
    <div 
      className={`transition-opacity ${durationClasses[duration]} ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export interface SlideUpProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const SlideUp: React.FC<SlideUpProps> = ({ 
  children, 
  delay = 0,
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`transition-all duration-300 ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-4 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export interface PulseProps {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}

export const Pulse: React.FC<PulseProps> = ({ 
  children, 
  active = true,
  className = '' 
}) => {
  return (
    <div className={`${active ? 'animate-pulse' : ''} ${className}`}>
      {children}
    </div>
  );
};

export interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({ 
  width = '100%',
  height = '1rem',
  className = '',
  variant = 'rectangular',
  count = 1
}) => {
  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded',
    circular: 'rounded-full'
  };

  const skeleton = (
    <div 
      className={`skeleton-base ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    />
  );

  if (count === 1) return skeleton;

  return (
    <div className="space-y-2">
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>{skeleton}</div>
      ))}
    </div>
  );
};

export interface LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'gray' | 'white';
  className?: string;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({ 
  size = 'md',
  color = 'primary',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const colorClasses = {
    primary: 'bg-blue-600',
    gray: 'bg-gray-400',
    white: 'bg-white'
  };

  return (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
};

// Higher order component for entrance animations
export interface AnimateOnMountProps {
  children: React.ReactNode;
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'scale';
  duration?: number;
  delay?: number;
}

export const AnimateOnMount: React.FC<AnimateOnMountProps> = ({
  children,
  animation = 'fade',
  duration = 300,
  delay = 0
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const animationClasses = {
    fade: mounted ? 'opacity-100' : 'opacity-0',
    'slide-up': mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
    'slide-down': mounted ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0',
    scale: mounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
  };

  return (
    <div 
      className={`transition-all ease-out ${animationClasses[animation]}`}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
};