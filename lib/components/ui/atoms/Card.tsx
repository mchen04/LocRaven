import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

// Card variants using class-variance-authority
const cardVariants = cva(
  // Base classes - common styles for all cards
  [
    'rounded-lg transition-colors duration-200'
  ],
  {
    variants: {
      variant: {
        default: 'bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700',
        outlined: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
        elevated: 'bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700',
        ghost: 'bg-transparent dark:bg-transparent border-0',
        // Alert variants
        info: 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700',
        success: 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700',
        warning: 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700',
        error: 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700',
      },
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
      hover: {
        true: 'hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
      hover: false,
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  title?: string;
  'data-testid'?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      padding = 'md',
      hover = false,
      title,
      children,
      'data-testid': testId,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, hover }), className)}
        data-testid={testId}
        {...props}
      >
        {title && (
          <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h3>
          </div>
        )}
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
export { cardVariants };