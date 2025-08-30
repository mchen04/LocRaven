import React from 'react';
import { colors, spacing, typography } from '../../../theme/tokens';

export interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  helpText,
  children,
  className = '',
  id,
}) => {
  const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;

  const containerStyles: React.CSSProperties = {
    marginBottom: spacing[6],
  };

  const labelStyles: React.CSSProperties = {
    display: 'block',
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
    marginBottom: spacing[2],
    fontSize: typography.fontSize.sm,
  };

  const requiredStyles: React.CSSProperties = {
    color: colors.danger.DEFAULT,
    marginLeft: spacing[1],
  };

  const errorStyles: React.CSSProperties = {
    color: colors.danger.DEFAULT,
    fontSize: typography.fontSize.xs,
    marginTop: spacing[1],
    display: 'flex',
    alignItems: 'flex-start',
    gap: spacing[1],
  };

  const helpTextStyles: React.CSSProperties = {
    color: colors.text.muted,
    fontSize: typography.fontSize.xs,
    marginTop: spacing[1],
  };

  return (
    <div style={containerStyles} className={className}>
      {label && (
        <label htmlFor={fieldId} style={labelStyles}>
          {label}
          {required && (
            <span style={requiredStyles} aria-label="Required">
              *
            </span>
          )}
        </label>
      )}
      
      <div>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            const additionalProps = {
              id: fieldId,
              'aria-invalid': error ? 'true' : 'false',
              'aria-describedby': error ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined,
            };
            return React.cloneElement(child as React.ReactElement<any>, Object.assign({}, child.props, additionalProps));
          }
          return child;
        })}
      </div>

      {error && (
        <div
          id={`${fieldId}-error`}
          style={errorStyles}
          role="alert"
          aria-live="polite"
        >
          ⚠️ {error}
        </div>
      )}

      {helpText && !error && (
        <div
          id={`${fieldId}-help`}
          style={helpTextStyles}
        >
          {helpText}
        </div>
      )}
    </div>
  );
};

export default FormField;