
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

export interface CheckboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// Checkbox group variants using class-variance-authority
const checkboxGroupVariants = cva(
  'grid gap-4',
  {
    variants: {
      columns: {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
      },
    },
    defaultVariants: {
      columns: 2,
    },
  }
);

const checkboxItemVariants = cva(
  'flex items-center gap-2 transition-opacity duration-200',
  {
    variants: {
      disabled: {
        true: 'cursor-not-allowed opacity-60',
        false: 'cursor-pointer opacity-100',
      },
    },
    defaultVariants: {
      disabled: false,
    },
  }
);

const checkboxVariants = cva(
  'h-4 w-4',
  {
    variants: {
      disabled: {
        true: 'cursor-not-allowed',
        false: 'cursor-pointer',
      },
    },
    defaultVariants: {
      disabled: false,
    },
  }
);

const labelVariants = cva(
  'text-sm text-slate-900 select-none transition-colors duration-200',
  {
    variants: {
      disabled: {
        true: 'cursor-not-allowed text-slate-500',
        false: 'cursor-pointer text-slate-900',
      },
    },
    defaultVariants: {
      disabled: false,
    },
  }
);

export interface CheckboxGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof checkboxGroupVariants> {
  options: CheckboxOption[];
  value: string[];
  onChange: (values: string[]) => void;
  disabled?: boolean;
  maxSelections?: number;
  columns?: 1 | 2 | 3 | 4;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  options,
  value = [],
  onChange,
  disabled = false,
  maxSelections,
  columns = 2,
  className,
  ...props
}) => {

  const handleChange = (optionValue: string) => {
    if (disabled) return;

    const isSelected = value.includes(optionValue);
    
    if (isSelected) {
      // Remove from selection
      onChange(value.filter(v => v !== optionValue));
    } else {
      // Add to selection (if not at max limit)
      if (!maxSelections || value.length < maxSelections) {
        onChange([...value, optionValue]);
      }
    }
  };

  const isOptionDisabled = (option: CheckboxOption) => {
    if (disabled || option.disabled) return true;
    
    // If max selections reached and this option is not selected
    if (maxSelections && value.length >= maxSelections && !value.includes(option.value)) {
      return true;
    }
    
    return false;
  };

  return (
    <div 
      className={cn(checkboxGroupVariants({ columns }), className)}
      {...props}
    >
      {options.map((option) => {
        const isSelected = value.includes(option.value);
        const isDisabled = isOptionDisabled(option);
        
        return (
          <label
            key={option.value}
            className={cn(checkboxItemVariants({ disabled: isDisabled }))}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleChange(option.value)}
              disabled={isDisabled}
              className={cn(checkboxVariants({ disabled: isDisabled }))}
            />
            <span
              className={cn(labelVariants({ disabled: isDisabled }))}
            >
              {option.label}
            </span>
          </label>
        );
      })}
    </div>
  );
};

export default CheckboxGroup;