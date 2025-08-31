
import { ReactNode, HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

// Form field variants using class-variance-authority
const formFieldVariants = cva(
  'mb-6'
);

const labelVariants = cva(
  'block font-semibold text-slate-700 mb-2 text-sm'
);

const requiredVariants = cva(
  'text-red-500 ml-1'
);

const errorVariants = cva(
  'text-red-500 text-xs mt-1 flex items-start gap-1'
);

const helpTextVariants = cva(
  'text-slate-500 text-xs mt-1'
);

export interface FormFieldProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formFieldVariants> {
  label?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  children: React.ReactNode;
  id?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  helpText,
  children,
  className,
  id,
  ...props
}) => {
  const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div 
      className={cn(formFieldVariants(), className)}
      {...props}
    >
      {label && (
        <label 
          htmlFor={fieldId} 
          className={cn(labelVariants())}
        >
          {label}
          {required && (
            <span 
              className={cn(requiredVariants())} 
              aria-label="Required"
            >
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
          className={cn(errorVariants())}
          role="alert"
          aria-live="polite"
        >
          ⚠️ {error}
        </div>
      )}

      {helpText && !error && (
        <div
          id={`${fieldId}-help`}
          className={cn(helpTextVariants())}
        >
          {helpText}
        </div>
      )}
    </div>
  );
};

export default FormField;