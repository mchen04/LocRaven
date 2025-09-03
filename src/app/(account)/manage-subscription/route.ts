import { NextResponse } from 'next/server';

import { getAuthUser } from '@/features/account/controllers/get-auth-user';
import { getCustomerId } from '@/features/account/controllers/get-customer-id';
import { stripeAdmin } from '@/libs/stripe/stripe-admin';
import { getURL } from '@/utils/get-url';

export const dynamic = 'force-dynamic';

export async function GET() {
  // 1. Get the authenticated user
  const user = await getAuthUser();

  if (!user || !user.id) {
    throw Error('Could not get userId');
  }

  // 2. Retrieve or create the customer in Stripe
  const customer = await getCustomerId({
    userId: user.id,
  });

  if (!customer) {
    throw Error('Could not get customer');
  }

  // 3. Create portal link and redirect user
  const { url } = await stripeAdmin.billingPortal.sessions.create({
    customer,
    return_url: `${getURL()}/account`,
  });

  return NextResponse.redirect(url);
}
