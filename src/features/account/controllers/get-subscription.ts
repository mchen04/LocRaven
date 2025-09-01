import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';
import { getSession } from './get-session';

export async function getSubscription() {
  // First, ensure user is authenticated
  const session = await getSession();
  
  if (!session) {
    console.warn('getSubscription: No authenticated session found');
    return null;
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .eq('user_id', session.user.id)
    .in('status', ['trialing', 'active'])
    .is('canceled_at', null)
    .order('created', { ascending: false })
    .maybeSingle();

  if (error) {
    console.error('getSubscription error:', {
      error,
      userId: session.user.id,
      hasSession: !!session,
      errorType: typeof error,
      errorKeys: Object.keys(error || {})
    });
    return null;
  }

  return data;
}
