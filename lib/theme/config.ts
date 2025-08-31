/**
 * Simple Theme Configuration
 * 
 * Simple color mappings and semantic classes for consistent theming
 * across the application without the complexity of a full token system.
 */

// Simple theme configuration object
export const theme = {
  // Core colors - use these for consistency
  colors: {
    // Semantic colors (use these everywhere)
    primary: 'indigo-600',
    primaryLight: 'indigo-400', 
    primaryDark: 'indigo-700',
    secondary: 'purple-600',
    success: 'green-600',
    successLight: 'green-400',
    warning: 'yellow-600',
    warningLight: 'yellow-400', 
    danger: 'red-600',
    dangerLight: 'red-400',
    info: 'blue-600',
    
    // Grayscale
    gray: {
      50: 'gray-50',
      100: 'gray-100',
      200: 'gray-200',
      300: 'gray-300',
      400: 'gray-400',
      500: 'gray-500',
      600: 'gray-600',
      700: 'gray-700',
      800: 'gray-800',
      900: 'gray-900',
    },
    
    // Dark mode specific
    dark: {
      card: 'dark:bg-dark-card',
      darker: 'dark:bg-dark-darker',
      primary: 'dark:bg-dark',
    }
  },
  
  // Simple semantic classes - ready to use
  semantic: {
    // Text colors with dark mode support
    'text-primary': 'text-indigo-600 dark:text-indigo-400',
    'text-secondary': 'text-purple-600 dark:text-purple-400',
    'text-success': 'text-green-600 dark:text-green-400',
    'text-warning': 'text-yellow-600 dark:text-yellow-400',
    'text-danger': 'text-red-600 dark:text-red-400',
    'text-info': 'text-blue-600 dark:text-blue-400',
    'text-muted': 'text-gray-600 dark:text-gray-400',
    'text-default': 'text-gray-900 dark:text-gray-100',
    
    // Background colors with dark mode support
    'bg-primary': 'bg-indigo-600 dark:bg-indigo-500',
    'bg-primary-light': 'bg-indigo-50 dark:bg-indigo-900/20',
    'bg-secondary': 'bg-purple-600 dark:bg-purple-500',
    'bg-success': 'bg-green-50 dark:bg-green-900/20',
    'bg-warning': 'bg-yellow-50 dark:bg-yellow-900/20',
    'bg-danger': 'bg-red-50 dark:bg-red-900/20',
    'bg-card': 'bg-white dark:bg-dark-card',
    'bg-elevated': 'bg-white dark:bg-dark-card shadow-md',
    'bg-sidebar': 'bg-gray-900 dark:bg-dark-darker',
    
    // Border colors with dark mode support
    'border-primary': 'border-indigo-600 dark:border-indigo-400',
    'border-secondary': 'border-purple-600 dark:border-purple-400',
    'border-success': 'border-green-600 dark:border-green-400',
    'border-warning': 'border-yellow-600 dark:border-yellow-400',
    'border-danger': 'border-red-600 dark:border-red-400',
    'border-default': 'border-gray-200 dark:border-gray-700',
    'border-muted': 'border-gray-100 dark:border-gray-800',
    
    // Interactive states
    'hover-primary': 'hover:bg-indigo-50 dark:hover:bg-indigo-900/20',
    'hover-secondary': 'hover:bg-purple-50 dark:hover:bg-purple-900/20',
    'hover-gray': 'hover:bg-gray-100 dark:hover:bg-gray-800',
    'active-primary': 'bg-indigo-100 dark:bg-indigo-900/30',
    
    // Focus styles
    'focus-primary': 'focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
    'focus-danger': 'focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
  }
} as const;

// Color mapping for legacy hex colors to Tailwind classes
export const legacyColorMap = {
  // ChatDashboard legacy colors
  '#ececec': 'text-gray-200',
  '#8e8e8e': 'text-gray-500',
  '#212121': 'bg-gray-900',
  '#ffffff': 'text-white',
  '#9ca3af': 'text-gray-400',
  '#d1d5db': 'text-gray-300',
  '#6366f1': 'bg-indigo-600',
  '#f59e0b': 'bg-amber-500',
  '#10b981': 'bg-emerald-600',
  '#8b5cf6': 'bg-violet-600',
  '#ef4444': 'bg-red-600',
  
  // Background colors
  'rgba(255, 255, 255, 0.05)': 'bg-white/5',
  'rgba(255, 255, 255, 0.1)': 'bg-white/10',
  'rgba(255, 255, 255, 0.08)': 'bg-white/[0.08]',
  'rgba(0, 0, 0, 0.5)': 'bg-black/50',
} as const;

export type ThemeColors = typeof theme.colors;
export type SemanticClasses = typeof theme.semantic;
export type LegacyColors = typeof legacyColorMap;