import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

// Button variants using class-variance-authority
const buttonVariants = cva(
  // Base classes - common styles for all buttons
  [
    'inline-flex items-center justify-center gap-2 rounded-md font-medium',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'transition-colors duration-200'
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-primary text-white shadow-sm',
          'hover:bg-primary-dark focus:ring-primary',
          'disabled:hover:bg-primary'
        ],
        secondary: [
          'bg-secondary text-white shadow-sm',
          'hover:bg-secondary-600 focus:ring-secondary',
          'disabled:hover:bg-secondary'
        ],
        outline: [
          'border border-gray-300 bg-white text-gray-700 shadow-sm',
          'hover:bg-gray-50 focus:ring-primary',
          'disabled:hover:bg-white'
        ],
        ghost: [
          'bg-transparent text-gray-600',
          'hover:bg-gray-100 hover:text-gray-900',
          'focus:ring-gray-500 disabled:hover:bg-transparent'
        ],
        danger: [
          'bg-danger text-white shadow-sm',
          'hover:bg-danger-600 focus:ring-danger',
          'disabled:hover:bg-danger'
        ],
        success: [
          'bg-success text-white shadow-sm',
          'hover:bg-success-600 focus:ring-success',
          'disabled:hover:bg-success'
        ],
        warning: [
          'bg-warning text-white shadow-sm',
          'hover:bg-warning-600 focus:ring-warning',
          'disabled:hover:bg-warning'
        ],
      },
      size: {
        xs: 'h-7 px-2 text-xs',
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-11 px-6 text-base',
        xl: 'h-12 px-8 text-base',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
  'data-testid'?: string;
}

const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  children,
  ref,
  'data-testid': testId,
  ...props
}) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        disabled={isDisabled}
        data-testid={testId}
        {...props}
      >
        {loading && (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
};

export default Button;
export { buttonVariants };