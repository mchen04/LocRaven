import { ReactNode } from 'react';
import { Card } from './ui/atoms';

interface ResponsiveCardProps {
  children: ReactNode;
  title?: string;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'elevated' | 'ghost';
  hover?: boolean;
}

const ResponsiveCard: React.FC<ResponsiveCardProps> = ({
  children,
  title,
  className = '',
  padding = 'md',
  variant = 'default',
  hover = false
}) => {
  const hoverClasses = hover 
    ? 'hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer' 
    : '';

  return (
    <Card
      variant={variant}
      padding={padding}
      className={`dark:bg-gray-800 dark:border-gray-700 ${hoverClasses} ${className}`}
    >
      {title && (
        <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
        </div>
      )}
      {children}
    </Card>
  );
};

export default ResponsiveCard;