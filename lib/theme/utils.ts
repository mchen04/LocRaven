/**
 * Theme Utility Functions
 * 
 * Helper functions for working with the theme configuration
 * and applying theme classes consistently throughout the app.
 */

import { theme, legacyColorMap, type SemanticClasses, type LegacyColors } from './config';
import { cn } from '../utils/cn';

/**
 * Get a semantic class from the theme configuration
 * @param semantic - The semantic class name
 * @returns The corresponding Tailwind classes
 */
export const getThemeClass = (semantic: keyof SemanticClasses): string => {
  return theme.semantic[semantic] || '';
};

/**
 * Convert legacy hex colors to Tailwind classes
 * @param legacyColor - The legacy hex color or rgba value
 * @returns The corresponding Tailwind class
 */
export const convertLegacyColor = (legacyColor: keyof LegacyColors): string => {
  return legacyColorMap[legacyColor] || legacyColor;
};

/**
 * Apply theme classes with proper className merging
 * @param semantic - The semantic class name
 * @param additionalClasses - Additional classes to merge
 * @returns Combined className string
 */
export const themeClass = (
  semantic: keyof SemanticClasses, 
  ...additionalClasses: (string | undefined)[]
): string => {
  return cn(getThemeClass(semantic), ...additionalClasses);
};

/**
 * Get color classes for different states
 * @param variant - The color variant (primary, secondary, etc.)
 * @param property - The CSS property (text, bg, border)
 * @returns The theme class
 */
export const getVariantClass = (
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'default' | 'muted',
  property: 'text' | 'bg' | 'border' | 'hover'
): string => {
  const key = `${property}-${variant}` as keyof SemanticClasses;
  return getThemeClass(key);
};

/**
 * Theme-aware component class builder
 * Combines semantic theme classes with custom classes
 */
export const buildThemeClasses = (config: {
  base?: string;
  semantic?: keyof SemanticClasses;
  variant?: string;
  custom?: string;
  className?: string;
}): string => {
  const { base, semantic, variant, custom, className } = config;
  
  const classes = [];
  
  if (base) classes.push(base);
  if (semantic) classes.push(getThemeClass(semantic));
  if (variant) classes.push(variant);
  if (custom) classes.push(custom);
  if (className) classes.push(className);
  
  return cn(...classes);
};

/**
 * Quick theme class generators for common patterns
 */
export const themeClasses = {
  // Cards
  card: (elevated = false) => 
    themeClass(elevated ? 'bg-elevated' : 'bg-card', 'rounded-lg', 'border', themeClass('border-default')),
  
  // Buttons - extends existing Button component variants
  buttonGhost: () => 
    cn('bg-transparent', getVariantClass('muted', 'text'), getVariantClass('default', 'hover')),
  
  // Text variants
  heading: () => 
    themeClass('text-default', 'font-semibold'),
  
  body: () =>
    themeClass('text-default'),
    
  muted: () =>
    themeClass('text-muted'),
  
  // Layout
  sidebar: () =>
    themeClass('bg-sidebar', 'border-r', themeClass('border-default')),
  
  // Interactive elements
  navItem: (active = false) =>
    cn(
      'flex items-center px-3 py-2 rounded-md transition-colors',
      active 
        ? themeClass('active-primary', 'text-primary')
        : cn(themeClass('text-muted'), themeClass('hover-gray'))
    ),
} as const;