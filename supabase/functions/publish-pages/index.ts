import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { 
  createSupabaseClient, 
  errorResponse, 
  successResponse, 
  handleCors, 
  safeJsonParse
} from '../_shared/utils.ts'

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { pageIds, batchId, publishAll = false } = await safeJsonParse(req);
    const supabase = createSupabaseClient();

    if (!pageIds && !batchId && !publishAll) {
      throw new Error('Must provide pageIds, batchId, or publishAll=true');
    }

    let pagesToPublish = [];

    if (publishAll) {
      // Publish all unpublished pages
      const { data: unpublishedPages, error: fetchError } = await supabase
        .from('generated_pages')
        .select('id, file_path, title')
        .eq('published', false);
      
      if (fetchError) throw fetchError;
      pagesToPublish = unpublishedPages?.map(p => p.id) || [];
    } else if (batchId) {
      // Publish all pages in a batch
      const { data: batchPages, error: fetchError } = await supabase
        .from('generated_pages')
        .select('id, file_path, title')
        .eq('generation_batch_id', batchId)
        .eq('published', false);
      
      if (fetchError) throw fetchError;
      pagesToPublish = batchPages?.map(p => p.id) || [];
    } else {
      // Publish specific page IDs
      pagesToPublish = Array.isArray(pageIds) ? pageIds : [pageIds];
    }

    if (pagesToPublish.length === 0) {
      return successResponse({
        publishedPages: [],
        total: 0,
        message: 'No pages to publish'
      });
    }

    // Get page details before publishing
    const { data: pagesBeforePublish, error: fetchDetailError } = await supabase
      .from('generated_pages')
      .select('id, file_path, title, intent_type, page_variant')
      .in('id', pagesToPublish)
      .eq('published', false);

    if (fetchDetailError) throw fetchDetailError;

    // Publish the pages
    const publishTime = new Date().toISOString();
    const { data: publishedPages, error: publishError } = await supabase
      .from('generated_pages')
      .update({ 
        published: true,
        published_at: publishTime 
      })
      .in('id', pagesToPublish)
      .eq('published', false) // Only update unpublished pages
      .select();

    if (publishError) {
      console.error('Error publishing pages:', publishError);
      throw new Error(`Failed to publish pages: ${publishError.message}`);
    }

    // Invalidate Cloudflare cache for published pages
    const cacheInvalidationResults = await Promise.allSettled(
      (pagesBeforePublish || []).map(async (page) => {
        try {
          // Call Cloudflare API to purge cache for this URL
          const cloudflareZoneId = Deno.env.get('CLOUDFLARE_ZONE_ID');
          const cloudflareApiToken = Deno.env.get('CLOUDFLARE_API_TOKEN');
          
          if (!cloudflareZoneId || !cloudflareApiToken) {
            console.warn('Cloudflare credentials not configured - skipping cache invalidation');
            return { success: false, reason: 'No Cloudflare credentials' };
          }

          const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${cloudflareZoneId}/purge_cache`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${cloudflareApiToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              files: [
                `https://locraven.com${page.file_path}`,
                `https://www.locraven.com${page.file_path}`
              ]
            })
          });

          if (!response.ok) {
            throw new Error(`Cloudflare API error: ${response.status}`);
          }

          return { success: true, url: page.file_path };
        } catch (error) {
          console.error(`Cache invalidation failed for ${page.file_path}:`, error);
          return { success: false, url: page.file_path, error: error.message };
        }
      })
    );

    const successfulInvalidations = cacheInvalidationResults.filter(
      result => result.status === 'fulfilled' && result.value.success
    ).length;

    return successResponse({
      publishedPages: publishedPages?.map(page => ({
        id: page.id,
        url: page.file_path,
        title: page.title,
        intent_type: page.intent_type,
        page_variant: page.page_variant,
        published_at: page.published_at,
        liveUrl: `https://locraven.com${page.file_path}`
      })) || [],
      total: publishedPages?.length || 0,
      cacheInvalidation: {
        attempted: cacheInvalidationResults.length,
        successful: successfulInvalidations,
        failed: cacheInvalidationResults.length - successfulInvalidations
      },
      publishedAt: publishTime,
      message: `Successfully published ${publishedPages?.length || 0} pages`
    });

  } catch (error) {
    console.error('Error in publish-pages function:', error);
    return errorResponse(error instanceof Error ? error.message : 'Unknown error');
  }
});