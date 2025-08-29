'use client';

import React, { useEffect } from 'react';
import { AlertCard } from './ui/molecules';

export type AlertType = 'success' | 'error' | 'info' | 'warning';

interface AlertProps {
  type: AlertType;
  message: string;
  onClose: () => void;
  autoClose?: boolean;
  title?: string;
}

const Alert: React.FC<AlertProps> = ({ 
  type, 
  message, 
  onClose, 
  autoClose = true,
  title 
}) => {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  return (
    <AlertCard
      variant={type}
      title={title}
      message={message}
      dismissible={true}
      onDismiss={onClose}
      padding="sm"
    />
  );
};

export default Alert;