import React, { forwardRef } from 'react';
import { colors, spacing, radius, typography } from '../../../theme/tokens';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'error' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
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
    // Base input styles using design tokens
    const baseStyles: React.CSSProperties = {
      width: fullWidth ? '100%' : 'auto',
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize.base,
      lineHeight: typography.lineHeight.normal,
      borderRadius: radius.md,
      border: `1px solid ${colors.border.primary}`,
      backgroundColor: disabled ? colors.gray[100] : colors.white,
      color: disabled ? colors.text.muted : colors.text.primary,
      cursor: disabled ? 'not-allowed' : 'text',
      transition: 'all 0.2s ease',
      outline: 'none',
    };

    // Size-specific styles
    const sizeStyles: Record<string, React.CSSProperties> = {
      sm: {
        padding: `${spacing[2]} ${spacing[3]}`,
        fontSize: typography.fontSize.sm,
      },
      md: {
        padding: `${spacing[3]} ${spacing[4]}`,
        fontSize: typography.fontSize.base,
      },
      lg: {
        padding: `${spacing[4]} ${spacing[5]}`,
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
        backgroundColor: `${colors.danger.DEFAULT}05`, // 5% opacity
      },
      success: {
        borderColor: colors.success.DEFAULT,
        backgroundColor: `${colors.success.DEFAULT}05`, // 5% opacity
      },
    };

    // Focus styles
    const focusStyles: React.CSSProperties = {
      borderColor: error ? colors.danger.DEFAULT : colors.primary.DEFAULT,
      boxShadow: `0 0 0 3px ${error ? colors.danger.DEFAULT : colors.primary.DEFAULT}1A`, // 10% opacity
    };

    // Icon wrapper styles
    const iconWrapperStyles: React.CSSProperties = {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      alignItems: 'center',
      color: colors.text.muted,
      pointerEvents: 'none',
    };

    const startIconStyles: React.CSSProperties = {
      ...iconWrapperStyles,
      left: spacing[3],
    };

    const endIconStyles: React.CSSProperties = {
      ...iconWrapperStyles,
      right: spacing[3],
    };

    // Adjust padding for icons
    const inputWithIconsStyles: React.CSSProperties = {
      paddingLeft: startIcon ? spacing[10] : undefined,
      paddingRight: endIcon ? spacing[10] : undefined,
    };

    // Combine all styles
    const combinedStyles: React.CSSProperties = {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[error ? 'error' : variant],
      ...inputWithIconsStyles,
    };

    const containerStyles: React.CSSProperties = {
      position: 'relative',
      display: 'inline-block',
      width: fullWidth ? '100%' : 'auto',
    };

    return (
      <div style={containerStyles}>
        {startIcon && (
          <div style={startIconStyles}>
            {startIcon}
          </div>
        )}
        
        <input
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
        />
        
        {endIcon && (
          <div style={endIconStyles}>
            {endIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;