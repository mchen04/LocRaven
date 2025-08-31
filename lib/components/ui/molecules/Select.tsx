import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// Select variants using class-variance-authority
const selectVariants = cva(
  [
    'font-sans leading-normal rounded-md border outline-none transition-all duration-200',
    'appearance-none cursor-pointer',
    'bg-[length:1.5em_1.5em] bg-no-repeat bg-[position:right_0.5rem_center]',
    'bg-[image:url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e")]',
    'focus:ring-3 focus:ring-opacity-10',
    'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500',
  ],
  {
    variants: {
      variant: {
        default: 'border-gray-300 bg-white text-slate-900 focus:border-primary focus:ring-primary',
        error: 'border-red-500 bg-red-50 text-slate-900 focus:border-red-500 focus:ring-red-500',
        success: 'border-green-500 bg-green-50 text-slate-900 focus:border-green-500 focus:ring-green-500',
      },
      size: {
        sm: 'py-2 pl-3 pr-8 text-sm',
        md: 'py-3 pl-4 pr-8 text-base',
        lg: 'py-4 pl-5 pr-10 text-lg',
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

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof selectVariants> {
  options: SelectOption[];
  placeholder?: string;
  variant?: 'default' | 'error' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  error?: boolean;
  ref?: React.Ref<HTMLSelectElement>;
}

const Select = ({
  options,
  placeholder,
  variant = 'default',
  size = 'md',
  fullWidth = true,
  error = false,
  className,
  disabled = false,
  ref,
  ...props
}: SelectProps) => {
    // Determine the actual variant to use (error prop overrides variant prop)
    const actualVariant = error ? 'error' : variant;

    return (
      <select
        ref={ref}
        className={cn(
          selectVariants({ 
            variant: actualVariant, 
            size, 
            fullWidth 
          }), 
          className
        )}
        disabled={disabled}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    );
};

Select.displayName = 'Select';

export default Select;