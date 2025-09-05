import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { 
  createSupabaseClient, 
  errorResponse, 
  successResponse, 
  handleCors, 
  safeJsonParse
} from '../_shared/utils.ts'
import { 
  renderDirectTemplate,
  renderLocalTemplate, 
  renderCategoryTemplate,
  renderBrandedLocalTemplate,
  renderServiceUrgentTemplate,
  renderCompetitiveTemplate,
  renderBusinessTemplate
} from '../_shared/templates/intent-templates.ts'

// AI-optimized template renderer using our new templates
function renderTemplate(templateId: string, pageData: any): string {
  console.log(`Rendering ${templateId} template with AI optimization`);
  
  try {
    switch (templateId) {
      case 'direct':
        return renderDirectTemplate(pageData);
      case 'local':
        return renderLocalTemplate(pageData);
      case 'category':
        return renderCategoryTemplate(pageData);
      case 'branded-local':
        return renderBrandedLocalTemplate(pageData);
      case 'service-urgent':
        return renderServiceUrgentTemplate(pageData);
      case 'competitive':
        return renderCompetitiveTemplate(pageData);
      case 'business':
        return renderBusinessTemplate(pageData);
      default:
        console.warn(`Unknown template ID: ${templateId}, falling back to direct template`);
        return renderDirectTemplate(pageData);
    }
  } catch (error) {
    console.error(`Error rendering ${templateId} template:`, error);
    // Fallback to basic template if AI-optimized templates fail
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageData.seo?.title || 'LocRaven Page'}</title>
  <meta name="description" content="${pageData.seo?.description || 'Local business update'}">
</head>
<body>
  <h1>${pageData.business?.name || 'Business'} - ${templateId} Template</h1>
  <p><strong>Location:</strong> ${pageData.business?.address_city}, ${pageData.business?.address_state}</p>
  <h2>Current Update</h2>
  <p>${pageData.update?.content_text || 'No content available'}</p>
  <h2>Contact Information</h2>
  <p><strong>Phone:</strong> ${pageData.business?.phone || 'Not available'}</p>
  <p><strong>Website:</strong> ${pageData.business?.website || 'Not available'}</p>
  <p><em>Generated at: ${new Date().toISOString()}</em></p>
</body>
</html>`;
  }
}

// Decompress page data from shortened keys back to full format
function decompressPageData(compressed: any): any {
  return {
    business: {
      name: compressed.b?.n,
      address_city: compressed.b?.c,
      address_state: compressed.b?.s,
      address_street: compressed.b?.st,
      zip_code: compressed.b?.z,
      country: compressed.b?.country || 'US',
      phone: compressed.b?.p,
      phone_country_code: compressed.b?.pcc,
      email: compressed.b?.e,
      website: compressed.b?.w,
      description: compressed.b?.d,
      primary_category: compressed.b?.cat,
      services: compressed.b?.srv,
      specialties: compressed.b?.sp,
      hours: compressed.b?.h,
      structured_hours: compressed.b?.sh,
      price_positioning: compressed.b?.pr,
      payment_methods: compressed.b?.pm || ['Cash', 'Credit Card'],
      service_area: compressed.b?.sa,
      service_area_details: compressed.b?.sad,
      awards: compressed.b?.aw,
      certifications: compressed.b?.cert,
      latitude: compressed.b?.lat,
      longitude: compressed.b?.lng,
      languages_spoken: compressed.b?.lang,
      accessibility_features: compressed.b?.acc,
      parking_info: compressed.b?.park,
      enhanced_parking_info: compressed.b?.epark,
      review_summary: compressed.b?.rev,
      status_override: compressed.b?.stat,
      business_faqs: compressed.b?.faqs,
      featured_items: compressed.b?.feat,
      social_media: compressed.b?.social,
      established_year: compressed.b?.est
    },
    update: {
      content_text: compressed.u?.t,
      created_at: compressed.u?.ca,
      expires_at: compressed.u?.ea,
      special_hours_today: compressed.u?.sh,
      deal_terms: compressed.u?.dt,
      update_category: compressed.u?.cat,
      update_faqs: compressed.u?.faqs
    },
    seo: compressed.seo || {},
    intent: compressed.i || {},
    faqs: compressed.f || []
  };
}

// Add AI-optimized meta tags to HTML
function addAIOptimizedHeaders(html: string, pageData: any, page: any): string {
  const aiMetaTags = `
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
    <meta name="googlebot" content="index, follow, max-video-preview:-1, max-snippet:-1">
    <meta name="bingbot" content="index, follow">
    <meta name="ai-content-type" content="local-business-update">
    <meta name="voice-search-optimized" content="true">
    <link rel="canonical" href="https://locraven.com${page.file_path}">
    <meta property="og:url" content="https://locraven.com${page.file_path}">
    <meta property="og:type" content="business.business">
    <meta property="og:title" content="${page.title}">
    <meta property="og:description" content="${pageData.seo?.description || page.title}">`;

  return html.replace('<head>', `<head>${aiMetaTags}`);
}

// Upload static file to Cloudflare R2 using proper S3 authentication
async function uploadStaticFile(filePath: string, content: string, contentType: string = 'text/html'): Promise<boolean> {
  try {
    const accountId = Deno.env.get('CLOUDFLARE_R2_ACCOUNT_ID');
    const accessKeyId = Deno.env.get('CLOUDFLARE_R2_ACCESS_KEY_ID');
    const secretAccessKey = Deno.env.get('CLOUDFLARE_R2_SECRET_ACCESS_KEY');
    const bucketName = Deno.env.get('CLOUDFLARE_R2_BUCKET_NAME') || 'locraven-pages';

    if (!accountId || !accessKeyId || !secretAccessKey) {
      console.warn('R2 credentials not configured - skipping static file upload');
      return false;
    }

    // Import AWS S3 client for proper authentication
    const { S3Client, PutObjectCommand } = await import("npm:@aws-sdk/client-s3");

    // Create S3 client with proper R2 configuration (official method)
    const s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });

    // Generate proper key path
    const key = filePath.startsWith('/') ? filePath.substring(1) + '/index.html' : filePath + '/index.html';
    
    // Upload using official S3 API with proper authentication
    await s3Client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: content,
      ContentType: contentType,
      CacheControl: 'public, max-age=86400, s-maxage=31536000',
      Metadata: {
        'ai-optimized': 'true',
        'voice-search': 'enabled',
        'generated-at': new Date().toISOString()
      }
    }));

    console.log(`✅ Successfully uploaded to R2: ${key}`);
    return true;
  } catch (error) {
    console.error(`❌ R2 upload failed for ${filePath}: ${error.message}`);
    return false;
  }
}

// Generate sitemap XML
async function generateSitemap(publishedPages: any[]): Promise<void> {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${publishedPages.map(page => `  <url>
    <loc>https://locraven.com${page.file_path}</loc>
    <lastmod>${page.updated_at || page.published_at || new Date().toISOString()}</lastmod>
    <priority>0.8</priority>
    <changefreq>weekly</changefreq>
  </url>`).join('\n')}
</urlset>`;

  await uploadStaticFile('/sitemap', sitemap, 'application/xml');
}

// Generate robots.txt
async function generateRobotsTxt(): Promise<void> {
  const robots = `User-agent: *
Allow: /
Crawl-delay: 1

User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 0

User-agent: ChatGPT-User
Allow: /

User-agent: GPTBot
Allow: /

User-agent: Claude-Web
Allow: /

Sitemap: https://locraven.com/sitemap.xml`;

  await uploadStaticFile('/robots', robots, 'text/plain');
}

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

    // Get complete page details for static generation
    const { data: pagesBeforePublish, error: fetchDetailError } = await supabase
      .from('generated_pages')
      .select('*')
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

    // Generate static files for published pages
    console.log(`Generating static files for ${pagesBeforePublish?.length || 0} pages...`);
    const staticFileResults = await Promise.allSettled(
      (pagesBeforePublish || []).map(async (page) => {
        try {
          // Decompress page data
          const pageData = decompressPageData(page.page_data);
          
          // Render HTML using existing template engine
          const html = renderTemplate(page.template_id, pageData);
          
          // Add AI-optimized headers
          const optimizedHTML = addAIOptimizedHeaders(html, pageData, page);
          
          // Upload to R2
          const success = await uploadStaticFile(page.file_path, optimizedHTML);
          
          return { 
            success, 
            path: page.file_path, 
            title: page.title 
          };
        } catch (error) {
          console.error(`Static file generation failed for ${page.file_path}:`, error);
          return { 
            success: false, 
            path: page.file_path, 
            error: error.message 
          };
        }
      })
    );

    const successfulStaticFiles = staticFileResults.filter(
      result => result.status === 'fulfilled' && result.value.success
    ).length;

    // Generate sitemap and robots.txt
    if (publishedPages && publishedPages.length > 0) {
      console.log('Generating sitemap and robots.txt...');
      try {
        // Get all published pages for sitemap
        const { data: allPublishedPages } = await supabase
          .from('generated_pages')
          .select('file_path, updated_at, published_at')
          .eq('published', true);

        if (allPublishedPages && allPublishedPages.length > 0) {
          await generateSitemap(allPublishedPages);
          await generateRobotsTxt();
        }
      } catch (sitemapError) {
        console.error('Error generating sitemap/robots.txt:', sitemapError);
      }
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
        liveUrl: `https://locraven.com${page.file_path}`,
        staticUrl: `https://locraven.com${page.file_path}`
      })) || [],
      total: publishedPages?.length || 0,
      staticFileGeneration: {
        attempted: staticFileResults.length,
        successful: successfulStaticFiles,
        failed: staticFileResults.length - successfulStaticFiles
      },
      cacheInvalidation: {
        attempted: cacheInvalidationResults.length,
        successful: successfulInvalidations,
        failed: cacheInvalidationResults.length - successfulInvalidations
      },
      publishedAt: publishTime,
      message: `Successfully published ${publishedPages?.length || 0} pages with ${successfulStaticFiles} static files generated`
    });

  } catch (error) {
    console.error('Error in publish-pages function:', error);
    return errorResponse(error instanceof Error ? error.message : 'Unknown error');
  }
});