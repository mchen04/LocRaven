import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';
import { stripeAdmin } from '@/libs/stripe/stripe-admin';
import { getAuthUser } from './get-auth-user';

/**
 * 2025 Data Access Layer: Comprehensive subscription status checker
 * Handles webhook timing delays with Checkout Session validation
 * For use in controllers and server actions only (not middleware)
 */
export async function hasActiveSubscription(): Promise<boolean> {
  try {
    const user = await getAuthUser();
    
    if (!user?.id) {
      return false;
    }

    const supabase = await createSupabaseServerClient();

    // Method 1: Check subscription records (primary)
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('id, status')
      .eq('user_id', user.id)
      .or('status.eq.trialing,status.eq.active')
      .is('canceled_at', null)
      .limit(1)
      .maybeSingle();

    if (subscription) {
      return true;
    }

    // Method 2: Check recent Checkout Sessions (handles webhook delays)
    const { data: customer } = await supabase
      .from('customers')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (customer?.stripe_customer_id) {
      // Check for recent successful checkout sessions
      const sessions = await stripeAdmin.checkout.sessions.list({
        customer: customer.stripe_customer_id,
        status: 'complete',
        limit: 5,
      });

      // Check if any session from last 10 minutes indicates subscription
      const recentSessionCutoff = Date.now() - (10 * 60 * 1000); // 10 minutes ago
      const hasRecentSubscriptionSession = sessions.data.some(session => 
        session.mode === 'subscription' && 
        (session.created * 1000) > recentSessionCutoff
      );

      if (hasRecentSubscriptionSession) {
        return true;
      }
    }

    return false;

  } catch (error) {
    // On error, assume no subscription to be safe
    return false;
  }
}

/**
 * Check if user has completed business onboarding
 * Data Access Layer function for secure business status checking
 */
export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    const user = await getAuthUser();
    
    if (!user?.email) {
      return false;
    }

    const supabase = await createSupabaseServerClient();
    
    const { data: business } = await supabase
      .from('businesses')
      .select('is_onboarded')
      .eq('email', user.email)
      .single();
    
    return !!(business?.is_onboarded);

  } catch (error) {
    return false;
  }
}

/**
 * Require active subscription for protected operations
 * Data Access Layer guard function
 */
export async function requireActiveSubscription(): Promise<void> {
  const hasSubscription = await hasActiveSubscription();
  
  if (!hasSubscription) {
    throw new Error('Active subscription required. Please subscribe to continue.');
  }
}

/**
 * Get subscription with comprehensive fallback checking  
 * Includes both database records and recent Checkout Sessions
 */
export async function getSubscriptionWithFallback() {
  const user = await getAuthUser();
  
  if (!user?.id) {
    return null;
  }

  const supabase = await createSupabaseServerClient();

  // Try to get subscription from database first
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .eq('user_id', user.id)
    .or('status.eq.trialing,status.eq.active')
    .is('canceled_at', null)
    .order('created', { ascending: false })
    .maybeSingle();

  if (subscription) {
    return subscription;
  }

  // If no subscription record, check if recent payment is processing
  const hasRecentPayment = await hasActiveSubscription(); // Uses checkout session fallback
  
  if (hasRecentPayment) {
    // Return minimal subscription info indicating processing state
    return {
      id: 'processing',
      status: 'processing',
      user_id: user.id,
      processing: true,
      message: 'Subscription is being processed. Please wait a moment.',
    };
  }

  return null;
}