import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';

export async function getCurrentBusiness() {
  const supabase = await createSupabaseServerClient();

  // First get the current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    console.error('Auth error:', authError);
    return null;
  }

  // Get business profile associated with this user's email
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
    // If no business exists yet, return null (not an error)
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching business:', error);
    return null;
  }

  return data;
}