import React from 'react';

export interface FormField2Props {
  label?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
  variant?: 'default' | 'compact';
  labelPosition?: 'top' | 'left' | 'floating';
}

const FormField2: React.FC<FormField2Props> = ({
  label,
  required = false,
  error,
  helpText,
  children,
  className = '',
  id,
  variant = 'default',
  labelPosition = 'top',
}) => {
  const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;

  const labelClasses = {
    default: 'block text-sm font-semibold text-gray-700 dark:text-gray-300',
    compact: 'block text-xs font-medium text-gray-600 dark:text-gray-400'
  };

  const containerClasses = {
    default: 'mb-6',
    compact: 'mb-4'
  };

  const layoutClasses = {
    top: 'flex flex-col',
    left: 'flex items-center gap-4',
    floating: 'relative'
  };

  const renderLabel = () => (
    <label 
      htmlFor={fieldId} 
      className={`${labelClasses[variant]} ${labelPosition === 'left' ? 'min-w-[120px]' : 'mb-2'}`}
    >
      {label}
      {required && (
        <span className="text-red-500 ml-1" aria-label="Required">
          *
        </span>
      )}
    </label>
  );

  const renderFloatingLabel = () => (
    <label 
      htmlFor={fieldId}
      className="absolute left-3 -top-2.5 text-sm font-medium text-gray-600 bg-white px-1 transition-all duration-200"
    >
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  return (
    <div className={`${containerClasses[variant]} ${className}`}>
      <div className={layoutClasses[labelPosition]}>
        {label && labelPosition !== 'floating' && renderLabel()}
        
        <div className={`${labelPosition === 'left' ? 'flex-1' : ''} relative`}>
          {labelPosition === 'floating' && label && renderFloatingLabel()}
          
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              const childElement = child as React.ReactElement<any>;
              const additionalProps = {
                id: fieldId,
                'aria-invalid': error ? 'true' : 'false',
                'aria-describedby': error 
                  ? `${fieldId}-error` 
                  : helpText 
                  ? `${fieldId}-help` 
                  : undefined,
                className: `${childElement.props.className || ''} ${error ? 'border-red-500 focus:border-red-500' : ''}`.trim()
              };
              return React.cloneElement(childElement, {
                ...childElement.props,
                ...additionalProps
              });
            }
            return child;
          })}
        </div>
      </div>

      {error && (
        <div
          id={`${fieldId}-error`}
          className={`flex items-start gap-1 ${variant === 'compact' ? 'text-xs' : 'text-sm'} text-red-600 mt-1`}
          role="alert"
          aria-live="polite"
        >
          <span className="text-red-500">⚠️</span>
          {error}
        </div>
      )}

      {helpText && !error && (
        <div
          id={`${fieldId}-help`}
          className={`${variant === 'compact' ? 'text-xs' : 'text-sm'} text-gray-500 dark:text-gray-400 mt-1`}
        >
          {helpText}
        </div>
      )}
    </div>
  );
};

export default FormField2;