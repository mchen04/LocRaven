

interface CenteredLayoutProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'fullscreen' | 'auth';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const CenteredLayout: React.FC<CenteredLayoutProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md'
}) => {
  const baseClasses = 'flex items-center justify-center bg-gray-50 dark:bg-gray-900';
  
  const variantClasses = {
    default: 'min-h-[50vh]',
    fullscreen: 'min-h-screen',
    auth: 'min-h-screen'
  };

  const paddingClasses = {
    none: '',
    sm: 'px-2 py-2',
    md: 'px-4 py-4 sm:px-6 lg:px-8',
    lg: 'px-8 py-8 sm:px-12 lg:px-16'
  };

  const combinedClasses = [
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={combinedClasses}>
      {children}
    </div>
  );
};

export default CenteredLayout;