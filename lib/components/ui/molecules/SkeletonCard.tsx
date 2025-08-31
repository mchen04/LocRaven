import React from 'react';
import { Card, LoadingState } from '../atoms';

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
    <Card padding={padding} className={className}>
      <LoadingState
        variant="skeleton"
        layout="card"
        lines={lines}
        showHeader={showHeader}
        showButton={showButton}
      />
    </Card>
  );
};

export default SkeletonCard;