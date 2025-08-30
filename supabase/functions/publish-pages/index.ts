import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { 
  createSupabaseClient, 
  errorResponse, 
  successResponse, 
  handleCors, 
  safeJsonParse
} from '../_shared/utils.ts'

// Manual page publishing endpoint - only publishes when user explicitly confirms
serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { updateId, businessId, pageData, batchId } = await safeJsonParse(req);
    const supabase = createSupabaseClient();

    const startTime = Date.now();

    // Validate required data
    if (!pageData || !Array.isArray(pageData) || pageData.length === 0) {
      throw new Error('No page data provided for publishing');
    }

    if (!updateId || !businessId) {
      throw new Error('Missing required IDs for publishing');
    }

    // Prepare page data for database insertion
    const pagesForInsertion = pageData.map((page: any) => ({
      update_id: updateId,
      business_id: businessId,
      file_path: page.url || page.file_path,
      title: page.title,
      html_content: page.html_content,
      content_intent: 'update',
      slug: page.slug,
      page_type: 'update',
      intent_type: page.intent_type,
      page_variant: page.page_variant,
      generation_batch_id: batchId,
      expires_at: page.expires_at || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }));

    // Insert all pages into database
    const { data: insertedPages, error: insertError } = await supabase
      .from('generated_pages')
      .insert(pagesForInsertion)
      .select();
    
    if (insertError) {
      console.error('Error inserting pages:', insertError);
      throw new Error(`Failed to publish pages: ${insertError.message}`);
    }

    const processingTime = Date.now() - startTime;

    // Update the update record status to completed
    await supabase
      .from('updates')
      .update({ 
        status: 'completed',
        processing_time_ms: processingTime
      })
      .eq('id', updateId);

    return successResponse({
      publishedPages: insertedPages?.map(page => ({
        id: page.id,
        url: page.file_path,
        title: page.title,
        intent_type: page.intent_type,
        page_variant: page.page_variant
      })) || [],
      batch_id: batchId,
      total_pages: insertedPages?.length || 0,
      processingTime,
      publishedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error publishing pages:', error);
    
    const supabase = createSupabaseClient();
    
    const { updateId } = await req.json().catch(() => ({}));
    if (updateId) {
      await supabase
        .from('updates')
        .update({ 
          status: 'failed',
          error_message: error.message
        })
        .eq('id', updateId);
    }
    
    return errorResponse(error.message);
  }
});