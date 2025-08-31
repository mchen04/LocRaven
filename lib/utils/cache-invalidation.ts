import { revalidateTag } from 'next/cache';

/**
 * Cache invalidation utilities for LocRaven dynamic pages
 */

export async function invalidatePublishedPagesCache() {
  try {
    // Invalidate Next.js cache for all published pages
    revalidateTag('published-pages');
    console.log('Successfully invalidated published pages cache');
    return { success: true };
  } catch (error) {
    console.error('Error invalidating cache:', error);
    return { success: false, error: error.message };
  }
}

export async function invalidateSpecificPageCache(filePath: string) {
  try {
    // For specific page invalidation, we could use a more targeted approach
    // but since we're using a general tag, this will invalidate all
    revalidateTag('published-pages');
    console.log(`Successfully invalidated cache for page: ${filePath}`);
    return { success: true };
  } catch (error) {
    console.error('Error invalidating specific page cache:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Call this from your publish-pages function to invalidate cache after publishing
 */
export async function invalidateCacheOnPublish(publishedPages: Array<{file_path: string}>) {
  const results = await Promise.allSettled([
    invalidatePublishedPagesCache(),
    // Could also invalidate Cloudflare cache here if needed
    ...publishedPages.map(page => invalidateSpecificPageCache(page.file_path))
  ]);

  const successful = results.filter(result => 
    result.status === 'fulfilled' && result.value.success
  ).length;

  return {
    total: results.length,
    successful,
    failed: results.length - successful
  };
}