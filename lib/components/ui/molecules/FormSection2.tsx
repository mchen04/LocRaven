import React from 'react';
import { Card } from '../atoms';

export interface FormSection2Props {
  title?: string;
  description?: string;
  children: React.ReactNode;
  variant?: 'default' | 'card' | 'bordered' | 'minimal';
  columns?: 1 | 2 | 3 | 'auto';
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

const FormSection2: React.FC<FormSection2Props> = ({
  title,
  description,
  children,
  variant = 'default',
  columns = 'auto',
  className = '',
  collapsible = false,
  defaultCollapsed = false
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  const getGridClasses = () => {
    if (columns === 'auto') {
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
    }
    return `grid grid-cols-1 ${columns > 1 ? `md:grid-cols-${columns}` : ''} gap-4`;
  };

  const renderHeader = () => (
    <>
      {title && (
        <div className={`flex items-center justify-between ${collapsible ? 'cursor-pointer' : ''}`} 
             onClick={collapsible ? () => setIsCollapsed(!isCollapsed) : undefined}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          {collapsible && (
            <button 
              type="button"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={isCollapsed ? 'Expand section' : 'Collapse section'}
            >
              {isCollapsed ? '▶' : '▼'}
            </button>
          )}
        </div>
      )}
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-4">
          {description}
        </p>
      )}
    </>
  );

  const content = (
    <>
      {renderHeader()}
      {(!collapsible || !isCollapsed) && (
        <div className={getGridClasses()}>
          {children}
        </div>
      )}
    </>
  );

  switch (variant) {
    case 'card':
      return (
        <Card padding="lg" className={className}>
          {content}
        </Card>
      );
    
    case 'bordered':
      return (
        <div className={`border border-gray-200 dark:border-gray-700 rounded-lg p-6 ${className}`}>
          {content}
        </div>
      );
    
    case 'minimal':
      return (
        <div className={className}>
          {content}
        </div>
      );
    
    default:
      return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
          {content}
        </div>
      );
  }
};

export default FormSection2;