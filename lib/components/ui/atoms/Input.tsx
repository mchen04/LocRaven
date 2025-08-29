import React, { forwardRef } from 'react';

export interface InputProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  success?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  'data-testid'?: string;
  'aria-describedby'?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  placeholder,
  type = 'text',
  value,
  defaultValue,
  disabled = false,
  required = false,
  error,
  success = false,
  size = 'md',
  className = '',
  onChange,
  onBlur,
  onFocus,
  'data-testid': testId,
  'aria-describedby': ariaDescribedBy,
  ...props
}, ref) => {
  const baseClasses = 'block w-full border rounded-lg bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed';
  
  const sizeClasses = {
    sm: 'py-1.5 px-2 text-sm',
    md: 'py-2 px-3 text-sm',
    lg: 'py-3 px-4 text-base'
  };

  const stateClasses = error 
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : success
    ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
    : 'border-gray-300 focus:border-primary focus:ring-primary';

  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${stateClasses} ${className}`;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        required={required}
        className={combinedClasses}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        data-testid={testId}
        aria-describedby={ariaDescribedBy}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;