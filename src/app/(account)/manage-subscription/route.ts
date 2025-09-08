import { NextResponse } from 'next/server';

import { getAuthUser } from '@/features/account/controllers/get-auth-user';
import { getCustomerId } from '@/features/account/controllers/get-customer-id';
import { stripeAdmin } from '@/libs/stripe/stripe-admin';
import { getURL } from '@/utils/get-url';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Get the authenticated user
    const user = await getAuthUser();

    if (!user || !user.id) {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      );
    }

    // 2. Retrieve or create the customer in Stripe
    const customer = await getCustomerId({
      userId: user.id,
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' }, 
        { status: 404 }
      );
    }

    // 3. Create portal link and redirect user
    const { url } = await stripeAdmin.billingPortal.sessions.create({
      customer,
      return_url: `${getURL()}/account`,
    });

    return NextResponse.redirect(url);

  } catch (error) {
    console.error('[/manage-subscription] Error:', error instanceof Error ? error.message : 'Unknown error');

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
