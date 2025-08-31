

export interface FormDisplayProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'compact' | 'minimal' | 'highlighted';
  minHeight?: 'sm' | 'md' | 'lg';
  emptyText?: string;
}

const FormDisplay: React.FC<FormDisplayProps> = ({
  children,
  className = '',
  variant = 'default',
  minHeight,
  emptyText = 'Not specified'
}) => {
  const minHeightClasses = {
    sm: 'min-h-[2rem]',
    md: 'min-h-[3rem]', 
    lg: 'min-h-[4rem]'
  };

  const variantClasses = {
    default: 'bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2',
    compact: 'bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 text-sm',
    minimal: 'text-gray-900 dark:text-gray-100 py-1',
    highlighted: 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-md px-3 py-2'
  };

  const content = children || (
    <span className="text-gray-500 dark:text-gray-400 italic">
      {emptyText}
    </span>
  );

  return (
    <div 
      className={`
        ${variantClasses[variant]} 
        ${minHeight ? minHeightClasses[minHeight] : ''} 
        ${className}
        flex items-center
      `.trim()}
    >
      {content}
    </div>
  );
};

export default FormDisplay;