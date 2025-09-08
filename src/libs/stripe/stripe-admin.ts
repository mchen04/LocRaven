import Stripe from 'stripe';

import { getEnvVar, getEnvVarCompat } from '@/utils/get-env-var';

let _stripeAdmin: Stripe | null = null;

export function getStripeAdmin(): Stripe {
  if (!_stripeAdmin) {
    console.log('[stripeAdmin] Initializing Stripe client...');
    
    try {
      // Try standard method first
      const secretKey = getEnvVar(process.env.STRIPE_SECRET_KEY, 'STRIPE_SECRET_KEY');
      
      _stripeAdmin = new Stripe(secretKey, {
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
      
      console.log('[stripeAdmin] Stripe client initialized successfully');
      
    } catch (error) {
      console.error('[stripeAdmin] Standard initialization failed:', error);
      
      try {
        // Fallback to compatibility method
        console.log('[stripeAdmin] Attempting compatibility mode initialization...');
        const secretKey = getEnvVarCompat('STRIPE_SECRET_KEY');
        
        _stripeAdmin = new Stripe(secretKey, {
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
        
        console.log('[stripeAdmin] Stripe client initialized via compatibility mode');
        
      } catch (compatError) {
        console.error('[stripeAdmin] Compatibility mode also failed:', compatError);
        throw new Error(`Failed to initialize Stripe client: ${compatError instanceof Error ? compatError.message : 'Unknown error'}`);
      }
    }
  }
  return _stripeAdmin;
}

// For backward compatibility - proxy all Stripe methods to lazy-loaded instance
export const stripeAdmin = new Proxy({} as Stripe, {
  get(target, prop) {
    try {
      console.log(`[stripeAdmin] Accessing Stripe method: ${String(prop)}`);
      return getStripeAdmin()[prop as keyof Stripe];
    } catch (error) {
      console.error(`[stripeAdmin] Error accessing Stripe method ${String(prop)}:`, error);
      throw error;
    }
  }
});
