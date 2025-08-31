
import { memo } from 'react';
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
        default: 'bg-white dark:bg-dark-card shadow-sm border border-gray-200 dark:border-gray-700',
        outlined: 'bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700',
        elevated: 'bg-white dark:bg-dark-card shadow-md border border-gray-200 dark:border-gray-700',
        ghost: 'bg-transparent dark:bg-transparent border-0',
        // Alert variants
        info: 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-700',
        success: 'bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-700',
        warning: 'bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-700',
        error: 'bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-700',
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
  ref?: React.Ref<HTMLDivElement>;
  'data-testid'?: string;
}

const Card: React.FC<CardProps> = ({
  className,
  variant = 'default',
  padding = 'md',
  hover = false,
  title,
  children,
  ref,
  'data-testid': testId,
  ...props
}) => {
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
};

export default memo(Card);
export { cardVariants };