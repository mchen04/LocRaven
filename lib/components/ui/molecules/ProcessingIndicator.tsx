'use client';

import React from 'react';
import { Loading } from '../atoms';
import type { LoadingProps } from '../atoms/Loading';

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
  if (!isVisible) return null;

  const layoutMap = {
    default: 'centered',
    card: 'centered',
    inline: 'inline'
  } as const;

  const loadingVariant: LoadingProps['variant'] = submessage ? 'processing' : 'spinner';

  return (
    <Loading
      variant={loadingVariant}
      size={size}
      layout={layoutMap[variant]}
      text={message}
      submessage={submessage}
      className={className}
    />
  );
};

export default ProcessingIndicator;