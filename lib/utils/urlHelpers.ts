/**
 * Centralized URL generation utilities for pages and links
 * Consolidates URL construction logic that was previously scattered across components
 */

import { config } from './config';
import { GeneratedPage } from '../../types';

/**
 * Generates the full public URL for a generated page
 * @param page - The generated page object containing file_path
 * @returns Full URL to the page
 */
export const generatePageUrl = (page: GeneratedPage): string => {
  // Use the existing URL if available, otherwise construct from file_path
  if (page.url) {
    return page.url;
  }
  
  if (!page.file_path) {
    console.warn('generatePageUrl: Page missing file_path', page);
    return config.env.appUrl;
  }
  
  // Ensure file_path starts with / for proper URL construction
  const cleanPath = page.file_path.startsWith('/') 
    ? page.file_path 
    : `/${page.file_path}`;
    
  return `${config.env.appUrl}${cleanPath}`;
};

/**
 * Generates a display-friendly URL (without protocol) for UI display
 * @param page - The generated page object
 * @returns URL without the https:// prefix for cleaner display
 */
export const generateDisplayUrl = (page: GeneratedPage): string => {
  const fullUrl = generatePageUrl(page);
  return fullUrl.replace(/^https?:\/\//, '');
};

/**
 * Validates if a page has the necessary data to generate a URL
 * @param page - The generated page object to validate
 * @returns boolean indicating if URL can be generated
 */
export const canGeneratePageUrl = (page: GeneratedPage): boolean => {
  return Boolean(page.url || page.file_path);
};

/**
 * Generates URLs for multiple pages efficiently
 * @param pages - Array of generated page objects
 * @returns Array of page objects with urls property populated
 */
export const generatePageUrls = (pages: GeneratedPage[]): GeneratedPage[] => {
  return pages.map(page => ({
    ...page,
    url: page.url || generatePageUrl(page)
  }));
};