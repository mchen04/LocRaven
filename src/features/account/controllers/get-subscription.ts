import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';
import { getAuthUser } from './get-auth-user';

export async function getSubscription() {
  // First, ensure user is authenticated
  const user = await getAuthUser();
  
  if (!user) {
    console.warn('getSubscription: No authenticated user found');
    return null;
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .eq('user_id', user.id)
    .in('status', ['trialing', 'active'])
    .is('canceled_at', null)
    .order('created', { ascending: false })
    .maybeSingle();

  if (error) {
    console.error('getSubscription error:', {
      error,
      userId: user.id,
      hasUser: !!user,
      errorType: typeof error,
      errorKeys: Object.keys(error || {})
    });
    return null;
  }

  return data;
}
