import React, { forwardRef } from 'react';
import { colors, spacing, radius, typography } from '../../../theme/tokens';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[];
  placeholder?: string;
  variant?: 'default' | 'error' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  error?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      placeholder,
      variant = 'default',
      size = 'md',
      fullWidth = true,
      error = false,
      className = '',
      disabled = false,
      ...props
    },
    ref
  ) => {
    // Base select styles using design tokens
    const baseStyles: React.CSSProperties = {
      width: fullWidth ? '100%' : 'auto',
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize.base,
      lineHeight: typography.lineHeight.normal,
      borderRadius: radius.md,
      border: `1px solid ${colors.border.primary}`,
      backgroundColor: disabled ? colors.gray[100] : colors.white,
      color: disabled ? colors.text.muted : colors.text.primary,
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      outline: 'none',
      appearance: 'none',
      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
      backgroundPosition: 'right 0.5rem center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '1.5em 1.5em',
    };

    // Size-specific styles
    const sizeStyles: Record<string, React.CSSProperties> = {
      sm: {
        padding: `${spacing[2]} ${spacing[8]} ${spacing[2]} ${spacing[3]}`,
        fontSize: typography.fontSize.sm,
      },
      md: {
        padding: `${spacing[3]} ${spacing[8]} ${spacing[3]} ${spacing[4]}`,
        fontSize: typography.fontSize.base,
      },
      lg: {
        padding: `${spacing[4]} ${spacing[10]} ${spacing[4]} ${spacing[5]}`,
        fontSize: typography.fontSize.lg,
      },
    };

    // Variant-specific styles
    const variantStyles: Record<string, React.CSSProperties> = {
      default: {
        borderColor: colors.border.primary,
      },
      error: {
        borderColor: colors.danger.DEFAULT,
        backgroundColor: disabled ? colors.gray[100] : `${colors.danger.DEFAULT}05`,
      },
      success: {
        borderColor: colors.success.DEFAULT,
        backgroundColor: disabled ? colors.gray[100] : `${colors.success.DEFAULT}05`,
      },
    };

    // Focus styles
    const focusStyles: React.CSSProperties = {
      borderColor: error ? colors.danger.DEFAULT : colors.primary.DEFAULT,
      boxShadow: `0 0 0 3px ${error ? colors.danger.DEFAULT : colors.primary.DEFAULT}1A`, // 10% opacity
    };

    // Combine all styles
    const combinedStyles: React.CSSProperties = {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[error ? 'error' : variant],
    };

    return (
      <select
        ref={ref}
        style={combinedStyles}
        className={className}
        disabled={disabled}
        onFocus={(e) => {
          Object.assign(e.currentTarget.style, focusStyles);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          Object.assign(e.currentTarget.style, variantStyles[error ? 'error' : variant]);
          props.onBlur?.(e);
        }}
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
  }
);

Select.displayName = 'Select';

export default Select;