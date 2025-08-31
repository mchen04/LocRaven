'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';
import { AlertCircle } from 'lucide-react';

const formErrorVariants = cva(
  'flex items-center gap-2 text-red-600 dark:text-red-400',
  {
    variants: {
      variant: {
        inline: 'text-sm',
        card: 'p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-md',
        toast: 'px-4 py-2 bg-red-600 text-white rounded-md shadow-lg',
      },
      size: {
        sm: 'text-xs',
        md: 'text-sm', 
        lg: 'text-base',
      },
    },
    defaultVariants: {
      variant: 'inline',
      size: 'md',
    },
  }
);

const iconSizeMap = {
  inline: { sm: 12, md: 14, lg: 16 },
  card: { sm: 16, md: 20, lg: 24 },
  toast: { sm: 14, md: 16, lg: 18 },
};

export interface FormErrorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formErrorVariants> {
  error?: string | null;
  showIcon?: boolean;
}

const FormError: React.FC<FormErrorProps> = ({
  error,
  className,
  variant = 'inline',
  size = 'md',
  showIcon = true,
  ...props
}) => {
  if (!error) return null;

  const iconSize = iconSizeMap[variant!][size!];
  const Component = variant === 'inline' ? 'span' : 'div';

  return (
    <Component
      className={cn(formErrorVariants({ variant, size }), className)}
      {...props}
    >
      {showIcon && (
        <AlertCircle 
          size={iconSize} 
          className="flex-shrink-0" 
          aria-hidden="true"
        />
      )}
      <span>{error}</span>
    </Component>
  );
};

export default FormError;