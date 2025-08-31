

// Common layout patterns extracted as reusable components

export interface FlexCenterProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'row' | 'col';
  gap?: 'sm' | 'md' | 'lg';
}

export const FlexCenter: React.FC<FlexCenterProps> = ({ 
  children, 
  className = '', 
  direction = 'row',
  gap = 'md'
}) => {
  const gapClasses = {
    sm: direction === 'col' ? 'space-y-2' : 'space-x-2',
    md: direction === 'col' ? 'space-y-4' : 'space-x-4', 
    lg: direction === 'col' ? 'space-y-6' : 'space-x-6'
  };

  const directionClass = direction === 'col' ? 'flex-center-col' : 'flex-center';
  
  return (
    <div className={`${directionClass} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
};

export interface FlexBetweenProps {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
}

export const FlexBetween: React.FC<FlexBetweenProps> = ({ 
  children, 
  className = '',
  align = 'center'
}) => {
  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end'
  };

  return (
    <div className={`flex justify-between ${alignClasses[align]} ${className}`}>
      {children}
    </div>
  );
};

export interface GridResponsiveProps {
  children: React.ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4 | 'auto';
  gap?: 'sm' | 'md' | 'lg';
}

export const GridResponsive: React.FC<GridResponsiveProps> = ({ 
  children, 
  className = '',
  columns = 'auto',
  gap = 'md'
}) => {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  };

  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid grid-cols-1 md:grid-cols-2',
    3: 'grid-responsive',
    4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    auto: 'grid-auto'
  };

  return (
    <div className={`grid ${columnClasses[columns]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
};

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
}

export const Container: React.FC<ContainerProps> = ({ 
  children, 
  className = '',
  size = 'lg',
  padding = true
}) => {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl', 
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  };

  const paddingClass = padding ? 'px-4 sm:px-6 lg:px-8' : '';

  return (
    <div className={`${sizeClasses[size]} mx-auto ${paddingClass} ${className}`}>
      {children}
    </div>
  );
};

export interface SectionProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'sm' | 'md' | 'lg';
}

export const Section: React.FC<SectionProps> = ({ 
  children, 
  className = '',
  spacing = 'md'
}) => {
  const spacingClasses = {
    sm: 'space-y-4',
    md: 'space-y-section',
    lg: 'space-y-8'
  };

  return (
    <div className={`${spacingClasses[spacing]} ${className}`}>
      {children}
    </div>
  );
};