'use client';

import React from 'react';
import { LoadingState } from '../atoms';

export interface ProcessingIndicatorProps {
  isVisible?: boolean;
  message?: string;
  submessage?: string;
  variant?: 'default' | 'card' | 'inline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ProcessingIndicator: React.FC<ProcessingIndicatorProps> = ({
  isVisible = true,
  message = 'Processing...',
  submessage,
  variant = 'default',
  size = 'md',
  className
}) => {
  const layoutMap = {
    default: 'centered',
    card: 'card',
    inline: 'inline'
  } as const;

  return (
    <LoadingState
      variant={submessage ? 'processing' : 'spinner'}
      size={size}
      layout={layoutMap[variant]}
      text={message}
      submessage={submessage}
      isVisible={isVisible}
      className={className}
    />
  );
};

export default ProcessingIndicator;