import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

// Input variants using class-variance-authority
const inputVariants = cva(
  // Base classes - common styles for all inputs
  [
    'flex w-full rounded-md border bg-white px-3 py-2',
    'text-sm ring-offset-white file:border-0 file:bg-transparent',
    'file:text-sm file:font-medium placeholder:text-gray-500',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'transition-colors duration-200'
  ],
  {
    variants: {
      variant: {
        default: [
          'border-gray-300 focus:border-primary focus:ring-primary'
        ],
        error: [
          'border-danger focus:border-danger focus:ring-danger',
          'bg-danger-50 dark:bg-danger-950/10'
        ],
        success: [
          'border-success focus:border-success focus:ring-success',
          'bg-success-50 dark:bg-success-950/10'
        ],
      },
      size: {
        sm: 'h-9 px-3 py-1 text-xs',
        md: 'h-10 px-3 py-2 text-sm',
        lg: 'h-11 px-4 py-2 text-base',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      fullWidth: true,
    },
  }
);

// Container variants for icon positioning
const containerVariants = cva(
  'relative',
  {
    variants: {
      fullWidth: {
        true: 'w-full',
        false: 'inline-block',
      },
    },
    defaultVariants: {
      fullWidth: true,
    },
  }
);

// Icon wrapper variants
const iconVariants = cva(
  'absolute top-1/2 -translate-y-1/2 flex items-center text-gray-400 pointer-events-none',
  {
    variants: {
      position: {
        start: 'left-3',
        end: 'right-3',
      },
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  error?: boolean;
  ref?: React.Ref<HTMLInputElement>;
}

const Input = ({
  className,
  variant = 'default',
  size = 'md',
  fullWidth = true,
  startIcon,
  endIcon,
  error = false,
  disabled = false,
  ref,
  ...props
}: InputProps) => {
    // Determine final variant based on error state
    const finalVariant = error ? 'error' : variant;

    // Calculate padding adjustments for icons
    const paddingClass = cn(
      startIcon && (size === 'sm' ? 'pl-8' : size === 'lg' ? 'pl-12' : 'pl-10'),
      endIcon && (size === 'sm' ? 'pr-8' : size === 'lg' ? 'pr-12' : 'pr-10')
    );

    return (
      <div className={containerVariants({ fullWidth })}>
        {startIcon && (
          <div className={iconVariants({ position: 'start' })}>
            {startIcon}
          </div>
        )}
        
        <input
          ref={ref}
          className={cn(
            inputVariants({ variant: finalVariant, size, fullWidth }),
            paddingClass,
            className
          )}
          disabled={disabled}
          {...props}
        />
        
        {endIcon && (
          <div className={iconVariants({ position: 'end' })}>
            {endIcon}
          </div>
        )}
      </div>
    );
};

Input.displayName = 'Input';

export default Input;
export { inputVariants };