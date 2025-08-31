import React from 'react';
import { Card, LoadingState } from '../atoms';
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
      <LoadingState 
        variant="spinner"
        size={spinnerSize} 
        text={message}
        layout="card"
      />
    </Card>
  );
};

export default LoadingCard;