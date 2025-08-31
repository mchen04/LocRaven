import React from 'react';
import { cn } from '../../../utils/cn';
import { Card, Icon } from '../atoms';
import type { CardProps } from '../atoms';


export interface AlertCardProps extends Omit<CardProps, 'children' | 'variant'> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const AlertCard: React.FC<AlertCardProps> = ({
  variant = 'info',
  title,
  message,
  dismissible = false,
  onDismiss,
  action,
  ...cardProps
}) => {
  const contentStyles = {
    info: {
      icon: 'text-blue-500 dark:text-blue-400',
      title: 'text-blue-800 dark:text-blue-200',
      message: 'text-blue-700 dark:text-blue-300',
    },
    success: {
      icon: 'text-green-500 dark:text-green-400',
      title: 'text-green-800 dark:text-green-200',
      message: 'text-green-700 dark:text-green-300',
    },
    warning: {
      icon: 'text-yellow-500 dark:text-yellow-400',
      title: 'text-yellow-800 dark:text-yellow-200',
      message: 'text-yellow-700 dark:text-yellow-300',
    },
    error: {
      icon: 'text-red-500 dark:text-red-400',
      title: 'text-red-800 dark:text-red-200',
      message: 'text-red-700 dark:text-red-300',
    },
  };

  const styles = contentStyles[variant];

  return (
    <Card 
      {...cardProps}
      variant={variant}
      className={cn(cardProps.className)}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon
            name={variant}
            size={20}
            className={styles.icon}
            variant="outline"
          />
        </div>
        
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${styles.title}`}>
              {title}
            </h3>
          )}
          <p className={`${title ? 'mt-1' : ''} text-sm ${styles.message}`}>
            {message}
          </p>
          
          {action && (
            <div className="mt-3">
              <button
                type="button"
                onClick={action.onClick}
                className={`text-sm font-medium ${styles.title} hover:underline`}
              >
                {action.label}
              </button>
            </div>
          )}
        </div>
        
        {dismissible && (
          <div className="ml-3 flex-shrink-0">
            <button
              type="button"
              onClick={onDismiss}
              className={cn(
                'inline-flex rounded-md p-1.5 hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2',
                styles.icon
              )}
            >
              <span className="sr-only">Dismiss</span>
              <Icon
                name="close"
                size={20}
                variant="solid"
              />
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AlertCard;