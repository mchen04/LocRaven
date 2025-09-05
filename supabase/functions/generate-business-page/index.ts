import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { 
  createSupabaseClient, 
  errorResponse, 
  successResponse, 
  handleCors, 
  safeJsonParse
} from '../_shared/utils.ts'
import { renderBusinessTemplate } from '../_shared/templates/intent-templates.ts'

// Generate permanent business page
async function generateBusinessPage(supabase: any, businessId: string): Promise<{ success: boolean; error?: string; pageUrl?: string }> {
  try {
    console.log(`Generating permanent business page for business: ${businessId}`);
    
    // Get business data
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single();

    if (businessError || !business) {
      console.error('Failed to fetch business:', businessError);
      return { success: false, error: 'Business not found' };
    }

    // Check if permanent page was already generated
    if (business.permanent_page_generated) {
      const pageUrl = `https://locraven.com${business.permanent_page_path}`;
      return { success: true, pageUrl };
    }

    // Get latest update for the business (optional for business page)
    const { data: latestUpdate } = await supabase
      .from('updates')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Prepare page data for template rendering
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
        permanent_page_path: business.permanent_page_path
      },
      update: latestUpdate ? {
        content_text: latestUpdate.content_text,
        created_at: latestUpdate.created_at,
        expires_at: latestUpdate.expires_at,
        special_hours_today: latestUpdate.special_hours_today,
        deal_terms: latestUpdate.deal_terms,
        update_category: latestUpdate.update_category,
        update_faqs: latestUpdate.update_faqs || []
      } : null,
      seo: {
        title: `${business.name} - ${business.address_city}, ${business.address_state}`,
        description: business.description || `Visit ${business.name} in ${business.address_city}, ${business.address_state}. ${business.primary_category} services and more.`
      },
      intent: {
        type: 'business',
        filePath: business.permanent_page_path,
        slug: business.permanent_page_slug,
        pageVariant: 'business-profile'
      },
      faqs: business.business_faqs || []
    };

    // Render the business template
    const htmlContent = renderBusinessTemplate(pageData);
    
    if (!htmlContent) {
      return { success: false, error: 'Failed to render business page template' };
    }

    // Store the generated page in business_pages table
    const { error: insertError } = await supabase
      .from('business_pages')
      .insert({
        business_id: businessId,
        html_content: htmlContent,
        metadata: {
          generated_at: new Date().toISOString(),
          template_version: '1.0',
          page_type: 'permanent_business_page'
        },
        version: 1
      });

    if (insertError) {
      console.error('Failed to store business page:', insertError);
      return { success: false, error: 'Failed to store generated page' };
    }

    // Update business to mark permanent page as generated
    const { error: updateError } = await supabase
      .from('businesses')
      .update({ permanent_page_generated: true })
      .eq('id', businessId);

    if (updateError) {
      console.error('Failed to update business permanent_page_generated flag:', updateError);
      // Don't fail the whole operation for this
    }

    const pageUrl = `https://locraven.com${business.permanent_page_path}`;
    console.log(`Successfully generated business page: ${pageUrl}`);
    
    return { success: true, pageUrl };

  } catch (error) {
    console.error('Error generating business page:', error);
    return { success: false, error: error.message || 'Unknown error occurred' };
  }
}

// Main handler
serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return handleCors(req);
  }

  try {
    const supabase = createSupabaseClient(req);
    const { business_id } = await req.json();

    if (!business_id) {
      return errorResponse('business_id is required', 400);
    }

    const result = await generateBusinessPage(supabase, business_id);

    if (result.success) {
      return successResponse({ 
        message: 'Business page generated successfully',
        page_url: result.pageUrl 
      });
    } else {
      return errorResponse(result.error || 'Failed to generate business page', 500);
    }

  } catch (error) {
    console.error('Function error:', error);
    return errorResponse('Internal server error', 500);
  }
});