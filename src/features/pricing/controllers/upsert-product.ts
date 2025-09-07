import Stripe from 'stripe';

import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';
import type { Database } from '@/libs/supabase/types';

type Product = Database['public']['Tables']['products']['Row'];

export async function upsertProduct(product: Stripe.Product) {
  const productData: Product = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? null,
    image: product.images?.[0] ?? null,
    metadata: product.metadata,
    created: new Date(product.created * 1000).toISOString(),
    updated: new Date().toISOString(),
  };

  const { error } = await supabaseAdminClient.from('products').upsert([productData]);

  if (error) {
    throw error;
  } else {
    // Product inserted/updated - consider proper logging service
  }
}
