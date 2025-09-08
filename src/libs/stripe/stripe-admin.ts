import Stripe from 'stripe';
import { getEnvVar, getEnvVarCompat } from '@/utils/get-env-var';

let _stripeAdmin: Stripe | null = null;

// Create Stripe instance with CF Workers optimizations
function createStripeInstance(): Stripe {
  try {
    const secretKey = getEnvVar(process.env.STRIPE_SECRET_KEY, 'STRIPE_SECRET_KEY');
    
    return new Stripe(secretKey, {
      // Cloudflare Workers compatibility: use fetch-based HTTP client
      httpClient: Stripe.createFetchHttpClient(),
      // https://github.com/stripe/stripe-node#configuration
      apiVersion: '2025-02-24.acacia',
      // Workers-specific timeout configuration
      timeout: 30000, // 30 seconds for Workers environment
      maxNetworkRetries: 3,
      // Register this as an official Stripe plugin.
      // https://stripe.com/docs/building-plugins#setappinfo
      appInfo: {
        name: 'LocRaven',
        version: '0.1.0',
      },
    });
    
  } catch (error) {
    // Fallback to compatibility method
    const secretKey = getEnvVarCompat('STRIPE_SECRET_KEY');
    
    return new Stripe(secretKey, {
      // Cloudflare Workers compatibility: use fetch-based HTTP client
      httpClient: Stripe.createFetchHttpClient(),
      apiVersion: '2025-02-24.acacia',
      // Workers-specific timeout configuration
      timeout: 30000, // 30 seconds for Workers environment
      maxNetworkRetries: 3,
      appInfo: {
        name: 'LocRaven',
        version: '0.1.0',
      },
    });
  }
}

export function getStripeAdmin(): Stripe {
  if (!_stripeAdmin) {
    _stripeAdmin = createStripeInstance();
  }
  return _stripeAdmin;
}

// For backward compatibility - proxy all Stripe methods to lazy-loaded instance
export const stripeAdmin = new Proxy({} as Stripe, {
  get(target, prop) {
    return getStripeAdmin()[prop as keyof Stripe];
  }
});
