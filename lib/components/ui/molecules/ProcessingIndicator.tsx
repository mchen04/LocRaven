'use client';

import React from 'react';

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
  className = ''
}) => {
  if (!isVisible) return null;

  const getSpinnerSize = () => {
    switch (size) {
      case 'sm': return '16px';
      case 'md': return '24px';
      case 'lg': return '32px';
      default: return '24px';
    }
  };

  const Spinner = () => (
    <div 
      className="spinner"
      style={{
        width: getSpinnerSize(),
        height: getSpinnerSize(),
        minWidth: getSpinnerSize(),
        minHeight: getSpinnerSize()
      }}
    />
  );

  if (variant === 'inline') {
    return (
      <div className={`processing-indicator-inline ${className}`}>
        <Spinner />
        <span className="processing-message">{message}</span>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`processing-card ${className}`}>
        <Spinner />
        <div className="processing-content">
          <div className="processing-message">{message}</div>
          {submessage && (
            <div className="processing-submessage">{submessage}</div>
          )}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`processing-indicator active ${className}`}>
      <Spinner />
      <div className="processing-text">
        {message}
        {submessage && (
          <>
            <br />
            <small>{submessage}</small>
          </>
        )}
      </div>
    </div>
  );
};

export default ProcessingIndicator;