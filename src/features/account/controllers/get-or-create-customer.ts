import { stripeAdmin } from '@/libs/stripe/stripe-admin';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

export async function getOrCreateCustomer({ userId, email }: { userId: string; email: string }) {
  const { data, error } = await supabaseAdminClient
    .from('customers')
    .select('stripe_customer_id')
    .eq('id', userId as any)
    .single();

  if (error || !(data as any)?.stripe_customer_id) {
    // No customer record found, let's create one.
    const customerData = {
      email,
      metadata: {
        userId,
      },
    } as const;

    const customer = await stripeAdmin.customers.create(customerData);

    // Insert the customer ID into our Supabase mapping table.
    const { error: supabaseError } = await supabaseAdminClient
      .from('customers')
      .insert([{ id: userId, stripe_customer_id: customer.id } as any]);

    if (supabaseError) {
      throw supabaseError;
    }

    return customer.id;
  }

  return (data as any).stripe_customer_id;
}
