

// Typography utility components with consistent styling

export interface HeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'muted' | 'error' | 'success' | 'warning';
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span';
}

export const Heading: React.FC<HeadingProps> = ({
  children,
  level = 1,
  size,
  weight = 'semibold',
  color = 'primary',
  className = '',
  as
}) => {
  const Component = as || (`h${level}` as any);
  
  // Auto-size based on level if size not provided
  const defaultSizes = {
    1: '3xl',
    2: '2xl', 
    3: 'xl',
    4: 'lg',
    5: 'md',
    6: 'sm'
  } as const;

  const actualSize = size || defaultSizes[level];

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl'
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  const colorClasses = {
    primary: 'text-gray-900 dark:text-gray-100',
    secondary: 'text-gray-700 dark:text-gray-300',
    muted: 'text-gray-600 dark:text-gray-400',
    error: 'text-red-600 dark:text-red-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400'
  };

  return (
    <Component 
      className={`${sizeClasses[actualSize]} ${weightClasses[weight]} ${colorClasses[color]} ${className}`}
    >
      {children}
    </Component>
  );
};

export interface TextProps {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'muted' | 'error' | 'success' | 'warning';
  align?: 'left' | 'center' | 'right' | 'justify';
  className?: string;
  as?: 'p' | 'span' | 'div';
  italic?: boolean;
  underline?: boolean;
}

export const Text: React.FC<TextProps> = ({
  children,
  size = 'md',
  weight = 'normal',
  color = 'primary',
  align = 'left',
  className = '',
  as = 'p',
  italic = false,
  underline = false
}) => {
  const Component = as;

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm', 
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  const colorClasses = {
    primary: 'text-gray-900 dark:text-gray-100',
    secondary: 'text-gray-700 dark:text-gray-300',
    muted: 'text-gray-600 dark:text-gray-400',
    error: 'text-red-600 dark:text-red-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400'
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  };

  const additionalClasses = [
    italic && 'italic',
    underline && 'underline'
  ].filter(Boolean).join(' ');

  return (
    <Component 
      className={`${sizeClasses[size]} ${weightClasses[weight]} ${colorClasses[color]} ${alignClasses[align]} ${additionalClasses} ${className}`}
    >
      {children}
    </Component>
  );
};

export interface LabelProps {
  children: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
  size?: 'sm' | 'md' | 'lg';
  weight?: 'normal' | 'medium' | 'semibold';
  className?: string;
}

export const Label: React.FC<LabelProps> = ({
  children,
  required = false,
  htmlFor,
  size = 'md',
  weight = 'medium',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold'
  };

  return (
    <label 
      htmlFor={htmlFor}
      className={`block ${sizeClasses[size]} ${weightClasses[weight]} text-gray-700 dark:text-gray-300 mb-2 ${className}`}
    >
      {children}
      {required && (
        <span className="text-red-500 ml-1" aria-label="Required">
          *
        </span>
      )}
    </label>
  );
};

export interface CodeProps {
  children: React.ReactNode;
  inline?: boolean;
  language?: string;
  className?: string;
}

export const Code: React.FC<CodeProps> = ({
  children,
  inline = true,
  language,
  className = ''
}) => {
  const baseClasses = 'font-mono bg-gray-100 dark:bg-gray-800';
  
  if (inline) {
    return (
      <code className={`${baseClasses} px-1 py-0.5 rounded text-sm ${className}`}>
        {children}
      </code>
    );
  }

  return (
    <pre className={`${baseClasses} p-4 rounded-lg overflow-x-auto ${className}`}>
      <code className={language ? `language-${language}` : ''}>
        {children}
      </code>
    </pre>
  );
};

export interface LinkProps {
  children: React.ReactNode;
  href: string;
  external?: boolean;
  color?: 'primary' | 'secondary' | 'muted';
  underline?: 'none' | 'hover' | 'always';
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const Link: React.FC<LinkProps> = ({
  children,
  href,
  external = false,
  color = 'primary',
  underline = 'hover',
  className = '',
  onClick
}) => {
  const colorClasses = {
    primary: 'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300',
    secondary: 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200',
    muted: 'text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
  };

  const underlineClasses = {
    none: 'no-underline',
    hover: 'hover:underline',
    always: 'underline'
  };

  const externalProps = external ? {
    target: '_blank',
    rel: 'noopener noreferrer'
  } : {};

  return (
    <a
      href={href}
      className={`${colorClasses[color]} ${underlineClasses[underline]} transition-colors duration-200 ${className}`}
      onClick={onClick}
      {...externalProps}
    >
      {children}
      {external && (
        <span className="inline-block ml-1 w-3 h-3">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
          </svg>
        </span>
      )}
    </a>
  );
};