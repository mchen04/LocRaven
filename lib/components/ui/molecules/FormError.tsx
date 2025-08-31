'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface FormErrorProps {
  error?: string | null;
  className?: string;
  variant?: 'inline' | 'card' | 'toast';
  showIcon?: boolean;
}

const FormError: React.FC<FormErrorProps> = ({
  error,
  className = '',
  variant = 'inline',
  showIcon = true
}) => {
  if (!error) return null;

  const renderError = () => {
    switch (variant) {
      case 'card':
        return (
          <div className={`error-card ${className}`}>
            {showIcon && <AlertCircle size={20} className="error-icon" />}
            <span className="error-text">{error}</span>
          </div>
        );
      
      case 'toast':
        return (
          <div className={`error-toast ${className}`}>
            {showIcon && <AlertCircle size={16} className="error-icon" />}
            <span className="error-text">{error}</span>
          </div>
        );
      
      default: // inline
        return (
          <span className={`error-message ${className}`}>
            {showIcon && <AlertCircle size={14} className="error-icon" />}
            {error}
          </span>
        );
    }
  };

  return renderError();
};

export default FormError;