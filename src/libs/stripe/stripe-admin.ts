import Stripe from 'stripe';

import { getEnvVar } from '@/utils/get-env-var';

let _stripeAdmin: Stripe | null = null;

export function getStripeAdmin(): Stripe {
  if (!_stripeAdmin) {
    _stripeAdmin = new Stripe(getEnvVar(process.env.STRIPE_SECRET_KEY, 'STRIPE_SECRET_KEY'), {
      // https://github.com/stripe/stripe-node#configuration
      apiVersion: '2025-02-24.acacia',
      // Register this as an official Stripe plugin.
      // https://stripe.com/docs/building-plugins#setappinfo
      appInfo: {
        name: 'LocRaven',
        version: '0.1.0',
      },
    });
  }
  return _stripeAdmin;
}

// For backward compatibility - proxy all Stripe methods to lazy-loaded instance
export const stripeAdmin = new Proxy({} as Stripe, {
  get(target, prop) {
    return getStripeAdmin()[prop as keyof Stripe];
  }
});
