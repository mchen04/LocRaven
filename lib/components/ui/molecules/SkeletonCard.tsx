import React from 'react';
import Card from '../atoms/Card';
import Skeleton from '../atoms/Skeleton';

interface SkeletonCardProps {
  lines?: number;
  showHeader?: boolean;
  showButton?: boolean;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({
  lines = 3,
  showHeader = true,
  showButton = false,
  className = '',
  padding = 'md'
}) => {
  return (
    <Card padding={padding} className={`animate-pulse ${className}`}>
      {showHeader && (
        <div className="mb-4">
          <Skeleton height="1.5rem" width="75%" className="mb-2" />
          <Skeleton height="1rem" width="50%" />
        </div>
      )}
      
      <div className="space-y-3">
        {Array.from({ length: lines }, (_, i) => (
          <Skeleton 
            key={i} 
            height="1rem" 
            width={i === lines - 1 ? '60%' : '100%'} 
          />
        ))}
      </div>
      
      {showButton && (
        <div className="mt-4">
          <Skeleton height="2.5rem" width="6rem" />
        </div>
      )}
    </Card>
  );
};

export default SkeletonCard;