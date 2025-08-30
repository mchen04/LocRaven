import React from 'react';
import { colors, shadows, spacing, radius, typography, animations } from '../../../theme/tokens';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  fullWidth?: boolean;
  'data-testid'?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  className = '',
  fullWidth = false,
  'data-testid': testId,
}) => {
  // Base button styles using CSS variables
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: colors.text.primary,
    fontWeight: typography.fontWeight.medium,
    borderRadius: radius.lg,
    border: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: `all ${animations.transition.base}`,
    opacity: disabled || loading ? '0.5' : '1',
    width: fullWidth ? '100%' : 'auto',
    outline: 'none',
    position: 'relative',
    textDecoration: 'none',
    userSelect: 'none',
  };

  // Variant-specific styles using design tokens
  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: colors.primary.DEFAULT,
      color: colors.white,
      boxShadow: shadows.sm,
    },
    secondary: {
      backgroundColor: colors.secondary.DEFAULT,
      color: colors.white,
      boxShadow: shadows.sm,
    },
    outline: {
      backgroundColor: colors.white,
      color: colors.gray[700],
      border: `1px solid ${colors.border.primary}`,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.text.secondary,
    },
    danger: {
      backgroundColor: colors.danger.DEFAULT,
      color: colors.white,
      boxShadow: shadows.sm,
    },
    success: {
      backgroundColor: colors.success.DEFAULT,
      color: colors.white,
      boxShadow: shadows.sm,
    },
    warning: {
      backgroundColor: colors.warning.DEFAULT,
      color: colors.white,
      boxShadow: shadows.sm,
    },
  };

  // Size-specific styles
  const sizeStyles: Record<string, React.CSSProperties> = {
    xs: {
      padding: `${spacing[1]} ${spacing[2]}`,
      fontSize: typography.fontSize.xs,
    },
    sm: {
      padding: `${spacing[1.5]} ${spacing[3]}`,
      fontSize: typography.fontSize.sm,
    },
    md: {
      padding: `${spacing[2]} ${spacing[4]}`,
      fontSize: typography.fontSize.sm,
    },
    lg: {
      padding: `${spacing[3]} ${spacing[6]}`,
      fontSize: typography.fontSize.base,
    },
    xl: {
      padding: `${spacing[4]} ${spacing[8]}`,
      fontSize: typography.fontSize.lg,
    },
  };

  // Hover and focus styles (applied via CSS-in-JS hover states)
  const getHoverStyles = (variant: string): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: colors.primary.dark };
      case 'secondary':
        return { backgroundColor: colors.secondary[600] };
      case 'outline':
        return { backgroundColor: colors.gray[50], borderColor: colors.gray[400] };
      case 'ghost':
        return { backgroundColor: colors.gray[100] };
      case 'danger':
        return { backgroundColor: colors.danger[600] };
      case 'success':
        return { backgroundColor: colors.success[600] };
      case 'warning':
        return { backgroundColor: colors.warning[600] };
      default:
        return {};
    }
  };

  // Focus styles
  const focusStyles: React.CSSProperties = {
    boxShadow: `0 0 0 3px ${colors.primary.DEFAULT}1A`, // 1A = 10% opacity in hex
  };

  // Combine all styles
  const combinedStyles: React.CSSProperties = {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size],
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div
      style={{
        marginRight: spacing[2],
        width: spacing[4],
        height: spacing[4],
        border: `2px solid currentColor`,
        borderTop: '2px solid transparent',
        borderRadius: radius.full,
        animation: 'spin 1s linear infinite',
      }}
    />
  );

  return (
    <button
      type={type}
      style={combinedStyles}
      className={className}
      disabled={disabled || loading}
      onClick={onClick}
      data-testid={testId}
      aria-disabled={disabled || loading}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          Object.assign(e.currentTarget.style, getHoverStyles(variant));
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          Object.assign(e.currentTarget.style, variantStyles[variant]);
        }
      }}
      onFocus={(e) => {
        Object.assign(e.currentTarget.style, focusStyles);
      }}
      onBlur={(e) => {
        Object.assign(e.currentTarget.style, { boxShadow: variantStyles[variant].boxShadow || 'none' });
      }}
    >
      {loading && <LoadingSpinner />}
      {children}
    </button>
  );
};

export default Button;