// Atoms
export * from './atoms';

// Molecules  
export * from './molecules';

// Organisms
export * from './organisms';

// Templates
export * from './templates';

// Design system types
export interface DesignTokens {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    danger: string;
    gray: Record<number, string>;
  };
  spacing: Record<string, string>;
  typography: {
    fontFamily: Record<string, string>;
    fontSize: Record<string, string>;
    fontWeight: Record<string, number>;
  };
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
}

// Component size variants
export type ComponentSize = 'sm' | 'md' | 'lg';

// Common component props
export interface BaseComponentProps {
  className?: string;
  'data-testid'?: string;
}