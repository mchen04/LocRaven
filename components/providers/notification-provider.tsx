'use client';

import React, { createContext, useContext } from 'react';
import { toast } from 'sonner';

// React 19 Context interface as specified in REBUILD_TODO.md
interface NotificationContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  dismissAll: () => void;
}

const NotificationContext = createContext<NotificationContextType>({} as NotificationContextType);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const showSuccess = (message: string) => {
    toast.success(message);
  };

  const showError = (message: string) => {
    toast.error(message);
  };

  const showWarning = (message: string) => {
    toast.warning(message);
  };

  const dismissAll = () => {
    toast.dismiss();
  };

  const value: NotificationContextType = {
    showSuccess,
    showError,
    showWarning,
    dismissAll
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};