import { NextResponse } from 'next/server';

import { getAuthUser } from '@/features/account/controllers/get-auth-user';
import { getCustomerId } from '@/features/account/controllers/get-customer-id';
import { stripeAdmin } from '@/libs/stripe/stripe-admin';
import { getURL } from '@/utils/get-url';

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log('[/manage-subscription] Route called');
  
  try {
    // 1. Get the authenticated user
    console.log('[/manage-subscription] Getting authenticated user...');
    const user = await getAuthUser();

    console.log('[/manage-subscription] User result:', user ? { id: user.id, email: user.email } : 'null');

    if (!user || !user.id) {
      console.error('[/manage-subscription] No user or user ID found');
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      );
    }

    // 2. Retrieve or create the customer in Stripe
    console.log('[/manage-subscription] Getting customer ID for user:', user.id);
    const customer = await getCustomerId({
      userId: user.id,
    });

    console.log('[/manage-subscription] Customer ID result:', customer);

    if (!customer) {
      console.error('[/manage-subscription] No customer ID found for user:', user.id);
      return NextResponse.json(
        { error: 'Customer not found' }, 
        { status: 404 }
      );
    }

    // 3. Create portal link and redirect user
    console.log('[/manage-subscription] Creating Stripe portal session for customer:', customer);
    const returnUrl = `${getURL()}/account`;
    console.log('[/manage-subscription] Return URL:', returnUrl);
    
    const { url } = await stripeAdmin.billingPortal.sessions.create({
      customer,
      return_url: returnUrl,
    });

    console.log('[/manage-subscription] Stripe portal URL created:', url);
    return NextResponse.redirect(url);

  } catch (error) {
    console.error('[/manage-subscription] Error occurred:', error);
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error('[/manage-subscription] Error name:', error.name);
      console.error('[/manage-subscription] Error message:', error.message);
      console.error('[/manage-subscription] Error stack:', error.stack);
    }

    // Log environment variable availability for diagnostics
    console.log('[/manage-subscription] Environment diagnostics:');
    console.log('- STRIPE_SECRET_KEY available:', !!process.env.STRIPE_SECRET_KEY);
    console.log('- SUPABASE_SERVICE_ROLE_KEY available:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    console.log('- NEXT_PUBLIC_SUPABASE_URL available:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY available:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}
