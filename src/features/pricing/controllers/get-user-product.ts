import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';
import { Tables } from '@/libs/supabase/types';

export type Product = Tables<'products'>;
export type Price = Tables<'prices'>;

export interface ProductWithPrices extends Product {
  prices: Price[];
}

export async function getUserCurrentProduct(subscription: any): Promise<{ product: ProductWithPrices | null; price: Price | null }> {
  if (!subscription?.price_id) {
    return { product: null, price: null };
  }

  try {
    const supabase = await createSupabaseServerClient();

    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        prices (*)
      `)
      .eq('active', true);

    if (error || !products) {
      return { product: null, price: null };
    }

    // Find the product that contains the user's price
    for (const product of products as ProductWithPrices[]) {
      const userPrice = product.prices?.find(price => price.id === subscription.price_id);
      if (userPrice) {
        return { product, price: userPrice };
      }
    }

    return { product: null, price: null };
  } catch (error) {
    console.error('Error getting user product:', error);
    return { product: null, price: null };
  }
}