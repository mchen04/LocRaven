import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';

export async function getProducts() {
  const supabase = await createSupabaseServerClient();

  // Only show these specific product IDs (Basic, Professional, Enterprise)
  const allowedProductIds = [
    'prod_T1kSCZZQ3GWfg2', // Basic
    'prod_T1kSa9lueUC1NV', // Professional  
    'prod_T1kSfmegY2kBXH'  // Enterprise
  ];

  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .in('id', allowedProductIds)
    .order('metadata->index')
    .order('unit_amount', { referencedTable: 'prices' });

  if (error) {
    console.error('Products table error:', error.message);
    // Return empty array if products table doesn't exist yet
    return [];
  }

  return data ?? [];
}
