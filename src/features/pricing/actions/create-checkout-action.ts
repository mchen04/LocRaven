'use server';

import { redirect } from 'next/navigation';

import { getAuthUser } from '@/features/account/controllers/get-auth-user';
import { getOrCreateCustomer } from '@/features/account/controllers/get-or-create-customer';
import { Price } from '@/features/pricing/types';
import { stripeAdmin } from '@/libs/stripe/stripe-admin';
import { getURL } from '@/utils/get-url';

export async function createCheckoutAction({ price }: { price: Price }) {
  // 1. Get the authenticated user
  const user = await getAuthUser();

  if (!user) {
    // @ts-expect-error - Next.js redirect type issue with dynamic URLs
    return redirect(`${getURL()}/signup`);
  }

  if (!user.email) {
    throw Error('Could not get email');
  }

  // 2. Retrieve or create the customer in Stripe
  const customer = await getOrCreateCustomer({
    userId: user.id,
    email: user.email,
  });

  // 3. Create a checkout session in Stripe
  const checkoutSession = await stripeAdmin.checkout.sessions.create({
    payment_method_types: ['card'],
    billing_address_collection: 'required',
    customer,
    customer_update: {
      address: 'auto',
    },
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
    mode: price.type === 'recurring' ? 'subscription' : 'payment',
    allow_promotion_codes: true,
    success_url: `${getURL()}/onboarding`,
    cancel_url: `${getURL()}/`,
  });

  if (!checkoutSession || !checkoutSession.url) {
    throw Error('checkoutSession is not defined');
  }

  // 4. Redirect to checkout url
  // @ts-expect-error - Next.js redirect type issue with external URLs
  redirect(checkoutSession.url);
}
