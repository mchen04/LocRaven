import React from 'react';

interface FormFieldDisplayProps {
  children: React.ReactNode;
  className?: string;
  minHeight?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact';
}

const minHeightClasses = {
  sm: { minHeight: '2rem' },
  md: { minHeight: '3rem' },
  lg: { minHeight: '4rem' }
};

const FormFieldDisplay: React.FC<FormFieldDisplayProps> = ({
  children,
  className = '',
  minHeight,
  variant = 'default'
}) => {
  const baseStyles = {
    padding: '0.75rem',
    backgroundColor: 'var(--gray-50)',
    borderRadius: '0.375rem',
    border: '1px solid var(--border-primary)',
    ...minHeight ? minHeightClasses[minHeight] : {}
  };

  const compactStyles = {
    padding: '0.5rem',
    backgroundColor: 'var(--gray-50)',
    borderRadius: '0.375rem',
    border: '1px solid var(--border-primary)',
    fontSize: '0.875rem',
    ...minHeight ? minHeightClasses[minHeight] : {}
  };

  const styles = variant === 'compact' ? compactStyles : baseStyles;

  return (
    <div 
      style={styles}
      className={className}
    >
      {children || 'Not specified'}
    </div>
  );
};

export default FormFieldDisplay;