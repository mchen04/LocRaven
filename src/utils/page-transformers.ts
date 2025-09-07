// Data transformation utilities for generated pages
// Handles mapping between edge function responses and frontend data models

import { config } from '@/config/urls';
import type { GeneratedPage } from '@/types/business-updates';

/**
 * Extended GeneratedPage interface with computed URL properties
 */
export interface TransformedGeneratedPage extends GeneratedPage {
  previewUrl: string;
  liveUrl: string;
  hasValidFilePath: boolean;
}

/**
 * Transform edge function response to frontend model
 * Handles the data contract mismatch where edge function returns 'url' but frontend expects 'file_path'
 * 
 * @param page - Raw page data from edge function or database
 * @returns Transformed page with proper URLs and validation
 */
export function transformGeneratedPage(page: any): TransformedGeneratedPage {
  // Handle the mismatch: edge function returns 'url', database has 'file_path'
  const filePath = page.file_path || page.url || '';
  
  // Create the base page object with consistent field naming
  const basePage: GeneratedPage = {
    ...page,
    file_path: filePath
  };

  // Generate computed URLs using centralized config
  const previewUrl = filePath ? config.r2.getPreviewUrl(filePath) : '';
  const liveUrl = filePath ? config.site.getLiveUrl(filePath) : '';
  
  return {
    ...basePage,
    previewUrl,
    liveUrl,
    hasValidFilePath: Boolean(filePath)
  };
}

/**
 * Transform array of pages from edge function response
 * @param pages - Array of raw page data
 * @returns Array of transformed pages
 */
export function transformGeneratedPages(pages: any[]): TransformedGeneratedPage[] {
  if (!Array.isArray(pages)) {
    console.warn('transformGeneratedPages received non-array:', pages);
    return [];
  }
  
  return pages.map(transformGeneratedPage);
}

/**
 * Validate page data and check for required fields
 * @param page - Page data to validate
 * @returns Validation result with errors if any
 */
export function validatePageData(page: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!page.id) {
    errors.push('Missing page ID');
  }
  
  if (!page.title) {
    errors.push('Missing page title');
  }
  
  if (!page.file_path && !page.url) {
    errors.push('Missing file path or URL');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Filter pages by publish status
 */
export function filterPagesByStatus(pages: TransformedGeneratedPage[], published: boolean): TransformedGeneratedPage[] {
  return pages.filter(page => page.published === published);
}

/**
 * Get pages that are valid for operations (have valid file paths)
 */
export function getValidPages(pages: TransformedGeneratedPage[]): TransformedGeneratedPage[] {
  return pages.filter(page => page.hasValidFilePath);
}

/**
 * Sort pages by creation date (newest first)
 */
export function sortPagesByDate(pages: TransformedGeneratedPage[]): TransformedGeneratedPage[] {
  return [...pages].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

/**
 * Group pages by their publish status for easier UI handling
 */
export function groupPagesByStatus(pages: TransformedGeneratedPage[]): {
  published: TransformedGeneratedPage[];
  unpublished: TransformedGeneratedPage[];
  invalid: TransformedGeneratedPage[];
} {
  const published: TransformedGeneratedPage[] = [];
  const unpublished: TransformedGeneratedPage[] = [];
  const invalid: TransformedGeneratedPage[] = [];
  
  pages.forEach(page => {
    if (!page.hasValidFilePath) {
      invalid.push(page);
    } else if (page.published) {
      published.push(page);
    } else {
      unpublished.push(page);
    }
  });
  
  return { published, unpublished, invalid };
}