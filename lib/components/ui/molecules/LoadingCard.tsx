import React from 'react';
import { Card, Loading } from '../atoms';
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
      <div className="py-8">
        <Loading 
          size={spinnerSize} 
          text={message}
          layout="centered"
        />
      </div>
    </Card>
  );
};

export default LoadingCard;