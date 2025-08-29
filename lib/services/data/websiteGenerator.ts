import { supabase } from '../../utils/supabase';
import type { WebsiteInfo } from '../ai/geminiApi';
import { config } from '../../utils/config';

export interface GeneratedWebsite {
  id: string;
  url: string;
  title: string;
  page_type: string;
  created_at: string;
  business_id?: string;
  update_id?: string;
}

// Helper to slugify text for URLs
function slugify(text: string | null | undefined): string {
  if (!text || text.trim() === '') {
    return 'business';
  }
  
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50); // Limit length
}


// Parse location into components
function parseLocation(location: string | null | undefined): { city: string; state: string; country: string } {
  if (!location || location.trim() === '') {
    return {
      city: 'Unknown',
      state: 'XX',
      country: 'US'
    };
  }
  
  const parts = location.split(',').map(p => p.trim());
  
  // Handle various formats
  if (parts.length === 2) {
    // "Austin, TX" format
    return {
      city: parts[0] || 'Unknown',
      state: (parts[1] || 'XX').toUpperCase(),
      country: 'US'
    };
  } else if (parts.length === 3) {
    // "Austin, TX, USA" format
    return {
      city: parts[0] || 'Unknown',
      state: (parts[1] || 'XX').toUpperCase(),
      country: parts[2]?.toUpperCase() === 'USA' ? 'US' : (parts[2] || 'US').toUpperCase()
    };
  }
  
  // Fallback
  return {
    city: location || 'Unknown',
    state: 'XX',
    country: 'US'
  };
}

// Generate initial business profile page when user creates account
export async function generateInitialBusinessPage(business: any): Promise<GeneratedWebsite | null> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Create initial update record
    const initialContent = `Welcome to ${business.name}! We're now discoverable on LocRaven and ready to share updates with AI search engines like ChatGPT, Perplexity, and Claude.`;
    
    const { data: updateRecord, error: updateError } = await supabase
      .from('updates')
      .insert({
        business_id: business.id,
        content_text: initialContent,
        status: 'processing',
        ai_provider: 'system'
      })
      .select()
      .single();

    if (updateError) throw updateError;

    // Generate URL components
    const locationParts = parseLocation(`${business.address_city}, ${business.address_state}`);
    const businessSlug = slugify(business.name);
    const countryCode = (business.country || 'us').toLowerCase();
    const stateCode = locationParts.state.toLowerCase();
    const citySlug = slugify(locationParts.city);
    
    // Create main business profile page
    const filePath = `/${countryCode}/${stateCode}/${citySlug}/${businessSlug}`;
    const title = `${business.name} - ${business.primary_category || 'Local Business'} in ${business.address_city}, ${business.address_state}`;
    
    // Use the new business profile Edge Function for reliable server-side generation
    const { data: result, error: edgeError } = await supabase.functions.invoke('generate-business-profile', {
      body: {
        businessId: business.id,
        updateId: updateRecord.id
      }
    });
    
    if (edgeError) {
      console.error('❌ Business profile generation failed:', edgeError);
      throw edgeError;
    }
    
    if (!result || !result.success) {
      console.error('❌ Business profile generation failed:', result);
      throw new Error('Business profile generation failed');
    }
    
    
    // Get the created page from database
    const { data: page, error: pageError } = await supabase
      .from('generated_pages')
      .select('*')
      .eq('business_id', business.id)
      .eq('page_type', 'business')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (pageError) {
      console.error('Error fetching created page:', pageError);
      return null;
    }
    
    
    // Static file serving now handled by Cloudflare Pages CDN

    // Update the status to completed
    await supabase
      .from('updates')
      .update({ 
        status: 'completed',
        processing_time_ms: Date.now() - new Date(updateRecord.created_at).getTime()
      })
      .eq('id', updateRecord.id);

    if (page) {
      // Note: Storage backup temporarily disabled while investigating Edge Function 500 errors
      // Page creation works perfectly from database - storage backup is non-critical
      
      const cleanUrl = `${config.env.appUrl}${page.file_path}`;
      
      return {
        id: page.id,
        url: cleanUrl,
        title: page.title,
        page_type: page.page_type || 'business',
        created_at: page.created_at,
        business_id: page.business_id,
        update_id: page.update_id
      };
    }
    
    return null;

  } catch (error) {
    console.error('Error generating initial business page:', error);
    return null;
  }
}

export async function generateWebsite(websiteInfo: WebsiteInfo): Promise<GeneratedWebsite[]> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Check if business profile exists or create one
    let businessId: string;
    const { data: existingBusiness } = await supabase
      .from('businesses')
      .select('id')
      .eq('email', user.email)
      .single();

    if (existingBusiness) {
      businessId = existingBusiness.id;
      
      // Update business info if needed
      const locationParts = parseLocation(websiteInfo.location);
      await supabase
        .from('businesses')
        .update({
          name: websiteInfo.businessName,
          primary_category: websiteInfo.businessType,
          address_city: locationParts.city,
          address_state: locationParts.state,
          country: locationParts.country,
          services: websiteInfo.services || [],
          base_hours: websiteInfo.hours || {},
          updated_at: new Date().toISOString()
        })
        .eq('id', businessId);
    } else {
      // Create new business profile
      const locationParts = parseLocation(websiteInfo.location);
      const { data: newBusiness, error: bizError } = await supabase
        .from('businesses')
        .insert({
          email: user.email,
          name: websiteInfo.businessName,
          primary_category: websiteInfo.businessType,
          address_street: websiteInfo.contactInfo?.address || '',
          address_city: locationParts.city,
          address_state: locationParts.state,
          country: locationParts.country,
          zip_code: '',
          phone: websiteInfo.contactInfo?.phone || '',
          website: '',
          services: websiteInfo.services || [],
          base_hours: websiteInfo.hours || {},
          slug: slugify(websiteInfo.businessName),
          preview_mode_enabled: false
        })
        .select()
        .single();

      if (bizError) throw bizError;
      businessId = newBusiness.id;
    }

    // Create update record
    const { data: updateRecord, error: updateError } = await supabase
      .from('updates')
      .insert({
        business_id: businessId,
        content_text: websiteInfo.updateContent || `${websiteInfo.businessName} - ${websiteInfo.businessType} in ${websiteInfo.location}`,
        status: 'pending',
        ai_provider: 'gemini'
      })
      .select()
      .single();

    if (updateError) throw updateError;

    // Use NEW template-based edge function for page generation
    const { data: result, error: processError } = await supabase.functions
      .invoke('process-update-with-template', {
        body: {
          updateId: updateRecord.id,
          businessId: businessId,
          contentText: websiteInfo.updateContent || `${websiteInfo.businessName} - ${websiteInfo.businessType} in ${websiteInfo.location}`
        }
      });

    if (processError) {
      console.error('AI-optimized function error:', processError);
      throw processError;
    }

    // Return results from NEW template-based function (single page)
    return [{
      id: `template-${Date.now()}`,
      url: `${config.env.appUrl}${result.url}`,
      title: result.title,
      page_type: 'update',
      created_at: new Date().toISOString(),
      business_id: businessId,
      update_id: updateRecord.id
    }];

  } catch (error) {
    console.error('Error generating website:', error);
    throw error;
  }
}

