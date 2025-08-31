/**
 * Compound Form Component
 * Provides a unified, composable API for form creation with consistent styling and behavior
 */

import React, { createContext, useContext, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';
import FormField from '../molecules/FormField';
import FormSection from '../molecules/FormSection';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import Select from '../molecules/Select';
import CheckboxGroup from '../molecules/CheckboxGroup';
import TagInput from '../molecules/TagInput';

// Form context for sharing configuration
interface FormContextValue {
  size: 'sm' | 'md' | 'lg';
  variant: 'default' | 'compact' | 'spacious';
  disabled: boolean;
}

const FormContext = createContext<FormContextValue>({
  size: 'md',
  variant: 'default',
  disabled: false,
});

// Form root variants
const formVariants = cva(
  'space-y-6',
  {
    variants: {
      variant: {
        default: 'space-y-6',
        compact: 'space-y-4',
        spacious: 'space-y-8',
      },
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

// Form root component
export interface FormProps
  extends React.FormHTMLAttributes<HTMLFormElement>,
    VariantProps<typeof formVariants> {
  children: React.ReactNode;
  disabled?: boolean;
}

const FormRoot = forwardRef<HTMLFormElement, FormProps>(
  ({ 
    children, 
    className, 
    variant = 'default', 
    size = 'md', 
    disabled = false,
    ...props 
  }, ref) => {
    const contextValue: FormContextValue = {
      size: size || 'md',
      variant: variant || 'default', 
      disabled: disabled || false,
    };

    return (
      <FormContext.Provider value={contextValue}>
        <form
          ref={ref}
          className={cn(formVariants({ variant, size }), className)}
          {...props}
        >
          {children}
        </form>
      </FormContext.Provider>
    );
  }
);

FormRoot.displayName = 'Form';

// Enhanced FormField that uses context
const FormFieldWithContext: React.FC<React.ComponentProps<typeof FormField>> = (props) => {
  const { size } = useContext(FormContext);
  
  return (
    <FormField
      {...props}
      className={cn(
        size === 'sm' && 'text-sm',
        size === 'lg' && 'text-lg',
        props.className
      )}
    />
  );
};

FormFieldWithContext.displayName = 'Form.Field';

// Enhanced FormSection that uses context
const FormSectionWithContext: React.FC<React.ComponentProps<typeof FormSection>> = (props) => {
  const { variant } = useContext(FormContext);
  
  return (
    <FormSection
      {...props}
      className={cn(
        variant === 'compact' && 'mb-4',
        variant === 'spacious' && 'mb-8',
        props.className
      )}
    />
  );
};

FormSectionWithContext.displayName = 'Form.Section';

// Form actions wrapper
const formActionsVariants = cva(
  'flex gap-3',
  {
    variants: {
      align: {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end',
        between: 'justify-between',
      },
      direction: {
        row: 'flex-row',
        column: 'flex-col',
      },
    },
    defaultVariants: {
      align: 'right',
      direction: 'row',
    },
  }
);

interface FormActionsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formActionsVariants> {
  children: React.ReactNode;
}

const FormActions = forwardRef<HTMLDivElement, FormActionsProps>(
  ({ children, className, align, direction, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(formActionsVariants({ align, direction }), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FormActions.displayName = 'Form.Actions';

// Form group for related fields
const formGroupVariants = cva(
  'space-y-4 p-4 border border-gray-200 rounded-lg',
  {
    variants: {
      variant: {
        default: 'border-gray-200 bg-gray-50',
        outlined: 'border-gray-300 bg-white',
        minimal: 'border-transparent bg-transparent p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface FormGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formGroupVariants> {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

const FormGroup = forwardRef<HTMLDivElement, FormGroupProps>(
  ({ children, className, variant, title, description, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(formGroupVariants({ variant }), className)}
        {...props}
      >
        {(title || description) && (
          <div className="mb-4">
            {title && (
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                {title}
              </h4>
            )}
            {description && (
              <p className="text-sm text-gray-600">{description}</p>
            )}
          </div>
        )}
        <div className="space-y-4">{children}</div>
      </div>
    );
  }
);

FormGroup.displayName = 'Form.Group';

// Compound component export
export const Form = Object.assign(FormRoot, {
  Field: FormFieldWithContext,
  Section: FormSectionWithContext,
  Actions: FormActions,
  Group: FormGroup,
  
  // Re-export form controls for convenience
  Input,
  Select,
  CheckboxGroup,
  TagInput,
  Button,
});

// Export individual components for flexibility
export { FormFieldWithContext as FormField };
export { FormSectionWithContext as FormSection };
export { FormActions };
export { FormGroup };

// Export types
export type { FormActionsProps, FormGroupProps };