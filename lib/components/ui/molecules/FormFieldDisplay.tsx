import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

const formFieldDisplayVariants = cva(
  'bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md',
  {
    variants: {
      variant: {
        default: 'p-3',
        compact: 'p-2 text-sm',
      },
      minHeight: {
        sm: 'min-h-8',
        md: 'min-h-12',
        lg: 'min-h-16',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface FormFieldDisplayProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formFieldDisplayVariants> {
  children?: React.ReactNode;
}

const FormFieldDisplay: React.FC<FormFieldDisplayProps> = ({
  children,
  className,
  variant = 'default',
  minHeight,
  ...props
}) => {
  return (
    <div 
      className={cn(formFieldDisplayVariants({ variant, minHeight }), className)}
      {...props}
    >
      {children || (
        <span className="text-gray-500 dark:text-gray-400">Not specified</span>
      )}
    </div>
  );
};

export default FormFieldDisplay;