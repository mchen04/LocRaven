'use server';

import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';

interface OnboardingResult {
  success: boolean;
  error?: string;
  permanentPageUrl?: string;
}

function generateBusinessSlug(businessName: string, city: string, state: string): string {
  // Create URL-safe slug from business name
  const baseSlug = businessName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

  // Add location context to ensure uniqueness
  const locationSlug = `${city}-${state}`.toLowerCase().replace(/\s+/g, '-');
  
  return `${baseSlug}-${locationSlug}`;
}

function generatePermanentPagePath(businessSlug: string, city: string, state: string, country = 'us'): string {
  const normalizedCity = city.toLowerCase().replace(/\s+/g, '-');
  const normalizedState = state.toLowerCase().replace(/\s+/g, '-');
  
  return `/${country}/${normalizedState}/${normalizedCity}/${businessSlug}`;
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
        permanentPageUrl: business.permanent_page_path ? 
          `https://locraven.com${business.permanent_page_path}` : undefined
      };
    }

    // Validate required fields for onboarding
    if (!business.name || !business.address_city || !business.address_state) {
      return {
        success: false,
        error: 'Please complete all required fields: business name, city, and state.'
      };
    }

    // Generate permanent page slug and path
    const permanentSlug = generateBusinessSlug(
      business.name,
      business.address_city,
      business.address_state
    );
    
    const permanentPath = generatePermanentPagePath(
      permanentSlug,
      business.address_city,
      business.address_state,
      business.country || 'us'
    );

    // Update business with onboarding completion
    const { error: updateError } = await supabase
      .from('businesses')
      .update({
        is_onboarded: true,
        onboarded_at: new Date().toISOString(),
        permanent_page_slug: permanentSlug,
        permanent_page_path: permanentPath,
        permanent_page_generated: false // Will be set to true after page generation
      })
      .eq('id', business.id);

    if (updateError) {
      console.error('Failed to update business onboarding status:', updateError);
      return {
        success: false,
        error: 'Failed to complete onboarding. Please try again.'
      };
    }

    // Trigger permanent page generation via Edge Function
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-business-page`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({ business_id: business.id }),
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
    
    const permanentPageUrl = `https://locraven.com${permanentPath}`;

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