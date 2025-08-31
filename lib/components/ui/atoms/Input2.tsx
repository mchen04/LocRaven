import React, { forwardRef } from 'react';

export interface Input2Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'error' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  error?: boolean;
}

const Input2 = forwardRef<HTMLInputElement, Input2Props>(
  (
    {
      variant = 'default',
      size = 'md',
      fullWidth = true,
      startIcon,
      endIcon,
      error = false,
      className = '',
      disabled = false,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'form-input-base focus-ring transition-colors duration-200';
    
    const variantClasses = {
      default: '',
      error: 'form-input-error',
      success: 'border-success focus:ring-green-500 focus:border-green-500'
    };

    const sizeClasses = {
      sm: 'px-2 py-1 text-sm',
      md: 'px-3 py-2 text-base', 
      lg: 'px-4 py-3 text-lg'
    };

    const iconClasses = {
      container: 'relative flex items-center',
      startIcon: 'absolute left-3 text-gray-400 pointer-events-none',
      endIcon: 'absolute right-3 text-gray-400 pointer-events-none',
      inputWithStartIcon: 'pl-10',
      inputWithEndIcon: 'pr-10'
    };

    const inputClasses = [
      baseClasses,
      variantClasses[error ? 'error' : variant],
      sizeClasses[size],
      fullWidth ? 'w-full' : '',
      disabled ? 'btn-disabled' : '',
      startIcon ? iconClasses.inputWithStartIcon : '',
      endIcon ? iconClasses.inputWithEndIcon : '',
      className
    ].filter(Boolean).join(' ');

    if (startIcon || endIcon) {
      return (
        <div className={`${iconClasses.container} ${fullWidth ? 'w-full' : 'inline-block'}`}>
          {startIcon && (
            <div className={iconClasses.startIcon}>
              {startIcon}
            </div>
          )}
          
          <input
            ref={ref}
            className={inputClasses}
            disabled={disabled}
            {...props}
          />
          
          {endIcon && (
            <div className={iconClasses.endIcon}>
              {endIcon}
            </div>
          )}
        </div>
      );
    }

    return (
      <input
        ref={ref}
        className={inputClasses}
        disabled={disabled}
        {...props}
      />
    );
  }
);

Input2.displayName = 'Input2';

export default Input2;