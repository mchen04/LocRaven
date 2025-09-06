'use server';

import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';

interface OnboardingResult {
  success: boolean;
  error?: string;
  permanentPageUrl?: string;
}

function generateCityStateSlug(city: string, state: string): string {
  // Create city-state slug (e.g., "dublin-ca")
  const citySlug = city.toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  
  const stateSlug = state.toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  return `${citySlug}-${stateSlug}`;
}

function generateUrlSlug(businessName: string): string {
  // Create URL-safe slug from business name only
  return businessName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

export async function completeOnboarding(userEmail: string): Promise<OnboardingResult> {
  try {
    const supabase = await createSupabaseServerClient();

    // Get the current business profile
    const { data: business, error: fetchError } = await supabase
      .from('businesses')
      .select('*')
      .eq('email', userEmail)
      .single();

    if (fetchError || !business) {
      return {
        success: false,
        error: 'Business profile not found. Please save your profile first.'
      };
    }

    // Check if already onboarded
    if (business.is_onboarded) {
      return {
        success: true,
        permanentPageUrl: business.city_state_slug && business.url_slug ? 
          `https://locraven.com/${business.city_state_slug}/${business.url_slug}` : undefined
      };
    }

    // Validate required fields for onboarding
    if (!business.name || !business.address_city || !business.address_state) {
      return {
        success: false,
        error: 'Please complete all required fields: business name, city, and state.'
      };
    }

    // Generate new URL structure slugs
    const cityStateSlug = generateCityStateSlug(
      business.address_city,
      business.address_state
    );
    
    const urlSlug = generateUrlSlug(business.name);

    // Update business with onboarding completion and new URL structure
    const { error: updateError } = await supabase
      .from('businesses')
      .update({
        is_onboarded: true,
        onboarded_at: new Date().toISOString(),
        city_state_slug: cityStateSlug,
        url_slug: urlSlug
      })
      .eq('id', business.id);

    if (updateError) {
      console.error('Failed to update business onboarding status:', updateError);
      return {
        success: false,
        error: 'Failed to complete onboarding. Please try again.'
      };
    }

    // Trigger business page generation via Edge Function with new URL structure
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-business-page`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({ 
          business_id: business.id,
          use_new_url_structure: true,
          feature_flags: {
            new_url_structure: true
          }
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error('Failed to generate business page:', result);
        // Don't fail onboarding if page generation fails
      } else {
        console.log('Business page generated successfully:', result.page_url);
      }
    } catch (error) {
      console.error('Error calling generate-business-page function:', error);
      // Don't fail onboarding if page generation fails
    }
    
    const permanentPageUrl = `https://locraven.com/${cityStateSlug}/${urlSlug}`;

    return {
      success: true,
      permanentPageUrl
    };

  } catch (error) {
    console.error('Onboarding completion error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during onboarding.'
    };
  }
}