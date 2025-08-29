import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface ExpirationResult {
  success: boolean;
  message: string;
  expiredCount?: number;
  expiredPages?: Array<{
    id: string;
    filePath: string;
    title: string;
  }>;
}

// Main expiration handler
async function handleExpiration(action: string, pageId?: string, hours?: number): Promise<ExpirationResult> {
  try {
    switch (action) {
      case 'expire-all':
        return await expireAllPages();
      case 'expire-single':
        if (!pageId) throw new Error('Page ID required for single expiration');
        return await expireSinglePage(pageId);
      case 'extend':
        if (!pageId || !hours) throw new Error('Page ID and hours required for extension');
        return await extendPageExpiration(pageId, hours);
      case 'check-upcoming':
        return await checkUpcomingExpirations();
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Expiration handler error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Expire all pages that have passed their expiration time
async function expireAllPages(): Promise<ExpirationResult> {
  const now = new Date().toISOString();
  
  // Get pages that should be expired
  const { data: expiredPages, error: selectError } = await supabase
    .from('generated_pages')
    .select('id, file_path, title')
    .lte('expires_at', now)
    .eq('expired', false);
  
  if (selectError) {
    throw selectError;
  }
  
  if (!expiredPages || expiredPages.length === 0) {
    return {
      success: true,
      message: 'No pages to expire',
      expiredCount: 0,
      expiredPages: []
    };
  }
  
  // Mark pages as expired
  const { error: updateError } = await supabase
    .from('generated_pages')
    .update({ expired: true, updated_at: now })
    .lte('expires_at', now)
    .eq('expired', false);
  
  if (updateError) {
    throw updateError;
  }
  
  console.log(`Expired ${expiredPages.length} pages`);
  
  return {
    success: true,
    message: `Successfully expired ${expiredPages.length} pages`,
    expiredCount: expiredPages.length,
    expiredPages: expiredPages.map(page => ({
      id: page.id,
      filePath: page.file_path,
      title: page.title
    }))
  };
}

// Expire a single page
async function expireSinglePage(pageId: string): Promise<ExpirationResult> {
  const now = new Date().toISOString();
  
  // Get page info
  const { data: page, error: selectError } = await supabase
    .from('generated_pages')
    .select('id, file_path, title')
    .eq('id', pageId)
    .single();
  
  if (selectError) {
    throw selectError;
  }
  
  if (!page) {
    return {
      success: false,
      message: 'Page not found'
    };
  }
  
  // Mark page as expired
  const { error: updateError } = await supabase
    .from('generated_pages')
    .update({ expired: true, updated_at: now })
    .eq('id', pageId);
  
  if (updateError) {
    throw updateError;
  }
  
  console.log(`Expired page: ${page.title}`);
  
  return {
    success: true,
    message: `Successfully expired page: ${page.title}`,
    expiredCount: 1,
    expiredPages: [{
      id: page.id,
      filePath: page.file_path,
      title: page.title
    }]
  };
}

// Extend page expiration
async function extendPageExpiration(pageId: string, hours: number): Promise<ExpirationResult> {
  const newExpiryDate = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
  
  const { data: page, error: updateError } = await supabase
    .from('generated_pages')
    .update({ 
      expires_at: newExpiryDate, 
      expired: false,
      updated_at: new Date().toISOString()
    })
    .eq('id', pageId)
    .select('title')
    .single();
  
  if (updateError) {
    throw updateError;
  }
  
  return {
    success: true,
    message: `Extended expiration for "${page?.title}" by ${hours} hours`
  };
}

// Check for upcoming expirations (within next hour)
async function checkUpcomingExpirations(): Promise<ExpirationResult> {
  const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  
  const { data: upcomingPages, error } = await supabase
    .from('generated_pages')
    .select('id, file_path, title, expires_at')
    .lte('expires_at', oneHourFromNow)
    .eq('expired', false);
  
  if (error) {
    throw error;
  }
  
  return {
    success: true,
    message: `Found ${upcomingPages?.length || 0} pages expiring within next hour`,
    expiredCount: upcomingPages?.length || 0,
    expiredPages: upcomingPages?.map(page => ({
      id: page.id,
      filePath: page.file_path,
      title: page.title
    })) || []
  };
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Main handler
Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, pageId, hours } = await req.json();
    
    if (!action) {
      throw new Error('Action parameter is required');
    }
    
    console.log(`Page expiration request: ${action}`, { pageId, hours });
    
    const result = await handleExpiration(action, pageId, hours);
    
    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400,
      }
    );
    
  } catch (error) {
    console.error('Expire pages error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});