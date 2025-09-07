import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

export async function getCustomerId({ userId }: { userId: string }) {
  const { data, error } = await supabaseAdminClient
    .from('customers')
    .select('stripe_customer_id')
    .eq('id', userId as any)
    .single();

  if (error) {
    throw new Error('Error fetching stripe_customer_id');
  }

  return (data as any).stripe_customer_id;
}
