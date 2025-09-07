import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { 
  createSupabaseClient, 
  errorResponse, 
  successResponse, 
  handleCors, 
  safeJsonParse
} from '../_shared/utils.ts'
import { renderBusinessTemplate } from '../_shared/templates/intent-templates.ts'

// Generate permanent business page with new URL structure and feature flags
async function generateBusinessPage(supabase: any, businessId: string, useNewUrlStructure: boolean = true, forceRegenerate: boolean = false): Promise<{ success: boolean; error?: string; pageUrl?: string }> {
  try {
    console.log(`Generating permanent business page for business: ${businessId} (new URL structure: ${useNewUrlStructure})`);
    
    // Get business data with new URL structure fields
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single();

    if (businessError || !business) {
      console.error('Failed to fetch business:', businessError);
      return { success: false, error: 'Business not found' };
    }

    // Validate required new URL structure fields
    if (!business.city_state_slug || !business.url_slug) {
      console.error('Business missing required URL structure fields:', {
        businessId,
        city_state_slug: business.city_state_slug,
        url_slug: business.url_slug
      });
      return { success: false, error: 'Business has not completed onboarding with new URL structure' };
    }

    // Check if page already exists in generated_pages (skip if forcing regeneration)
    const newPagePath = `/${business.city_state_slug}/${business.url_slug}`;
    
    if (!forceRegenerate) {
      const { data: existingPage } = await supabase
        .from('generated_pages')
        .select('id, file_path, published')
        .eq('business_id', businessId)
        .eq('page_category', 'business')
        .eq('file_path', newPagePath)
        .single();
      
      if (existingPage && existingPage.published) {
        const pageUrl = `https://locraven.com${newPagePath}`;
        return { success: true, pageUrl };
      }
    }
    

    // Get latest update for the business (optional for business page)
    const { data: latestUpdate } = await supabase
      .from('updates')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Generate URLs using new structure only
    const filePath = `/${business.city_state_slug}/${business.url_slug}`;
    const slug = business.url_slug;
    
    // Prepare page data for template rendering with enhanced SEO
    const pageData = {
      business: {
        name: business.name,
        address_city: business.address_city,
        address_state: business.address_state,
        address_street: business.address_street,
        zip_code: business.zip_code,
        country: business.country || 'US',
        phone: business.phone,
        phone_country_code: business.phone_country_code,
        email: business.email,
        website: business.website,
        description: business.description,
        services: business.services || [],
        specialties: business.specialties || [],
        hours: business.hours,
        structured_hours: business.structured_hours,
        price_positioning: business.price_positioning,
        payment_methods: business.payment_methods || ['Cash', 'Credit Card'],
        primary_category: business.primary_category,
        service_area: business.service_area,
        service_area_details: business.service_area_details,
        awards: business.awards || [],
        certifications: business.certifications || [],
        latitude: business.latitude,
        longitude: business.longitude,
        languages_spoken: business.languages_spoken || ['English'],
        accessibility_features: business.accessibility_features || [],
        parking_info: business.parking_info,
        enhanced_parking_info: business.enhanced_parking_info,
        review_summary: business.review_summary,
        status_override: business.status_override,
        business_faqs: business.business_faqs || [],
        featured_items: business.featured_items || [],
        social_media: business.social_media || {},
        established_year: business.established_year,
        // New URL structure fields
        city_state_slug: business.city_state_slug,
        url_slug: business.url_slug
      },
      update: latestUpdate ? {
        content_text: latestUpdate.content_text,
        created_at: latestUpdate.created_at,
        expires_at: latestUpdate.expires_at,
        special_hours_today: latestUpdate.special_hours_today,
        deal_terms: latestUpdate.deal_terms,
        update_category: latestUpdate.update_category,
        update_faqs: latestUpdate.update_faqs || [],
        // New fields from enhanced schema
        search_intents: latestUpdate.search_intents || [],
        is_time_sensitive: latestUpdate.is_time_sensitive || false
      } : null,
      seo: {
        title: `${business.name} - ${business.address_city}, ${business.address_state}`,
        description: business.description || `Visit ${business.name} in ${business.address_city}, ${business.address_state}. ${business.primary_category} services and more.`,
        // Enhanced SEO for voice search and AI
        keywords: `${business.name}, ${business.address_city} ${business.primary_category}, ${business.address_state} business`,
        canonical: `https://locraven.com${filePath}`,
        schema_type: 'LocalBusiness'
      },
      intent: {
        type: 'business',
        filePath: filePath,
        slug: slug,
        pageVariant: 'business-profile'
      },
      faqs: business.business_faqs || []
    };

    // Render the business template
    const htmlContent = renderBusinessTemplate(pageData);
    
    if (!htmlContent) {
      return { success: false, error: 'Failed to render business page template' };
    }

    // Store the generated page in generated_pages table (FIXED: was using non-existent business_pages)
    const pageRecord = {
      business_id: businessId,
      update_id: latestUpdate?.id || null,
      file_path: filePath,
      title: pageData.seo.title,
      template_id: 'business',
      page_data: pageData, // Store full page data for rendering
      rendered_size_kb: Math.ceil(htmlContent.length / 1024),
      content_intent: 'business-profile',
      slug: slug,
      page_type: 'business',
      intent_type: 'direct',
      page_variant: 'business-profile',
      page_category: 'business', // New field for enhanced system
      seo_score: 85, // Base SEO score for business pages
      regeneration_priority: 'normal',
      published: true, // Business pages are immediately published
      published_at: new Date().toISOString(),
      html_content: htmlContent
    };

    // Use upsert when regenerating to handle existing pages
    let insertedPage, insertError;
    if (forceRegenerate) {
      const { data, error } = await supabase
        .from('generated_pages')
        .upsert(pageRecord, { 
          onConflict: 'intent_type,slug',
          ignoreDuplicates: false 
        })
        .select('id, file_path')
        .single();
      insertedPage = data;
      insertError = error;
    } else {
      const { data, error } = await supabase
        .from('generated_pages')
        .insert(pageRecord)
        .select('id, file_path')
        .single();
      insertedPage = data;
      insertError = error;
    }

    if (insertError) {
      console.error('Failed to store business page in generated_pages:', insertError);
      return { success: false, error: 'Failed to store generated page' };
    }

    // Business page generated successfully - no migration tracking needed

    const pageUrl = `https://locraven.com${filePath}`;
    console.log(`Successfully generated business page: ${pageUrl} (Page ID: ${insertedPage.id})`);
    
    return { success: true, pageUrl, pageId: insertedPage.id };

  } catch (error) {
    console.error('Error generating business page:', error);
    return { success: false, error: error.message || 'Unknown error occurred' };
  }
}

// Main handler with feature flag support
serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return handleCors(req);
  }

  try {
    const supabase = createSupabaseClient(req);
    const { business_id, use_new_url_structure = true, feature_flags = {}, regenerate = false } = await req.json();

    if (!business_id) {
      return errorResponse('business_id is required', 400);
    }

    // New URL structure is now default and only option
    const useNewUrlStructure = true;
    
    console.log(`Processing business page generation with feature flags:`, {
      business_id,
      use_new_url_structure: useNewUrlStructure,
      feature_flags
    });

    const result = await generateBusinessPage(supabase, business_id, useNewUrlStructure, regenerate);

    if (result.success) {
      return successResponse({ 
        message: 'Business page generated successfully',
        page_url: result.pageUrl,
        page_id: result.pageId,
        url_structure: useNewUrlStructure ? 'new' : 'legacy',
        feature_flags_applied: {
          new_url_structure: useNewUrlStructure
        }
      });
    } else {
      return errorResponse(result.error || 'Failed to generate business page', 500);
    }

  } catch (error) {
    console.error('Function error:', error);
    return errorResponse('Internal server error', 500);
  }
});