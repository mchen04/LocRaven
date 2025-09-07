// Service layer for generated pages operations
// Provides centralized methods for page CRUD operations with proper data transformation

import { BusinessUpdatesService } from '@/services/business-updates';
import type { ApiResponse } from '@/types/business-updates';
import { type TransformedGeneratedPage, transformGeneratedPages } from '@/utils/page-transformers';

export class GeneratedPagesService {
  /**
   * Get pages for an update with proper data transformation
   * @param updateId - The update ID to get pages for
   * @returns Transformed pages with computed URLs
   */
  static async getPages(updateId: string): Promise<ApiResponse<TransformedGeneratedPage[]>> {
    try {
      const response = await BusinessUpdatesService.getGeneratedPages(updateId);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }
      
      // Transform the raw data to include computed URLs
      const transformedPages = transformGeneratedPages(response.data || []);
      
      return {
        success: true,
        data: transformedPages
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get pages'
      };
    }
  }

  /**
   * Delete a single page
   * @param pageId - The page ID to delete
   * @returns Promise with success/error result
   */
  static async deletePage(pageId: string): Promise<ApiResponse<void>> {
    return BusinessUpdatesService.deleteGeneratedPage(pageId);
  }

  /**
   * Delete multiple pages
   * @param pageIds - Array of page IDs to delete
   * @returns Promise with aggregated results
   */
  static async deletePages(pageIds: string[]): Promise<ApiResponse<{
    successful: string[];
    failed: { id: string; error: string }[];
    totalSuccessful: number;
    totalFailed: number;
  }>> {
    if (pageIds.length === 0) {
      return {
        success: true,
        data: {
          successful: [],
          failed: [],
          totalSuccessful: 0,
          totalFailed: 0
        }
      };
    }

    try {
      const deletePromises = pageIds.map(async (id) => {
        try {
          const result = await this.deletePage(id);
          return { id, success: result.success, error: result.error };
        } catch (error) {
          return { 
            id, 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          };
        }
      });

      const results = await Promise.allSettled(deletePromises);
      
      const successful: string[] = [];
      const failed: { id: string; error: string }[] = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.success) {
          successful.push(result.value.id);
        } else {
          const error = result.status === 'fulfilled' 
            ? result.value.error || 'Unknown error'
            : 'Promise rejected';
          failed.push({ id: pageIds[index], error });
        }
      });

      return {
        success: true,
        data: {
          successful,
          failed,
          totalSuccessful: successful.length,
          totalFailed: failed.length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete pages'
      };
    }
  }

  /**
   * Publish a single page
   * @param pageId - The page ID to publish
   * @returns Promise with success/error result
   */
  static async publishPage(pageId: string): Promise<ApiResponse<any>> {
    return BusinessUpdatesService.publishPages([pageId]);
  }

  /**
   * Publish multiple pages
   * @param pageIds - Array of page IDs to publish
   * @returns Promise with publish result
   */
  static async publishPages(pageIds: string[]): Promise<ApiResponse<any>> {
    if (pageIds.length === 0) {
      return {
        success: false,
        error: 'No pages provided for publishing'
      };
    }

    return BusinessUpdatesService.publishPages(pageIds);
  }

  /**
   * Filter pages by publish status
   * @param pages - Array of pages to filter
   * @param published - Whether to get published or unpublished pages
   * @returns Filtered pages
   */
  static filterByStatus(pages: TransformedGeneratedPage[], published: boolean): TransformedGeneratedPage[] {
    return pages.filter(page => page.published === published);
  }

  /**
   * Get pages that are valid for operations (have valid file paths)
   * @param pages - Array of pages to filter
   * @returns Pages with valid file paths
   */
  static getValidPages(pages: TransformedGeneratedPage[]): TransformedGeneratedPage[] {
    return pages.filter(page => page.hasValidFilePath);
  }

  /**
   * Sort pages by creation date (newest first)
   * @param pages - Array of pages to sort
   * @returns Sorted pages
   */
  static sortByDate(pages: TransformedGeneratedPage[]): TransformedGeneratedPage[] {
    return [...pages].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  /**
   * Group pages by their status for easier UI handling
   * @param pages - Array of pages to group
   * @returns Grouped pages object
   */
  static groupByStatus(pages: TransformedGeneratedPage[]): {
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

  /**
   * Get page statistics
   * @param pages - Array of pages to analyze
   * @returns Statistics object
   */
  static getStats(pages: TransformedGeneratedPage[]): {
    total: number;
    published: number;
    unpublished: number;
    invalid: number;
    validPages: number;
  } {
    const groups = this.groupByStatus(pages);
    return {
      total: pages.length,
      published: groups.published.length,
      unpublished: groups.unpublished.length,
      invalid: groups.invalid.length,
      validPages: groups.published.length + groups.unpublished.length
    };
  }

  /**
   * Subscribe to page changes (wrapper around BusinessUpdatesService)
   * @param updateId - Update ID to subscribe to
   * @param callback - Callback function that receives transformed pages
   * @returns Unsubscribe function
   */
  static subscribeToPages(
    updateId: string, 
    callback: (pages: TransformedGeneratedPage[]) => void
  ) {
    return BusinessUpdatesService.subscribeToGeneratedPages(
      updateId,
      (pages) => {
        const transformedPages = transformGeneratedPages(pages);
        callback(transformedPages);
      }
    );
  }
}

export default GeneratedPagesService;