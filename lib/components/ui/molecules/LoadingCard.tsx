import React from 'react';
import { Card, Spinner } from '../atoms';
import type { CardProps } from '../atoms';

export interface LoadingCardProps extends Omit<CardProps, 'children'> {
  message?: string;
  spinnerSize?: 'sm' | 'md' | 'lg';
}

const LoadingCard: React.FC<LoadingCardProps> = ({
  message = 'Loading...',
  spinnerSize = 'md',
  ...cardProps
}) => {
  return (
    <Card {...cardProps}>
      <div className="flex flex-col items-center justify-center py-8">
        <Spinner size={spinnerSize} className="mb-4" />
        <p className="text-gray-600 text-sm">{message}</p>
      </div>
    </Card>
  );
};

export default LoadingCard;