import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';
import { Tables } from '@/libs/supabase/types';

export type BusinessProfile = Tables<'businesses'>;

export async function getBusinessProfile(businessId?: string): Promise<BusinessProfile | null> {
  const supabase = await createSupabaseServerClient();

  if (!businessId) {
    // Get current user's business
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return null;
    }

    if (!user.email) {
      console.error('User email not found');
      return null;
    }

    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('email', user.email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No business profile exists yet
      }
      console.error('Error fetching business profile:', error);
      return null;
    }

    return data;
  } else {
    // Get specific business by ID
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single();

    if (error) {
      console.error('Error fetching business profile:', error);
      return null;
    }

    return data;
  }
}