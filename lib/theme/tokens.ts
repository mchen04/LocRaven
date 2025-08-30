/**
 * Design Tokens - TypeScript constants that mirror CSS variables
 * Provides type safety and IDE autocomplete for design system values
 */

// Color Tokens
export const colors = {
  // Primary Colors
  primary: {
    50: 'var(--primary-50)',
    100: 'var(--primary-100)',
    200: 'var(--primary-200)',
    300: 'var(--primary-300)',
    400: 'var(--primary-400)',
    500: 'var(--primary-500)',
    600: 'var(--primary-600)',
    700: 'var(--primary-700)',
    800: 'var(--primary-800)',
    900: 'var(--primary-900)',
    DEFAULT: 'var(--primary)',
    dark: 'var(--primary-dark)',
    light: 'var(--primary-light)',
  },
  
  // Secondary Colors
  secondary: {
    50: 'var(--secondary-50)',
    100: 'var(--secondary-100)',
    200: 'var(--secondary-200)',
    300: 'var(--secondary-300)',
    400: 'var(--secondary-400)',
    500: 'var(--secondary-500)',
    600: 'var(--secondary-600)',
    700: 'var(--secondary-700)',
    800: 'var(--secondary-800)',
    900: 'var(--secondary-900)',
    DEFAULT: 'var(--secondary)',
  },
  
  // Gray Scale
  gray: {
    50: 'var(--gray-50)',
    100: 'var(--gray-100)',
    200: 'var(--gray-200)',
    300: 'var(--gray-300)',
    400: 'var(--gray-400)',
    500: 'var(--gray-500)',
    600: 'var(--gray-600)',
    700: 'var(--gray-700)',
    800: 'var(--gray-800)',
    900: 'var(--gray-900)',
  },
  
  // Semantic Colors
  success: {
    50: 'var(--success-50)',
    500: 'var(--success-500)',
    600: 'var(--success-600)',
    DEFAULT: 'var(--success)',
  },
  
  warning: {
    50: 'var(--warning-50)',
    500: 'var(--warning-500)',
    600: 'var(--warning-600)',
    DEFAULT: 'var(--warning)',
  },
  
  danger: {
    50: 'var(--danger-50)',
    500: 'var(--danger-500)',
    600: 'var(--danger-600)',
    DEFAULT: 'var(--danger)',
  },
  
  // Base Colors
  white: 'var(--white)',
  black: 'var(--black)',
  
  // Semantic Text Colors
  text: {
    primary: 'var(--text-primary)',
    secondary: 'var(--text-secondary)',
    dim: 'var(--text-dim)',
    muted: 'var(--text-muted)',
  },
  
  // Background Colors
  bg: {
    primary: 'var(--bg-primary)',
    secondary: 'var(--bg-secondary)',
    tertiary: 'var(--bg-tertiary)',
  },
  
  // Border Colors
  border: {
    primary: 'var(--border-primary)',
    secondary: 'var(--border-secondary)',
  },
} as const;

// Shadow Tokens
export const shadows = {
  sm: 'var(--shadow-sm)',
  base: 'var(--shadow-base)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
  xl: 'var(--shadow-xl)',
  DEFAULT: 'var(--shadow)',
} as const;

// Font Family Tokens
export const fonts = {
  primary: 'var(--font-family-primary)',
  mono: 'var(--font-family-mono)',
} as const;

// Gradient Tokens
export const gradients = {
  primary: 'var(--gradient-primary)',
  dark: 'var(--gradient-dark)',
} as const;

// Spacing Tokens (following 8px grid system)
export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',   // 2px
  1: '0.25rem',      // 4px
  1.5: '0.375rem',   // 6px
  2: '0.5rem',       // 8px
  2.5: '0.625rem',   // 10px
  3: '0.75rem',      // 12px
  3.5: '0.875rem',   // 14px
  4: '1rem',         // 16px
  5: '1.25rem',      // 20px
  6: '1.5rem',       // 24px
  7: '1.75rem',      // 28px
  8: '2rem',         // 32px
  9: '2.25rem',      // 36px
  10: '2.5rem',      // 40px
  11: '2.75rem',     // 44px
  12: '3rem',        // 48px
  14: '3.5rem',      // 56px
  16: '4rem',        // 64px
  20: '5rem',        // 80px
  24: '6rem',        // 96px
  28: '7rem',        // 112px
  32: '8rem',        // 128px
} as const;

// Border Radius Tokens
export const radius = {
  none: '0',
  sm: '0.125rem',     // 2px
  base: '0.25rem',    // 4px
  md: '0.375rem',     // 6px
  lg: '0.5rem',       // 8px
  xl: '0.75rem',      // 12px
  '2xl': '1rem',      // 16px
  '3xl': '1.5rem',    // 24px
  full: '9999px',
} as const;

// Typography Tokens
export const typography = {
  fontFamily: 'system-ui, -apple-system, sans-serif',
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
} as const;

// Animation Tokens
export const animations = {
  transition: {
    fast: '0.15s ease-out',
    base: '0.2s ease-out',
    slow: '0.3s ease-out',
    slower: '0.5s ease-out',
  },
  duration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms',
  },
  easing: {
    'ease-in': 'ease-in',
    'ease-out': 'ease-out',
    'ease-in-out': 'ease-in-out',
    'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    'elastic': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
} as const;

// Z-Index Tokens
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// Breakpoint Tokens
export const breakpoints = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Export all tokens as a single object
export const tokens = {
  colors,
  shadows,
  fonts,
  gradients,
  spacing,
  radius,
  typography,
  animations,
  zIndex,
  breakpoints,
} as const;

export type Tokens = typeof tokens;